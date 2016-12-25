var handler = module.exports;
var exec = require('child_process').exec;
var querystring = require('querystring');
var fs = require('fs');

var conf = require('../conf/config').data;
var gmTool = conf[0].gmTool
var game_host = conf[1].game_host
var project_path = "/home/nba/nba_game_server/";
var script_path = "bin/daemon/";
handler.index = function(req, res){
                var p = parseInt(req.query.p);
                if(!p) p=1;
                var r1 = exec('ssh nba_web'+p+' "perl /data/zhou/restart.pl"');
                r1.stdout.on('data', function(data){
                        res.locals.ps = data;
                        var r2 = exec('ssh nba_web'+p+' "ps aux | grep node"');
                        r2.stdout.on('data', function(data){
                                res.locals.ps += data;
                                res.locals.p = p;
                                res.locals.gmtool = gmTool[p];
                                return res.render('restart');
                        });

                });
}
