---
title: Cluestr frontend endpoints
subtitle: Search and retrieve.
layout: doc
---

General endpoints
-----------------

### Home
* **Path**: `/`
* **HTTP-Verb** : `GET`

#### Description
This endpoint returns data about the currently logged in user's company.

#### Example
```sh
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com
```

#### Response
```json
{
	"_type": "Company",
	"id": "5252cebb03a470843f000002",
	"name": "matthieu@papiel.fr",
	"users_url": "/users",
	"user_url": "/user",
	"documents_url": "/documents",
	"document_types_url": "/document-types",
	"provider_status": {
		"9d6e862308f3377c8b5fac707c9dfff75ec3f640c4cd0e9c7688709ce69f3505": "2013-10-07T17:14:40.002Z"
	}
}
```

You will find here URLs to most services (all the `_url` keys).

`provider_status` contains information about all the providers connected on this account and the date they sent datas for the last time.

> We recommend sending a `/update` right after retrieving this URL, to ensure all datas are up to date.

Possible error codes: N/A.

### Status
* **Path**: `/status`
* **HTTP-Verb** : `GET`

#### Description
This endpoint returns API status.
It requires no token.


#### Example
```sh
$ curl http://api.cluestr.com/status
```

#### Response
```json
{
	"status": "ok",
	"message": ""
}
```

Possible error codes: N/A.

### Update
* **Path**: `/update`
* **HTTP-Verb** : `GET`

#### Description
This endpoint asks for immediate update of all providers on this account.


#### Example
```sh
$ curl -X POST -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/update
```

#### Response
```
HTTP/1.1 204 No Content
```

This call returns no data.
Update will start immediately and asynchronously. You may want to periodically check on `/index` to view incoming documents.

Possible error codes: N/A.

----------------------------------------------
User endpoints
--------------

### List all users
* **Path**: `/users`
* **HTTP-Verb** : `GET`

#### Description
This endpoint returns all the users in the current company.

#### Example
```sh
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/users
```

#### Response
```json
[
	{
		"_type": "User",
		"id": "5252cebb03a470843f000003",
		"email": "matthieu@papiel.fr",
		"name": "",
		"is_admin": true,
		"user_url": "/users/5252cebb03a470843f000003"
	},
	...
]
```

Possible error codes: N/A

### Find current user
* **Path**: `/user`
* **HTTP-Verb** : `GET`

#### Description
This endpoint redirect to the canonical user page.

#### Example
```sh
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/user
```

#### Response
```
HTTP/1.1 302 Moved Temporarily
Location: /users/5252cebb03a470843f000003
```

Possible error codes: N/A

### Retrieve details about a user
* **Path**: `/user/:id`
* **HTTP-Verb** : `GET`

#### Description
This endpoint display details about a user in the company.

#### Example
```sh
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/users/5252cebb03a470843f000003
```

#### Response
```json
{
	"_type": "User",
	"id": "5252cebb03a470843f000003",
	"email": "matthieu@papiel.fr",
	"name": "",
	"is_admin": true,
	"user_url": "/users/5252cebb03a470843f000003"
}
```

Possible error codes:

* `404 ResourceNotFound`: the user does not exists or is not part of this company

----------------------------------------------
Document-types endpoints
--------------

### Retrieve available document-types
* **Path**: `/document-types`
* **HTTP-Verb** : `GET`

#### Description
This endpoint display all the document-types used by this user account.

> In a few edges cases, a new document type will be added between the time you call `/document-types` and `/documents` and you'll find a dangling reference. Your frontend needs to handle this case properly, and reload `/document-types`.

#### Example
```sh
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/document-types
```

#### Response
```json
[
	{
		"_type": "DocumentType",
		"id": "5252ce4ce4cfcd16f55cfa3b",
		"name": "file",
		"type": "binary",
		"template_snippet": "<h1>{{title}}</h1><tt>{{path}}</tt>",
		"template_full": "<h1>{{title}}</h1><tt>{{path}}</tt>",
		"template_related": "<h1>{{title}}</h1><tt>{{path}}</tt>"
	},
	...
]
```

Possible error codes:

* `404 ResourceNotFound`: the user does not exists or is not part of this company

----------------------------------------------
Documents endpoints
--------------

### Search for documents
* **Path**: `/document`
* **HTTP-Verb** : `GET`

#### Description
This endpoint lets you search for documents matching some criterias.
All documents are projected as `snippet`.

#### Query parameters
| Name	 | Type	 | Description								   |
| -------- |:--------:| ---------------------------------------------:|
| `start`  | `int`	| Index of the first item to retrieve (for pagination)
| `limit`  | `int`	| Max number of items to retrieve (for pagination)
| `search` | `string` | Search query, probably the most important parameter for this query.
| `_meta`  | `string` | Strict search on `meta` key.
| `@meta`  | `string` | Full text search on `meta` key.
| `has_meta` | `string`  | Only returns document having the `meta` key.
| `related_to` | `id`	| Find documents related to the specified document
| `binary_document_type` | `string`, `array`	| Only retrieve documents matching this binary document types. You can use the param multiple times to allow for multiples `binary_document_type`.
| `semantic_document_type` | `string`, `array`	| Only retrieve documents matching this semantic document types. You can use the param multiple times to allow for multiples `semantic_document_type`.


#### Examples
```sh
# Retrieve all documents, up to implicit limit
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/documents

# Find the first 20 documents
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/documents?limit=20

# Find 20 documents after the first 50
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/documents?limit=20&start=50

# Search for "perlinpinpin"
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/documents?search=perlinpinpin

# Search for documents with geolocation
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/documents?has_location

# Search for documents with title matching "perlinpinpin"
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/documents?@title=perlinpinpin

# Search for documents with title being exactly "perlinpinpin"
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/documents?_title=perlinpinpin

# Search for documents with title being exactly "perlinpinpin"
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/documents?_title=perlinpinpin

# Filter by binary document type
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/documents?binary_document_type=5252ce4ce4cfcd16f55cfa3b&binary_document_type=5252ce4ce4cfcd16f55cfa3c
```

#### Response
```json
{
	"binary_document_types": {
		"5252ce4ce4cfcd16f55cfa3b": 48,
		...
	},
	"semantic_document_types": {
		"null": 35,
		...
	},
	"datas": [
		{
			"_type": "Document",
			"id": "5252d19a1247678905000001",
			"company": "5252cebb03a470843f000002 ",
			"creation_date": "2013-10-08T14:59:07.895Z",
			"semantic_document_type": null,
			"binary_document_type": "5252ce4ce4cfcd16f55cfa3b",
			"actions": {
				"show": "https://www.dropbox.com/home%2Fsomefile.pdf"
			},
			"related": [],
			"document_url": "/documents/5252d19a1247678905000001",
			"mode": "snippet",
			"metadatas": {
				"title": "File title",
				"path": "/somefile.pdf"
			}
		},
		...
	]
}
```

The first part contains datas about the current data-set (number of documents per document-types), then comes the actual datas projected along their document-types.

Possible error codes:

* `409 InvalidArgument`: you specified a non existing argument in your request.

### Retrieve details about a document
* **Path**: `/documents/:id`
* **HTTP-Verb** : `GET`

#### Description
This endpoint display details about the selected document.

All documents are projected as `full`.

#### Example
```sh
$ curl -H "Authorization: token ${TOKEN}" \
http://api.cluestr.com/documents/5252d19a1247678905000001
```

#### Response
```json
{
	"_type": "Document",
	"id": "5252d19a1247678905000001",
	"company": "5252cebb03a470843f000002",
	"creation_date": "2013-10-08T14:59:07.895Z",
	"semantic_document_type": null,
	"binary_document_type": "5252ce4ce4cfcd16f55cfa3b",
	"actions": {
		"show": "https://www.dropbox.com/home%2Fsomefile.pdf"
	},
	"related": [],
	"document_url": "/documents/5252d19a1247678905000001",
	"mode": "full",
	"metadatas": {
		"5252ce4ce4cfcd16f55cfa3b": {
			"title": "File title",
			"path": "/somefile.pdf",
			"text": "File title\nAbstract\nThis documents looks for...",
			...
		}
	}
}
```

Possible error codes:

* `404 ResourceNotFound`: the document does not exists or is not part of this company
