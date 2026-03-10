import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [accountType, setAccountType] = useState('user'); // user or admin
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login: loginContext } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/auth/register', {
                username,
                email,
                password,
                role: accountType
            });

            loginContext(response.data);

            if (response.data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8 py-10">
            <Card className="max-w-md w-full shadow-md border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 z-0 pointer-events-none"></div>

                <CardHeader className="text-center pt-8 pb-4 relative z-10">
                    <CardTitle className="text-3xl font-extrabold tracking-tight pb-2">Create an account</CardTitle>
                    <CardDescription className="text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline transition-colors">
                            Sign in here
                        </Link>
                    </CardDescription>
                </CardHeader>

                <CardContent className="pb-8 relative z-10">
                    <form className="space-y-6" onSubmit={handleRegister}>
                        {error && (
                            <div className="rounded-md bg-destructive/15 p-4 border border-destructive/20 text-destructive text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex gap-4 mb-6">
                                <Button
                                    type="button"
                                    variant={accountType === 'user' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setAccountType('user')}
                                >
                                    Shopper
                                </Button>
                                <Button
                                    type="button"
                                    variant={accountType === 'admin' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setAccountType('admin')}
                                >
                                    Seller/Admin
                                </Button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <Input
                                        type="text"
                                        required
                                        className="pl-10"
                                        placeholder="John Doe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <Input
                                        type="email"
                                        required
                                        className="pl-10"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="pl-10 pr-10"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        minLength={6}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-muted-foreground hover:text-foreground h-8 w-8"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="pl-10"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full text-md mt-6"
                            size="lg"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
