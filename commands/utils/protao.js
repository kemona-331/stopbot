const cmd = require('discord.js-commando');
const discord = require('discord.js');
const path = require('path');

module.exports = class Protao extends cmd.Command {
    constructor(client) {
        super(client, {
            name: 'protao',
            group: 'utils',
            memberName: 'protao',
            description: "TAOのオリ敵作成ジェネレータ。(全部)",
            examples: ['!tao "属性" "ランク" "名前" "レベル" "HP" "素早さ" "https://gazou.src"'],
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
                    key: 'rank',
                    prompt: 'ランクを入力してください。',
                    type: 'string',
                    validate: rank => {
                        if (rank.length < 11 && rank.length > 0) return true;
                        return '属性は1~10文字にしてください。';
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
                    key: 'level',
                    prompt: 'レベルを入力してください。',
                    type: 'integer' 
                },
                {
                    key: 'HP',
                    prompt: 'HPを入力してください。',
                    type: 'integer' 
                },
                {
                    key: 'agility',
                    prompt: '素早さを入力してください。',
                    type: 'integer',
                  　validate: agility => {
                        if (agility >= 0 && agility <= 1000) return true;
                        return '素早さは0~1000にしてください。';
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
    
    run(msg, {attribute , rank , name , level , HP , agility , image}) {
        var emb = new discord.RichEmbed()
            .setTitle("属性:[" + attribute + "] ランク:【" + rank + "】\n" + name + "が待ち構えている...!\nLv." + level + "  HP: " + HP + " 素早さ: " + agility)
            .setColor("RANDOM")
            .setImage(image);
        msg.channel.send(emb)
    }
};