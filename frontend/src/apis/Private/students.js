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

export const fetchStudentSearchData = async (data, query, signal) => {
    console.log("query", query);
    try {
        return await publicRequest(
            `usersearch${query && query}`,
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

export const updateExistingUser = async (data, query, signal) => {
    try {
        return await publicRequest(
            `users${query && query}`,
            "PUT",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};

export const updateExistingStudent = async (data, query, signal) => {
    try {
        return await publicRequest(
            `students${query && query}`,
            "PUT",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};

export const deleteExistingStudent = async (data, query, signal) => {
    try {
        return await publicRequest(
            `students${query && query}`,
            "DELETE",
            data,
            signal
        );
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

export const searchStudents = async (data, query, signal) => {
    try {
        return await publicRequest(
            `usersearch${query && query}`,
            "GET",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};
