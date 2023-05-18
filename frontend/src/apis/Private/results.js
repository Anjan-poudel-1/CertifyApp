// subjects api calls
import { publicRequest } from "../base";

export const fetchStudentResult = async (data, query, signal) => {
    try {
        return await publicRequest(
            `students/${data.id}/results${query && query}`,
            "GET",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};

export const createStudentResult = async (data, query, signal) => {
    let tempData = { ...data };
    delete data.id;

    try {
        return await publicRequest(
            `students/${tempData.id}/results${query && query}`,
            "POST",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};

export const updateStudentResult = async (data, query, signal) => {
    let tempData = { ...data };
    let studentId = tempData.studentId;
    let resultId = tempData.resultId;
    delete data.studentId;
    delete data.resultId;

    try {
        return await publicRequest(
            `students/${studentId}/results/${resultId}`,
            "PUT",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};
