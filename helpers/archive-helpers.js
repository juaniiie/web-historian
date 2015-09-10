var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelpers = require('../web/http-helpers');


exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};


exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    callback(String(data).split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls){
    callback(_.contains(urls,url));
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(exists){
    if(!exists) {
      fs.appendFile(exports.paths.list, url+"\n", function(err){
        if(err) throw err;
        callback();
      });
    }else{
      callback();
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, files){
    callback(_.contains(files,url));
  });
};

exports.downloadUrls = function(urlArr) {
    _.each(urlArr, function(url) {
      if(url.trim() !== ''){
        httpHelpers.getContent(url);
      }
    });
};

exports.removeUrlsFromList = function() {
  exports.readListOfUrls(function(urlArr) {
    fs.readdir(exports.paths.archivedSites, function(err, files){
      var remaining = _.filter(urlArr, function(url){
        return ~files.indexOf(url) ? false : true;
      });

      var urlString = '';
      _.each(remaining, function(url){
        urlString += url;
      });

      fs.writeFile(exports.paths.list, urlString, 'utf8', function(err){
        if(err) throw err;
      });

    });
  });
};

