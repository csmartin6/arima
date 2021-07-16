// This is a subset of the Emscripten type definitions from @types/emscripten
// Project: http://kripken.github.io/emscripten-site/index.html
// Definitions by: Kensuke Matsuzaki <https://github.com/zakki>
//                 Periklis Tsirakidis <https://github.com/periklis>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
//
// quickjs-emscripten doesn't use the full EmscriptenModule type from @types/emscripten because:
//
// - the upstream types define many properties that don't exist on our module due
//   to our build settings
// - some upstream types reference web-only ambient types like WebGL stuff, which
//   we don't use.

declare namespace Emscripten {
    interface FileSystemType {}
    type EnvironmentType = 'WEB' | 'NODE' | 'SHELL' | 'WORKER'
    type ValueType = 'number' | 'string' | 'array' | 'boolean'
    type TypeCompatibleWithC = number | string | any[] | boolean
  
    type WebAssemblyImports = Array<{
      name: string
      kind: string
    }>
  
    type WebAssemblyExports = Array<{
      module: string
      name: string
      kind: string
    }>
  
    interface CCallOpts {
      async?: boolean
    }
  }

  export interface ISarimaxModelCpp {
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
    phi: IDoubleVector
    theta: IDoubleVector
    PHI: IDoubleVector
    THETA: IDoubleVector
    // double *exog;
    // double *vcov;// Variance-Covariance Matrix Of length lvcov
    lvcov: number; //length of VCOV
    res: IDoubleVector
    mean: number
    var: number
    loglik: number
    aic: number
    retval: number
    start: number
    imean: number
  }

  export interface IAutoArimaModelCpp {
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
    phi: IDoubleVector
    theta: IDoubleVector
    PHI: IDoubleVector
    THETA: IDoubleVector
    // exog: IDoubleVector
    // vcov: IDoubleVector // Variance-Covariance Matrix Of length lvcov
    lvcov: number; //length of VCOV
    res: IDoubleVector
    mean: number
    var: number
    loglik: number
    ic: number
    retval: number
    start: number
    imean: number
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

  export declare interface IDoubleVector {
    clone(): IDoubleVector
    delete(): void
    deleteLater(): unknown
    isAliasOf(other: unknown): boolean
    isDeleted(): boolean
    delete(): void
    get(pos: number): number
    push_back(value: number): void
    resize(n: number, val: number): void
    set(pos: number, value: number): boolean
    size(): number
   }


  /**
   * Typings for the featuers we use to interface with our Emscripten build of
   * ctsa.
   */
  export interface ArimaEmscriptenModule {
    addFunction(fn: Function, type: string): number
    removeFunction(pointer: number): void
    stringToUTF8(str: string, outPtr: number, maxBytesToRead?: number): void
    lengthBytesUTF8(str: string): number
  
    _malloc(size: number): number
    _free(ptr: number): void
    cwrap(
      ident: string,
      returnType: Emscripten.ValueType | null,
      argTypes: Emscripten.ValueType[],
      opts?: Emscripten.CCallOpts
    ): (...args: any[]) => any
  
    // USE_TYPED_ARRAYS == 2
    HEAP8: Int8Array
    HEAP16: Int16Array
    HEAP32: Int32Array
    HEAPU8: Uint8Array
    HEAPU16: Uint16Array
    HEAPU32: Uint32Array
    HEAPF32: Float32Array
    HEAPF64: Float64Array
  
    TOTAL_STACK: number
    TOTAL_MEMORY: number
    FAST_MEMORY: number
    fit_sarimax_old: (
      ts: Uint8Array,
      exog: Uint8Array,
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
      verbose: boolean) => ISarimaxModelCpp
      fit_sarimax: (
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
        verbose: boolean) => ISarimaxModelCpp
      predict_sarimax: (
        model: ISarimaxModelCpp, 
        ts: IDoubleVector,
        exog: IDoubleVector,
        newexogVec: IDoubleVector,
        lout: number) => IDoubleVector
      fit_autoarima: (
          ts: IDoubleVector,
          exog: IDoubleVector,
          p: number,  // Max p
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
          verbose: boolean) => IAutoArimaModelCpp
        predict_autoarima: (
          model: IAutoArimaModelCpp, 
          ts: IDoubleVector,
          exog: IDoubleVector,
          newexogVec: IDoubleVector,
          lout: number) => IDoubleVector
      DoubleVector: () => IDoubleVector
  }
