const Settings = require('../models/Settings');

const getBanner = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBanner = async (req, res) => {
    try {
        const { bannerUrl } = req.body;
        let settings = await Settings.findOne();

        if (settings) {
            settings.bannerUrl = bannerUrl;
            const updatedSettings = await settings.save();
            res.status(200).json(updatedSettings);
        } else {
            settings = await Settings.create({ bannerUrl });
            res.status(201).json(settings);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBanner, updateBanner };
