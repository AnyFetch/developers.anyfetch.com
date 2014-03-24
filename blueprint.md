FORMAT: 1A
HOST: http://www.api.anyfetch.com

# Fetch API Documentation

**Fetch API** is designed to help you search in  massive amounts of documents coming from various sources, in various formats. See [authentication](/authentication.html) for authentication details.

# Group API
## GET /status
Get the current status of the Fetch API.
Should have a property status of "OK".

+ Response 200 (application/json)
    + Body

            {
                "status": "ok",
                "message": ""
            }

# Group Account
## Index [/]
### Retrieve API links [GET]
Retrieve datas about the current account. This endpoint return:

- url to different part of the API (HATEOAS design). Notice the `current_user_url` key.
- `server_time`: current server date, if you need to compute deltas with local client.

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
> This endpoint can only be used with basic authentication.

Create or retrieve a token. The token will always be the same until you call `/company/reset`.

**The token should not be used to provide documents. Use it for frontend access.**

+ Response 200 (application/json)
    + Body

            {
                "token": "ebe7ec3ca678ad1d8b09f135155ab9b7f1eea10cee67d0629031301c82d2d688"
            }

# Group Company
## Company [/company]
### Retrieve current company [GET]
Retrieve the current company details.

Contains your company name, and the list of hydraters used on the account.

+ Response 200 (application/json)
    + Body

            {
                "_type": "Company",
                "id": "531dd2f3c8318cc5d100003c",
                "name": "test3@papiel.fr",
                "hydraters": [
                    "http://plaintext.hydrater.anyfetch.com/hydrate",
                    "http://pdf.hydrater.anyfetch.com/hydrate",
                    "http://office.hydrater.anyfetch.com/hydrate",
                    "http://image.hydrater.anyfetch.com/hydrate",
                    "http://ocr.hydrater.anyfetch.com/hydrate",
                    "http://eml.hydrater.anyfetch.com/hydrate"
                ]
            }

## Update company's documents [/company/update]
### Update documents [POST]
Ping all providers for the current company, checking for new available documents.

+ Response 204

## Reset company [/company/reset]
## Reset company [DELETE]
Reset all documents, tokens and providers from the account.

> **Note:** Use with caution! Reset everything.

+ Response 204



















# Group Documents
Endpoints for retrieving documents

## Documents [/documents{?search, ?before, ?after,?document_type, ?token, ?_meta, ?has_meta, ?related_to, ?snippet_size, ?start, ?limit, ?no_hydration}]
Access documents resources.

### Search documents [GET]
Search within all availables datas for documents matching specified filter.

Return aggregated informations computed over the result set. The `score` key tells document's relevance regarding query.

+ Parameters
    + search (optional, string, `john smith`) ... Search query, probably the most important parameter for this query
    + before (optional, date, `2014-03-21`) ... Only display documents created before this date.
    + after (optional, date, `2014-01-25`) ... Only display documents created after this date.
    + document_type (optional, array, `5252ce4ce4cfcd16f55cfa3f`) ... Only retrieve documents matching this document type. <small>You can use the param multiple times to allow for multiples `document_type`</small>.
    + token (optional, array, `5252ce4ce4cfcd16f55cfa3f`) ... Only retrieve documents matching this token. <small>You can use the param multiple times to allow for multiples `token`</small>
    + _meta (optional, string, `John Smith`) ... Strict search on `meta` key. Replace `meta` with the name of the meta you wish to search on.
    + @meta (optional, string, `John`) ... Full text search on `meta` key.  Replace `meta` with the name of the meta you wish to search on.
    + has_meta (optional, boolean, `1`) ... Only returns document having the `meta` key. Replace `meta` with the name of the meta you wish to search on.
    + related_to (optional, string, `53273bd31eab8a0e22c2e663`) ... Find documents related to the specified document
    + snippet_size (optional, integer, `250`) ... Number of chars to include in the snippet
    + start (optional, integer, `5`) ... 0-based index of the first item to retrieve (for pagination).
    + limit (optional, integer, `20`) ... Max number of items to retrieve (for pagination)
+ Response 200 (application/json)
    + Body

            {
                "document_types": {
                    "5252ce4ce4cfcd16f55cfa41": 1,
                    "5252ce4ce4cfcd16f55cfa3c": 1
                },
                "tokens": {
                    "53234698c8318cc5d100004f": 1,
                    "5320a682c8318cba94000040": 1
                },
                "creation_date": {
                    "1393632000000": 2
                },
                "max_score": 0.4612878,
                "next_page_url": "coming",
                "previous_page_url": "coming",
                "datas": [
                    {
                        "_type": "Document",
                        "id": "5320a7735ee6eed51339a1b3",
                        "creation_date": "2014-03-12T18:29:07.441Z",
                        "token": "5320a682c8318cba94000040",
                        "company": "52fb7b90c8318c4dc800006b",
                        "document_type": "5252ce4ce4cfcd16f55cfa3c",
                        "actions": {
                            "show": "https://www.dropbox.com/home%2Fall%2FanyFetch%20pitch%20deck%20SF%20-%20CHarly%20Kevers.pdf"
                        },
                        "document_url": "/documents/5320a7735ee6eed51339a1b3",
                        "datas": {
                            "title": "anyFetch pitch deck SF   CHarly Kevers",
                            "path": "/all/anyFetch pitch deck SF - CHarly Kevers.pdf",
                            "snippet": "\nanyFetch\nENTERPRISE SEARCH in the CLOUD\nMehdi Bouheddi - CEO\n10-03-2014\nThe amount of data in the enterprise is more than 10 000 × Google\nBut it is a mess...\nChallenge : find the relevant information\n"
                        },
                        "related": 0,
                        "score": 0.4612878
                    },
                    {
                        "_type": "Document",
                        "id": "532347451eab8a0e22c2e65f",
                        "creation_date": "2014-03-14T17:26:15.000Z",
                        "token": "53234698c8318cc5d100004f",
                        "company": "52fb7b90c8318c4dc800006b",
                        "document_type": "5252ce4ce4cfcd16f55cfa41",
                        "actions": {
                            "show": "http://anyfetch-provider-evernote.herokuapp.com/shard/s1/sh/6dbd89d6-1d80-4292-97fb-a0511cee5973/c5a8ad2ccc6b21ef43bb80fccc2d3544"
                        },
                        "document_url": "/documents/532347451eab8a0e22c2e65f",
                        "datas": {
                            "subject": "Follow up Charly <span class=\"hlt\">Kevers</span>",
                            "description": "Ask him to send an Email to Nick and schedule a meeting with Alex.",
                            "status": "TODO"
                        },
                        "related": 0,
                        "score": 0.16041306
                    }
                ]
            }

### Create new document [POST]
> This endpoint can only be used with token authentication.

Send a new document on anyFetch.

> You can't send a file and a document at the same time, you need to send the document first and then send the file on `/documents/:id/file`.

+ Parameters
    + no_hydration (optional, boolean, `1`) ... Delay hydration until file is sent. Default to false.
+ Request

            {
                "identifier": "http://unique-document-identifier",
                "document_type": "file",
                "actions": {
                    "download": "http://example.org/download/file/url"
                },
                "datas": {
                    "bar": "this will not be indexed for search"
                },
                "metadatas": {
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
                "token":"52f212ca74a24df25331490c",
                "company":"52f0bb24c8318c2d65000035",
                "document_type":"5252ce4ce4cfcd16f55cfa3b",
                "document_url":"/documents/52f2367374a24df253314b3c",
                "actions": {
                    "download": "http://example.org/download/file/url"
                },
                "datas": {
                    "bar": "this will not be indexed for search"
                },
                "metadatas": {
                    "foo": "this will be indexed for search"
                },
                "related": ["52dff5c53923844f15885428"],
                "user_access": ["52d96492a7f0a3ac4226f2f7"]
            }

## Document [/documents/{id}{?search}]
Datas regarding a document.

> Please note: for every endpoint in the form `/documents/{id}`, you can also use an alternative URL: `/documents/identifier/{identifier}` where `identifier` is the url-encoded provider identifier.

### Get Document [GET]
A single document with its details.

Result contains, amongst other :

* full projection, in `datas`,
* `title` projection, in `title`.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
    + search (optional, string, `john smith`) ... String to highlight in the rendered document
+ Response 200 (application/json)
    + Body

            {
                "_type": "Document",
                "id": "532347451eab8a0e22c2e65f",
                "creation_date": "2014-03-14T17:26:15.000Z",
                "token": "53234698c8318cc5d100004f",
                "company": "52fb7b90c8318c4dc800006b",
                "document_type": "5252ce4ce4cfcd16f55cfa41",
                "actions": {
                    "show": "http://anyfetch-provider-evernote.herokuapp.com/shard/s1/sh/6dbd89d6-1d80-4292-97fb-a0511cee5973/c5a8ad2ccc6b21ef43bb80fccc2d3544"
                },
                "document_url": "/documents/532347451eab8a0e22c2e65f",
                "datas": {
                    "subject": "Follow up Charly Kevers",
                    "status": "TODO",
                    "description": "Ask him to send an Email to Nick and schedule a meeting with Alex."
                },
                "related": [],
                "title": {
                    "subject": "Follow up Charly Kevers"
                }
            }

### Delete Document [DELETE]
Remove specified document.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Response 204


## Similar documents [/documents/{id}/similar]
### Find similar documents [GET]
Documents similar to `id`.


Result contains, amongst other :

* `title` projection for the `id` document, in `title`.
* `snippet` projection for similar documents

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
                "tokens": {
                    "5320a6abc8318cc5d1000049": 5,
                    "5320a682c8318cba94000040": 4,
                    "53234698c8318cc5d100004f": 1
                },
                "next_page_url": "coming",
                "previous_page_url": "coming",
                "datas": [
                    {
                        "_type": "Document",
                        "id": "5320a76fbc2e51d7135f0c8c",
                        "creation_date": "2014-02-14T08:46:11.000Z",
                        "token": "5320a6abc8318cc5d1000049",
                        "company": "52fb7b90c8318c4dc800006b",
                        "document_type": "5252ce4ce4cfcd16f55cfa3f",
                        "actions": {
                            "show": "https://mail.google.com/mail/b/anyfetch@gmail.com/?cm#all/1442f93143ab3bb6"
                        },
                        "document_url": "/documents/5320a76fbc2e51d7135f0c8c",
                        "datas": {
                            "from": "Udacity <support@udacity.com>",
                            "to": "anyfetch@gmail.com",
                            "subject": "Verify Your <span class=\"hlt\">Email</span> on Udacity",
                            "snippet": "Hi Any,\r\n\r\nTo complete your sign <span class=\"hlt\">up</span>, please verify your <span class=\"hlt\">email</span> using the following link:\r\n\r\nhttps://www.udacity.com/account/verify_email?user_key=788038764&code=YbD5SsnEMa\r\n\r\nCheers,\r\n\r\nThe Udacity Team\r\n",
                            "date": "Friday, February 14, 2014"
                        },
                        "related": 0
                    }
                ]
            }


## Raw access [/documents/{id}/raw]
Retrieve all raw datas for `id` documents.
Also include information about hydraters (`hydratedBy`, `hydrating` and `lastHydration`).

### Get raw document [GET]
+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Response 200 (application/json)
    + Body

            {
                "_type": "Document",
                "id": "532347451eab8a0e22c2e65f",
                "creation_date": "2014-03-14T17:26:15.000Z",
                "token": "53234698c8318cc5d100004f",
                "company": "52fb7b90c8318c4dc800006b",
                "document_type": "5252ce4ce4cfcd16f55cfa41",
                "actions": {
                    "show": "http://anyfetch-provider-evernote.herokuapp.com/shard/s1/sh/6dbd89d6-1d80-4292-97fb-a0511cee5973/c5a8ad2ccc6b21ef43bb80fccc2d3544"
                },
                "document_url": "/documents/532347451eab8a0e22c2e65f",
                "identifier": "http://anyfetch-provider-evernote.herokuapp.com/shard/s1/sh/6dbd89d6-1d80-4292-97fb-a0511cee5973/c5a8ad2ccc6b21ef43bb80fccc2d3544",
                "datas": {},
                "metadatas": {
                    "status": "TODO",
                    "description": "Ask him to send an Email to Nick and schedule a meeting with Alex.",
                    "subject": "Follow up Charly Kevers"
                },
                "last_hydration": "2014-03-14T18:15:37.600Z",
                "hydrating": [],
                "hydrated_by": [],
                "related": []
            }


## Associated file [/documents/{id}/file]
Work with the document's file.

### Get document file [GET]
Retrieve the file associated with a document.

> Unlike all other endpoints, this one can't be accessed using `/document/identifier/{identifier}/file`.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Response 200 (*/*)
    + Body

            {binary file content}


### Add a file to a document [POST]
This endpoint should be used when providing, to add a file to a document.
All hydrations will be restarted.

> If you plan to use this endpoint, you should call `/documents` before with the `no_hydration` parameter.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Request

            file={binary file content as multipart form upload}
+ Response 204















# Group Users
User resources.

## User [/user/{id}]
A single User object with all its details. This resource has the following attributes :

- `id` The id of the user
- `name` The name of the user
- `email` The email address of the user
- `is_admin` Is true if the user is admin of this organisations

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the User to perform action with.


### Retrieve a User [GET]
+ Response 200 (application/json)


### Remove a User [DELETE]
+ Response 204


## User redirection [/user]
### Redirect to current user [GET]
Redirect the user to its own user endpoint.

+ Response 301
    + Header

            Location: /users/5252cebb03a470843f000003

## Users Collection [/users]
### List all Users [GET]
Retrieve a list of all users in the current company.

+ Response 200 (application/json)


























# Group Providers
Endpoints for providing new documents in Fetch API, and update them.

## Document [/providers/documents]
Document is Fetch API main resource, it handles all the data. It is the normalized way to store informations and files.
Document has several attributes:

- `document_type` identification key of the document_type. If not specified, will be set to `Document`
- `actions` object containing the available actions for the Document document, with key as action value as URL
- `related` array of `ìd` or `identifier` of documents related to this document
- `metadatas` object containing all searchable information (full-text or metadatas)
- `datas` object containing addtional informations, not available for search
- `user_access` array of users_id with access to the document. Set to null to give access to all users in the company.

> **Note:** Fetch API automatically sets the `id` Attribute during document creation.


### Create a document [POST]
Add a document to the FetchAPI and return the created document.

> **Note:** `no_hydration` optional boolean. When true, asks the API to wait before starting hydration (useful when you want to send a file immediately after).

+ Request (application/json)

        {
            "identifier": "http://unique-document-identifier",
            "document_type": "file",
            "actions": {
                "download": "http://example.org/download/file/url"
            },
            "datas": {
                "bar": "this will not be indexed for search"
            },
            "metadatas": {
                "foo": "this will be indexed for search"
            },
            "related": ["52dff5c53923844f15885428"],
            "user_access": ["52d96492a7f0a3ac4226f2f7"]
        }

+ Response 200 (application/json)


### Update a document [PATCH]
Update a document already existing on the Fetch API. The `id` of the document (or it's `identifier`) should be specified.

> **Note:** for ease of use, you can use POST and PATCH on this endpoint. This allows provider to abstract whether the document already exists or not.

+ Response 200 (application/json)


### Delete a document[DELETE]
Delete the specified document. To specify the selected document, an `id` or an `identifier` should be specified.

+ Response 204



## File [/providers/documents/file]
Attach a file to a document. The request should specify the document `identifier`.
You can't use this endpoint without pinging `/providers/documents/` first.
> **Note:** When you want to use this endpoint, don't forget to use `no_hydration: true` !


### Add a file to a document [POST]
Add a file in purpose to hydrate it. The request should specify the `identifier` of the attached created document.

+ Response 204





















# Group Hydraters
Hydrations endpoints, adding and improving original content of documents.
Those endpoints are only available when the hydrater sending the request has been previously called on the document.
You can't access them with an OAuth token, or using Basic Auth.

## Document [/hydraters/documents/{id}]
### Update document metadatas [POST]
Update document metadatas, datas and actions.
For datas and metadatas, merging occurs on first level only. If the existing datas is `{a:1, b:{c:2}, d:3}` and you submit `{a:2, b:{e:4}}`, the resulting document will be `{a:2, b:{e:4}, d:3}`. To remove a key, simply set its value to `null`.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.

+ Response 204

## File [/hydraters/documents/{id}/file]
### Get associated document [GET]
Get the file associated with the document for hydration purposes.

> **Note:** the file will be removed from Fetch API servers after hydration has completed.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.

+ Response 200
