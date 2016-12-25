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
                var w = 11;
                if(p==1 || p==3) w=11;
                if(p==2 || p==4 || p==5) w=1;
                var r1 = exec('ssh nba_web'+p+' "/usr/local/bin/node /home/nba/nba_game_server/bin/daemon/PVP_challenge_top10_freeze_ranking.js '+p+' '+w+'  DEBUG nba_web2 850'+p+'"');
//console.log('ssh nba_web'+p+'; /usr/local/bin/node /home/nba/nba_game_server/bin/daemon/PVP_challenge_top10_freeze_ranking.js '+p+' '+w+'  DEBUG nba_web2 8500');
                r1.stdout.on('data', function(data){
                        res.locals.ps = data;
                        res.locals.p = p;
                        res.locals.gmtool = gmTool[p];
                        return res.render('restart');

                });
} 
