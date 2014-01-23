FORMAT: 1A
HOST: http://www.api.anyfetch.com

# Anyfetch
Anyfetch is designed to help you search in massive amounts of documents coming from various sources, in various formats.

# Group Index
## Index [/]
### Retrieve Entry Point [GET]
Retrieve datas about the current account. This endpoint return the following attributes:

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

## Status [/status]
### Status Entry Point [GET]
Get the current status of the Fetch API.

+ Response 200 (application/json)
    + Body

            {
                "status": "ok",
                "message": ""
            }

# Group Users
## Users Collection [/users]
### List all Users [GET]
Retrieve a list of all users in the current company. This resource has the following attributes :

- `id` The id of the user
- `name` The name of the user
- `email` The email address of the user
- `is_admin` Is true if the user is admin of this company

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

## User [/user/{id}]
A single User object with all its details. This resource has the following attributes :

- `id` The id of the user
- `name` The name of the user
- `email` The email address of the user
- `is_admin` Is true if the user is admin of this company

+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the User to perform action with.

+ Model

    HAL+JSON representation of the platform

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

+ Response 301 (application/json)
    + Header
        Location: /users/5252cebb03a470843f000003

# Group Providers
Endpoints for providing new documents in Fetch API, and update them.

## Document [/providers/documents]
Document has several attributes:

- `ìd` identification key given at the creation of the document by the API
- `creation_date` the creation date for the document. If not specified, will be set to the current date
- `document_type` identification key of the document_type. If not specified, will be set to `Document`
- `actions` object containing the available actions for this document, with the key as action and the value an URL
- `related` array of `ìd` or `identifier` of documents related to this document
- `metadatas` object containing all the informations available to find the document via full-text or matching
- `datas` object containing addtional informations
- `user_access` array of users_id that can access this document. Set to null to give access to all users in the company.

+ Model

    HAL+JSON representation of the platform

    + Body

            {
                "_type": "Document",
                "id": "52d96492a7f0a3ac4226f2f7",
                "creation_date": "2014-01-17T17:12:50.664Z",
                "token": "52bffb81c8318c29e900000a",
                "company": "52bff074c8318c29e9000001",
                "document_type": "5252ce4ce4cfcd16f55cfa3b",
                "actions": {},
                "document_url": "/documents/52d96492a7f0a3ac4226f2f7",
                "related": [],
                "datas": {
                    "bar": "foo"
                },
                "metadatas": {
                    "foo": "bar"
                },
                "user_access": ["52d96492a7f0a3ac4226f2f7"]
            }


### Create a document [POST]
Add a document to the FetchAPI and returns the created document.

- `no_hydration` optional boolean. When true, asks the API to wait before starting hydration (useful when you want to send a file immediately after)

+ Response 200 (application/json)
    [Document][]


### Update a document [PATCH]
Update a document already present on the Fetch API. The `id` of the document (or it's `identifier`) should be specified.

> Note: for ease of use, you can use POST and PATCH on this endpoint. This allows provider to abstract whether the document already exists or not.

+ Response 200 (application/json)
    [Document][]

### Delete a document[DELETE]
Delete the specified document. To specify the selected document, an `id` or an `identifier` should be specified

+ Response 204


## File [/providers/documents/file]
### Add a file to a document [POST]
Attach a file to a document. The request should specify the `identifier` of the document.

> When you want to use this endpoint, don't forget to use `no_hydration: true` on `/providers/documents/`!

+ Response 204


# Group Hydraters
Hydrations endpoints, adding and improving original content of documents.
Those endpoints are only available when the hydrater sending the request has been previously called on the document.

You can't access them with an OAuth token, or using Basic Auth.

## Document [/hydraters/documents/{id}]
### Update document metadatas [POST]
Update document metadatas, datas and actions.
+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the Document to perform action with.

+ Response 204

## File [/hydraters/documents/{id}/file]
### Get associated document [GET]
Get the file associated with the document for hydration purposes.

> Note: the file will be removed from Fetch API servers after hydration has completed.

+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the Document to perform action with.

+ Response 200
