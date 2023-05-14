// subjects api calls
import { publicRequest } from "../base";

export const fetchSubjectData = async (data, query, signal) => {
    try {
        return await publicRequest(
            `subjects${query && query}`,
            "GET",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};

export const createNewSubject = async (data, query, signal) => {
    try {
        return await publicRequest(
            `subjects${query && query}`,
            "POST",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};

export const updateExistingSubject = async (data, query, signal) => {
    try {
        return await publicRequest(
            `subjects${query && query}`,
            "PUT",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};
