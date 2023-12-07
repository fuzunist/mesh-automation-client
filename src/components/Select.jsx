const Select = ({ value, options, onChange, disabled }) => { // Add 'disabled' to the props
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled} // Apply the 'disabled' prop to the select element
            className='py-1 px-3 text-sm transition-all outline-none bg-input-bg-light dark:bg-input-bg-dark border rounded border-input-border-light dark:border-input-border-dark min-w-full scroller'
        >
            {options.map((option, index) => (
                <option
                    key={index+100}
                    value={option}
                >
                    {option}
                </option>
            ))}
        </select>
    )
}

export default Select;

