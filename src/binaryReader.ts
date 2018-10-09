// eslint-disable-next-line no-unused-vars
import { Struct, StructResult } from './DataTypes'

/**
 * Parses binary buffer (wrapped to DataView) according to a structure
 * description
 * @param dataView The DataView object
 * @param struct Structure description. The structure can't contain keys
 * starting with a digit due to the peculiarities of the javascript engine.
 * Otherwise, the reading result may be corrupted.
 * @param byteOffset Offset in buffer to read, "0" by default
 * @returns The structure applying result
 */
export const readStruct = function readStruct<T extends Struct>(
  dataView: DataView,
  struct: T,
  byteOffset: number = 0
): StructResult<T> {
  let offset: number = byteOffset
  const result = {} as StructResult<T>

  for (const key in struct) {
    if (struct[key].getValue) {
      ;(result as any)[key] = struct[key].getValue(dataView, offset, struct[key].byteLength)
    }

    offset += struct[key].byteLength
  }

  return result
}
