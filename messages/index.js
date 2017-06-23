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

/*var connection = {
    server: 'dchat.database.windows.net',
    user: 'dijotcr222',
    password: 'D1j0=0kRia123',
    database: 'MYChatTest',
    options: {
           encrypt: true
      }
};
sql.connect(connection, function (err) {
  if(err){
    console.log(err);
    console.log("Error in connection");
  }else{
    console.log("DB Connected");
  }
})*/

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.

bot.dialog('/', function (session) {
    session.send('You said ' + session.message.text);
});


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
