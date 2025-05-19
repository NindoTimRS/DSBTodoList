import {Component} from 'preact';
import newYorkerLogo from './icons/newyorker.png'
import logout from './icons/logout.svg'
import './style.scss';
import {ToggleAddTaskFormHtml} from "./add-task-popup";


class Headbar extends Component {
    render() {
        return (
            <div id="headBar">
                <HeadLine/>
                <AddContainer/>
            </div>
        )
    }
}

class HeadLine extends Component {
    render() {
        return (
            <div id="headLine">
                <img src={newYorkerLogo} alt="newyorker"/>
                <h1>&nbsp;Task Dashboard</h1>
            </div>
        )
    }
}


class AddContainer extends Component {
    handleLogout = () => {
        if (confirm("Do you wish to Log out?")) {
            localStorage.removeItem('token');
            window.location.reload();
        }
    };

    render() {
        return (
            <div id="addContainer">
                <button onClick={ToggleAddTaskFormHtml} id="addButton">Add Task</button>
                <img id="logout" alt="logout" src={logout} onClick={this.handleLogout}></img>
            </div>

        )
    }
}


export default Headbar;