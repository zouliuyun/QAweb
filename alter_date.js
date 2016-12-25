var express = require('/home/nba/nba_game_server/node_modules/express');
var http = require('http');
var app = express();
var ejs = require('/data/zhou/node_modules/ejs');
app.set('views', 'views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');
var exec = require('child_process').exec;

http.createServer(app).listen(8999, function(){
		  console.log('Express server listening on port 8999');
});

app.get('/', function(req, res){
				
				var r1 = exec('ssh nba_web2 "date"');
				r1.stdout.on('data', function(data){
						res.locals.cnTime=data;
						var r2 = exec('ssh nba_web1 "date"');
						r2.stdout.on('data', function(data){
								res.locals.tcTime=data;
								res.locals.tt = new Date().getTime();
								return res.render('index');
						});
				});
});

app.get('/setDateTime',function(req, res){
				var p = parseInt(req.query.platform);
				var user_date = req.query.user_date;
				user_date = user_date.replace(/T/,' ');
				console.log(user_date);
				if(p){
					var r1 = exec('ssh nba_web1 "date -s \''+user_date+'\'"');
					r1.stdout.on('data', function(data){
							var r2 = exec('ssh nba_web3 "date -s \''+user_date+'\'"');
							r2.stdout.on('data', function(data){
                  res.locals.tcTime=data;
                  var r3 = exec('ssh nba_web2 "date"');
                  r3.stdout.on('data', function(data){
                    res.locals.cnTime=data;
										res.locals.tt = new Date().getTime();
                    return res.render('index');
                  });

							});
					});
				}else{
          var r1 = exec('ssh nba_web2 "date -s \''+user_date+'\'"');
          r1.stdout.on('data', function(data){
              var r2 = exec('ssh nba_web4 "date -s \''+user_date+'\'"');
              r2.stdout.on('data', function(data){
                  res.locals.cnTime=data;
									var r3 = exec('ssh nba_web1 "date"');
			            r3.stdout.on('data', function(data){
	                	res.locals.tcTime=data;
										res.locals.tt = new Date().getTime();
										return res.render('index');
									});
              });
          });
				}
});

