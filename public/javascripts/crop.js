/**
 * Crop utility which returns a promise with
 * the data uris(image srcs) of the original and the cropped images
 * @param file (the image object)
 * @param cropDimensions (Array of crop dimensions for the image to be cropped)
 *        of type [{width: <number>, height: <number>}...]
 * @param originalDimensions (the original dimensions of the image, if not throw error)
 *        of type {width: <number>, height: <number>}
 * @returns Promise which resolves to data uris of the images
 *        of type [{<key>: {
 *          uri: <string> (base64 encoded image uri)
 *          width: <number>
 *          height: <number>
 *        }}...] where key = widthxheight
 */

function crop(file, cropDimensions, originalDimensions) {

  // Returns a new Promise object
  return new Promise((resolve, reject) => {

    if (!file || !cropDimensions) reject('Some error occured!');

    const canvas = document.createElement('canvas'); // Creates a temporary canvas used for cropping

    const dataURIs = {}; // Return object

    /**
     * Reads the file and converts the file to image for manipulations
     */
    function init() {
      const reader  = new FileReader();

      reader.onloadend = function () {
        // Pass the dataURI to the function which checks for errors and crops
        checkImageSizeAndCrop(reader.result);
      };

      reader.readAsDataURL(file);
    }

    init(); // Initial call of the function

    /**
     * Checks the uri for width and height and loads the file to a html element
     * for cropping
     * @param uri
     */
    function checkImageSizeAndCrop(uri) {

      const imageObj = new Image(); // Creates an HTML img element
      imageObj.src = uri;
      imageObj.onload = function () {
        const { width, height } = originalDimensions;

        /**
         * Checks for width and height error, if no error, crop the image
         */
        if (this.width === width && this.height === height) {
          cropAllImages(imageObj);
        } else reject(`Image should be of size ${width}x${height}`);

      };

    }

    /**
     * Crops for every cropDimension given
     * @param mainSourceImage, the new original image Object
     */

    function cropAllImages(mainSourceImage) {
      const { width, height } = originalDimensions;

      // Set the original image data
      dataURIs[`${width}x${height}`] = {
        uri: mainSourceImage.src,
        width,
        height
      };

      // Iterate over the given crop dimensions
      cropDimensions.forEach(d => {
        let img = new Image(d.width, d.height);
        img.src = cropImage(mainSourceImage, d.width, d.height); // Utility which returns data uri for the cropped image

        // Push the result to the return object
        dataURIs[`${d.width}x${d.height}`] = {
          uri: img.src,
          width: d.width,
          height: d.height
        };
      });

      resolve(dataURIs); // Resolves (returns) the dataURIs object containing the uris of the images
    }

    /**
     * Crop a single object using the original Image object and the canvas
     * @param imageObj, the original image object
     * @param width, width to be cropped
     * @param height, height to be cropped
     * @returns {string}, the dataURI of the cropped image
     */
    function cropImage(imageObj, width, height) {

      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      const sourceX = (originalDimensions.width - width) / 2;
      const sourceY = (originalDimensions.height - height) / 2;

      // Uses the canvas' drawImage utility to crop.
      // Read more - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      context.drawImage(imageObj, sourceX, sourceY, width, height, 0, 0, width, height);

      return canvas.toDataURL(file.type); // Converts the image to data URI
    }

  });
}
