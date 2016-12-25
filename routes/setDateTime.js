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
                                if(p==1){
                                        var r1 = exec('ssh nba_web1 "date -s \''+user_date+'\'"');
                                        r1.stdout.on('data', function(data){
                                                var r2 = exec('ssh nba_web3 "date -s \''+user_date+'\'"');
                                                r2.stdout.on('data', function(data){
                                                        res.locals.tcTime=data;
                                                        var r3 = exec('ssh nba_web2 "date"');
                                                        r3.stdout.on('data', function(data){
                                                                res.locals.cnTime=data;
                                                                //var r5 = exec('ssh nba_web5 "date"');
                                                                //r5.stdout.on('data', function(data){
                                                                        res.locals.cn2015Time=data;
                                                                        res.locals.tt = new Date().getTime();
                                                                        return res.render('index');
                                                                //});
                                                        });

                                                });
                                        });
                                }else if(p==0){
                                        var r1 = exec('ssh nba_web2 "date -s \''+user_date+'\'"');
                                        r1.stdout.on('data', function(data){
                                                var r2 = exec('ssh nba_web4 "date -s \''+user_date+'\'"');
                                                r2.stdout.on('data', function(data){
                                                        res.locals.cnTime=data;
                                                        var r3 = exec('ssh nba_web1 "date"');
                                                        r3.stdout.on('data', function(data){
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
                                }
}
