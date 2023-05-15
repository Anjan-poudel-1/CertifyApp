import React from "react";

import { Form } from "react-bootstrap";
import isEmpty from "../helpers/isEmpty";

const ErrorBody = (props) => {
    if (isEmpty(props.children)) {
        return <span></span>;
    }

    return (
        <>
            <Form.Text style={{ color: "red" }}>{props.children}</Form.Text>
        </>
    );
};

export default ErrorBody;
