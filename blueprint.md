FORMAT: 1A
HOST: http://www.api.anyfetch.com

# Fetch API
**Fetch API** is designed to help you search in  massive amounts of documents coming from various sources, in various formats.

## Authentication
There are three ways to authenticate through Fetch API.
See [authentication](/authentication.html) for details and error codes.

## Client Error
If request is not wellformed, this will result `400 Bad Request` responce.

```http
HTTP/1.1 400 Bad Request
Content-Length: 35

{"message":"Problems parsing JSON"}
```

## Rate Limiting
Fetch API doesn't currently provide a rate limit system.


# GET /
Retrieve datas about the current account. This endpoint return the following attributes:

- `server_time`: UNIX timesptamp of the server
- `user_url` currently connected user endpoint url: use to retrieve informations about the user
- `documents_url` documents endpoint url: use to search for documents
- `ìd` currently connected user's company id
- `name` name or email of the connected user
- `provider_status` status of each connected providers
- `documents_types`available document_types for the connected account

+ Response 200 (application/json)
    + Body

            {
                "user_url": "/user",
                "documents_url": "/documents",
                "server_time": "2014-01-10T10:47:22.413Z",
                "_type": "Company",
                "id": "52cbdaddc8318c4dc8000001",
                "name": "test@papiel.fr",
                "provider_status": {},
                "document_types": {}
            }

# GET /status
Get the current status of the Fetch API.

+ Response 200 (application/json)
    + Body

            {
                "status": "ok",
                "message": ""
            }

# POST /update
Ping all providers of the current user to check if new available documents

+ Response 204


# DELETE /reset
Reset all documents and providers from the account.
> **Note:** Use with caution

+ Response 204


# Group Documents
Endpoints for retrieving documents

## Documents [/documents/{id}{?search}]
A single document with his details

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the User to perform action with.
    + search (optional, string, `cascade`) ... String to highlight in the rendered document

### Retrieve a single document [GET]
+ Response 200 (application/json)
    + Body

            {
                "_type": "Document"
                "actions": {
                    "download": "http://example.org/download/file/url"
                },
                "company": "52bff074c8318c29e9000001"
                "creation_date": "2013-12-29T10:40:14.246Z"
                "document_url": "/documents/52d96492a7f0a3ac4226f2f7",
                "related": ["52d96492a7f0a3ac424e91"],
                "datas": {
                    "bar": "this will not be indexed for search"
                },
                "metadatas": {
                    "foo": "this will be indexed for search"
                },
            }

## Documents List [/documents/{?start, ?limit, ?search, ?_meta, ?@meta, ?has_meta, ?related_to, ?binary_document_type, ?semantic_document_type}]
Retrieve a list of documents

+ Parameters
    + start (optional, integer) ... Index of the first item to retrieve (for pagination)
    + limit (optional, integer) ... Max number of items to retrieve (for pagination)
    + search (optional, string) ... Search query, probably the most important parameter for this query
    + _meta (optional, string) ... Strict search on `meta` key
    + @meta (optional, string) ... Full text search on `meta` key
    + has_meta (optional, string) ... Only returns document having the `meta` key
    + related_to (optional, string) ... Find documents related to the specified document
    + binary_document_type (optional, array) ... Only retrieve documents matching this binary document types. You can use the param multiple times to allow for multiples `binary_document_type`
    + semantic_document_type (optional, array) ... Only retrieve documents matching this semantic document types. You can use the param multiple times to allow for multiples `semantic_document_type`


### Retrive a list of documents[GET]
+ Response 204



# Group Users
User ressources.

## User [/user/{id}]
A single User object with all its details. This resource has the following attributes :

- `id` The id of the user
- `name` The name of the user
- `email` The email address of the user
- `is_admin` Is true if the user is admin of this organisations

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the User to perform action with.

+ Model (application/json)

    + Body

            {
                "_type": "User",
                "id": "5252cebb03a470843f000003",
                "email": "matthieu@papiel.fr",
                "name": "",
                "is_admin": true,
                "user_url": "/users/5252cebb03a470843f000003"
            }

### Retrieve a User [GET]
+ Response 200 (application/json)
    [User][]

### Remove a User [DELETE]
+ Response 204

## User redirection endpoint [/user]
### Redirect to current user [GET]
Redirect the user to its own user endpoint.

+ Response 301
    + Header

            Location: /users/5252cebb03a470843f000003

## Users Collection [/users]
### List all Users [GET]
Retrieve a list of all users in the current company.

+ Response 200 (application/json)

            [
                {
                    "_type": "User",
                    "id": "5252cebb03a470843f000003",
                    "email": "test@papiel.fr",
                    "name": "Test",
                    "is_admin": true,
                    "user_url": "/users/5252cebb03a470843f000003"
                },
                ...
            ]


# Group Providers
Endpoints for providing new documents in Fetch API, and update them.

## Document [/providers/documents]
Document is the center of the Fetch API, it the ressource that handles all the data. It the normalize way to store all informations and files.
Document has several attributes:

- `document_type` identification key of the document_type. If not specified, will be set to `Document`
- `actions` object containing the available actions for this document, with the key as action and the value an URL
- `related` array of `ìd` or `identifier` of documents related to this document
- `metadatas` object containing all the informations available to find the document via full-text or matching
- `datas` object containing addtional informations
- `user_access` array of users_id that can access this document. Set to null to give access to all users in the company.

> **Note:** Attributes `id`is automaticely set by the Fetch API at the creation of the document. You can't chose it.

+ Model (application/json)
    + Body

            {
                "_type": "Document",
                "id": "52d96492a7f0a3ac4226f2f7",
                "creation_date": "2014-01-17T17:12:50.664Z",
                "company": "52bff074c8318c29e9000001",
                "document_type": "5252ce4ce4cfcd16f55cfa3b",
                "actions": {
                    "download": "http://example.org/download/file/url"
                },
                "document_url": "/documents/52d96492a7f0a3ac4226f2f7",
                "related": ["52d96492a7f0a3ac424e91"],
                "datas": {
                    "bar": "this will not be indexed for search"
                },
                "metadatas": {
                    "foo": "this will be indexed for search"
                },
                "user_access": ["52d96492a7f0a3ac4226f2f7"]
            }


### Create a document [POST]
Add a document in the FetchAPI et returns the created document.

> **Note:** `no_hydration` optional boolean. When true, asks the API to wait before starting hydration (useful when you want to send a file immediately after)

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
    [Document][]


### Update a document [PATCH]
Update a document already present on the Fetch API. The `id` of the document (or it's `identifier`) should be specified.

> **Note:** for ease of use, you can use POST and PATCH on this endpoint. This allows provider to abstract whether the document already exists or not.

+ Response 200 (application/json)
    [Document][]

### Delete a document[DELETE]
Delete the specified document. To specify the selected document, an `id` or an `identifier` should be specified

+ Response 204



## File [/providers/documents/file]
Attach a file to a document. The request should specify the `identifier` of the document.

> **Note:** When you want to use this endpoint, don't forget to use `no_hydration: true` on `/providers/documents/`!

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
