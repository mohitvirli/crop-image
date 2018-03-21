var express = require('express');
var router = express.Router();
var imageDataURI = require('image-data-uri');
var shortid = require('shortid');

router.post('/', function (req, res) {
  const filePath = './public/images/' + shortid.generate();

  imageDataURI.outputFile(req.body.uri, filePath)
    .then(url => res.status(200).send(url));
});


module.exports = router;
