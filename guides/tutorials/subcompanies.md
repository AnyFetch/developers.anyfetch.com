---
title: Fetch API example use for subcompanies
subtitle: Compartmentalize documents.
layout: doc
---

In this guide, we'll create multiple compartments (*subcompanies*) for our data,  using one master token.

The example use case will be Dropbox-like storage: each customer requires a separate index to store documents, and you want to provide search in those documents.

## What do I need?
To follow this guide, you need:

* An account on anyFetch, with login and password.
* `curl` binary

We use `curl` for simplicity purpose. Of course, in a real use case, you'll need to use whatever utility your language provide (`http` for node, `curl` for php, `requests` for Python, `Net::HTTP` for Ruby)

## Setting up
Retrieve your token as described on the ["Hello world" tutorial](/guides/hello-world.html): `GET /token`.

Keep it somewhere safe, as it will be your master token (you'll be able to delete subcompanies with it).

## Use case
### View existing subcompanies
Before we get started, let's view all our subcompanies:

```
curl -XGET \
-H "Authorization: token ${MASTER_TOKEN}" \
https://api.anyfetch.com/subcompanies
```

As expected, we don't have any for now:

```json
[]
```

This list is common to all admins in your company.

### Creating a new subcompany
> Event: you have a new customer.
 
Using our master token, we'll create a subcompany. This subcompany will only be able to view its own documents list, and to share documents with people in the same subcompany.

There are two tricks however:

* creating a subcompany migrate the currently connected user to the new subcompany;
* only admins can create subcompanies.

Therefore, before we create our subcompany, we'll need to create a new admin:

```sh
$ curl -XPOST \
-H "Authorization: token ${MASTER_TOKEN}" \
-H "Content-Type:application/json" \
https://api.anyfetch.com/users \
-d '{"email": "newuser@subcompany.fr", "name": "New User", "password": "password", "is_admin": true}'
```

```json
{
    "_type":"User",
    "id":"534ea1ca50d473ce08985cb1",
    "email":"newuser@subcompany.fr",
    "name":"New User",
    "is_admin":true,
    "user_url":"/users/534ea1ca50d473ce08985cb1"
}
```

We can now connect as our new user (for instance by base64-encoding `newuser@subcompany.fr:password` into `bmV3dXNlckBzdWJjb21wYW55LmZyOnBhc3N3b3Jk`) and send the query to create the subcompany:

```sh
curl -XPOST \
-H "Authorization: Basic ${BASE64}" \
-H "Content-Type:application/json" \
https://api.anyfetch.com/subcompanies \
-d '{"name": "Subcompany"}'
```

```json
{
    "_type":"Company",
    "id":"534ea2bd1d6202ba087383ed",
    "name":"Subcompany",
    "hydraters":[
        "http://plaintext.hydrater.anyfetch.com/hydrate",
        "http://pdf.hydrater.anyfetch.com/hydrate",
        "http://office.hydrater.anyfetch.com/hydrate",
        "http://image.hydrater.anyfetch.com/hydrate",
        "http://ocr.hydrater.anyfetch.com/hydrate",
        "http://eml.hydrater.anyfetch.com/hydrate"
    ]
}
```

> Note: subcompany name must be unique across all companies.

You may customize the hydraters list according to your needs.

A renewed request for `GET /subcompanies` with our master token will now yield this subcompany. Note however the same request made with `newuser@subcompany.fr` will still be `[]`, since this user was migrated to the new subcompany which has no subcompanies by itself.

You can now send documents as usual with the second user.

### Deleting subcompany
> Event: you want to remove a customer

You just need to send with your master token a query to delete the subcompany:

```sh
curl -XDELETE \
-H "Authorization: token ${MASTER_TOKEN}" \
https://api.anyfetch.com/subcompanies/534ea2bd1d6202ba087383ed
```

And *voilà*, everything has been removed.
