"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAutoArimaModelToCpp = exports.convertAutoModelCppModel = exports.convertSarimaxModelToCpp = exports.convertSarimaxCppModel = void 0;
var _1 = require(".");
function convertSarimaxCppModel(cppModel) {
    // todo (cmartin) rename fields phi => autoRegressiveCoefficients
    var phi = new Array(cppModel.phi.size()).fill(0).map(function (_, id) { return cppModel.phi.get(id); });
    var theta = new Array(cppModel.theta.size()).fill(0).map(function (_, id) { return cppModel.theta.get(id); });
    var PHI = new Array(cppModel.PHI.size()).fill(0).map(function (_, id) { return cppModel.PHI.get(id); });
    var THETA = new Array(cppModel.THETA.size()).fill(0).map(function (_, id) { return cppModel.THETA.get(id); });
    var res = new Array(cppModel.res.size()).fill(0).map(function (_, id) { return cppModel.res.get(id); });
    return __assign(__assign({}, cppModel), { phi: phi, theta: theta, PHI: PHI, THETA: THETA, res: res });
}
exports.convertSarimaxCppModel = convertSarimaxCppModel;
function convertSarimaxModelToCpp(model) {
    var Module = _1.getArimaEmscriptenModule();
    var phi = new Module.DoubleVector();
    model.phi.forEach(function (x) { return phi.push_back(x); });
    var theta = new Module.DoubleVector();
    model.theta.forEach(function (x) { return theta.push_back(x); });
    var PHI = new Module.DoubleVector();
    model.PHI.forEach(function (x) { return PHI.push_back(x); });
    var THETA = new Module.DoubleVector();
    model.THETA.forEach(function (x) { return THETA.push_back(x); });
    var res = new Module.DoubleVector();
    model.res.forEach(function (x) { return res.push_back(x); });
    return __assign(__assign({}, model), { phi: phi, theta: theta, PHI: PHI, THETA: THETA, res: res });
}
exports.convertSarimaxModelToCpp = convertSarimaxModelToCpp;
function convertAutoModelCppModel(cppModel) {
    // todo (cmartin) rename fields phi => autoRegressiveCoefficients
    var phi = new Array(cppModel.phi.size()).fill(0).map(function (_, id) { return cppModel.phi.get(id); });
    var theta = new Array(cppModel.theta.size()).fill(0).map(function (_, id) { return cppModel.theta.get(id); });
    var PHI = new Array(cppModel.PHI.size()).fill(0).map(function (_, id) { return cppModel.PHI.get(id); });
    var THETA = new Array(cppModel.THETA.size()).fill(0).map(function (_, id) { return cppModel.THETA.get(id); });
    var res = new Array(cppModel.res.size()).fill(0).map(function (_, id) { return cppModel.res.get(id); });
    return __assign(__assign({}, cppModel), { phi: phi, theta: theta, PHI: PHI, THETA: THETA, res: res });
}
exports.convertAutoModelCppModel = convertAutoModelCppModel;
function convertAutoArimaModelToCpp(model) {
    var Module = _1.getArimaEmscriptenModule();
    var phi = new Module.DoubleVector();
    model.phi.forEach(function (x) { return phi.push_back(x); });
    var theta = new Module.DoubleVector();
    model.theta.forEach(function (x) { return theta.push_back(x); });
    var PHI = new Module.DoubleVector();
    model.PHI.forEach(function (x) { return PHI.push_back(x); });
    var THETA = new Module.DoubleVector();
    model.THETA.forEach(function (x) { return THETA.push_back(x); });
    var res = new Module.DoubleVector();
    model.res.forEach(function (x) { return res.push_back(x); });
    return __assign(__assign({}, model), { phi: phi, theta: theta, PHI: PHI, THETA: THETA, res: res });
}
exports.convertAutoArimaModelToCpp = convertAutoArimaModelToCpp;
