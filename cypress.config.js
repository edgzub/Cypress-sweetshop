module.exports = {
  e2e: {
    baseUrl: 'https://sweetshop.netlify.app',
    viewportWidth: 1280,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    video: false,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      // place reporters or other node event hooks here if needed
    },
  },
};
