// best sellers api calls
import { publicRequest } from "../base";

export const fetchStudentData = async (data, query, signal) => {
    console.log("query", query);
    try {
        return await publicRequest(
            `users${query && query}`,
            "GET",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};

export const addStudentData = async (data, query, signal) => {
    try {
        return await publicRequest(`users`, "POST", data, signal);
    } catch (err) {
        throw err;
    }
};

export const changePassword = async (data, query, signal) => {
    try {
        return await publicRequest(
            `users/${data.id}/change-password`,
            "PUT",
            {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            },
            signal
        );
    } catch (err) {
        throw err;
    }
};
