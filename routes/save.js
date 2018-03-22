var express = require('express');
var router = express.Router();
var imageDataURI = require('image-data-uri'); // To convert dataURIs to binary images
const fs = require('fs');
var shortid = require('shortid'); // creates unique folder name

/**
 * Post request which stores the converted image in the folder (unique name)
 * with the names corresponding to the resolution
 */
router.post('/', function (req, res) {
  const folder = shortid.generate(); // Creates unique name
  const filePath = './public/images/' + folder; // storage path

  // for every data uri returns a promise which resolves to the url of the image
  // after converting the image successfully
  const promiseArray = Object.keys(req.body.dataURIs).map(key => {
    const uri = req.body.dataURIs[key].uri; // get the uri

    // outputFile utility of imageDataUri returns a promise
    return imageDataURI.outputFile(uri, filePath + '/' + key);
  });

  // Resolve all the promises and then return the data
  Promise.all(promiseArray).then(urls => {
    res.status(200).send({
      urls,
      folder
    });
  })

});

/**
 * Gets the urls of the specified folder
 */
router.get('/', function (req, res, next) {

  const folder = req.query.id; // Gets the folder name

  if (!folder) next(err);

  const pathName = `./public/images/${folder}`; // Creates the pathname

  // Reads the directory corresponding to the filepath and returns the files
  fs.readdir(pathName, (err, files) => {
    if (err || !files) next(err);

    // Returns the image links to the images present in the folder
    res.status(200).send(
      files.map(file => `/images/${folder}/${file}`)
    )
  })
});


module.exports = router;
