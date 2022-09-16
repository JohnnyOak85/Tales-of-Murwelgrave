import { ColorResolvable, MessageEmbed } from 'discord.js';

interface Embed {
    color?: ColorResolvable;
    description?: string;
    title: string;
    thumb?: string | null;
    url?: string;
}

export const buildEmbed = (embed: Embed) =>
    new MessageEmbed()
        .setColor(embed.color || 'DEFAULT')
        .setDescription(embed.description || '')
        .setTitle(embed.title || '')
        .setThumbnail(embed.thumb || '')
        .setURL(embed.url || '');
