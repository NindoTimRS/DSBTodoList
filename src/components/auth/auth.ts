export const saveToken = (token: string) => localStorage.setItem('jwt', token)
export const getToken = () => localStorage.getItem('jwt')
export const logout = () => {
    if (confirm("Möchtest du dich ausloggen?")) {
        localStorage.removeItem('jwt');
        window.location.reload();
    }
}

