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
## Users Collection [/notes]
### List all Users [GET]
Retrieve a list of all users in the current company.

+ Response 200 (application/json)

            [
                {
                    "_type": "User",
                    "id": "5252cebb03a470843f000003",
                    "email": "matthieu@papiel.fr",
                    "name": "",
                    "is_admin": true,
                    "user_url": "/users/5252cebb03a470843f000003"
                },
                ...
            ]

## User [/user/{id}]
A single User object with all its details

+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the User to perform action with.

### Retrieve a User [GET]
+ Response 200 (application/json)

            {
                "_type": "User",
                "id": "5252cebb03a470843f000003",
                "email": "matthieu@papiel.fr",
                "name": "",
                "is_admin": true,
                "user_url": "/users/5252cebb03a470843f000003"
            }

### Remove a User [DELETE]
+ Response 204

# Group Providers
## Provider [/providers/documents]
### Create a document [POST]
Add a document in the FetchAPI et returns the created document

+ Parameters
    + no_hydration (boolean) ...Wait a file to begin hydration (/providers/documents/file).

+ Response 200 (application/json)
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
                "datas": {},
                "metadatas": {
                    "hello": [
                        "world"
                    ],
                    "document_type": "file",
                    "foo": "bar"
                },
                "user_access": []
            }

### Add a file to a document [POST]
Add a file in purpose to hydrate it. The request should specify the identifier of the attached created document.



### Update a document [PATCH]
Update a document already present on the Fetch API. The id of the document should be specified to update a specific document.

+ Response 200 (application/json)
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
                "datas": {},
                "metadatas": {
                    "hello": [
                        "world"
                    ],
                    "document_type": "file",
                    "foo": "bar"
                },
                "user_access": []
            }

### Delete a document[DELETE]
Delete the specified document. To specify the selected document, a id or an identifier should be specified

+ Response 204