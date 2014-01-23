FORMAT: 1A
HOST: http://www.api.anyfetch.com

# Anyfetch
Anyfetch is designed to help you search in  massive amounts of documents coming from various sources, in various formats.

# Group Index
## Index [/]
### Retrieve Entry Point [GET]
Retrieve datas about the current account. This endpoint return the following attributes:

- `user_url` user endpoint url
- `documents_url` documents endpoint url
- `ìd` connected user indentification
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
Get the current status of the Fetch API

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
- `is_admin` Is true if the user is admin of his organisations

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
- `is_admin` Is true if the user is admin of his organisations

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

# Group Providers
Endpoint usable for providing new document in Fetch API, and udapte them.

## Document [/providers/documents]
Document has several attributes:

- `ìd` identification key given at the creation of the document by the API
- `creation_date` the creation date fo the document. If not specified at the creation the API give the current type
- `token`identification key of the provider how sent it. It allows to safely update the document
- `comapny`identification key of the company belonging the document
- `document_type`identification key of the document_type. If not specified at the creation the API automaticly give the document_type `Document`
- `actions` object containing the available action for this document
- `document_url` url of the document
- `related` array of `ìd` or `identifier` of document related to this document
- `data` object containing all the informations available to find the document via full-text or matching
- `metadatas` object containing addtional informations
- `user_access` array of users` id that can access this document

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
Add a document in the FetchAPI et returns the created document. `no_hydration` Is an optional boolean tells the API to wait a file to begin hydration (`/providers/documents/file`).

+ Response 200 (application/json)
    [Document][]


### Update a document [PATCH]
Update a document already present on the Fetch API. The id of the document should be specified to update a specific document.

+ Response 200 (application/json)
    [Document][]

### Delete a document[DELETE]
Delete the specified document. To specify the selected document, a id or an identifier should be specified

+ Response 204


## File [/providers/documents/file]
### Add a file to a document [POST]
Add a file in purpose to hydrate it. The request should specify the `identifier` of the attached created document.
To secure that the created document is not hydreated without his file, you have to specify `no_hydration: true` at the creation.

+ Response 204


# Group Hydraters
Endpoints usable for hydration, adding and improving original content of documents.  This endpoint is only applicable, if the hydrator sending the request has been previouly called.


## Document [/hydraters/documents/{id}]
### Update document metadatas [POST]
Update the document metadatas.
+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the Document to perform action with.

+ Response 204

## File [/hydraters/documents/{id}/file]
### Get associated document [GET]
Get the associuated document to help the hydration.

+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the Document to perform action with.

+ Response 200
