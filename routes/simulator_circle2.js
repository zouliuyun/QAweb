var handler = module.exports;
var exec = require('child_process').exec;
var querystring = require('querystring');
var fs = require('fs');
var async = require('async');
var compressjs = require('compressjs');
var algorithm = require('compressjs').Lzp3;

var conf = require('../conf/config').data;
var gmTool = conf[0].gmTool
var game_host = conf[1].game_host
var project_path = "/home/nba/nba_game_server/";
var script_path = "bin/daemon/";
var PostCode=require('../models/until').PostCode;
var PostCodezip=require('../models/until').PostCodezip;
var circle = require('../conf/circle2').data;

handler.index =  function(req,res) {
                var p = req.query.p + "";
                if(!p) p=1;
                res.locals.p = p;
                var alldata = []
                var info= {
                        wuid: 4455312657675,
                        num: 10,
                        select: "钻石"
                    }
                var newrespdata = {}
                if(!req.body.wuid) {
                                return res.render('simulator_circle2', {
                                msg: '请点击刷新转盘',
                                results: alldata,
                                info: info
                                 });
                }
                var wuid = String(req.body.wuid);
                var p = req.query.p + "";
                var num = req.body.num + "";
                var select = req.body.select + "";
                var re=new RegExp(select)
                PostCodezip(game_host[p],'8601','/checkin/test/wuid',{'wuid':wuid,'adminnum':'denanba','adminhash':'yueruqianwan'}, function(respdata){
			//console.log(respdata)
                        if(respdata.code != 200) {
                                return res.render('simulator_circle2', {
                                msg: '=======登录失败=====',
                                results: alldata,
                                info: req.body
                                 });
                        }
			var uid = respdata.data.tu;
                        var count = 0;

                        async.whilst(
                            function () { return count <= num; },
                            function (callback) {
                                count++;
                                PostCode(game_host[p],'8601','/refresh/circle',{'uid':uid,'lock':''}, function(respdata){
					newrespdata = {}
                                        //console.log('1',respdata)
                                        newrespdata.code = respdata.code
                                        newrespdata.circle=[]
                                        if (respdata.circle ) {
                                                
                                                for (var i = 0; i < respdata.circle.length; i++) {
                                                        var str2=respdata.circle[i].i[0].i[0].i
                                                        var str1 = circle[str2]
                                                        newrespdata.circle.push(str1)
                                                }

                                        }else {
						console.log(respdata)
                                        }
                                        alldata.push(newrespdata)
                                        console.log('2',String(newrespdata.circle))
                                        if (respdata.msg ||(respdata.circle && String(newrespdata.circle).match(re)))
                                                return res.render('simulator_circle2', {
                                                msg: respdata.msg || '=======刷新出指定物品=====',
                                                results: alldata,
                                                info: req.body
                                                });
                                        callback(null,alldata)
                                        
                                });
                            },
                            function (err, alldata) {
                                return res.render('simulator_circle2', {
                                msg: '=======未刷新到指定物品=====',
                                results: alldata,
                                info: req.body
                                 });
                            }
                        );
                })

        }
