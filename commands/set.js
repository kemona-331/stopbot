const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});
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
    name: "set",
    description: "通知などに関する情報を設定します",
    options: [
      {
        type: "ROLE",
        name: "超激通知",
        description: "超激の通知に使用するロールを選択",
      },
      {
        type: "ROLE",
        name: "tohru枠通知",
        description: "tohru枠の通知に使用するロールを選択",
      },
      {
        type: "BOOLEAN",
        name: "轢き殺し防止",
        description: "轢き殺し防止のON/OFFを切り替えます",
      },
      {
        type: "STRING",
        name: "概要",
        description: "パネルの概要",
      }
    ],
  },
  async execute(interaction) {
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "サーバー管理者しか使えません", ephemeral: true })
    const role = interaction.options.getRole("ロール");
    let title = interaction.options.getString("タイトル"),
        description = interaction.options.getString("概要")
    if(interaction.guild.me.roles.highest.comparePositionTo(role) <= 0) return interaction.reply({ content: "ロール順位が不適切です\nBOTの最高位のロール順位を上げてください\nhttps://media.discordapp.net/attachments/950018540424032297/1182244544360763462/exvh5-r5cvs.gif?ex=6583fe08&is=65718908&hm=0f6d4e84905ecb3eea6f2f4c2459eb89f456d8b55601af85320facc47edff675&=&width=468&height=388", ephemeral: true }) 
    if(title == null) title = "認証パネル"
    if(description == null) description = "下のボタンを押して認証してください"
    const embed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor("RANDOM")
    interaction.reply({ embeds: [ embed ], components: [ newbutton([ { id: `verify-${role.id}`, emoji: "✅" } ]) ] })
  }
}

client.login(process.env.DISCORD_BOT_TOKEN)