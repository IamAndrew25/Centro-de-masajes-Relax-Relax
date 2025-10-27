import React from 'react';

// Input genérico
export const FormInput = ({ label, type = "text", value, onChange, placeholder, required, ...props }) => (
    <div className="form-group">
        <label>{label} {required && '*'}</label>
        <input 
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            {...props}
        />
    </div>
);

// Select genérico
export const FormSelect = ({ label, value, onChange, options, defaultOption, required }) => (
    <div className="form-group">
        <label>{label} {required && '*'}</label>
        <select value={value} onChange={onChange} required={required}>
            {defaultOption && <option value="">{defaultOption}</option>}
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

// Textarea genérico
export const FormTextarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
    <div className="form-group">
        <label>{label}</label>
        <textarea 
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
        />
    </div>
);

// Fila de formulario (para dos elementos lado a lado)
export const FormRow = ({ children }) => (
    <div className="form-row">
        {children}
    </div>
);