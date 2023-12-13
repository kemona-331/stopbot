const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Pagination } = require("discordjs-button-embed-pagination");
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});

module.exports = {
  data: {
    name: "info",
    description: "コマンド一覧を表示します",
  },
  async execute(interaction) {
    const embeds = [
      new MessageEmbed()
      .setTitle("Info:")
      .setDescription("開発者陣の情報です")
      .addField("開発者",`\`\`\`fix\n${client.users.cache.get("759001587422462015").username}\`\`\``)
      .addField("スペシャルサンクス",`\`\`\`fix\nanijaaa様,TAO#0042様,${interaction.user.username}様含むユーザーの皆様\`\`\``)
      .setAuthor(`コマンド実行者:${interaction.user.tag}`, interaction.user.displayAvatarURL())
      .setColor("RANDOM"),
      new MessageEmbed()
      .setTitle("Info:")
      .setDescription("Botの情報です。")
      .addField("サーバー数",`${client.guilds.cache.size}`,true)
      .addField("チャンネル数",`${client.channels.cache.size}\n(<:text:1183428945383800862>:${client.channels.cache.filter(c => c.type == 'GUILD_TEXT').size},<:voice:1183428937846620260>:${client.channels.cache.filter(c => c.type == 'GUILD_VOICE').size},<:stage:1183428931257376868>:${client.channels.cache.filter(c => c.type == 'GUILD_NEWS').size},<:category:1183428951125794916>:${client.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size})`,true)
      .addField("ユーザー数",`${client.users.cache.size}\n(<:member:1183428924508733532>:${client.users.cache.filter((u) => !u.bot).size},<:bot:1183428917722349648>:${client.users.cache.filter((u) => u.bot).size})`,true)
      .addField("開発言語","```fix\nJavaScript```",true)
      .addField("Discord.js ver","```js\nver.13.16.0```",true)
      .addField("Ping",`\`\`\`fix\n${client.ws.ping}ms\`\`\``,true)
      .addField("Botの招待",`[こちら](https://discord.com/api/oauth2/authorize?client_id=886497516420489268&permissions=3632208&scope=bot+applications.commands)`,true)
      .addField("サポートサーバー",`[こちら](https://discord.gg/MWv82VXm3T)`,true)
      .setAuthor(`コマンド実行者:${interaction.user.tag}`, interaction.user.displayAvatarURL())
      .setColor("RANDOM")
    ]
    await new Pagination(interaction.channel, embeds, "page").paginate();
  }
}

client.login(process.env.DISCORD_BOT_TOKEN)