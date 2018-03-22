
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

const fileToRead = document.querySelector('input[type=file]');

fileToRead.addEventListener("change", function(event) {

  const file = event.target.files[0]; // Perform length check
  crop(file, ORIGINAL_DIMENSIONS, CROP_DIMENSIONS)
    .then(displayContent)
    .catch(toggleError)
  ;

}, false);

function displayContent(data) {
  toggleError();

  const preview = document.querySelector('#preview');
  const croppedImagesWrapper = document.querySelector('#cropped-images-wrapper');

  let previewHTML = '', croppedImagesHTML = '';
  Object.keys(data).forEach(key => {
    const img = data[key];
    const { width, height } = ORIGINAL_DIMENSIONS;

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
  preview.innerHTML = previewHTML;
  croppedImagesWrapper.innerHTML = croppedImagesHTML;

  downloadImage(data);
}


function saveImages(dataURIs) {
  return axios.post('/save', {
    dataURIs
  })
}

function toggleError(err) {
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

function downloadImage(data) {
  const downloadImagesButton = document.querySelector('#download-images');
  downloadImagesButton.addEventListener("click", function() {
    saveImages(data).then(res => {
      document.location.href = '/downloads?' + res.data.folder;
    });
  });
}