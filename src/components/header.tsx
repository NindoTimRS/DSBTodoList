
import styles from '../styles/header.module.scss';
import Logo from '../icons/DSB_Logo.png';
import LogoutSVG from '../icons/logout.svg';
import UserSVG from '../icons/user.svg';
import {logout} from "./auth/auth";
import {ToggleAddTaskFormHtml} from "./add-popups/add-task-popup";
import {useEffect, useState} from "preact/hooks";
import { JSX } from 'preact/jsx-runtime';


export default function Header({onSearch}) {
    const [searchInput, setSearchInput] = useState("");

    const handleEnter = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setSearchInput(e.currentTarget.value);
        }
    }
    useEffect(() => {
        onSearch(searchInput);
    }, [searchInput]);

    const handleUser = () => {
        const jwt = localStorage.getItem("jwt");
        const targetWindow = window.open("http://localhost:5174/", "_blank");

        setTimeout(() => {
            if (targetWindow) {
                targetWindow.postMessage({ token: jwt }, "http://localhost:5174");
            }
        }, 500);
    }

    return (
        <header id={`${styles.header}`} className={styles.active}>
            <div className={styles.left}>
                <img src={Logo} alt="DSB Logo" className={styles.logo}/>
                <h1 className={styles.desktopOnly}>Willkommen zurück!</h1>
            </div>
            <div className={styles.right}>
                <input  className={`${styles.searchField} ${styles.headInteractive}`} id={"searchField"} type="text" value={searchInput}
                       onKeyPress={(e) => handleEnter(e)} />
                <button className={`${styles.iconBtn} ${styles.headInteractive}`} title="Einstellungen" onClick={ToggleAddTaskFormHtml}>
                   <span> + </span><span class={styles.desktopOnly}>Add Task</span>
                </button>
                <button className={`${styles.iconBtn} ${styles.headInteractive}`} onClick={handleUser}>
                    <img src={UserSVG} alt={"Nutzerverwaltung"} className={styles.logout} />
                </button>
                <button className={`${styles.iconBtn} ${styles.headInteractive}`} title="Logout" onClick={logout}>
                    <img src={LogoutSVG} alt="Logout" className={styles.logout} />
                </button>
            </div>
        </header>
    );
}