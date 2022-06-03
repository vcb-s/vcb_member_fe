let isSupport: boolean;

const webpDetect = new Promise<boolean>((resolve) => {
  if (isSupport !== undefined) {
    resolve(isSupport);
    return;
  }

  let image = new Image();
  image.onload = image.onerror = () => {
    if (image.height === 1) {
      isSupport = true;
    } else {
      isSupport = false;
    }

    resolve(isSupport);
  };
  image.src =
    "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==";
});

export { webpDetect };
export default webpDetect;
