"use strict";
/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArima = exports.Arima = exports.getArimaEmscriptenModule = void 0;
var arima_emscripten_module_1 = __importDefault(require("./arima-emscripten-module"));
var utils_1 = require("./utils");
var lodash_1 = require("lodash");
var ArimaModule = undefined;
var ready = arima_emscripten_module_1.default().then(function (loadedModule) {
    ArimaModule = loadedModule;
});
/**
 * @throws if not ready
 */
function getArimaEmscriptenModule() {
    if (!ArimaModule) {
        throw new Error('Arima WASM module not initialized. Either wait for `ready` or use getArima()');
    }
    return ArimaModule;
}
exports.getArimaEmscriptenModule = getArimaEmscriptenModule;
function uintify(arr) {
    return new Uint8Array(Float64Array.from(arr).buffer);
}
function transpose(arr) {
    // tslint:disable-next-line:no-shadowed-variable
    return arr[0].map(function (x, i) { return arr.map(function (x) { return x[i]; }); });
}
function prepare(arr) {
    var farr = arr; // flat(arr);
    for (var i = 0; i < farr.length - 2; i++) {
        if (isNaN(farr[i + 1])) {
            farr[i + 1] = farr[i];
        }
    }
    return farr;
}
var DEFAULT_OPTIONS = {
    p: 1,
    d: 0,
    q: 1,
    Q: 0,
    P: 0,
    D: 0,
    method: 0,
    optimizer: 6,
    s: 0,
    verbose: true,
    transpose: false,
    auto: false,
    approximation: 1,
    search: 1,
};
var Arima = /** @class */ (function () {
    function Arima(options) {
        this.nexog = 0;
        this.lin = 0;
        this.options = DEFAULT_OPTIONS;
        this.m = getArimaEmscriptenModule();
        this.ts = uintify([]);
        this.exog = uintify([]);
        this.options = __assign(__assign({}, DEFAULT_OPTIONS), options);
        this.tsArray = [];
        this.exogArray = [];
    }
    Arima.prototype.train = function (ts, exog) {
        if (exog === void 0) { exog = []; }
        var o = this.options;
        if (o.transpose && Array.isArray(exog[0])) {
            exog = transpose(exog);
        }
        this.tsArray = ts;
        this.exogArray = exog;
        this.ts = uintify(prepare(ts));
        // todo (cmartin) is this "as any" necessary
        var tsVec = new this.m.DoubleVector();
        ts.forEach(function (x) { return tsVec.push_back(x); });
        var exogVec = new this.m.DoubleVector();
        exog.forEach(function (x) { return exogVec.push_back(x); });
        this.exog = uintify(prepare(exog));
        this.lin = ts.length;
        this.nexog = exog.length > 0 ? (Array.isArray(exog[0]) ? exog.length : 1) : 0;
        if (o.auto) {
            var modelCpp = this.m.fit_autoarima(tsVec, exogVec, o.p, o.d, o.q, o.P, o.D, o.Q, o.s, this.nexog, this.lin, o.method, o.optimizer, o.approximation, o.search, o.verbose);
            this.model = utils_1.convertAutoModelCppModel(modelCpp);
        }
        else {
            var modelCpp = this.m.fit_sarimax(tsVec, exogVec, o.p, o.d, o.q, o.P, o.D, o.Q, o.s, this.nexog, this.lin, o.method, o.optimizer, o.verbose);
            this.model = utils_1.convertSarimaxCppModel(modelCpp);
        }
        return this;
    };
    Arima.prototype.fit = function (a) {
        return this.train(a);
    };
    Arima.prototype.predict = function (l, exog) {
        if (exog === void 0) { exog = []; }
        var o = this.options;
        if (o.transpose && Array.isArray(exog[0])) {
            exog = transpose(exog);
        }
        var tsVec = new this.m.DoubleVector();
        this.tsArray.forEach(function (x) { return tsVec.push_back(x); });
        var exogVec = new this.m.DoubleVector();
        this.exogArray.forEach(function (x) { return exogVec.push_back(x); });
        var newExogVec = new this.m.DoubleVector();
        exog.forEach(function (x) { return newExogVec.push_back(x); });
        if (this.model === undefined) {
            throw new Error("Cannot predict as model is undefined");
        }
        var result = (o.auto) ? this.m.predict_autoarima(utils_1.convertAutoArimaModelToCpp(this.model), tsVec, exogVec, // old
        newExogVec, // new
        l) : this.m.predict_sarimax(utils_1.convertSarimaxModelToCpp(this.model), tsVec, exogVec, // old
        newExogVec, // new
        l);
        var res = new Array(result.size()).fill(0).map(function (_, id) { return result.get(id); });
        var toReturn = lodash_1.chunk(res, l);
        return toReturn;
    };
    return Arima;
}());
exports.Arima = Arima;
var singleton = undefined;
function getArima(options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ready];
                case 1:
                    _a.sent();
                    if (!singleton) {
                        singleton = new Arima(options);
                    }
                    return [2 /*return*/, singleton];
            }
        });
    });
}
exports.getArima = getArima;
