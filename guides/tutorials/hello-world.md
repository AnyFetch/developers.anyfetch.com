---
title: anyFetch example use for documents
subtitle: Say "Hello world"!
layout: doc
---

In this guide, we'll send a document to anyFetch and retrieve it using REST API endpoints.

## What do I need?
To follow this guide, you need:

* An account on anyFetch, with login and password. Create one on [the manager](https://manager.anyfetch.com/).
* `curl` binary to send requests from the command line

> We use curl for simplicity purpose. Of course, in a real use case, you'll need to use whatever utility your language provide (http for node, curl for php, requests for Python, Net::HTTP for Ruby)

## Setting up
You need to base64 encode your login and password separated with a colon.
For instance, the login `test@anyfetch.com` and password `password` will be encoded as `test@anyfetch.com:password`, which is `dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ=`.
Use [this tool](http://www.base64encode.org/) if needed. For the remainder of this document, replace `${BASE64}` with your value.

You can now send requests using [basic authentication](/authentication.html): an `Authorization` header with a value of `Basic ${BASE64}`

### Clean up your account
> Warning: this will remove **all data** from this account! Only use on testing accounts.

The first step will be to clean everything that may be available on your account. To do that, we'll send a simple `DELETE` request to `/reset`:

```sh
$ curl -i -XDELETE \
-H "Authorization: Basic ${BASE64}" \
https://api.anyfetch.com/company/reset
```

```sh
HTTP/1.1 204 No Content
```

Great! You've cleaned up your account.

### Retrieve a token
Although you can do most things using Basic Authentication, tokens are faster to use, and generally more secure since you can revoke them at any time.
For our test, we'll use a token:

```sh
$ curl -H "Authorization: Basic ${BASE64}" \
https://api.anyfetch.com/token
```

```json
{
    "token":"${TOKEN}"
}
```

Keep this token somewhere safe.

> The `GET /token` endpoint is special and always returns the same token until you call `DELETE /token`. To create application specific token, [head to the manager](https://manager.anyfetch.com/).


## Providing data
Now that we're set up, we can send our document. This requires two steps: first, sending metadata about our files, and then sending the actual file.

### Send a document
Before sending the file, we need to give anyFetch basic informations about our documents. We'll send the following params:

* `identifier`: this identifier must be unique by document and across our account, and will be used again if we need to update our document in the future. For now, we'll pick something simple, like `sample-txt`.
* `document_type`: this value lets us specify what we know about our document. This can be `email`, `contact`... in our case, we'll keep this basic and set it to `file` which is the default for every document containing a file.  The document type will determine which hydraters the document will go through once uploaded. Hydraters can later update this value to something more specific.
* `metadata`: a JSON object containing basic information about our document. For now, we'll simply send a `path` (path of the file on our local document tree, this can be useful to provide a search in folder name) and a `title` (formatted document name).

```sh
$ curl -XPOST \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type:application/json" \
https://api.anyfetch.com/documents \
-d '{"identifier": "sample-txt", "document_type": "file", "metadata": {"path": "/home/anyfetch/sample.txt", "title": "anyFetch sample file"}}'
```

And here is the reply, formatted for convenience:

```json
{
  "_type": "Document",
  "id": "542925d3ca5f27ba66e9ed9a",
  "identifier": "sample-txt",
  "creation_date": "2014-09-29T09:26:43.019Z",
  "modification_date": "2014-09-29T09:26:43.019Z",
  "provider": {
    "_type": "AccessToken",
    "id": "540852e3d035a4c213fb5c03",
    "client": null,
    "is_basic_token": true,
    "account_name": ""
  },
  "company": "53e0b2256f18dce71fce0bfe",
  "document_type": {
    "_type": "DocumentType",
    "id": "5252ce4ce4cfcd16f55cfa3b",
    "name": "file",
    "templates": {
      "title": "{{{ title }}}",
      "full": "<article class=\"anyfetch-document-full anyfetch-type-file\">\n  <header class=\"anyfetch-header\">\n    <hgroup class=\"anyfetch-title-group\">\n      <h1 class=\"anyfetch-title\">{{{ title }}}</h1>\n      <code class=\"anyfetch-title-detail\">{{ path }}</code>\n    </hgroup>\n  </header>\n</article>\n",
      "snippet": "<article class=\"anyfetch-document-snippet anyfetch-type-file\">\n  <header class=\"anyfetch-header\">\n    <hgroup class=\"anyfetch-title-group\">\n      <h1 class=\"anyfetch-title\">{{{ title }}}</h1>\n      <code class=\"anyfetch-title-detail\">{{ path }}</code>\n    </hgroup>\n  </header>\n</article>\n"
    },
    "description": "Most basic document type for any kind of binary content. When a provider sends data without any additional information, it will use this document_type."
  },
  "actions": {},
  "document_url": "https://api-staging.anyfetch.com/documents/542925d3ca5f27ba66e9ed9a",
  "projection_type": "raw",
  "data": {},
  "metadata": {
    "path": "/home/anyfetch/sample.txt",
    "title": "anyFetch sample file"
  },
  "last_hydration": null,
  "hydrating": [],
  "hydrated_by": [],
  "hydrater_errored": null,
  "hydration_error": null,
  "related": [],
  "user_access": null
}
```

anyFetch replied with the new document. Keep the `id` somewhere, we'll need it later.
Things to note...

* `creation_date` and `modification_date` were automatically set for you. You can override them when needed.
* `provider.id`, for security reason, is not the OAuth token you used to provide, but an identifier of your provider. This lets users access the documents you created without compromising your token. In our case, we used an user-specific token, so the `client` is null.
* `user_access` is `null`. This means every user in the company can access, view and search the document. To restrict access, send an array with allowed users id (or any token matching the user)

### Send the file
Now that we've created the document on anyFetch, we can associate it with a file. This is a simple file upload, under the `file` key.

Don't forget to use a sample file, like [this one](/guides/samples/sample.txt).
Replace `sample.txt` with the path to your file.

```sh
$ curl -i -XPOST \
-H "Authorization: Bearer ${TOKEN}" \
-F "file=@sample.txt" \
https://api.anyfetch.com/documents/${ID}/file
```

```sh
HTTP/1.1 204 No Content
```

### Checking everything is alright
Once sent, your document will be hydrated. Depending on the current load, this can take from a couple of seconds up to a few minutes. If you're curious about the status of your document, you can ping  `/documents/${ID}/raw`: the `hydrating` and `hydrated_by` keys will help you understand which hydraters are taking more time.

```sh
$ curl -H "Authorization: Bearer ${TOKEN}" \
https://api.anyfetch.com/documents/${ID}/raw
```

```json
{
  "_type": "Document",
  "id": "542925d3ca5f27ba66e9ed9a",
  "identifier": "sample-txt",
  "creation_date": "2014-09-29T09:26:43.019Z",
  "modification_date": "2014-09-29T09:26:43.019Z",
  "provider": {
    "_type": "AccessToken",
    "id": "540852e3d035a4c213fb5c03",
    "client": null,
    "is_basic_token": true,
    "account_name": ""
  },
  "company": "53e0b2256f18dce71fce0bfe",
  "document_type": {
    "_type": "DocumentType",
    "id": "5252ce4ce4cfcd16f55cfa3c",
    "name": "document",
    "templates": {
      "title": "{{{ title }}}",
      "full": "<article class=\"anyfetch-document-full anyfetch-type-document\">\n  <header class=\"anyfetch-header\">\n    <hgroup class=\"anyfetch-title-group\">\n      <h1 class=\"anyfetch-title\">{{{ title }}}</h1>\n      <code class=\"anyfetch-title-detail\">{{ path }}</code>\n    </hgroup>\n  </header>\n\n  <main class=\"anyfetch-content\">\n    {{{ content }}}\n  </main>\n</article>\n",
      "snippet": "<article class=\"anyfetch-document-snippet anyfetch-type-document\">\n  <header class=\"anyfetch-header\">\n    <h1 class=\"anyfetch-title\">{{{ title }}}</h1>\n  </header>\n  <main class=\"anyfetch-content\">\n    <p>{{{ snippet }}}</p>\n  </main>\n</article>\n"
    },
    "description": "A document from which we were able to extract a clean HTML representation: text, doc, xls, epub..."
  },
  "actions": {},
  "document_url": "https://api-staging.anyfetch.com/documents/542925d3ca5f27ba66e9ed9a",
  "projection_type": "raw",
  "data": {
    "content-type": "text/plain; charset=ISO-8859-1",
    "html": "<p>This is a sample document, for hello world purposes.\n</p>\n"
  },
  "metadata": {
    "title": "anyFetch sample file",
    "path": "/home/anyfetch/sample.txt",
    "text": "This is a sample document, for hello world purposes.\n"
  },
  "last_hydration": "2014-09-29T09:30:03.229Z",
  "hydrating": [],
  "hydrated_by": [
    "https://plaintext-staging.anyfetch.com/hydrate"
  ],
  "hydrater_errored": null,
  "hydration_error": null,
  "related": []
}
```

> Alternatively, you can also ping on `GET /documents/identifier/${identifier}/raw`. This trick works for all endpoint using an `id`, just replace `/${id}/` with `/identifier/${identifier}/`. See [this page](/guides/concepts/identifier.html) for more details regarding `identifier`.

## Searching
Alright, we're done. We can now reap the fruit of our "hard" work, and start searching...

```sh
$ curl -H "Authorization: Bearer ${TOKEN}" \
https://api.anyfetch.com/documents?search=anyfetch
```

```json
{
  "facets": {
    "document_types": [
      {
        "_type": "DocumentType",
        "id": "5252ce4ce4cfcd16f55cfa3c",
        "name": "document",
        "templates": {
          "title": "{{{ title }}}",
          "full": "<article class=\"anyfetch-document-full anyfetch-type-document\">\n  <header class=\"anyfetch-header\">\n    <hgroup class=\"anyfetch-title-group\">\n      <h1 class=\"anyfetch-title\">{{{ title }}}</h1>\n      <code class=\"anyfetch-title-detail\">{{ path }}</code>\n    </hgroup>\n  </header>\n\n  <main class=\"anyfetch-content\">\n    {{{ content }}}\n  </main>\n</article>\n",
          "snippet": "<article class=\"anyfetch-document-snippet anyfetch-type-document\">\n  <header class=\"anyfetch-header\">\n    <h1 class=\"anyfetch-title\">{{{ title }}}</h1>\n  </header>\n  <main class=\"anyfetch-content\">\n    <p>{{{ snippet }}}</p>\n  </main>\n</article>\n"
        },
        "description": "A document from which we were able to extract a clean HTML representation: text, doc, xls, epub...",
        "document_count": 1
      }
    ],
    "providers": [
      {
        "_type": "AccessToken",
        "id": "540852e3d035a4c213fb5c03",
        "client": null,
        "is_basic_token": true,
        "account_name": "",
        "document_count": 1
      }
    ],
    "creation_dates": [
      {
        "_type": "Date",
        "timestamp": "1409529600000",
        "date": "2014-09-01T00:00:00.000Z",
        "document_count": 1
      }
    ]
  },
  "data": [
    {
      "_type": "Document",
      "id": "542925d3ca5f27ba66e9ed9a",
      "identifier": "sample-txt",
      "creation_date": "2014-09-29T09:26:43.019Z",
      "modification_date": "2014-09-29T09:26:43.019Z",
      "provider": {
        "_type": "AccessToken",
        "id": "540852e3d035a4c213fb5c03",
        "client": null,
        "is_basic_token": true,
        "account_name": ""
      },
      "company": "53e0b2256f18dce71fce0bfe",
      "document_type": {
        "_type": "DocumentType",
        "id": "5252ce4ce4cfcd16f55cfa3c",
        "name": "document",
        "templates": {
          "title": "{{{ title }}}",
          "snippet": "<article class=\"anyfetch-document-snippet anyfetch-type-document\">\n  <header class=\"anyfetch-header\">\n    <h1 class=\"anyfetch-title\">{{{ title }}}</h1>\n  </header>\n  <main class=\"anyfetch-content\">\n    <p>{{{ snippet }}}</p>\n  </main>\n</article>\n"
        }
      },
      "actions": {},
      "document_url": "https://api-staging.anyfetch.com/documents/542925d3ca5f27ba66e9ed9a",
      "projection_type": "snippet",
      "data": {
        "title": "<span class=\"anyfetch-hlt\">anyFetch</span> sample file",
        "path": "/home/<span class=\"anyfetch-hlt\">anyfetch</span>/sample.txt",
        "snippet": "This is a sample document, for hello world purposes.\n"
      },
      "related_count": 0,
      "score": 1.0786586
    }
  ],
  "count": 1,
  "max_score": 1.0786586
}
```

As you can see, the document was read and made available for search during hydration.

That's all! You've sent your first document to anyFetch :)
