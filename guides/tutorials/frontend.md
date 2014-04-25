---
title: Creating a frontend for the Fetch API
subtitle: Display documents
layout: doc
---

Now that you have a basic understanding on how to send documents and create users and subcompanies, we'll take on the task of creating a frontend to display those documents with a search interface.

For this guide, [we'll fork an existing frontend](https://github.com/Papiel/anyfetch.com), but before let's look quicly how everything will fit.

## Principles
### Endpoints
Three endpoints are really useful for frontend-related queries:

* [`GET /documents`](/endpoints/#documents-documents-get) : to search in all documents, filter by document-type, provider, date...
* [`GET /document_types`](/endpoints/#document-types-document-types) : to retrieve templates associated with document-types
* [`GET /providers`](/endpoints/#providers-providers) : to retrieve the name of a provider, and its type

Since these 3 endpoints are available with `GET`, you may want to try [batch calls](/endpoints/#index-batch-calls).

### Templating
Now that we have `document_types` datas and `documents`, we need to create a HTML representation.

For instance, let's say `/documents` returned the following document:

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
    "datas": {
        "from": "L'équipe Gmail<mail-noreply@google.com>",
        "to": "Cluestr Test <test.cluestr@gmail.com>",
        "subject": "Retrouvez Gmail sur votre mobile",
        "snippet": "  Retrouvez Gmail sur votre appareil mobile\r\n * Bonjour\r\nCluestr *   Retrouvez Gmail sur votre appareil mobile\r\n\r\nOù que vous soyez, Gmail est disponible sur l'appareil de votre choix :\r\nordinateur de",
        "date": "3/10/2013"
    },
    "projection_type": "snippet"
    "related_count": 0,
    "score": 1
}
```

When looking in the result of `/document_types`, we'll see the following value associated with the key `5252ce4ce4cfcd16f55cfa3f` (`document_type` value from above):

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

Using `projection_type` value (snippet) from the above document, we can find the relevant mustache template in `templates.snippet`:

```html
<article>
    <h1>{{{subject}}}</h1>
    <div class="two-columns\">
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
    <div class="two-columns\">
        <span>3/10/2013</span>
        <span><small>L'équipe Gmail<mail-noreply@google.com> &rarr; Cluestr Test <test.cluestr@gmail.com></small></span>
    </div>
    <blockquote>
        Retrouvez Gmail sur votre appareil mobile\r\n * Bonjour\r\nCluestr *   Retrouvez Gmail sur votre appareil mobile\r\n\r\nOù que vous soyez, Gmail est disponible sur l'appareil de votre choix :\r\nordinateur de
    </blockquote>
</article>
```
