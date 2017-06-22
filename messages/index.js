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
        session.send('Hi Dijo.  We think that you’d best suit a KiwiSaver Balanced fund but it’s possible you’d prefer an alternative fund.  What would you like to do? ')
       // builder.Prompts.choice(session, "Select one intant ", ["Intant 1", "Intant 2", "Intant 3"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Sweet! " + session.userData.language + " is awesome!");
        
        // send card
       /*session.send('Sending card example...');
        var msg = new builder.Message(session);
        msg.attachments([
            new builder.HeroCard(session)
                .title('Intant 1')
                .subtitle('Example card with buttons')
                .text('321, Accenture')
                .images([
                    builder.CardImage.create(session, 'https://www.google.com.au/search?q=accenture&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiY2emBx9DUAhVM1hQKHaTqBe0Q_AUICygC&biw=1405&bih=759#imgrc=E2jUIKz8ownJvM:')
                ])
                .buttons([
                    builder.CardAction.openUrl(session, 'https://maps.apple.com/&ll=47.6097199,-122.3465703', 'View Map'),
                    builder.CardAction.openUrl(session, 'https://www.accenture.com/au-en/new-applied-now/', 'View Site')
                ])
        ]);*/
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
