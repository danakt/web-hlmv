import * as structs                     from '../const/structs'
import { TRIANGLE_FAN, TRIANGLE_STRIP } from '../const/constants'

/**
 * Returns type of a series of connected triangles
 */
export const getTriangleSeriesType = (trianglesSeriesHead: number) =>
  trianglesSeriesHead < 0 ? TRIANGLE_FAN : TRIANGLE_STRIP

/**
 * Counts vertices for building geometry buffer
 * @param trianglesBuffer Triangles buffer
 * @return Number of vertices
 */
export const countVertices = (trianglesBuffer: Int16Array): number => {
  // Count of vertices
  let vertCount = 0

  // Current position in buffer
  let p = 0

  // Processing triangle series
  while (trianglesBuffer[p]) {
    // Number of following vertices
    const verticesNum = Math.abs(trianglesBuffer[p])

    // This position is no longer needed,
    // we proceed to the following
    p += verticesNum * 4 + 1

    // Increase the number of vertices
    vertCount += (verticesNum - 3) * 3 + 3
  }

  return vertCount
}

/**
 * Unpack faces of the mesh
 * @param trianglesBuffer Triangles data
 * @param verticesBuffer Vertices
 * @param texture Image data of texture
 * @returns
 *
 * @todo Make faster and simpler.
 */
export const readFacesData = (trianglesBuffer: Int16Array, verticesBuffer: Float32Array, texture: structs.Texture) => {
  // Number of vertices for generating buffer
  const vertNumber = countVertices(trianglesBuffer)

  // List of vertices data: origin and uv position on texture
  const verticesData: number[][] = []

  // Current position in buffer
  let trisPos = 0

  // Processing triangle series
  while (trianglesBuffer[trisPos]) {
    // Detecting triangle series type
    const trianglesType = trianglesBuffer[trisPos] < 0 ? TRIANGLE_FAN : TRIANGLE_STRIP

    // Starting vertex for triangle fan
    let startVert: number[] | null = null

    // Number of following triangles
    const trianglesNum = Math.abs(trianglesBuffer[trisPos])

    // This index is no longer needed,
    // we proceed to the following
    trisPos++

    // For counting we will make steps for 4 array items:
    // 0 — index of the vertex origin in vertices buffer
    // 1 — light (?)
    // 2 — first uv coordinate
    // 3 — second uv coordinate
    for (let j = 0; j < trianglesNum; j++, trisPos += 4) {
      const vertIndex: number = trianglesBuffer[trisPos]
      const vert: number = trianglesBuffer[trisPos] * 3
      // const light: number = trianglesBuffer[trisPos + 1] // ?

      // Vertex data
      const vertexData = [
        // Origin
        verticesBuffer[vert + 0],
        verticesBuffer[vert + 1],
        verticesBuffer[vert + 2],

        // UV data
        trianglesBuffer[trisPos + 2] / texture.width,
        1 - trianglesBuffer[trisPos + 3] / texture.height,

        // Vertice index for getting bone tranforms in subsequent calculations
        vertIndex
      ]

      // Unpacking triangle strip. Each next vertex, beginning with the third,
      // forms a triangle with the last and the penultimate vertex.
      //       1 ________3 ________ 5
      //       ╱╲        ╱╲        ╱╲
      //     ╱    ╲    ╱    ╲    ╱    ╲
      //   ╱________╲╱________╲╱________╲
      // 0          2         4          6
      if (trianglesType === TRIANGLE_STRIP) {
        if (j > 2) {
          if (j % 2 === 0) {
            // even
            verticesData.push(
              verticesData[verticesData.length - 3], // previously first one
              verticesData[verticesData.length - 1] // last one
            )
          } else {
            // odd
            verticesData.push(
              verticesData[verticesData.length - 1], // last one
              verticesData[verticesData.length - 2] // second to last
            )
          }
        }
      }

      // Unpacking triangle fan. Each next vertex, beginning with the third,
      // forms a triangle with the last and first vertex.
      //       2 ____3 ____ 4
      //       ╱╲    |    ╱╲
      //     ╱    ╲  |  ╱    ╲
      //   ╱________╲|╱________╲
      // 1          0            5
      if (trianglesType === TRIANGLE_FAN) {
        startVert = startVert || vertexData

        if (j > 2) {
          verticesData.push(startVert, verticesData[verticesData.length - 1])
        }
      }

      // New one
      verticesData.push(vertexData)
    }
  }

  // Converting array of vertices data to geometry buffer and UV buffer
  const vertices = new Float32Array(vertNumber * 3)
  const uv = new Float32Array(vertNumber * 2)
  const indices = new Int16Array(vertNumber)

  for (let i = 0; i < vertNumber; i++) {
    vertices[i * 3 + 0] = verticesData[i][0]
    vertices[i * 3 + 1] = verticesData[i][1]
    vertices[i * 3 + 2] = verticesData[i][2]

    uv[i * 2 + 0] = verticesData[i][3]
    uv[i * 2 + 1] = verticesData[i][4]

    indices[i] = verticesData[i][5]
  }

  return {
    vertices,
    uv,
    indices
  }
}
