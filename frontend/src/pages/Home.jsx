import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Plus, LogOut, Package, User, UserCircle, HelpCircle, Heart, ArrowRight, ArrowLeft, MessageSquare } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUser(response.data.data.user);
            }
        } catch (err) {
            console.error('Failed to fetch user');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data.data.products);
        } catch (err) {
            setError('Failed to load products. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Electronics': 'bg-blue-100 text-blue-700 border-blue-200',
            'Books': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Furniture': 'bg-amber-100 text-amber-700 border-amber-200',
            'Clothing': 'bg-purple-100 text-purple-700 border-purple-200',
            'Other': 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return colors[category] || colors['Other'];
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-indigo-600 p-2 rounded-xl transition-transform group-hover:scale-110">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                            UniTrade
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/lost-found')}
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold transition-all rounded-xl px-4 hidden sm:flex h-11 border border-transparent hover:border-rose-100"
                        >
                            <HelpCircle className="mr-2 h-4 w-4" /> Lost & Found
                        </Button>
                        <Button
                            onClick={() => navigate('/add-product')}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:translate-y-[-2px] active:translate-y-[0px] rounded-xl px-6 hidden sm:flex h-11"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Sell Item
                        </Button>

                        <div className="flex items-center gap-5 pl-6 border-l border-slate-100 ml-2">
                            <div
                                onClick={() => navigate('/profile')}
                                className="flex items-center gap-3 cursor-pointer group pr-2 py-1 rounded-full hover:bg-slate-50 transition-all"
                            >
                                <Avatar className="h-11 w-11 ring-2 ring-indigo-50 group-hover:ring-indigo-100 transition-all shadow-sm border border-white">
                                    <AvatarImage src={currentUser?.profilePhoto} className="object-cover" />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold">
                                        {currentUser?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:flex flex-col items-start leading-none">
                                    <span className="text-sm font-bold text-slate-900">{currentUser?.name?.split(' ')[0]}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">My Profile</span>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/profile')}
                                className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors rounded-full h-10 w-10 border border-transparent hover:border-indigo-100"
                            >
                                <MessageSquare className="h-5 w-5" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors rounded-full h-10 w-10 border border-transparent hover:border-rose-100"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="relative mb-12 bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl shadow-indigo-100">
                    <div className="relative z-10 max-w-2xl text-white">
                        <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                            IIIT Bhubaneswar Exclusive
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
                            The Student <span className="text-indigo-200">Marketplace</span>.
                        </h2>
                        <p className="text-indigo-100 text-lg font-medium opacity-90 max-w-lg">
                            Safe, fast, and easy. Buy and sell with your peers directly on campus.
                        </p>
                    </div>
                    <div className="absolute right-[-10%] top-[-20%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute left-[30%] bottom-[-40%] w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        <p className="text-slate-500 font-medium">Fetching the latest items...</p>
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-2xl text-center font-medium shadow-sm">
                        {error}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200 shadow-sm">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">No items available yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-3 text-lg">
                            Be the hero of campus! Start listing items you no longer need.
                        </p>
                        <Button
                            onClick={() => navigate('/add-product')}
                            className="mt-8 bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-slate-50 font-bold px-8 rounded-xl h-12 shadow-sm"
                        >
                            Start Selling Now
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Card key={product._id} className="group overflow-hidden border-slate-200 hover:border-indigo-200 hover:shadow-2xl transition-all duration-300 rounded-[1.5rem] bg-white">
                                <div className="aspect-[4/3] relative overflow-hidden bg-slate-50">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    <Badge className={`absolute top-4 left-4 border backdrop-blur-md shadow-sm ${getCategoryColor(product.category)}`}>
                                        {product.category}
                                    </Badge>
                                </div>
                                <CardHeader className="p-6 pb-2">
                                    <div className="flex flex-col space-y-2">
                                        <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                            {product.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-2xl font-black text-indigo-600">₹{product.price}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 line-clamp-2 mt-3 text-sm leading-relaxed">{product.description}</p>
                                </CardHeader>
                                <CardContent className="p-6 pt-0 space-y-5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                            <span>{product.condition} Months old</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-xs font-bold text-slate-900 truncate">
                                                {product.owner.name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">Verified Seller</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 pt-0">
                                    <Button
                                        onClick={() => {
                                            const sellerId = (product.owner._id || product.owner).toString();
                                            if (currentUser?._id?.toString() === sellerId) {
                                                alert("You cannot chat with yourself about your own product!");
                                                return;
                                            }
                                            navigate(`/chat/${sellerId}`);
                                        }}
                                        className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl py-6 font-bold transition-all shadow-md group-hover:translate-y-[-2px]"
                                    >
                                        Chat with Seller
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-20 py-16 border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-center space-y-6">
                    <p className="text-center text-slate-500 font-bold">
                        © 2026 UniTrade IIIT-BH. Built with <Heart className="inline h-4 w-4 text-rose-500 fill-rose-500 mx-1" /> for students.
                    </p>
                    <div
                        onClick={() => navigate('/developer')}
                        className="group flex items-center gap-2 cursor-pointer text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm"
                    >
                        <span>Meet the Developer</span>
                        <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
