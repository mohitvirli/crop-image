var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var imageDataURI = require('image-data-uri');
const fs = require('fs');
var shortid = require('shortid');

router.get('/', function (req, res, next) {
  const folder = req.url.split('?')[1];
  if (!folder) next(err);
  const pathName = `./public/images/${folder}`;
  fs.readdir(pathName, (err, files) => {
    if (err || !files) next(err);
    res.status(200).send(
      files.map(file => `/images/${folder}/${file}`)
    )
  })
});

router.post('/', function (req, res) {
  const folder = shortid.generate();
  const filePath = './public/images/' + folder;

  const promiseArray = Object.keys(req.body.dataURIs).map(key => {
    const uri = req.body.dataURIs[key].uri;
    return imageDataURI.outputFile(uri, filePath + '/' + key);
  });

  Promise.all(promiseArray).then(urls => {
    res.status(200).send({
      urls,
      folder
    });
  })

});


module.exports = router;
