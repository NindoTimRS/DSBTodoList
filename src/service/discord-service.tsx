import {getToken} from "../components/auth/auth";

export class DiscordService{

    private apiPath: string = "http://localhost:6969/api/discord";

    async PostDiscordMessage (content: string) {
        const res = await fetch(this.apiPath, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`},
            body: JSON.stringify({content: content})
        });

        const text = await res.text();

        return {
            status: res.status,
            body: text,
        };

    }
}