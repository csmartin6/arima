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
exports.getArima = exports.Arima = void 0;
// import createArimaModeler from "./wasm/native.js";
// export async function createInstance(module) {
//   return createArimaModeler(module);
// }
// // import Modules = require("./wasm/native.js");
// // import * as Module from "./wasm/native.js";
// // const bin = require('./wrapper/native.bin.js')
// const m = await createInstance({});
// // const m  = Module.instantiateWasm(); // Module({ wasmBinary: bin.data })
// // const m = Module
// import * as Module from "./wasm/native.js";
// import Module = require("./wasm/native.js");
var arima_emscripten_module_1 = __importDefault(require("./arima-emscripten-module"));
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
// const m = getArimaEmscriptenModule(); // Module({ wasmBinary: bin.data })
// // tslint:disable-next-line variable-name
// const _fit_sarimax = m.cwrap("fit_sarimax", "number", [
//     "array",
//     "array",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "boolean",
// ]);
// // tslint:disable-next-line variable-name
// const _predict_sarimax = m.cwrap("predict_sarimax", "number", ["number", "array", "array", "array", "number"]);
// // tslint:disable-next-line variable-name
// const _fit_autoarima = m.cwrap("fit_autoarima", "number", [
//     "array",
//     "array",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "boolean",
// ]);
// // tslint:disable-next-line variable-name
// const _predict_autoarima = m.cwrap("predict_autoarima", "number", ["number", "array", "array", "array", "number"]);
function uintify(arr) {
    return new Uint8Array(Float64Array.from(arr).buffer);
}
// function flat(arr: Array<ConcatArray<number>>) {
//     return [].concat.apply([], arr);
// }
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
// export function ARIMA(this: any) {
//     // Preserve the old functional API: ARIMA(ts, len, opts)
//     if (!(this instanceof ARIMA)) {
//         console.warn("Calling ARIMA as a function will be deprecated in the future");
//         return new ARIMA(arguments[2]).train(arguments[0]).predict(arguments[1]);
//     }
//     // A new, class API has opts as the only argument here: new ARIMA (opts)
//     const opts = arguments[0];
//     const o = Object.assign({}, defaults, opts.auto ? paramsAuto : params, opts);
//     if (Math.min(o.method, o.optimizer, o.p, o.d, o.q, o.P, o.D, o.Q, o.s) < 0) {
//         throw new Error("Model parameter can't be negative");
//     }
//     if (o.P + o.D + o.Q === 0) {
//         o.s = 0;
//     } else if (o.s === 0) {
//         o.P = o.D = o.Q = 0;
//     }
//     this.options = o;
// }
var Arima = /** @class */ (function () {
    function Arima(options) {
        this.nexog = 0;
        this.lin = 0;
        this.options = DEFAULT_OPTIONS;
        this.m = getArimaEmscriptenModule();
        // tslint:disable-next-line variable-name
        // private _fit_sarimax = this.m.cwrap("fit_sarimax", "number", [
        //     "array",
        //     "array",
        //     "number",
        //     "number",
        //     "number",
        //     "number",
        //     "number",
        //     "number",
        //     "number",
        //     "number",
        //     "number",
        //     "number",
        //     "number",
        //     "boolean",
        // ]);
        // tslint:disable-next-line variable-name
        this._predict_sarimax = this.m.cwrap("predict_sarimax", "number", ["number", "array", "array", "array", "number"]);
        // tslint:disable-next-line variable-name
        this._fit_autoarima = this.m.cwrap("fit_autoarima", "number", [
            "array",
            "array",
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
            "boolean",
        ]);
        // tslint:disable-next-line variable-name
        this._predict_autoarima = this.m.cwrap("predict_autoarima", "number", ["number", "array", "array", "array", "number"]);
        this.ts = uintify([]);
        this.exog = uintify([]);
        this.options = __assign(__assign({}, DEFAULT_OPTIONS), options);
    }
    Arima.prototype.train = function (ts, exog) {
        if (exog === void 0) { exog = []; }
        var o = this.options;
        if (o.transpose && Array.isArray(exog[0])) {
            exog = transpose(exog);
        }
        this.ts = uintify(prepare(ts));
        var tsVec = new this.m.DoubleVector();
        ts.forEach(function (x) { return tsVec.push_back(x); });
        var exogVec = new this.m.DoubleVector();
        this.exog = uintify(prepare(exog));
        this.lin = ts.length;
        this.nexog = exog.length > 0 ? (Array.isArray(exog[0]) ? exog.length : 1) : 0;
        // this.model = o.auto
        //     ? this._fit_autoarima(
        //           this.ts,
        //           this.exog,
        //           o.p,
        //           o.d,
        //           o.q,
        //           o.P,
        //           o.D,
        //           o.Q,
        //           o.s,
        //           this.nexog,
        //           this.lin,
        //           o.method,
        //           o.optimizer,
        //           o.approximation,
        //           o.search,
        //           o.verbose,
        //       )
        //     : this._fit_sarimax(
        //           this.ts,
        //           this.exog,
        //           o.p,
        //           o.d,
        //           o.q,
        //           o.P,
        //           o.D,
        //           o.Q,
        //           o.s,
        //           this.nexog,
        //           this.lin,
        //           o.method,
        //           o.optimizer,
        //           o.verbose,
        //       );
        this.model = o.auto
            ? this._fit_autoarima(this.ts, this.exog, o.p, o.d, o.q, o.P, o.D, o.Q, o.s, this.nexog, this.lin, o.method, o.optimizer, o.approximation, o.search, o.verbose)
            : this.m.test_sarimax_vector(tsVec, exogVec, o.p, o.d, o.q, o.P, o.D, o.Q, o.s, this.nexog, this.lin, o.method, o.optimizer, o.verbose);
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
        var addr = o.auto
            ? this._predict_autoarima(this.model, this.ts, this.exog, // old
            uintify(prepare(exog)), // new
            l)
            : this._predict_sarimax(this.model, this.ts, this.exog, // old
            uintify(prepare(exog)), // new
            l);
        return this.getResults(addr, l);
    };
    Arima.prototype.getResults = function (addr, l) {
        var res = [[], []];
        for (var i = 0; i < l * 2; i++) {
            res[i < l ? 0 : 1].push(this.m.HEAPF64[addr / Float64Array.BYTES_PER_ELEMENT + i]);
        }
        return res;
    };
    return Arima;
}());
exports.Arima = Arima;
// let singleton: Arima | undefined = undefined
// /**
//  * This is the top-level entrypoint for the quickjs-emscripten library.
//  * Get the root QuickJS API.
//  */
// export async function getArima(): Promise<Arima> {
//   await ready
//   if (!singleton) {
//     singleton = new QuickJS()
//   }
//   return singleton
// }
/**
 * Provides synchronous access to the QuickJS API once [[getQuickJS]] has resolved at
 * least once.
 * @throws If called before `getQuickJS` resolves.
 */
// export function getQuickJSSync(): QuickJS {
//   if (!singleton) {
//     throw new Error('QuickJS not initialized. Await getQuickJS() at least once.')
//   }
//   return
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
