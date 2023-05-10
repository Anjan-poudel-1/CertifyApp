const actions = {
    init: "INIT",
    toggleBackdrop: "TOGGLEBACKDROP",
    setUserState: "SETUSERSTATE",
};

const initialState = {
    artifact: null,
    provider: null,
    accounts: null,
    networkID: null,
    contract: null,
    backdrop: false,
    userState: {},
};

const reducer = (state, action) => {
    console.log("here", action);
    const { type, data } = action;
    switch (type) {
        case actions.init:
            return { ...state, ...data };
        case actions.toggleBackdrop:
            return { ...state, backdrop: data };
        case actions.setUserState:
            return { ...state, userState: { ...data } };
        default:
            throw new Error("Undefined reducer action type");
    }
};

export { actions, initialState, reducer };
