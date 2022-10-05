import { TextChannel } from "discord.js";
import { checkCache, getValue } from "../storage/cache"
import { getLog } from "./logger";
import { buildList } from "./text";

const getGameStatus = async () => {
    const isRunning = await getValue('is-running');
 
    return `Game is ${isRunning ? '' : 'not '}running`;
}

export const getStatus = async (channel: TextChannel) => {
    const isOpen = checkCache();    
    const log = getLog();
    const status = ['Tales of Murwelgrave'];

    status.push(`Database is ${isOpen ? '' : 'not '}ready`);
    
    if (isOpen) {
        status.push(await getGameStatus());
    }
    
    channel.send(buildList(status));
    channel.send(`\`\`\`${log.join('\n')}\`\`\``);

    return;
}