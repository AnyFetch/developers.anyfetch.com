FORMAT: 1A
HOST: http://www.api.anyfetch.com

# Fetch API
**Fetch API** is designed to help you search in  massive amounts of documents coming from various sources, in various formats.

## Authentication
There are three ways to authenticate through Fetch API.
Requests that require authentication will return `404 Not Found`, instead of `403 Forbidden`, in some places.

### Basic authentication
```bash
    $ curl -H "Authorization: Basic HASH" http://api.anyfetch.com
```

### Oauth authentication
```bash
    $ curl -H "Authorization: token OAUTH-TOKEN" http://api.anyfetch.com
```

### Request parameter
```bash
    $ curl https://api.anyfetch.com/?access_token=OAUTH-TOKEN
```

##Client Error
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

#GET /status
Get the current status of the Fetch API

+ Response 200 (application/json)
    + Body

            {
                "status": "ok",
                "message": ""
            }




# Group Users
User ressources.

## User [/user/{id}]
A single User object with all its details. This resource has the following attributes :

- `id` The id of the user
- `name` The name of the user
- `email` The email address of the user
- `is_admin` Is true if the user is admin of his organisations

+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the User to perform action with.

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
Endpoint usable for providing new document in Fetch API, and udapte them.

## Document [/providers/documents]
Document is the center of the Fetch API, it the ressource that handles all the data. It the normalize way to store all informations and files.
Document has several attributes:

- `ìd` is an hexadecimal hash used to uniquely identify the document across all fetch API documents.
- `identifier` is a unique identifier for the provider (it can be used multiple times by multiples providers / multiples tokens), used to ease the life of the provider coder and allo the provider to reuse an existing identifier from another application into fetch API.
- `creation_date` the creation date fo the document. If not specified at the creation the API give the current type
- `comapny` id of the company belonging the document
- `document_type` id of the document_type. If not specified at the creation the API automaticly give the document_type `Document`
- `actions` object containing the available action for this document
- `document_url` url of the document
- `related` array of ìd or identifier of document related to this document
- `data` object containing all the informations available to find the document via full-text or matching
- `metadatas` object containing addtional informations
- `user_access` array of users` id that can access this document

**Note:** Attributes `id`is automaticely set by the Fetch API at the creation of the document. You can't chose it.

+ Model (application/json)
    + Body

            {
                "_type": "Document",
                "id": "52d96492a7f0a3ac4226f2f7",
                "creation_date": "2014-01-17T17:12:50.664Z",
                "company": "52bff074c8318c29e9000001",
                "document_type": "5252ce4ce4cfcd16f55cfa3b",
                "actions": {
                    "download": "http://dowload/file/url"
                },
                "document_url": "/documents/52d96492a7f0a3ac4226f2f7",
                "related": ["52d96492a7f0a3ac424e91"],
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

+ Request (application/json)

        {
            "identifier": "http://unique-documenet-identifier",
            "document_type": "file",
            "datas": {
                "bar": "foo"
            },
            "metadatas": {
                "foo": "bar"
            },
            "related": ["52dff5c53923844f15885428"],
            "user_access": ["52d96492a7f0a3ac4226f2f7"]
        }

+ Response 200 (application/json)
    [Document][]


### Update a document [PATCH]
Update a document already present on the Fetch API. The id of the document should be specified to update a specific document.

+ Response 200 (application/json)
    [Document][]

### Delete a document[DELETE]
+ Response 204



## File [/providers/documents/file]
File is attached to an existing document to be processed during the hydration processing.
Before sending a file to the API, you have to create first a specific document for him. It allows sending informations extract from the source before sending the file.

**Note:** To secure that the created document is not hydreated without his file, you have to specify `no_hydration: true` at the creation.

### Add a file to a document [POST]
Add a file in purpose to hydrate it. The request should specify the `identifier` of the attached created document.


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
