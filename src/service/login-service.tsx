import {TaskItem} from "../Model/TaskItem";
import {getToken} from "../components/auth/auth";

export class LoginService{

    async GetLogIn(body: string): Promise<string> {
        const response = await fetch("http://localhost:6969/api/user", {method: "POST", body: body})
        if(response.ok){
            return await response.text()
        }
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }
    async GetAllUser(): Promise<{userName: string, email: string}[]> {
        return await fetch("http://localhost:6969/api/user/all", {method: "GET", headers: {Authorization: `Bearer ${getToken()}`}})
            .then(res => res.json())
            .then(res => {return res as {userName: string, email: string}[]});
    }
}