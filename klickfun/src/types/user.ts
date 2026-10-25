
export default interface User {
    "id": number,
    "name": string,
    "email": string,
    "role": 'ADMIN' | 'HOST',
    "isBlocked": boolean,
    "createdAt": string
}
