"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

bot.dialog('/', [
    function (session, results) {
        session.send('Welcome to KiwiSaver bot demo.')
        session.send('Prompt example:')
        builder.Prompts.choice(session, "What language do you code Node?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Sweet! " + session.userData.language + " is awesome!");
        
        // send card
        session.send('Sending card example...');
        var msg = new builder.Message(session);
        msg.attachments([
            new builder.HeroCard(session)
                .title('Pike Place Fish Market')
                .subtitle('Example card with buttons')
                .text('86 Pike Pl, Seattle, WA 98101')
                .images([
                    builder.CardImage.create(session, 'https://cdn.shopify.com/s/files/1/1231/1452/t/5/assets/Home.Banner.Mobile.jpg')
                ])
                .buttons([
                    builder.CardAction.openUrl(session, 'https://maps.apple.com/&ll=47.6097199,-122.3465703', 'View Map'),
                    builder.CardAction.openUrl(session, 'https://www.pikeplacefish.com/', 'View Site')
                ])
        ]);
    session.send(msg).endDialog();
    }
]);


if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
