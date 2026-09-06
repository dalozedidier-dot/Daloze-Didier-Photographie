const felinIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33
];

const paysageIds = Array.from({ length: 31 }, (_, index) => index + 1);

window.PHOTO_DATA = [
  ...felinIds.map((id) => ({
    src: `F%C3%A9lins/${id}.jpg`,
    title: `Félin ${String(id).padStart(2, "0")}`,
    category: "felins",
    categoryLabel: "Félins",
    alt: `Photographie de félin ${String(id).padStart(2, "0")}`
  })),
  ...paysageIds.map((id) => ({
    src: `Paysage/${id}.jpg`,
    title: `Paysage ${String(id).padStart(2, "0")}`,
    category: "paysage",
    categoryLabel: "Paysages",
    alt: `Photographie de paysage ${String(id).padStart(2, "0")}`
  }))
];
