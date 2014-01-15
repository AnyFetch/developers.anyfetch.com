# Documentation for Anyfetch API (*aka Cluestr*)

Please visit http://papiel.github.io/cluestr-doc/ to view the documentation.

This repo should not be used for browsing, but for updating the doc.

## TODO
* How to write a provider?          MAT
* How to write an hydrater?         MAT
* About the Core API
    - Contributing guidelines       MAT
    - Endpoints                     KIM / PMD
    - Authentication                ROB
* Create a new project              ROB

### Endpoints
#### KIM
GET /
GET /status
POST    /update
DELETE/reset
GET /users
GET /user
GET /user/:id
GET /documents
GET /documents/:id

#### PMD
POST    /providers/documents
PATCH   /providers/documents
DELETE/providers/documents
POST    /providers/documents/file
PATCH   /hydraters/documents/:id
GET /hydraters/documents/:id/file
