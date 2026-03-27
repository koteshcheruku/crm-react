import React, { useState } from 'react';
import { LayoutDashboard, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // VERY IMPORTANT
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    try {
                        const payloadBase64 = data.accessToken.split('.')[1];
                        const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
                        const payload = JSON.parse(decodedJson);
                        if (payload.employeeId) {
                            localStorage.setItem('employeeId', payload.employeeId);
                        } else if (payload.userId) {
                            localStorage.setItem('employeeId', payload.userId);
                        } else if (payload.id) {
                            localStorage.setItem('employeeId', payload.id);
                        }
                    } catch (e) {
                        // silently ignore token parse errors
                    }
                }
                onLogin();
            } else if (response.status === 403) {
                const errorData = await response.json().catch(() => ({}));
                if (errorData.error === 'pending_approval') {
                    setError('Your account is pending admin approval. Please wait for an administrator to approve your account.');
                } else {
                    setError('Access denied. Please contact your administrator.');
                }
                setIsLoading(false);
            } else {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.message || 'Invalid credentials. Please try again.');
                setIsLoading(false);
            }
        } catch (err) {
            setError('Unable to connect to the server. Please check your connection.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">

            {/* Background decoration elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-3xl filter" />
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-400/10 dark:bg-cyan-600/10 blur-3xl filter" />
            </div>

            <div className="w-full max-w-md relative z-10">

                {/* Logo and Header */}
                <div className="text-center mb-10 animate-slide-in">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                        <LayoutDashboard size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Welcome back
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Sign in to access your CRM dashboard
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-700/50 p-8">

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                            <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-slate-400 dark:text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-slate-400 dark:text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Remember me toggle */}
                        <div className="flex items-center gap-3">
                            <label className="relative flex cursor-pointer items-center rounded-full p-0" htmlFor="remember">
                                <input
                                    type="checkbox"
                                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                    id="remember"
                                    defaultChecked
                                />
                                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                            </label>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer" htmlFor="remember">
                                Remember for 30 days
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/40 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight size={20} className="ml-1" />
                                </>
                            )}
                        </button>
                    </form>

                </div>

                {/* Footer text */}
                <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mt-8">
                    Need an account?{' '}
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                        Contact your administrator
                    </a>
                </p>

            </div>
        </div>
    );
};
