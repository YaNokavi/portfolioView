// Разрешаем импорты SCSS модулей
declare module "*.module.scss" {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

// Заодно сразу добавим поддержку обычного CSS и SCSS (не модулей)
declare module "*.scss";
declare module "*.css";

// И поддержку картинок/SVG (пригодится для иконок крипты)
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg" {
  import React from "react";
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
