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
        var js = req.query.js;
        var js_arr = js.split(",");
        var _ENV = 1;
        var BS = require(project_path+"/app/services/Basic_Service");
        var _SERVICE_PORT=8601;

        BS.initService(false, false,false,_SERVICE_PORT, 2, _ENV, 'DEBUG', function(){
                var resp="";
                for(i in js_arr){
                        resp += 'var '+js_arr[i]+' = '+eval('JSON.stringify(BS.'+js_arr[i]+')')+';';
                }
                res.end(resp);
        });
}

handler.index = function(req,res) {
                var p = req.query.p + "";
                var ac = parseInt(req.query.ac);
                var script;
                var log  = "/tmp/PVP_threepoint_dist_reward.log";
                res.locals.p = p;
                if(!ac){
                        var r1 = exec('ssh nba_web'+p+' "tail -n 30 '+log+'"', function(err, stdout, stderr){
                                if(err){
                                        res.locals.log = err;
                                }else{
                                        res.locals.log = stdout;
                                }
                                return res.render('simulator_threepoint');
                        });
                }else{
                        if(ac==1){
                                script = project_path + script_path + "PVP_threepoint_dist_reward.js";
                        }

                        if(!script){
                                res.locals.log = '';
                                return res.render('simulator_threepoint');
                        }

                        var env = 1;
                        if(p==9 || p ==10 || p==12) env = 11;
                        if(p==7 || p ==8 || p==11 || p==13) env = 1;

                        var param = " " + p + " " + env + " DEBUG";

                        var command = "nohup node "+ script + param +" > "+ log + " &";

                        var r2 = exec('ssh nba_web'+p+' "'+command+'"',function(err, stdout, stderr){
                                if(err){
                                        res.locals.log = err;
                                        return res.render('simulator_threepoint');
                                }
                                var r3 = exec('ssh nba_web'+p+' "less '+log+'"', function(err, stdout, stderr){
                                        if(err){
                                                res.locals.log = err;
                                                return res.render('simulator_threepoint');
                                        }
                                        res.locals.log = stdout;
                                        return res.render('simulator_threepoint');
                                });
                        });
                }
}
