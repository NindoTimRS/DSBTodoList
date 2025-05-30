import {useEffect, useState} from "preact/hooks";
import ColumnData from "./column-container"
import Header from "./header";
import AddTaskPopup from "./add-popups/add-task-popup";
import EditTaskPopup from "./edit-popups/edit-task-popup";
import AddSubTaskPopup from "./add-popups/add-subtask-popup"
import {TaskItem} from "../Model/TaskItem";
import {TaskService} from "../service/task-service";




const Dashboard = () => {

    const [reload, setReload] = useState(false);
    const [openEdit, setOpenEdit] = useState<boolean | null>(null);
    const [editTaskItem, setEditTaskItem] = useState<TaskItem>();
    const [addSubId, setAddSubId] = useState<number>(0);
    const [openSubAdd, setOpenSubAdd] = useState<boolean | null>(null);
    const [search, setSearch] = useState<string>('');

    const handleOpenSubAdd = (taskId?: number) => {
        if (openSubAdd === null)
            setOpenSubAdd(true);
        else
            setOpenSubAdd(!openEdit);
        if (taskId) {
            setAddSubId(taskId);
        }
    }

    const handleOpenEdit = (taskItem?: TaskItem) => {
        if (openEdit === null)
            setOpenEdit(true);
        else
            setOpenEdit(!openEdit);
        if (taskItem) {
            setEditTaskItem(taskItem);
        }
    }

    useEffect( () => {
        const newUrl = new URL(window.location.href);
        const taskId = newUrl.searchParams.get("taskid");
        if(taskId) {
            const fetchData = async () => {
                const service = new TaskService();
                const task: TaskItem = await service.GetTaskItemById(taskId);
                const singleTask: TaskItem = task[0];
                handleOpenEdit(singleTask)
            }

            fetchData();

        }

    }, []);

    return (
        <div>
            <Header onSearch={(searchInput: string) => setSearch(searchInput)} />
            <ColumnData reload={reload} onEdit={(taskItem: TaskItem) => handleOpenEdit(taskItem)} search={search}></ColumnData>
            <AddTaskPopup onPost={() => setReload(!reload)}></AddTaskPopup>
            <EditTaskPopup onPut={() => setReload(!reload)} taskItem={editTaskItem!} openEdit={openEdit} onSubAdd={(taskId: number) => handleOpenSubAdd(taskId)}></EditTaskPopup>
            <AddSubTaskPopup taskId={addSubId} openSubAdd={openSubAdd}></AddSubTaskPopup>

        </div>
    );
};
export default Dashboard;