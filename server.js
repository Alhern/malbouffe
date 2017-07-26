'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Hoek = require('hoek');
const server = new Hapi.Server();

//Initializing the connection port
server.connection({port: 3000, host: 'localhost'});

//Routes
server.route({
    method: 'GET',
    path: '/trying',
    handler: (request, reply) => {
        reply('Hello, WORLD!!!!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, reply) => {
        reply(`CHEER UP ${encodeURIComponent(request.params.name)}!`);
    }
});

//PLUGINS
//Adding the 'inert' plugin for the static pages
//This is handling the whole public directory
server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }
    server.route({
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: './public',
                listing: true,
                index: false
            }
        }
    });
});

//Adding the 'vision' plugin for views
//This is going to render .html files
server.register(require('vision'), (err) => {
    Hoek.assert(!err, err);
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './views'
    });
});

//Rendering views
//Rendering the index.html
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply.view('index');
    }
});




//Starting the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Malbouffe app running on ${server.info.uri}`);
});