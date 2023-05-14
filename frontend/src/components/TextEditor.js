import React from "react";
import ReactQuill from "react-quill";

const modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link"],
        ["clean"],
    ],
    clipboard: {
        matchVisual: false,
    },
};

const TextEditor = ({ value, onChange, placeholder, name, ...rest }) => {
    return (
        <ReactQuill
            value={value}
            onChange={onChange}
            modules={modules}
            placeholder={placeholder}
            name={name}
        />
    );
};

export default TextEditor;
