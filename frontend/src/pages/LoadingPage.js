import React from "react";
import ReactLoading from "react-loading";
function LoadingPage() {
    return (
        <div className="absolute-center-page__content">
            <ReactLoading
                type={"spinningBubbles"}
                color={"#00aa00"}
                className="loader"
            />
        </div>
    );
}

export default LoadingPage;
