export interface ISarimaxModel {
    N: number
    Nused: number
    method: number
	optmethod: number
	p: number// size of phi
    d: number// Number of times the series is to be differenced
    q: number//size of theta
    s: number// Seasonality/Period
    P: number//Size of seasonal phi
    D: number// The number of times the seasonal series is to be differenced
    Q: number//size of Seasonal Theta
    r: number// Number of exogenous variables
    M: number // M = 0 if mean is 0.0 else M = 1
    ncoeff: number// Total Number of Coefficients to be estimated
    phi: number[]
    theta: number[]
    PHI: number[]
    THETA: number[]
    // double *exog;
    // double *vcov;// Variance-Covariance Matrix Of length lvcov
    lvcov: number; //length of VCOV
    res: number[]
    mean: number
    var: number
    loglik: number
    aic: number
    retval: number
    start: number
    imean: number
  }


  export interface IAutoArimaModel {
    N: number
    Nused: number
    method: number
	optmethod: number
    pmax: number // Maximum size of phi
    dmax: number // Maximum Number of times the series is to be differenced
    qmax: number // Maximum size of theta
    Pmax: number //Maximum Size of seasonal phi
    Dmax: number // Maximum number of times the seasonal series is to be differenced
    Qmax: number //Maximum size of Seasonal Theta
	p: number// size of phi
    d: number// Number of times the series is to be differenced
    q: number//size of theta
    s: number// Seasonality/Period
    P: number//Size of seasonal phi
    D: number// The number of times the seasonal series is to be differenced
    Q: number//size of Seasonal Theta
    r: number// Number of exogenous variables
    M: number // M = 0 if mean is 0.0 else M = 1
    ncoeff: number// Total Number of Coefficients to be estimated
    phi: number[]
    theta: number[]
    PHI: number[]
    THETA: number[]
    // double *exog;
    // double *vcov;// Variance-Covariance Matrix Of length lvcov
    lvcov: number; //length of VCOV
    res: number[]
    var: number
    loglik: number
    ic: number
    retval: number
    start: number
    imean: number
    mean: number
    idrift: number
    stationary: number
    seasonal: number
    Order_max: number
    p_start: number
    q_start: number
    P_start: number
    Q_start: number
    information_criteria: string
    stepwise: number
    num_models: number
    approximation: number
    verbose: number
    test: string
    type: string
    seas: string
    alpha_test: number
    alpha_seas: number
    lambda: number
    sigma2: number
    aic: number
    bic: number
    aicc: number
  }