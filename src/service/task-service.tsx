import {TaskItem} from "../Model/TaskItem";
import {getToken} from "../auth";

export class TaskService{
    private apiPath = "http://localhost:6969/api/task";

    async GetAllTaskItem(): Promise<TaskItem[] | null> {
        return await fetch(this.apiPath, {method: "GET", headers: {Authorization: `Bearer ${getToken()}`,}})
            .then(res => res.json())
            .then(res => {return res as TaskItem[]})
    }

    async GetTaskItemById(taskId: string): Promise<TaskItem | null> {
        return await fetch(`${this.apiPath}/${taskId}`, {method: "GET", headers: {Authorization: `Bearer ${getToken()}`,}})
            .then(res => res.json())
            .then(res => {return res as TaskItem});
    }

    async PostTaskItem(body: string): Promise<string> {
        return await fetch(this.apiPath, {method: "POST", headers: {Authorization: `Bearer ${getToken()}`,}, body: body})
            .then(res => res.text())
    }

    async PutTaskItem(taskId: string, body: string): Promise<string> {
        return await fetch(`${this.apiPath}/${taskId}`, {method: "PUT", headers: {Authorization: `Bearer ${getToken()}`,}, body: body})
            .then(res => res.text())
    }
    async DeleteTaskItem(taskId: string): Promise<string> {
        return await fetch(`${this.apiPath}/${taskId}`, {method: "DELETE", headers: {Authorization: `Bearer ${getToken()}`,}})
            .then(res => res.text())
    }
    async PatchTaskItem(taskId: number, body: string): Promise<string> {
        return await fetch(`${this.apiPath}/${taskId}`, {method: "PATCH", headers: {Authorization: `Bearer ${getToken()}`,}, body: body})
            .then(res => res.text())
    }
}