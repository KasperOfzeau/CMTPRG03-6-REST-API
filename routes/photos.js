const express = require("express");
const router = express.Router();
const Photo = require('../models/photos');

//Check if accept header is correct except for options method
router.use('/', function (req, res, next) {
    if (req.method == 'OPTIONS' || req.get('Accept') == "application/json") {
        next();
    } else {
        res.status(400).send();
    }
});

//Add headers before the routes are defined
router.use('/', function (req, res, next) {
    // Website(s) to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Pass to next layer
    next();
});

//Getting all
router.get('/photos', async (req, res) => {
    Photo.find({}, function (err, photos) {
        if (err) {
            res.status(500).json({
                message: err.message
            });
        }
        else {
            // Pagination
            let start;
            let limit;

            // If exists get start and limit from req
            if (req.query.start && req.query.limit) {
                start = parseInt(req.query.start);
                limit = parseInt(req.query.limit);
            }
            // If start and limit not exists
            else {
                start = 1;
                limit = photos.length;
                console.log("No start and limit are given.");
            }

            let totalItems = photos.length;
            let totalPages = Math.ceil(photos.length / limit);

            let firstPage;
            let lastPage;
            let prevPage;
            let nextPage;

            let currentItems;
            let currentPage;

            if (totalPages == 1) {
                firstPage = lastPage = prevPage = nextPage = currentPage = 1;
                currentItems = photos.length;
            }

            else {
                currentPage = Math.ceil(start / limit);
                if (currentPage == totalPages) {
                     currentItems = totalItems - ((totalPages - 1) * limit); 
                } else { 
                    currentItems = limit; 
                }

                firstPage = 1;
                lastPage = (totalPages - 1) * limit + 1;

                if (currentPage == 1) { 
                    prevPage = 1; 
                } else { 
                    prevPage = start - limit; 
                }

                if (currentPage == totalPages) {
                    nextPage = start; 
                } else {
                    nextPage = start + limit; 
                }
            }

            let collection = {
                "items": [],
                "_links": {
                    "self": { "href": `http://${req.headers.host}/api/photos` },
                    "collection": { "href": `http://${req.headers.host}/api/photos` }
                },
                "pagination": {
                    "currentPage": currentPage,
                    "currentItems": currentItems,
                    "totalPages": totalPages,
                    "totalItems": totalItems,
                    "_links": {
                        "first": {
                            "page": 1,
                            "href": `http://${req.headers.host}/api/photos?start=${firstPage}&limit=${limit}`
                        },
                        "last": {
                            "page": 1,
                            "href": `http://${req.headers.host}/api/photos?start=${lastPage}&limit=${limit}`
                        },
                        "previous": {
                            "page": 1,
                            "href": `http://${req.headers.host}/api/photos?start=${prevPage}&limit=${limit}`
                        },
                        "next": {
                            "page": 1,
                            "href": `http://${req.headers.host}/api/photos?start=${nextPage}&limit=${limit}`
                        }
                    }
                }
            }
            let photosOnPage = [];
            if (totalPages == 1) {
                photosOnPage = photos;
            }
            else {
                let startSlice = start - 1;
                let endSlice = start + limit - 1;
                photosOnPage = photos.slice(startSlice, endSlice);
            }

            for (let photo of photosOnPage) {
                let photoItem = photo.toJSON();

                photoItem._links = {
                    "self": { "href": `http://${req.headers.host}/api/photos/` + photoItem._id },
                    "collection": { "href": `http://${req.headers.host}/api/photos` }
                },
                    collection.items.push(photoItem);
            }
            res.status(200).json(collection)
        }
    })
});
//Gettubg options
router.options('/photos', (req, res) => {
    res.header("Allow", "GET,POST,OPTIONS")
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.send();
});
//Getting one
router.get('/photos/:id', getPhoto, (req, res) => {
    let photo = res.photo;
    let photoItem = photo.toJSON();
    photoItem._links = {
        "self": {
            "href": `http://${req.headers.host}/api/photos/` + photoItem._id
        },
        "collection": {
            "href": `http://${req.headers.host}/api/photos`
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
        });
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
        });
    }
});
//Update everything
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
        });
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
        });
    }
});
//Gettubg options
router.options('/photos/:id', (req, res) => {
    res.header("Allow", "GET,PATCH,PUT,DELETE,OPTIONS")
    res.header("Access-Control-Allow-Methods", "GET,PATCH,PUT,DELETE,OPTIONS");
    res.send();
});
//Get photo from database
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