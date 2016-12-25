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

handler.index =  function(req,res) {
                var uid = parseInt(req.query.uid);
                var p = req.query.p + "";
                if(!uid) {
                        if(!p) p=1;
                        res.locals.p = p;
                        return res.render('simulator_ring');
                }
                PostCode(game_host[p],'8601','/refresh/ring/select_list',{'uid':uid}, function(respdata){
                        console.log(respdata);
                        res.end(JSON.stringify(respdata));
                });
}
