var fs = require('fs')

module.exports = function(opts){ 
  var app = opts.app
  var express = opts.express
  var expressa = opts.expressa

  if( opts.description.match(/\.md$/) != null ){
    try{
      opts.description = fs.readFileSync( opts.description ).toString()
    }catch (e){ opts.description = e.toString() }
  }

  var swagger = {
    "swagger": "2.0",
    "info": {
      "version": opts.version || "1.0.0",
      "title": opts.title || "Api documentation", 
      "description": opts.description || "", 
    },
    "basePath": opts.basepath || "/api",
    "schemes": opts.schemes || [ "http" ],
    "consumes": [ "application/json" ],
    "produces": [ "application/json" ],
    "definitions":{}, 
    "paths": {
      "/user/login":{
        "post":{
          "tags": ["login"],
          "description": "get an authentication token, to be passed as headertoken `x-access-token: yourtoken` in future requests ",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties":{
                  succes: {type:"boolean", default:true}, 
                  token: {type:"string", default:"XAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmNkNWM5NmY4MjA4N2I1MDQ0OTM3Yj"}
                }
              }
            }
          },
          "parameters": [
            {
              "in": "body",
              "name": "payload",
              "description": "`url` is the only required parameter. In case you want to know all roomtypes, leave out guests/arrival/departure.",
              "required": true,
              "schema": {
                "type": "object",
                "properties":{
                  "email":{ type: "string", default:"foo@bar.com" }, 
                  "password":{ type: "string", default:"foobar" }
                }
              }
            }
          ]
        }
      }
    }
  }

  var generateEndpoints = function(collectionname){
    var method 
    var collection = expressa.db[collectionname]
    var collectionpath = "/"+collectionname
    var collectionpath_id = collectionpath+"/{id}"
    var collectionpath_schema = collectionpath+"/schema"
    var schema = require( process.cwd()+'/data/collection/'+collectionname+".json").schema
    var schemaWithoutMeta = JSON.parse( JSON.stringify(schema) )
    if( schemaWithoutMeta.meta ) delete schemaWithoutMeta.meta
    swagger.definitions[collectionname] = schema

    var parameterId = {
      "name": "id",
      "in": "path",
      "required": true,
      "description": "The id of the "+collectionname+"-item to retrieve",
      "type": "string"
    }

    // GET /:collection 
    method = "get"
    swagger.paths[collectionpath] = swagger.paths[collectionpath] || {}
    var path = swagger.paths[collectionpath]
    path[method] = { parameters:[], responses:{} }
    path[method].tags = [collectionname]
    path[method].summary = "List all "+collectionname+" items"
    path[method].parameters.push({
      "name": "query",
      "in": "query",
      "description": "MongoQuery to filter and limit results. See [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) for all options", 
      "required": false,
      "type": "object"
    })
    path[method].parameters.push({
      "name":"fieldname", 
      "in":"query", 
      "required":false, 
      "description": "get an array of documents matching with the specified values. Example: `name=foo&email=foo@bar.com` "
    })
    path[method].responses[200] = {
      "description": "An array of "+collectionname+" items", 
      "schema": {
        type:"array", 
        items: require( process.cwd()+'/data/collection/'+collectionname+".json").schema
      }
    }

    // GET /:collection/schema
    method = "get"
    swagger.paths[collectionpath_schema] = {}
    var path = swagger.paths[collectionpath_schema]
    path[method] = { parameters:[], responses:{} }
    path[method].tags = [collectionname]
    path[method].summary = "get JSONSchema of resource (to easily validate/generate forms in the frontend e.g.)"
    path[method].responses[200] = {
      "description": "A jsonschema", 
      "schema": {type:"object"}
    }

    // GET /:collection/{id} 
    method = "get"
    swagger.paths[collectionpath_id] = swagger.paths[collectionpath_id] || {}
    var path = swagger.paths[collectionpath_id]
    path[method] = { parameters:[], responses:{} }
    path[method].tags = [collectionname]
    path[method].summary = "Get a specific "+collectionname+" item"
    path[method].parameters = [ parameterId ] 
    path[method].responses[200] = {
      "description": "An array of "+collectionname+" items", 
      "schema": require( process.cwd()+'/data/collection/'+collectionname+".json").schema
    }

    // POST /:collection
    method = "post"
    swagger.paths[collectionpath] = swagger.paths[collectionpath] || {}
    var path = swagger.paths[collectionpath]
    path[method] = { parameters:[], responses:{} }
    path[method].tags = [collectionname]
    path[method].summary = "Create a specific "+collectionname+" item"
    path[method].parameters.push({
      "name": "payload",
      "in": "body",
      "description": "a "+collectionname+" object. Fetch `/"+collectionname+"/schema` to see its JSONschema",
      "required": true,
      "schema": schemaWithoutMeta 
    })

    // POST /:collection/{id}/update
    method = "post"
    swagger.paths[collectionpath_id+"/update"] = {}
    var path = swagger.paths[collectionpath_id+"/update"]
    path[method] = { parameters:[], responses:{} }
    path[method].tags = [collectionname]
    path[method].parameters = [ parameterId ] 
    path[method].summary = "modify the document with id using a mongo update query. The message body should be the update query. See [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) for all options."

    // PUT /:collection/{id}
    method = "put"
    swagger.paths[collectionpath] = swagger.paths[collectionpath] || {}
    var path = swagger.paths[collectionpath]
    path[method] = { parameters:[], responses:{} }
    path[method].tags = [collectionname]
    path[method].parameters = [ parameterId ] 
    path[method].summary = "Create a specific "+collectionname+" item"

    // DELETE /:collection/{id}
    method = "delete"
    swagger.paths[collectionpath_id] = swagger.paths[collectionpath_id] || {}
    swagger.paths[collectionpath] = swagger.paths[collectionpath] || {}
    path[method] = { parameters:[], responses:{} }
    path[method].tags = [collectionname]
    path[method].parameters = [ parameterId ] 
    path[method].summary = "Create a specific "+collectionname+" item"
  }
  
  app.use( '/api/swagger', function(req, res, next){
    for( collectionname in expressa.db ) generateEndpoints(collectionname)
    if( opts.onDocumentation ) opts.onDocumentation(swagger)
    res.send(swagger)
    res.end()
  })

  var docurl = opts.url || '/api/doc'

  // include swagger location to doc 
  app.use( function(req, res, next) {
    if( req.url == docurl ) return res.redirect( docurl+"?url=/api/swagger#/login")
    next() 
  })

  app.use( docurl, express.static( __dirname+'/../public/doc')  )   

}
