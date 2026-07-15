import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

// Расширяем тип конфига, чтобы TypeScript не ругался на devServer
interface CustomWebpackConfig extends webpack.Configuration {
  devServer?: DevServerConfiguration;
}

export default (env: any): CustomWebpackConfig => {
  const mode = env.mode || "development";
  const isDev = mode === "development";
  const port = env.port || 3000;

  return {
    mode,
    // 1. Явно указываем точку входа
    entry: path.resolve(__dirname, "src", "index.tsx"),

    output: {
      filename: "[name].[contenthash].js",
      path: path.resolve(__dirname, "dist"),
      clean: true, // Очищает папку dist перед новой сборкой
    },

    plugins: [
      // 2. Указываем HTML шаблон
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
      }),
    ],

    module: {
      rules: [
        // 3. Учим Webpack понимать TypeScript и JSX
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic", // Это позволяет не писать import React from 'react'
                  },
                },
              },
            },
          },
        },

        {
          test: /\.(s[ac]ss|css)$/i,
          use: [
            // 1. Создает теги <style> в DOM
            "style-loader",
            // 2. Переводит CSS в CommonJS и настраивает модули
            {
              loader: "css-loader",
              options: {
                modules: {
                  // Модули будут работать ТОЛЬКО для файлов, где есть слово ".module."
                  // Обычные файлы (например DashboardPage.scss) останутся глобальными
                  auto: (resPath: string) =>
                    Boolean(resPath.includes(".module.")),
                  // Удобные имена классов для дебага (например: src-widgets-BalanceWidget-ui-BalanceWidget-module__widget--1a2b3)
                  localIdentName: isDev
                    ? "[path][name]__[local]--[hash:base64:5]"
                    : "[hash:base64:8]",
                },
              },
            },
            // 3. Компилирует SCSS в CSS
            "sass-loader",
          ],
        },
      ],
    },

    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      // 4. Тот самый алиас для FSD!
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    // Настройки для удобной разработки
    devtool: isDev ? "inline-source-map" : undefined,
    devServer: isDev
      ? {
          port,
          open: true, // Автоматически открывать браузер
          historyApiFallback: true, // Полезно для React Router (чтобы не было 404 при обновлении страницы)
        }
      : undefined,
  };
};
