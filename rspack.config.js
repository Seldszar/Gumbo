require("dotenv/config");

const fs = require("fs");
const path = require("path");

const { rspack } = require("@rspack/core");
const { EntryWrapperPlugin } = require("@seldszar/yael");
const { merge } = require("webpack-merge");

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
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".json", ".wasm"],
      tsConfig: path.resolve("tsconfig.json"),
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
      new rspack.EnvironmentPlugin({
        TWITCH_CLIENT_ID: undefined,
        TWITCH_REDIRECT_URI: undefined,
      }),
      new rspack.CopyRspackPlugin({
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
                relativePath,
              )}`;
            },
          },
        ],
      }),
    ],
  };

  return [
    merge(commonConfig, {
      target: "web",
      entry: {
        popup: "./src/browser/pages/popup.tsx",
        settings: "./src/browser/pages/settings.tsx",
      },
      experiments: {
        css: true,
      },
      plugins: [
        new EntryWrapperPlugin({
          template: "./src/browser/entry-template.tsx",
          test: /\.tsx$/,
        }),
        new rspack.HtmlRspackPlugin({
          template: "./src/browser/entry-template.html",
          filename: "popup.html",
          chunks: ["popup"],
        }),
        new rspack.HtmlRspackPlugin({
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
