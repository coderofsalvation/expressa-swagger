Beautifully generated documentation + restclients for Express + [Expressa](https://npmjs.org/package/expressa) using swagger + markdown 

![](https://github.com/coderofsalvation/expressa-swagger/raw/master/expressa.png)

## Features

* generates online documentation at `/api/doc`
* generates swagger json at `/api/swagger`

## Usage

    npm install expressa-swagger --save

> NOTE: windows users need to make their own symlinks (see 'postinstall' in package.json)

Then add this snippet to your expressa application:

    var expressaSwagger = require('expressa-swagger')
    expressaSwagger({
      express: express, 
      expressa: expressa, 
      app: app, 
      url: '/api/doc', 
      title: 'My appname', 
      description: "Lorem ipsum `markdown`",  // or just pass  __dirname+"/API.md" e.g.
      version: '1.0.0', 
      basepath: '/api', 
      schemes: ["http"], 
      onDocumentation: function(swagger, req, res, next){
        // optionally hide/modify swagger data here, or add auth middleware 
        // before serving it to the documentation generator at /api/doc
      }
    })

Grab REST-clients for almost __any__ language using [swagger-codegen](http://swagger.io/swagger-codegen).

> NOTE: For the browser & nodejs, the recommended REST-client is [expressa-restclient](https://npmjs.org/package/expressa-restclient]

## Adhoc endpoint documentation

Anywhere in your expressa-app, you can add documentation for endpoints like so:

    expressa.swagger.addEndpoint("get", "my/custom/endpoint",{
      "parameters": [
        {
          "in": "body",
          "name": "payload",
          "description": "", 
          "required": true,
          "schema": {
            "type": "object",
            "required":["id_user"],                  // see swagger
            "properties": {                          // documentation
              "id_user":{
                "required":true, 
                "type":"string",
                "default":"lLK34LK" 
              }
            }
          }
        }    
      ],
      "responses": { },
      "tags": [ "users" ],
      "summary": "Lorem ipsum"
    })

## Todo 

* option boolean to authenticate user + only show those endpoints/methods/properties which user has access to 
