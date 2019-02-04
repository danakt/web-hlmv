import * as fs                            from 'fs'
import * as path                          from 'path'
import * as FastDataView                  from 'fast-dataview'
import * as structs                       from '../../const/structs'
import { readStruct, readStructMultiple } from '../binaryReader'
import {
  int8,
  byte,
  uint8,
  ubyte,
  short,
  int16,
  uint16,
  ushort,
  int32,
  int,
  uint32,
  uint,
  float32,
  float,
  float64,
  double,
  string,
  array,
  vec3,
  skip
} from '../dataTypes'

// Loading model for testing
const leetPath = path.resolve(__dirname, '../../__mock__/leet.mdl')
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer

test('should parse some struct in binary file', () => {
  const dataView = new FastDataView(leetBuffer)
  const header = readStruct(dataView, structs.header)
  expect(header).toMatchSnapshot('leet header')
})

test('should parse multiple structs in binary file', () => {
  const dataView = new FastDataView(leetBuffer)
  const header = readStruct(dataView, structs.header)
  const texturesInfo = readStructMultiple(dataView, structs.texture, header.textureIndex, header.numTextures)

  expect(texturesInfo).toMatchSnapshot('leet texture info')
})

test('should get byte from buffer', () => {
  const dataView = new DataView(new Int8Array([-1]).buffer)
  expect(int8.getValue(dataView, 0)).toBe(-1)
  expect(byte.getValue(dataView, 0)).toBe(-1)
})

test('should get unsigned byte from buffer', () => {
  const dataView = new DataView(new Uint8Array([-1]).buffer)
  expect(uint8.getValue(dataView, 0)).toBe(255)
  expect(ubyte.getValue(dataView, 0)).toBe(255)
})

test('should get short integer from buffer', () => {
  const dataView = new DataView(new Int16Array([-1]).buffer)
  expect(int16.getValue(dataView, 0)).toBe(-1)
  expect(short.getValue(dataView, 0)).toBe(-1)
})

test('should get unsigned short integer from buffer', () => {
  const dataView = new DataView(new Uint16Array([-1]).buffer)
  expect(uint16.getValue(dataView, 0)).toBe(65535)
  expect(ushort.getValue(dataView, 0)).toBe(65535)
})

test('should get integer from buffer', () => {
  const dataView = new DataView(new Int32Array([-1]).buffer)
  expect(int32.getValue(dataView, 0)).toBe(-1)
  expect(int.getValue(dataView, 0)).toBe(-1)
})

test('should get unsigned integer from buffer', () => {
  const dataView = new DataView(new Uint32Array([-1]).buffer)
  expect(uint32.getValue(dataView, 0)).toBe(4294967295)
  expect(uint.getValue(dataView, 0)).toBe(4294967295)
})

test('should get float from buffer', () => {
  const dataView = new DataView(new Float32Array([-Math.PI]).buffer)
  // Inaccurate value of PI
  expect(float32.getValue(dataView, 0)).toBe(-3.1415927410125732)
  expect(float.getValue(dataView, 0)).toBe(-3.1415927410125732)
})

test('should get double float from buffer', () => {
  const dataView = new DataView(new Float64Array([-Math.PI]).buffer)
  expect(float64.getValue(dataView, 0)).toBe(-Math.PI)
  expect(double.getValue(dataView, 0)).toBe(-Math.PI)
})

test('should get string from buffer', () => {
  const dataView = new DataView(new Int8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]).buffer)
  expect(string(11).getValue(dataView, 0)).toBe('hello world')
})

test('should get array of bytes from buffer', () => {
  const dataView = new DataView(new Int8Array([1, 2, 3]).buffer)
  expect(array(3, byte).getValue(dataView, 0)).toEqual(new Int8Array([1, 2, 3]))
})

test('should get vector 3 from buffer', () => {
  const dataView = new DataView(new Float32Array([0.5, 0.25, 0.125]).buffer)
  expect(vec3.getValue(dataView, 0)).toEqual(new Float32Array([0.5, 0.25, 0.125]))
})

test('should create skipping data type', () => {
  expect(skip(8).byteLength).toEqual(8)
  expect(skip(int).byteLength).toEqual(4)
})
