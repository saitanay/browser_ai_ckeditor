/**
 * @file
 * Webpack configuration for Browser AI CKEditor 5 plugin.
 */

const path = require('node:path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
      moduleIds: 'named',
    },
    entry: {
      path: path.resolve(__dirname, 'js/ckeditor5_plugins/browserAi/src/index.js'),
    },
    output: {
      path: path.resolve(__dirname, 'js/build'),
      filename: 'browserAi.js',
      library: ['CKEditor5', 'browserAi'],
      libraryTarget: 'umd',
      libraryExport: 'default',
    },
    plugins: [
      new webpack.BannerPlugin('cspell:disable'),
      new webpack.DllReferencePlugin({
        manifest: require(
          path.resolve(
            __dirname,
            'node_modules/ckeditor5/build/ckeditor5-dll.manifest.json'
          )
        ),
        scope: 'ckeditor5/src',
        name: 'CKEditor5.dll',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.svg$/,
          type: 'asset/source',
        },
      ],
    },
  };
};
