ps x|grep restart_server|grep zhou|grep -v grep |awk '{print $1}'|xargs kill -9 
node `pwd`/restart_server.js >log/restart_server.log &
