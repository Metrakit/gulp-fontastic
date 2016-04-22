'use strict';

var fs = require('fs');
var request = require('request');

var PLUGIN_NAME = 'gulp-fontastic';

module.exports = function(opt) {
  request('https://file.myfontastic.com/' + opt.key + '/icons.css', function (error, response, body) {
    var content = response.body;
    var results = content.match(/([0-9]+).eot/);
    var hash = results[1];

    var url = 'https://file.myfontastic.com/'+ opt.key + '/fonts/' + hash;

    request(url + '.eot').pipe(fs.createWriteStream(opt.font_dir + hash + '.eot'));
    request(url + '.woff').pipe(fs.createWriteStream(opt.font_dir + hash + '.woff'));
    request(url + '.ttf').pipe(fs.createWriteStream(opt.font_dir + hash + '.ttf'));
    request(url + '.svg').pipe(fs.createWriteStream(opt.font_dir + hash + '.svg'));

    var re = new RegExp(url, 'g');
    content = content.replace(re, opt.font_path + hash);

    var extension = "css";
    if (opt.scss === true) {
      extension = "scss";
    }

    fs.writeFile(opt.style_path + opt.file_name + '.' + extension, content);

  });
};
