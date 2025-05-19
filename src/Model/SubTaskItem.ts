export interface SubTaskItem {
    subTaskId: number;
    taskId: number;
    status: 'ToDo' | 'InProgress' | 'Done';
    title: string;
    description: string;
    deadline: string;
    importance: string;
    assignment: string;
}