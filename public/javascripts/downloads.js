/**
 * Client side js for downloads page
 */

const folder = document.location.search.split('?')[1]; // Captures the url slug

if (folder) {
  getData(folder)
    .then(setData)
    .catch(err => {throw err;});
}

/**
 * Gets the backend
 * @param folder
 * @returns {Promise<T>}
 */
function getData(folder) {
  return axios.get(`/save?${folder}`)
    .then(
      res => res.data
    );
}

function setData(data) {
  const croppedImagesWrapper = document.querySelector('#cropped-images-wrapper');
  let croppedImagesHTML = '';

  data.forEach(image => {

    // Get the width and height by matching with the file name which is of the type /path/to/1024x768.png
    const [width, height] = image.match(/\d+x\d+/)[0].split('x');

    croppedImagesHTML += `
      <a href='${image}' class='cropped-image-container'>
        <p>${width}x${height}</p>
        <img src='${image}' alt="" class='cropped-image'>
      </a>
    `;
  });

  croppedImagesWrapper.innerHTML = croppedImagesHTML; // Insert the HTML
}
