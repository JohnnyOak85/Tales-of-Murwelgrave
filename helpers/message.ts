import { GuildMember, Message, TextChannel } from 'discord.js';
import { checkWord } from './raffle';
import { checkRepeats, getBool, logError } from '../tools/utils';
import { executeCommand } from '../tools/commands';
import { EVENTS_CHANNEL } from '../config';
import { getPlayer } from './player';
import { buildEmbed } from '../tools/embed';
import { levelUp } from './rank';
import { filterRoles } from '../tools/member';

const incrementMessages = async (
  wonRaffle: boolean,
  player: GuildMember,
  channel: TextChannel
) => {
  const doc = await getPlayer(player.guild.id, player.id);
  let luckBoost = 0;

  if (!doc || !filterRoles(player).length || doc.level >= 50) return;

  doc.level = doc.level || 1;
  doc.messages = (doc.messages || 1) + 1;

  if (wonRaffle) {
    luckBoost = luckBoost + 1;
  }

  if (
    doc.messages.toString().length > 2 &&
    checkRepeats(doc.messages.toString()) &&
    getBool()
  ) {
    luckBoost = luckBoost + 1;
  }

  doc.luck = doc.luck + luckBoost;

  if (luckBoost) {
    const embed = buildEmbed({
      description: `<@${doc.id}>\n**+${luckBoost} luck!**`,
      title: 'You just won the daily raffle!',
    });

    channel.send({ embeds: [embed] });
  }

  levelUp(doc, channel, doc.messages, '');
};

export const clearMessage = (list: Message[], id: string) => {
  const message = list.find((m) => m.id === id);
  message?.delete();
};

export const checkIncomingMessage = async (message: Message) => {
  if (message.channel.type === 'DM' || message.author.bot || !message.guild)
    return;

  try {
    const channel = await message.guild.channels.fetch(EVENTS_CHANNEL);

    if (channel?.type !== 'GUILD_TEXT' || !message.member) return;

    incrementMessages(
      checkWord(message.content.split(' ')),
      message.member,
      channel
    );

    executeCommand(message);
  } catch (error) {
    logError(error);
  }
};
