"use strict";
/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
function add(x, y) {
    var z = x + y;
    return z;
}
function predictUsingArima() {
    return __awaiter(this, void 0, void 0, function () {
        var ts, arima, fittedArima, _a, pred, errors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ts = Array(24)
                        .fill(0)
                        .map(function (_, i) { return i + Math.random() / 5; });
                    return [4 /*yield*/, index_1.getArima({
                            p: 2,
                            d: 1,
                            q: 2,
                            verbose: false,
                        })];
                case 1:
                    arima = _b.sent();
                    fittedArima = arima.fit(ts);
                    console.log("fitterModel:", fittedArima.model);
                    _a = fittedArima.predict(12), pred = _a[0], errors = _a[1];
                    // eslint-disable-next-line no-console
                    console.log("errors: ", errors);
                    return [2 /*return*/, pred];
            }
        });
    });
}
describe("Dummy Tests", function () {
    test("Add", function () {
        expect(add(0, 1)).toEqual(1);
    });
    test("Construct Arima", function () { return __awaiter(void 0, void 0, void 0, function () {
        var predictions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, predictUsingArima()];
                case 1:
                    predictions = _a.sent();
                    expect(predictions.length).toEqual(12);
                    return [2 /*return*/];
            }
        });
    }); });
});
