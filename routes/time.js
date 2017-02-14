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

                                var r1 = exec('ssh nba_web8 "date"');
                                r1.stdout.on('data', function(data){
                                                res.locals.cnTime=data;
                                                res.locals.tt = new Date().getTime();
                                                var r2 = exec('ssh nba_web9 "date"');
                                                r2.stdout.on('data', function(data){
                                                        res.locals.twTime=data;
                                                        res.locals.tt = new Date().getTime();

                                                        return res.render('time');
                                                });
                                });
}
