const express = require("express");
const router = express.Router();
const Photo = require('../models/photos');

//Getting all 
router.get('/', async (req, res) => {
    try {
        const photos = await Photo.find();
        res.json(photos);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
});
//Getting one
router.get('/:id', getPhoto, (req, res) => {
    res.json(res.photo);
});
//Creating one
router.post('/', async (req, res) => {
    const photo = new Photo({
        title: req.body.title,
        image: req.body.image,
        category: req.body.category
    })

    try {
        const newPhoto = await photo.save();
        res.status(201).json(newPhoto);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
});
//Updating one
router.patch('/:id', getPhoto, async (req, res) => {
    if(req.body.title != null) {
        res.photo.title = req.body.title;
    }
    if(req.body.image != null) {
        res.photo.image = req.body.image;
    }
    if(req.body.category != null) {
        res.photo.category = req.body.category;
    }

    try {
        const updatedPhoto = await res.photo.save();
        res.json(updatedPhoto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
//Deleting one
router.delete('/:id', getPhoto, async (req, res) => {
    try {
        await res.photo.remove();
        res.json({ message: "Deleted photo"});
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
});

async function getPhoto(req, res, next) {
    let photo;
    try {
        photo = await Photo.findById(req.params.id);
        if(photo == null) {
            return res.status(404).json({ message: "Cannot find photo"});
        }
    } catch (err) {
        return res.status(500).json({ message: err.message});
    }

    res.photo = photo;
    next();
}

module.exports = router;