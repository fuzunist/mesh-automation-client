export const variable_1 = (mesh) =>
  mesh.type === "Perde Hasırı" &&
  (mesh.height === 330 ||
    mesh.height === 335 ||
    mesh.height === 336 ||
    mesh.height === 345);

export const variable_2 = (mesh) =>
  mesh.type === "Perde Hasırı" && mesh.height === 335;
export const variable_3 = (mesh) =>
  mesh.type === "Perde Hasırı" && mesh.height === 336;
export const variable_4 = (mesh) =>
  mesh.type === "Perde Hasırı" && (mesh.height === 330 || mesh.height === 345);
