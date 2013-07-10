---
title: Reader manifest
layout: doc
---

Every document reader should be registered in Papiel with a manifest.

## Send your manifest

`POST /reader?client_id=xxxx&client_secret=yyyy`

Send json data (dictionnary at the root) to this endpoint to register your document reader. Don't forget to send your reader's `client_id` and `client_secret` in the request's parameters.

## Dependencies

Just tell which readers must be executed before your own. A reader is identified with the following format: `developer_name/reader_name` Here's an example: `papiel/ocr` which is known to return a `full_text` metadata.

Transfer your dependencies in an array of strings, you can also pass optional dependencies, for example:

```json
{
	"dependencies": [
		"papiel/ocr"
	],
	"optional_dependencies": [
		"papiel/date",
		"papiel/title"
	]
	
	...
}
```

Your reader will be called only if every dependency has been resolved. If at the end of the reading stack, optional dependencies has not been resolved, your reader will be executed anyway.

## Required metadata

As the others readers will return metadatas, you have to specify which metadatas you need to process your document.

You can eventually ask for the document itself with the `full_document` scope if you need it. **Be careful with that though**, full document scope is known for throwing warnings to end users when installing your reader. 

Metadata acts as a constraint of execution of your reader too. If required metadata doesn't exist, your reader is likely to be not executed. That's why we created optional metadata.

_Note:_ With metadata constraints, you don't have to specify explicit dependencies. But in this case you'll not be sure which reader has been processing this metadata.

Here's an example:
```json
{
	...
	
	"metadatas": [
		"full_text"
	],
	"optional_metadatas": [
		"date",
		"title"
	],
	
	...
}
```

## Returned metadata

You must specify which data you're able to send back. You can specify optional returned metadata if you're not sure your reader will process correctly everything.

Here's an example:
```json
{
	...
	
	"returns": [
		"type"
	],
	"optional_returns": [
		"company_name",
		"company_address"
	],
	
	...
}
```

## Reader endpoint

You must specify to Papiel which endpoint in your reader to trigger for receiving informations.

Just do it with a single string:
```json
{
	...
	"endpoint": "https://myreader.com/recieve"
}
```
