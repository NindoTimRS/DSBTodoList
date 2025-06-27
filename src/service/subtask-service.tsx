import {getToken} from "../components/auth/auth";

export class SubTaskService {
    private apiPath = "http://localhost:6969/api/subtask";
    async PostSubTaskItem(body: string): Promise<string> {
        return await fetch(this.apiPath, {method: "POST", headers: {Authorization: `Bearer ${getToken()}`}, body: body})
            .then(res => res.text())
    }

    async PutSubTaskItem(taskId: string, body: string): Promise<string> {
        return await fetch(`${this.apiPath}/${taskId}`, {method: "PUT", headers: {Authorization: `Bearer ${getToken()}`,}, body: body})
            .then(res => res.text())
    }
    async DeleteSubTaskItem(taskId: string) {
        const res = await fetch(`${this.apiPath}/${taskId}`, {method: "DELETE", headers: {Authorization: `Bearer ${getToken()}`,}})
        const text = await res.text();
        return {status: res.status, body: text,};
    }

    async PatchSubTaskItem(taskId: number | string, body: string) {
        const res = await fetch(`${this.apiPath}/${taskId}`, {method: "PATCH", headers: {Authorization: `Bearer ${getToken()}`,}, body: body})
        const text = await res.text();
        return {status: res.status, body: text,};
    }
}