const cmd = require('discord.js-commando');
const discord = require('discord.js');
const path = require('path');

module.exports = class Tao extends cmd.Command {
    constructor(client) {
        super(client, {
            name: 'tao',
            group: 'utils',
            memberName: 'tao',
            description: "TAOのオリ敵作成ジェネレータ。",
            examples: ['!tao "属性" "名前" "https://gazou.src"'],
            args: [
                {
                    key: 'attribute',
                    prompt: '属性を入力してください。',
                    type: 'string',
                    validate: attribute => {
                        if (attribute.length < 31 && attribute.length > 0) return true;
                        return '属性は1~30文字にしてください。';
                    }
                },
                {
                    key: 'name',
                    prompt: '名前を入力してください。',
                    type: 'string',
                    validate: name => {
                        if (name.length < 31 && name.length > 0) return true;
                        return '名前は1~30文字にしてください。';
                    }
                },
                {
                    key: 'image',
                    prompt: '敵の画像アドレスを送信してください。',
                    type: 'string',
                    validate: image_url => {
                        if (image_url.startsWith("https://")) return true;
                        return '有効なアドレスを入力してください。';
                    }
                }
            ]
        });
    }
    
    run(msg, {attribute, name , image}) {
        var emb = new discord.RichEmbed()
            .setTitle("属性:[" + attribute + "] ランク:【通常】\n" + name + "が待ち構えている...!\nLv.???  HP: ??? 素早さ: 100")
            .setColor("RANDOM")
            .setImage(image);
        msg.channel.send(emb)
    }
};