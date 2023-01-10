import { ChannelType, Message } from 'discord.js';
import { logError } from '../tools/logger';
import { writeFileSync } from 'fs';

module.exports = {
    name: 'collect',
    description: 'Collect players attributes',
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (
                !message.member?.permissions.has('Administrator') ||
                message.channel.type !== ChannelType.GuildText
            )
                return;

            let messages;
            const wins = [];

            do {
                if (messages?.first()) {
                    messages = await message.channel.messages.fetch({
                        before: messages.last()?.id
                    });
                } else {
                    messages = await message.channel.messages.fetch();
                }

                console.log(messages.last()?.content);

                wins.push(
                    messages.map(message => {
                        if (message.content.includes('wins!')) {
                            wins.push(message.content);
                        }
                    })
                );
            } while (messages.size >= 2);

            writeFileSync(
                './wins.json',
                JSON.stringify(wins.filter(str => typeof str === 'string'))
            );
        } catch (error) {
            logError(error, 'command -> wipe');
        }
    }
};
