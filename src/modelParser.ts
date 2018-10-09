import { readStruct } from './BinaryReader'
import * as structs   from './structs'
import { VERSION }    from './constants'

/**
 * Creates API for parsing MDL file. A MDL file is a binary buffer divided in
 * two part: header and data. Information about the data and their position is
 * in the header.
 * @param buffer The MDL-file buffer
 * @returns {ModelParser}
 */
export const createModelParser = (modelBuffer: ArrayBuffer) => {
  // Create the DataView object from buffer of a MDL file for parsing
  const dataView = new DataView(modelBuffer)

  return {
    /**
     * Returns parsed data of the MDL file
     */
    parseModel() {
      const header = readStruct(dataView, structs.header)

      if (header.version !== VERSION) {
        throw new Error('Unsupported version of the MDL file')
      }

      return header
    }
  }
}

/** Parser API interface */
export type ModelParser = ReturnType<typeof createModelParser>
