function requestHandler(error, request){
  if(error) return console.error(error.toString());
 
  var xhr = new XMLHttpRequest();
  xhr.open(request.method, request.url)
 
  if(request.headers){
    Object.keys(request.headers).forEach(function(header){
      xhr.setRequestHeader(header, request.headers[header]);
    });
  }
 
  xhr.onloadend = function(){
    request.options.callback(this.response);
  };
 
  xhr.send(request.body);
}

window.api = {}

requestHandler( null, {
  method: "get",
  url: "/api/swagger", 
  headers: { "Content-Type":"application/json" }, 
  options:{
    callback: function(res){
      var cb = ( window.api &&  window.api.ready ) ? window.api.ready : false
      window.api = swaggerClientGenerator(res, requestHandler);
      if( cb ) cb()
    }
  }
}) 
