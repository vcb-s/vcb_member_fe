declare module 'fibers';
declare module 'masonry-layout';
declare module 'intersection-observer';

declare module '*.scss' {
  interface T_CSSModule {
    [key: string]: string;
  }

  const CSSModule: T_CSSModule;

  export default CSSModule;
}
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';

interface Window {
  IntersectionObserver?: any;
}
