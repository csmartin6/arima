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

export interface EmClassHandle {
  clone(): EmClassHandle
  delete(): void
  deleteLater(): unknown
  isAliasOf(other: unknown): boolean
  isDeleted(): boolean
}

export interface EmVector<T> extends EmClassHandle {
  delete(): void
  get(pos: number): T
  push_back(value: T): void
  resize(n: number, val: T): void
  set(pos: number, value: T): boolean
  size(): number
}



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

  interface sarimaxModel {
     N: number,
     Nused: number,
  }

  export declare interface DoubleVector {
    clone(): DoubleVector
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
    fit_sarimax: (
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
      verbose: boolean) => sarimaxModel
      test_sarimax_vector: (
        ts: DoubleVector,
        exog: DoubleVector,
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
        verbose: boolean) => sarimaxModel
      test_sarimax: (n: number, nUsed: number)=>sarimaxModel
      DoubleVector: () => DoubleVector
  }
