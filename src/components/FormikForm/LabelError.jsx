/* eslint-disable react/prop-types */

const LabelError = ({ value, touched, errors }) => {

    return errors?.[value] && touched?.[value] && <span className='text-danger mt-1 text-xs ml-1'>{errors[value]}</span>
}

export default LabelError
