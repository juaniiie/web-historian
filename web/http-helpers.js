var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpReq = require('http-request');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = serveAssets = function(res, asset, callback) {
  fs.readFile(asset, function(err,data){
    if(err) throw err;
    callback(data);
  });
};

exports.sendContent = function(res, asset, statusCode) {
   res.writeHead(statusCode, headers);
    serveAssets(res, asset, function(html){
      res.end(html);
    });
};

exports.getContent = function(url) {
  //get html from url
  httpReq.get(url, function (err, res) {
    if (err) {
      console.error(err);
      return;
    }
    //make file with url name
    //write html in file
    fs.writeFile(archive.paths.archivedSites +'/'+ url, res.buffer.toString(), function (err) {
      if (err) throw err;
    });
  });
};