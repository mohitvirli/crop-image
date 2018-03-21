
const ORIGINAL_WIDTH = 1024,
  ORIGINAL_HEIGHT = 1024;


const fileToRead = document.querySelector('input[type=file]');

fileToRead.addEventListener("change", function(event) {

  const file = event.target.files[0]; // Perform length check
  readImage(file);

}, false);

function readImage(img) {
  const reader  = new FileReader();

  reader.onloadend = function () {
    previewImage(reader.result);
  };

  reader.readAsDataURL(img); //TODO: check if image?
}

function previewImage(uri) {

  const preview = document.querySelector('#preview'); //selects the query named img
  const imageObj = new Image();
  imageObj.src = uri;
  imageObj.onload = function () {
    console.log(this); // TODO: check for size?
    preview.innerHTML = '';
    preview.appendChild(imageObj);
    cropAllImages(imageObj);
  };
}

function cropAllImages(mainSourceImage) {

  const canvas = document.querySelector('#myCanvas1'); // Hidden canvas

  const resolutions = [
    {width: 755, height: 450},
    {width: 365, height: 450},
    {width: 365, height: 212},
    {width: 380, height: 380}
  ];

  resolutions.forEach(d => {
    let img = new Image(d.width, d.height);
    img.src = cropImage(mainSourceImage, d.width, d.height, canvas);
    document.querySelector('#cropped-images-wrapper').appendChild(img); // Selector
  })
}
function cropImage(imageObj, width, height, canvas) {
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  const sourceX = (ORIGINAL_WIDTH - width) / 2;
  const sourceY = (ORIGINAL_HEIGHT - width) / 2;

  context.drawImage(imageObj, sourceX, sourceY, width, height, 0, 0, width, height);

  return canvas.toDataURL('image/png'); // TODO: check for JPEG/PNG?
  // saveImage(dataURI);
}

function saveImage(dataURI) {
  // console.log(dataURI); //TODO: add dimensions and filename
  // axios.post('/save', {
  //   uri: dataURI
  // }).then(function (res) {
  //   console.log(res);
  // })
}