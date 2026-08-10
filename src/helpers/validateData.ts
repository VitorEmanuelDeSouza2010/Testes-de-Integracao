export function validateEmail(email: string) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function validateId(id: string | string[]) {
    return !isNaN(+id) && +id > 0  && +id % 1 === 0;
}
