import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function InvitePage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch(`/api/auth/invite/${token}`)
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(data => { setUserInfo(data); setLoading(false); })
            .catch(() => { setError('This invite link is invalid or has expired.'); setLoading(false); });
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

        setSubmitting(true);
        try {
            const res = await fetch(`/api/auth/register/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (res.ok) {
                setSuccess(true);
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch {
            setError('Unable to connect to the server.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-3xl" />
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                        <LayoutDashboard size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">You're invited!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Complete your account setup below</p>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white dark:border-slate-700/50 p-8">
                    {success ? (
                        <div className="text-center py-4">
                            <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Registration Successful!</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                Your account is now pending admin approval. You'll be able to log in once an administrator approves it.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition"
                            >
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                                </div>
                            )}

                            {userInfo && (
                                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-400">Name</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{userInfo.fullname || userInfo.username}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-400">Email</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{userInfo.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-400">Role</span>
                                        <span className="font-semibold text-slate-800 dark:text-white capitalize">{userInfo.role?.toLowerCase()}</span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Create Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-slate-400" />
                                        </div>
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            placeholder="Min. 6 characters"
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPass(v => !v)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-slate-400" />
                                        </div>
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:opacity-90 transition disabled:opacity-60"
                                >
                                    {submitting ? 'Setting up account…' : 'Complete Registration'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
