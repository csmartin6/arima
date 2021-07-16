/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */


import ModuleLoader from './arima-emscripten-module'
import { ArimaEmscriptenModule, IDoubleVector } from './emscripten-types'
import { convertAutoArimaModelToCpp, convertAutoModelCppModel, convertSarimaxCppModel, convertSarimaxModelToCpp } from './utils'
import { chunk } from "lodash";
import { IAutoArimaModel, ISarimaxModel } from './types';

let ArimaModule: ArimaEmscriptenModule | undefined = undefined

const ready = ModuleLoader().then(loadedModule => {
    ArimaModule = loadedModule
  })

/**
 * @throws if not ready
 */
 export function getArimaEmscriptenModule(): ArimaEmscriptenModule {
    if (!ArimaModule) {
      throw new Error(
        'Arima WASM module not initialized. Either wait for `ready` or use getArima()'
      )
    }
    return ArimaModule
  }


function uintify(arr: Iterable<number>) {
    return new Uint8Array(Float64Array.from(arr).buffer);
}

function transpose(arr: any[]) {
    // tslint:disable-next-line:no-shadowed-variable
    return arr[0].map((x: any, i: string | number) => arr.map((x: { [x: string]: any }) => x[i]));
}

function prepare(arr: number[]) {
    const farr = arr; // flat(arr);
    for (let i = 0; i < farr.length - 2; i++) {
        if (isNaN(farr[i + 1])) {
            farr[i + 1] = farr[i];
        }
    }
    return farr;
}

export interface IOptions {
    p: number;
    d: number;
    q: number;
    Q: number;
    P: number;
    D: number;
    method: number;
    optimizer: number;
    s: number;
    verbose: boolean;
    transpose: boolean;
    auto: boolean;
    approximation: number;
    search: number;
}

const DEFAULT_OPTIONS = {
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

export class Arima {
    private ts: Uint8Array;
    private tsArray: number[];
    private exog: Uint8Array;
    private exogArray: number[];
    private nexog: number = 0;
    private lin: number = 0;
    private options: IOptions = DEFAULT_OPTIONS;
    public model?: ISarimaxModel | IAutoArimaModel;
    private m = getArimaEmscriptenModule()

    constructor(options: Partial<IOptions>) {
        this.ts = uintify([]);
        this.exog = uintify([]);
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.tsArray = [];
        this.exogArray = [];
    }

    

    public train(ts: number[], exog = []): Arima {
        const o = this.options;
        if (o.transpose && Array.isArray(exog[0])) {
            exog = transpose(exog);
        }
        this.tsArray = ts;
        this.exogArray = exog;
        this.ts = uintify(prepare(ts));
        // todo (cmartin) is this "as any" necessary
        const tsVec: IDoubleVector = new (this.m.DoubleVector as any)(); 
        ts.forEach((x) => tsVec.push_back(x));
        const exogVec: IDoubleVector = new (this.m.DoubleVector as any)(); 
        exog.forEach((x) => exogVec.push_back(x));

        this.exog = uintify(prepare(exog));
        this.lin = ts.length;
        this.nexog = exog.length > 0 ? (Array.isArray(exog[0]) ? exog.length : 1) : 0;
        if (o.auto) {
            const modelCpp = this.m.fit_autoarima(
                tsVec,
                exogVec,
                o.p,
                o.d,
                o.q,
                o.P,
                o.D,
                o.Q,
                o.s,
                this.nexog,
                this.lin,
                o.method,
                o.optimizer,
                o.approximation,
                o.search,
                o.verbose,
            )
            this.model = convertAutoModelCppModel(modelCpp)
            } else {
            const modelCpp = this.m.fit_sarimax(
                tsVec,
                exogVec,
                  o.p,
                  o.d,
                  o.q,
                  o.P,
                  o.D,
                  o.Q,
                  o.s,
                  this.nexog,
                  this.lin,
                  o.method,
                  o.optimizer,
                  o.verbose,
            )
              this.model = convertSarimaxCppModel(modelCpp)
        }
        
        return this;
    }

    public fit(a: number[]) {
        return this.train(a);
    }

    public predict(l: number, exog = []): number[][]{
        const o = this.options;
        if (o.transpose && Array.isArray(exog[0])) {
            exog = transpose(exog);
        }

        const tsVec: IDoubleVector = new (this.m.DoubleVector as any)(); 
        this.tsArray.forEach(x => tsVec.push_back(x));
        const exogVec: IDoubleVector = new (this.m.DoubleVector as any)(); 
        this.exogArray.forEach(x => exogVec.push_back(x));
        const newExogVec: IDoubleVector = new (this.m.DoubleVector as any)(); 
        exog.forEach(x => newExogVec.push_back(x));

        if (this.model === undefined ){
            throw new Error("Cannot predict as model is undefined")
        }

        const result: IDoubleVector = 
        (o.auto) ? this.m.predict_autoarima(
            convertAutoArimaModelToCpp(this.model as IAutoArimaModel),
            tsVec,
            exogVec, // old
            newExogVec, // new
            l,
        ): this.m.predict_sarimax(
                  convertSarimaxModelToCpp(this.model as ISarimaxModel),
                  tsVec,
                  exogVec, // old
                  newExogVec, // new
                  l,
              );

        const res = new Array(result.size()).fill(0).map((_, id) => result.get(id))

        const toReturn = chunk(res, l);
        return toReturn;
    }
}

let singleton: Arima | undefined = undefined
export async function getArima(options: Partial<IOptions>): Promise<Arima> {
    await ready
    if (!singleton) {
      singleton = new Arima(options)
    }
    return singleton
  }