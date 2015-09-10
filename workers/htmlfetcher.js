var archive = require('../helpers/archive-helpers');

archive.readListOfUrls(function(arrUrls){
  archive.downloadUrls(arrUrls);
  archive.removeUrlsFromList();
});