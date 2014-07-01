FORMAT: 1A
HOST: https://api.anyfetch.com

# anyFetch API Documentation

> This page is anyFetch reference. See [http://developers.anyfetch.com](this page) for informations regarding general usage.

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
                    "user_email": "anyfetch@gmail.com",
                    "documents_url": "/documents/",
                    "document_types_url": "/document_types/",
                    "providers_url": "/providers/",
                    "users_url": "/users/",
                    "current_user_url": "/users/52fb7b90c8318c4dc800006c",
                    "update_url": "/company/update",
                    "reset_url": "/company/reset",
                    "token_url": "/token",
                    "server_time": "2014-03-24T16:33:41.074Z"
                },
                "/providers": {
                    "53234698c8318cc5d100004f": {
                        "client": "53232d1dc8318cba94000042",
                        "name": "Evernote",
                        "updated": "2014-03-14T18:15:37.603Z",
                        "document_count": 2
                    },
                    "5320a682c8318cba94000040": {
                        "client": "52bff114c8318c29e9000005",
                        "name": "Dropbox",
                        "updated": "2014-03-21T16:48:16.486Z",
                        "document_count": 14
                    },
                    "5320a6abc8318cc5d1000049": {
                        "client": "53047faac8318c2d65000096",
                        "name": "GMail",
                        "updated": "2014-03-20T19:15:11.048Z",
                        "document_count": 26
                    }
                }
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
                "documents_url": "/documents/",
                "document_types_url": "/document_types/",
                "providers_url": "/providers/",
                "users_url": "/users/",
                "current_user_url": "/users/52fb7b90c8318c4dc800006c",
                "update_url": "/company/update",
                "reset_url": "/company/reset",
                "token_url": "/token",
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

Remove the token returned by `GET /token`.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 ForbiddenScheme`: `Bearer` authentication used, but this endpoint can only be used with `Basic` scheme.
> * `401 InvalidCredentials`: non matching user

+ Response 204

# Group Company
## Company [/company]
### Retrieve current company [GET]
Retrieve the current company details.

Contains your company name, and the list of hydraters used on the account.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.

+ Response 200 (application/json)
    + Body

            {
                "_type": "Company",
                "id": "531dd2f3c8318cc5d100003c",
                "name": "test@anyfetch.com",
                "hydraters": [
                    "http://plaintext.hydrater.anyfetch.com/hydrate",
                    "http://pdf.hydrater.anyfetch.com/hydrate",
                    "http://office.hydrater.anyfetch.com/hydrate",
                    "http://image.hydrater.anyfetch.com/hydrate",
                    "http://ocr.hydrater.anyfetch.com/hydrate",
                    "http://eml.hydrater.anyfetch.com/hydrate"
                ]
            }

## Update company documents [/company/update]
### Update documents [POST]
Ping all providers for the current company, checking for new available documents.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `429 Too Many Requests`: this endpoint is throttled at 1 request per second, with a burst of 2 / s.

+ Response 202

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

Retrieve all subcompanies from the current company.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.

+ Response 200 (application/json)
    + Body

            [
                {
                    "_type": "Company",
                    "id": "533d87ea162215a5375d34d1",
                    "name": "new-user-subcompany",
                    "hydraters": [
                        "http://plaintext.hydrater.anyfetch.com/hydrate",
                        "http://pdf.hydrater.anyfetch.com/hydrate",
                        "http://office.hydrater.anyfetch.com/hydrate",
                        "http://image.hydrater.anyfetch.com/hydrate",
                        "http://ocr.hydrater.anyfetch.com/hydrate",
                        "http://eml.hydrater.anyfetch.com/hydrate"
                    ]
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
                "user": "52fb7b90c8318c4dc800006c"
                "name": "new-subcompany-name",
            }

+ Response 200 (application/json)

            {
                "_type": "Company",
                "id": "533d9161162215a5375d34d2",
                "name": "new-subcompany-name",
                "hydraters": [
                    "http://plaintext.hydrater.anyfetch.com/hydrate",
                    "http://pdf.hydrater.anyfetch.com/hydrate",
                    "http://office.hydrater.anyfetch.com/hydrate",
                    "http://image.hydrater.anyfetch.com/hydrate",
                    "http://ocr.hydrater.anyfetch.com/hydrate",
                    "http://eml.hydrater.anyfetch.com/hydrate"
                ]
            }

## Subcompany [/subcompanies/{id}]
### Retrieve a subcompany [GET]
> This endpoint is only available to admin users.

Retrieve a specific subcompany from the current company.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 200 (application/json)
    + Body

            {
                "_type": "Company",
                "id": "533d87ea162215a5375d34d1",
                "name": "new-user-subcompany",
                "hydraters": [
                    "http://plaintext.hydrater.anyfetch.com/hydrate",
                    "http://pdf.hydrater.anyfetch.com/hydrate",
                    "http://office.hydrater.anyfetch.com/hydrate",
                    "http://image.hydrater.anyfetch.com/hydrate",
                    "http://ocr.hydrater.anyfetch.com/hydrate",
                    "http://eml.hydrater.anyfetch.com/hydrate"
                ]
            }

### Delete a subcompany [DELETE]
Delete the subcompany, **all** its documents and **all** its users.

By default, you are not allowed to remove a subcompany with subsubcompanies. To force the subcompany removal, add `?force=1`.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `403 Forbidden`: you are not an administrator on this account.
> * `403 Forbidden`: the subcompanies has subsubcompanies and can't be removed, use `?force=1`.
> * `404 ResourceNotFound`: the subcompany does not exist, or is not available for this user.
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 204

















# Group Documents
Endpoints for retrieving documents

## Documents [/documents{?search, ?before, ?after, ?document_type, ?provider, ?id, ?_meta, ?has_meta, ?snippet_size, ?start, ?limit, ?sort}]
Access documents resources.

### Search documents [GET]
Search within all available data for documents matching specified filter.

Return informations aggregated over the result set. The `score` key indicated document's relevance regarding query.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `409 InvalidArgument`: malformed search query, with misused characters (such as `+ - && || ! ( ) { } [ ] ^ \" ~ * ? : \\`)

+ Parameters
    + search (optional, string, `john smith`) ... Search query, probably the most important parameter for this query
    + before (optional, date, `2014-03-21`) ... Only display documents created before this date.
    + after (optional, date, `2014-01-25`) ... Only display documents created after this date.
    + id (optional, array, `5252ce4ce4cfcd16f55cfa3f`) ... Only retrieve documents matching this id. <small>You can use the param multiple times to allow for multiples `id`, for instance `?id=1&id=2&id=3`</small>.
    + document_type (optional, array, `5252ce4ce4cfcd16f55cfa3f`) ... Only retrieve documents matching this document type. <small>You can use the param multiple times to allow for multiples `document_type`</small>.
    + provider (optional, array, `5252ce4ce4cfcd16f55cfa3f`) ... Only retrieve documents matching this provider. <small>You can use the param multiple times to allow for multiples `provider`</small>
    + _meta (optional, string, `John Smith`) ... Strict search on `meta` key. Replace `meta` with the name of the meta you wish to search on.
    + meta (optional, string, `John`) ... (prepend name with @) Full text search on `meta` key.  Replace `meta` with the name of the meta you wish to search on, for instance `?@name=john`
    + has_meta (optional, boolean, `1`) ... Only returns document having the `meta` key. Replace `meta` with the name of the meta you wish to search on.
    + snippet_size (optional, integer, `200`) ... Number of chars to include in the snippet
    + start (optional, integer, `5`) ... 0-based index of the first item to retrieve (for pagination).
    + limit (optional, integer, `20`) ... Max number of items to retrieve (for pagination)
    + sort (optional, string, `creationDate`) ... Sort criteria. Can be `creationDate` (sort by document creation date), `lastModification` (sort by last modification date) or `_score` (default, sort by relevance to the query). Prepend with a `-` to reverse order (e.g. `-creationDate`).

+ Response 200 (application/json)
    + Body

            {
                facets: {
                    "document_types": {
                        "5252ce4ce4cfcd16f55cfa41": 1,
                        "5252ce4ce4cfcd16f55cfa3c": 1
                    },
                    "providers": {
                        "53234698c8318cc5d100004f": 1,
                        "5320a682c8318cba94000040": 1
                    },
                    "creation_dates": {
                        "1393632000000": 2
                    },
                },
                "max_score": 0.4612878,
                "count": 2,
                "next_page_url": "coming",
                "previous_page_url": "coming",
                "data": [
                    {
                        "_type": "Document",
                        "id": "5320a7735ee6eed51339a1b3",
                        "identifier": "https://dropbox.com/228115297/all/anyfetchpitchdeckSF.pdf",
                        "creation_date": "2014-03-12T18:29:07.441Z",
                        "provider": "5320a682c8318cba94000040",
                        "company": "52fb7b90c8318c4dc800006b",
                        "document_type": "5252ce4ce4cfcd16f55cfa3c",
                        "actions": {
                            "show": "https://www.dropbox.com/home%2Fall%2FanyFetch%20pitch%20deck%20SF%20-%20CHarly%20Kevers.pdf"
                        },
                        "document_url": "/documents/5320a7735ee6eed51339a1b3",
                        "data": {
                            "title": "anyFetch pitch deck SF   CHarly Kevers",
                            "path": "/all/anyFetch pitch deck SF - CHarly Kevers.pdf",
                            "snippet": "\nanyFetch\nENTERPRISE SEARCH in the CLOUD\nMehdi Bouheddi - CEO\n10-03-2014\nThe amount of data in the enterprise is more than 10 000 × Google\nBut it is a mess...\nChallenge : find the relevant information\n"
                        },
                        "projection_type": "snippet",
                        "related_count": 0,
                        "score": 0.4612878
                    },
                    {
                        "_type": "Document",
                        "id": "532347451eab8a0e22c2e65f",
                        "identifier": "https://evernote.com/s1/sh/6dbd89d6",
                        "creation_date": "2014-03-14T17:26:15.000Z",
                        "provider": "53234698c8318cc5d100004f",
                        "company": "52fb7b90c8318c4dc800006b",
                        "document_type": "5252ce4ce4cfcd16f55cfa41",
                        "actions": {
                            "show": "http://anyfetch-provider-evernote.herokuapp.com/shard/s1/sh/6dbd89d6-1d80-4292-97fb-a0511cee5973/c5a8ad2ccc6b21ef43bb80fccc2d3544"
                        },
                        "document_url": "/documents/532347451eab8a0e22c2e65f",
                        "data": {
                            "subject": "Follow up Charly <span class=\"hlt\">Kevers</span>",
                            "description": "Ask him to send an Email to Nick and schedule a meeting with Alex.",
                            "status": "TODO"
                        },
                        "projection_type": "snippet",
                        "related_count": 0,
                        "score": 0.16041306
                    }
                ]
            }

### Create new document [POST]
> This endpoint can only be used with token authentication.
> 
> You can't send a file and a document at the same time, you need to send the document first and then send the file on `/documents/:id/file`.

Send a new document on anyFetch.

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
                "provider":"52f212ca74a24df25331490c",
                "company":"52f0bb24c8318c2d65000035",
                "document_type":"5252ce4ce4cfcd16f55cfa3b",
                "document_url":"/documents/52f2367374a24df253314b3c",
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

## Document [/documents/{id}{?search}]
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
+ Response 200 (application/json)
    + Body

            {
                "_type": "Document",
                "id": "532347451eab8a0e22c2e65f",
                "creation_date": "2014-03-14T17:26:15.000Z",
                "provider": "53234698c8318cc5d100004f",
                "company": "52fb7b90c8318c4dc800006b",
                "document_type": "5252ce4ce4cfcd16f55cfa41",
                "actions": {
                    "show": "http://anyfetch-provider-evernote.herokuapp.com/shard/s1/sh/6dbd89d6-1d80-4292-97fb-a0511cee5973/c5a8ad2ccc6b21ef43bb80fccc2d3544"
                },
                "document_url": "/documents/532347451eab8a0e22c2e65f",
                "data": {
                    "subject": "Follow up Charly Kevers",
                    "status": "TODO",
                    "description": "Ask him to send an Email to Nick and schedule a meeting with Alex."
                },
                "projection_type": "full",
                "related": [],
                "title": {
                    "subject": "Follow up Charly Kevers"
                }
            }


### Patch Document [PATCH]
Update a document.

If the update causes new hydraters to match the document, they'll be called right away for hydration.

Hydraters use this endpoint to `PATCH` their changes to the document. They may overwrite some of your data if you `PATCH` before them.

* `metadata` and `data` objects will be merged with their respective counterparts (first-level merge only).
* Identifiers in `related` will be converted to their matching `id`
* Access tokens in `user_access` will be converted to their matching `user`.
* A name in `document_type` will be converted to its matching `id`.

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
                    "subject": "Follow up Charly Kevers"
                },
                "document_type": "5252ce4ce4cfcd16f55cfa41",
                "keywords": [
                    "todo",
                    "nick",
                    "alex",
                    "charly",
                    "kevers"
                ],
                "document_types": {
                    "5252ce4ce4cfcd16f55cfa3f": 5,
                    "5252ce4ce4cfcd16f55cfa3c": 4,
                    "5252ce4ce4cfcd16f55cfa41": 1
                },
                "providers": {
                    "5320a6abc8318cc5d1000049": 5,
                    "5320a682c8318cba94000040": 4,
                    "53234698c8318cc5d100004f": 1
                },
                "next_page_url": "coming",
                "previous_page_url": "coming",
                "data": [
                    {
                        "_type": "Document",
                        "id": "5320a76fbc2e51d7135f0c8c",
                        "creation_date": "2014-02-14T08:46:11.000Z",
                        "provider": "5320a6abc8318cc5d1000049",
                        "company": "52fb7b90c8318c4dc800006b",
                        "document_type": "5252ce4ce4cfcd16f55cfa3f",
                        "actions": {
                            "show": "https://mail.google.com/mail/b/anyfetch@gmail.com/?cm#all/1442f93143ab3bb6"
                        },
                        "document_url": "/documents/5320a76fbc2e51d7135f0c8c",
                        "data": {
                            "from": "Udacity <support@udacity.com>",
                            "to": "anyfetch@gmail.com",
                            "subject": "Verify Your <span class=\"hlt\">Email</span> on Udacity",
                            "snippet": "Hi Any,\r\n\r\nTo complete your sign <span class=\"hlt\">up</span>, please verify your <span class=\"hlt\">email</span> using the following link:\r\n\r\nhttps://www.udacity.com/account/verify_email?user_key=788038764&code=YbD5SsnEMa\r\n\r\nCheers,\r\n\r\nThe Udacity Team\r\n",
                            "date": "Friday, February 14, 2014"
                        },
                        "projection_type": "snippet",
                        "related_count": 0
                    }
                ]
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
                        "provider": "531dccedc8318cc5d1000037",
                        "company": "52f0e4f9c8318c4dc8000039",
                        "document_type": "5252ce4ce4cfcd16f55cfa3c",
                        "actions": {},
                        "document_url": "/documents/531dcd94731d5a284f707ac1",
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
                "max_score": 1,
                "next_page_url": "coming",
                "previous_page_url": "coming"
            }


## Raw access [/documents/{id}/raw]
Retrieve all raw data for `id` document.
Also include information about hydraters (`hydratedBy`, `hydrating` and `lastHydration`).

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
                "id": "532347451eab8a0e22c2e65f",
                "creation_date": "2014-03-14T17:26:15.000Z",
                "provider": "53234698c8318cc5d100004f",
                "company": "52fb7b90c8318c4dc800006b",
                "document_type": "5252ce4ce4cfcd16f55cfa41",
                "actions": {
                    "show": "http://anyfetch-provider-evernote.herokuapp.com/shard/s1/sh/6dbd89d6-1d80-4292-97fb-a0511cee5973/c5a8ad2ccc6b21ef43bb80fccc2d3544"
                },
                "document_url": "/documents/532347451eab8a0e22c2e65f",
                "identifier": "http://anyfetch-provider-evernote.herokuapp.com/shard/s1/sh/6dbd89d6-1d80-4292-97fb-a0511cee5973/c5a8ad2ccc6b21ef43bb80fccc2d3544",
                "data": {},
                "metadata": {
                    "status": "TODO",
                    "description": "Ask him to send an Email to Nick and schedule a meeting with Alex.",
                    "subject": "Follow up Charly Kevers"
                },
                "last_hydration": "2014-03-14T18:15:37.600Z",
                "hydrating": [],
                "hydrated_by": [],
                "projection_type": "raw",
                "related": []
            }


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
+ Response 200
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
                    "user_url": "/users/52fb7b90c8318c4dc800006c"
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
                "user_url": "/users/533d6b2a6355285e5563d005"
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
                "user_url": "/users/52fb7b90c8318c4dc800006c"
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
                "user_url": "/users/533d6b2a6355285e5563d005"
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

The key will be reused on the `document_type` property for every `/documents/` endpoint.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.

+ Response 200 (application/json)
    + Body

            {
                "5252ce4ce4cfcd16f55cfa3c": {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3c",
                    "name": "document",
                    "templates": {
                        "snippet": "<article>\n  <h1>{{{ title }}}</h1>\n  <blockquote>\n  \t{{{ snippet }}}\n  </blockquote>\n</article>\n",
                        "full": "<article>\n  <section>\n    <h1>{{{ title }}}</h1>\n    <code>{{ path }}</code>\n  </section>\n\n  <section>\n    {{{ content }}}\n  </section>\n</article>\n",
                        "title": "{{ title }}"
                    },
                    "updated": "2014-04-24T17:23:01.722Z",
                    "documents": 1
                },
                "5252ce4ce4cfcd16f55cfa3f": {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3f",
                    "name": "email",
                    "templates": {
                        "snippet": "<article>\n  <h1>{{{subject}}}</h1>\n  <div class=\"two-columns\">\n    <span>{{ date }}</span>\n    <span><small>{{from}} &rarr; {{to}}</small></span>\n  </div>\n  <blockquote>{{{snippet}}}</blockquote>\n</article>\n",
                        "full": "<article class=\"email-projection\">\n <header>\n     <h1>{{{subject}}}</h1>\n     <small>{{ date }}</small>\n     <small>From: <strong><a href=\"anyfetch://search/{{from}}\">{{from}}</a></strong></small>\n     <small>To: <strong><a href=\"anyfetch://search/{{to}}\">{{to}}</a></strong></small>\n </header>\n\n <main>\n       {{{html}}}\n </main>\n</article>\n",
                        "title": "{{ subject }}"
                    },
                    "updated": "2014-04-24T17:22:54.522Z",
                    "documents": 12
                }
            }













# Group Providers
## Providers [/providers]
### List providers [GET]
Retrieve all providers available for the current user, with document count and the date the last document created by this provider was updated.

The key will be reused on the `provider` property for every `/documents/` endpoint.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme.
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.

+ Response 200 (application/json)
    + Body

            {
                "53234698c8318cc5d100004f": {
                    "client": "53232d1dc8318cba94000042",
                    "name": "Evernote",
                    "updated": "2014-03-14T18:15:37.603Z",
                    "document_count": 2
                },
                "5320a682c8318cba94000040": {
                    "client": "52bff114c8318c29e9000005",
                    "name": "Dropbox",
                    "updated": "2014-03-21T16:48:16.486Z",
                    "document_count": 14
                },
                "5320a6abc8318cc5d1000049": {
                    "client": "53047faac8318c2d65000096",
                    "name": "GMail",
                    "updated": "2014-03-20T19:15:11.048Z",
                    "document_count": 26
                }
            }

## Provider [/providers/{id}]
### Get Provider [GET]
Retrieve basic information about one provider.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 Not Found`: `id` does not match a token
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 200 (application/json)
    + Body

            {
                "id": "53234698c8318cc5d100004f",
                "is_basic_token": false,
                "client": {
                    "id": "53232d1dc8318cba94000042",
                    "name": "Evernote"
                }
            }

### Delete Provider [DELETE]
> This endpoint can only be used with `Basic` authentication.

Revokes a provider token and subsequently deletes linked documents.

> * `401 Unauthorized`: you did not specify any credentials, or you are using a non-supported `Authorization` scheme
> * `401 InvalidCredentials`: you did not specify a token, or your token is invalid / has been revoked.
> * `404 Not Found`: `id` does not match a token
> * `409 InvalidArgument`: `id` is not a valid id.

+ Response 204
