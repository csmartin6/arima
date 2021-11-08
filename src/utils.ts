/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */

import { ArimaEmscriptenModule, IArimaModelCpp, IDoubleVector } from "./emscripten-types";
import { IArimaModel } from "./types";

export function convertModelFromCpp(cppModel: IArimaModelCpp): IArimaModel {
    // todo (cmartin) rename fields phi => autoRegressiveCoefficients
    const phi = new Array(cppModel.phi.size()).fill(0).map((_, id) => cppModel.phi.get(id));
    const theta = new Array(cppModel.theta.size()).fill(0).map((_, id) => cppModel.theta.get(id));
    const PHI = new Array(cppModel.PHI.size()).fill(0).map((_, id) => cppModel.PHI.get(id));
    const THETA = new Array(cppModel.THETA.size()).fill(0).map((_, id) => cppModel.THETA.get(id));
    const res = new Array(cppModel.res.size()).fill(0).map((_, id) => cppModel.res.get(id));
    const ts = new Array(cppModel.ts.size()).fill(0).map((_, id) => cppModel.ts.get(id));
    const exog = new Array(cppModel.exog.size()).fill(0).map((_, id) => cppModel.exog.get(id));
    const vcov = new Array(cppModel.vcov.size()).fill(0).map((_, id) => cppModel.vcov.get(id));
    return {
        ...cppModel,
        phi,
        theta,
        PHI,
        THETA,
        res,
        ts,
        exog,
        vcov,
    };
}

export function convertModelToCpp(model: IArimaModel, module: ArimaEmscriptenModule): IArimaModelCpp {
    const phi: IDoubleVector = new (module.DoubleVector as any)();
    model.phi.forEach(x => phi.push_back(x));

    const theta: IDoubleVector = new (module.DoubleVector as any)();
    model.theta.forEach(x => theta.push_back(x));

    const PHI: IDoubleVector = new (module.DoubleVector as any)();
    model.PHI.forEach(x => PHI.push_back(x));

    const THETA: IDoubleVector = new (module.DoubleVector as any)();
    model.THETA.forEach(x => THETA.push_back(x));

    const res: IDoubleVector = new (module.DoubleVector as any)();
    model.res.forEach(x => res.push_back(x));

    const ts: IDoubleVector = new (module.DoubleVector as any)();
    model.ts.forEach(x => ts.push_back(x));

    const exog: IDoubleVector = new (module.DoubleVector as any)();
    model.exog.forEach(x => exog.push_back(x));

    const vcov: IDoubleVector = new (module.DoubleVector as any)();
    model.vcov.forEach(x => vcov.push_back(x));

    return {
        ...model,
        phi,
        theta,
        PHI,
        THETA,
        res,
        vcov,
        exog,
        ts,
    };
}
