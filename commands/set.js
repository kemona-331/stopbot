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
    name: "set",
    description: "通知などに関する情報を設定します",
    options: [
      {
        type: "CHANNEL",
        name: "超激通知channel",
        description: "超激の通知に使用するチャンネルを選択",
        channel_types: [0],
      },
      {
        type: "CHANNEL",
        name: "tohru枠通知channel",
        description: "tohru枠の通知に使用するチャンネルを選択",
        channel_types: [0],
      },
      {
        type: "ROLE",
        name: "超激通知role",
        description: "超激の通知に使用するロールを選択",
      },
      {
        type: "ROLE",
        name: "tohru枠通知role",
        description: "tohru枠の通知に使用するロールを選択",
      },
      {
        type: "BOOLEAN",
        name: "ペット厳選用",
        description: "pet",
      },
      {
        type: "ROLE",
        name: "tohru枠通知role",
        description: "tohru枠の通知に使用するロールを選択",
      },
      {
        type: "BOOLEAN",
        name: "轢き殺し防止",
        description: "轢き殺し防止のON/OFFを切り替えます",
      },
    ],
  },
  async execute(interaction) {
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "サーバー管理者しか使えません", ephemeral: true })
    const ch1 = interaction.options.getChannel("超激通知ch");
    const ch2 = interaction.options.getChannel("超激通知ch");
    const role1 = interaction.options.getRole("超激通知role");
    const role2 = interaction.options.getRole("tohru枠通知role");
    const role3 = interaction.options.getBoolean("轢き殺し防止");
    console.log(role1,role2,role3,ch1,ch2)
  }
}

client.login(process.env.DISCORD_BOT_TOKEN)