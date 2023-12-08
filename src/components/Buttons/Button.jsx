import classNames from 'classnames'

const Button = ({ children, onClick, variant = 'default' }) => {
    return (
        <button
            onClick={onClick}
            className={classNames('py-2 px-4 outline-none transition-colors rounded text-white uppercase', {
                'bg-link-fg-light hover:bg-link-hover-light': variant === 'default',
                'bg-purple hover:bg-purple-hover': variant === 'purple',
                'bg-alert-danger-fg-dark hover:bg-alert-danger-fg-light': variant === 'danger'
            })}
        >
            {children}
        </button>
    )
}

export default Button
