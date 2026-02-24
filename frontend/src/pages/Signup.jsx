import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const [step, setStep] = useState(0); // 0: Form, 1: OTP
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        otp: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
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
                setError('Google Login failed. Check if a real Client ID is set in App.jsx');
            } finally {
                setLoading(false);
            }
        },
        onError: () => setError('Google Login Failed'),
    });

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email.endsWith('@iiit-bh.ac.in')) {
            setError('Please use your college email (@iiit-bh.ac.in)');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/send-otp', {
                email: formData.email
            });

            if (response.data.status === 'success') {
                setMessage('OTP sent to ' + formData.email);
                setStep(1);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                password: formData.password,
                otp: formData.otp
            });

            if (response.data.status === 'success') {
                localStorage.setItem('token', response.data.token);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4">
            <h1 className="text-2xl font-semibold mb-6">Sign up</h1>

            <Card className="w-full max-w-[440px] shadow-sm border-gray-200">
                <CardContent className="pt-8 pb-8 px-8">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md flex items-center gap-2 mb-6 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3 rounded-md flex items-center gap-2 mb-6 text-sm font-medium">
                            <CheckCircle2 size={18} />
                            {message}
                        </div>
                    )}

                    {step === 0 ? (
                        <>
                            <form onSubmit={handleSendOTP} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            placeholder="John"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Doe"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="h-11"
                                        />
                                    </div>
                                </div>

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
                                    <p className="text-[12px] text-gray-500 mt-1">
                                        Notice: Only @iiit-bh.ac.in emails are accepted.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a password"
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
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleVerifyAndSignup} className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="otp">Enter Verification Code</Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    placeholder="6-digit code"
                                    required
                                    maxLength={6}
                                    autoFocus
                                    value={formData.otp}
                                    onChange={handleChange}
                                    className="h-11 text-center text-xl tracking-widest font-bold"
                                />
                                <p className="text-xs text-center text-muted-foreground">
                                    We sent a code to your college email. It expires in 5 minutes.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Button type="submit" className="w-full h-11 bg-black text-white hover:bg-gray-800 font-medium" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify & Sign Up'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    className="w-full text-xs text-gray-400 hover:text-black"
                                    onClick={() => setStep(0)}
                                    disabled={loading}
                                >
                                    Back to Details
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-black font-medium hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-12 text-center text-xs text-gray-400 max-w-xs leading-relaxed">
                By creating an account, you agree to the<br />
                <Link to="#" className="hover:underline">Terms of Service</Link> and <Link to="#" className="hover:underline">Privacy Policy</Link>
            </div>
        </div>
    );
};

export default Signup;
