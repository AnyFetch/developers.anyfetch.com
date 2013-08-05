---
title: Architecture
layout: doc
---

The architecture off cluestr is divided into different modules allowing a more fexible interaction with third-party applications.

## Overview

Cluestr API, is composed of 4 parts communicating with a the central core API :

- Providers : the actuals data inputs off the cluestr API, it allows develloper to connect there own application to API.
- Hydraters : process the documents and extract the right information. The documents hydratation is based on a graph.
- Projecter : use the differents metadata extracted from the documents related the users query to send back to the frontend the necessary informations for the user.
- Core : odering all the previous modules and store the informations extracted from the documents.

TODO : infrastructure image

## Modules 

### Providers

