import * as structs     from './structs'
import { VERSION }      from './constants'
import { readStruct }   from './binaryReader'
import { StructResult } from './dataTypes'

/**
 * Parses header of the MDL file
 * @param dataView The DataView object
 */
export const parseHeader = (dataView: DataView): StructResult<typeof structs.header> => {
  return readStruct(dataView, structs.header)
}

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

      // Checking version of MDL file
      if (header.version !== VERSION) {
        throw new Error('Unsupported version of the MDL file')
      }

      // Checking textures of the model
      // TODO: Handle model without textures
      if (!header.textureindex || !header.numtextures) {
        throw new Error('No textures in the MDL file')
      }

      return header
    }
  }
}

/** Parser API interface */
export type ModelParser = ReturnType<typeof createModelParser>
