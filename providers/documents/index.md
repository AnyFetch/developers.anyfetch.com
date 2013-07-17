---
title: Documents API for providers
layout: doc
---

Providers can create documents for the accounts they manage.
They can only update and delete documents they created within the current context (an application managing user `A` documents can't update documents the same application created for user `B`).


## Creating a document

`GET /providers/documents/`

### Input
Send JSON datas as POST :

- `source` URL where the document can be retrieved
- `identifier` unique identifier for the document. This identifier will be used later for `PATCH` and `DELETE` creation.
- `user_access` _optional_ **array** a list of allowed users. They must be part the current user company. If not specified or null, all company users will have access.
- `creation_date` _optional_ **date** creation date for the document. If not specified, will be the current date.
- `update_date` _optional_ **date** last update date for the document. If not specified, will be the current date.
- `title` title for the document.
- `metadata` dictionary of metadatas. `null` values won't be stored.

Sample:

	{
		"source": "http://my-cloud-provider/user/dq6z8d4z6f8"
		"identifier": "http://my-cloud-provider/user/dq6z8d4z6f8"
		"user_access": ["dqsvj667bkqvljdfv23678"],
		"creation_date": "2013-09-07T17:26:27Z",
		"update_date": "2013-09-07T17:26:27Z",
		"title": "Invoice #1265",
		"metadatas": {
			"date": "2013-09-06T00:00:00Z",
			"VAT": {
				"5.5": 0,
				"7": 0,
				"19.6": 76.55
			},
			"total": 76.55
			"total_taxes": 91.55
		}
	},

## Update a document
Use PATCH access to `/providers/documents/`, providing the `identifier` key.

Parameters are the same as the creation. Metadatas will be merged with the current `metadatas` object; to erase a key specify it's value to `null`.

> Metadata merges only work within one level. In the previous example, to update one key in the `VAT` object you need to resend all the VAT datas.

## Delete a document
Use DELETE access to `/providers/documents/`, providing the identifier key.
