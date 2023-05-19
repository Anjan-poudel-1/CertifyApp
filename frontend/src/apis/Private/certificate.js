import { publicRequest } from "../base";

export const fetchCertificateData = async (data, query, signal) => {
    try {
        return await publicRequest(
            `certificates${query && query}`,
            "GET",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};

export const createCertificateData = async (data, query, signal) => {
    try {
        return await publicRequest(
            `certificates${query && query}`,
            "POST",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};
