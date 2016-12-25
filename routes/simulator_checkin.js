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
                PostCode(game_host[p],'8601','/checkin/test/wuid',{'wuid':wuid,'adminnum':'denanba','adminhash':'yueruqianwan'}, function(respdata){
                        console.log(respdata);        
                        res.end(JSON.stringify(respdata));
                });
}
