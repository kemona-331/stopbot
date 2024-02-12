const http = require('http')
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const moment = require('moment');
const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const util = require('util');
const path = require('path');
const cron = require('node-cron');
const Keyv = require('keyv');
const db = new Keyv(`sqlite://guild.sqlite`, { table: "settings" });
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
discordModals(client);
const newbutton = (buttondata) => {
  return {
    components: buttondata.map((data) => {
      return {
        custom_id: data.id,
        label: data.label,
        style: data.style || 1,
        url: data.url,
        emoji: data.emoji,
        disabled: data.disabled,
        type: 2,
      };
    }),
    type: 1,
  };
};
process.env.TZ = 'Asia/Tokyo'
"use strict";
let guildId

const commands = {}
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
app.use(express.static('public')); // publicフォルダ内の静的ファイルを提供します

http.createServer(function(request, response) {
  if (request.url === '/restart') {
    // ログアウト処理
    client.destroy();

    // ログイン処理
    client.login(process.env.DISCORD_BOT_TOKEN);

    response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
    response.end('Bot has been restarted.');
  } else {
    response.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    response.end(`
      <p>${client.user.tag} is ready!</p>
      <p>導入サーバー: ${client.guilds.cache.size}</p>
      <p>ユーザー: ${client.users.cache.size}</p>
      <button onclick="fetch('/restart').then(() => location.reload());">Restart</button>
    `);
  }
}).listen(3000);

for(const file of commandFiles){
  const command = require(`./commands/${file}`);
  commands[command.data.name] = command
}

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.error('tokenが設定されていません！')
  process.exit(0)
}
app.get('/home', (req, res) => {
  const filePath = path.join(__dirname, './', 'home.html');
  res.sendFile(filePath);
})

client.on('ready', async () => {
  client.user.setActivity(`滑り止め(1nd)`, {
    type: 'PLAYING'
  });
  const embed = new MessageEmbed()
  .setTitle("起動しました！")
  .setDescription(">>> ```diff\n+ Hello World!　　　　　``````diff\n+ 導入サーバー数:" + client.guilds.cache.size + "\n+ ユーザー数:" + client.users.cache.size + "```" + moment().format("YYYY-MM-DD HH:mm:ss"))
  .setThumbnail(client.user.displayAvatarURL())
  .setColor("RANDOM")
  client.channels.cache.get("1196400934033576067").send({ embeds: [ embed ] })
  const data = []
  for(const commandName in commands){
    data.push(commands[commandName].data)
  }
  await client.application.commands.set(data);
  client.user.setStatus("idle");
  console.log(`${client.user.tag} is ready!`);
});

client.on("messageCreate", async message => {
  if(message.author.id != "526620171658330112") return
  const receivedEmbed = message.embeds[0]
  const data = await db.get(message.guild.id)
  if(receivedEmbed && receivedEmbed.title && receivedEmbed.title.match(/待ち構えている...！/) && receivedEmbed.author){
    const zokusei = receivedEmbed.author.name.match(/\[(.*?)\]/g)[0]
    const rank = `【${receivedEmbed.author.name.split(":")[2].replace(" ","")}】`
    const name = receivedEmbed.title.split("\n")[0].replace("が待ち構えている...！","")
    const lv = receivedEmbed.title.split("\n")[1].replaceAll(",","").match(/^\D+(\d+)\D+(\d+)\D+(\d+)$/)[1]
    const image = receivedEmbed.image.url || undefined
    const attribute = receivedEmbed.author.iconURL
    //通知機構
    if(["【超激レア】","【最強】","【大地の覇者】","【原初】","【ありがとう！】","【天使】","【龍帝】","【三女神】"].includes(rank)){
      let m = ""
      let index
      const board = new MessageEmbed()
      .setColor("RANDOM")
      if(rank == "【超激レア】"){
        if(!data || !data[0][0] || !data[1][0]){
          board.setTitle("必要な情報が設定されてないから通知出来ないよ")
        }else{
          board.setTitle("超激レアだよ！")
          m = `<@&${data[1][0]}>メンションごめんね！超激レア発見！`
          index = 0
        }
      }else{
        if(!data || !data[0][1] || !data[1][1]){
          board.setTitle("必要な情報が設定されてないから通知出来ないよ")
        }else{
          board.setTitle("tohru枠だよ！")
          m = `<@&${data[1][1]}>メンションごめんね！tohru枠発見！`
          index = 1
        }
      }
      let msg
      let row
      if(m == ""){
        msg = await message.channel.send({ embeds: [ board ] })
      }else{
        const but1 = new MessageButton()
        const but2 = new MessageButton()
        const but3 = new MessageButton()
        but1
        .setLabel("轢き防止解除")
        .setStyle("SUCCESS")
        .setCustomId("remove")
        .setEmoji("🔓")
        but2
        .setLabel("通知")
        .setStyle("PRIMARY")
        .setCustomId(`mt`)
        .setEmoji("✅")
        but3
        .setLabel("通知しない")
        .setStyle("DANGER")
        .setCustomId("nomt")
        .setEmoji("❎")
        if(data[3] == true){
          message.channel.permissionOverwrites.edit(message.author, { VIEW_CHANNEL: false }).catch(console.error);
          but2.setDisabled(true)
          but3.setDisabled(true)
        }else{
          but1.setDisabled(true)
        }
        row = new MessageActionRow()
        .addComponents(but1,but2,but3)
        msg = await message.channel.send({ embeds: [ board ], components: [ row ] })
      }
      const embed = new MessageEmbed()
      .setAuthor(`属性: ${zokusei}`,attribute)
      .setDescription(`<#${message.channel.id}>で**${rank}${name}**が出現しました！\n\nLv.\`${Number(lv).toLocaleString()}\` HP \`${Number(lv*10+50).toLocaleString()}\`\n\n[**Direct Link**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
      .setFooter("User TAO")
      .setColor("RANDOM")
      if(image != undefined) embed.setThumbnail(image)
      client.on("interactionCreate", async interaction => {
        if(!interaction.isButton()){
          return;
        }
        if(interaction.message.id == msg.id && interaction.customId == "remove"){
          const tao = client.users.cache.get("526620171658330112")
          row.components[0].setDisabled(true)
          row.components[1].setDisabled(false)
          row.components[2].setDisabled(false)
          msg.edit({ embeds:[ board ], components: [ row ] });
          await interaction.deferUpdate();
          interaction.channel.permissionOverwrites.edit(tao, { VIEW_CHANNEL: true }).catch(console.error);
        }
        if(interaction.message.id == msg.id && interaction.customId == "mt"){
          const ch = client.channels.cache.get(data[0][index])
          const notify = await ch.send({ content: m, embeds: [ embed ] })
          const success = new MessageEmbed()
          .setTitle("通知完了")
          .setURL(`https://discord.com/channels/${notify.guild.id}/${notify.channel.id}/${notify.id}`)
          .setColor("RANDOM")
          interaction.message.edit({ embeds:[success], components:[ newbutton([ { id: "x", emoji: "🆗", style: 2, disabled: true } ]) ] })
        }
        if(interaction.message.id == msg.id && interaction.customId == "nomt"){
          interaction.message.delete()
        }
      })
    }
    //自動変更
    if(message.channel.topic == "auto:100"){
      const level = Math.floor(Number(lv) / 100) * 100
      if(message.channel.name.match(/lv+\d+$/)){
        const n = message.channel.name.match(/lv+(\d+)$/)
        if(n[1] == level){
          return;
        }
        const name = message.channel.name.replace(/lv+\d+$/,`lv${level}`)
        await message.channel.setName(name)
        return;
      }
      await message.channel.setName(`${message.channel.name}-lv${level}`)
    }else if(message.channel.topic == "auto:1000"){
      const level = Math.floor(Number(lv) / 1000) * 1000
      if(message.channel.name.match(/lv+\d+$/)){
        const n = message.channel.name.match(/lv+(\d+)$/)
        if(n[1] == level){
          return;
        }
        const name = message.channel.name.replace(/lv+\d+$/,`lv${level}`)
        await message.channel.setName(name)
        return;
      }
      await message.channel.setName(`${message.channel.name}-lv${level}`)
    }else if(message.channel.topic == "auto:10000"){
      const level = Math.floor(Number(lv) / 10000) * 10000
      if(message.channel.name.match(/lv+\d+$/)){
        const n = message.channel.name.match(/lv+(\d+)$/)
        if(n[1] == level){
          return;
        }
        const name = message.channel.name.replace(/lv+\d+$/,`lv${level}`)
        await message.channel.setName(name)
        return;
      }
      await message.channel.setName(`${message.channel.name}-lv${level}`)
    }
  }
})

client.on('messageUpdate', async (oldMessage, newMessage) => {
  const data = await db.get(newMessage.guild.id)
  const embed = newMessage.embeds[0]
  if(!data || !data[2][0] || !data[2][1]) return
  if(newMessage.author.id == "526620171658330112" && embed && embed.description && embed.description.match(/仲間になりたそうに/)){
    if(Number(embed.fields[1].value.replaceAll(">","").replaceAll("*","").replaceAll(" ","").replaceAll("%","")) >= data[2][1]){
      const emb = new MessageEmbed()
      .setTitle(`攻撃確率${embed.fields[1].value.replaceAll(">","").replaceAll("*","").replaceAll(" ","")}！`)
      .setFooter(`検知対象:${data[2][1]}%以上`)
      .setColor("RANDOM")
      newMessage.reply({ embeds: [ emb ] })
    }
  }
})

client.on("interactionCreate", async (interaction) => {
  if(!interaction.isCommand()){
    return;
  }
  const command = commands[interaction.commandName];
  try{
    await command.execute(interaction);
  }catch(error){
    console.error(error);
    await interaction.reply({
      content: '何らかのエラーが発生しました。\n管理者にお伝え下さい。',
      ephemeral: true,
    })
  }
});

client.on('error', (err) => {
  console.error("error")
})

client.login(process.env.DISCORD_BOT_TOKEN)

const { Client: Client2, Intents: Intents2, MessageEmbed: MessageEmbed2, Permissions } = require("discord.js");
const cron2 = require('node-cron');
const client2 = new Client2({
  partials: ["CHANNEL"],
  intents: [
    Intents2.FLAGS.GUILDS,
    Intents2.FLAGS.GUILD_MESSAGES,
  ],
});

client2.login(process.env.DISCORD_BOT_TOKEN2);

client2.on('ready', async () => {
  client2.user.setActivity(`サポート(2nd)`, {
    type: 'PLAYING'
  });

  console.log(`${client2.user.tag} (2nd bot) is ready!`);
});

client2.login(process.env.DISCORD_BOT_TOKEN2);