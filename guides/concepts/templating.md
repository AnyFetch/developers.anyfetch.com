---
title: anyFetch templating
subtitle: Displaying data
layout: doc
---

The end user is not really interested in raw JSON when he search for something.
To solve this problem, AnyFetch provides "templating": each document type define a mustache HTML template, which can be used to format and display the document.


## The automatic way
When calling `GET /documents` or `GET /documents/:id`, you can add `render_templates=1` to your query string to get a HTML snippet representing the document. Here is a sample for a snippet:

```json
{
    "_type": "Document",
    "id": "544fb0a76d6e65310f05c176",
    "identifier": "https://mail.google.com/mail/b/matthieu.bacconnier@papiel.fr/?cm#all/149526a428b7331f",
    "creation_date": "2014-10-27T16:22:15.000Z",
    "modification_date": "2014-11-03T21:08:28.000Z",
    "provider": {
        ...
    },
    "company": "53f31b0a6a77dce00d9ca299",
    "document_type": {
        ...
    },
    "actions": {
        ...
    },
    "document_url": "https://api.anyfetch.com/documents/544fb0a76d6e65310f05c176",
    "projection_type": "snippet",
    "related_count": 0,
    "score": 1.9280857,
    "rendered_snippet": "<article class=\"anyfetch-document-snippet anyfetch-type-email-thread\">\n  <header class=\"anyfetch-header\">\n    <h1 class=\"anyfetch-title\">\n      <span class=\"anyfetch-number anyfetch-message-count\">3</span>\n      <span class=\"anyfetch-hlt\">Trick or Treat</span> from Loggly!\n    </h1>\n    <ul class=\"anyfetch-pill-list anyfetch-participants\">\n      <li class=\"anyfetch-title-detail\">3 <span class=\"anyfetch-icon-people\"></li>\n        <li class=\"anyfetch-pill anyfetch-name \">\n            Stephanie Skuratow\n        </li>\n        <li class=\"anyfetch-pill anyfetch-name \">\n            Matthieu Bacconnier\n        </li>\n        <li class=\"anyfetch-pill anyfetch-name \">\n            Anyfetch Flowdock\n        </li>\n    </ul>\n  </header>\n  <main class=\"anyfetch-content\">\n    <p>Hi Matthieu, As a Halloween <span class=\"anyfetch-hlt\">treat</span> (no <span class=\"anyfetch-hlt\">tricks</span>!), we're running special promotional pricing on our Pro tier of service that will be available only through October 31st</p>\n  </main>\n</article>\n",
    "rendered_title": "<span class=\"anyfetch-hlt\">Trick</span> <span class=\"anyfetch-hlt\">or</span> <span class=\"anyfetch-hlt\">Treat</span> from Loggly!"
}
```

This snippet will be generated on the server using the same method as described below, except you don't have to do anything. This is great for web based display, or when you don't need to override content or display.
However, if you need to customize the output, you'll need to handle projection manyally.


## The manual way
Everywhere in the API, documents will have a property `projection_type` (for instance on `/documents`, `/documents/:id`, `/documents/:id/raw`, `/documents/:id/similar`), indicating the keys you'll find in `data`.
Let's take an example. Here is an excerpt from a call to `GET /documents`, under the `data` key:

```json
{%raw%}
{
    "_type": "Document",
    "id": "544fb0a76d6e65310f05c176",
    "identifier": "https://mail.google.com/mail/b/matthieu.bacconnier@papiel.fr/?cm#all/149526a428b7331f",
    "creation_date": "2014-10-27T16:22:15.000Z",
    "modification_date": "2014-11-03T21:08:28.000Z",
    "provider": {
        ...
    },
    "company": "53f31b0a6a77dce00d9ca299",
    "document_type": {
        "_type": "DocumentType",
        "id": "656d61696c2d746872656164",
        "name": "email-thread",
        "templates": {
            "title": "{{{ subject }}}",
            "snippet": "<article class=\"anyfetch-document-snippet anyfetch-type-email-thread\">\n  <header class=\"anyfetch-header\">\n    <h1 class=\"anyfetch-title\">\n    {{^singleEmail}}\n      <span class=\"anyfetch-number anyfetch-message-count\">{{messagesCount}}</span>\n    {{/singleEmail}}\n    {{#hasAttachment?}}\n      <span class=\"anyfetch-icon-related\"></span>\n    {{/hasAttachment?}}\n    {{#subject}}\n      {{{subject}}}\n    {{/subject}}\n    {{^subject}}\n      (no subject)\n    {{/subject}}\n    </h1>\n    <ul class=\"anyfetch-pill-list anyfetch-participants\">\n      <li class=\"anyfetch-title-detail\">{{participantsCount}} <span class=\"anyfetch-icon-people\"></li>\n      {{#participants}}\n        <li class=\"anyfetch-pill anyfetch-name {{#highlight}}anyfetch-hlt{{/highlight}}\">\n          {{#name}}\n            {{{.}}}\n          {{/name}}\n          {{^name}}\n            {{{address}}}\n          {{/name}}\n        </li>\n      {{/participants}}\n    </ul>\n  </header>\n  <main class=\"anyfetch-content\">\n    <p>{{{snippet}}}</p>\n  </main>\n</article>\n"
        }
    },
    "actions": {
        ...
    },
    "document_url": "https://api.anyfetch.com/documents/544fb0a76d6e65310f05c176",
    "projection_type": "snippet",
    "data": {
        "subject": "<span class=\"anyfetch-hlt\">Trick or Treat</span> from Loggly!",
        "date": "2014-10-27T16:22:15.000Z",
        "participants": [
            {
                "name": "Stephanie Skuratow",
                "address": "stephanie",
                "highlight": false
            },
            {
                "name": "Matthieu Bacconnier",
                "address": "matthieu",
                "highlight": false
            },
            {
                "name": "Anyfetch Flowdock",
                "address": "anyfetch",
                "highlight": false
            }
        ],
        "snippet": "Hi Matthieu, As a Halloween <span class=\"anyfetch-hlt\">treat</span> (no <span class=\"anyfetch-hlt\">tricks</span>!), we're running special promotional pricing on our Pro tier of service that will be available only through October 31st",
        "hasAttachment": false,
        "participantsCount": "3",
        "messagesCount": "3",
        "singleEmail": false
    },
    "related_count": 0,
    "score": 1.9280857
}
{%endraw%}
```

* `projection_type` has a value of `snippet` ([the projection used](/guides/concepts/projection.html))
* `document_type` indicate us how we can display the JSON object under `data` as HTML;
* `data` contains the actual data to use for templating

Since `projection_type` in the above document is `snippet`, we can find the relevant mustache template in `document_type.templates.snippet`.

> Note: if you want to display a shorter overview, you can also inject `data` in `document_type.templates.title` which will give a one-liner of the document.

Here is the template, extracted from the JSON:

```html
{%raw%}
<article class="anyfetch-document-snippet anyfetch-type-email-thread">
  <header class="anyfetch-header">
    <h1 class="anyfetch-title">
    {{^singleEmail}}
      <span class="anyfetch-number anyfetch-message-count">{{messagesCount}}</span>
    {{/singleEmail}}
    {{#hasAttachment?}}
      <span class="anyfetch-icon-related"></span>
    {{/hasAttachment?}}
    {{#subject}}
      {{{subject}}}
    {{/subject}}
    {{^subject}}
      (no subject)
    {{/subject}}
    </h1>
    <ul class="anyfetch-pill-list anyfetch-participants">
      <li class="anyfetch-title-detail">{{participantsCount}} <span class="anyfetch-icon-people"></li>
      {{#participants}}
        <li class="anyfetch-pill anyfetch-name {{#highlight}}anyfetch-hlt{{/highlight}}">
          {{#name}}
            {{{.}}}
          {{/name}}
          {{^name}}
            {{{address}}}
          {{/name}}
        </li>
      {{/participants}}
    </ul>
  </header>
  <main class="anyfetch-content">
    <p>{{{snippet}}}</p>
  </main>
</article>
{%endraw%}
```

Using [any mustache rendering engine](http://mustache.github.io/), we can now generate the final layout:

```html
<article class="anyfetch-document-snippet anyfetch-type-email-thread">
  <header class="anyfetch-header">
    <h1 class="anyfetch-title">
      <span class="anyfetch-number anyfetch-message-count">3</span>
      <span class="anyfetch-hlt">Trick or Treat</span> from Loggly!
    </h1>
    <ul class="anyfetch-pill-list anyfetch-participants">
      <li class="anyfetch-title-detail">3 <span class="anyfetch-icon-people"></li>
        <li class="anyfetch-pill anyfetch-name ">
            Stephanie Skuratow
        </li>
        <li class="anyfetch-pill anyfetch-name ">
            Matthieu Bacconnier
        </li>
        <li class="anyfetch-pill anyfetch-name ">
            Anyfetch Flowdock
        </li>
    </ul>
  </header>
  <main class="anyfetch-content">
    <p>Hi Matthieu, As a Halloween <span class="anyfetch-hlt">treat</span> (no <span class="anyfetch-hlt">tricks</span>!), we're running special promotional pricing on our Pro tier of service that will be available only through October 31st</p>
  </main>
</article>
```
