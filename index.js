'use strict';

var fs = require('fs');
var request = require('request');
var _ = require('underscore');
var through = require('through2'); 
var mkdirp = require('mkdirp');

var PLUGIN_NAME = 'gulp-fontastic';

// Default options
var options = {
    font_dir: 'public/fonts/',
    font_path: '/fonts/',
    style_path: 'scss/',
    file_name: '_fontastic',
    scss: true,
    hashable: false
};

module.exports = function(opt) {

    options = _.extend(options, opt);

    function transform(file, encoding, cb) {
        mkdirp(options.font_dir);
        mkdirp(options.style_path);
        request('https://file.myfontastic.com/' + options.key + '/icons.css', function (error, response, body) {

            var content = response.body;
            var results = content.match(/([0-9]+).eot/);
            var hash = results[1];

            var url = 'https://file.myfontastic.com/'+ options.key + '/fonts/' + hash;

            var font_name = hash;
            var font_name_file = font_name;
            if (options.font_name) {
                font_name = options.font_name;
                font_name_file = font_name;
                if (options.hashable) {
                    font_name_file = font_name_file + '-' + hash;
                }
            }

            request(url + '.eot').pipe(fs.createWriteStream(options.font_dir + font_name_file + '.eot'));
            request(url + '.woff').pipe(fs.createWriteStream(options.font_dir + font_name_file + '.woff'));
            request(url + '.ttf').pipe(fs.createWriteStream(options.font_dir + font_name_file + '.ttf'));
            request(url + '.svg').pipe(fs.createWriteStream(options.font_dir + font_name_file + '.svg'));

            var re = new RegExp(url, 'g');
            content = content.replace(re, options.font_path + font_name);
            
            if (options.hashable) {
                var re2 = new RegExp(font_name + '[.]{1}', 'g');
                content = content.replace(re2, font_name_file + '.');
            }

            var extension = "css";
            if (options.scss === true) {
                extension = "scss";
            }

            return fs.writeFile(options.style_path + options.file_name + '.' + extension, content, function(err) {
                if (err) throw err;
            });
        });
        return cb();
    }
    return through.obj(transform);
};
