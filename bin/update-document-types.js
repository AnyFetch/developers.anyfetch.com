#!/usr/bin/node
'use strict';

/*
 * This script generate and override document-types.md
 * It need async and supertest npm modules
 */

var fs = require('fs');
var async = require('async');
var request = require('supertest');

var apiUrl = "https://api.anyfetch.com";
var file = "../resources/document-types.md";

var ids = [
  '5252ce4ce4cfcd16f55cfa3b',
  '5252ce4ce4cfcd16f55cfa3c',
  '5252ce4ce4cfcd16f55cfa3d',
  '5252ce4ce4cfcd16f55cfa3a',
  '5252ce4ce4cfcd16f55cfa3f',
  '5252ce4ce4cfcd16f55cfa40',
  '5252ce4ce4cfcd16f55cfa41'
];

var content = "";

fs.readFile(file, {encoding: 'utf-8'}, function(err, contentFile) {
  if(err) {
    throw err;
  }

  var fileBegin = contentFile.substr(0, contentFile.indexOf("{% raw  %}"));
  var fileEnd = contentFile.substr(contentFile.indexOf("{% endraw %}"));
  var content = "";

  async.map(ids, function(id, cb) {
    request(apiUrl)
    .get('/document_types/' + id)
    .end(cb);
  }, function(err, data) {
    if(err) {
      throw err;
    }
    data.forEach(function(res) {
      var body = res.body;

      content += "## " + body.name.charAt(0).toUpperCase() + body.name.slice(1) + "\n> ID: " + body.id + "\n\n";
      content += body.description += "\n\n" + "### Projections\n* Snippet\n";

      body.projections.snippet.forEach(function(param) {
        content += "  - " + param + "\n";
      });

      content += "* Full\n";

      body.projections.full.forEach(function(param) {
        content += "  - " + param + "\n";
      });

      content += "\n### Templates\nSnippet:\n\n```html\n";
      content += body.templates.snippet;
      content += "\n```\n\n\nFull:\n\n```html\n";
      content += body.templates.full;
      content += "\n```\n";
    });

    fs.writeFile(file, fileBegin + "{% raw  %}\n" + content + "\n" + fileEnd, function(err) {
      if(err) {
        throw err;
      }
    });
  });
});
