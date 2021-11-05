const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const cmd = require('discord.js-commando');
const path = require('path');
const config = require( path.resolve( __dirname, "config.json" ) );

http.createServer(function(req, res){
  if (req.method == 'POST'){
    var data = "";
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      if(!data){
        res.end("No post data");
        return;
      }
      var dataObject = querystring.parse(data);
      console.log("post:" + dataObject.type);
      if(dataObject.type == "wake"){
        console.log("Woke up in post");
        res.end();
        return;
      }
      res.end();
    });
  }
  else if (req.method == 'GET'){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Discord Bot is active now\n');
  }
}).listen(3000);

const client = new cmd.CommandoClient({
    commandPrefix: config.prefix,
    unknownCommandResponse: false
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['utils', 'Utility'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(config.activity);
});

client.on('message' , message => {
if(message.content === config.prefix + "help"){
const emb = new discord.RichEmbed()
.setTitle("Commands")
.addField("**= mmvote =**" , "> 投票")
.addField("**= mmtao =**" , "> オリ敵")
.addField("**= mmsay =**" , "> ")

client.login(config.token);
