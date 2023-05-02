'use strict';

module.exports = function (/* environment, appConfig */) {
  // See https://zonkyio.github.io/ember-web-app for a list of
  // supported properties

  return {
    name: 'Set the Game',
    short_name: 'Set',
    description: 'Digital version of the card game, Set',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#673ab7',
    theme_color: '#673ab7',
    icons: [
      {
        src: '/images/logo/logo.png',
        sizes: '180x180',
      },
      {
        src: '/images/logo/splash-screen.png',
        sizes: '512x512',
      },
    ],
    ms: {
      tileColor: '#673ab7',
    },
  };
};
