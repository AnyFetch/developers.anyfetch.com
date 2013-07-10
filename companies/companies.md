---
title: Companies API
layout: doc
---


As an authenticated user, only your own company is exposed to the API. This company can be reached at the root of the API.

## Get current user company

`GET /`

```
$ curl -u "username:password" -i https://api.papiel.fr/
HTTP/1.1 200 OK
X-Poll-Interval: 60

{
	"type": "Company",
	"uuid": "dcjkz777dscsdvdv249",
	"name": "FooBar",
	"created_at": "2011-09-06T17:26:27Z",
	"contact": {
		"bug": "bugs@foobar.com",
		"help": "help@foobar.com"
	},
	"users_url": "https://api.papiel.fr/users",
	"user_url": "https://api.papiel.fr/user",
	"documents_url": "https://api.papiel.fr/documents",
	"document_types_url": "https://api.papiel.fr/doctypes"
}
```

## Update the company

`PATCH /`

### Input

- `name` _optional_ **string**
- `contact` _optional_ **hash**

```
{
	"name": "BazFoo",
	"contact": {
		"bug": "bugs@bazfoo.com",
		"help": "help@bazfoo.com"
	}
}
```

### Response

You'll be redirected to the updated company.

```
HTTP/1.1 302 FOUND
X-Poll-Interval: 60
Location: https://api.papiel.fr/
```
