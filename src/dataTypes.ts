/**
 * Type of struct data type description
 */
// eslint-disable-next-line space-infix-ops
export type DataType<T> = {
  /** Byte length of the data type */
  byteLength: number

  /** Value getter */
  getValue(dataView: DataView, byteOffset: number, byteLength?: number): T
}

/**
 * Type of description of struct
 */
// eslint-disable-next-line space-infix-ops
export type Struct<T = any> = {
  [entry: string]: DataType<T>
}

/**
 * Returns type of structure
 */
// eslint-disable-next-line space-infix-ops
export type StructResult<T extends Struct<any>> = { [K in keyof T]: ReturnType<T[K]['getValue']> }

/**
 * Creates reader of the Int8 value at the specified byte offset from the
 * start of the DataView object. It has a minimum value of -128 and a
 * maximum value of 127 (inclusive).
 */
export const int8: DataType<number> = {
  byteLength: 1,
  getValue:   (dataView, offset) => dataView.getInt8(offset)
}

/**
 * Creates reader of the Uint8 value at the specified byte offset from the
 * start of the DataView object. It has a minimum value of 0 and a
 * maximum value of 255 (inclusive).
 */
export const uint8: DataType<number> = {
  byteLength: 1,
  getValue:   (dataView, offset) => dataView.getUint8(offset)
}

/**
 * Creates reader of the Int16 value at the specified byte offset from the
 * start of the DataView object. It has a minimum value of -32 768 and a
 * maximum value of 32 767 (inclusive).
 */
export const int16: DataType<number> = {
  byteLength: 2,
  getValue:   (dataView, offset) => dataView.getInt16(offset, true)
}

/**
 * Creates reader of the Uint16 value at the specified byte offset from the
 * start of the DataView object.
 */
export const uint16: DataType<number> = {
  byteLength: 2,
  getValue:   (dataView, offset) => dataView.getUint16(offset, true)
}

/**
 * Creates reader of the Int32 value at the specified byte offset from the
 * start of the DataView object.
 */
export const int32: DataType<number> = {
  byteLength: 4,
  getValue:   (dataView, offset) => dataView.getInt32(offset, true)
}

/**
 * Creates reader of the Uint32 value at the specified byte offset from the
 * start of the DataView object.
 */
export const uint32: DataType<number> = {
  byteLength: 4,
  getValue:   (dataView, offset) => dataView.getUint32(offset, true)
}

/**
 * Creates reader of the Float32 value at the specified byte offset from the
 * start of the DataView object.
 */
export const float32: DataType<number> = {
  byteLength: 4,
  getValue:   (dataView, offset) => dataView.getFloat32(offset, true)
}

/**
 * Creates reader of the Float64 value at the specified byte offset from the
 * start of the DataView object.
 */
export const float64: DataType<number> = {
  byteLength: 8,
  getValue:   (dataView, offset) => dataView.getFloat64(offset, true)
}

/**
 * Creates reader of the String value at the specified byte offset from the
 * start of the DataView object.
 * @param length Length of the string
 */
export const string = (length: number): DataType<string> => ({
  byteLength: length,
  getValue(dataView, offset) {
    let string = ''

    for (let i = 0; i < length; i += uint8.byteLength) {
      const charCode: number = uint8.getValue(dataView, offset + i)

      // End of the string
      if (charCode === 0) {
        break
      }

      string += String.fromCharCode(charCode)
    }

    return string
  }
})

/**
 * Creates reader of the array of the specified type values at the specified
 * byte offset from the start of the DataView object.
 */
// Fix eslint parsing error: «Identifier expected».
export const array = <T extends any>(arrayLength: number, structType: DataType<T>): DataType<T[]> => ({
  byteLength: structType.byteLength * arrayLength,
  getValue(dataView, byteOffset): T[] {
    const out: T[] = []

    for (let i = 0; i < arrayLength; i++) {
      const itemByteLength = i * structType.byteLength
      const value = structType.getValue(dataView, byteOffset + itemByteLength, structType.byteLength)

      out[i] = value
    }

    return out
  }
})
