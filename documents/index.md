---
title: Documents API
layout: doc
---

A document is made of a file and the associated metadatas extracted by the readers.

## Accessing all documents

Lists all documents accessible by the currently logged-in user.

> Note: due to permission settings, all documents may not be accessible by every user.

`GET /documents`

### Input

- `search` _optional_ **string** Search strings, through all metas.
- `doctype` _optional_ **string** Search in documents of the specified types. To include many types, use the type keyword more than once -- they will all be OR-ed: `?doctype=contact&doctype=event`.
- `has_[meta]` _optional_ **boolean** will only return document if it has|has not the specified meta : `?has_name=true`.
- `@[meta]` _optional_ **string** Full text search on `meta`:  `?@name=barry`.
- `[meta]` _optional_ **string** Strict search on `meta`: `?name=barry white`
- `start` _optional_ **string** start offset for results (for pagination)
- `limit` _optional_ **string** max number of documents to return (default is 20; max value is 200)

### Output

	$ curl -u "username:password" -i https://api.papiel.fr/documents
	HTTP/1.1 200 OK
	X-Poll-Interval: 60

	[
		{
			"type": "Document",
			"id": "kiicqD7HHB23icdqsc78jc",
			"company": "dcjkz777dscsdvdv249",
			"userAccess": ["dqsvj667bkqvljdfv23678"],
			"creation_date": "2013-09-07T17:26:27Z",
			"update_date": "2013-09-07T17:26:27Z",
			"title": "Invoice #1265"
			"doctypes": [
				"pdf",
				"invoice"
			],
			"metadata": {
				"date": "2013-09-06T00:00:00Z",
				"VAT": {
					"5.5": 0,
					"7": 0,
					"19.6": 76.55
				},
				"total": 76.55
				"total_taxes": 91.55
			},
			"document_url": "https://api.papiel.fr/documents/kiicqD7HHB23icdqsc78jc"
			"download_url": "https://api.papiel.fr/documents/kiicqD7HHB23icdqsc78jc/download"
		},
		
		...
	]

## Get a single document

`GET /documents/:document`

	$ curl -u "username:password" -i https://api.papiel.fr/documents/kiicqD7HHB23icdqsc78jc
	HTTP/1.1 200 OK
	X-Poll-Interval: 60

	{
		"type": "Document",
		"id": "kiicqD7HHB23icdqsc78jc",
		"company": "dcjkz777dscsdvdv249",
		"userAccess": ["dqsvj667bkqvljdfv23678"],
		"creation_date": "2013-09-07T17:26:27Z",
		"update_date": "2013-09-07T17:26:27Z",
		"title": "Invoice #1265"
		"doctypes": [
			"pdf",
			"invoice"
		],
		"metadata": {
			"date": "2013-09-06T00:00:00Z",
			"VAT": {
				"5.5": 0,
				"7": 0,
				"19.6": 76.55
			},
			"total": 76.55
			"total_taxes": 91.55
		},
		"document_url": "https://api.papiel.fr/documents/kiicqD7HHB23icdqsc78jc"
		"download_url": "https://api.papiel.fr/documents/kiicqD7HHB23icdqsc78jc/download"
	}


## Download a single document

`GET /documents/:document/download`

	$ curl -u "username:password" -i https://api.papiel.fr/download/zqserj66bsdf8jdf78wi78
	HTTP/1.1 200 FOUND
	X-Poll-Interval: 60
	Content-Length: 1235498354
	

## Create a document
Papiel API does not allows document creation by a user.

If you need to import documents, you'll need to read the dedicated reader API.
