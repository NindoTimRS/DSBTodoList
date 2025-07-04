import {useEffect, useState} from "preact/hooks";
import ColumnData from "./column-container"
import Header from "./header";
import AddTaskPopup from "./add-popups/add-task-popup";
import EditTaskPopup from "./edit-popups/edit-task-popup";
import EditSubTaskPopup from "./edit-popups/edit-subtask-popup";
import AddSubTaskPopup from "./add-popups/add-subtask-popup"
import {TaskItem} from "../Model/TaskItem";
import {TaskService} from "../service/task-service";
import EditTaskPopup404 from "./edit-popups/404-edit-task-popup";
import {SubTaskItem} from "../Model/SubTaskItem";
import ToastElement from "./toast-element";
import {Toast} from "../Model/toast";




const Dashboard = () => {
    const [toast, setToast] = useState<Toast | null>(null);
    const [reload, setReload] = useState(false);
    const [openEdit, setOpenEdit] = useState<boolean | null>(null);
    const [open404, setOpen404] = useState<boolean | null>(null);
    const [editTaskItem, setEditTaskItem] = useState<TaskItem>();
    const [addSubId, setAddSubId] = useState<number>(0);
    const [openSubAdd, setOpenSubAdd] = useState<boolean | null>(null);
    const [editSubTaskItem, setEditSubTaskItem] = useState<SubTaskItem>();
    const [openSubEdit, setOpenSubEdit] = useState<boolean | null>(null);
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

    const handleOpenSubEdit = (subTaskItem?: SubTaskItem) => {
        if (openSubEdit === null)
            setOpenSubEdit(true);
        else
            setOpenSubEdit(!openEdit);
        if (subTaskItem) {
            setEditSubTaskItem(subTaskItem);
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
                const task: TaskItem | string = await service.GetTaskItemById(taskId);
                if ( typeof task === "string" ){
                    if (open404 === null)
                        setOpen404(true);
                    else
                        setOpen404(!open404);
                } else {
                    const singleTask: TaskItem = task[0];
                    handleOpenEdit(singleTask)
                }

            }

            fetchData();

        }

    }, []);

    return (
        <div>
            <Header onSearch={(searchInput: string) => setSearch(searchInput)} />
            <ColumnData onToast={(toast: Toast) => setToast(toast)} onPut={() => setReload(!reload)} reload={reload} onEdit={(taskItem: TaskItem) => handleOpenEdit(taskItem)} search={search}></ColumnData>
            <AddTaskPopup onPost={() => setReload(!reload)}></AddTaskPopup>
            <EditTaskPopup onToast={(toast: Toast) => setToast(toast)} onPut={() => setReload(!reload)} taskItem={editTaskItem!} openEdit={openEdit}
                           onSubAdd={(taskId: number) => handleOpenSubAdd(taskId)} onSubEdit={(subTaskItem: SubTaskItem) => handleOpenSubEdit(subTaskItem)}></EditTaskPopup>
            <EditTaskPopup404 open404={open404}></EditTaskPopup404>
            <AddSubTaskPopup taskId={addSubId} openSubAdd={openSubAdd}></AddSubTaskPopup>
            <EditSubTaskPopup onToast={(toast: Toast) => setToast(toast)} subTaskItem={editSubTaskItem!} openSubEdit={openSubEdit}></EditSubTaskPopup>
            <ToastElement toast={toast} />

        </div>
    );
};
export default Dashboard;