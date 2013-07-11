---
title: Users API
layout: doc
---

## Accessing all users

Lists all the users in the company.

`GET /users`

### Input

- `is_staff` _optional_ **boolean** Display users matching the staff status
- `last_login_gt` _optional_ **date** Last connection **after** the specified date
- `last_login_lt` _optional_ **date** Last connection **before** the specified date
- `date_joined_gt` _optional_ **date** Creation of the user account **after** the specified date
- `date_joined_lt` _optional_ **date** Creation of the user account **before** the specified date

Format:

	$ curl -u "username:password" -i https://api.papiel.fr/users
	HTTP/1.1 200 OK
	X-Poll-Interval: 60

	[
		{
			"type": "User",
			"uuid": "dqsvj667bkqvljdfv23678",
			"self_url": "/users/1/"
			"email": foo@bar.fr,
			"firstName": "Foo"
			"lastName": "Bar",
			"isStaff": true;
			"lastLogin": "2008-01-14T04:33:35Z",
			"user_url": "https://api.papiel.fr/users/dqsvj667bkqvljdfv23678"
		}
		...
	]

- `is_staff` is a boolean flag indicating whether the user can update other users or not.

## Accessing single user

There are 2 ways of accessing a single user. First, with the user id, or accessing the current authenticated user with a specific endpoint.

### Get a single user

`GET /users/:user`

	$ curl -u "username:password" -i https://api.papiel.fr/users/dqsvj667bkqvljdfv23678
	HTTP/1.1 200 OK
	X-Poll-Interval: 60

	{
		"type": "User",
		"uuid": "dqsvj667bkqvljdfv23678",
		"self_url": "/users/1/"
		"email": foo@bar.fr,
		"firstName": "Foo"
		"lastName": "Bar",
		"isStaff": true;
		"lastLogin": "2008-01-14T04:33:35Z"
	}


### Get the authenticated user

`GET /user`

	$ curl -u "username:password" -i https://api.papiel.fr/user
	HTTP/1.1 302 FOUND
	X-Poll-Interval: 60
	Location: https://api.papiel.fr/users/dqsvj667bkqvljdfv23678

## Manage users

### Create an user

`POST /users`

> Note:  Authenticated user must be part of the staff to be able to create new users.

#### Input

- `firstName` **string**
- `lastName` **string**
- `email` **string**
- `isStaff` _optional_ **boolean**, set to false by default

	{
		"firstName": "Foo",
		"lastName": "Bar",
		"email": "foo.bar@baz.com"
	}

#### Response

You'll be redirected to the new user url.

	HTTP/1.1 302 FOUND
	X-Poll-Interval: 60
	Location: https://api.papiel.fr/users/dqsvj667bkqvljdfv23678

### Update an user

`PATCH /users/:uuid`

> Note:  Authenticated user must be part of the staff to be able to update other users.

> Note:  Authenticated user can't change `is_staff` for himself unless he's part of the staff.

#### Input

- `firstName` _optional_ **string**
- `lastName` _optional_ **string**
- `email` _optional_ **string**
- `isActive` _optional_ **boolean**
- `isStaff` _optional_ **boolean**

Format:

	{
		"firstName": "Baz",
		"lastName": "Foo",
		"email": "baz.foo@bar.com"
	}

#### Response

You'll be redirected to the updated user.

	HTTP/1.1 302 FOUND
	X-Poll-Interval: 60
	Location: https://api.papiel.fr/users/dqsvj667bkqvljdfv23678
