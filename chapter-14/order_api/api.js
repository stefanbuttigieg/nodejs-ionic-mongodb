var database = require('/Users/stefanbuttigieg/order_api/database');
var http = require('http');
var url = require('url');

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

// Product methods

var findAllProducts = function (req, res) {
   findAllResources('Products', req, res);
};

var findProductById = function (id, req, res) {
   findResourceById('Products', id, req, res);
};

// Generic insert/update methods (POST, PUT)

var insertResource = function (resourceName, resource, req, res) {
   database.insert('OrderBase', resourceName, resource, function (err, resource) {
       res.writeHead(200, {"Content-Type": "application/json"});
       res.end(JSON.stringify(resource));
   });
};

// Product methods

var insertProduct = function (product, req, res) {
   insertResource('OrderBase', 'Product', product, function (err, result) {
       res.writeHead(200, {"Content-Type": "application/json"});
       res.end(JSON.stringify(result));
   });
};

var server = http.createServer(function (req, res) {

   // breaks down the incoming URL into its components
   var parsedUrl = url.parse(req.url, true);

   // determine a response based on the url
   switch (parsedUrl.pathname) {
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

	   //Extract the data stored in the POST body
   var body = "";
               req.on('data', function (dataChunk) {
                   body += dataChunk;
               });
               req.on('end', function () {
                   // Done pulling data from the POST body.
                   // Turn it into JSON and proceed to store.
                   var postJSON = JSON.parse(body);
                   insertProduct(postJSON, req, res);
               });
           }
           break;
       default:
           res.end('You shall not pass!');
   }
});
var server = http.createServer(function (req, res) {

   // breaks down the incoming URL into its components
   var parsedUrl = url.parse(req.url, true);

   // determine a response based on the url
   switch (parsedUrl.pathname) {
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

	   //Extract the data stored in the POST body
   var body = "";
               req.on('data', function (dataChunk) {
                   body += dataChunk;
               });
               req.on('end', function () {
                   // Done pulling data from the POST body.
                   // Turn it into JSON and proceed to store.
                   var postJSON = JSON.parse(body);
                   insertProduct(postJSON, req, res);
               });
           }
           break;
       default:
           res.end('You shall not pass!');
   }
});


server.listen(8080);

console.log("Up, running and ready for action!");
