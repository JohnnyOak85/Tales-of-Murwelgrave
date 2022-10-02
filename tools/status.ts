import { TextChannel } from "discord.js";
import { getValue } from "../storage/cache"
import { getLog } from "./logger";

export const getStatus = async (channel: TextChannel) => {
    const isRunning = await getValue('is-running');
    const log = getLog();

    channel.send(`Game is ${isRunning ? '' : 'not '}running`);
    channel.send(`\`\`\`${log.join('\n')}\`\`\``);

    return;
}