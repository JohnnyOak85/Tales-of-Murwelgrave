import { Message } from 'discord.js';
import { readdirSync } from 'fs-extra';
import { CollectionFactory } from './collection.factory';
import { PREFIX } from '../config.json';

const commands = new CollectionFactory<{
  description: string;
  execute: (message: Message, args?: string[]) => void;
  game: boolean;
  moderation: boolean;
  name: string;
  usage: string;
}>();

export const setCommands = () => {
  try {
    const commandList = readdirSync(`${__dirname}/../commands`);

    for (const command of commandList) {
      const commandFile = require(`../commands/${command}`);
      commands.addItem(commandFile.name, commandFile);
    }
  } catch (error) {
    throw error;
  }
};

export const executeCommand = (message: Message) => {
  try {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const command = commands.getItem(args.shift()?.toLowerCase() || '');

    if (
      !message.content.startsWith(PREFIX) ||
      message.content[1] === PREFIX ||
      message.content.length === 1 ||
      !command
    )
      return;

    command.execute(message, args);
  } catch (error) {
    message.channel.send('There was an error trying to execute that command!');
  }
};

export const getCommandsDescription = (verified: boolean) => {
  const reply = ['List of commands:'];

  for (const command of commands.getList()) {
    if (!verified && command.moderation) continue;

    reply.push(` * ${PREFIX}${command.name}`);
  }

  reply.push(
    `You can send \`${PREFIX}help [command name]\` to get info on a specific command!`
  );

  return reply.join('\n');
};

export const getCommandDescription = (name: string, verified: boolean) => {
  const command = commands.getItem(name);

  if (!verified) return 'You have no access to this command.';
  if (!command) return 'That command does not exist.';

  const reply = [`**Name:** ${command.name}`];
  reply.push(`**Description:** ${command.description}`);
  reply.push(`**Usage:** ${PREFIX}${command.name} ${command.usage}`);

  return reply.join('\n');
};