import { publicRequest } from "../base";

export const userLogin = async (data, query, signal) => {
    try {
        return await publicRequest(
            `login${query && query}/`,
            "POST",
            data,
            signal
        );
    } catch (err) {
        throw err;
    }
};
