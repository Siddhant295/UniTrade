import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Github,
    Linkedin,
    Twitter,
    ArrowLeft,
    Heart,
    Code2,
    Briefcase,
    GraduationCap,
    Cpu,
    Sparkles,
    Terminal,
    Globe,
    Layers,
    Mail,
    Binary,
    Loader2,
    Send
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Developer = () => {
    const navigate = useNavigate();
    const [contactOpen, setContactOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await axios.post('http://localhost:5000/api/contact', contactForm);
            alert('Message sent successfully!');
            setContactOpen(false);
            setContactForm({ name: '', email: '', message: '' });
        } catch (err) {
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const socialLinks = [
        {
            name: 'GitHub',
            icon: <Github className="h-5 w-5" />,
            url: 'https://github.com/Siddhant295',
            color: 'bg-slate-900 text-white hover:bg-slate-800'
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin className="h-5 w-5" />,
            url: 'https://www.linkedin.com/in/siddhant-srivastav-8a5877229/',
            color: 'bg-blue-600 text-white hover:bg-blue-700'
        },
        {
            name: 'Leetcode',
            icon: <Binary className="h-5 w-5" />,
            url: 'https://leetcode.com/u/sid_295/',
            color: 'bg-orange-500 text-white hover:bg-orange-600'
        },
        {
            name: 'Twitter',
            icon: <Twitter className="h-5 w-5" />,
            url: 'https://x.com/SiddhantS33207',
            color: 'bg-sky-500 text-white hover:bg-sky-600'
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Inter'] selection:bg-emerald-100 selection:text-emerald-900">
            {/* Header Area */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-slate-900 p-2 rounded-xl text-white">
                            <Code2 className="h-6 w-6" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                            The Architect
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="text-slate-600 font-bold hover:bg-slate-50 rounded-xl"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to App
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Hero Profile Section */}
                <div className="mb-12 bg-gradient-to-br from-slate-900 to-zinc-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-[2.5rem] blur-2xl"></div>
                            <Avatar className="h-48 w-48 md:h-64 md:w-64 rounded-[2.5rem] ring-[12px] ring-white/10 shadow-2xl relative z-10">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-white text-slate-950 text-6xl font-black rounded-none">
                                    SS
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl z-20">
                                <Sparkles className="h-6 w-6 text-emerald-500" />
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-4">
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-sm px-4 py-1 uppercase tracking-[0.2em] font-black text-[10px]">Developer</Badge>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                                Siddhant <br /> Srivastav
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                                <div className="flex items-center gap-2 text-slate-300 font-bold">
                                    <GraduationCap className="h-5 w-5" />
                                    <span>IIIT Bhubaneswar</span>
                                </div>
                                <div className="h-5 w-px bg-white/20 hidden md:block"></div>
                                <div className="flex items-center gap-2 text-slate-300 font-bold">
                                    <Briefcase className="h-5 w-5" />
                                    <span>Quantiphi Engineer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Background Icon */}
                    <div className="absolute right-[-5%] bottom-[-10%] opacity-10 pointer-events-none">
                        <Terminal size={400} />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* About Card */}
                    <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="p-10 pb-2">
                            <CardTitle className="text-3xl font-black text-slate-900">About Me</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 pt-4 space-y-8">
                            <div className="space-y-4">
                                <p className="text-xl text-slate-700 leading-relaxed">
                                    I am a <span className="font-bold text-emerald-600">Framework Engineer at Quantiphi</span>, where I focus on building scalable, industry-grade architectural solutions.
                                </p>
                                <p className="text-lg text-slate-500 leading-relaxed">
                                    My approach combines technical precision with a passion for clean, community-driven software. With a strong academic foundation from <span className="text-slate-900 font-semibold">IIIT Bhubaneswar</span>, I've dedicated myself to engineering platforms like <span className="text-slate-900 font-semibold">UniTrade</span> that solve real-world student challenges through modern design and robust code.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-4 py-2 rounded-xl font-bold flex gap-2 items-center">
                                    <Layers className="h-4 w-4" /> Framework Engineering
                                </Badge>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-4 py-2 rounded-xl font-bold flex gap-2 items-center">
                                    <Globe className="h-4 w-4" /> Quantiphi
                                </Badge>
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none px-4 py-2 rounded-xl font-bold flex gap-2 items-center">
                                    <Cpu className="h-4 w-4" /> Full-Stack Development
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Socials & Contact Card */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white flex flex-col">
                        <CardHeader className="p-10 pb-4">
                            <CardTitle className="text-3xl font-black text-slate-800">Connect</CardTitle>
                            <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Digital Presence</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-4 flex-1 space-y-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center justify-between p-5 rounded-2xl transition-all hover:scale-[1.02] shadow-sm ${social.color}`}
                                >
                                    <div className="flex items-center gap-4">
                                        {social.icon}
                                        <span className="font-bold uppercase tracking-wider text-sm">{social.name}</span>
                                    </div>
                                    <Cpu className="h-4 w-4 opacity-40" />
                                </a>
                            ))}
                            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                                <DialogTrigger asChild>
                                    <button
                                        className="w-full mt-6 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center block group hover:bg-emerald-600 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <Mail className="h-4 w-4 text-emerald-600 group-hover:text-white transition-colors" />
                                            <p className="text-sm font-bold text-emerald-700 group-hover:text-white transition-colors">Send Message</p>
                                        </div>
                                        <p className="text-[11px] text-emerald-400 group-hover:text-emerald-100 uppercase tracking-widest font-black transition-colors">Direct via Page</p>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] rounded-[2.5rem]">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black text-slate-800">Message Siddhant</DialogTitle>
                                        <DialogDescription className="font-medium text-slate-500">
                                            Have a concern or just want to say hi? Send a message directly.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleContactSubmit} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Your Name</label>
                                            <Input
                                                placeholder="Enter your name"
                                                className="rounded-xl border-slate-200 h-12"
                                                required
                                                value={contactForm.name}
                                                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Your Email</label>
                                            <Input
                                                type="email"
                                                placeholder="where can I reply?"
                                                className="rounded-xl border-slate-200 h-12"
                                                required
                                                value={contactForm.email}
                                                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Message</label>
                                            <Textarea
                                                placeholder="Type your concern here..."
                                                className="rounded-[1.5rem] border-slate-200 min-h-[150px] p-4"
                                                required
                                                value={contactForm.message}
                                                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={sending}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 font-black text-lg transition-all shadow-xl shadow-emerald-100"
                                        >
                                            {sending ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-5 w-5" />}
                                            {sending ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Footer */}
                <div className="flex flex-col items-center justify-center space-y-4 py-8 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                        Developed with <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" /> at <span className="text-slate-900">IIIT BH</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Developer;
