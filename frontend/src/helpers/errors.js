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

export const checkSubjectFormError = (_data) => {
    let errors = {};

    if (_data.name.length <= 0) {
        errors.name = "Please Provide Subject Name";
    }
    if (
        !_data.creditHours ||
        (_data.creditHours && parseInt(_data.creditHours) <= 0)
    ) {
        errors.creditHours = "Please Provide a valid Credit Hour";
    }

    console.log("ERRORS", errors);

    return errors;
};
