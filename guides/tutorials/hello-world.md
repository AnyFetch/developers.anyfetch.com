---
title: Fetch API example use for documents
subtitle: Say "Hello world"!
layout: doc
---

In this guide, we'll send a document to Fetch API and retrieve it using the API endpoint.

## What do I need?
To follow this guide, you need:

* An account on anyFetch, with login and password.
* `curl` binary to send requests from the command line


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
http://api.anyfetch.com/company/reset
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
http://api.anyfetch.com/token
```

```json
{
    "token":"${TOKEN}"
}
```

Keep this token somewhere safe.

## Providing data
Now that we're set up, we can send our document. This requires two steps: first, sending metadata about our files, and then sending the actual file.

### Send a document
Before sending the file, we need to give Fetch API basic informations about our documents. We'll send the following params:

* `identifier`: this identifier must be unique across our account, and will be used again if we need to update our document in the future. For now, we'll pick something simple, like `hello-world`.
* `document_type`: this value lets us specify what we know about our document. This can be `email`, `contact`... in our case, we'll keep this basic and set it to `file` which is the default for every document containing a file.  The document type will determine which hydraters it will go through once uploaded.
* `metadatas`: a JSON object containing basic information about our document. For now, we'll simply send a `path` (path of the file on our local document tree, this can be useful to provide a search in folder name) and a `title` (formatted document name).

```sh
$ curl -XPOST \
-H "Authorization: token ${TOKEN}" \
-H "Content-Type:application/json" \
http://api.anyfetch.com/documents \
-d '{"identifier": "hello-world", "document_type": "file", "metadatas": {"path": "/home/anyfetch/sample.txt", "title": "anyFetch sample file"}}'
```

```json
{
    "_type":"Document",
    "id":"52f2367374a24df253314b3c",
    "creation_date":"2014-02-05T10:39:36.623Z",
    "token":"52f212ca74a24df25331490c",
    "company":"52f0bb24c8318c2d65000035",
    "document_type":"5252ce4ce4cfcd16f55cfa3b",
    "actions":{},
    "document_url":"/documents/52f2367374a24df253314b3c",
    "related":[],
    "identifier":"hello-world",
    "datas":{},
    "metadatas": {
        "path":"/home/anyfetch/sample.txt",
        "title":"anyFetch sample file"
    },
    "user_access": null
}
```

Fetch API replied with the new document. Keep the `id` somewhere, we'll need it later.
Things to note...

* `creation_date` was automatically set for you. You can override it when need be.
* `token`, for security reason, is not the token you used to provide, but an identifier of your token. This lets users access the documents you created without compromising your token.
* `user_access` is `null`. This means every user in the company can access it.

### Send the file
Now that we've created the document on Fetch API, we can associate it with a file. This is a simple file upload, under the `file` key.

Don't forget to use a sample file, like [this one](/guides/samples/sample.txt).
Replace `sample.txt` with the path to your file.

```sh
$ curl -i -XPOST \
-H "Authorization: token ${TOKEN}" \
-F "file=@sample.txt" \
http://api.anyfetch.com/documents/${ID}/file
```

```sh
HTTP/1.1 204 No Content
```

### Checking everything is alright
Once sent, your document will be hydrated. Depending on the current load, this can take from a couple of seconds up to a few minutes. If you're curious about the status of your document, you can ping  `/documents/${ID}/raw`: the `hydrating` and `hydrated_by` keys will help you understand which hydraters are taking more time.

```sh
$ curl -H "Authorization: token ${TOKEN}" \
http://api.anyfetch.com/documents/${ID}/raw
```

```json
{
    "_type":"Document",
    "id":"533570229ad9a4665a8d6499",
    "creation_date":"2014-03-28T12:50:42.496Z",
    "token":"53357005394e45c459176b4f",
    "company":"530f392ec8318cba94000020",
    "document_type":"5252ce4ce4cfcd16f55cfa3c",
    "actions":{},
    "document_url":"/documents/533570229ad9a4665a8d6499",
    "identifier":"hello-world",
    "datas":{
        "html":"<p>This is a sample document, for hello world purposes.\n</p>\n"
    },
    "metadatas":{
        "content-type":"text/plain; charset=ISO-8859-1",
        "content-encoding":"ISO-8859-1",
        "text":"This is a sample document, for hello world purposes.\n",
        "path":"/home/anyfetch/sample.txt",
        "title":"anyFetch sample file"
    },
    "projection_type": "raw",
    "last_hydration":"2014-03-28T12:51:17.755Z",
    "hydrating":[],
    "hydrated_by":["http://plaintext.hydrater.anyfetch.com/hydrate"],
    "related":[]
}
```

> Alternatively, you can also ping on `GET /documents/identifier/${identifier}/raw`. This trick works for all endpoint using an `id`, just replace `/${id}/` with `/identifier/${identifier}/`

## Searching
Alright, we're done. We can now reap the fruit of our hard work, and start searching...

```sh
$ curl -H "Authorization: token ${TOKEN}" \
http://api.anyfetch.com/documents?search=anyfetch
```

```json
{
    "facets":{
        "document_types":{
            "5252ce4ce4cfcd16f55cfa3c":1
        },
        "tokens":{
            "53330deb745e83fe25f6c3dc":1
        },
        "creation_dates":{
            "1393632000000":1
        }
    },
    "datas":[
        {
            "_type":"Document",
            "id":"52f2367374a24df253314b3c",
            "creation_date":"2014-03-26T17:28:47.688Z",
            "token":"53330deb745e83fe25f6c3dc",
            "company":"52f0bb24c8318c2d65000035",
            "document_type":"5252ce4ce4cfcd16f55cfa3c",
            "actions":{},
            "document_url":"/documents/52f2367374a24df253314b3c",
            "datas":{
                "title":"anyFetch sample file",
                "path":"/home/<span class=\"hlt\">anyfetch</span>/sample.txt",
                "snippet":"This is a sample document, for hello world purposes.\n"
            },
            "projection_type": "snippet",
            "related_count":0,
            "score":0.19178301
        }
    ],
    "max_score":0.19178301,
    "next_page_url":"coming",
    "previous_page_url":"coming"
}
```

As you can see, the document was read and made available for search during hydration.

That's all! You've sent your first document to anyFetch :)
