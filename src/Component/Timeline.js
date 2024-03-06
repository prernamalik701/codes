import React, { useState, useEffect } from 'react';

const Timeline = ({ instruments, onPlay }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < instruments.length) {
            const timeoutId = setTimeout(() => {
                onPlay(instruments[currentIndex]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [currentIndex, instruments, onPlay]);

    return ( <
        div className = "timeline" > {
            instruments.map((instrument, index) => ( <
                div key = { index }
                className = { `timeline-item ${index === currentIndex ? 'active' : ''}` } > { instrument } <
                /div>
            ))
        } <
        /div>
    );
};

export default Timeline;