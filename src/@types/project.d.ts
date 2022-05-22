declare module "*.scss" {
  interface T_CSSModule {
    [key: string]: string;
  }

  const CSSModule: T_CSSModule;

  export default CSSModule;
}
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
