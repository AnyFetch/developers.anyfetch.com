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
		"id": "dcjkz777dscsdvdv249",
		"name": "FooBar",
		"users_url": "https://api.papiel.fr/users",
		"user_url": "https://api.papiel.fr/user",
		"documents_url": "https://api.papiel.fr/documents",
		"document_types_url": "https://api.papiel.fr/doctypes"
	}

## Update current user company

`PATCH /`

> Note:  Authenticated user must be part of the staff to be able to update the company details.

Format:

	{
		"name": "FooBar SAS",
	}

#### Response

You'll be redirected to the updated company

	HTTP/1.1 302 FOUND
	X-Poll-Interval: 60
	Location: https://api.papiel.fr/
