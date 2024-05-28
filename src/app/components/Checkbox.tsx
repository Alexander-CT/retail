import type { FunctionComponent, InputHTMLAttributes } from 'react';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

const Checkbox: FunctionComponent<CheckboxProps> = (props) => {
    return (
        <input
            type='checkbox'
            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
            {...props}
        />
    );
};

export default Checkbox;
