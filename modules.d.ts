// Allowing import MDL-files
declare module '*.mdl';

declare module 'fast-dataview' {
  class FastDataView<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> extends DataView<TArrayBuffer> {}

  // prettier-ignore
  namespace FastDataView {}
  export = FastDataView;
}
