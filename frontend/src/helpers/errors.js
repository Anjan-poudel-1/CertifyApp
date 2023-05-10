import isEmail from "./isEmail";

export const checkLoginFormError = (_data) => {
    let errors = {};

    if (_data.email.length <= 0) {
        errors.email = "Please Fill in your email";
    }
    if (!isEmail(_data.email)) {
        errors.email = "Please Provide a valid Email";
    }

    if (_data.password <= 0) {
        errors.password = "Please Provide  your password";
    }
    console.log(_data);

    return errors;
};
