/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */

import { chunk, compact, flatten, zip } from "lodash-es";
import Module from "./arima-emscripten-module";
import { ArimaEmscriptenModule, IDoubleVector } from "./emscripten-types";
import { IArimaModel } from "./types";
import { convertModelFromCpp, convertModelToCpp } from "./utils";

let ArimaModule: ArimaEmscriptenModule | undefined;

const ready = Module().then(loadedModule => {
    ArimaModule = loadedModule;
});

/**
 * @throws if not ready
 */
export function getArimaEmscriptenModule(): ArimaEmscriptenModule {
    if (!ArimaModule) {
        throw new Error("Arima WASM module not initialized. Either wait for `ready` or use getArimaComputer()");
    }
    return ArimaModule;
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
export class ArimaComputer {
    private m = getArimaEmscriptenModule();
    public fit(options: Partial<IOptions>, timeseries: number[], exog: number[][]): IArimaModel {
        const o = { ...DEFAULT_OPTIONS, ...options };
        const tsVec: IDoubleVector = new (this.m.DoubleVector as any)();
        timeseries.forEach(x => tsVec.push_back(x));
        const exog1d = compact(flatten(zip(...exog)));
        const exogVec: IDoubleVector = new (this.m.DoubleVector as any)();
        exog1d.forEach(x => exogVec.push_back(x));

        const lin = timeseries.length;
        const nexog = exog.length > 0 ? exog.length : 0;
        if (o.auto) {
            const modelCpp = this.m.autofit(
                tsVec,
                exogVec,
                o.p,
                o.d,
                o.q,
                o.P,
                o.D,
                o.Q,
                o.s,
                nexog,
                lin,
                o.method,
                o.optimizer,
                o.approximation,
                o.search,
                o.verbose,
            );
            const model = convertModelFromCpp(modelCpp);
            return model;
        } else {
            const modelCpp = this.m.fit(
                tsVec,
                exogVec,
                o.p,
                o.d,
                o.q,
                o.P,
                o.D,
                o.Q,
                o.s,
                nexog,
                lin,
                o.method,
                o.optimizer,
                o.verbose,
            );
            const model = convertModelFromCpp(modelCpp);
            return model;
        }
    }

    public predict(model: IArimaModel, l: number, exog: number[][]): number[][] {
        if (model.ts === undefined) {
            throw new Error("Can't predict.  model training timeseries undefined");
        }
        // make sure exog variables is right shape
        const exogVec = compact(flatten(zip(...exog)));
        const newExogVec: IDoubleVector = new (this.m.DoubleVector as any)();
        exogVec.forEach(x => newExogVec.push_back(x));

        const result: IDoubleVector = this.m.predict(
            convertModelToCpp(model, this.m),
            newExogVec, // new
            l,
        );

        const res = new Array(result.size()).fill(0).map((_, id) => result.get(id));

        const toReturn = chunk(res, l);
        return toReturn;
    }
}

let singletonComputer: ArimaComputer | undefined;
export async function getArimaComputer(): Promise<ArimaComputer> {
    await ready;
    if (!singletonComputer) {
        singletonComputer = new ArimaComputer();
    }
    return singletonComputer;
}
