import { publicRequest } from "../base";

export const fetchGraphData = async (data, query, signal) => {
    try {
        return await publicRequest(
            `graph-data${query && query}`,
            "GET",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};
