var handler = module.exports;
var exec = require('child_process').exec;
var querystring = require('querystring');
var fs = require('fs');

var conf = require('../conf/config').data;
var gmTool = conf[0].gmTool
var game_host = conf[1].game_host
var project_path = "/home/nba/nba_game_server/";
var script_path = "bin/daemon/";
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
