# Crop-Image
Crop images using HTML canvas and store locally using Node/Express

# About
This project gives the user the ability to crop an image to various aspect ratios using vanilla JS (ES6)
This project is made out of [Node-Express generator](https://expressjs.com/en/starter/generator.html) with [EJS](http://ejs.co/) templating and styling using SCSS as the preprocessor. [Nodemon](https://www.npmjs.com/package/nodemon) is also used for live reloading. Uses [Semantic](https://semantic-ui.com) for styling

# Get Started
This requires [Node.js](https://nodejs.org/) v4+ to run. To setup the project you have to first install dependencies preferrably using [Yarn](https://yarnpkg.com/en/).

```
$ git clone https://github.com/mohitvirli/crop-image
$ cd crop-image
$ yarn
```

If you don't have Yarn installed you can install dependencies using `npm i`

To start the server run `yarn start` or `npm start`. The server should be running `http://localhost:3000/`

# Utility
`crop.js` is the file with utility which returns a promise which resolves to the dataURIS of the cropped and the original image. The function comes with signature
```
crop(file, cropDimensions, originalDimensions)
```

 - `file` is image object, 
 - `cropDimensions` of type `[{width: <number>, height: <number>}...]` (Array of crop dimensions for the image to be cropped)
 - `originalDimensions` of type `{width: <number>, height: <number>}` (the original dimensions of the image)

Returns the data in the form of 
```
    {
        1024x728: {
            width: 1024,
            height: 728,
            uri: data:image/png;base64...
        } ...
    }
```

## Routes
There are frontend and backend routes which are as follows

#### Base - `/`
Base route where user can upload the image and get the preview of the cropped images

#### Downloads - `/downloads?id=UNIQUE_KEY`
Downloads page which was redirected from the home page after clicking the download button, `UNIQUE_KEY` is the folder name under which the images are stored

#### Save - `/save` (`POST`)
Backend route to save the images after converting them from dataURIs to Binary images under the folder `/public/images/UNIQUE_KEY`
 The object that is posted should be of type`postObj` - should be of type 
 ```
    {
        1024x728: {
            width: 1024,
            height: 728,
            uri: data:image/png;base64...
        } ...
    }
```
#### Save - `/save?id=UNIQUE_KEY` (`GET`)
Backend route which returns the image urls under the folder `public/images/UNIQUE_KEY/` which are the cropped images

## Constraints
The image uploaded should be of size 1024x1024 and the cropped images are of pre specified size given on the client side. 



## TODOs
 - Write webpack config to convert `crop.js` to a library to make it useable for cross platforms
 - Have to write a script to transpile the JS (ES6) to support older browsers
 - Write a build script
