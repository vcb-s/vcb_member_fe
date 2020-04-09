const webpDetect: Promise<boolean> = new Promise((resolve) => {
  let image = new Image();
  image.onload = image.onerror = () => {
    if (image.height === 1) {
      resolve(true);
    } else {
      resolve(false);
    }
  };
  image.src =
    'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==';
});

export { webpDetect };
export default webpDetect;
