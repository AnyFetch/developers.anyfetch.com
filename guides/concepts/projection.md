---
title: anyFetch projection
subtitle: Projection, you said?
layout: doc
---

Documents in anyFetch are rarely served raw. In most cases, the document will be `projected` meaning only useful data is returned to the end user.

## Projection basis

The best way to understand projection is by example. Let's say you have a big PDF file, hydrated with the following data and metadata:

```json
{
    "_type": "Document",
    "id": "5252d19a1247678905000001",
    "document_url": "https://api.anyfetch.com/documents/5252d19a1247678905000001",
    "data": {
        "content-type": "application/pdf",
        "html": "<!DOCTYPE html>... a very very long string ...</html>\n"
    },
    "metadata": {
        "title": "My big PDF",
        "path": "/My big PDF.pdf",
        "text": "... textual extract ...",
    },
    ...
}
```

When the user enter a search query, he'll only want a small snippet of this data. Loading the full document for every match would clutter the network and slow down your app. People would hate it, they'd leave your app, eat and get fat. We don't want that, and we sincerely hope that, as a dev, you don't want that either.

So we need to reduce the amount of data being transferred. For this, we define projections, taking the original `metadata` object hash and generating a new, simplified hash.

Projectors are written using [handlebars](http://handlebarsjs.com/), and handled internally by the anyFetch API, who will inject the full document into the projector as input and retrieve a new JSON object as result.

For documents, the projector is quite simple:

```django
{%raw%}
{
  "title": {{> title}},
  "path": "{{attr 'path'}}",
  "snippet": "{{#trim .}}{{shortAttr 'text'}}{{/trim}}"
}
{%endraw%}
```

Things to note:

* `attr` will return a highlight if any, or the metadata with this name, or the data for this name (in this order).
* `#trim` will return a trimmed string (removing whitespace before and after)
* `shortAttr` will work as `attr`, except its output will be truncated to 200 characters by default
* `> title` is used to import the `title` template:

```django
{%raw%}
{{#if metadata.title}}
  "{{attr 'title'}}"
{{else}}
  {{#if metadata.path}}
    "{{extractFilename metadata.path}}"
  {{else}}
    "Unknown document: no path."
  {{/if}}
{{/if~}}
{%endraw%}
```


When the user searches for the term "many many", we'll then generate a new, smaller object:

```json
{
    "_type": "Document",
    "id": "5252d19a1247678905000001",
    "document_url": "/documents/5252d19a1247678905000001",
    "metadata": {
        "title": "My big PDF",
        "path": "/My big PDF.pdf",
        "text": "...extract with <em>many many</em> characters...",
    }
}
```

## Projections and document-types

Obviously, we can't use the same projection for all document-types: we don't want to project a PDF, a contact or an email in the same way.
Here comes the document-types: every document has a document-type, and this document-type defines how it will be projected.

Every document-type defines three projectors:

* A projector for `title`, used to display the document in one line (note this is always a subset from the `snippet` and `full` projection: with any type of projected data, you can find the `title` projection);
* A projector for `snippet`, used after a query to render small results;
* A projector to display the document in `full`. Note that this *does not* contain all metadata, since most of them are not relevant to the end user.

You can now read about [templating](/guides/concepts/templating.html) to learn how to display this data to the end user.


## Samples projectors

Here is a more complex projector, used to display an email-thread in full view:

```django
{%raw%}
{
  "subject": "{{attr 'subject'}}",
  "date": "{{dateRfc metadata.date}}",
  "participants": [
    {{#list metadata.participants}}
      {
        {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
        "address": "{{#escapeQuotes .}}{{address}}{{/escapeQuotes}}",
        "highlight": {{isHighlight .}}
      }
    {{/list}}
  ],
  "labels": [ {{#list metadata.labels}}"{{#escapeQuotes .}}{{.}}{{/escapeQuotes}}"{{/list}} ],
  "messages": [
    {{#reverseList metadata.messages sibling=data.messages}}
      {
        "subject": "{{#escapeQuotes .}}{{subject}}{{/escapeQuotes}}",
        {{#if date}}
          "date": "{{dateRfc date}}",
        {{/if}}
        "from": [
          {{#list from}}
            {
              {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
              "address": "{{#escapeQuotes .}}{{address}}{{/escapeQuotes}}",
              "highlight": {{isHighlight .}}
            }
          {{/list}}
        ],
        "to": [
          {{#list to}}
            {
              {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
              "address": "{{#escapeQuotes .}}{{address}}{{/escapeQuotes}}",
              "highlight": {{isHighlight .}}
            }
          {{/list}}
        ],
        "html":
          {{#contextLookup ../data.messages reverse=true field=@index}}
            {{#if looked.html}}
              "{{htmlHighlighter looked.html}}"
            {{else}}
              "{{textHighlighter text}}"
            {{/if}}
          {{/contextLookup}}
      }
    {{/reverseList}}
  ],
  "attachmentCount": "{{related.length}}",
  "messagesCount": "{{metadata.messages.length}}",
  "singleEmail":
    {{#if metadata.messages.[1]}}
      false
    {{else}}
      true
    {{/if}}

}
{%endraw%}
```

And another one, to display an event:

```django
{%raw%}
{
  "name": "{{attr 'name'}}",
  "startDate": "{{dateRfc metadata.startDate}}",
  "endDate": "{{dateRfc metadata.endDate}}",
  "description": "{{attr 'description'}}",
  "organizer": "{{#if name}}{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}{{/if}} &lt;{{#escapeQuotes .}}{{mail}}{{/escapeQuotes}}&gt;",
  "attendee": [
    {{#list metadata.attendee}}
      "{{#if name}}{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}{{/if}} &lt;{{#escapeQuotes .}}{{mail}}{{/escapeQuotes}}&gt;"
    {{/list}}
  ],
  "location" : "{{#if metadata.location}}{{attr 'location'}}{{/if}}"
}
{%endraw%}
```

> This guide is still a work in progress.
