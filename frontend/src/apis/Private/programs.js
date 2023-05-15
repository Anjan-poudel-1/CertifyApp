import { publicRequest } from "../base";

export const fetchProgramsData = async (data, query, signal) => {
    try {
        return await publicRequest(
            `programs${query && query}`,
            "GET",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};

export const addNewProgram = async (data, query, signal) => {
    try {
        return await publicRequest(
            `programs${query && query}`,
            "POST",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};

export const updateExistingProgram = async (data, query, signal) => {
    try {
        return await publicRequest(
            `programs${query && query}`,
            "PUT",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};
