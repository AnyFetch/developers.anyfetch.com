FORMAT: 1A
HOST: http://www.api.anyfetch.com

# Fetch API Documentation

**Fetch API** is designed to help you search in  massive amounts of documents coming from various sources, in various formats. See [authentication](/authentication.html) for authentication details.

# Group API
## GET /status
Get the current status of the Fetch API.

+ Response 200 (application/json)


# Group Account
## GET /
Retrieve datas about the current account. This endpoint return the following attributes:

- `server_time`: UNIX timesptamp of the server
- `user_url` currently connected user endpoint url: use to retrieve informations about the user
- `documents_url` documents endpoint url: use to search for documents
- `ìd` currently connected user's company id
- `name` name or email of the connected user
- `provider_status` status of each connected providers
- `documents_types` available document_types for the connected account

+ Response 200 (application/json)


##  POST /update
Ping all providers of the current user to check for new available documents.

+ Response 204

## DELETE /reset
Reset all documents and providers from the account.

> **Note:** Use with caution! Reset everything.

+ Response 204



















# Group Documents
Endpoints for retrieving documents

## Documents list [/documents/{?start, ?limit, ?search, ?_meta, ?@meta, ?has_meta, ?related_to, ?document_type, ?token, ?snippet_size, ?after, ?before}]
Retrieve a list of documents

### Search documents [GET]
+ Response 200
+ Parameters
    + start (optional, integer) ... Index of the first item to retrieve (for pagination)
    + limit (optional, integer) ... Max number of items to retrieve (for pagination)
    + before (optional, date) ... Only display documents created before this date. Use document creation date, and not anyFetch importation date. Format as valid JS date, for instance `2011-10-25`.
    + after (optional, date) ... Only display documents created after this date. Use document creation date, and not anyFetch importation date. Format as valid JS date, for instance `2011-10-25`.
    + search (optional, string) ... Search query, probably the most important parameter for this query
    + _meta (optional, string) ... Strict search on `meta` key
    + @meta (optional, string) ... Full text search on `meta` key
    + has_meta (optional, string) ... Only returns document having the `meta` key
    + related_to (optional, string) ... Find documents related to the specified document
    + document_type (optional, array) ... Only retrieve documents matching this document type. You can use the param multiple times to allow for multiples `document_type`
    + token (optional, array) ... Only retrieve documents matching this token. You can use the param multiple times to allow for multiples `token`
    + snippet_size (optional, integer) ... Number of words in the snippet



## Document [/documents/{id}{?search}]
Datas regarding a document.

### Get Document [GET]
A single document with its details

+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
    + search (optional, string, `cascade`) ... String to highlight in the rendered document
+ Response 200 (application/json)


### Get similar [/documents/{id}/similar]
Documents similar to `id`.

### Get similar documents [GET]
+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Response 200 (application/json)


### Get raw [/documents/{id}/raw]
Retrieve all raw datas for `id` documents.
Also include information about hydraters (`hydratedBy`, `hydrating` and `lastHydration`).

### Get raw document [GET]
+ Parameters
    + id (required, hexadecimal hash, `52dff5c53923844f15885428`) ... Hexadecimal `id` of the Document to perform action with.
+ Response 200 (application/json)























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
