import {getToken} from "../components/auth/auth";
import {DiscordWebhook} from "../Model/DiscordWebhook";

export class DiscordService{

    private apiPath: string = "http://localhost:6969/api/discord";

    async PostDiscordMessage (body: string) {
        const res = await fetch(this.apiPath, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`},
            body: body
        });

        const text = await res.text();

        return {
            status: res.status,
            body: text,
        };

    }
}