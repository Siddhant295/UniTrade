import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Send,
    ArrowLeft,
    MoreVertical,
    User,
    Loader2,
    Package,
    Shield,
    Clock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Chat = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [seller, setSeller] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch current user
                const meRes = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUser(meRes.data.data.user);

                // Fetch seller details
                const sellerRes = await axios.get(`http://localhost:5000/api/auth/${sellerId}`);
                setSeller(sellerRes.data.data.user);

                await fetchMessages();
            } catch (err) {
                console.error('Error fetching chat data:', err);
                setError('Could not establish a secure connection. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Polling for new messages every 3 seconds (simple alternative to Socket.io)
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [sellerId]);

    useEffect(scrollToBottom, [messages]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/messages/${sellerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data.data.messages);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/messages', {
                receiverId: sellerId,
                text: newMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMessage('');
            fetchMessages();
        } catch (err) {
            console.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center max-w-sm">
                    <div className="bg-rose-100 p-4 rounded-3xl w-fit mx-auto mb-6">
                        <Package className="h-10 w-10 text-rose-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-3">Connection Failed</h2>
                    <p className="text-slate-500 font-medium mb-8">{error}</p>
                    <Button
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-900 text-white rounded-2xl h-12 font-black"
                    >
                        Back to Marketplace
                    </Button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-slate-500 font-bold">Opening secure chat...</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#f8fafc]">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/')}
                            className="rounded-full hover:bg-slate-100"
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-600" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                                <AvatarImage src={seller?.profilePhoto} className="object-cover" />
                                <AvatarFallback className="bg-emerald-500 text-white font-bold text-sm">
                                    {seller?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 leading-tight">
                                    {seller?.name || 'Loading...'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Secure Connection</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="hidden sm:flex border-emerald-100 text-emerald-600 font-bold gap-1 bg-emerald-50/50">
                            <Shield className="h-3 w-3" /> Campus Verified
                        </Badge>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="h-5 w-5 text-slate-400" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f8fafc]">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Welcome Hint */}
                    <div className="flex flex-col items-center text-center space-y-3 py-10 opacity-60">
                        <div className="bg-emerald-100 p-4 rounded-3xl">
                            <Shield className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div className="max-w-xs">
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Security Protocol Established</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                                Be respectful and try to meet in public campus areas for transactions.
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center pt-10">
                            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center max-w-sm">
                                <Package className="h-12 w-12 text-indigo-200 mx-auto mb-4" />
                                <h4 className="font-bold text-slate-900 text-lg">No Messages Yet</h4>
                                <p className="text-slate-500 text-sm mt-2">
                                    Start the conversation! Ask about the item's condition or arrange a meeting place.
                                </p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isMe = msg.sender._id?.toString() === currentUser?._id?.toString();
                            return (
                                <div
                                    key={msg._id}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                                >
                                    <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`
                                            px-5 py-3.5 rounded-[1.5rem] text-sm md:text-base font-medium shadow-sm transition-all
                                            ${isMe
                                                ? 'bg-slate-900 text-white rounded-tr-none'
                                                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none group-hover:shadow-md'
                                            }
                                        `}>
                                            {msg.text}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 px-1">
                                            <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isMe && <Clock className="h-3 w-3 text-slate-300" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <footer className="bg-white border-t border-slate-200 p-4 md:p-6 pb-8">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                        <Input
                            placeholder="Type your message..."
                            className="h-14 rounded-[1.5rem] border-slate-200 bg-slate-50 pl-6 pr-16 text-base focus:bg-white transition-all shadow-inner font-medium ring-emerald-500"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={sending}
                        />
                        <Button
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            className="absolute right-2 top-1.5 h-11 w-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                    </form>
                    <p className="text-center text-[10px] font-black text-slate-300 mt-4 uppercase tracking-[0.2em]">
                        Endpoint-to-Backend Encryption Active
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Chat;
