var express = require('express');
var router = express.Router();
var imageDataURI = require('image-data-uri');
var shortid = require('shortid');

router.post('/', function (req, res) {
  const filePath = './public/images/' + shortid.generate();

  const promiseArray = Object.keys(req.body.dataURIs).map(key => {
    const uri = req.body.dataURIs[key];
    return imageDataURI.outputFile(uri, filePath + '/' + key);
  });

  Promise.all(promiseArray).then(urls => {
    res.status(200).send(urls);
  })

});


module.exports = router;
