declare module 'fibers';
declare module 'masonry-layout';
declare module 'intersection-observer';

declare module '*.scss';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';

interface Window {
  IntersectionObserver?: any;
}
