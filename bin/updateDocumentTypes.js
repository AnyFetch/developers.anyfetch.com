#!/usr/bin/node
'use strict';

/*
 * This script generate and override document-types.md
 * It need async and supertest npm modules
 */

var fs = require('fs');
var async = require('async');
var request = require('supertest');

var apiUrl = "http://staging.api.anyfetch.com";
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

/*var fileBegin = "---\n\
title: AnyFetch document-types resources \n\
layout: doc \n\
--- \n\
{% raw  %} \n\
 \n\
You'll find here the list of default document-types and their expectations. \n\
Don't forget that [/resources/hydraters.html](many hydraters can change the `document_type` during the hydration phase). \n\
 \n\
If you're not satisfied with the default presentation or you find some data is missing: \n\
 \n\
* You can always add more `metadata`. Even though it won't be shown to the user, the document will still be returned to the user for a relevant query, as all metadata keys are used in search. \n\
* You can create your own document type and make a simple hydrater updating the 'old' document-type to the new one. \n\n";

var fileEnd = "{% endraw %}";*/

var content = "";

var idsFunctions = [];
ids.forEach(function(id) {
  (function(id) {
    idsFunctions.push(function(cb) {
      request(apiUrl)
      .get('/document_types/' + id)
      .end(function(err, res) {
        if(err) {
          return cb(err);
        }
        cb(null, res.body);
      });
    });
  })(id);
});

fs.readFile(file, {encoding: 'utf-8'}, function(err, contentFile) {
  if(err) {
    throw err;
  }

  var fileBegin = contentFile.substr(0, contentFile.indexOf("{% raw  %}"));
  var fileEnd = contentFile.substr(contentFile.indexOf("{% endraw %}"));
  var content = "";

  async.parallel(idsFunctions, function(err, datas) {
    if(err) {
      throw err;
    }
    datas.forEach(function(data) {
      content += "## " + data.name.charAt(0).toUpperCase() + data.name.slice(1) + "\n> ID: " + data.id + "\n\n";
      content += data.description += "\n\n" + "### Projections\n* Snippet\n";

      data.projections.snippet.forEach(function(param) {
        content += "  - " + param + "\n";
      });

      content += "*Full\n";

      data.projections.full.forEach(function(param) {
        content += "  - " + param + "\n";
      });

      content += "\n### Templates\nSnippet:\n\n```html\n";
      content += data.templates.snippet;
      content += "\n```\n\n\nFull:\n\n```html\n";
      content += data.templates.full;
      content += "\n```\n";
    });

    fs.writeFile(file, fileBegin + "{% raw  %}\n" + content + "\n" + fileEnd, function(err) {
      if(err) {
        throw err;
      }
    });
  });
});