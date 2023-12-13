const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});
const Keyv = require('keyv');
const db = new Keyv(`sqlite://guild.sqlite`, { table: "settings" });
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

module.exports = {
  data: {
    name: "check",
    description: "登録された情報を表示します",
  },
  async execute(interaction) {
    let data = await db.get(interaction.guild.id)
    if(!data){
      data = [[undefined,undefined],[undefined,undefined],[false,undefined],false]
      await db.set(interaction.guild.id,data)
    }
    const embed = new MessageEmbed()
    .setTitle("設定状況:")
    .addField(`= 超激通知用ch/role =`,`>>> ${data[0][0] != undefined ? "<#" + data[0][0] + ">" : "未設定"} / ${data[1][0] != undefined ? "<@&" + data[1][0] + ">" : "未設定"}`)
    .addField(`= tohru枠通知用ch/role =`,`>>> ${data[0][1] != undefined ? "<#" + data[0][1] + ">" : "未設定"} / ${data[1][1] != undefined ? "<@&" + data[1][1] + ">" : "未設定"}`)
    .addField(`= PET厳選機能 =`,`>>> ${data[2][0] != undefined ? data[2][0] : "未設定"} / ${data[2][1] != undefined ? data[2][1] + "%以上" : "未設定"}`)
    .addField(`= 轢き殺し防止 =`,`>>> ${data[3] ?? "未設定"}`)
    .setColor("RANDOM")
    interaction.reply({ embeds: [ embed ] })
  }
}

client.login(process.env.DISCORD_BOT_TOKEN)