var handler = module.exports;
var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var zlib = require('zlib');

handler.PostCode = function(host,port,path,namedvaluepair,cb) {
  var post_data = querystring.stringify(namedvaluepair);

  var post_options = {
      host: host,
      port: port,
      path: path,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
      }
  };

  var post_req = http.request(post_options, function(res) {
	  var response_data='';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
		  response_data+=chunk;
      });
      res.on('end', function (chunk) {
		  console.log(path);
		  console.log('POST:'+post_data);
		  try{
			if(cb) cb(JSON.parse(response_data));
			  console.log('Response: ' + response_data);
			//  fs.appendFileSync('test.log.txt',path+'\r\n');
			//  fs.appendFileSync('test.log.txt','POST:'+post_data+'\r\n');
			//  fs.appendFileSync('test.log.txt','RESPONSE: ' + response_data+'\r\n');
		  }catch(e){	
			  /*
			  zlib.inflate(response_data, function(err, inflatedBuf) {
				console.log(err);
				console.log('Response1: ' + inflatedBuf);
			  });
			  */
			  console.log(response_data);
			  console.log(e);
		  }
      });
  }).on('error', function(error) {console.log(error);});

  // post the data
  post_req.write(post_data);
  post_req.end();
}


handler.PostCodezip = function(host,port,path,namedvaluepair,cb) {
  var post_data = querystring.stringify(namedvaluepair);

  var post_options = {
      host: host,
      port: port,
      path: path,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
      }
  };

  var post_req = http.request(post_options, function(res) {
      var body = "";

      var output;
      if(res.headers['content-encoding'] == 'deflate' ) {
        var gzip = zlib.createInflate();
        res.pipe(gzip);
        output = gzip;
      }else if(res.headers['content-encoding'] == 'gzip' ){
        var gzip = zlib.createGunzip();
        res.pipe(gzip);
        output = gzip;
      } else {
        output = res;
      }

      output.on('data', function (data) {
        data = data.toString('utf-8');
        body += data;
      });

      output.on('end', function() {
        console.log(path);
        console.log('POST:'+post_data);
        console.log("");
        //console.log("RESPONSE:");
        //console.log(JSON.stringify(JSON.parse(body), null, '    '));
        if(cb) cb(JSON.parse(body));
      });
  }).on('error', function(error) {console.log(error);});

  // post the data
  post_req.write(post_data);
  post_req.end();
}
