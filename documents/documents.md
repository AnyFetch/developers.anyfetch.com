---
title: Documents API
layout: doc
---


A document is made of the actual file and the metadata extracted by the readers.

## Accessing all documents

Lists all documents accessible by the user.

> Note: due to permission settings, all documents may not be accessible by every user.

`GET /documents`

```
$ curl -u "username:password" -i https://api.papiel.fr/documents
HTTP/1.1 200 OK
X-Poll-Interval: 60

[
	{
		"type": "Document",
		"uuid": "kiicqD7HHB23icdqsc78jc",
		"creation_date": "2013-09-07T17:26:27Z",
		"update_date": "2013-09-07T17:26:27Z",
		"file": {
			"provider_url": "https://dropbox.com/jscq",
			"papiel_url": "https://storage.papiel.fr/jqscqsk",
			"thumb_url": "https://storage.papiel.fr/thumbs/jqscqsk.jpg"
		},
		"doctypes": [
			"pdf",
			"invoice"
		],
		"meta": {
			"title": "Invoice",
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
	},
	
	...
]
```

## Accessing single documents
