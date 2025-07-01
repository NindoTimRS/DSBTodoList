export interface DiscordWebhook {
    content: string;
    embeds: Embed[];
}

export interface Embed {
    title: string;
    url: string;
    description: string;
    color: number;
    fields: Field[];

}

export interface Field {
    name: string;
    value: string;
    inline: boolean;
}