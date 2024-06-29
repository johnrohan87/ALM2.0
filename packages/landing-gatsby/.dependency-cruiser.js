module.exports = {
    forbidden: [
      {
        name: 'no-circular',
        severity: 'error',
        from: {},
        to: {
          circular: true
        }
      }
    ],
    options: {
      doNotFollow: {
        path: 'node_modules',
      }
    }
  };
  