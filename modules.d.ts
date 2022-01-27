// Allowing import MDL-files
declare module '*.mdl';

declare module 'three-orbit-controls';

declare module 'fast-dataview' {
  class FastDataView extends DataView {}

  // prettier-ignore
  namespace FastDataView {}
  export = FastDataView;
}
