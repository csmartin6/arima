/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */

export interface IArimaModel {
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
    phi: number[];
    theta: number[];
    PHI: number[];
    THETA: number[];
    vcov: number[]; // Variance-Covariance Matrix Of length lvcov
    lvcov: number; // length of VCOV
    res: number[];
    mean: number;
    var: number;
    loglik: number;
    aic: number;
    retval: number;
    start: number;
    imean: number;
    ts: number[];
    exog: number[];
}
