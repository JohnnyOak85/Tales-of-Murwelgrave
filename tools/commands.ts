import { Message } from "discord.js";
import { readdirSync } from 'fs';
import { CHANNEL_ID } from "../config";
import { Command } from "../interfaces";
import { Collector } from "./collector";
import { logError } from "./logger";

const commands = new Collector<Command>();

const getCommandNames = () => commands.getList().map(command => command.name);

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
        if (message.channelId !== CHANNEL_ID) return;

        const prefix = message.content.trim().split(/ +/g)[0].toLowerCase();
        const commandNames = getCommandNames();

        if (!commandNames.includes(prefix)) return;

        const command = commands.getItem(prefix);

        if (!command) return;

        command.execute(message);
    } catch (error) {
        message.channel.send('There was an error trying to execute that command!');
        logError(error, 'executeCommand');
    }
};