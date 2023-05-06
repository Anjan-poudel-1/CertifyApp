const actions = {
    init: "INIT",
    toggleBackdrop: "TOGGLEBACKDROP",
};

const initialState = {
    artifact: null,
    provider: null,
    accounts: null,
    networkID: null,
    contract: null,
    backdrop: false,
};

const reducer = (state, action) => {
    console.log("here", action);
    const { type, data } = action;
    switch (type) {
        case actions.init:
            return { ...state, ...data };
        case actions.toggleBackdrop:
            return { ...state, backdrop: data };
        default:
            throw new Error("Undefined reducer action type");
    }
};

export { actions, initialState, reducer };
