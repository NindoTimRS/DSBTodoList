import { useState } from "preact/hooks";
import ColumnData from "./column-container"
import Headbar from "./headBar";
import AddTaskPopup from "./add-task-popup";
import EditTaskPopup from "./edit-task-popup";
import {TaskItem} from "./Model/TaskItem";

const Dashboard = ({ token }) => {
    if (!token) {
        return <h2>Unauthorized. Please log in.</h2>;
    }
    const [reload, setReload] = useState(false);
    return (
        <div>
            <Headbar/>
            <ColumnData reload={reload} ></ColumnData>
            <AddTaskPopup onPost={() => setReload(!reload)}></AddTaskPopup>
            <EditTaskPopup onPut={() => setReload(!reload)}></EditTaskPopup>


        </div>
    );
};
export default Dashboard;