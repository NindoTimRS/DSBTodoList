import {getToken} from "../components/auth/auth";

export class LoginService{

    private apiPath: string = "http://localhost:6969/api/user";
    async GetLogIn(body: string): Promise<string> {
        const response = await fetch(this.apiPath, {method: "POST", body: body})
        if(response.ok){
            return await response.text()
        }
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }
    async GetAllUser(): Promise<{userId: number, userName: string, email: string}[]> {
        return await fetch(`${this.apiPath}/all`, {method: "GET", headers: {Authorization: `Bearer ${getToken()}`}})
            .then(res => res.json())
            .then(res => {return res as {userId: number, userName: string, email: string}[]});
    }

}