import React from 'react';
import './Loader.css'; 

function Loader() {
    return (
        <div className="loader-overlay">
            <div className="loader">
            <div className="loader-line"></div>
            <div className="loader-line"></div>
            <div className="loader-line"></div>
            </div>
        </div>

    );
}

export default Loader;
 