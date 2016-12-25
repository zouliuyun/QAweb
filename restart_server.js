var express = require('/home/nba/nba_game_server/node_modules/express');
var http = require('http');
var app = express();
var ejs = require('/data/zhou/node_modules/ejs');
app.set('views', 'views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');
var exec = require('child_process').exec;
var querystring = require('querystring');
var fs = require('fs');


http.createServer(app).listen(8989, function(){
		  console.log('Express server listening on port 8989');
});


var basic_service = require('./routes/basic_service');
var branch = require('./routes/branch');
var challenge = require('./routes/challenge');
var log = require('./routes/log');
var process = require('./routes/process');
var pull = require('./routes/pull');
var quit = require('./routes/quit');
var restart = require('./routes/restart');
var setDateTime2 = require('./routes/setDateTime2');
var setDateTime = require('./routes/setDateTime');
var simulator_checkin = require('./routes/simulator_checkin');
var simulator = require('./routes/simulator');
var simulator_liansai = require('./routes/simulator_liansai');
var simulator_pack = require('./routes/simulator_pack');
var simulator_ring = require('./routes/simulator_ring');
var simulator_threepoint = require('./routes/simulator_threepoint');
var simulator_gacha = require('./routes/simulator_gacha');
var time = require('./routes/time');

app.all('/basic_service/', basic_service.index);
app.all('/branch/', branch.index);
app.all('/challenge/', challenge.index);
app.all('/log/', log.index);
app.all('/process/', process.index);
app.all('/pull/', pull.index);
app.all('/quit/', quit.index);
app.all('/restart/', restart.index);
app.all('/setDateTime2/', setDateTime2.index);
app.all('/setDateTime/', setDateTime.index);
app.all('/simulator_checkin/', simulator_checkin.index);
app.all('/simulator/', simulator.index);
app.all('/simulator_liansai/', simulator_liansai.index);
app.all('/simulator_pack/', simulator_pack.index);
app.all('/simulator_ring/', simulator_ring.index);
app.all('/simulator_threepoint/', simulator_threepoint.index);
app.all('/simulator_gacha/', simulator_gacha.index);
app.all('/time/', time.index);



app.get('/', function(req, res){
				
				var r1 = exec('ssh nba_web2 "date"');
				r1.stdout.on('data', function(data){
						res.locals.cnTime=data;
						var r2 = exec('ssh nba_web1 "date"');
						r2.stdout.on('data', function(data){
								res.locals.tcTime=data;
								//var r5 = exec('ssh nba_web5 "date"');
                                                                //r5.stdout.on('data', function(data){
                                                                        res.locals.cn2015Time=data;
									res.locals.tt = new Date().getTime();
									return res.render('index');
								//});
						});
				});
});


