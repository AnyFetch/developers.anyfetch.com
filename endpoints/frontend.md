---
title: Cluestr frontend endpoint
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
curl -H "Authorization: token ${TOKEN}" http://api.cluestr.com


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
	curl http://api.cluestr.com/status


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
curl -X POST -H "Authorization: token ${TOKEN}" http://api.cluestr.com/update


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
	curl -H "Authorization: token ${TOKEN}" http://api.cluestr.com/users

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
	curl -H "Authorization: token ${TOKEN}" http://api.cluestr.com/user

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
	curl -H "Authorization: token ${TOKEN}" http://api.cluestr.com/users/5252cebb03a470843f000003

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
	curl -H "Authorization: token ${TOKEN}" http://api.cluestr.com/document-types

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
