import {useEffect, useState} from "preact/hooks";
import ColumnData from "./column-container"
import Header from "./header";
import AddTaskPopup from "./add-task-popup";
import EditTaskPopup from "./edit-task-popup";
import {TaskItem} from "./Model/TaskItem";
import {TaskService} from "./service/task-service";

const Dashboard = () => {

    const [reload, setReload] = useState(false);
    const [openEdit, setOpenEdit] = useState<boolean | null>(null);
    const [taskItem, setTaskItem] = useState<TaskItem>();
    const [taskId, setTaskId] = useState<string | null>(null);

    const handleOpenEdit = (taskItem: TaskItem) => {
        if (openEdit === null)
            setOpenEdit(true);
        else
            setOpenEdit(!openEdit);
        setTaskItem(taskItem);
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const taskId = params.get("taskid");
        setTaskId(taskId)
    }, []);

    return (
        <div>
            <Header/>
            <ColumnData reload={reload} onEdit={(taskItem: TaskItem) => handleOpenEdit(taskItem)} ></ColumnData>
            <AddTaskPopup onPost={() => setReload(!reload)}></AddTaskPopup>
            <EditTaskPopup onPut={() => setReload(!reload)} taskItem={taskItem!} openEdit={openEdit} taskId={taskId}></EditTaskPopup>


        </div>
    );
};
export default Dashboard;