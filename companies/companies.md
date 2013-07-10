---
title: Companies API
layout: doc
---


As an authenticated user, only your own company is exposed to the API. This company details can be read at the API root.

## Get current user company

`GET /`

	$ curl -u "username:password" -i https://api.papiel.fr/
	HTTP/1.1 200 OK
	X-Poll-Interval: 60

	{
		"type": "Company",
		"uuid": "dcjkz777dscsdvdv249",
		"name": "FooBar",
		"created_at": "2011-09-06T17:26:27Z",
		"users_url": "https://api.papiel.fr/users",
		"user_url": "https://api.papiel.fr/user",
		"documents_url": "https://api.papiel.fr/documents",
		"document_types_url": "https://api.papiel.fr/doctypes"
	}
