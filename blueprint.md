FORMAT: 1A
HOST: https://api.anyfetch.com

# anyFetch API Documentation

> This page is anyFetch reference. See [this page](/) for informations regarding general usage.

**anyFetch API** is designed to help you search massive amounts of documents coming from various sources, in various formats. See [authentication](/authentication.html) for authentication details.

Common error codes are documented on [this page](/getting-started.html).


# Group Index
## API status [/status]
### anyFetch status [GET]
Get the current global status for the API.
Should have a `status` of "OK".

+ Response 200 (application/json)
    + Body

            {
                "status": "ok",
                "message": ""
            }








# Group Account
## Index [/]
### Retrieve API links [GET]
Retrieve data about the current account. This endpoint return:

- `user_email`: informations regarding currently connected user
- `_url` to another endpoint of the API (HATEOAS design). Notice the `current_user_url` key.
- `server_time`: current server date, if you need to compute deltas with local client.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.

+ Response 200 (application/json)
    + Body

            {
                "user_email": "test@anyfetch.com",
                "documents_url": "https://api.anyfetch.com/documents/",
                "document_types_url": "https://api.anyfetch.com/document_types/",
                "providers_url": "https://api.anyfetch.com/providers/",
                "users_url": "https://api.anyfetch.com/users/",
                "current_user_url": "https://api.anyfetch.com/users/52fb7b90c8318c4dc800006c",
                "update_url": "https://api.anyfetch.com/company/update",
                "reset_url": "https://api.anyfetch.com/company/reset",
                "token_url": "https://api.anyfetch.com/token",
                "server_time": "2014-03-21T16:15:04.813Z"
            }

## Token [/token]
### Retrieve frontend token [GET]
> This endpoint can only be used with `Basic` authentication.

Create or retrieve a token. The token will always be the same until you call `DELETE /company/reset` or `DELETE /token`.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 ForbiddenScheme`: `Bearer` authentication used, but this endpoint can only be used with `Basic` scheme.
> * `401 InvalidCredentials`: non matching user

+ Response 200 (application/json)
    + Body

            {
                "token": "ebe7ec3ca678ad1d8b09f135155ab9b7f1eea10cee67d0629031301c82d2d688"
            }

### Remove token [DELETE]
> This endpoint can only be used with `Basic` authentication.

Remove the token returned by `GET /token`, and associated documents.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 ForbiddenScheme`: `Bearer` authentication used, but this endpoint can only be used with `Basic` scheme.
> * `401 InvalidCredentials`: non matching user

+ Response 204

# Group Company
## Company [/company]
### Retrieve current company [GET]
Retrieve the current company details.

Contains your company name, the list of hydraters used on the account and basic stats (document count, user count...)

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.

+ Response 200 (application/json)
    + Body

            {
                "_type": "Company",
                "id": "531dd2f3c8318cc5d100003c",
                "name": "test@anyfetch.com",
                "hydraters": [
                    "https://embedmail.anyfetch.com/hydrate",
                    "https://eml.anyfetch.com/hydrate",
                    "https://filecleaner.anyfetch.com/hydrate",
                    "https://ics.anyfetch.com/hydrate",
                    "https://image.anyfetch.com/hydrate",
                    "https://iptc.anyfetch.com/hydrate",
                    "https://markdown.anyfetch.com/hydrate",
                    "https://ocr.anyfetch.com/hydrate",
                    "https://office.anyfetch.com/hydrate",
                    "https://pdf.anyfetch.com/hydrate",
                    "https://plaintext.anyfetch.com/hydrate",
                    "https://deduplicator.anyfetch.com/hydrate"
                ],
                document_count: 4284,
                user_count: 1,
                subcompany_count: 1,
                documents_per_update: 2500
            }

## Update company documents [/company/update]
### Update documents [POST]
Ping all providers for the current company, checking for new available documents.

Return the response code from each provider—202 means `Accepted`. Most provider will reply with `429 Too Many Requests` if they're already working on this user's tasks.
Note that even if each providers responds with an error, this endpoint will still return 200 and the status for each provider.

See `GET /providers` to map id to real providers.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `429 Too Many Requests`: this endpoint is throttled at 1 request per second, with a burst of 2 / s.

+ Response 200 (application/json)
    + Body

            {
                "53234698c8318cc5d100004f": 202,
                "5320a682c8318cba94000040": 202,
                "5320a6abc8318cc5d1000049": 429
            }

## Reset company [/company/reset]
## Reset company [DELETE]
Reset **all** documents, tokens and providers from the account.

Subcompanies and users are not affected.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.

+ Response 204



















# Group Subcompanies
## Subcompanies [/subcompanies]
Subcompanies are companies you own and have created.
They allow you to isolate data: no data stored in a subcompany can be accessed from any other place.

### Retrieve all subcompanies [GET]
> This endpoint is only available to admin users.

Retrieve all subcompanies recursively from the current company, returning the same detail as `GET /company`.

Childs are listed in the `childs` fields as an array of companies.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.

+ Response 200 (application/json)
    + Body

            [
                {
                    "_type": "Company",
                    "id": "545a2aec36cb20533b63a68f",
                    "name": "subcompany",
                    "hydraters": [
                        "https://embedmail.anyfetch.com/hydrate",
                        "https://eml.anyfetch.com/hydrate",
                        "https://filecleaner.anyfetch.com/hydrate",
                        "https://ics.anyfetch.com/hydrate",
                        "https://image.anyfetch.com/hydrate",
                        "https://iptc.anyfetch.com/hydrate",
                        "https://markdown.anyfetch.com/hydrate",
                        "https://ocr.anyfetch.com/hydrate",
                        "https://office.anyfetch.com/hydrate",
                        "https://pdf.anyfetch.com/hydrate",
                        "https://plaintext.anyfetch.com/hydrate",
                        "https://deduplicator.anyfetch.com/hydrate"
                    ],
                    "document_count": 1337,
                    "user_count": 1,
                    "subcompany_count": 1,
                    "documents_per_update": 2500,
                    "childs": [
                        {
                            "_type": "Company",
                            "id": "545a2b7936cb20533b63a691",
                            "name": "subsubcompany",
                            "hydraters": [
                                "https://embedmail.anyfetch.com/hydrate",
                                "https://eml.anyfetch.com/hydrate",
                                "https://filecleaner.anyfetch.com/hydrate",
                                "https://ics.anyfetch.com/hydrate",
                                "https://image.anyfetch.com/hydrate",
                                "https://iptc.anyfetch.com/hydrate",
                                "https://markdown.anyfetch.com/hydrate",
                                "https://ocr.anyfetch.com/hydrate",
                                "https://office.anyfetch.com/hydrate",
                                "https://pdf.anyfetch.com/hydrate",
                                "https://plaintext.anyfetch.com/hydrate",
                                "https://deduplicator.anyfetch.com/hydrate"
                            ],
                            "document_count": 4242,
                            "user_count": 1,
                            "subcompany_count": 0,
                            "documents_per_update": 2500,
                            "childs": []
                        }
                    ]
                }
                {
                    "_type": "Company",
                    "id": "545a365336cb20533b63a693",
                    "name": "other-subcompany",
                    "hydraters": [
                        "https://embedmail.anyfetch.com/hydrate",
                        "https://eml.anyfetch.com/hydrate",
                        "https://filecleaner.anyfetch.com/hydrate",
                        "https://ics.anyfetch.com/hydrate",
                        "https://image.anyfetch.com/hydrate",
                        "https://iptc.anyfetch.com/hydrate",
                        "https://markdown.anyfetch.com/hydrate",
                        "https://ocr.anyfetch.com/hydrate",
                        "https://office.anyfetch.com/hydrate",
                        "https://pdf.anyfetch.com/hydrate",
                        "https://plaintext.anyfetch.com/hydrate",
                        "https://deduplicator.anyfetch.com/hydrate"
                    ],
                    "document_count": 5478,
                    "user_count": 2,
                    "subcompany_count": 1,
                    "documents_per_update": 2500,
                    "childs": []
                }
            ]

### Create a new subcompany [POST]
> This endpoint is only available to admin users.

Create a new subcompany.
Name must only contain alphanumeric characters, `@`, `-` , and `_`.

You may customize hydraters list, or use default list.

The user passed in `user` will be migrated to the new company, and made admin. To create a new subcompany, you'll need :

1. to create a new user (`POST /users`) in the current company;
2. then create the new company passing the newly created `user` id as param.

Note the "original" (parent) company will only be able to `DELETE` the subcompany, and can't do anything more: the new user will effectively be the admin in the subcompany, and the only one able to view and add documents, users...

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.
> * `403 NotAuthorized`: you are trying to migrate the last admin from your company.
> * `404 NotFound`: unable to find the user to migrate
> * `409 MissingParameter`: `user` is not specified
> * `409 MissingParameter`: `user` is not a valid ObjectId
> * `409 MissingParameter`: `name` is not specified
> * `409 InvalidArgument`: you can' migrate yourself
> * `409 InvalidArgument`: `hydraters` is not a JSON array.
> * `409 InvalidArgument`: at least one item from `hydraters` is an unknown hydrater.


+ Request (application/json)

            {
                "user": "52fb7b90c8318c4dc800006c",
                "name": "subcompany",
            }

+ Response 200 (application/json)
    + Body

            {
                "_type": "Company",
                "id": "545a2aec36cb20533b63a68f",
                "name": "subcompany",
                "hydraters": [
                    "https://embedmail.anyfetch.com/hydrate",
                    "https://eml.anyfetch.com/hydrate",
                    "https://filecleaner.anyfetch.com/hydrate",
                    "https://ics.anyfetch.com/hydrate",
                    "https://image.anyfetch.com/hydrate",
                    "https://iptc.anyfetch.com/hydrate",
                    "https://markdown.anyfetch.com/hydrate",
                    "https://ocr.anyfetch.com/hydrate",
                    "https://office.anyfetch.com/hydrate",
                    "https://pdf.anyfetch.com/hydrate",
                    "https://plaintext.anyfetch.com/hydrate",
                    "https://deduplicator.anyfetch.com/hydrate"
                ],
                "document_count": 0,
                "user_count": 1,
                "subcompany_count": 1,
                "documents_per_update": 2500,
                "childs": []
            }

## Subcompany [/subcompanies/{id}]
### Retrieve a subcompany [GET]
> This endpoint is only available to admin users.

Retrieve a specific subcompany from the current company, and its subcompanies recursively in the `childs` field.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 200 (application/json)
    + Body

            {
                "_type": "Company",
                "id": "545a2aec36cb20533b63a68f",
                "name": "subcompany",
                "hydraters": [
                    "https://embedmail.anyfetch.com/hydrate",
                    "https://eml.anyfetch.com/hydrate",
                    "https://filecleaner.anyfetch.com/hydrate",
                    "https://ics.anyfetch.com/hydrate",
                    "https://image.anyfetch.com/hydrate",
                    "https://iptc.anyfetch.com/hydrate",
                    "https://markdown.anyfetch.com/hydrate",
                    "https://ocr.anyfetch.com/hydrate",
                    "https://office.anyfetch.com/hydrate",
                    "https://pdf.anyfetch.com/hydrate",
                    "https://plaintext.anyfetch.com/hydrate",
                    "https://deduplicator.anyfetch.com/hydrate"
                ],
                "document_count": 1337,
                "user_count": 1,
                "subcompany_count": 1,
                "documents_per_update": 2500,
                "childs": [
                    {
                        "_type": "Company",
                        "id": "545a2b7936cb20533b63a691",
                        "name": "subsubcompany",
                        "hydraters": [
                            "https://embedmail.anyfetch.com/hydrate",
                            "https://eml.anyfetch.com/hydrate",
                            "https://filecleaner.anyfetch.com/hydrate",
                            "https://ics.anyfetch.com/hydrate",
                            "https://image.anyfetch.com/hydrate",
                            "https://iptc.anyfetch.com/hydrate",
                            "https://markdown.anyfetch.com/hydrate",
                            "https://ocr.anyfetch.com/hydrate",
                            "https://office.anyfetch.com/hydrate",
                            "https://pdf.anyfetch.com/hydrate",
                            "https://plaintext.anyfetch.com/hydrate",
                            "https://deduplicator.anyfetch.com/hydrate"
                        ],
                        "document_count": 4242,
                        "user_count": 1,
                        "subcompany_count": 0,
                        "documents_per_update": 2500,
                        "childs": []
                    }
                ]
            }

### Delete a subcompany [DELETE]
> This endpoint is only available to admin users.

Delete the subcompany, **all** its documents and **all** its users.

By default, you are not allowed to remove a subcompany with subsubcompanies. To force the subcompany removal, add `?force=true`.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.
> * `403 Forbidden`: the subcompanies has subsubcompanies and can't be removed, use `?force=true`.
> * `404 ResourceNotFound`: the subcompany does not exist, or is not available for this user.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 204

## Reset a subcompany [/subcompanies/{id}/reset]
### Reset a subcompany [DELETE]
> This endpoint is only available to admin users.

Reset **all** documents, tokens and providers from the subcompany (using the same bahavior as `DELETE /company/reset`).

Subcompanies and users are not affected.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.
> * `404 ResourceNotFound`: the subcompany does not exist, or is not available for this user.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 204

















# Group Documents
Endpoints for retrieving documents

## Documents [/documents{?search,before,after,document_type,provider,id,_meta,has_meta,snippet_size,start,limit,sort,render_templates,strict}]
Access documents resources.

### Search documents [GET]
Search within all available data for documents matching specified filter.

Return informations aggregated over the result set. The `score` key indicates document's relevance regarding query.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `409 InvalidArgument`: malformed search query, with misused characters (such as `+ - && || ! ( ) { } [ ] ^ \" ~ * ? : \\`)

+ Parameters
    + search (optional, string, `john smith`) ... Search query, probably the most important parameter for this query.
    + before (optional, date, `2014-03-21`) ... Only display documents created before this date.
    + after (optional, date, `2014-01-25`) ... Only display documents created after this date.
    + id (optional, array, `5252ce4ce4cfcd16f55cfa3f`) ... Only retrieve documents matching this id. <small>You can use the param multiple times to allow for multiples `id`, for instance `?id=1&id=2&id=3`</small>.
    + document_type (optional, array, `5252ce4ce4cfcd16f55cfa3f`) ... Only retrieve documents matching this document type. <small>You can use the param multiple times to allow for multiples `document_type`</small>.
    + provider (optional, array, `5252ce4ce4cfcd16f55cfa3f`) ... Only retrieve documents matching this provider. <small>You can use the param multiple times to allow for multiples `provider`.</small>
    + meta (optional, string, `John`) ... (prepend name with @) Full text search on `meta` key.  Replace `meta` with the name of the meta you wish to search on, for instance `?@name=john`.
    + has_meta (optional, boolean, `1`) ... Only returns document having the `meta` key. Replace `meta` with the name of the meta you wish to search on.
    + snippet_size (optional, integer, `200`) ... Number of chars to include in the snippet.
    + start (optional, integer, `5`) ... 0-based index of the first item to retrieve (for pagination).
    + limit (optional, integer, `20`) ... Max number of items to retrieve (for pagination).
    + sort (optional, string, `creationDate`) ... Sort criteria. Can be `creationDate` (sort by document creation date), `modificationDate` (sort by last modification date) or `_score` (default, sort by relevance to the query). Prepend with a `-` to reverse order (e.g. `-creationDate`).
    + render_templates (optional, boolean, `false`) ... Whether to pre-render the HTML for you in the results. Documents will have the keys `rendered_snippet` and `rendered_title`. The `data` key will be removed for faster transfer.
    + strict (optional, boolean, `true`) ... When using strict mode, only results matching exactly the query will be returned (a search for "John Doe" will never return documents about "Doe" only).

+ Response 200 (application/json)
    + Body

            {
                "facets": {
                    "document_types": [
                        {
                            "_type": "DocumentType",
                            "id": "5252ce4ce4cfcd16f55cfa3c",
                            "name": "document",
                            "templates": {
                                "snippet": "<article>\n  <h1>{{{ title }}}</h1>\n  <blockquote>\n  \t{{{ snippet }}}\n  </blockquote>\n</article>\n",
                                "full": "<article>\n  <section>\n    <h1>{{{ title }}}</h1>\n    <code>{{ path }}</code>\n  </section>\n\n  <section>\n    {{{ content }}}\n  </section>\n</article>\n",
                                "title": "{{ title }}"
                            },
                            "description": "A document from which we were able to extract a clean HTML representation: text, doc, xls, epub...",
                            "projections": {
                                "snippet": [
                                    "title",
                                    "path",
                                    "snippet"
                                ],
                                "full": [
                                    "title",
                                    "path",
                                    "content"
                                ]
                            },
                            "document_count": 2
                        }
                    ],
                    "providers": [
                        {
                            "_type": "AccessToken",
                            "id": "53cf9b4fa60b43c235680d7a",
                            "client": {
                                "_type": "Client",
                                "name": "GMail",
                                "id": "53047faac8318c2d65000096"
                            },
                            "is_basic_token": false,
                            "account_name": "matthieu.bacconnier@papiel.fr",
                            "document_count": 1
                        },
                        {
                            "_type": "AccessToken",
                            "id": "53cf88997f247be935ebfd7a",
                            "client": {
                                "_type": "Client",
                                "name": "Google Drive",
                                "id": "539ef7289f240405465a2e1f"
                            },
                            "is_basic_token": false,
                            "account_name": "matthieu.bacconnier@papiel.fr",
                            "document_count": 1
                        }
                    ],
                    "creation_dates": [
                        {
                            "_type": "Date",
                            "timestamp": "1370044800000",
                            "date": "2013-06-26T00:00:00.000Z",
                            "document_count": 1
                        },
                        {
                            "_type": "Date",
                            "timestamp": "1404172800000",
                            "date": "2014-07-23T00:00:00.000Z",
                            "document_count": 1
                        }
                    ]
                },
                "data": [
                    {
                        "_type": "Document",
                        "id": "53cf88a5cf25841c6144ee46",
                        "identifier": "https://docs.google.com/file/d/0Ao1Q9EZ6RihjdHBSSnlzWG5mRFMxTm5YRVMwZzd0b0E",
                        "creation_date": "2013-06-26T09:13:46.552Z",
                        "modification_date": "2013-06-26T09:13:46.552Z",
                        "provider": {
                            "_type": "AccessToken",
                            "id": "53cf88997f247be935ebfd7a",
                            "client": {
                                "_type": "Client",
                                "name": "Google Drive",
                                "id": "539ef7289f240405465a2e1f"
                            },
                            "is_basic_token": false,
                            "account_name": "matthieu.bacconnier@papiel.fr"
                        },
                        "company": "53c0190ae83613e049a4845b",
                        "document_type": {
                            "_type": "DocumentType",
                            "id": "5252ce4ce4cfcd16f55cfa3c",
                            "name": "document",
                            "templates": {
                                "snippet": "<article>\n  <h1>{{{ title }}}</h1>\n  <blockquote>\n  \t{{{ snippet }}}\n  </blockquote>\n</article>\n"
                            }
                        },
                        "actions": {
                            "show": "https://docs.google.com/file/d/0Ao1Q9EZ6RihjdHBSSnlzWG5mRFMxTm5YRVMwZzd0b0E"
                        },
                        "document_url": "https://api.anyfetch.com/documents/53cf88a5cf25841c6144ee46",
                        "projection_type": "snippet",
                        "data": {
                            "title": "Traductions.pdf",
                            "path": "/Traductions.pdf",
                            "snippet": "des entreprises\nIntégration du <span class=\"hlt\">CV</span> des participants\nApplication de recherche pour les recruteurs\nà partir de 50€/mois\nPapiel Process\nPour recrutement grande échelle\nTraductions\nIntégrez les <span class=\"hlt\">CVs</span> images"
                        },
                        "related_count": 0,
                        "score": 0.58171546
                    },
                    {
                        "_type": "Document",
                        "id": "53cf9ceacf25841c6144fbc7",
                        "identifier": "https://mail.google.com/mail/#inbox/13ec7d0b8ca2b818#13f050ec6027ecef-CREATION_PHINNOV-Dossierdemande-versionjuillet2012.doc.docx",
                        "creation_date": "2014-07-23T11:30:50.270Z",
                        "modification_date": "2014-07-23T11:30:50.270Z",
                        "provider": {
                            "_type": "AccessToken",
                            "id": "53cf9b4fa60b43c235680d7a",
                            "client": {
                                "_type": "Client",
                                "name": "GMail",
                                "id": "53047faac8318c2d65000096"
                            },
                            "is_basic_token": false,
                            "account_name": "matthieu.bacconnier@papiel.fr"
                        },
                        "company": "53c0190ae83613e049a4845b",
                        "document_type": {
                            "_type": "DocumentType",
                            "id": "5252ce4ce4cfcd16f55cfa3c",
                            "name": "document",
                            "templates": {
                                "snippet": "<article>\n  <h1>{{{ title }}}</h1>\n  <blockquote>\n  \t{{{ snippet }}}\n  </blockquote>\n</article>\n"
                            }
                        },
                        "actions": {
                            "show": "https://mail.google.com/mail/#inbox/13ec7d0b8ca2b818"
                        },
                        "document_url": "https://api.anyfetch.com/documents/53cf9ceacf25841c6144fbc7",
                        "projection_type": "snippet",
                        "data": {
                            "title": "CREATION PHINNOV Dossierdemande versionjuillet2012.doc",
                            "path": "/CREATION_PHINNOV-Dossierdemande-versionjuillet2012.doc.docx",
                            "snippet": "de recrutement : - Recherche des candidats en temps réel\n- Partage des profils\n- Suivi des candidatures\nPapiel Process :\n- Extraction des informations des <span class=\"hlt\">CVs</span> image\n- Interfaçage avec les outils métiers déjà"
                        },
                        "related_count": 1,
                        "score": 0.18271412
                    },
                ],
                "count": 2,
                "max_score": 0.58171546
            }

### Create new document [POST]
> This endpoint can only be used with token authentication.
> 
> You can't send a file and a document at the same time, you need to send the document first and then send the file on `/documents/:id/file`.

Send a new document on AnyFetch.

The [`document_type`](/resources/document-types.html) value is mandatory, every other parameter is optional, however in nearly all cases you'll specify [a unique `identifier` to retrieve the document later](/guides/concepts/identifier.html).

If no identifier is specified, it will be set to the value of the document's id.

Common parameters include `data` (data to use for full display), `metadata` (data to use for search and snippet display), `actions` (object of links) and `user_access` (an array of users authorized to view the document).

* Identifiers in `related` will be converted to their matching `id`
* Access tokens in `user_access` will be converted to their matching `user`.
* A name in `document_type` will be converted to its matching `id`.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: document was not provided with this access token, and can't be updated.
> * `409 TooManyArguments`: specify either `id` or `identifier`, not both.
> * `409 InvalidArgument`: `id` is not a valid id.
> * `409 MissingParameter`: neither `id` nor `identifier` was specified
> * `409 InvalidArgument`: no documents matched by `id`. Use `identifier` to create a new document

+ Request (application/json)

            {
                "identifier": "http://unique-document-identifier",
                "creation_date": "2014-02-05T10:39:36.623Z",
                "modification_date": "2014-02-07T12:45:56.254Z",
                "document_type": "file",
                "actions": {
                    "download": "http://example.org/download/file/url"
                },
                "data": {
                    "bar": "this will not be indexed for search"
                },
                "metadata": {
                    "foo": "this will be indexed for search"
                },
                "related": ["52dff5c53923844f15885428"],
                "user_access": ["52d96492a7f0a3ac4226f2f7"]
            }

+ Response 200 (application/json)
    + Body

            {
                "_type":"Document",
                "id":"52f2367374a24df253314b3c",
                "creation_date":"2014-02-05T10:39:36.623Z",
                "modification_date": "2014-02-07T12:45:56.254Z",
                "provider":"52f212ca74a24df25331490c",
                "company":"52f0bb24c8318c2d65000035",
                "document_type":"5252ce4ce4cfcd16f55cfa3b",
                "document_url":"https://api.anyfetch.com/documents/52f2367374a24df253314b3c",
                "actions": {
                    "download": "http://example.org/download/file/url"
                },
                "data": {
                    "bar": "this will not be indexed for search"
                },
                "metadata": {
                    "foo": "this will be indexed for search"
                },
                "related": ["52dff5c53923844f15885428"],
                "user_access": ["52d96492a7f0a3ac4226f2f7"]
            }

## Document [/documents/{id}{?search,render_templates}]
> Please note: for every endpoint in the form `/documents/{id}`, you can also use an alternative URL `/documents/identifier/{identifier}` where `identifier` is the url-encoded provider identifier.

Data regarding a document.

### Get Document [GET]
A single document with its details, [projected according to its `document_type`](/guides/concepts/projection.html). For raw data access, use `GET /documents/:id/raw`

Result contains, amongst other :

* `full` projection, in `data`,
* `title` projection, in `title`.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 ResourceNotFound`: document does not exist, or can't be accessed.
> * `409 TooManyArguments`: specify either `id` or `identifier`, not both.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
    + search (optional, string, `john smith`) ... String to highlight in the rendered document
    + render_templates (optional, boolean, `false`) ... Whether to pre-render the HTML for you in the result. Document will have the keys `rendered_full` and `rendered_title`. The `data` key will be removed for faster transfer.
+ Response 200 (application/json)
    + Body

            {
                "_type": "Document",
                "id": "53ce71b24882ec9d58f08235",
                "identifier": "https://mail.google.com/mail/b/matthieu.bacconnier@papiel.fr/#contact/79516afe8f2cdfba",
                "creation_date": "2014-07-22T14:14:10.150Z",
                "modification_date": "2014-02-07T12:45:56.254Z",
                "provider": {
                    "_type": "AccessToken",
                    "id": "53ce7198ebb324595ee9b49c",
                    "client": {
                        "_type": "Client",
                        "name": "Google Contacts",
                        "id": "52bff1eec8318cb228000001"
                    },
                    "is_basic_token": false,
                    "account_name": "matthieu.bacconnier@papiel.fr"
                },
                "company": "53c0190ae83613e049a4845b",
                "document_type": {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3a",
                    "name": "contact",
                    "templates": {
                        "full": "<article>\n\n  <section class=\"two-columns\">\n    <aside>\n      <img src=\"{{ image }}\"/>    \n    </aside>\n    <section>\n      <h1><a href=\"anyfetch://search/{{name}}\">{{{ name }}}</a></h1>\n      <span>{{{ job }}}</span>   \n    </section>\n  </section>\n\n  <section>\n    {{#phone.length}}\n    <h2>Phones:</h2>\n    <ul>\n      {{ #phone }}\n      <li>{{ phone }} ( {{ type }} )</li>\n      {{ /phone }}\n    </ul>\n    {{/phone.length}}\n\n    {{#email.length}}\n    <h2>Emails:</h2>\n    <ul>\n      {{ #email }}\n      <li>{{ email }} ( {{ type }} )</li>\n      {{ /email }}\n    </ul>\n    {{/email.length}}\n\n    {{#address.length}}\n    <h2>Address:</h2>\n    <ul>\n      {{ #address }}\n      <li>{{ address }} ( {{ type }} )</li>\n      {{ /address }}\n    </ul>\n    {{/address.length}}\n\n    {{#website.length}}\n    <h2>Website:</h2>\n    <ul>\n      {{ #website }}\n      <li>{{{ website }}}</li>\n      {{ /website }}\n    </ul>\n    {{/website.length}}\n\n\n    {{#birthday}}\n    <h2>Birthday:</h2>\n    <span>{{birthday}}</span>\n    {{/birthday}}\n\n  </section>\n\n</article>\n",
                        "title": "{{ name }}"
                    }
                },
                "actions": {
                    "show": "https://mail.google.com/mail/b/matthieu.bacconnier@papiel.fr/#contact/79516afe8f2cdfba"
                },
                "document_url": "https://api.anyfetch.com/documents/53ce71b24882ec9d58f08235",
                "projection_type": "full",
                "data": {
                    "name": "Florian Rossiaud",
                    "job": " ",
                    "phone": [
                        {
                            "phone": "+336 43 19 05 98",
                            "type": "mobile"
                        }
                    ],
                    "email": [
                        {
                            "email": "florianrossiaud@gmail.com",
                            "type": "work"
                        }
                    ],
                    "image": "data:image/*;base64,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"
                },
                "related": []
            }


### Patch Document [PATCH]
Update a document.

If the update causes new hydraters to match the document, they'll be called right away for hydration.

Hydraters use this endpoint to `PATCH` their changes to the document. They may overwrite some of your data if you `PATCH` before them.

* `metadata` and `data` objects will be merged with their respective counterparts (first-level merge only).
* Identifiers in `related` will be converted to their matching `id`
* Access tokens in `user_access` will be converted to their matching `user`.
* A name in `document_type` will be converted to its matching `id`.
* You can't update the `hydrated_by` and `hydrating` properties; they're managed internally.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 ResourceNotFound`: document does not exist, or can't be accessed.
> * `409 TooManyArguments`: specify either `id` or `identifier`, not both.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Request (application/json)

            {
                "metadata": {
                    from: "matthieu@anyfetch.com",
                    to: "mehdi@anyfetch.com"
                },
                "document_type": "email",
                "related": ["https://mail.google.com/mail/165sfd8qsf"]
            }

+ Response 204


### Delete Document [DELETE]
Remove specified document.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `401 ForbiddenScheme`: `Basic` auth is not supported for this endpoint.
> * `404 ResourceNotFound`: document does not exist, or can't be accessed.
> * `409 TooManyArguments`: specify either `id` or `identifier`, not both.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Response 204


## Similar documents [/documents/{id}/similar]
### Find similar documents [GET]
Documents similar to `id`. Still a work in progress.

Result contains, amongst other :

* `title` projection for `id` document, in `title`.
* `snippet` projection for similar documents, in `data`
* `keywords` used to find similar documents

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 ResourceNotFound`: document does not exist, or can't be accessed.
> * `409 TooManyArguments`: specify either `id` or `identifier`, not both.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Response 200 (application/json)
    + Body

            {
                "title": {
                    "name": "Florian Rossiaud"
                },
                "document_type": {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3a",
                    "name": "contact",
                    "templates": {
                        "title": "{{ name }}"
                    }
                },
                "keywords": [
                    "Florian",
                    "Rossiaud",
                    "http://www.viadeo.com/profile/0021wjjcnuk953go",
                    "http://www.google.com/profiles/104432074843338689271",
                    "florianrossiaud@gmail.com",
                ],
                "facets": {
                    "document_types": [
                        {
                            "_type": "DocumentType",
                            "id": "5252ce4ce4cfcd16f55cfa3c",
                            "name": "document",
                            "templates": {
                                "snippet": "<article>\n  <h1>{{{ title }}}</h1>\n  <blockquote>\n  \t{{{ snippet }}}\n  </blockquote>\n</article>\n",
                                "full": "<article>\n  <section>\n    <h1>{{{ title }}}</h1>\n    <code>{{ path }}</code>\n  </section>\n\n  <section>\n    {{{ content }}}\n  </section>\n</article>\n",
                                "title": "{{ title }}"
                            },
                            "description": "A document from which we were able to extract a clean HTML representation: text, doc, xls, epub...",
                            "projections": {
                                "snippet": [
                                    "title",
                                    "path",
                                    "snippet"
                                ],
                                "full": [
                                    "title",
                                    "path",
                                    "content"
                                ]
                            },
                            "document_count": 9
                        },
                        {
                            "_type": "DocumentType",
                            "id": "5252ce4ce4cfcd16f55cfa40",
                            "name": "event",
                            "templates": {
                                "snippet": "<article>\n\t<h1>{{{name}}}</h1>\n\t<span>{{startDate}}&mdash;{{endDate}}</span>\n</article>\n",
                                "full": "<article>\n\t<section>\n\t\t<h1>{{name}}</h1>\n\t\t<span>{{startDate}}&mdash;{{endDate}}</span>\n\t</section>\n\n\t{{ #attendee.length }}\n\t\t<h2>Attendees:</h2>\n\t\t{{ #attendee }}\n\t\t<li>{{.}}</li>\n\t\t{{ /attendee }}\t\n\t{{ /attendee.length }}\n\n\t<p>{{description}}</p>\n</article>\n",
                                "title": "{{ name }}"
                            },
                            "description": "An event, from a calendar for instance.",
                            "projections": {
                                "snippet": [
                                    "startDate",
                                    "endDate",
                                    "name"
                                ],
                                "full": [
                                    "startDate",
                                    "endDate",
                                    "name",
                                    "description",
                                    "attendee"
                                ]
                            },
                            "document_count": 8
                        }
                    ],
                    "providers": [
                        {
                            "_type": "AccessToken",
                            "id": "53ce7198ebb324595ee9b49c",
                            "client": {
                                "_type": "Client",
                                "name": "Google Contacts",
                                "id": "52bff1eec8318cb228000001"
                            },
                            "is_basic_token": false,
                            "account_name": "matthieu.bacconnier@papiel.fr",
                            "document_count": 71
                        },
                        {
                            "_type": "AccessToken",
                            "id": "53cf9b4fa60b43c235680d7a",
                            "client": {
                                "_type": "Client",
                                "name": "GMail",
                                "id": "53047faac8318c2d65000096"
                            },
                            "is_basic_token": false,
                            "account_name": "matthieu.bacconnier@papiel.fr",
                            "document_count": 16
                        },
                        {
                            "_type": "AccessToken",
                            "id": "53cf88997f247be935ebfd7a",
                            "client": {
                                "_type": "Client",
                                "name": "Google Drive",
                                "id": "539ef7289f240405465a2e1f"
                            },
                            "is_basic_token": false,
                            "account_name": "matthieu.bacconnier@papiel.fr",
                            "document_count": 1
                        }
                    ],
                    "creation_dates": [
                        {
                            "_type": "Date",
                            "timestamp": "1370044800000",
                            "date": "2013-06-01T00:00:00.000Z",
                            "document_count": 1
                        },
                        {
                            "_type": "Date",
                            "timestamp": "1404172800000",
                            "date": "2014-07-01T00:00:00.000Z",
                            "document_count": 87
                        }
                    ]
                },
                "data": [
                    {
                        "_type": "Document",
                        "id": "53ce71ab4882ec9d58f08215",
                        "identifier": "https://mail.google.com/mail/b/matthieu.bacconnier@papiel.fr/#contact/3d721b5e8b215a41",
                        "creation_date": "2014-07-22T14:14:03.396Z",
                        "modification_date": "2014-02-07T12:45:56.254Z",
                        "provider": {
                            "_type": "AccessToken",
                            "id": "53ce7198ebb324595ee9b49c",
                            "client": {
                                "_type": "Client",
                                "name": "Google Contacts",
                                "id": "52bff1eec8318cb228000001"
                            },
                            "is_basic_token": false,
                            "account_name": "matthieu.bacconnier@papiel.fr"
                        },
                        "company": "53c0190ae83613e049a4845b",
                        "document_type": {
                            "_type": "DocumentType",
                            "id": "5252ce4ce4cfcd16f55cfa3a",
                            "name": "contact",
                            "templates": {
                                "snippet": "<article class=\"two-columns\">\n  <aside>\n    <img src=\"{{ image }}\" />\n  </aside>\n  <section>\n    <h1>{{{ name }}}</h1>\n    <span>{{{ job }}}</span>\n  </section>\n</article>\n"
                            }
                        },
                        "actions": {
                            "show": "https://mail.google.com/mail/b/matthieu.bacconnier@papiel.fr/#contact/3d721b5e8b215a41"
                        },
                        "document_url": "https://api.anyfetch.com/documents/53ce71ab4882ec9d58f08215",
                        "projection_type": "snippet",
                        "data": {
                            "name": "Alexandre David",
                            "image": "data:image/*;base64,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",
                            "job": "Entrepreneur Shapter"
                        },
                        "related_count": 0,
                        "score": 1.0125184
                    },
                    ...
                ],
                "count": 88,
                "max_score": 1.0125184
            }


## Related documents [/documents/{id}/related]
### Find related documents [GET]
Documents related to `id`.

Result contains, amongst other :

* `title` projection for `id` document, in `title`.
* `snippet` projection for related documents, in `data`

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 ResourceNotFound`: document does not exist, or can't be accessed.
> * `409 TooManyArguments`: specify either `id` or `identifier`, not both.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Response 200 (application/json)
    + Body

            {
                "title": {
                    "subject": "very important stuff"
                },
                "document_type": "5252ce4ce4cfcd16f55cfa3f",
                "facets": {
                    "document_types": {
                        "5252ce4ce4cfcd16f55cfa3c": 1
                    },
                    "providers": {
                        "531dccedc8318cc5d1000037": 1
                    },
                    "creation_dates": {
                        "1380585600000": 1
                    }
                },
                "data": [
                    {
                        "_type": "Document",
                        "id": "531dcd94731d5a284f707ac1",
                        "creation_date": "2013-10-01T14:48:41.000Z",
                        "modification_date": "2014-02-07T12:45:56.254Z",
                        "provider": "531dccedc8318cc5d1000037",
                        "company": "52f0e4f9c8318c4dc8000039",
                        "document_type": "5252ce4ce4cfcd16f55cfa3c",
                        "actions": {},
                        "document_url": "https://api.anyfetch.com/documents/531dcd94731d5a284f707ac1",
                        "data": {
                            "title": "4400000451947",
                            "path": "/4400000451947.pdf",
                            "snippet": "\nDT061 ind 13 Prestations réalisées sous assurance qualité ISO 9001"
                        },
                        "projection_type": "snippet",
                        "related_count": 1,
                        "score": 1
                    }
                ],
                "max_score": 1
            }


## Raw access [/documents/{id}/raw]
Retrieve all raw data for `id` document.
Also include information about hydraters (`hydrated_by`, `hydrating` and `last_hydration`).

### Get raw document [GET]
View all data for the document.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 ResourceNotFound`: document does not exist, or can't be accessed.
> * `409 TooManyArguments`: specify either `id` or `identifier`, not both.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Response 200 (application/json)
    + Body

            {
                "_type": "Document",
                "id": "53ce71b24882ec9d58f08235",
                "identifier": "https://mail.google.com/mail/b/matthieu.bacconnier@papiel.fr/#contact/79516afe8f2cdfba",
                "creation_date": "2014-07-22T14:14:10.150Z",
                "modification_date": "2014-02-07T12:45:56.254Z",
                "provider": {
                    "_type": "AccessToken",
                    "id": "53ce7198ebb324595ee9b49c",
                    "client": {
                        "_type": "Client",
                        "name": "Google Contacts",
                        "id": "52bff1eec8318cb228000001"
                    },
                    "is_basic_token": false,
                    "account_name": "matthieu.bacconnier@papiel.fr"
                },
                "company": "53c0190ae83613e049a4845b",
                "document_type": {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3a",
                    "name": "contact",
                    "templates": {
                        "snippet": "<article class=\"two-columns\">\n  <aside>\n    <img src=\"{{ image }}\" />\n  </aside>\n  <section>\n    <h1>{{{ name }}}</h1>\n    <span>{{{ job }}}</span>\n  </section>\n</article>\n",
                        "full": "<article>\n\n  <section class=\"two-columns\">\n    <aside>\n      <img src=\"{{ image }}\"/>    \n    </aside>\n    <section>\n      <h1><a href=\"anyfetch://search/{{name}}\">{{{ name }}}</a></h1>\n      <span>{{{ job }}}</span>   \n    </section>\n  </section>\n\n  <section>\n    {{#phone.length}}\n    <h2>Phones:</h2>\n    <ul>\n      {{ #phone }}\n      <li>{{ phone }} ( {{ type }} )</li>\n      {{ /phone }}\n    </ul>\n    {{/phone.length}}\n\n    {{#email.length}}\n    <h2>Emails:</h2>\n    <ul>\n      {{ #email }}\n      <li>{{ email }} ( {{ type }} )</li>\n      {{ /email }}\n    </ul>\n    {{/email.length}}\n\n    {{#address.length}}\n    <h2>Address:</h2>\n    <ul>\n      {{ #address }}\n      <li>{{ address }} ( {{ type }} )</li>\n      {{ /address }}\n    </ul>\n    {{/address.length}}\n\n    {{#website.length}}\n    <h2>Website:</h2>\n    <ul>\n      {{ #website }}\n      <li>{{{ website }}}</li>\n      {{ /website }}\n    </ul>\n    {{/website.length}}\n\n\n    {{#birthday}}\n    <h2>Birthday:</h2>\n    <span>{{birthday}}</span>\n    {{/birthday}}\n\n  </section>\n\n</article>\n",
                        "title": "{{ name }}"
                    },
                    "description": "A person (contact, client, ...)",
                    "projections": {
                        "snippet": [
                            "name",
                            "image",
                            "job"
                        ],
                        "full": [
                            "name",
                            "job",
                            "phone",
                            "email",
                            "image"
                        ]
                    }
                },
                "actions": {
                    "show": "https://mail.google.com/mail/b/matthieu.bacconnier@papiel.fr/#contact/79516afe8f2cdfba"
                },
                "document_url": "https://api.anyfetch.com/documents/53ce71b24882ec9d58f08235",
                "projection_type": "raw",
                "data": {
                    "image": "data:image/*;base64,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"
                },
                "metadata": {
                    "groups": [
                        "System Group: My Contacts",
                        "Evercontact"
                    ],
                    "website": [
                        "http://www.viadeo.com/profile/0021wjjcnuk953go",
                        "http://www.google.com/profiles/104432074843338689271"
                    ],
                    "phone": [
                        {
                            "phone": "+336 43 19 04 96",
                            "type": "mobile"
                        }
                    ],
                    "email": [
                        {
                            "email": "florianrossiaud@gmail.com",
                            "type": "work"
                        }
                    ],
                    "family_name": "Rossiaud",
                    "given_name": "Florian",
                    "name": "Florian Rossiaud"
                },
                "last_hydration": null,
                "hydrating": [],
                "hydrated_by": [],
                "hydrater_errored": null,
                "hydration_error": null,
                "related": []
            }


## Image access [/documents/{id}/image{?width,search}]
Render an image for the document, using its `document_type` full projection. This is especially useful for mobile devices, where rendering complex HTML can be heavy for the user.

### Get document's image [GET]
Retrieve the image. In case you need to display the image directly, you can use the [`?oauth_access_token` authorization](/authentication.html), but be careful as sending the image URL will reveal the user token.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 ResourceNotFound`: document does not exist, or can't be accessed.
> * `409 TooManyArguments`: specify either `id` or `identifier`, not both.
> * `409 InvalidArgument`: `id` is not a valid id.
> * `409 MissingParameter`: missing `width` content in request
> * `409 InvalidArgumentError`: `width` value must be between 100 and 1920px.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
    + width (optional, int, `500`) ... Final image width, in pixel. Value must be between 100 and 1920. When left unspecified, optimal size will be selected according to content.
    + search (optional, string, `john smith`) ... String to highlight in the rendered document

+ Response 200 (image/png)
    + Body

            {binary image content}

## Associated file [/documents/{id}/file]
Work with the document's file.

### Get document file [GET]
Retrieve the file associated with a document, if any.

File is discarded once hydration is ended.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 ResourceNotFound`: document does not exist, or can't be accessed.
> * `404 ResourceNotFound`: no file associated with this document.
> * `409 TooManyArguments`: specify either `id` or `identifier`, not both.
> * `409 InvalidArgument`: `id` is not a valid id.
> * `409 MissingParameter`: missing `file` content in request

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Response 200 (application/octet-stream)
    + Body

            {binary file content}


### Set document's file [POST]
This endpoint should be used when providing, to associate a file with a document.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 ResourceNotFound`: document does not exist, or can't be accessed.
> * `404 ResourceNotFound`: no file associated with this document
> * `409 TooManyArguments`: specify either `id` or `identifier`, not both.
> * `409 InvalidArgument`: `id` is not a valid id.
> * `413 RequestEntityTooLarge`: file is too large (multi-gigabyte file)

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Request

            file={binary file content as multipart form upload}
+ Response 204















# Group Users
User resources.

## Users Collection [/users]
### List all Users [GET]
> This endpoint is only available to admin users.

Retrieve a list of all users in the current company. Users migrated in a subcompany are not shown anymore.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.

+ Response 200 (application/json)
    + Body

            [
                {
                    "_type": "User",
                    "id": "52fb7b90c8318c4dc800006c",
                    "email": "anyfetch@gmail.com",
                    "name": "",
                    "is_admin": false,
                    "user_url": "https://api.anyfetch.com/users/52fb7b90c8318c4dc800006c"
                }
            ]

### Create a User [POST]
> This endpoint is only available to admin users.

Create a new user on this company. If `is_admin` is not specified, a standard user will be created.



> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.
> * `409 MissingParameter`: missing a parameter (either `email`, `name` or `password`)
> * `409 InvalidArgument`: a user with this email already exists.


+ Request (application/json)

            {
                "email": "newuser@company.com",
                "name": "New User",
                "password": "password",
                "is_admin": false
            }
+ Response 200 (application/json)
    + Body

            {
                "_type": "User",
                "id": "533d6b2a6355285e5563d005",
                "email": "newuser@company.com",
                "name": "New User",
                "is_admin": false,
                "user_url": "https://api.anyfetch.com/users/533d6b2a6355285e5563d005"
            }

## User [/users/{id}]
A single User object with all its details. This resource has the following attributes :

- `id` id of the user
- `name` name of the user
- `email` email address of the user
- `is_admin` true if the user is admin of this company

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the User to perform action with.

### Retrieve a User [GET]
Retrieve information about specified user.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 ResourceNotFound`: the user does not exist, or is not part of this company.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 200 (application/json)
    + Body

            {
                "_type": "User",
                "id": "52fb7b90c8318c4dc800006c",
                "email": "anyfetch@gmail.com",
                "name": "",
                "is_admin": false,
                "user_url": "https://api.anyfetch.com/users/52fb7b90c8318c4dc800006c"
            }

### Update a User [PATCH]
> This endpoint can only be used with `Basic` authentication.
>
> An admin can update any user in his company.
> 
> A standard user can only update himself.

Update information about specified user. Only specified fields will be updated.

The `is_admin` flag can only be toggled by an admin of the current company.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `401 ForbiddenScheme`: `Bearer` authentication used, but this endpoint can only be used with `Basic` scheme.
> * `403 Forbidden`: you are not an administrator on this account, and you can't update someone else.
> * `403 Forbidden`: you can't downgrade yourself, you need to remain an admin.
> * `404 ResourceNotFound`: the user does not exist, or is not part of this company.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Request (application/json)

            {
                "email": "new-email@gmail.com",
                "name": "New Name",
                "password": "passwd",
                "is_admin": true,
            }

+ Response 200

            {
                "_type": "User",
                "id": "533d6b2a6355285e5563d005",
                "email": "new-email@gmail.com",
                "name": "New Name",
                "is_admin": true,
                "user_url": "https://api.anyfetch.com/users/533d6b2a6355285e5563d005"
            }


### Remove a User [DELETE]
> This endpoint is only available to admin users.
> 
> You can't delete yourself.

Remove specified user. The user should be in your company, you can't delete a user in a subcompany.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.
> * `403 NotAuthorized`: you can't delete yourself
> * `404 ResourceNotFound`: the user does not exist, or is not part of this company.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 204














# Group Document Types
## Document types [/document_types]
### List document-types [GET]
Retrieve all document types available for the current user, with document count and the date the last document with this document type was updated.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.

+ Response 200 (application/json)
    + Body

            [
                {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3d",
                    "name": "image",
                    "templates": {
                        "snippet": "<article>\n  <h1>{{{ title }}}</h1>\n\n  <img src=\"{{ thumb }}\" />\n</article>\n",
                        "full": "<article>\n  <h1>{{{ title }}}</h1>\n\n  <img src=\"{{ display }}\" />\n</article>\n",
                        "title": "{{ title }}"
                    },
                    "description": "Display thumbnail and preview data encoded in base64.",
                    "projections": {
                        "snippet": [
                            "title",
                            "thumb"
                        ],
                        "full": [
                            "title",
                            "display"
                        ]
                    },
                    "document_count": 439,
                    "updated": "2014-07-23T11:31:53.739Z"
                },
                {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa40",
                    "name": "event",
                    "templates": {
                        "snippet": "<article>\n\t<h1>{{{name}}}</h1>\n\t<span>{{startDate}}&mdash;{{endDate}}</span>\n</article>\n",
                        "full": "<article>\n\t<section>\n\t\t<h1>{{name}}</h1>\n\t\t<span>{{startDate}}&mdash;{{endDate}}</span>\n\t</section>\n\n\t{{ #attendee.length }}\n\t\t<h2>Attendees:</h2>\n\t\t{{ #attendee }}\n\t\t<li>{{.}}</li>\n\t\t{{ /attendee }}\t\n\t{{ /attendee.length }}\n\n\t<p>{{description}}</p>\n</article>\n",
                        "title": "{{ name }}"
                    },
                    "description": "An event, from a calendar for instance.",
                    "projections": {
                        "snippet": [
                            "startDate",
                            "endDate",
                            "name"
                        ],
                        "full": [
                            "startDate",
                            "endDate",
                            "name",
                            "description",
                            "attendee"
                        ]
                    },
                    "document_count": 133,
                    "updated": "2014-07-23T11:30:54.948Z"
                },
                {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3f",
                    "name": "email",
                    "templates": {
                        "snippet": "<article>\n  <h1>{{{subject}}}</h1>\n  <div class=\"two-columns\">\n    <span>{{ date }}</span>\n    <span><small>{{{from}}} &rarr; {{{to}}}</small></span>\n  </div>\n  <blockquote>{{{snippet}}}</blockquote>\n</article>\n",
                        "full": "<article class=\"email-projection\">\n <header>\n     <h1>{{{subject}}}</h1>\n     <small>{{ date }}</small>\n     <small>From: <strong>{{{from}}}</strong></small>\n     <small>To: <strong>{{{to}}}</strong></small>\n </header>\n\n <main>\n       {{{html}}}\n </main>\n</article>\n",
                        "title": "{{{ subject }}}"
                    },
                    "description": "An email",
                    "projections": {
                        "snippet": [
                            "from",
                            "to",
                            "subject",
                            "snippet",
                            "date",
                            "attachmentCount"
                        ],
                        "full": [
                            "from",
                            "to",
                            "labels",
                            "subject",
                            "html",
                            "date"
                        ]
                    },
                    "document_count": 5857,
                    "updated": "2014-07-23T11:31:01.601Z"
                },
                {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3c",
                    "name": "document",
                    "templates": {
                        "snippet": "<article>\n  <h1>{{{ title }}}</h1>\n  <blockquote>\n  \t{{{ snippet }}}\n  </blockquote>\n</article>\n",
                        "full": "<article>\n  <section>\n    <h1>{{{ title }}}</h1>\n    <code>{{ path }}</code>\n  </section>\n\n  <section>\n    {{{ content }}}\n  </section>\n</article>\n",
                        "title": "{{ title }}"
                    },
                    "description": "A document from which we were able to extract a clean HTML representation: text, doc, xls, epub...",
                    "projections": {
                        "snippet": [
                            "title",
                            "path",
                            "snippet"
                        ],
                        "full": [
                            "title",
                            "path",
                            "content"
                        ]
                    },
                    "document_count": 296,
                    "updated": "2014-07-23T11:32:06.347Z"
                },
                {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3b",
                    "name": "file",
                    "templates": {
                        "snippet": "<article>\n  <h1>{{{ title }}}</h1>\n  <code>{{{ path }}}</code>\n</article>\n",
                        "full": "<article>\n  <h1>{{{ title }}}</h1>\n  <code>{{{ path }}}</code>\n</article>\n",
                        "title": "{{ title }}"
                    },
                    "description": "Most basic document type for any kind of binary content. When a provider sends data without any additional information, it will use this document_type.",
                    "projections": {
                        "snippet": [
                            "title",
                            "path",
                            "extension"
                        ],
                        "full": [
                            "title",
                            "path",
                            "extension"
                        ]
                    },
                    "document_count": 214,
                    "updated": "2014-07-23T11:31:15.593Z"
                },
                {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3a",
                    "name": "contact",
                    "templates": {
                        "snippet": "<article class=\"two-columns\">\n  <aside>\n    <img src=\"{{ image }}\" />\n  </aside>\n  <section>\n    <h1>{{{ name }}}</h1>\n    <span>{{{ job }}}</span>\n  </section>\n</article>\n",
                        "full": "<article>\n\n  <section class=\"two-columns\">\n    <aside>\n      <img src=\"{{ image }}\"/>    \n    </aside>\n    <section>\n      <h1><a href=\"anyfetch://search/{{name}}\">{{{ name }}}</a></h1>\n      <span>{{{ job }}}</span>   \n    </section>\n  </section>\n\n  <section>\n    {{#phone.length}}\n    <h2>Phones:</h2>\n    <ul>\n      {{ #phone }}\n      <li>{{ phone }} ( {{ type }} )</li>\n      {{ /phone }}\n    </ul>\n    {{/phone.length}}\n\n    {{#email.length}}\n    <h2>Emails:</h2>\n    <ul>\n      {{ #email }}\n      <li>{{ email }} ( {{ type }} )</li>\n      {{ /email }}\n    </ul>\n    {{/email.length}}\n\n    {{#address.length}}\n    <h2>Address:</h2>\n    <ul>\n      {{ #address }}\n      <li>{{ address }} ( {{ type }} )</li>\n      {{ /address }}\n    </ul>\n    {{/address.length}}\n\n    {{#website.length}}\n    <h2>Website:</h2>\n    <ul>\n      {{ #website }}\n      <li>{{{ website }}}</li>\n      {{ /website }}\n    </ul>\n    {{/website.length}}\n\n\n    {{#birthday}}\n    <h2>Birthday:</h2>\n    <span>{{birthday}}</span>\n    {{/birthday}}\n\n  </section>\n\n</article>\n",
                        "title": "{{ name }}"
                    },
                    "description": "A person (contact, client, ...)",
                    "projections": {
                        "snippet": [
                            "name",
                            "image",
                            "job"
                        ],
                        "full": [
                            "name",
                            "job",
                            "phone",
                            "email",
                            "image"
                        ]
                    },
                    "document_count": 239,
                    "updated": "2014-07-22T14:14:16.640Z"
                }
            ]

## Document-type [/document_types/{id}]
### Get document-type [GET]
Retrieve details about the specified document-type.
This endpoint is public and can be accessed by anyone with the id.

A list of default document-types can be found on [this page](/resources/document-types.html).


+ Response 200 (application/json)
    + Body

            {
                "_type": "DocumentType",
                "id": "5252ce4ce4cfcd16f55cfa3c",
                "name": "document",
                "templates": {
                    "snippet": "<article>\n  <h1>{{{ title }}}</h1>\n  <blockquote>\n  \t{{{ snippet }}}\n  </blockquote>\n</article>\n",
                    "full": "<article>\n  <section>\n    <h1>{{{ title }}}</h1>\n    <code>{{ path }}</code>\n  </section>\n\n  <section>\n    {{{ content }}}\n  </section>\n</article>\n",
                    "title": "{{ title }}"
                },
                "description": "A document from which we were able to extract a clean HTML representation: text, doc, xls, epub...",
                "projections": {
                    "snippet": [
                        "title",
                        "path",
                        "snippet"
                    ],
                    "full": [
                        "title",
                        "path",
                        "content"
                    ]
                }
            }


# Group Providers
## Providers [/providers]
### List providers [GET]
Retrieve all providers available for the current user, with document count, a providing flag, and the date the last document created by this provider was updated.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.

+ Response 200 (application/json)
    + Body

            [
                {
                    "_type": "AccessToken",
                    "id": "53c91957cfb3211a4fc877c0",
                    "client": null,
                    "is_basic_token": true,
                    "account_name": "",
                    "document_count": 2,
                    "updated": "2014-07-23T12:01:16.036Z",
                    "providing": true,
                    "current": true
                },
                {
                    "_type": "AccessToken",
                    "id": "53ce7198ebb324595ee9b49c",
                    "client": {
                        "_type": "Client",
                        "name": "Google Contacts",
                        "id": "52bff1eec8318cb228000001"
                    },
                    "is_basic_token": false,
                    "account_name": "matthieu.bacconnier@papiel.fr",
                    "document_count": 239,
                    "updated": "2014-07-22T14:14:16.640Z",
                    "providing": false,
                    "current": false
                },
                {
                    "_type": "AccessToken",
                    "id": "53cf88997f247be935ebfd7a",
                    "client": {
                        "_type": "Client",
                        "name": "Google Drive",
                        "id": "539ef7289f240405465a2e1f"
                    },
                    "is_basic_token": false,
                    "account_name": "matthieu.bacconnier@papiel.fr",
                    "document_count": 192,
                    "updated": "2014-07-23T11:24:37.644Z",
                    "providing": false,
                    "current": false
                },
                {
                    "_type": "AccessToken",
                    "id": "53cf9b4fa60b43c235680d7a",
                    "client": {
                        "_type": "Client",
                        "name": "GMail",
                        "id": "53047faac8318c2d65000096"
                    },
                    "is_basic_token": false,
                    "account_name": "matthieu.bacconnier@papiel.fr",
                    "document_count": 6747,
                    "updated": "2014-07-23T11:32:06.347Z",
                    "providing": false,
                    "current": false
                }
            ]

## Provider [/providers/{id}]
### Get Provider [GET]
Retrieve basic information about one provider.

Note this endpoint currently returns less information than `GET /providers`.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 Not Found`: `id` does not match a token
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 200 (application/json)
    + Body

            {
                "_type": "AccessToken",
                "id": "53ce7198ebb324595ee9b49c",
                "client": {
                    "_type": "Client",
                    "name": "Google Contacts",
                    "id": "52bff1eec8318cb228000001"
                },
                "is_basic_token": false,
                "account_name": "matthieu.bacconnier@papiel.fr"
            }

### Delete Provider [DELETE]
Revokes a provider token and subsequently delete linked documents.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 Not Found`: `id` does not match a provider
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 204


## Reset a Provider [/providers/{id}/reset]

### Reset Provider [DELETE]
Resets the provider internal token. This means next time this provider is called for an update, the token's cursor will be empty, and as a consequence, all documents will be resent.

This endpoint is to be used for testing purposes, and has no reason to be used in production.
Also note the behavior for this endpoint differ from `DELETE /company/reset`, which delete linked providers.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 Not Found`: `id` does not match a provider
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 204









# Group Hydraters
## Hydraters [/hydraters]
### List Hydraters [GET]
List hydraters owned by the user's company and its parent companies. These represent the hydraters which can be applied to your company's documents.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.


+ Response 200 (application/json)
    + Body

            [
                {
                    "_type": "Hydrater",
                    "id": "5252ce4ce4cfcd16f55cfb01",
                    "url": "https://pdf.anyfetch.com/hydrate",
                    "short_name": "pdf",
                    "description": "AnyFetch Hydrater for PDF files."
                },
                {
                    "_type": "Hydrater",
                    "id": "5252ce4ce4cfcd16f55cfb06",
                    "url": "https://markdown.anyfetch.com/hydrate",
                    "short_name": "markdown",
                    "description": "AnyFetch Hydrater for markdown files."
                },
                {
                    "_type": "Hydrater",
                    "id": "5252ce4ce4cfcd16f55cfb07",
                    "url": "https://eml.anyfetch.com/hydrate",
                    "short_name": "eml",
                    "description": "AnyFetch Hydrater for EML documents."
                },
                {
                    "_type": "Hydrater",
                    "id": "5252ce4ce4cfcd16f55cfb02",
                    "url": "https://office.anyfetch.com/hydrate",
                    "short_name": "office",
                    "description": "AnyFetch Hydrater for classic office files."
                },
                {
                    "_type": "Hydrater",
                    "id": "5252ce4ce4cfcd16f55cfb03",
                    "url": "https://image.anyfetch.com/hydrate",
                    "short_name": "image",
                    "description": "AnyFetch Hydrater for images of all formats."
                },
                {
                    "_type": "Hydrater",
                    "id": "5252ce4ce4cfcd16f55cfb08",
                    "url": "https://embedmail.anyfetch.com/hydrate",
                    "short_name": "embedmail",
                    "description": "AnyFetch Hydrater to improve email conversations."
                },
                {
                    "_type": "Hydrater",
                    "id": "5252ce4ce4cfcd16f55cfb04",
                    "url": "https://ocr.anyfetch.com/hydrate",
                    "short_name": "ocr",
                    "description": "AnyFetch Hydrater for text in images."
                },
                {
                    "_type": "Hydrater",
                    "id": "5252ce4ce4cfcd16f55cfb09",
                    "url": "https://ics.anyfetch.com/hydrate",
                    "short_name": "ics",
                    "description": "AnyFetch Hydrater for ics files."
                },
                {
                    "_type": "Hydrater",
                    "id": "5252ce4ce4cfcd16f55cfb00",
                    "url": "https://plaintext.anyfetch.com/hydrate",
                    "short_name": "plaintext",
                    "description": "AnyFetch Hydrater for generic files."
                },
                {
                    "_type": "Hydrater",
                    "id": "5252ce4ce4cfcd16f55cfb05",
                    "url": "https://iptc.anyfetch.com/hydrate",
                    "short_name": "iptc",
                    "description": "AnyFetch Hydrater for metadata embedded into image files."
                },
                {
                    "_type": "Hydrater",
                    "id": "5252ce4ce4cfcd16f55cfb10",
                    "url": "https://filecleaner.anyfetch.com/hydrate",
                    "short_name": "filecleaner",
                    "description": "AnyFetch Hydrater that removes garbage documents."
                }
            ]

### Create Hydrater [POST]
Create a new hydrater owned by your company. Your company and subcompanies will be able to use it to hydrate their documents.
See [how to create a hydrater](/guides/creating/hydrater.html).

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.

+ Request (application/json)
    + Body

            {
                "short_name": "markdown",
                "description": "AnyFetch Hydrater for markdown files.",
                "url": "https://markdown.anyfetch.com/hydrate",
                "excludes": ["https://plaintext.anyfetch.com/hydrate"],
                "filters": [
                    {
                        "metadata" : {
                            "path": "/\\.(md|mkd|markdown)$/i",
                        },
                        "documentType": {
                            "name": "file"
                        },
                        "filePath": "/^./"
                    },
                ]
            }

+ Response 200 (application/json)
    + Body

            {
                "_type": "Hydrater",
                "id": "5252ce4ce4cfcd16f55a565c",
                "url": "https://markdown.anyfetch.com/hydrate",
                "short_name": "markdown",
                "description": "AnyFetch Hydrater for markdown files."
            },



## Hydrater [/hydraters/{id}]
### Get Hydrater [GET]
Retrieve information about one hydrater.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 Not Found`: `id` does not match any hydrater
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 200 (application/json)
    + Body

            {
                "_type": "Hydrater",
                "id": "5252ce4ce4cfcd16f55a565c",
                "url": "https://markdown.anyfetch.com/hydrate",
                "short_name": "markdown",
                "description": "AnyFetch Hydrater for markdown files."
            }


### Delete Hydrater [DELETE]
Delete a hydrater.
You must be admin of your company to delete a hydrater.
You cannot delete a hydrater which is owned by one of your subcompanies.

Deleting a hydrater will result in removing this hydrater in your company and subcompanies selected hydraters.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.
> * `404 NotFound`: unable to find the hydrater to delete

+ Response 204




# Group Misc
## Batch calls [/batch{?pages}]
### Batch querying [GET]
Queue multiple `GET` queries in a single request. For instance, you can call `/batch?pages=/&pages=/document_types&pages=/providers` to get one JSON object with all data, indexed by url.

Status code will be 200 if all queries passed. If an error occured, the `errored` key will tell you which page failed to load.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `405 MethodNotAllowed`: unable to access some `page` with GET.
> * `409 MissingParameter`: no `page` specified, or invalid `page` value.

+ Parameters
    + pages (required, string, `/document_types`) ... url to retrieve (url-encoded). <small>Multiple pages parameters can be used to queue queries.</small>
+ Response 200 (application/json)
    + Body

            {
                "/": {
                    "user_email": "matthieu@anyfetch.com",
                    "documents_url": "https://api.anyfetch.com/documents/",
                    "document_types_url": "https://api.anyfetch.com/document_types/",
                    "providers_url": "https://api.anyfetch.com/providers/",
                    "users_url": "https://api.anyfetch.com/users/",
                    "current_user_url": "https://api.anyfetch.com/users/53c0190ae83613e049a4845a",
                    "update_url": "https://api.anyfetch.com/company/update",
                    "reset_url": "https://api.anyfetch.com/company/reset",
                    "token_url": "https://api.anyfetch.com/token",
                    "server_time": "2014-07-23T13:38:38.397Z"
                },
                "/document_types/5252ce4ce4cfcd16f55cfa3c": {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3c",
                    "name": "document",
                    "templates": {
                        "snippet": "<article>\n  <h1>{{{ title }}}</h1>\n  <blockquote>\n  \t{{{ snippet }}}\n  </blockquote>\n</article>\n",
                        "full": "<article>\n  <section>\n    <h1>{{{ title }}}</h1>\n    <code>{{ path }}</code>\n  </section>\n\n  <section>\n    {{{ content }}}\n  </section>\n</article>\n",
                        "title": "{{ title }}"
                    },
                    "description": "A document from which we were able to extract a clean HTML representation: text, doc, xls, epub...",
                    "projections": {
                        "snippet": [
                            "title",
                            "path",
                            "snippet"
                        ],
                        "full": [
                            "title",
                            "path",
                            "content"
                        ]
                    }
                }
            }
