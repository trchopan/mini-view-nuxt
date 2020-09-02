export const imgDir = '';

const author = 'Chop @choptr';

export const metaKeywords = [
  'mini view',
  'control view',
  'youtube player',
  'clock',
].join();

export const title = 'Mini View';
export const description =
  'I have a spare iPad mini so i decided to make a web app that i can control it to play youtube video (mainly music) from any where and show the date time, weather, etc. from all api source.';
export const locale = 'en_US';
export const url = 'https://mini-view.web.app';
export const image = imgDir + '/favicons/favicon-96x96.png';

const og = {
  type: 'website',
  locale,
  title,
  description,
  url,
  img: image,
  'image:alt': description,
};
const twitter = {
  'twitter:card': 'summary',
  'twitter:site': url,
  'twitter:title': title,
  'twitter:image': image,
};

const nameContentMapper = _ =>
  Object.entries(og).map(x => ({name: x[0], content: x[1]}));

export const meta = [
  {charset: 'utf-8'},
  {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
  },
  {hid: 'description', name: 'description', content: description},
  {name: 'keywords', content: metaKeywords},
  {name: 'metakeywords', content: metaKeywords},
  {name: 'news_keywords', content: metaKeywords},
  {name: 'robots', content: 'index,follow'},
  {name: 'revisit-after', content: '1 days'},
  {name: 'author', content: author},
  // {
  //   name: 'copyright',
  //   content: 'Copyright (c) 2019 Qtee2 Pte Ltd., All rights reserved.',
  // },
  ...nameContentMapper(og),
  ...nameContentMapper(twitter),
];

export const link = [
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Play:400,500,700',
  },
  {
    rel: 'manifest',
    href: imgDir + '/favicons/manifest.json',
  },
  {
    rel: 'shortcut icon',
    type: 'image/x-icon',
    href: imgDir + '/favicons/favicon.ico',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '57x57',
    href: imgDir + '/favicons/apple-icon-57x57.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '60x60',
    href: imgDir + '/favicons/apple-icon-60x60.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '72x72',
    href: imgDir + '/favicons/apple-icon-72x72.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '76x76',
    href: imgDir + '/favicons/apple-icon-76x76.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '114x114',
    href: imgDir + '/favicons/apple-icon-114x114.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '120x120',
    href: imgDir + '/favicons/apple-icon-120x120.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '144x144',
    href: imgDir + '/favicons/apple-icon-144x144.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '152x152',
    href: imgDir + '/favicons/apple-icon-152x152.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: imgDir + '/favicons/apple-icon-180x180.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: imgDir + '/favicons/android-icon-192x192.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: imgDir + '/favicons/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '96x96',
    href: imgDir + '/favicons/favicon-96x96.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: imgDir + '/favicons/favicon-16x16.png',
  },
];

export const script = [
  // {
  // src: "https://unpkg.com/aos@next/dist/aos.js"
  // }
];
