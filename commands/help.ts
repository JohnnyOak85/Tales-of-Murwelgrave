import { Message } from 'discord.js';
import { getCommandDescription, getCommandsDescription } from '../tools/commands';
import { logError } from '../tools/logger';

module.exports = {
    name: 'help',
    description:
        'Displays the list of commands. It can also display information on a given command.',
    usage: '<command>',
    execute: async (message: Message, args: string[]) => {
        try {
            const isVerified = message.member?.permissions.has('ManageRoles') || false;

            args.length
                ? message.channel.send(getCommandDescription(args[0].toLowerCase(), isVerified))
                : message.channel.send(getCommandsDescription(isVerified));
        } catch (error) {
            logError(error);
        }
    }
};
