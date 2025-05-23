import { useState } from "preact/hooks";
import ColumnData from "./column-container"
import Header from "./header";
import AddTaskPopup from "./add-task-popup";
import EditTaskPopup from "./edit-task-popup";
import {TaskItem} from "./Model/TaskItem";

const Dashboard = () => {

    const [reload, setReload] = useState(false);
    return (
        <div>
            <Header/>
            <ColumnData reload={reload} ></ColumnData>
            <AddTaskPopup onPost={() => setReload(!reload)}></AddTaskPopup>
            <EditTaskPopup onPut={() => setReload(!reload)}></EditTaskPopup>


        </div>
    );
};
export default Dashboard;