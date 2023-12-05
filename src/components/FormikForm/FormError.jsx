import classNames from 'classnames'

const FormError = ({ error, variant = 'danger' }) => {
    return (
        error && (
            <div
                className={classNames('my-3 py-3 px-5  border ', {
                    'bg-danger/[0.18] border-danger/[0.25] text-alert-danger-fg-light dark:text-alert-danger-fg-dark': variant === 'danger',
                    'bg-success/[0.18] border-success/[0.25] text-success': variant === 'success'
                })}
            >
                {error}
            </div>
        )
    )
}

export default FormError
