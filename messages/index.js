"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');
var http = require('http');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
var bot = new builder.UniversalBot(connector, [
    function (session) {

        session.send("Welcome to the KiwiSaver.");
        session.dialogData.partySize = results.response;
        session.send("Hi Dijo.  We think that you’d best suit a KiwiSaver Balanced fund but it’s possible you’d prefer an alternative fund.  What would you like to do?");
    },
    function (session, results) {

        builder.send("So the Balanced fund offers a medium risk, medium return at an average management fee. For a person with your income and age, you should be looking at lowering your risk profile and preparing for retirement.");

     },
    function (session, results) {

        session.dialogData.partySize = results.response;
        builder.Prompts.text(session, "DISPLAY GRAPH. Let's say 7%.");

    },
     function (session, results) {

        session.dialogData.partySize = results.response;
        builder.Prompts.text(session, "DISPLAY GRAPH. Let's say 7%.");

    },
     function (session, results) {

        session.dialogData.partySize = results.response;
        builder.Prompts.text(session, "DISPLAY GRAPH. Let's say 8%.");

    },
     function (session, results) {

        session.dialogData.partySize = results.response;
        builder.Prompts.text(session, "DISPLAY GRAPH. Let's say 9%.");

    },
    function (session, results) {

        session.dialogData.reservationName = results.response;
        // Process request and display reservation details
        session.send("");
        session.endDialog();

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
