var handler = module.exports;
var exec = require('child_process').exec;
var querystring = require('querystring');
var fs = require('fs');
var async = require('async');

var conf = require('../conf/config').data;
var gmTool = conf[0].gmTool
var game_host = conf[1].game_host
var project_path = "/home/nba/nba_game_server/";
var script_path = "bin/daemon/";
var PostCode=require('../models/until').PostCode;
var zhuanpan = require('../conf/zhuanpan').data;


handler.index =  function(req,res) {
                var p = req.query.p + "";
                if(!p) p=1;
                res.locals.p = p;
                var alldata = []
                var info= {
                        wuid: 138337706835459500,
                        num: 10,
                        select: "钻石"
                    }
                var newrespdata = {}
                if(!req.body.wuid) {
                                return res.render('simulator_ring', {
                                title: '统计数据',
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
                                return res.render('simulator_ring', {
                                title: '统计数据',
                                results: alldata,
                                info: req.body
                                 });
                        }
                        var uid = respdata.data.tu;
                        var count = 0;

                        async.whilst(
                            function () { return count <= num; },
                            function (callback) {
                                count++
                                setTimeout(function () {
                                        PostCode(game_host[p],'8601','/refresh/ring/select_list',{'uid':uid}, function(respdata){
                                                newrespdata = {}
                                                console.log('1',respdata)
                                                newrespdata.code = respdata.code
                                                if (respdata.data) {
                                                        newrespdata.data=[]
                                                        for (var i = 0; i < respdata.data.l.length; i++) {
                                                                var str1 = zhuanpan[respdata.data.l[i].i]
                                                                newrespdata.data.push(str1)
                                                        }
                                                }else {
                                                        newrespdata.msg = respdata.msg
                                                }
                                                alldata.push(newrespdata)
                                                if (respdata.data && String(newrespdata.data).match(re))
                                                        return res.render('simulator_ring', {
                                                        title: '统计数据',
                                                        results: alldata,
                                                        info: req.body
                                                        });                                               
                                                
                                        })
                                        callback(null,alldata)
                                }, 400);

                            },
                            function (err, alldata) {
                                return res.render('simulator_ring', {
                                title: '统计数据',
                                results: alldata,
                                info: req.body
                                 });
                            }
                        );
                })

        }

