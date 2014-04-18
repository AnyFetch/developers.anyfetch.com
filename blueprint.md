FORMAT: 1A
HOST: http://api.anyfetch.com

# Fetch API Documentation

> This page is anyFetch reference. See [http://developers.anyfetch.com](this page) for informations regarding general usage.

**Fetch API** is designed to help you search in  massive amounts of documents coming from various sources, in various formats. See [authentication](/authentication.html) for authentication details.


# Group Index
## API status [/status]
### anyFetch status [GET]
Get the current status of the Fetch API.
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

+ Parameters
    +  pages (required, string, `/document_types`) ... url to retrieve (url-encoded). <small>Multiple pages parameters can be used to queue queries.</small>
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
                        "application": "53232d1dc8318cba94000042",
                        "name": "Evernote",
                        "updated": "2014-03-14T18:15:37.603Z",
                        "document_count": 2
                    },
                    "5320a682c8318cba94000040": {
                        "application": "52bff114c8318c29e9000005",
                        "name": "Dropbox",
                        "updated": "2014-03-21T16:48:16.486Z",
                        "document_count": 14
                    },
                    "5320a6abc8318cc5d1000049": {
                        "application": "53047faac8318c2d65000096",
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
- `_url` to different part of the API (HATEOAS design). Notice the `current_user_url` key.
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
Reset **all** documents, tokens and providers from the account.

+ Response 204



















# Group Subcompanies
## Subcompanies [/subcompanies]
Subcompanies are companies you own and have created.
They allow you to compartment datas: no datas stored in a company can be accessed from any other place.

### Retrieve all subcompanies [GET]
Retrieve all subcompanies from the current company.

Only available for admin users.


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
Create a new subcompany.

You may customize hydraters list, or use default list.

Only available for admin users.

> Be careful: the user will be migrated to the new company. To create a new subcompany, the best practice is to create a new admin (`POST /user`) before, then create the new company while connected with the new user.


+ Request

            {
                "name": "new-subcompany-name",
            }

+ Response 200

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
### Delete a subcompany [DELETE]
Delete the subcompany, **all** its documents and **all** its users.

+ Response 204

















# Group Documents
Endpoints for retrieving documents

## Documents [/documents{?search, ?before, ?after,?document_type, ?token, ?_meta, ?has_meta, ?snippet_size, ?start, ?limit, ?no_hydration}]
Access documents resources.

### Search documents [GET]
Search within all availables data for documents matching specified filter.

Return aggregated informations computed over the result set. The `score` key indicated document's relevance regarding query.

+ Parameters
    + search (optional, string, `john smith`) ... Search query, probably the most important parameter for this query
    + before (optional, date, `2014-03-21`) ... Only display documents created before this date.
    + after (optional, date, `2014-01-25`) ... Only display documents created after this date.
    + document_type (optional, array, `5252ce4ce4cfcd16f55cfa3f`) ... Only retrieve documents matching this document type. <small>You can use the param multiple times to allow for multiples `document_type`</small>.
    + token (optional, array, `5252ce4ce4cfcd16f55cfa3f`) ... Only retrieve documents matching this token. <small>You can use the param multiple times to allow for multiples `token`</small>
    + _meta (optional, string, `John Smith`) ... Strict search on `meta` key. Replace `meta` with the name of the meta you wish to search on.
    + @meta (optional, string, `John`) ... Full text search on `meta` key.  Replace `meta` with the name of the meta you wish to search on.
    + has_meta (optional, boolean, `1`) ... Only returns document having the `meta` key. Replace `meta` with the name of the meta you wish to search on.
    + snippet_size (optional, integer, `200`) ... Number of chars to include in the snippet
    + start (optional, integer, `5`) ... 0-based index of the first item to retrieve (for pagination).
    + limit (optional, integer, `20`) ... Max number of items to retrieve (for pagination)
+ Response 200 (application/json)
    + Body

            {
                facets: {
                    "document_types": {
                        "5252ce4ce4cfcd16f55cfa41": 1,
                        "5252ce4ce4cfcd16f55cfa3c": 1
                    },
                    "tokens": {
                        "53234698c8318cc5d100004f": 1,
                        "5320a682c8318cba94000040": 1
                    },
                    "creation_dates": {
                        "1393632000000": 2
                    },
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
Data regarding a document.

> Please note: for every endpoint in the form `/documents/{id}`, you can also use an alternative URL `/documents/identifier/{identifier}` where `identifier` is the url-encoded provider identifier.

### Get Document [GET]
A single document with its details.

Result contains, amongst other :

* `full` projection, in `datas`,
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
Documents similar to `id`. Still a work in progress.


Result contains, amongst other :

* `title` projection for the `id` document, in `title`.
* `snippet` projection for similar documents, in `datas`
* `keywords` used to find similar documents

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


## Related documents [/documents/{id}/related]
### Find related documents [GET]
Documents related to `id`.


Result contains, amongst other :

* `title` projection for the `id` document, in `title`.
* `snippet` projection for related documents, in `datas`

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
                    "tokens": {
                        "531dccedc8318cc5d1000037": 1
                    },
                    "creation_dates": {
                        "1380585600000": 1
                    }
                },
                "datas": [
                    {
                        "_type": "Document",
                        "id": "531dcd94731d5a284f707ac1",
                        "creation_date": "2013-10-01T14:48:41.000Z",
                        "token": "531dccedc8318cc5d1000037",
                        "company": "52f0e4f9c8318c4dc8000039",
                        "document_type": "5252ce4ce4cfcd16f55cfa3c",
                        "actions": {},
                        "document_url": "/documents/531dcd94731d5a284f707ac1",
                        "datas": {
                            "title": "4400000451947",
                            "path": "/4400000451947.pdf",
                            "snippet": "\nDT061 ind 13 Prestations réalisées sous assurance qualité ISO 9001"
                        },
                        "related": 1,
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

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Response 200 (*/*)
    + Body

            {binary file content}


### Add a file to a document [POST]
This endpoint should be used when providing, to add a file to a document.
All hydrations will be restarted.

> If you plan to use this endpoint, you should post to `/documents` before with the `no_hydration` parameter.

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Request

            file={binary file content as multipart form upload}
+ Response 204















# Group Users
User resources.

## Users Collection [/users]
### List all Users [GET]
Retrieve a list of all users in the current company.

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
Create a new user on this company.

> You need to be an administrator to create another user.


+ Request

            {
                "email": "newuser@company.com",
                "name": "New User",
                "password": "password"
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

## User [/user/{id}]
A single User object with all its details. This resource has the following attributes :

- `id` id of the user
- `name` name of the user
- `email` email address of the user
- `is_admin` true if the user is admin of this company

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the User to perform action with.

### Retrieve a User [GET]
Retrieve information about specified user.


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

### Remove a User [DELETE]
Remove specified user.

> You need to be an administrator to delete another user.

> You can't delete yourself.

+ Response 204














# Group Document Types
## Document types [/document_types]
### List document-types [GET]
Retrieve all document types available for the current user, with document count and the date the last document with this document type was updated.

The key will be reused on the `document_type` property for every `/documents/` endpoint.

+ Response 200 (application/json)
    + Body

            {
                "5252ce4ce4cfcd16f55cfa3c": {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3c",
                    "name": "document",
                    "template_snippet": "<article>\n  <h1>{{{ title }}}</h1>\n  <blockquote>\n  \t{{{ snippet }}}\n  </blockquote>\n</article>\n",
                    "template_full": "<article>\n  <section>\n    <h1>{{{ title }}}</h1>\n    <code>{{ path }}</code>\n  </section>\n\n  <section>\n    {{{ content }}}\n  </section>\n</article>\n",
                    "template_title": "{{ title }}",
                    "updated": null,
                    "documents": 6
                },
                "5252ce4ce4cfcd16f55cfa3d": {
                    "_type": "DocumentType",
                    "id": "5252ce4ce4cfcd16f55cfa3d",
                    "name": "image",
                    "template_snippet": "<article>\n  <h1>{{{ title }}}</h1>\n\n  <img src=\"{{ thumb }}\" />\n</article>\n",
                    "template_full": "<article>\n  <h1>{{{ title }}}</h1>\n\n  <img src=\"{{ display }}\" />\n</article>\n",
                    "template_title": "{{ title }}",
                    "updated": null,
                    "documents": 7
                }
            }













# Group Providers
## Providers [/providers]
### List providers [GET]
Retrieve all providers available for the current user, with document count and the date the last document created by this provider was updated.

The key will be reused on the `token` property for every `/documents/` endpoint.

+ Response 200 (application/json)
    + Body

            {
                "53234698c8318cc5d100004f": {
                    "application": "53232d1dc8318cba94000042",
                    "name": "Evernote",
                    "updated": "2014-03-14T18:15:37.603Z",
                    "document_count": 2
                },
                "5320a682c8318cba94000040": {
                    "application": "52bff114c8318c29e9000005",
                    "name": "Dropbox",
                    "updated": "2014-03-21T16:48:16.486Z",
                    "document_count": 14
                },
                "5320a6abc8318cc5d1000049": {
                    "application": "53047faac8318c2d65000096",
                    "name": "GMail",
                    "updated": "2014-03-20T19:15:11.048Z",
                    "document_count": 26
                }
            }
