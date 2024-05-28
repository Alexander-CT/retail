import type { FunctionComponent, InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;
const Input: FunctionComponent<InputProps> = (props) => {
    return <input {...props} />;
};

export default Input;
