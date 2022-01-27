/** Type of typed array instance */
// eslint-disable-next-line no-unused-vars
declare type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

/**
 * Type of struct data type description
 */
// eslint-disable-next-line space-infix-ops
export type DataType<T, A extends TypedArray | T[] = T[]> = {
  /**
   * Byte length of the data type
   */
  byteLength: number;

  /**
   * Value getter
   * @param dataView The DataView object
   * @param byteOffset Offset from the start of the DataView object
   * @param byteLength
   */
  getValue(dataView: DataView, byteOffset: number, byteLength?: number): T;

  /**
   * Constructor of array of the values. Required to create a typed array of
   * values of this type to increase performance.
   */
  arrayConstructor?: A extends T[] ? never : { new (length: number): A };
};

/**
 * Type of description of struct
 */
// eslint-disable-next-line space-infix-ops
export type Struct<T = any> = {
  [entry: string]: DataType<T, any>;
};

/**
 * Returns type of structure
 */
// eslint-disable-next-line space-infix-ops
export type StructResult<T extends Struct<any>> = {
  [K in keyof T]: ReturnType<T[K]['getValue']>;
};

/**
 * Creates reader of the Int8 value at the specified byte offset from the
 * start of the DataView object. It has a minimum value of -128 and a
 * maximum value of 127 (inclusive).
 */
export const int8: DataType<number, Int8Array> = {
  byteLength: 1,
  getValue: (dataView, offset) => dataView.getInt8(offset),
  arrayConstructor: Int8Array
};

/**
 * Alias for int8. Creates reader of the Int8 value at the specified byte
 * offset from the start of the DataView object. It has a minimum value of
 * -128 and a maximum value of 127 (inclusive).
 */
export const byte = int8;

/**
 * Creates reader of the Uint8 value at the specified byte offset from the
 * start of the DataView object. It has a minimum value of 0 and a
 * maximum value of 255 (inclusive).
 */
export const uint8: DataType<number, Uint8Array> = {
  byteLength: 1,
  getValue: (dataView, offset) => dataView.getUint8(offset),
  arrayConstructor: Uint8Array
};

/**
 * Alias for uint8. Creates reader of the Uint8 value at the specified byte
 * offset from the start of the DataView object. It has a minimum value of 0
 * and a maximum value of 255 (inclusive).
 */
export const ubyte = uint8;

/**
 * Creates reader of the Int16 value at the specified byte offset from the
 * start of the DataView object. It has a minimum value of -32 768 and a
 * maximum value of 32 767 (inclusive).
 */
export const int16: DataType<number, Int16Array> = {
  byteLength: 2,
  getValue: (dataView, offset) => dataView.getInt16(offset, true),
  arrayConstructor: Int16Array
};

/**
 * Alias for uint16. Creates reader of the Int16 value at the specified byte
 * offset from the start of the DataView object. It has a minimum value of
 * -32 768 and a maximum value of 32 767 (inclusive).
 */
export const short = int16;

/**
 * Creates reader of the Uint16 value at the specified byte offset from the
 * start of the DataView object.
 */
export const uint16: DataType<number, Uint16Array> = {
  byteLength: 2,
  getValue: (dataView, offset) => dataView.getUint16(offset, true),
  arrayConstructor: Uint16Array
};

/**
 * Alias for uint16. Creates reader of the Uint16 value at the specified byte
 * offset from the start of the DataView object.
 */
export const ushort = uint16;

/**
 * Creates reader of the Int32 value at the specified byte offset from the
 * start of the DataView object.
 */
export const int32: DataType<number, Int32Array> = {
  byteLength: 4,
  getValue: (dataView, offset) => dataView.getInt32(offset, true),
  arrayConstructor: Int32Array
};

/**
 * Alias for int32. Creates reader of the Int32 value at the specified byte
 * offset from the start of the DataView object.
 */
export const int = int32;

/**
 * Creates reader of the Uint32 value at the specified byte offset from the
 * start of the DataView object.
 */
export const uint32: DataType<number, Uint32Array> = {
  byteLength: 4,
  getValue: (dataView, offset) => dataView.getUint32(offset, true),
  arrayConstructor: Uint32Array
};

/**
 * Alias for uint32. Creates reader of the Uint32 value at the specified byte
 * offset from the start of the DataView object.
 */
export const uint = uint32;

/**
 * Creates reader of the Float32 value at the specified byte offset from the
 * start of the DataView object.
 */
export const float32: DataType<number, Float32Array> = {
  byteLength: 4,
  getValue: (dataView, offset) => dataView.getFloat32(offset, true),
  arrayConstructor: Float32Array
};

/**
 * Alias for float32. Creates reader of the Float32 value at the specified
 * byte offset from the start of the DataView object.
 */
export const float = float32;

/**
 * Creates reader of the Float64 value at the specified byte offset from the
 * start of the DataView object.
 */
export const float64: DataType<number, Float64Array> = {
  byteLength: 8,
  getValue: (dataView, offset) => dataView.getFloat64(offset, true),
  arrayConstructor: Float64Array
};

/**
 * Alias for float64. Creates reader of the Float64 value at the specified
 * byte offset from the start of the DataView object.
 */
export const double = float64;

/**
 * Creates reader of the String value at the specified byte offset from the
 * start of the DataView object.
 * @param length Length of the string
 */
export const string = (length: number): DataType<string> => ({
  byteLength: length,
  getValue(dataView, offset) {
    let string = '';

    for (let i = 0; i < length; i += uint8.byteLength) {
      const charCode: number = uint8.getValue(dataView, offset + i);

      // End of the string
      if (charCode === 0) {
        break;
      }

      string += String.fromCharCode(charCode);
    }

    return string;
  }
});

/**
 * Creates reader of the array of the specified type values at the specified
 * byte offset from the start of the DataView object.
 */
export const array = <T, A extends TypedArray | T[]>(arrayLength: number, structType: DataType<T, A>): DataType<A> => ({
  byteLength: structType.byteLength * arrayLength,
  getValue(dataView, byteOffset): A {
    const TypedArrayConstructor = structType.arrayConstructor;
    const out = (TypedArrayConstructor ? new TypedArrayConstructor(arrayLength) : Array<T>(arrayLength)) as A;

    for (let i = 0; i < arrayLength; i++) {
      const itemByteLength = i * structType.byteLength;
      const value = structType.getValue(dataView, byteOffset + itemByteLength, structType.byteLength);

      out[i] = value;
    }

    return out;
  }
});

/**
 * Alias for float32-vector with 3 elements
 */
export const vec3 = array(3, float);

/**
 * Creates an element to skip a specified number of bytes or number of bytes in
 * accordance with the specified data type.
 * @param lengthOrDataType Length in bytes to skip or data type
 */
export const skip = (lengthOrDataType: number | DataType<any, any>): DataType<any, any> => ({
  byteLength: typeof lengthOrDataType === 'number' ? lengthOrDataType : lengthOrDataType.byteLength,
  getValue() {}
});
