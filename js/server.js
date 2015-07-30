var mysql      = require('mysql');
var client = require('socket.io').listen('8080').sockets;
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test'
});

connection.connect(function(error,db){
    if (error) throw error;
    client.on('connection',function(socket){
        sendStatus = function(s){
            socket.emit('status',s);
        }
        connection.query('Select * from chat order by id desc limit 100',function(err,res){
            if(err) throw err;
            socket.emit('output',res);
        });
        
        
        socket.on('input',function(data){
            var name = data.name;
            var message = data.message;
            var whitespacePattern = /^\s*$/;
            if(whitespacePattern.test(name) || whitespacePattern.test(message)){
                sendStatus('Name and message is requierd.');
            }else{
                connection.query('Insert into chat (name,message) values("'+name+'","'+message+'")',function(err,rows){
                   if(err) throw err;
                   client.emit('output',[data]);
                   sendStatus({message:"Sended",clear:true});
                });
            }            
        })
    })
});
