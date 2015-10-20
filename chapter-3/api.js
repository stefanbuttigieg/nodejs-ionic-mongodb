/**
 * Created by csvan on 23/03/15.
 */
var http = require('http');
var url = require('url');
var database = require('./database');
var authenticator = require('./authentication');

// Generic find methods (GET)

var findAllResources = function (resourceName, req, res) {
    database.find('OrderBase', resourceName, {}, function (err, resources) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(resources));
    });
};

var findResourceById = function (resourceName, id, req, res) {
    database.find('OrderBase', resourceName, {_id: id}, function (err, resource) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(resource));
    });
};

// Generic insert/update methods (POST, PUT)

var insertResource = function (resourceName, resource, req, res) {
    database.insert('OrderBase', resourceName, resource, function (err, resource) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(resource));
    });
};

// Product methods

var findAllProducts = function (req, res) {
    //findAllResources('Products', req, res);

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify([{_id: "54f8f04a598e782be72d6294", name: 'Apple', price: 2.5},
        {_id: "54f8f6b8598e782be72d6295", name: 'Pear', price: 1.5},
        {_id: "54f8f6b8598e782be72d6296", name: 'Orange', price: 3},
        {_id: "54f9b82caf8e5041d9e0af09", name: 'Banana', price: 3},
        {_id: "54f9b82caf8e5041d9e0dc10", name: 'Pineapple', price: 100}]));
};

var findProductById = function (id, req, res) {
    findResourceById('Products', id, req, res);
};

var insertProduct = function (product, req, res) {
    insertResource('OrderBase', 'Product', product, function (err, result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

var insertUser = function (user, req, res) {
    insertResource('OrderBase', 'User', user, function (err, result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

var findUserByEmail = function (email, cb) {
    database.find('OrderBase', 'User', {email: email}, function (err, user) {
        if (err) {
            cb(err, null)
        } else {
            cb(null, user)
        }
    });
};

var getTokenById = function (tokenID, cb) {
    database.find('OrderBase', 'AccessToken', {_id: tokenID}, function (err, token) {
        cb(null, token);
    });
};

var server = http.createServer(function (req, res) {

    // breaks down the incoming URL into its components
    var parsedUrl = url.parse(req.url, true);

    // determine a response based on the url
    switch (parsedUrl.pathname) {

        case 'api/users/register':
            if (req.method == 'POST') {
                var body = "";
                req.on('data', function (dataChunk) {
                    body += dataChunk;
                });
                req.on('end', function () {

                    // Done pulling data from the POST body.
                    // Turn it into JSON and proceed to store.
                    var postJSON = JSON.parse(body);

                    // validate that the required fields exist
                    if (postJSON.email
                        && postJSON.password
                        && postJSON.firstName
                        && postJSON.lastName) {
                        insertUser(postJSON, req, res);
                    } else {
                        res.end('All mandatory fields must be provided');
                    }
                });
            }
            break;

        case 'api/users/login':
            if (req.method == 'POST') {
                var body = "";
                req.on('data', function (dataChunk) {
                    body += dataChunk;
                });
                req.on('end', function () {

                    var postJSON = JSON.parse(body);

                    // make sure that email and password have been provided
                    if (postJSON.email && postJSON.password) {
                        findUserByEmail(postJSON.email, function (err, user) {
                            if (err) {
                                res.writeHead(404, {"Content-Type": "application/json"});
                                res.end({
                                    error: "User not found",
                                    message: "No user found for the specified email"
                                });
                            } else {
                                // Authenticate the user
                                authenticator.authenticate(user, postJSON.password, function (err, token) {
                                    if (err) {
                                        res.writeHead(403, {"Content-Type": "application/json"});
                                        res.end({
                                            error: "Authentication failure",
                                            message: "User email and password do not match"
                                        });
                                    } else {
                                        res.writeHead(200, {"Content-Type": "application/json"});
                                        res.end(JSON.stringify(token));
                                    }
                                })
                            }
                        });

                        //
                    } else {
                        res.end('All mandatory fields must be provided');
                    }
                });
            }
            break;

        case '/api/products':
            if (req.method == 'GET') {
                // Find and return the product with the given id
                if (parsedUrl.query.id) {
                    findProductById(id, req, res)
                }
                // There is no id specified, return all products
                else {
                    findAllProducts(req, res);
                }
            }
            else if (req.method == 'POST') {
                var body = "";
                req.on('data', function (dataChunk) {
                    body += dataChunk;
                });
                req.on('end', function () {
                    var postJSON = JSON.parse(body);

                    // Verify access rights
                    getTokenById(postJSON.token, function (err, token) {
                        authenticator.tokenOwnerHasRole(token, 'PRODUCER', function (err, result) {
                            if (result) {
                                insertProduct(postJSON, req, res);
                            } else {
                                res.writeHead(403, {"Content-Type": "application/json"});
                                res.end({
                                    error: "Authentication failure",
                                    message: "You do not have permission to perform that action"
                                });
                            }
                        })
                    })
                });
            }
            break;
        default:
            res.end('You shall not pass!');
    }
});
server.listen(8090);

console.log("Up, running and ready for action!");
