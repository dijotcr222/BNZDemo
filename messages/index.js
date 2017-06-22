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
 if (!session.userData.greeting) {

        session.send("Hi DIJO.  We think that you’d best suit a KiwiSaver Balanced fund but it’s possible you’d prefer an alternative fund.  What would you like to do?");
        session.userData.greeting = true;

    } else if (!session.userData.name) {

        console.log("Begin");
       

    } else if (!session.userData.email) {

        console.log("Name is: " + session.userData.name);
       

    } else if (!session.userData.password) {

        console.log("Name is: " + session.userData.name);


    }else if (!session.userData.five) {

        console.log("five: " + session.userData.five);

       

    }
    else if (!session.userData.six) {

        console.log("six: " + session.userData.six);

       

    }
     else if (!session.userData.seven) {

        console.log("seven: " + session.userData.seven);



    }
    else if (!session.userData.eight) {

        console.log("eight: " + session.userData.eight);

       

    }
     else {

        session.userData = null;
    }

    session.endDialog();
} );

function sendData(data, cb) {

        var args = {
        data: { name: data.name,
            email: data.email, password : data.password, five: data.five, six: data.six, seven: data.seven, eight: data.eight },
        headers: { "Content-Type": "application/json" }
        };
        
        client.post("http://localhost:3000/senddata", args, function (data, response) {
                    // parsed response body as js object
                    console.log(data);
                    // raw response
                    console.log(response);
                    });    

  

}

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
