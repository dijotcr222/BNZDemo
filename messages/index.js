"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');
var http = require('http');
var sql = require('mssql');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var connection = {
    server: 'demodijo.database.windows.net',
    user: 'dijotcr222',
    password: 'D1j0=0kRia123',
    database: 'WorkshopDemo',
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
})

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));



bot.dialog('/', function (session) {
    session.send('You said ' + session.message.text);
    session.send('Welcome to KiwiSaver.');
    var conn = new sql.Connection(connection);
    var reqs = new sql.Request(conn);
    conn.connect(function(err){
      if(err){
        console.log(err)
      }else{
        var SqlSt = "INSERT into Chat (chat_Interaction, created_date) VALUES";
        SqlSt += util.format("(%s,%s)",session.message.text,session.message.textsession.message.text);
        reqs.query(SqlSt, function(err, data){
            if(err){
              console.log(err);
            }else{
              console.log("Saved")
            }
        });
      }
    });
});


/*bot.dialog('/', [
    function (session, results) {

 

       /*var conn = new sql.Connection(connection);
    var reqs = new sql.Request(conn);
    conn.connect(function(err){
      if(err){
        console.log(err)
      }else{
        var SqlSt = "INSERT into ChatTable (ChatID, Conversation, Chat, response) VALUES";
        SqlSt += util.format("(%d,%d,%s,%s)", "23",session.message.text,session.message.textsession.message.text );
        reqs.query(SqlSt, function(err, data){
            if(err){
              console.log(err);
            }else{
              console.log("Saved")
            }
        });
      }
    });*/

    /* session.send('You said ' + session.message.text);
        session.send('Welcome to KiwiSaver.')
        session.send('Intent example:')
        builder.Prompts.choice(session, "Intant Example", ["Intent 1", "Intent 2", "Intent 3", "Intent 4", "Intent 5", "Intent 6"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Youselected " + session.userData.language + " is awesome!");
        
        // send card
        session.send('Sending Intent example...');
        var msg = new builder.Message(session);
        msg.attachments([
            new builder.HeroCard(session)
                .title('Intent 1')
                .subtitle('Intent')
                .text('')
                .images([
                    builder.CardImage.create(session, '')
                ])
                .buttons([
                    builder.CardAction.openUrl(session, ''),
                    builder.CardAction.openUrl(session, '')
                ])
        ]);
    session.send(msg).endDialog();
    }
]);*/

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
