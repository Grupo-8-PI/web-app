import React from "react";

export default function CategoriaCard({ titulo, icone, alt, onClick }) {
    return (
        <div className="catCard" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <span role="img" aria-label={alt || titulo} style={{ fontSize: '32px', color: '#003366' }}>{icone}</span>
            <div>{titulo}</div>
        </div>
    );
}
