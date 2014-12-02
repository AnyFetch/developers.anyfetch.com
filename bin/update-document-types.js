#!/usr/bin/node
'use strict';

/*
 * This script generate and override document-types.md
 * It need async and supertest npm modules
 */

var fs = require('fs');
var async = require('async');
var request = require('supertest');

var apiUrl = "https://api-staging.anyfetch.com";
var file = "../resources/document-types.md";

var content = "";

fs.readFile(file, {encoding: 'utf-8'}, function(err, contentFile) {
  if(err) {
    throw err;
  }

  var fileBegin = contentFile.substr(0, contentFile.indexOf("{% raw  %}"));
  var fileEnd = contentFile.substr(contentFile.indexOf("{% endraw %}"));
  var content = "";
  var bearer = process.argv[2];

  if(!bearer) {
    console.warn("Usage: node update-document-types.js <token>");
    process.exit(1);
  }

  console.log("Retrieving document type from " + apiUrl + " using token " + bearer);

  request(apiUrl)
    .get('/document_types')
    .set('Authorization', 'Bearer ' + bearer)
    .expect(200)
    .end(function(err, res) {
    if(err) {
      throw err;
    }

    res.body.sort(function(d1, d2) {
      if(d1.id > d2.id) {
        return 1;
      }
      return -1;
    });

    res.body.forEach(function(body) {
      if(body.owner !== null) {
        return;
      }

      content += "## " + body.name.charAt(0).toUpperCase() + body.name.slice(1) + "\n> ID: `" + body.id + "`\n\n";
      content += body.description += "\n\n" + "### Projections\n";
      content += "Snippet\n\n```jinja\n" + body.projections.snippet + "\n```\n";
      content += "Full\n\n```jinja\n" + body.projections.full + "\n```\n";
      content += "Title\n\n```jinja\n" + body.projections.title + "\n```\n";

      content += "\n### Templates\n";
      content += "Snippet:\n\n```html\n" + body.templates.snippet + "\n```\n";
      content += "Full:\n\n```html\n" + body.templates.full + "\n```\n";
      content += "Title:\n\n```html\n" + body.templates.title + "\n```\n";
    });

    fs.writeFile(file, fileBegin + "{% raw  %}\n" + content + "\n" + fileEnd, function(err) {
      if(err) {
        throw err;
      }
    });
  });
});
