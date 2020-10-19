const { WebhookClient } = require('discord.js');

const guildLogs = new WebhookClient({
    id: "762143060187676693",
    token: "xQG5X5WtmN1phER_IcmSbWWdW6F2FeWfmDtXeC2tIKBMZlqxxntkwWhn7M0mv5Pi70s7"
});

const errorLogs = new WebhookClient({
    id: "766307649196654692",
    token: "Kr7OBgY1jHSqJNzFmq2owyUGOhs8ZE_EnTZXgk8YTNhiE_xHj-NKnpN1chNgVzUIFGEO"
});

class WebhookLogger {
    constructor(client) {
        this.client = client;
    }

    guild(data) {
        guildLogs.send(typeof data === String ? data : '', {
            username: 'Musical Tune',
            avatarURL: this.client.user.avatarURL(),
            embeds: [typeof data !== String ? data : '']
        });
    };

    error(data) {
        errorLogs.send(typeof data === String ? data : '', {
            username: 'Musical Tune',
            avatarURL: this.client.user.avatarURL(),
            embeds: [typeof data !== String ? data : '']
        });
    };

};

module.exports = WebhookLogger;