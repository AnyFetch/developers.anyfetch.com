---
title: User API
layout: doc
---

## Accessing single user

There are 2 ways of accessing a single user. First, with the user id, or accessing the current authenticated user with a specific endpoint.

### With the uuid

`GET /users/:user`

```
$ curl -u "username:password" -i https://api.papiel.fr/users/dqsvj667bkqvljdfv23678
HTTP/1.1 200 OK
X-Poll-Interval: 60

{
	"type": "User",
	"uuid": "dqsvj667bkqvljdfv23678",
	"self_url": "/users/1/"
	"email": foo@bar.fr,
	"first_name": "Foo"
	"Last_name": "Bar",
	"is_active": true,
	"is_staff": true;
	"last_login": "2008-01-14T04:33:35Z"
}
```

### The current authenticated user

`GET /users/me`

```
$ curl -u "username:password" -i https://api.papiel.fr/user/me
HTTP/1.1 302 FOUND
X-Poll-Interval: 60
Location: https://api.papiel.fr/users/dqsvj667bkqvljdfv23678
```

### Interaction with a single user

* `GET ` can be used by everyone 
* `POST` for creation can be used by everyone 
* `PUT` for updating actual account status can be used by a staff member or the current connected user on his own account


## Accessing all users

Its list all the users in the company.

`GET /users`

**params**

* `?is_active = bool` Dispay users matching the active status 
* `?is_staff = bool` Display users matching the staff status
* `?last_login_gt = date` Last connection **after** the specified `date`
* `?last_login_lt = date` Last connection **before** the specified `date`
* `?date_joined_gt = date` Creation of the user account **after** the specified `date`
* `?date_joined_lt = date` Creation of the user account **before** the specified `date`

> Note : the account creation's date is stored in the `uuid`, it doesn't need a specific column 

```
$ curl -u "username:password" -i https://api.papiel.fr/users
HTTP/1.1 200 OK
X-Poll-Interval: 60

[
	{
		"type": "User",
		"uuid": 1,
		"self_url": "/users/1/"
		"email": foo@bar.fr,
		"first_name": "Foo"
		"Last_name": "Bar",
		"is_active": true,
		"is_staff": true;
		"last_login": "2023-01-14T04:33:35Z"
	},
	...
]
```
