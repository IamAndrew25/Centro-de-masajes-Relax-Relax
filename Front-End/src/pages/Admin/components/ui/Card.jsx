import React from 'react';

// Componente Card genérico reutilizable
export const Card = ({ className = '', children }) => (
    <div className={`report-card ${className}`}>
        {children}
    </div>
);

// Componente para estadísticas
export const StatCard = ({ icon, value, label }) => (
    <div className="stat-card">
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <h3>{value}</h3>
            <p>{label}</p>
        </div>
    </div>
);

// Componente para elementos de lista con dos valores
export const ListItem = ({ label, value, className = '' }) => (
    <div className={`${className}`}>
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

// Componente para barras de progreso
export const ProgressBar = ({ label, percentage }) => (
    <div className="schedule-item">
        <span>{label}</span>
        <div className="schedule-bar">
            <div className="bar-fill" style={{width: `${percentage}%`}}></div>
            <span>{percentage}%</span>
        </div>
    </div>
);

// Componente para secciones con header
export const SectionHeader = ({ title, buttonText, onButtonClick }) => (
    <div className="section-header">
        <h2>{title}</h2>
        {buttonText && (
            <button className="btn-primary" onClick={onButtonClick}>
                {buttonText}
            </button>
        )}
    </div>
);