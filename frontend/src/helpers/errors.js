import isEmail from "./isEmail";
import isEmpty from "./isEmpty";

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

export const checkProgramsFormError = (_data) => {
    let errors = {};
    if (_data.name.length <= 0) {
        errors.name = "Please Provide The Program Name";
    }
    if (_data.description.length <= 0) {
        errors.description = "Please Provide The Program Description";
    }
    if (_data.programLeader.length <= 0) {
        errors.programLeader = "Please Provide The Program Leader";
    }

    if (_data.years.length < 4) {
        errors.years = "Provide Valid Subjects to each year";
    }

    return errors;
};

export const checkStudentFormError = (_data) => {
    let errors = {};
    if (_data.name.length <= 0) {
        errors.name = "Please Provide Student Name";
    }
    if (_data.email.length <= 0 || !isEmail(_data.email)) {
        errors.email = "Please Provide a valid email";
    }
    if (_data.walletAddress.length <= 0) {
        errors.walletAddress = "Please Provide a valid Wallet";
    }

    if (_data.enrolledYear.length != 4) {
        errors.enrolledYear = "Please Provide the year of enrollment";
    }

    if (isEmpty(_data.enrolledProgram)) {
        errors.enrolledProgram = "Please Provide the program enrolled";
    }
    return errors;
};
