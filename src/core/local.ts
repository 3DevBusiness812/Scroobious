
export const getFromStorage = (key: string) => {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
    }
    else {
        return null;
    }
}

export const setStorage = (key: string, value: string) => {
    if (typeof window !== 'undefined') {
        return window.localStorage.setItem(key, value);
    }
    else {
        return null;
    }
}