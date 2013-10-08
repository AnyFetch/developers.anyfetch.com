---
title: Documents API for providers
layout: doc
---

Providers can create documents for the accounts they manage.
They can only update and delete documents they created within the current context (an application managing user `A` documents can't update documents the same application created for user `B`, and can't update documents created by another application from user `A`).


## Creating a document

`POST /providers/documents/`

### Input
Send JSON datas as POST:

- `source` **string** URL where the document can be retrieved. Set the value to `null` if you want Cluestr to keep the document in memory after processing (for non-bi-directional providers, e.g. for local files)
- `identifier` **string** unique identifier for the document. This identifier will be used later for `PATCH` and `DELETE` creation. The generation of this `identifier` is left to the provider. It is highly recommended to prefix this identifier with the package name of your provider to ensure uniqueness amongst all providers.
- `file` _optional_ **multipart form-data** The file to process. This file will be forwarded to hydraters, then destroyed from cluestr memory unless `source` is null.
- `user_access` _optional_ **array** a list of allowed users. Those users must be part the current user company. If not specified or null, all company users will have access.
- `creation_date` _optional_ **date** creation date for the document. If not specified, will be set to the current date.
- `update_date` _optional_ **date** last update date for the document. If not specified, will be set to the current date.
- `metadatas` dictionary of metadatas. `null` values won't be stored. Although not mandatory, we recommend you store at least a `title`.
- `actions` array of actions, in the form `{type: type, url}`.

Sample datas:

	{
		identifier: "http://my-cloud-provider/doc/dq6z8d4z6f8",
		user_access: ["dqsvj667bkqvljdfv23678"],
		creation_date: "2013-09-07T17:26:27Z",
		update_date: "2013-09-07T17:26:27Z",
		metadatas: {
			title: "Invoice #1265",
			date: "2013-09-06T00:00:00Z",
			VAT: {
				"5.5": 0,
				"7": 0,
				"19.6": 76.55
			},
			total: 76.55,
			total_taxes: 91.55
		},
		actions: {
			show: "http://my-cloud-provider/doc/dq6z8d4z6f8",
			reply: "http://my-cloud-provider/doc/dq6z8d4z6f8/reply",
			delete: http://my-cloud-provider/doc/dq6z8d4z6f8/delete"
		}
	}

## Update a document
Use PATCH access `/providers/documents/`, providing the `identifier` key to update a document.

For ease of use, you can also send a POST request: if the identifier already exists, new datas will be merged. This way, providers can send datas without checking to store if the file is already stored.

Parameters are the same as the creation. Metadatas will be merged with the current `metadatas` object; to erase a key specify its value to `null`.

> Metadata merges only work within one level. In the previous example, to update one key in the `VAT` object you need to resend all the VAT datas.
> Keep in mind metadatas manipulation should not be done at provider level. If you find yourself stuck while manipulating metadatas, you probably need to write an hydrater.

## Delete a document
Use DELETE access to `/providers/documents/`, providing only the identifier key.
