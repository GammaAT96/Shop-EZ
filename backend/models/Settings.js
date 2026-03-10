const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    bannerUrl: {
        type: String,
        required: true,
        default: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
    }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;
