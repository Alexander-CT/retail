'use client';
import Button from '@/app/components/Button';
import Checkbox from '@/app/components/Checkbox';
import Input from '@/app/components/Input';
import MoonIcon from '@/app/components/icons/MoonIcon';
import SunIcon from '@/app/components/icons/SunIcon';
import Link from 'next/link';
import { useState, type FunctionComponent } from 'react';
// ('use client');
// ('use client');
const Login: FunctionComponent = () => {
    // const {} = useFormState({
    //     resolver: () => {},
    // });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 w-full max-w-md'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                        Login
                    </h2>
                    <div className='flex items-center space-x-2'>
                        <Button size='icon' variant='ghost'>
                            <SunIcon className='w-5 h-5 text-gray-500 dark:text-gray-400' />
                        </Button>
                        <Button size='icon' variant='ghost'>
                            <MoonIcon className='w-5 h-5 text-gray-500 dark:text-gray-400' />
                        </Button>
                    </div>
                </div>
                <form className='space-y-6'>
                    <div>
                        <label
                            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                            htmlFor='email'
                        >
                            Email
                        </label>
                        <Input
                            className='mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 p-2'
                            id='email'
                            placeholder='example@email.com'
                            type='email'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                            htmlFor='password'
                        >
                            Password
                        </label>
                        <Input
                            className='mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 p-2'
                            id='password'
                            placeholder='Enter your password'
                            type='password'
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                    </div>
                    <Button
                        className='w-full rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                        type='submit'
                    >
                        Sign in
                    </Button>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <Checkbox id='remember' />
                            <label
                                className='ml-2 block text-sm text-gray-900 dark:text-gray-300'
                                htmlFor='remember'
                            >
                                Remember me
                            </label>
                        </div>
                        <Link
                            className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-500 dark:hover:text-indigo-400'
                            href='#'
                        >
                            Forgot password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
