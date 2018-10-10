/** Allowing import MDL-files */
declare module '*.mdl'

/** Type of typed array instance */
declare type TypedArray
  = | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array

/** Type of typed array constructor */
declare interface TypedArrayConstructor {
  new (length: number): TypedArray
}
