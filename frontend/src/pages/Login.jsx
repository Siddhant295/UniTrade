import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });

                const { email, name } = userInfo.data;

                if (!email.endsWith('@iiit-bh.ac.in')) {
                    setError('Access Restricted: Only @iiit-bh.ac.in accounts are allowed.');
                    setLoading(false);
                    return;
                }

                // Send to backend
                const response = await axios.post('http://localhost:5000/api/auth/google', {
                    idToken: tokenResponse.access_token,
                    email,
                    name
                });

                if (response.data.status === 'success') {
                    localStorage.setItem('token', response.data.token);
                    navigate('/');
                }
            } catch (err) {
                setError('Google Login failed. Check your Client ID setup.');
            } finally {
                setLoading(false);
            }
        },
        onError: () => setError('Google Login Failed'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.status === 'success') {
                localStorage.setItem('token', response.data.token);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4">
            <h1 className="text-2xl font-semibold mb-6">Sign in</h1>

            <Card className="w-full max-w-[440px] shadow-sm border-gray-200">
                <CardContent className="pt-8 pb-8 px-8">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md flex items-center gap-2 mb-6">
                            <AlertCircle size={18} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="example@iiit-bh.ac.in"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link to="#" className="text-xs text-black hover:underline font-medium">Forgot password?</Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="h-11"
                            />
                        </div>

                        <Button type="submit" className="w-full h-11 bg-black text-white hover:bg-gray-800 font-medium" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">OR</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full h-11 font-normal border-gray-300"
                            onClick={() => handleGoogleLogin()}
                            disabled={loading}
                            type="button"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                            Continue with Google
                        </Button>
                        <Button variant="outline" className="w-full h-11 font-normal border-gray-300" disabled>
                            <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" className="w-4 h-4 mr-2" />
                            Continue with GitHub
                        </Button>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-black font-medium hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
