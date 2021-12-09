const express = require("express");
const router = express.Router();
const Photo = require('../models/photos');

router.use('/', function(req, res, next) {
  if (req.get('Accept') == "application/json") {
    next();
  } else {
    res.status(400).send();
  }
});

//Getting all
router.get('/photos', async (req, res) => {

  try {
    const photos = await Photo.find();
    let photosCollection = {
      "items": [],
      "_links": {
        "self": {
          "href": "http://145.24.222.98:8080/api/photos"
        },
        "collection": {
          "href": "http://145.24.222.98:8080/api/photos"
        }
      },
      "pagination": {
        "message": "nog te doen"
      }
    }
    for (let photo of photos) {
      let photoItem = photo.toJSON();
      photoItem._links = {
        "self": {
          "href": "http://145.24.222.98:8080/api/photos/" + photoItem._id
        },
        "collection": {
          "href": "http://145.24.222.98:8080/api/photos"
        }
      };
      photosCollection.items.push(photoItem);
    }
    res.json(photosCollection);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
//Gettubg options
router.options('/photos', (req, res) => {
  res.header("Allow", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
});
//Getting one
router.get('/photos/:id', getPhoto, (req, res) => {
  let photo = res.photo;
  let photoItem = photo.toJSON();
  photoItem._links = {
    "self": {
      "href": "http://145.24.222.98:8080/api/photos/" + photoItem._id
    },
    "collection": {
      "href": "http://145.24.222.98:8080/api/photos"
    }
  };
  res.json(photoItem);
});
//Creating one
router.post('/photos', async (req, res) => {
  const photo = new Photo({
    title: req.body.title,
    image: req.body.image,
    category: req.body.category
  });
  try {
    const newPhoto = await photo.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(400).json({
      message: err.message
    }).send();
  }
});
//Updating one
router.patch('/photos/:id', getPhoto, async (req, res) => {
  if (req.body.title != null) {
    res.photo.title = req.body.title;
  }
  if (req.body.image != null) {
    res.photo.image = req.body.image;
  }
  if (req.body.category != null) {
    res.photo.category = req.body.category;
  }

  try {
    const updatedPhoto = await res.photo.save();
    res.json(updatedPhoto);
  } catch (err) {
    res.status(400).json({
      message: err.message
    }).send();
  }
});
router.put('/photos/:id', getPhoto, async (req, res) => {
  if (req.body.title != null) {
    res.photo.title = req.body.title;
  }
  if (req.body.image != null) {
    res.photo.image = req.body.image;
  }
  if (req.body.category != null) {
    res.photo.category = req.body.category;
  }

  try {
    const updatedPhoto = await res.photo.save();
    res.json(updatedPhoto);
  } catch (err) {
    res.status(400).json({
      message: err.message
    }).send();
  }
});
//Deleting one
router.delete('/photos/:id', getPhoto, async (req, res) => {
  try {
    await res.photo.remove();
    res.status(204).json({
      message: "Deleted photo"
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    }).send();
  }
});

//Gettubg options
router.options('/photos/:id', (req, res) => {
  res.header("Allow", "GET,POST,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
});

async function getPhoto(req, res, next) {
  let photo;
  try {
    photo = await Photo.findById(req.params.id);
    if (photo == null) {
      return res.status(404).json({
        message: "Cannot find photo"
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }

  res.photo = photo;
  next();
}

module.exports = router;