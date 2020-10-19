const mongoose = require('mongoose');
const config = require('../config');

const guildSchema = mongoose.Schema({
    id: { type: String },
    prefix: { type: String, default: config.prefix },
    premium: { type: Boolean, default: false },
    plugins: { type: Object, default: {
        autoPlay: true,

        duplicates: true,

        announce: {
            enabled: true,
            delete: false
        },

        dj: {
            enabled: false,
            djRole: null
        },

        default: {
            enabled: false,
            voiceChannel: null,
            textChannel: null,
            role: null
        },

        live: {
            enabled: false,
            voiceChannel: null,
            textChannel: null
        }
    } }
});

module.exports = mongoose.model("Guilds", guildSchema);