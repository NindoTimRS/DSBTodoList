import {SubTaskItem} from "./SubTaskItem";

export interface TaskItem {
    task_id: number;
    status: 'ToDo' | 'InProgress' | 'Done';
    title: string;
    description: string;
    deadline: string;
    importance: string;
    repeat: boolean;
    interval: number;
    assignment: string;
    subTasks: SubTaskItem[];
}