import {TaskItem} from "../Model/TaskItem";

export class SubTaskService {
    private apiPath = "http://localhost:6969/api/subtask";
    async PostSubTaskItem(body: string): Promise<string> {
        return await fetch(this.apiPath, {method: "POST", body: body})
            .then(res => res.text())
    }

    async PutSubTaskItem(taskId: string, body: string): Promise<string> {
        return await fetch(`${this.apiPath}/${taskId}`, {method: "PUT", body: body})
            .then(res => res.text())
    }
    async DeleteSubTaskItem(taskId: string): Promise<string> {
        return await fetch(`${this.apiPath}/${taskId}`, {method: "DELETE"})
            .then(res => res.text())
    }

    async PatchSubTaskItem(taskId: number, body: string): Promise<string> {
        return await fetch(`${this.apiPath}/${taskId}`, {method: "PATCH", body: body})
            .then(res => res.text())
    }
}