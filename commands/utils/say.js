const cmd = require('discord.js-commando');
const discord = require('discord.js');
const path = require('path');

module.exports = class Say extends cmd.Command {
    constructor(client) {
        super(client, {
            name: 'say',
            group: 'utils',
            memberName: 'say',
            description: "指定した場所にメッセージを送信。",
            examples: ['!say "メッセージ" #一般'],
            args: [
                {
                    key: 'message',
                    prompt: '送信するメッセージを入力してください。',
                    type: 'string',
                    validate: message => {
                        if (message.length < 2001 && message.length > 0) return true;
                        return 'メッセージは1~2000文字にしてください。';
                    }
                },
                {
                    key: 'channel',
                    prompt: '送信したいチャンネルを入力してください。',
                    type: 'channel'
                }
            ]
        });
    }
    
    run(msg, {message, channel}) {
        channel.send(message)
    }
};