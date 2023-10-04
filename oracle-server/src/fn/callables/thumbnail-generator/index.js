const express = require('express');
const router = express.Router();

const {
    video,
    image,
} = require('./api.js');

router.post('/video', async (req, res) => {
    await authorize();

    const data = await video(req.body);
    res.json(data);
});

router.post('/image', async (req, res) => {
    await authorize();

    const data = await image(req.body);
    res.json(data);
});

module.exports = router;

