import type { ButtonHTMLAttributes, FunctionComponent, ReactNode } from 'react';
enum sizes {
    sm = 'px-2 py-1 text-xs',
    md = 'px-4 py-2 text-sm',
    lg = 'px-6 py-3 text-lg',
    xl = 'px-8 py-4 text-xl',
    '2xl' = 'px-10 py-5 text-2xl',
    '3xl' = 'px-12 py-6 text-3xl',
    '4xl' = 'px-16 py-8 text-4xl',
    '5xl' = 'px-20 py-10 text-5xl',
    icon = 'p-2',
    full = 'w-full',
}

enum variants {
    primary = 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary = 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost = 'bg-transparent text-indigo-600 hover:text-indigo-700',
    link = 'bg-transparent text-indigo-600 hover:text-indigo-700',
}

type ButtonProps = {
    size?: keyof typeof sizes;
    variant?: keyof typeof variants;
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FunctionComponent<ButtonProps> = ({
    children,
    size = 'md',
    variant = 'primary',
    ...rest
}) => {
    return (
        <button
            className={[sizes[size], variants[variant]].join(' ')}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
