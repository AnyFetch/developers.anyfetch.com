---
title: Fetch API example use
subtitle: Say "Hello world"!
layout: doc
---

In this guide, we'll send a document to Fetch API and retrieve it using the API endpoint.

## What do I need?
To follow this guide, you need:

* An account on anyFetch, with login and password.
* `curl` binary to send requests from the command line
* A sample file for hydration, for instance THIS ONE.

## Setting up
You need to base64 encode your login and password separated with a colon.
For instance, the login `test@anyfetch.com` and password `password` will be encoded as `test@anyfetch.com:password`, which is `dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ=`.
Use [this tool](http://www.base64encode.org/) if needed. For the remainder of this document, replace `${BASE64}` with your value.

You can now send requests using [basic authentication](/authentication.html): an `Authorization` header with a value of `Basic ${BASE64}`

### Clean up your account
> Warning: this will remove **all datas** from this account! Only use on testing accounts.

The first step will be to clean everything that may be available on your account. To do that, we'll send a simple `DELETE` request to `/reset`:

```sh
$ curl -XDELETE \
-H "Authorization: Basic ${BASE64}" \
http://api.anyfetch.com/reset
```

### Retrieve a token
Although you can do most things using the Basic Authentication, tokens are faster to use, and generally more secure since you can revoke them at any time
For our test, we'll use a token:

```sh
$ curl -H "Authorization: Basic ${BASE64}" \
http://api.anyfetch.com/token

{
    "token":"${TOKEN}"
}
```

Keep this token somewhere safe.

## Providing datas
Now that we're set up, we can send our document. This requires two steps: first, sending meta-datas about our files, and then sending the actual file.

### Send a document
Before sending the file, we need to give Fetch API basic informations about our documents. We'll send the following params:

* `identifier`: this identifier must be unique across our account, and will be used again if we need to update our document in the future. For now, we'll pick something simple, like `hello-world`.
* `no_hydration`: this flag tells the fetch API we intend to send a file with the document, and it should wait before starting to hydrate the document. We'll set it to `true`.
* `document_type`: this value lets us specify what we know about our document. This can be `email`, `contact`... in our case, we'll keep this basic and set it to `file` which is the default for every document containing a file.
* `metadatas`: a JSON object containing basic information about our document. For now, we'll simply send a `path` and a `title`.

```sh
$ curl -XPOST \
-H "Authorization: token ${TOKEN}" \
-H "Content-Type:application/json" \
http://api.anyfetch.com/providers/documents \
-d '{"identifier": "hello-world", "no_hydration": true, "document_type": "file", "metadatas": {"path": "/home/anyfetch/sample.txt", "title": "anyFetch sample file"}}'

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

```sh
$ curl -XPOST \
-H "Authorization: token ${TOKEN}" \
-F "identifier=hello-world" \
-F "file=@sample.txt" \
http://api.anyfetch.com/providers/documents/file
```

### Checking everything is all right
Once sent, your document will be hydrated. Depending on the current load, this can take a few seconds or long minutes. If you're curious about the status of your document, you can ping  `/documents/<document_id>/raw`: the `hydrating` and `hydrated_by` keys will help you understand which hydraters are taking too much time.

## Searching
Alright, we're done. We can now reap the fruit of our hard work, and start searching...

```sh
$ curl -H "Authorization: token ${TOKEN}" \
http://api.anyfetch.com/documents?search=anyfetch

{
    "document_types":{
        "5252ce4ce4cfcd16f55cfa3c":1
    },
    "tokens":{
        "52f2289374a24df253314a95":1
    },
    "datas":[
        {
            "_type":"Document",
            "id":"52f2367374a24df253314b3c",
            "creation_date":"2014-02-05T13:02:43.084Z",
            "token":"52f2289374a24df253314a95",
            "company":"52f0bb24c8318c2d65000035",
            "document_type":"5252ce4ce4cfcd16f55cfa3c",
            "actions":{},
            "document_url":"/documents/52f2367374a24df253314b3c",
            "related":[],
            "datas":{
                "title":"anyFetch sample file",
                "path":"/home/<span class=\"hlt\">anyfetch</span>/sample.txt",
                "snippet":"This is a sample document, for hello world purposes.\n"
            }
        }
    ]
}
```

As you can see, the document was read and made available for search during hydration.

That's all! You've sent your first document to anyFetch :)
