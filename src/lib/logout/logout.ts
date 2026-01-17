export const saveLoginSession = (token: string) => {
    const now = Date.now(); // current time in ms

    localStorage.setItem("token", token);
    localStorage.setItem("login_time", now.toString());
};



const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // ms

export const autoLogoutAfter7Days = () => {
    const loginTime = localStorage.getItem("login_time");

    if (!loginTime) return false;

    const currentTime = Date.now();
    const diff = currentTime - Number(loginTime);

    if (diff >= SEVEN_DAYS) {
        // ❌ logout
        localStorage.removeItem("token");
        localStorage.removeItem("login_time");

        return true; // logged out
    }

    return false; // still valid
};