---
title: anyFetch templating
subtitle: Displaying data
layout: doc
---

Everywhere in the API, documents will have a property `projection_type` (for instance on `/documents`, `/documents/:id`, `/documents/:id/raw`, `/documents/:id/similar`).

However, the end user is not really interested in projected JSON.
To solve this problem, anyFetch provides "templating": each document type define a mustache HTML template, which can be used to display data.

Let's take an example. Here is an excerpt from a call to `GET /documents`:

```json
{
    "_type": "Document",
    "id": "53594851aa42e58934a3c0a0",
    "identifier": "https://mail.google.com/mail/b/test.cluestr@gmail.com/?cm#all/141c18456ad0b4e8#1449059866530329832",
    "creation_date": "2013-10-16T06:46:17.000Z",
    "token": "53594773c8318c190e000013",
    "company": "52bff074c8318c29e9000001",
    "document_type": "5252ce4ce4cfcd16f55cfa3f",
    "actions": {
        "show": "https://mail.google.com/mail/b/test.cluestr@gmail.com/?cm#all/141c18456ad0b4e8"
    },
    "document_url": "/documents/53594851aa42e58934a3c0a0",
    "data": {
        "from": "L'équipe Gmail<mail-noreply@google.com>",
        "to": "Cluestr Test <test.cluestr@gmail.com>",
        "subject": "Retrouvez Gmail sur votre mobile",
        "snippet": "Retrouvez Gmail sur votre appareil mobile\r\n * Bonjour\r\nCluestr *   Retrouvez Gmail sur votre appareil mobile\r\n\r\nOù que vous soyez, Gmail est disponible sur l'appareil de votre choix :\r\nordinateur de",
        "date": "3/10/2013"
    },
    "projection_type": "snippet",
    "related_count": 0,
    "score": 1
}
```

* `projection_type` has a value of `snippet` ([the projection used](/guides/concepts/projection.html))
* `document_type` has a value of `5252ce4ce4cfcd16f55cfa3f`, we'll need that to select our template
* `data` contains the object to use for templating

Let's now call `GET /document_types`. We'll see the following value associated with the key `5252ce4ce4cfcd16f55cfa3f` (`document_type` value from above):

```json
{
    "_type": "DocumentType",
    "id": "5252ce4ce4cfcd16f55cfa3f",
    "name": "email",
    "templates": {
        "snippet": "<article>\n  <h1>{{{subject}}}</h1>\n  <div class=\"two-columns\">\n    <span>{{ date }}</span>\n    <span><small>{{from}} &rarr; {{to}}</small></span>\n  </div>\n  <blockquote>{{{snippet}}}</blockquote>\n</article>\n",
        "full": "<article class=\"email-projection\">\n <header>\n     <h1>{{{subject}}}</h1>\n     <small>{{ date }}</small>\n     <small>From: <strong><a href=\"anyfetch://search/{{from}}\">{{from}}</a></strong></small>\n     <small>To: <strong><a href=\"anyfetch://search/{{to}}\">{{to}}</a></strong></small>\n </header>\n\n <main>\n       {{{html}}}\n </main>\n</article>\n",
        "title": "{{ subject }}"
    },
    "updated": "2014-04-24T17:22:54.522Z",
    "documents": 12
}
```

Since `projection_type` in the above document is `snippet`, we can find the relevant mustache template in `templates.snippet`:

```html
<article>
    <h1>{{{subject}}}</h1>
    <div class="two-columns">
        <span>{{ date }}</span>
        <span><small>{{from}} &rarr; {{to}}</small></span>
    </div>
    <blockquote>{{{snippet}}}</blockquote>
</article>
```

Using [any mustache rendering engine](http://mustache.github.io/), we can now generate the final layout:

```html
<article>
    <h1>Retrouvez Gmail sur votre mobile</h1>
    <div class="two-columns">
        <span>3/10/2013</span>
        <span><small>L'équipe Gmail&lt;mail-noreply@google.com&gt; &rarr; Cluestr Test &lt;test.cluestr@gmail.com&gt;</small></span>
    </div>
    <blockquote>
        Retrouvez Gmail sur votre appareil mobile\r\n * Bonjour\r\nCluestr *   Retrouvez Gmail sur votre appareil mobile\r\n\r\nOù que vous soyez, Gmail est disponible sur l'appareil de votre choix :\r\nordinateur de
    </blockquote>
</article>
```

The system is the same for every call. `/document_types` can be cached for faster access to templating information.
