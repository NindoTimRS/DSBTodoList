
import styles from './styles/header.module.scss';
import Logo from './icons/DSB_Logo.png';
import LogoutSVG from './icons/logout.svg';
import {logout} from "./auth";
import {ToggleAddTaskFormHtml} from "./add-task-popup";
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

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <img src={Logo} alt="DSB Logo" className={styles.logo}/>
                <h1>Willkommen zurück!</h1>
            </div>
            <div className={styles.right}>
                <input className={`${styles.searchField} ${styles.headInteractive}`} id={"searchField"} type="text" value={searchInput}
                       onKeyPress={(e) => handleEnter(e)} />
                <button className={`${styles.iconBtn} ${styles.headInteractive}`} title="Einstellungen" onClick={ToggleAddTaskFormHtml}>+ Add Task</button>
                <button className={`${styles.iconBtn} ${styles.headInteractive}`} title="Logout" onClick={logout}>
                    <img src={LogoutSVG} alt="Logout" className={styles.logout} />
                </button>
            </div>
        </header>
    );
}