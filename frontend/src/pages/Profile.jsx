import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Loader2,
    User,
    Mail,
    GraduationCap,
    Calendar,
    ArrowLeft,
    Camera,
    Package,
    Settings,
    Shield,
    CheckCircle2,
    TrendingUp,
    ShoppingBag,
    MessageSquare,
    Clock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStudentInfo } from '../utils/studentInfo';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [myProducts, setMyProducts] = useState([]);
    const [recentChats, setRecentChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
        fetchMyProducts();
        fetchRecentChats();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.data.user);
        } catch (err) {
            setError('Failed to load profile. Please sign in again.');
        } finally {
            if (myProducts.length > 0) setLoading(false);
        }
    };

    const fetchMyProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/products/my-products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyProducts(response.data.data.products);
        } catch (err) {
            console.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentChats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/messages/conversations/recent', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecentChats(response.data.data.recentChats);
        } catch (err) {
            console.error('Failed to load recent chats');
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch('http://localhost:5000/api/auth/update-photo', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUser(response.data.data.user);
        } catch (err) {
            setError('Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfdfd]">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    const studentInfo = getStudentInfo(user?.email);

    return (
        <div className="min-h-screen bg-[#fcfdfd] selection:bg-emerald-100 selection:text-emerald-900">
            {/* Header Area - Emerald Gradient Background */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 h-80 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="max-w-6xl mx-auto px-6 pt-10 relative z-10">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="text-white hover:bg-white/10 rounded-xl px-4 py-2 transition-all hover:translate-x-[-4px]"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Market
                    </Button>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[5%] w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Profile Content Container */}
            <main className="max-w-6xl mx-auto px-6 -mt-40 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8 self-start">
                        <Card className="shadow-2xl shadow-emerald-900/10 border-none overflow-hidden rounded-[2.5rem] bg-white ring-1 ring-slate-100">
                            <CardContent className="pt-12 pb-10 flex flex-col items-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-50 scale-110"></div>
                                    <Avatar className="h-44 w-44 ring-[12px] ring-white shadow-2xl relative z-10 overflow-hidden">
                                        <AvatarImage src={user?.profilePhoto} className="object-cover" />
                                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-5xl font-black">
                                            {user?.name?.charAt(0)}
                                        </AvatarFallback>
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                                            </div>
                                        )}
                                    </Avatar>
                                    <label
                                        htmlFor="profilePhotoUpload"
                                        className="absolute bottom-2 right-2 bg-emerald-600 p-3 rounded-full shadow-xl cursor-pointer hover:bg-emerald-700 active:scale-95 transition-all z-30 border-4 border-white"
                                    >
                                        <Camera className="h-5 w-5 text-white" />
                                        <input
                                            id="profilePhotoUpload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>

                                <div className="mt-8 text-center px-4">
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                                        {user?.name}
                                    </h2>
                                    <div className="flex items-center justify-center mt-3 gap-1.5 px-4 py-1.5 bg-slate-900 text-white rounded-full w-fit mx-auto shadow-lg shadow-slate-200">
                                        <Shield className="h-3.5 w-3.5 text-emerald-400" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.15em]">Verified Identity</span>
                                    </div>
                                </div>

                                <div className="mt-10 w-full space-y-4 px-2">
                                    <div className="group flex items-center p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 transition-all hover:bg-emerald-50 hover:border-emerald-200">
                                        <div className="bg-white p-2.5 rounded-xl mr-4 shadow-sm group-hover:scale-110 transition-transform">
                                            <Mail className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-700/60 font-black mb-0.5">Campus ID</p>
                                            <p className="text-[14px] font-bold text-slate-700 truncate">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="group flex items-center p-4 bg-teal-50/30 rounded-2xl border border-teal-100/50 transition-all hover:bg-teal-50 hover:border-teal-200">
                                        <div className="bg-white p-2.5 rounded-xl mr-4 shadow-sm group-hover:scale-110 transition-transform">
                                            <GraduationCap className="h-5 w-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-teal-700/60 font-black mb-0.5">Department</p>
                                            <p className="text-[14px] font-bold text-slate-700 leading-tight">{studentInfo.branch}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="shadow-xl bg-slate-900 border-none rounded-[2rem] text-white overflow-hidden relative group h-40">
                                <CardContent className="p-8 pb-0 flex flex-col justify-center h-full">
                                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Enrollment Batch</p>
                                    <h3 className="text-5xl font-black tracking-tighter">{studentInfo.batch}</h3>
                                </CardContent>
                                <div className="absolute right-0 bottom-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Calendar className="h-24 w-24" />
                                </div>
                            </Card>

                            <Card className="shadow-xl bg-white border border-slate-100 rounded-[2rem] overflow-hidden group h-40">
                                <CardContent className="p-8 pb-0 flex flex-col justify-center h-full">
                                    <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Academic Year</p>
                                    <h3 className="text-5xl font-black tracking-tighter text-slate-800">{studentInfo.studyYear}</h3>
                                </CardContent>
                                <div className="absolute right-0 bottom-0 p-8 text-emerald-50 group-hover:text-emerald-100 transition-colors">
                                    <TrendingUp className="h-24 w-24" />
                                </div>
                            </Card>
                        </div>

                        {/* Marketplace Activity */}
                        <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-[2.5rem] bg-white overflow-hidden">
                            <CardHeader className="p-10 pb-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-3xl font-black text-slate-800">My Shop</CardTitle>
                                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Inventory & Sales Overview</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-slate-600 px-6">
                                            <ShoppingBag className="h-4 w-4 mr-2" /> Orders
                                        </Button>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 font-bold transition-all shadow-lg shadow-emerald-100">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 pt-6 space-y-10">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Active', val: myProducts.filter(p => !p.isSold).length, color: 'bg-emerald-50 text-emerald-600' },
                                        { label: 'Sold', val: myProducts.filter(p => p.isSold).length, color: 'bg-indigo-50 text-indigo-600' },
                                        { label: 'Views', val: '0', color: 'bg-amber-50 text-amber-600' },
                                        { label: 'Rating', val: 'N/A', color: 'bg-rose-50 text-rose-600' }
                                    ].map((s, i) => (
                                        <div key={i} className={`flex flex-col items-center justify-center p-6 ${s.color} rounded-[2rem] border-2 border-white shadow-inner transition-transform hover:scale-105 cursor-default`}>
                                            <p className="text-3xl font-black mb-1">{s.val}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-slate-900 p-1">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    <div className="bg-white rounded-[2.4rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-transform group-hover:scale-[0.99]">
                                        <div className="flex items-center gap-6">
                                            <div className="bg-emerald-600 p-5 rounded-2xl shadow-xl shadow-emerald-100 rotate-3 transition-transform group-hover:rotate-0">
                                                <Package className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="text-center md:text-left">
                                                <h4 className="font-black text-xl text-slate-800">
                                                    {myProducts.filter(p => !p.isSold).length > 0
                                                        ? `You have ${myProducts.filter(p => !p.isSold).length} active items`
                                                        : 'Ready to sell something?'}
                                                </h4>
                                                <p className="text-slate-400 font-medium text-[15px]">
                                                    {myProducts.filter(p => !p.isSold).length > 0
                                                        ? 'View your items in the marketplace.'
                                                        : 'The marketplace is waiting for your items.'}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => navigate('/add-product')}
                                            className="w-full md:w-auto bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl px-10 h-14 font-black text-lg transition-all shadow-xl"
                                        >
                                            {myProducts.filter(p => !p.isSold).length > 0 ? 'List More' : 'List Now'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Chats Section */}
                        <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-[2.5rem] bg-white overflow-hidden">
                            <CardHeader className="p-10 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-3xl font-black text-slate-800">Messages</CardTitle>
                                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Ongoing Conversations</CardDescription>
                                    </div>
                                    <Badge className="bg-emerald-500 text-white border-none px-3 font-bold">
                                        {recentChats.length} Active
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 pt-4">
                                {recentChats.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                        <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-bold">No recent conversations</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recentChats.map((chat, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => navigate(`/chat/${chat.partner._id}`)}
                                                className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[2rem] hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-14 w-14 ring-4 ring-slate-50 group-hover:ring-emerald-50 transition-all border border-white">
                                                        <AvatarImage src={chat.partner.profilePhoto} className="object-cover" />
                                                        <AvatarFallback className="bg-emerald-500 text-white font-black">
                                                            {chat.partner.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-lg font-black text-slate-800 leading-tight tracking-tight group-hover:text-emerald-600 transition-colors">
                                                            {chat.partner.name}
                                                        </span>
                                                        <p className="text-slate-400 text-sm font-medium line-clamp-1 mt-0.5">
                                                            {chat.lastMessage.text}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-1.5 text-slate-300 group-hover:text-emerald-500 transition-colors">
                                                        <Clock className="h-3 w-3" />
                                                        <span className="text-[10px] font-black uppercase tracking-wider">
                                                            {new Date(chat.lastMessage.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                                        <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 rotate-180 transition-transform group-hover:translate-x-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Profile;
