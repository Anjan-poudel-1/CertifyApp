import React from "react";
import NotFoundImage from "../assets/images/404.png";
function NotFound() {
    return (
        <div className="absolute-center-page">
            <div className="absolute-center-page__content">
                <div className="page-not-found">
                    <img src={NotFoundImage} />
                </div>
            </div>
        </div>
    );
}

export default NotFound;
