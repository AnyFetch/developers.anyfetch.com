FORMAT: 1A
HOST: http://www.api.anyfetch.com

# Fetch API
**Fetch API** is designed to help you search in  massive amounts of documents coming from various sources, in various formats.

# Group Index
## GET /
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

## GET /status
Get the current status of the Fetch API.

+ Response 200 (application/json)
    + Body

            {
                "status": "ok",
                "message": ""
            }

## POST /update
Ping all providers of the current user to check if new available documents

+ Response 204


## DELETE /reset
Reset all documents and providers from the account.
> **Note:** Use with caution

+ Response 204


# Group Documents
Endpoints for retrieving documents

## Documents [/documents/{id}{?search}]
A single document with its details

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
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

## Documents [/documents/{id}/similar]

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.

### Retrieve similar documents [GET]
Documents similar to `id`.

+ Response 200 (application/json)
    + Body

        {
            "keywords": [
                "anyFetch",
                "papiel"
            ],
            "document_types": {
                "5252ce4ce4cfcd16f55cfa3c": 4,
                "5252ce4ce4cfcd16f55cfa3d": 3
            },
            "tokens": {
                "52bffb81c8318c29e900000a": 7
            },
            "datas": [
                {
                    "_type": "Document",
                    "id": "52bffb8b99b3a70340000008",
                    "creation_date": "2013-12-29T10:38:03.101Z",
                    "token": "52bffb81c8318c29e900000a",
                    "company": "52bff074c8318c29e9000001",
                    "document_type": "5252ce4ce4cfcd16f55cfa3c",
                    "actions": {
                        "show": "https://www.dropbox.com/home%2FGUIDESTYLE.md"
                    },
                    "document_url": "/documents/52bffb8b99b3a70340000008",
                    "related": [],
                    "datas": {
                        "title": "GUIDESTYLE",
                        "path": "/GUIDESTYLE.md",
                        "snippet": "Do something complicated. Comments starts with a space."
                    }
                }
            ]
        }

## Documents [/documents/{id}/raw]
+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.

### Retrieve raw document data [GET]
Retrieve all raw datas for the `id`.
Also include information about hydraters.

+ Response 200 (application/json)
    + Body

        {
            "_type": "Document",
            "id": "52bffb8799b3a70340000003",
            "creation_date": "2013-12-29T10:37:59.197Z",
            "token": "52bffb81c8318c29e900000a",
            "company": "52bff074c8318c29e9000001",
            "document_type": "5252ce4ce4cfcd16f55cfa3d",
            "actions": {
                "show": "https://www.dropbox.com/home%2FPost_it_techcrunch.jpg"
            },
            "document_url": "/documents/52bffb8799b3a70340000003",
            "related": [],
            "identifier": "https://dropbox.com/228115297/post_it_techcrunch.jpg",
            "datas": {
                "display": "data:image/jpeg;base64,/9j/4AAQSkZJRr//2Q==",
                "thumb": "data:image/png;base64,iVBORw0KSuQmCC"
            },
            "metadatas": {
                "path": "/Post_it_techcrunch.jpg",
                "title": "Post it techcrunch",
                "software": "JLS36G",
                "model": "GT-I9100",
                "creation-date": "2013-10-09T10:45:57",
                "last-save-date": "2013-10-09T10:45:56",
                "f-number": "F2.6",
                "last-modified": "2013-10-09T10:45:56",
                "modified": "2013-10-09T10:45:56",
                "content-type": "image/jpeg",
                "make": "Samsung",
                "content-length": "2163026",
                "date": "2013-10-09T10:45:56",
                "flash": "Flash did not fire, auto",
                "orientation": "Top, left side (Horizontal / normal)",
                "gps-altitude-ref": "Below sea level",
                "metering-mode": "Center weighted average",
                "meta-save-date": "2013-10-09T10:45:56",
                "exif-version": "2.20",
                "exposure-mode": "Auto exposure",
                "tiff-imagelength": "240",
                "exif-flash": "false",
                "iso-speed-ratings": "80",
                "x-resolution": "72 dots per inch",
                "user-comment": "User comments",
                "shutter-speed-value": "1/16 sec",
                "tiff-imagewidth": "320",
                "image-width": "2448 pixels",
                "gps-longitude": "4.0° 52.0' 34.750000000003354&quot;",
                "gps-longitude-ref": "E",
                "exif-fnumber": "2.65",
                "gps-altitude": "0 metres",
                "color-space": "sRGB",
                "meta-creation-date": "2013-10-09T10:45:57",
                "resolution-units": "none",
                "data-precision": "8 bits",
                "tiff-bitspersample": "8",
                "gps-img-direction": "359 degrees",
                "ycbcr-positioning": "Center of pixel array",
                "compression-type": "Baseline",
                "exif-isospeedratings": "80",
                "gps-img-direction-ref": "Magnetic direction",
                "thumbnail-image-width": "320 pixels",
                "max-aperture-value": "F2.6",
                "brightness-value": "2.32",
                "thumbnail-offset": "960 bytes",
                "exif-image-height": "3264 pixels",
                "focal-length": "4.03 mm",
                "thumbnail-length": "26870 bytes",
                "thumbnail-compression": "JPEG (old-style)",
                "exposure-bias-value": "0 EV",
                "white-balance-mode": "Auto white balance",
                "tiff-orientation": "1",
                "tiff-make": "Samsung",
                "date-time-original": "2013:10:09 10:45:57",
                "thumbnail-image-height": "240 pixels",
                "exif-image-width": "2448 pixels",
                "scene-capture-type": "Standard",
                "dcterms-created": "2013-10-09T10:45:57",
                "exif-exposuretime": "0.058823529411764705",
                "component-1": "Y component: Quantization table 0, Sampling factors 2 horiz/1 vert",
                "gps-latitude": "45.0° 47.0' 24.419999999985293&quot;",
                "component-2": "Cb component: Quantization table 1, Sampling factors 1 horiz/1 vert",
                "component-3": "Cr component: Quantization table 1, Sampling factors 1 horiz/1 vert",
                "gps-latitude-ref": "N",
                "date-time-digitized": "2013:10:09 10:45:57",
                "resolution-unit": "Inch",
                "unknown-tag--0x0101-": "2448",
                "tiff-software": "JLS36G",
                "aperture-value": "F2.6",
                "number-of-components": "3",
                "tiff-model": "GT-I9100",
                "dcterms-modified": "2013-10-09T10:45:56",
                "image-height": "3264 pixels",
                "gps-date-stamp": "2013:10:09",
                "geo-lat": "45.790117",
                "exposure-time": "1/17 sec",
                "gps-time-stamp": "8:45:56 UTC",
                "exif-datetimeoriginal": "2013-10-09T10:45:57",
                "exif-focallength": "4.03",
                "date-time": "2013:10:09 10:45:56",
                "geo-long": "4.876319",
                "gps-processing-method": "110 101 116 119 111 114 107",
                "exposure-program": "Aperture priority",
                "gps-version-id": "2.200",
                "unknown-tag--0x0100-": "3264",
                "y-resolution": "72 dots per inch"
            },
            "hydrating": {
                "http---tesseracthydrater-anyfetch-com-hydrate": "2013-12-29T10:38:40.358Z"
            },
            "hydrated_by": [
                "http://tikahydrater.anyfetch.com/hydrate",
                "http://imagehydrater.anyfetch.com/hydrate"
            ]
        }

## Documents List [/documents/{?start, ?limit, ?search, ?_meta, ?@meta, ?has_meta, ?related_to, ?document_type, ?snippet_size}]
Retrieve a list of documents

+ Parameters
    + start (optional, integer) ... Index of the first item to retrieve (for pagination)
    + limit (optional, integer) ... Max number of items to retrieve (for pagination)
    + search (optional, string) ... Search query, probably the most important parameter for this query
    + _meta (optional, string) ... Strict search on `meta` key
    + @meta (optional, string) ... Full text search on `meta` key
    + has_meta (optional, string) ... Only returns document having the `meta` key
    + related_to (optional, string) ... Find documents related to the specified document
    + document_type (optional, array) ... Only retrieve documents matching this document type. You can use the param multiple times to allow for multiples `document_type`
    + snippet_size (optionnal, integer) ... Number of words in the snippet


### Retrieve a list of documents[GET]
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
Documents are the core of the Fetch API, they're the resource handling all data. It is the way to store all informations and files.
Documents have several attributes:

- `document_type` identification key of the document_type. If not specified, will be set to `Document`
- `actions` object containing the available actions for this document, with the key as action and the value an URL
- `related` array of `ìd` or `identifier` of documents related to this document
- `metadatas` object containing all the informations available to find the document via full-text or matching
- `datas` object containing addtional informations
- `user_access` array of users_id that can access this document. Set to null to give access to all users in the company.

> **Note:** Attributes `id` is automaticely set by the Fetch API at the creation of the document. You can't pick it manually.

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
Add a document in the Fetch API et returns the created document.

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
Update a document already present on the Fetch API. The `id` of the document (or its `identifier`) should be specified.

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
