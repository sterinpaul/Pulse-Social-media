export interface User {
    getFirstName: () => string;
    getLastName: () => string;
    getUserName: () => string;
    getEmail: () => string;
    getPassword: () => string;
    getMobile: () => string;
}

export function createUser(
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
    mobile: string
): User {
    return {
        getFirstName: () => firstName,
        getLastName: () => lastName,
        getUserName: () => userName,
        getEmail: () => email,
        getPassword: () => password,
        getMobile: () => mobile,
    };
}

// Export the type of the User object
export type UserEntityType = ReturnType<typeof createUser>
