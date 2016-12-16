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
var zhuanpan = require('../conf/zhuanpan').data;

handler.index =  function(req,res) {
                var uid = parseInt(req.query.uid);
                var select=new RegExp(String(req.query.select)) 
                var p = req.query.p + "";
                if(!uid) {
                        if(!p) p=1;
                        res.locals.p = p;
                        return res.render('simulator_ring');
                }
                PostCode(game_host[p],'8601','/refresh/ring/select_list',{'uid':uid}, function(respdata){
                        console.log('1',respdata)
			var newrespdata = {}
			newrespdata.code = respdata.code			
                        if (respdata.data) {                         
                                var flag = 0 
                                newrespdata.data = []
                                for (var i = 0; i < respdata.data.l.length; i++) {
                                        var str1 = zhuanpan[respdata.data.l[i].i]
                                        newrespdata.data.push(str1)
                                        if (str1.match(select)) {
                                                flag=1
                                        }
                                }
                                if (flag) {
                                        newrespdata.msg="select"
                                }
                        }else {
                                newrespdata.msg = respdata.msg
                        }
                        console.log('2',newrespdata)
                        res.end(JSON.stringify(newrespdata));
                });
}
