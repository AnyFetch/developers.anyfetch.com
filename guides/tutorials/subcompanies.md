---
title: anyFetch example use for subcompanies
subtitle: Compartmentalize documents.
layout: doc
---

In this guide, we'll create multiple compartments (aka *subcompanies*) for our data,  using one master token.

The example use case will be Dropbox-like storage: each customer requires a separate index to store documents, and you want to provide search in those documents.

## What do I need?
To follow this guide, you need:

* An account on anyFetch, with login and password.
* `curl` binary

> We use `curl` for simplicity purpose. Of course, in a real use case, you'll need to use whatever utility your language provide (`http` for node, `curl` for php, `requests` for Python, `Net::HTTP` for Ruby)

## Setting up
Retrieve your token as described on the ["Hello world" tutorial](/guides/tutorials/hello-world.html): `GET /token`.

Keep it somewhere safe, as it will be your master token (you'll be able to delete subcompanies with it).

## Use case
### View existing subcompanies
Before we get started, let's view all our subcompanies:

```sh
curl -XGET \
-H "Authorization: Bearer ${MASTER_TOKEN}" \
https://api.anyfetch.com/subcompanies
```

As expected, we don't have any for now:

```json
[]
```

This list is common to all admins in your company.

### Creating a new subcompany
> Event: you have a new customer.
 
Using our master token, we'll create a subcompany. This subcompany will only be able to view its own documents list, and to share documents with people in the same subcompany. to create a subcompany, you need to specify a user currently in your company: he'll leave the parent company and becomes the first admin for the new company.

Therefore, before we create our subcompany, we'll need to create a new user:

```sh
$ curl -XPOST \
-H "Authorization: Bearer ${MASTER_TOKEN}" \
-H "Content-Type:application/json" \
https://api.anyfetch.com/users \
-d '{"email": "newuser@subcompany.fr", "name": "New User", "password": "password"}'
```

```json
{
    "_type":"User",
    "id":"534ea1ca50d473ce08985cb1",
    "email":"newuser@subcompany.fr",
    "name":"New User",
    "is_admin":false,
    "user_url":"/users/534ea1ca50d473ce08985cb1"
}
```

We can now create the subcompany (only admin can do this), specifying the new user should be the admin:
```sh
curl -XPOST \
-H "Authorization: Basic ${BASE64}" \
-H "Content-Type:application/json" \
https://api.anyfetch.com/subcompanies \
-d '{"name": "Subcompany", "user": "534ea1ca50d473ce08985cb1"}'
```

```json
{
    "_type":"Company",
    "id":"534ea2bd1d6202ba087383ed",
    "name":"Subcompany",
    "hydraters":[
        "https://plaintext.anyfetch.com/hydrate",
        "https://pdf.anyfetch.com/hydrate",
        "https://office.anyfetch.com/hydrate",
        "https://image.anyfetch.com/hydrate",
        "https://ocr.anyfetch.com/hydrate",
        "https://eml.anyfetch.com/hydrate"
    ]
}
```

> Note: subcompany name must be unique across all companies.

You may customize the hydraters list according to your needs. When unspecified, a default list working for standard use-cases will be used.

A renewed request for `GET /subcompanies` with our master token will now yield this subcompany. Note however the same request made with `newuser@subcompany.fr` will still be `[]`, since this user was migrated to the new subcompany which has no subcompanies by itself.

You can now send documents as usual with the second user.

### Deleting subcompany
> Event: you want to remove a customer

You just need to send a query with your master token to delete the subcompany:

```sh
curl -XDELETE \
-H "Authorization: Bearer ${MASTER_TOKEN}" \
https://api.anyfetch.com/subcompanies/534ea2bd1d6202ba087383ed
```

And *voilà*, everything has been removed (users, documents, providers...).
