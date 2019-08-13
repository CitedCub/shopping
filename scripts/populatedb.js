#! /usr/bin/env node

console.log('This script populates some test shopping items to the database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require(process.cwd() + '/node_modules/async');
var ShoppingItem = require(process.cwd() + '/models/shoppingitem');

var mongoose = require(process.cwd() + '/node_modules/mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { userNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var shoppingitems = [];

function shoppingItemCreate(name, cb) {
    var shoppingitem = new ShoppingItem({ name: name });

    shoppingitem.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Shopping Item: ' + shoppingitem);
        shoppingitems.push(shoppingitem);
        cb(null, shoppingitem);
    })
}

function createShoppingItems(cb) {
    async.series([
        function (callback) {
            shoppingItemCreate('Tomater', callback);
        },
        function (callback) {
            shoppingItemCreate('Champinjoner', callback);
        },
        function (callback) {
            shoppingItemCreate('Sallad', callback);
        },
        function (callback) {
            shoppingItemCreate('Köttbullar', callback);
        },
        function (callback) {
            shoppingItemCreate('Jordnötter', callback);
        },
        function (callback) {
            shoppingItemCreate('Rostad lök', callback);
        },
    ],
        // optional callback
        cb);
}

async.series([
    createShoppingItems
],
    // Optional callback
    function (err, shoppingitem) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('SHOPPINGITEMS: ' + shoppingitems);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    });