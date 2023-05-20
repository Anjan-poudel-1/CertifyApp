import { publicRequest } from "../base";

export const fetchAllStats = async (data, query, signal) => {
    try {
        return await publicRequest(
            `stats${query && query}`,
            "GET",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};
