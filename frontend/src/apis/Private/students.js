// best sellers api calls
import { publicRequest } from "../base";

export const fetchStudentData = async (data, query, signal) => {
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
