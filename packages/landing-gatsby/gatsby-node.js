const path = require('path');

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  const pages = [
    { path: '/login', component: path.resolve('./src/ALM/pages/login.js') },
    { path: '/logged-out', component: path.resolve('./src/ALM/pages/loggedout.js') },
    { path: '/admin', component: path.resolve('./src/ALM/pages/admin.js') },
    { path: '/account', component: path.resolve('./src/ALM/pages/account.js') },
    { path: '/aggregator', component: path.resolve('./src/ALM/pages/aggregator.js') },
    { path: '/callback', component: path.resolve('./src/ALM/pages/callback.js') },
  ];

  pages.forEach(({ path: pagePath, component }) => {
    createPage({
      path: pagePath,
      component,
    });
  });
};

exports.onCreateWebpackConfig = ({ actions, stage, plugins, getConfig }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });

  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /auth0-js/,
            use: 'null-loader',
          },
        ],
      },
    });
  }

  if (stage === 'build-javascript' || stage === 'develop') {
    const config = getConfig();

    const miniCss = config.plugins.find(
      (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
    );

    if (miniCss) {
      miniCss.options.ignoreOrder = true;
    }

    actions.replaceWebpackConfig(config);

    actions.setWebpackConfig({
      plugins: [plugins.provide({ process: 'process/browser' })],
    });
  }
};