Beautifully generated documentation + restclients for Express+Expressa using swagger + markdown 

![](https://github.com/coderofsalvation/expressa-swagger/raw/master/expressa.png)

## Features

* generates online documentation at `/api/doc`
* generates swagger json at `/api/swagger`
* generates swagger client at `/api/client`

## Usage

    npm install expressa-swagger --save

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

Eventhough you can generate REST-clients for almost __any__ language using [swagger-codegen](http://swagger.io/swagger-codegen), expressa-swagger serves 
a simple JavaScript REST client, by putting this into your frontend-code:

    <script type="text/javascript" src="/api/client"></script>

    <script type="text/javascript">
      api.ready = function(){
        // for apiKey authorization use: api.auth('my-token') 
        // for basicAuth use: api.auth('username', 'password') 
        // authorization may be set for any level (api, api.resource, or api.operation) 
        //
        // get a user like this:
        //
        // api.user.getUserById("2kl3h4lk2jhk42j3h4", function(response){
        //   console.log(response);
        // });
      }
    </script>

## Todo 

* option boolean to authenticate user + only show those endpoints/methods/properties which user has access to 
