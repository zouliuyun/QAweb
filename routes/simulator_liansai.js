var handler = module.exports;
var exec = require('child_process').exec;
var querystring = require('querystring');
var fs = require('fs');

var conf = require('../conf/config').data;
var gmTool = conf[0].gmTool
var game_host = conf[1].game_host
var project_path = "/home/nba/nba_game_server/";
var script_path = "bin/daemon/";
PostCode=require('../models/until').PostCode;

handler.index = function(req,res) {
                var wuid = parseInt(req.query.wuid);
                var p = req.query.p + "";
                var ac = parseInt(req.query.ac);
                var script;
                var log  = "/data/liansai.log";
                res.locals.p = p;
                if(!ac){
                        var r2 = exec('ssh nba_web'+p+' "tail -n 30 '+log+'"');
                        r2.stdout.on('data', function(data){
                                res.locals.log = data;
                                return res.render('simulator_liansai');

                         });

                }else{
                        if(ac==1){
                                script = project_path + script_path + "PVP_liansai_dist_reward.js";
                        }else{
                                script = project_path + script_path + "PVP_liansai_update_schedule.js";
                        }
                        var env = 1;
                        if(p==1 || p ==3) env = 11;
                        if(p==2 || p ==4 || p==5) env = 1;

                        var param = " " + p + " " + env + " DEBUG";

                        var command = "nohup node "+ script + param +" > "+ log + " &";

                        var r1 = exec('ssh nba_web'+p+' "'+command+'"');
        //              r1.stdout.on('data', function(data){
                        var r2 = exec('ssh nba_web'+p+' "less '+log+' | grep \"\""');
                        r2.stdout.on('data', function(data){
                                res.locals.log = data;
                                return res.render('simulator_liansai');
                        });
                        }
//              });


}
