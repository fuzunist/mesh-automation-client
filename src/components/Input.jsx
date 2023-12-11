import React from 'react'

const Input = ({ type, value, onChange, ...props }) => {
    const handleChange = (e) => {
        // If the input type is number, use valueAsNumber, otherwise use value
        let inputValue = type === 'number' ? e.target.valueAsNumber : e.target.value;

        // If inputValue is NaN, set it to an empty string or a default numeric value
        if (type === 'number' && isNaN(inputValue)) {
            inputValue = ""; // or use 0 or any other default number if you prefer
        }

        onChange(inputValue);
    };

    return (
        <input
            type={type}
            value={value}
            onChange={handleChange}
            className='py-1 px-3 text-sm transition-all outline-none bg-input-bg-light dark:bg-input-bg-dark border rounded border-input-border-light dark:border-input-border-dark min-w-full max-w-full w-full'
            {...props}
        />
    );
};

export default Input;



