import { ChannelType, GuildMember, Message, TextChannel } from 'discord.js';
import { checkWord } from './raffle';
import { checkRepeats, getBool } from '../tools/utils';
import { executeCommand } from '../tools/commands';
import { EVENTS_CHANNEL } from '../config';
import { ensurePlayer } from './player';
import { buildEmbed } from '../tools/embed';
import { hasRoles } from '../tools/member';
import { saveDoc } from '../tools/database';
import { LEVEL_CONTROL, LUCK_CAP } from '../configurations/main.config';
import { logError } from '../tools/logger';

const incrementMessages = async (wonRaffle: boolean, member: GuildMember, channel: TextChannel) => {
    const player = await ensurePlayer(member.guild.id, member.id);
    let luckBoost = 0;

    if (player.luck >= LUCK_CAP || !hasRoles(member) || player.level >= LEVEL_CONTROL) {
        return;
    }

    player.level = player.level || 1;
    player.messages = (player.messages || 0) + 1;

    if (wonRaffle) {
        luckBoost = luckBoost + 1;
    }

    if (
        player.messages.toString().length > 2 &&
        checkRepeats(player.messages.toString()) &&
        getBool()
    ) {
        luckBoost = luckBoost + 1;
    }

    player.luck = player.luck + luckBoost;

    if (luckBoost) {
        const embed = buildEmbed({
            description: `<@${player.id}>\n**+${luckBoost} luck!**`,
            title: 'You just won the daily raffle!'
        });

        channel.send({ embeds: [embed] });
    }

    saveDoc(player, member.guild.id, member.id);
};

export const clearMessage = (list: Message[], id: string) => {
    const message = list.find(message => message.id === id);
    message?.delete();
};

const checkPlayer = async (message: Message) => {
    const channel = await message.guild?.channels.fetch(EVENTS_CHANNEL);

    if (channel?.type !== 'GUILD_TEXT' || !message.member) return;

    incrementMessages(checkWord(message.content.split(' ')), message.member, channel);
};

export const checkIncomingMessage = async (message: Message) => {
    if (message.channel.type === ChannelType.DM || message.author.bot || !message.guild) {
        return;
    }

    try {
        checkPlayer(message);
        executeCommand(message);
    } catch (error) {
        logError(error);
    }
};
