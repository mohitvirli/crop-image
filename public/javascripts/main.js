/**
 * Client side JavaScript for using the utility crop.js
 */

// Set Global constants for the cropDimensions and the originalDimensions
const ORIGINAL_DIMENSIONS = {
  width: 1024,
  height: 1024
};

const CROP_DIMENSIONS = [
  {width: 755, height: 450},
  {width: 365, height: 450},
  {width: 365, height: 212},
  {width: 380, height: 380}
];


// Get the file reader element
const fileToRead = document.querySelector('#file-upload');

// Attach the event listener
fileToRead.addEventListener("change", function(event) {

  const file = event.target.files[0]; // Perform length check

  /**
   * Use the crop utility from crop.js
   * handles the result using displayContent
   * handles the error usign errorHandler
   */
  crop(file, CROP_DIMENSIONS, ORIGINAL_DIMENSIONS)
    .then(displayContent)
    .catch(errorHandler)
  ;

}, false);

/**
 * Displays the images
 * @param data, the dataURI object returned from crop util
 */
function displayContent(data) {

  // Throws for no error
  errorHandler();

  // Get the DOM nodes to display the preview of the images
  const preview = document.querySelector('#preview');
  const croppedImagesWrapper = document.querySelector('#cropped-images-wrapper');

  let previewHTML = '', croppedImagesHTML = '';
  Object.keys(data).forEach(key => {
    const img = data[key];
    const { width, height } = ORIGINAL_DIMENSIONS;

    // If original Image
    if (img.width === width && img.height === height) {
      previewHTML = `
        <p>Original Image (${width}x${height})</p>
        <img src='${img.uri}' alt='' class='preview-image'>
      `
    } else {
      croppedImagesHTML += `
        <div class='cropped-image-container'>
          <p>${img.width}x${img.height}</p>
          <img src="${img.uri}" alt="" class='cropped-image'>
        </div>
      `;
    }
  });

  // Set Html
  preview.innerHTML = previewHTML;
  croppedImagesWrapper.innerHTML = croppedImagesHTML;

  downloadImage(data); // Activates the download button
}

/**
 * Saves the image to the backend
 * @param dataURIs
 * @returns A promise
 */

function saveImages(dataURIs) {
  return axios.post('/save', {
    dataURIs
  });
}

/**
 * Handles the error
 * @param err
 */

function errorHandler(err) {
  // Throws error if err is present
  const errorHtml = document.querySelector('#image-error');
  const downloadImagesButton = document.querySelector('#download-images');
  if (err) {
    errorHtml.innerHTML = err;
    errorHtml.style.visibility = 'visible';
    downloadImagesButton.style.visibility = 'hidden';
  } else {
    errorHtml.style.visibility = 'hidden';
    downloadImagesButton.style.visibility = 'visible';
  }
}

/**
 * Activate the download button which redirects to the specified download page
 * @param data
 */
function downloadImage(data) {
  const downloadImagesButton = document.querySelector('#download-images');
  downloadImagesButton.addEventListener("click", function() {
    saveImages(data).then(res => {
      document.location.href = '/downloads?id=' + res.data.folder; // Redirects to the download page with folder link
    });
  });
}