import {TaskItem} from "../Model/TaskItem";
import {getToken} from "../components/auth/auth";

export class TaskService{
    private apiPath = "http://localhost:6969/api/task";

    async GetAllTaskItem(): Promise<TaskItem[] | null> {
        return await fetch(this.apiPath, {method: "GET", headers: {Authorization: `Bearer ${getToken()}`,}})
            .then(res => res.json())
            .then(res => {return res as TaskItem[]})
    }

    async GetTaskItemById(taskId: string | number): Promise<TaskItem | string> {
        try {
            return await fetch(`${this.apiPath}/${taskId}`, {method: "GET", headers: {Authorization: `Bearer ${getToken()}`,}})
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.status.toString());
                    }
                    res.json();
                })
                .then(res => {return res as unknown as TaskItem});
        } catch (error) {
            return error.message;
        }
    }

    async PostTaskItem(body: string): Promise<string> {
        return await fetch(this.apiPath, {method: "POST", headers: {Authorization: `Bearer ${getToken()}`,}, body: body})
            .then(res => res.text())
    }

    async PutTaskItem(taskId: string | number, body: string): Promise<string> {
        return await fetch(`${this.apiPath}/${taskId}`, {method: "PUT", headers: {Authorization: `Bearer ${getToken()}`,}, body: body})
            .then(res => res.text())
    }
    async DeleteTaskItem(taskId: string | number): Promise<string> {
        return await fetch(`${this.apiPath}/${taskId}`, {method: "DELETE", headers: {Authorization: `Bearer ${getToken()}`,}})
            .then(res => res.text())
    }
    async PatchTaskItem(taskId: string | number, body: string): Promise<string> {
        return await fetch(`${this.apiPath}/${taskId}`, {method: "PATCH", headers: {Authorization: `Bearer ${getToken()}`,}, body: body})
            .then(res => res.text())
    }
}