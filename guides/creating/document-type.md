---
title: anyFetch document-type
subtitle: Displaying...
layout: doc
---

To properly display a document, we need to know some basic information about its underlying schema: which keys can exist, how they should be displayed, etc. This process is achieved using **document-types**.

> Before reading about creating a new document-type, you may be interested in [projection](/guides/concepts/projection.html) and [templating](/guides/concepts/templating.html).
> Document-type creation is probably the hardest concept on the anyFetch API, so read those other guides carefully.

A document-type can be created by `POST`ing to `/document_types`. Document-types created this way will only be available to your company and all its subcompanies.

## Specifying parameters
The `/document_types` is tricky to use and require multiple complex parameters.

The simplest are obviously `name` and `description`, which should hold strings explaining the purpose of your document-type. Be careful, as the `name` parameter must be **globally** unique: a good practice is to prefix your document-type with your company name or id.

### Projections
The next parameter is `projections`. This should be 3 valid [handlebars](http://handlebarsjs.com/) templates, each yielding a valid JSON, as explained in this [concept guide about projections](/guides/concepts/projection.html).

Each template is used in distinct situations: `title` for one line display, `snippet` for short document presentation and `full` for a global document view.

A valid `projections` value looks like that (this one returns raw event data properly projected) :

```json
{%raw%}
{
  "projections": {
    "title": "{ \"name\": \"{{attr \"name\"}}\" }",
    "full": "{\n  \"eventName\": \"{{attr 'name'}}\",\n  \"startDate\": \"{{dateRfc metadata.startDate}}\",\n  \"endDate\": \"{{dateRfc metadata.endDate}}\",\n  \"description\": \"{{attr 'description'}}\",\n  \"organizer\": \"{{#if name}}{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}{{/if}} &lt;{{#escapeQuotes .}}{{mail}}{{/escapeQuotes}}&gt;\",\n  \"attendee\": [\n    {{#list metadata.attendee}}\n     {\n        {{#if name}}\"name\": \"{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}\",{{/if}}\n        \"address\": \"{{#escapeQuotes .}}{{mail}}{{/escapeQuotes}}\",\n        \"highlight\": {{isHighlight .}}\n      }\n    {{/list}}\n  ],\n  \"location\" : \"{{#if metadata.location}}{{attr 'location'}}{{/if}}\"\n}\n",
    "snippet": "{\n  \"eventName\": \"{{attr 'name'}}\",\n  \"startDate\": \"{{dateRfc metadata.startDate}}\",\n  \"endDate\": \"{{dateRfc metadata.endDate}}\",\n  \"description\": \"{{attr 'description'}}\",\n  \"organizer\": \"{{#if name}}{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}{{/if}} &lt;{{#escapeQuotes .}}{{mail}}{{/escapeQuotes}}&gt;\",\n  \"attendee\": [\n    {{#list metadata.attendee}}\n      {\n        {{#if name}}\"name\": \"{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}\",{{/if}}\n        \"address\": \"{{#escapeQuotes .}}{{mail}}{{/escapeQuotes}}\",\n        \"highlight\": {{isHighlight .}}\n      }\n    {{/list}}\n  ],\n  \"location\" : \"{{#if metadata.location}}{{attr 'location'}}{{/if}}\"\n}\n"
  }
}
{%endraw%}
```

While building your `snippet` projection, remember it has no access to `data`, only to `metadata`.

> You can test your projection with the [anyfetch-handlebars](https://github.com/AnyFetch/anyfetch-handlebars) library.

### Templates
Now, let's move to `templates`. They should indicate, using [mustache](http://mustache.github.io/), how to display the results from the `projections`. More details can be found in this [concept guide about templating](/guides/concepts/templating.html). Once again, this should be 3 templates returning valid HTML data, with mustache markup.

A valid `templates` value looks like that (taking as input the JSON returned by `projections` template):

```json
{%raw%}
{
  "templates": {
    "title": "{{{ name }}}",
    "full": "<article class=\"anyfetch-document-full anyfetch-type-event\">\n  <header class=\"anyfetch-header\">\n    <hgroup class=\"anyfetch-title-group\">\n      <h1 class=\"anyfetch-title\">\n        {{#eventName}}\n          {{{eventName}}}\n        {{/eventName}}\n        {{^eventName}}\n          (untitled event)\n        {{/eventName}}\n      </h1>\n      <p class=\"anyfetch-title-detail\">\n     <time class=\"anyfetch-date\">{{ startDate }}</time>\n        <span class=\"anyfetch-right-arrow\"></span>\n        <time class=\"anyfetch-date\">{{ endDate }}</time>\n      </p>\n      {{#location}}\n        <p>\n          {{{location}}}\n        </p>\n      {{/location}}\n    </hgroup>\n  </header>\n  <main class=\"anyfetch-content\">\n    <h4 class=\"anyfetch-section-title\">Attendees</h4>\n    {{ #attendee.length }}\n      <ul class=\"anyfetch-list-no-bullet\">\n        {{ #attendee }}\n          <li>\n            <span class=\"anyfetch-icon-people\"></span>\n            <span class=\"anyfetch-pill anyfetch-person {{#highlight}}anyfetch-hlt{{/highlight}}\">\n              {{#name}}{{{name}}}{{/name}} &lt;{{{address}}}&gt;\n            </span>\n          </li>\n        {{ /attendee }}\n      </ul>\n    {{ /attendee.length }}\n    {{ ^attendee.length }}\n      <p>\n        (no attendees to this event)\n      </p>\n    {{ /attendee.length }}\n\n    <h4 class=\"anyfetch-section-title\">Description</h4>\n    <p>\n      {{#description}}\n        {{{description}}}\n      {{/description}}\n      {{^description}}\n        (no description)\n      {{/description}}\n    </p>\n  </main>\n</article>\n",
    "snippet": "<article class=\"anyfetch-document-snippet anyfetch-type-event\">\n  <header class=\"anyfetch-header\">\n    <hgroup class=\"anyfetch-title-group\">\n      <h1 class=\"anyfetch-title\">\n        {{#eventName}}\n          {{{eventName}}}\n        {{/eventName}}\n        {{^eventName}}\n          (untitled event)\n        {{/eventName}}\n      </h1>\n      <p class=\"anyfetch-title-detail anyfetch-date-span\">\n        <time class=\"anyfetch-date\">{{ startDate }}</time>\n        <span class=\"anyfetch-right-arrow\"></span>\n        <time class=\"anyfetch-date\">{{ endDate }}</time>\n      </p>\n      <ul class=\"anyfetch-pill-list anyfetch-participants\">\n        {{#attendee}}\n          <li class=\"anyfetch-pill anyfetch-name {{#highlight}}anyfetch-hlt{{/highlight}}\">\n            {{#name}}\n              {{{.}}}\n            {{/name}}\n            {{^name}}\n              {{{address}}}\n            {{/name}}\n          </li>\n        {{/attendee}}\n      </ul>\n    </hgroup>\n  </header>\n</article>\n"
  }
}
{%endraw%}
```

> You can test your templates with the [anyfetch-assets](https://github.com/AnyFetch/anyfetch-assets) bower package.

### Elasticsearch mappings
Sadly, we're still not done.
As the last step, we also need to specify the Elasticsearch mapping we want to use for our new document-type.

This mapping indicate the type for each of our fields.
Note this is about the raw fields, those used *before* projecting.

What does this mean? We need to keep 3 distinct data representation: the `raw` values, stored on `data` and `metadata`; the projected data returned after going through `projections`, and finally the HTML view of the data as returned by `templates`.

`es_mapping` should explain what's the raw data and how it should be "understood": is this field a string, a mail, a date...
The syntax comes from [ElasticSearch mapping](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/mapping.html).

Once again, here is a valid sample for an event:

```json
{
  "es_mapping": {
    "properties": {
      "metadata": {
        "properties": {
          "location": {
            "type": "string"
          },
          "organizer": {
            "properties": {
              "mail": {
                "analyzer": "url_email",
                "type": "string"
              },
              "name": {
                "type": "string"
              }
            },
            "type": "object"
          },
          "attendee": {
            "properties": {
              "mail": {
                "analyzer": "url_email",
                "type": "string"
              },
              "name": {
                "type": "string"
              }
            },
            "type": "object"
          },
          "description": {
            "type": "string"
          },
          "name": {
            "boost": 8,
            "type": "string"
          },
          "endDate": {
            "type": "date"
          },
          "startDate": {
            "type": "date"
          }
        }
      }
    }
  }
}
```

> All esMappings inherits from a default mapping, specifying the default properties for some basic metadata:
> * `title`, with a default boost of 4
> * `starred`, a true value boost the score of the document
> * `path`
> * `hash` to automatically merge duplicated documents when using `deduplicator.anyfetch.com`
> * `text`, to hold any string.

## Updating a document-type
Due to their nature, updating a document-type is tricky.
Of course, you can only update document-types you own.

You can't change the `name` of your document-type, or the `es_mapping` -- if you really need to change something here, you'll have to either [contact us](contact@anyfetch.com) or `DELETE` your document-type and start over.

Aside from that, you can update `projections`, `description` and `templates`.

## Deleting a document-type
There's a slight catch here, as you can't delete a document-type in use by you *or* by any of your subcompanies. You really have to be careful when you start rolling your custom document-types to subcompanies...

> This is probably still very abstract to you. You may want to check [the document-type tutorial](/guides/tutorials/document-type.html), creating a new document-type from scratch.
