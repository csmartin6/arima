/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */


// import createArimaModeler from "./wasm/native.js";
// export async function createInstance(module) {
//   return createArimaModeler(module);
// }

// // import Modules = require("./wasm/native.js");

// // import * anpm install --save-dev babel-jests Module from "./wasm/native.js";

// // const bin = require('./wrapper/native.bin.js')
// const m = await createInstance({});

// // const m  = Module.instantiateWasm(); // Module({ wasmBinary: bin.data })
// // const m = Module


// import * as Module from "./wasm/native.js";
// import Module = require("./wasm/native.js");


import ModuleLoader from './arima-emscripten-module'
import { ArimaEmscriptenModule, IDoubleVector } from './emscripten-types'
// import { ISarimaxModel } from './types'
import { convertAutoArimaModelToCpp, convertAutoModelCppModel, convertSarimaxCppModel, convertSarimaxModelToCpp } from './utils'
import { chunk } from "lodash";

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
// tslint:disable-next-line variable-name
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

function uintify(arr: Iterable<number>) {
    return new Uint8Array(Float64Array.from(arr).buffer);
}

// function flat(arr: Array<ConcatArray<number>>) {
//     return [].concat.apply([], arr);
// }

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



// const defaults = {
//     method: 0,
//     optimizer: 6,
//     s: 0,
//     verbose: true,
//     transpose: false,
//     auto: false,
//     approximation: 1,
//     search: 1,
// };

// const params = {
//     p: 1,
//     d: 0,
//     q: 1,
//     P: 0,
//     D: 0,
//     Q: 0,
// };

// const paramsAuto = {
//     p: 5,
//     d: 2,
//     q: 5,
//     P: 2,
//     D: 1,
//     Q: 2,
// };

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

export class Arima {
    private ts: Uint8Array;
    private tsArray: number[];
    private exog: Uint8Array;
    private exogArray: number[];
    private nexog: number = 0;
    private lin: number = 0;
    private options: IOptions = DEFAULT_OPTIONS;
    public modelCpp?: any;
    public model?: any;
    public modelObject?: any;
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
            this.modelObject =  this._fit_autoarima_old(
                this.ts,
                this.exog,
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
            this.modelCpp = this.m.fit_autoarima(
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
            this.model = convertSarimaxCppModel(this.modelCpp)
            } else {
                this.modelObject = this._fit_sarimax_old(
                  this.ts,
                  this.exog,
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
              );
              this.modelCpp = this.m.fit_sarimax(
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
              this.model = convertAutoModelCppModel(this.modelCpp)
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

        let old_res;
        if (o.auto) {
            const addr = this._predict_autoarima_old(
                  this.modelCpp,
                  this.ts,
                  this.exog, // old
                  uintify(prepare(exog)), // new
                  l,
              )
              old_res = this.getResults(addr, l)
        } else {
            const addr = this._predict_sarimax_old(
                this.modelObject,
                this.ts,
                this.exog, // old
                uintify(prepare(exog)), // new
                l,
            )
            old_res = this.getResults(addr, l)
        }



        const tsVec: IDoubleVector = new (this.m.DoubleVector as any)(); 
        this.tsArray.forEach(x => tsVec.push_back(x));
        const exogVec: IDoubleVector = new (this.m.DoubleVector as any)(); 
        this.exogArray.forEach(x => exogVec.push_back(x));
        const newExogVec: IDoubleVector = new (this.m.DoubleVector as any)(); 
        exog.forEach(x => newExogVec.push_back(x));
        const result: IDoubleVector = 
        (o.auto) ? this.m.predict_autoarima(
            convertAutoArimaModelToCpp(this.model),
            tsVec,
            exogVec, // old
            newExogVec, // new
            l,
        ): this.m.predict_sarimax(
                  convertSarimaxModelToCpp(this.model),
                  tsVec,
                  exogVec, // old
                  newExogVec, // new
                  l,
              );

        const res = new Array(result.size()).fill(0).map((_, id) => result.get(id))

        const toReturn = chunk(res, l);
        return toReturn;
    }

    // tslint:disable-next-line variable-name
    private _fit_sarimax_old = this.m.cwrap("fit_sarimax_old", "number", [
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
        "boolean",
    ]);
    // tslint:disable-next-line variable-name
    private _predict_sarimax_old = this.m.cwrap("predict_sarimax_old", "number", ["number", "array", "array", "array", "number"]);
    // tslint:disable-next-line variable-name
    private _fit_autoarima_old = this.m.cwrap("fit_autoarima_old", "number", [
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
    private _predict_autoarima_old = this.m.cwrap("predict_autoarima_old", "number", ["number", "array", "array", "array", "number"]);

    private getResults(addr: number, l: number): number[][] {
        const res: number[][] = [[], []];
        for (let i = 0; i < l * 2; i++) {
            res[i < l ? 0 : 1].push(this.m.HEAPF64[addr / Float64Array.BYTES_PER_ELEMENT + i]);
        }
        return res;
    }
}



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
let singleton: Arima | undefined = undefined
export async function getArima(options: Partial<IOptions>): Promise<Arima> {
    await ready
    if (!singleton) {
      singleton = new Arima(options)
    }
    return singleton
  }