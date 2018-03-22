const folder = document.location.search.split('?')[1];

if (folder) {
  getData(folder).then(setData);
}

function getData(folder) {
  return axios.get(`/save?${folder}`)
    .then(
      res => res.data
    ).catch(err => {throw err;});
}

function setData(data) {
  const croppedImagesWrapper = document.querySelector('#cropped-images-wrapper');
  let croppedImagesHTML = '';

  data.forEach(image => {

    const [width, height] = image.match(/\d+x\d+/)[0].split('x');

    croppedImagesHTML += `
      <a href='${image}' class='cropped-image-container'>
        <p>${width}x${height}</p>
        <img src='${image}' alt="" class='cropped-image'>
      </a>
    `;
  });

  croppedImagesWrapper.innerHTML = croppedImagesHTML;
}


// function getDimensions(url) {
//   return new Promise(function (resolve, reject) {
//     const imageObj = new Image();
//     imageObj.src = url;
//     imageObj.onload = function() {
//       resolve(this);
//     }
//   });
// }

