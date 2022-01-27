import * as fs from 'fs';
import * as path from 'path';
import FastDataView from 'fast-dataview';
import { intersection } from 'ramda';
import * as ModelParser from '../modelDataParser';

// Loading model for testing
const leetPath = path.resolve(__dirname, '../../__mock__/leet.mdl');
const leetBuffer: ArrayBuffer = fs.readFileSync(leetPath).buffer;

const ratamahattaPath = path.resolve(__dirname, '../../__mock__/ratamahatta.md2');
const ratamahattaBuffer: ArrayBuffer = fs.readFileSync(ratamahattaPath).buffer;

const dataView = new FastDataView(leetBuffer);
const header = ModelParser.parseHeader(dataView);

describe('parsing model parts', () => {
  test('should parse header', () => {
    const header = ModelParser.parseHeader(dataView);
    expect(header).toMatchSnapshot('leet header');
  });

  test('should parse bones', () => {
    const bones = ModelParser.parseBones(dataView, header.boneIndex, header.numBones);
    expect(bones).toMatchSnapshot('leet bones');
  });

  test('should parse bone controllers', () => {
    const boneControllers = ModelParser.parseBoneControllers(
      dataView,
      header.boneControllerIndex,
      header.numBoneControllers
    );
    expect(boneControllers).toMatchSnapshot('leet bone controllers');
  });

  test('should parse attachments', () => {
    const attachments = ModelParser.parseAttachments(dataView, header.attachmentIndex, header.numAttachments);
    expect(attachments).toMatchSnapshot('leet attachments');
  });

  test('should parse hitboxes', () => {
    const hitBoxes = ModelParser.parseHitboxes(dataView, header.hitBoxIndex, header.numHitboxes);
    expect(hitBoxes).toMatchSnapshot('leet hitboxes');
  });

  test('should parse sequences', () => {
    const sequences = ModelParser.parseSequences(dataView, header.seqIndex, header.numSeq);
    expect(sequences).toMatchSnapshot('leet sequences');
  });

  test('should parse sequence groups', () => {
    const sequenceGroups = ModelParser.parseSequenceGroups(dataView, header.seqGroupIndex, header.numSeqGroups);
    expect(sequenceGroups).toMatchSnapshot('leet sequence groups');
  });

  test('should parse bodyparts', () => {
    const bodyParts = ModelParser.parseBodyParts(dataView, header.bodyPartIndex, header.numBodyParts);
    expect(bodyParts).toMatchSnapshot('leet body parts');
  });

  test('should parse textures', () => {
    const textures = ModelParser.parseTextures(dataView, header.textureIndex, header.numTextures);
    expect(textures).toMatchSnapshot('leet textures info');
  });

  test('should parse skin references', () => {
    const skinRef = ModelParser.parseSkinRef(dataView.buffer, header.skinIndex, header.numSkinRef);
    expect(skinRef).toMatchSnapshot('leet skin references');
  });

  test('should parse submodels', () => {
    const bodyParts = ModelParser.parseBodyParts(dataView, header.bodyPartIndex, header.numBodyParts);
    const subModels = ModelParser.parseSubModel(dataView, bodyParts);

    expect(subModels).toMatchSnapshot('leet submodels');
  });

  test('should parse meshes', () => {
    const bodyParts = ModelParser.parseBodyParts(dataView, header.bodyPartIndex, header.numBodyParts);
    const subModels = ModelParser.parseSubModel(dataView, bodyParts);
    const meshes = ModelParser.parseMeshes(dataView, subModels);

    expect(meshes).toMatchSnapshot('leet meshes');
  });

  test('should parse vertices', () => {
    const bodyParts = ModelParser.parseBodyParts(dataView, header.bodyPartIndex, header.numBodyParts);
    const subModels = ModelParser.parseSubModel(dataView, bodyParts);
    const vertices = ModelParser.parseVertices(dataView.buffer, subModels);

    expect(vertices).toMatchSnapshot('leet vertices');
  });

  test('should parse bones vertices', () => {
    const bodyParts = ModelParser.parseBodyParts(dataView, header.bodyPartIndex, header.numBodyParts);
    const subModels = ModelParser.parseSubModel(dataView, bodyParts);
    const vertBoneBuffer = ModelParser.parseVertBoneBuffer(dataView.buffer, subModels);

    expect(vertBoneBuffer).toMatchSnapshot('leet bone vertices');
  });

  test('should parse triangles', () => {
    const bodyParts = ModelParser.parseBodyParts(dataView, header.bodyPartIndex, header.numBodyParts);
    const subModels = ModelParser.parseSubModel(dataView, bodyParts);
    const meshes = ModelParser.parseMeshes(dataView, subModels);
    const triangles = ModelParser.parseTriangles(dataView.buffer, meshes, header.length);

    expect(triangles).toMatchSnapshot('leet triangles');
  });

  test('should parse animations', () => {
    const sequences = ModelParser.parseSequences(dataView, header.seqIndex, header.numSeq);
    const animations = ModelParser.parseAnimations(dataView, sequences, header.numBones);

    expect(animations).toMatchSnapshot('leet animation');
  });

  test('should parse animation values', () => {
    const sequences = ModelParser.parseSequences(dataView, header.seqIndex, header.numSeq);
    const animations = ModelParser.parseAnimations(dataView, sequences, header.numBones);

    const animValues = ModelParser.parseAnimValues(dataView, sequences, animations, header.numBones);
    const slicedAnimValues1 = (animValues.array as Int16Array).slice(0, 1000);
    const slicedAnimValues2 = (animValues.array as Int16Array).slice(10000, 11000);

    expect(slicedAnimValues1).toMatchSnapshot('leet animation values from 0 to 1000');
    expect(slicedAnimValues2).toMatchSnapshot('leet animation values from 10 000 to 11 000');
  });
});

describe('parsing whole model', () => {
  test('just parsing without errors', () => {
    expect(() => {
      ModelParser.parseModel(leetBuffer);
    }).not.toThrowError();
  });

  test('should have all keys in model data', () => {
    const expected = [
      'header',
      'bones',
      'boneControllers',
      'attachments',
      'hitBoxes',
      'sequences',
      'sequenceGroups',
      'bodyParts',
      'textures',
      'skinRef',
      'subModels',
      'meshes',
      'vertices',
      'vertBoneBuffer',
      'triangles',
      'animations',
      'animValues'
    ];

    const modelData: ModelParser.ModelData = ModelParser.parseModel(leetBuffer);
    expect(intersection(Object.keys(modelData), expected)).toEqual(expected);
  });

  test('should detect invalid version of model', () => {
    expect(() => {
      ModelParser.parseModel(ratamahattaBuffer);
    }).toThrowError('Unsupported version of the MDL file');
  });
});
