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
          use: {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    development: isDevelopment,
                    runtime: "automatic",
                  },
                },
              },
            },
          },
        },
      ],
    },
    plugins: [
      new rspack.EnvironmentPlugin({
        SENTRY_DSN: null,

        TWITCH_CLIENT_ID: undefined,
        TWITCH_REDIRECT_URI: undefined,
      }),
      new rspack.ProvidePlugin({
        browser: "webextension-polyfill",
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
      experiments: {
        css: true,
      },
      entry: {
        popup: "./src/browser/pages/popup.tsx",
        settings: "./src/browser/pages/settings.tsx",
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: "postcss-loader",
          },
        ],
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
