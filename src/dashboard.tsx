import {StateUpdater, useEffect, useState} from "preact/hooks";
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
    const [search, setSearch] = useState<string>('');

    const handleOpenEdit = (taskItem?: TaskItem) => {
        if (openEdit === null)
            setOpenEdit(true);
        else
            setOpenEdit(!openEdit);
        if (taskItem) {
            setTaskItem(taskItem);
        }
    }

    return (
        <div>
            <Header onSearch={(searchInput: string) => setSearch(searchInput)} />
            <ColumnData reload={reload} onEdit={(taskItem: TaskItem) => handleOpenEdit(taskItem)} search={search}></ColumnData>
            <AddTaskPopup onPost={() => setReload(!reload)}></AddTaskPopup>
            <EditTaskPopup onPut={() => setReload(!reload)} taskItem={taskItem!} openEdit={openEdit}></EditTaskPopup>
        </div>
    );
};
export default Dashboard;