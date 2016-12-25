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
                                var p = parseInt(req.query.platform);
                                var user_date = req.query.user_date;
                                user_date = user_date.replace(/T/,' ');
                                console.log(user_date);
                                if(p==0){
                                        var r1 = exec('ssh nba_web7 "date -s \''+user_date+'\'"');
                                        r1.stdout.on('data', function(data){
                                                var r2 = exec('ssh nba_web8 "date -s \''+user_date+'\'"');
                                                r2.stdout.on('data', function(data){
                                                        res.locals.cnTime=data;
                                                        r3=exec('ssh nba_web10 "date -s \''+user_date+'\'"');
                                                        r3.stdout.on('data', function(data){
                                                        res.locals.twTime=data;

                                                                        res.locals.tt = new Date().getTime();
                                                                        return res.render('time');
                                                        });

                                                });
                                        });
                                }
                                if(p==1){
                                        var r1 = exec('ssh nba_web9 "date -s \''+user_date+'\'"');
                                        r1.stdout.on('data', function(data){
                                                        res.locals.twTime=data;
                                                        var r3 = exec('ssh nba_web7 "date"');
                                                        r3.stdout.on('data', function(data){
                                                                res.locals.cnTime=data;

                                                                        res.locals.tt = new Date().getTime();
                                                                        return res.render('time');
                                                        });

                                         });
                                }

}
