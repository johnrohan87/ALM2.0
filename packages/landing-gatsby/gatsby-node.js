/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require('path');

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  createPage({
    path: '/login',
    component: path.resolve('./src/ALM/pages/login.js'),
  });
  createPage({
    path: '/logged-out',
    component: path.resolve('./src/ALM/pages/loggedout.js'),
  });
  createPage({
    path: '/admin',
    component: path.resolve('./src/ALM/pages/admin.js'),
  });
  createPage({
    path: '/account',
    component: path.resolve('./src/ALM/pages/account.js'),
  });
  createPage({
    path: '/aggregator',
    component: path.resolve('./src/ALM/pages/aggregator.js'),
  });
  createPage({
    path: '/rss',
    component: path.resolve('./src/ALM/pages/rss.js'),
  });
  createPage({
    path: '/callback',
    component: path.resolve('./src/ALM/pages/callback.js'),
  });
};

exports.onCreateWebpackConfig = ({ actions, stage, plugins, getConfig }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /auth0-js/,
            use: 'null-loader',
          },
        ],
      },
    })
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
