
function crop(file, originalDimensions, cropDimensions) {

  return new Promise((resolve, reject) => {

    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';

    const dataURIs = {};

    function init() {
      const reader  = new FileReader();

      reader.onloadend = function () {
        checkImageSizeAndCrop(reader.result);
      };

      reader.readAsDataURL(file); //TODO: check if image?
    }

    init();

    function checkImageSizeAndCrop(uri) {

      const imageObj = new Image();
      imageObj.src = uri;
      imageObj.onload = function () {
        const { width, height } = originalDimensions;
        if (this.width === width && this.height === height) {
          cropAllImages(imageObj);
        } else reject(`Image should be of size ${width}x${height}`);

      };

    }

    function cropAllImages(mainSourceImage) {
      const { width, height } = originalDimensions;

      dataURIs[`${width}x${height}`] = {
        uri: mainSourceImage.src,
        width,
        height
      };

      cropDimensions.forEach(d => {
        let img = new Image(d.width, d.height);
        img.src = cropImage(mainSourceImage, d.width, d.height);
        dataURIs[`${d.width}x${d.height}`] = {
          uri: img.src,
          width: d.width,
          height: d.height
        };
      });

      resolve(dataURIs);
    }

    function cropImage(imageObj, width, height) {

      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      const sourceX = (originalDimensions.width - width) / 2;
      const sourceY = (originalDimensions.height - height) / 2;

      context.drawImage(imageObj, sourceX, sourceY, width, height, 0, 0, width, height);

      return canvas.toDataURL('image/png'); // TODO: check for JPEG/PNG?
    }

  });
}

window.crop = crop;