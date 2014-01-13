FORMAT: 1A
HOST: http://www.api.anyfetch.com

# Cluestr
Cluestr is designed to help you search in  massive amounts of documents coming from various sources, in various formats.

# Index page [/]
Retrieve datas about the current account
## Retrieve Entry Point [GET]

+ Response 200 (application/json)
    + Headers

            Access-Control-Allow-Credentials: true
            Access-Control-Allow-Headers: Accept, Accept-Version, Authorization, Content-Type, Api-Version, X-Requested-With
            Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
            Access-Control-Allow-Origin: *
            

    + Body

            {
                "users_url": "/users",
                "user_url": "/user",
                "documents_url": "/documents",
                "server_time": "2014-01-10T10:47:22.413Z",
                "_type": "Company",
                "id": "52cbdaddc8318c4dc8000001",
                "name": "test@papiel.fr,"
                "provider_status": {},
                "document_types": {}
            }

            
# Group Users
User related resources of the **Cluestr API**

## Users Collection [/notes]
### List all Users [GET]
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
