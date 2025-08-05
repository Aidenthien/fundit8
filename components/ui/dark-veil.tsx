"use client";

import React from "react";

const DarkVeil: React.FC = () => {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 50%, rgba(0,0,0,0.7) 100%)',
                backdropFilter: 'blur(10px)',
                zIndex: 0,
            }}
        />
    );
};

export default DarkVeil; 