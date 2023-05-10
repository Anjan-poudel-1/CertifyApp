import CONSTANTS from "../globals/constants";

const getResponse = async (response) => {
    const contentType = response.headers.get("content-type");

    // for json response
    const json = await response.json();
    return { response, json };

    if (contentType === "application/json") {
        const json = await response.json();
        return { response, json };
    }

    // for image response

    // for doc response
};

const publicRequest = async (url, method, body, signal) => {
    try {
        const mainCall = async () => {
            return await fetch(`${CONSTANTS.SERVER_URL}${url}`, {
                method: method,
                body: method !== "GET" ? JSON.stringify(body) : null,
                signal: signal,
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": "en",
                },
            });
        };

        var response = await getResponse(await mainCall());
        return response;
    } catch (err) {
        throw err;
    }
};

const privateRequest = async (url, method, body, signal, type) => {
    try {
        const mainCall = async () => {
            return await fetch(`${CONSTANTS.SERVER_URL}${url}`, {
                method: method,
                body: method !== "GET" ? JSON.stringify(body) : null,
                signal: signal,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${localStorage.getItem(
                        "certify_auth"
                    )}`,
                    "Accept-Language": "en",
                },
            });
        };

        var response = await getResponse(await mainCall());
        if (response.response.status === 401) {
            // store.dispatch(autoLogout());
            return;
        }
        return response;
    } catch (err) {
        throw err;
    }
};

export { publicRequest, privateRequest };
