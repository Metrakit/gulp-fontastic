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

    var font_name = hash;
    if (opt.font_name) {
      font_name = opt.font_name;
    }

    request(url + '.eot').pipe(fs.createWriteStream(opt.font_dir + font_name + '.eot'));
    request(url + '.woff').pipe(fs.createWriteStream(opt.font_dir + font_name + '.woff'));
    request(url + '.ttf').pipe(fs.createWriteStream(opt.font_dir + font_name + '.ttf'));
    request(url + '.svg').pipe(fs.createWriteStream(opt.font_dir + font_name + '.svg'));

    var re = new RegExp(url, 'g');
    content = content.replace(re, opt.font_path + hash);

    var extension = "css";
    if (opt.scss === true) {
      extension = "scss";
    }

    fs.writeFile(opt.style_path + opt.file_name + '.' + extension, content);

  });
};
