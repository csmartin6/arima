import { getArimaEmscriptenModule } from ".";
import {IAutoArimaModelCpp, IDoubleVector, ISarimaxModelCpp } from "./emscripten-types";
import { IAutoArimaModel, ISarimaxModel  } from "./types";

export function convertSarimaxCppModel(cppModel: ISarimaxModelCpp): ISarimaxModel {
    // todo (cmartin) rename fields phi => autoRegressiveCoefficients
    const phi = new Array(cppModel.phi.size()).fill(0).map((_, id) => cppModel.phi.get(id))
    const theta= new Array(cppModel.theta.size()).fill(0).map((_, id) => cppModel.theta.get(id))
    const PHI = new Array(cppModel.PHI.size()).fill(0).map((_, id) => cppModel.PHI.get(id))
    const THETA = new Array(cppModel.THETA.size()).fill(0).map((_, id) => cppModel.THETA.get(id))
    const res = new Array(cppModel.res.size()).fill(0).map((_, id) => cppModel.res.get(id))
    return {
        ...cppModel,
        phi,
        theta,
        PHI,
        THETA,
        res,
    }
}

export function convertSarimaxModelToCpp(model: ISarimaxModel): ISarimaxModelCpp {
    const Module= getArimaEmscriptenModule()
    
    const phi: IDoubleVector = new (Module.DoubleVector as any)(); 
    model.phi.forEach(x => phi.push_back(x));
    
    const theta: IDoubleVector = new (Module.DoubleVector as any)(); 
    model.theta.forEach(x => theta.push_back(x));
    
    const PHI: IDoubleVector = new (Module.DoubleVector as any)(); 
    model.PHI.forEach(x => PHI.push_back(x));
    
    const THETA: IDoubleVector = new (Module.DoubleVector as any)(); 
    model.THETA.forEach(x => THETA.push_back(x));
    
    const res: IDoubleVector = new (Module.DoubleVector as any)(); 
    model.res.forEach(x => res.push_back(x));
    return {
        ...model,
        phi,
        theta,
        PHI,
        THETA,
        res,
    }
}

export function convertAutoModelCppModel(cppModel: IAutoArimaModelCpp): IAutoArimaModel {
    // todo (cmartin) rename fields phi => autoRegressiveCoefficients
    const phi = new Array(cppModel.phi.size()).fill(0).map((_, id) => cppModel.phi.get(id))
    const theta= new Array(cppModel.theta.size()).fill(0).map((_, id) => cppModel.theta.get(id))
    const PHI = new Array(cppModel.PHI.size()).fill(0).map((_, id) => cppModel.PHI.get(id))
    const THETA = new Array(cppModel.THETA.size()).fill(0).map((_, id) => cppModel.THETA.get(id))
    const res = new Array(cppModel.res.size()).fill(0).map((_, id) => cppModel.res.get(id))
    return {
        ...cppModel,
        phi,
        theta,
        PHI,
        THETA,
        res,
    }
}

export function convertAutoArimaModelToCpp(model: IAutoArimaModel): IAutoArimaModelCpp {
    const Module= getArimaEmscriptenModule()
    
    const phi: IDoubleVector = new (Module.DoubleVector as any)(); 
    model.phi.forEach(x => phi.push_back(x));
    
    const theta: IDoubleVector = new (Module.DoubleVector as any)(); 
    model.theta.forEach(x => theta.push_back(x));
    
    const PHI: IDoubleVector = new (Module.DoubleVector as any)(); 
    model.PHI.forEach(x => PHI.push_back(x));
    
    const THETA: IDoubleVector = new (Module.DoubleVector as any)(); 
    model.THETA.forEach(x => THETA.push_back(x));
    
    const res: IDoubleVector = new (Module.DoubleVector as any)(); 
    model.res.forEach(x => res.push_back(x));
    return {
        ...model,
        phi,
        theta,
        PHI,
        THETA,
        res,
    }
}