# Triangular

#### v 0.1.1 Alpha (Sullust)

##### A Fully Operational **Vertical Stack Framework** Featuring KOA, MongoDB & AngularJS

## Installation

```sh
npm install triangular -g
```

## Whats It About?

  - Installed Global for Built in Generators, Scaffolding, Testing, Deployment, and Monitoring
  - Highly Opinionated (makes it very easy to get up and running very quickly)
  - Includes Database, Backend, API, and Front-End Single Page Application
  - All Written in Javascript
  - Quick Setup with Config Files
  - Automated DB Connection Management (1 or more DBs)
  - Automated Controller Routing
  - Automated Shared Server & Client Application Data Models
  - Automated Asset Management
  - Automated Application Build Process
  - You Just Worry About Your Application Logic
  - Magic

Before you get started with Triangular, you should be willing to accept the fact that we picked what we believe are the best libraries and tools to get you up and going very quickly. We designed and built Triangular around a delivering a single path to developing your application quickly and with the most features - not options.

> Now, witness the power of this fully operational node framework.

## Tech

Triangular uses a number of open source projects to work properly:

* [node.js] - Evented I/O for the Backend
* [Koa] - Amazing, Newer Brother to Node Express
* [MongoDB] - Database
* [Redis] - Quick, Persistent Data Store
* [Mongoose] - Server Side Model Validation for MongoDB
* [AngularJS] - Client Side Javascript Framework
* [Twitter Bootstrap] - Making the Front End Look Nice

# Getting Started

## Models

Triangular creates either back end, front end or shared models depending on where you will be utilizing your models in the controller logic. Any front end or shared models will be visible in the Javascript and therefore the structure will be public. Back end models are not public or available to the front end.

### Model Configuration Structure

Models are defined in configuration modules which are picked up by Triangular. Model locations must be kept in their original locations to work.

#### Structure

```js
module.exports = {

    // User's First Name
    first: 'String',

    // User's Email Address
    email: {
        type: 'Email',
        required: true,
        unique: true,
        size: 'Long',
        validate: true,
        max: 120,
        min: 6
    }

}
```

#### Model Properties

Below the bold items in the list are the properties, italicized are config values and italicized in parenthesis are the defaults.

**Universal**

- **type** *String (String)*
    - String
    - Email
    - Password
    - Select
    - Phone
    - Zip
    - SSN
    - Number
    - Date
    - Buffer
    - Boolean
    - List
- **required** *Boolean (false)*
- **validate** *Boolean (true)* | Validation should be performed
- **unique** *Boolean (false)*
- **maxSize** *Int* | Maximum allowable length
- **minSize** *Int* | Minimum allowable length
- **store** *Boolean (true)* | Property should be sent back end and stored
- **autogenerate** *Boolean (false)* | Will auto-generate a hash for the value
- **autogenerateLength** *Int (16)* | Length of the hash to generate
- **default** *Mixed* | The default value if not given

**Front End**

- **show** *boolean (true)* | Indicates if the value should be shown in forms and lists

**Back End**

#### Front End & Shared Models

These models will be available and automatically created for use in the Angular controller logic. The must be located at:

```sh
app/public/models
```

#### Back End Models

These modules will be available and automatically created for use in the back end controller logic. The must be located at:

```sh
app/api/models
```



MIT License
----

Copyright (c) 2014 Thomas Brian <tdbrian@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

**Free Software, Hell Yeah!**

[koa]:http://koajs.com/
[@tdbrian]:http://twitter.com/tdbrian
[mongodb]:http://www.mongodb.org/
[redis]:http://redis.io/
[Mongoose]:http://mongoosejs.com/
[node.js]:http://nodejs.org
[Twitter Bootstrap]:http://twitter.github.com/bootstrap/
[AngularJS]:https://angularjs.org/
[jQuery]:http://jquery.com
