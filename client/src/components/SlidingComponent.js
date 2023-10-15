import React from 'react'

function SlidingComponent({
    content = <></>
    , isVisible
    , buttonCallback
}) {
    return (        
        <div className={`slider ${isVisible ? 'visible' : ''}`}>
            <button onClick={() => buttonCallback()}>Close</button>
            {content}
        </div>
    );
}

export default SlidingComponent;
