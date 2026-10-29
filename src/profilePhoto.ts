// A real photo of Rashil for the About page. Nothing renders while this is null.
//
// To add one: save a photo of yourself (about 800px on the long side, JPEG or WebP)
// as src/assets/rashil.jpg, then replace the export below with:
//
//   import photo from './assets/rashil.jpg';
//   export const profilePhoto: ProfilePhoto = {
//     src: photo,
//     width: 600, // the image's real pixel size
//     height: 800,
//     alt: 'Rashil Shibakoti',
//   };

export type ProfilePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const profilePhoto: ProfilePhoto | null = null;
