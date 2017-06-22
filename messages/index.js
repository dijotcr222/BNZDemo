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



// This is a dinner reservation bot that uses multiple dialogs to prompt users for input.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the KiwiSaver.");
        session.beginDialog('askForKiVi');
    },
    function (session, results) {
        session.dialogData.reservationDate = results.response;
        session.beginDialog('askForPartySize');
    },
    function (session, results) {
        session.dialogData.partySize = results.response;
        session.beginDialog('askForReserverName');
    },
     function (session, results) {
        session.dialogData.partySize = results.response;
        session.beginDialog('four');
    },

    function (session, results) {
        session.dialogData.reservationName = results.response;
                session.beginDialog('ask');
               session.endDialog();
    }
]);


bot.dialog('askForKiVi', [
    function (session) {
        builder.Prompts.test(session, "Hi Dijo.  We think that you’d best suit a KiwiSaver Balanced fund but it’s possible you’d prefer an alternative fund.  What would you like to do?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialog to ask for number of people in the party
bot.dialog('askForPartySize', [
    function (session) {
        builder.Prompts.text(session, "So the Balanced fund offers a medium risk, medium return at an average management fee. For a person with your income and age, you should be looking at lowering your risk profile and preparing for retirement.?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
])

    bot.dialog('askForPartySize', [
    function (session) {
        builder.Prompts.text(session, "In terms of Kiwisaver funds, the conservative funds offer a slightly lower risk with slightly lower reward.");
    },

    function (session, results) {
        session.endDialogWithResult(results);
    }
])

    bot.dialog('four', [
    function (session) {
        builder.Prompts.text(session, "No, there isn't.");
    },

    function (session, results) {
        session.endDialogWithResult(results);
    }
])
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
