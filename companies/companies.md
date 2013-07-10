---
title: Companies
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
		"bug": "bugs@papiel.fr",
		"help": "help@papiel.fr"
	},
	"users_url": "https://api.papiel.fr/users",
	"documents_url": "https://api.papiel.fr/documents",
	"types_url": "https://api.papiel.fr/types"
}
```
