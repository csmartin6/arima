/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */

export interface IArimaModelCpp {
    N: number;
    Nused: number;
    method: number;
    optmethod: number;
    p: number; // size of phi
    d: number; // Number of times the series is to be differenced
    q: number; // size of theta
    s: number; // Seasonality/Period
    P: number; // Size of seasonal phi
    D: number; // The number of times the seasonal series is to be differenced
    Q: number; // size of Seasonal Theta
    r: number; // Number of exogenous variables
    M: number; // M = 0 if mean is 0.0 else M = 1
    ncoeff: number; // Total Number of Coefficients to be estimated
    phi: IDoubleVector;
    theta: IDoubleVector;
    PHI: IDoubleVector;
    THETA: IDoubleVector;
    vcov: IDoubleVector; // Variance-Covariance Matrix Of length lvcov
    lvcov: number; // length of VCOV
    res: IDoubleVector;
    mean: number;
    var: number;
    loglik: number;
    aic: number;
    retval: number;
    start: number;
    imean: number;
    ts: IDoubleVector;
    exog: IDoubleVector;
}

export declare interface IDoubleVector {
    clone(): IDoubleVector;
    delete(): void;
    deleteLater(): unknown;
    isAliasOf(other: unknown): boolean;
    isDeleted(): boolean;
    get(pos: number): number;
    push_back(value: number): void;
    resize(n: number, val: number): void;
    set(pos: number, value: number): boolean;
    size(): number;
}

/**
 * Typings for the features we use to interface with our Emscripten build of
 * ctsa.
 */
export interface ArimaEmscriptenModule {
    fit: (
        ts: IDoubleVector,
        exog: IDoubleVector,
        p: number,
        d: number,
        q: number,
        P: number,
        D: number,
        Q: number,
        s: number,
        nexog: number,
        lin: number,
        method: number,
        optimizer: number,
        verbose: boolean,
    ) => IArimaModelCpp;
    predict: (model: IArimaModelCpp, newexogVec: IDoubleVector, lout: number) => IDoubleVector;
    autofit: (
        ts: IDoubleVector,
        exog: IDoubleVector,
        p: number, // Max p
        d: number, // Max d
        q: number, // Max q
        P: number, // Max P
        D: number, // Max D
        Q: number, // Max Q
        s: number,
        nexog: number,
        lin: number,
        method: number,
        optimizer: number,
        approximation: number,
        search: number,
        verbose: boolean,
    ) => IArimaModelCpp;
    DoubleVector: () => IDoubleVector;
}
