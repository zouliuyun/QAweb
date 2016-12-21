var handler = module.exports;
var exec = require('child_process').exec;
var querystring = require('querystring');
var fs = require('fs');

var conf = require('../conf/config').data;
var gmTool = conf[0].gmTool
var game_host = conf[1].game_host
var project_path = "/home/nba/nba_game_server/";
var script_path = "bin/daemon/";
var PostCode=require('../models/until').PostCode;
var circle = require('../conf/circle').data;

handler.index =  function(req,res) {
                var uid = parseInt(req.query.uid);
                var p = req.query.p + "";
                if(!uid) {
                        if(!p) p=1;
                        res.locals.p = p;
                        return res.render('simulator_circle');
                }
                PostCode(game_host[p],'8601','/refresh/circle',{'uid':uid,'lock':''}, function(respdata){
                        console.log('1',respdata)
                        var newrespdata = {}
                        newrespdata.code = respdata.code
                        if (respdata.circle) {
                                newrespdata.circle = []
                                for (var i = 0; i < respdata.circle.length; i++) {
                                        var str2=respdata.circle[i].i[0].i[0].i
                                        var str1 = circle[str2]
                                        newrespdata.circle.push(str1)
                                }
                        }else {
                                newrespdata.msg = respdata.msg
                        }
                        console.log('2',newrespdata)
                        res.end(JSON.stringify(newrespdata));
                });
}
