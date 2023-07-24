require("dotenv/config");

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const { EntryWrapperPlugin } = require("@seldszar/yael");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const localeReplacements = [
  {
    source: "nb_NO",
    target: "no",
  },
];

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  const commonConfig = {
    devtool: isDevelopment ? "inline-cheap-source-map" : false,
    output: {
      path: path.resolve("dist"),
      publicPath: "",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
      alias: {
        "~": path.resolve("src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
      ],
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        TWITCH_CLIENT_ID: undefined,
        TWITCH_REDIRECT_URI: undefined,
        SENTRY_DSN: null,
      }),
      new webpack.ProvidePlugin({
        browser: "webextension-polyfill",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "**/*",
            context: "public",
          },
          {
            from: "**/*",
            context: `overrides/${env.platform}`,
          },
          {
            from: "**/*",
            context: "locales",
            filter: (resourcePath) => {
              try {
                const data = JSON.parse(fs.readFileSync(resourcePath, "utf-8"));

                if (data.extensionName == null) {
                  return false;
                }
              } catch {} // eslint-disable-line no-empty

              return true;
            },
            to: (pathData) => {
              const relativePath = path
                .relative(pathData.context, pathData.absoluteFilename)
                .replace(/\\/g, "/");

              return `_locales/${localeReplacements.reduce(
                (result, { source, target }) => result.replace(source, target),
                relativePath
              )}`;
            },
          },
        ],
      }),
    ],
    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    },
  };

  return [
    merge(commonConfig, {
      target: "web",
      entry: {
        popup: "./src/browser/pages/popup.tsx",
        settings: "./src/browser/pages/settings.tsx",
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"],
          },
        ],
      },
      optimization: {
        splitChunks: {
          name: "commons",
          chunks: "all",
        },
      },
      plugins: [
        new EntryWrapperPlugin({
          template: "./src/browser/entry-template.tsx",
          test: /\.tsx$/,
        }),
        new HtmlWebpackPlugin({
          template: "./src/browser/entry-template.html",
          filename: "popup.html",
          chunks: ["popup"],
        }),
        new HtmlWebpackPlugin({
          template: "./src/browser/entry-template.html",
          filename: "settings.html",
          chunks: ["settings"],
        }),
      ],
    }),
    merge(commonConfig, {
      target: "webworker",
      entry: {
        background: "./src/background/index.ts",
      },
    }),
  ];
};
