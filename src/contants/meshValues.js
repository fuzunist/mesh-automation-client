import meshFeatures from "./meshFeatures";

export const initialValues = {
  calculated: {
    diameter: [0, 0],
    apertureSize: [0, 0],
    numberOfSticks: [0, 0],
    frontFilament: 0,
    backFilament: 0,
    leftFilament: 0,
    rightFilament: 0,
    unitOfHeigthWeight: 0,
    unitOfWidthWeight: 0,
    totalHeigthWeight: 0,
    totalWidthWeight: 0,
    unitMeshWeight: 0,
    totalWeight: 0,
  },
  mesh: {
    type: "Döşeme Hasırı",
    code: Object.keys(meshFeatures)[0], // First key in meshFeatures
    name: Object.keys(meshFeatures[Object.keys(meshFeatures)[0]])[0], // First name in the selected code
    height: 500,
    width: 215,
    numberOfHeightBars: 0,
    numberOfWidthBars: 0,
    piece: 1,
  },
  manuelCalculated: {
    numberOfSticks: [0, 0],
    unitOfHeigthWeight: 0,
    unitOfWidthWeight: 0,
    totalHeigthWeight: 0,
    totalWidthWeight: 0,
    unitMeshWeight: 0,
    totalWeight: 0,

    apertureSize: [0, 0],
    frontFilament: 0,
    backFilament: 0,
    leftFilament: 0,
    rightFilament: 0,
  },
  manuelMesh: {
    type: "Özel Hasır",
    height: 500,
    width: 215,
    numberOfHeightBars: 0,
    numberOfWidthBars: 0,
    diameter: [0, 0],
    apertureSize: [0, 0],
    frontFilament: 0,
    backFilament: 0,
    leftFilament: 0,
    rightFilament: 0,
    piece: 1,
  },
};

export const meshTypeOptions = [
  { label: "Döşeme Hasırı", value: "Döşeme Hasırı" },
  { label: "Çit Hasırı", value: "Çit Hasırı" },
  { label: "Perde Hasırı", value: "Perde Hasırı" },
];
