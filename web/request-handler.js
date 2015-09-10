var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js')
var urlParser = require('url');

var actions = {
  POST: function(req, res) {
    var data = "";
    req.on('data',function(chunk){
      data += chunk;
    });
    req.on('end',function(){
      //data === "url=something"
      var url = getQuery(data,"url");
      archive.addUrlToList(url, function(){
        res.writeHead(302,
          {Location: archive.archivedSites + '/' +url}
        );
        res.end();
      });
    });
  },
  GET: function (req, res) {
    //parse url
    url = urlParser.parse(req.url).pathname.substring(1);
    if(!url) {
      httpHelpers.sendContent(res, archive.paths.siteAssets + '/index.html', 200);
    }else{
      loadContent(url,res);
    }
  },
  OPTIONS: function() {
    
  }
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];

  if(action){
    action(req, res);
  }

};

var getQuery = function(query, param){
  var startIndex = query.indexOf(param+'=')+param.length+1;
  var endIndex = query.length;

  if(~query.indexOf('&')){
    endIndex = query.indexOf('&', startIndex);
  }

  return query.substring(startIndex,endIndex);
}

var loadContent = function(url, res) {

  archive.isUrlArchived(url, function(exists){
    if(exists){
      httpHelpers.sendContent(res, archive.paths.archivedSites + '/' + url, 200);
    }else{
      //download url
      httpHelpers.sendContent(res, archive.paths.siteAssets + '/loading.html', 404);
    }
  });


  //if isUrlInList
    //respond with content
  //else 
    //respond with loading html
    //download content
    //add to list and folder
  
}