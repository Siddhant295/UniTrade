import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Loader2,
    Search,
    Plus,
    MapPin,
    Calendar,
    Tag,
    AlertCircle,
    CheckCircle2,
    Camera,
    ArrowLeft,
    Package,
    ShieldCheck,
    HelpCircle,
    User,
    MessageSquare,
    Mail
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const LostFound = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [showLostDialog, setShowLostDialog] = useState(false);
    const [claimDialogOpen, setClaimDialogOpen] = useState(false);
    const [selectedItemForClaim, setSelectedItemForClaim] = useState(null);
    const [claimNote, setClaimNote] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'found',
        category: '',
        location: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
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

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/lost-found');
            setItems(response.data.data.items);
        } catch (err) {
            console.error('Failed to fetch items');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' && formData[key]) {
                data.append('image', formData[key]);
            } else if (key !== 'image') {
                data.append(key, formData[key]);
            }
        });

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/lost-found', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowLostDialog(false);
            fetchItems();
            // Reset form
            setFormData({ title: '', description: '', type: 'found', category: '', location: '', image: null });
            setImagePreview(null);
        } catch (err) {
            alert('Failed to report item. Please make sure you are logged in.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClaim = async () => {
        if (!claimNote) return alert('Please provide a description to verify ownership.');

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/lost-found/${selectedItemForClaim._id}/claim`,
                { claimNote },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setClaimDialogOpen(false);
            setClaimNote('');
            fetchItems();
        } catch (err) {
            alert('Failed to claim item.');
        }
    };

    const filteredItems = filterType === 'all'
        ? items
        : items.filter(item => item.type === filterType);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <Loader2 className="h-10 w-10 animate-spin text-rose-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-rose-600 p-2 rounded-xl">
                            <HelpCircle className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-orange-600">
                            Lost & Found
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/')}
                            className="text-slate-600 font-bold hover:bg-slate-50"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Marketplace
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/profile')}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors rounded-full h-10 w-10 border border-transparent hover:border-rose-100"
                        >
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                        <Dialog open={showLostDialog} onOpenChange={setShowLostDialog}>
                            <DialogTrigger asChild>
                                <Button className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100 rounded-xl px-6">
                                    <Plus className="mr-2 h-4 w-4" /> Report Item
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black text-slate-800">Report an Item</DialogTitle>
                                    <DialogDescription className="font-medium text-slate-500">
                                        Found something? Or lost something? Let the campus know.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Type</label>
                                            <Select
                                                onValueChange={(v) => setFormData({ ...formData, type: v })}
                                                defaultValue="found"
                                            >
                                                <SelectTrigger className="rounded-xl border-slate-200">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="lost">I Lost Something</SelectItem>
                                                    <SelectItem value="found">I Found Something</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Category</label>
                                            <Select onValueChange={(v) => setFormData({ ...formData, category: v })}>
                                                <SelectTrigger className="rounded-xl border-slate-200">
                                                    <SelectValue placeholder="Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {['Electronics', 'Books', 'Identification', 'Keys', 'Clothing', 'Accessories', 'Other'].map(cat => (
                                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Item Name</label>
                                        <Input
                                            placeholder="What did you lose/find?"
                                            className="rounded-xl border-slate-200"
                                            required
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Location</label>
                                        <Input
                                            placeholder="Where? (e.g. Audi, Canteen, Block-A)"
                                            className="rounded-xl border-slate-200"
                                            required
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Description</label>
                                        <Textarea
                                            placeholder="Describe the item (color, brand, unique marks...)"
                                            className="rounded-xl border-slate-200 min-h-[100px]"
                                            required
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Photo (Optional)</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:bg-slate-50 transition-colors h-32 relative overflow-hidden">
                                                {imagePreview ? (
                                                    <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                                                ) : (
                                                    <>
                                                        <Camera className="h-8 w-8 text-slate-400 mb-2" />
                                                        <span className="text-xs font-bold text-slate-400">Upload Photo</span>
                                                    </>
                                                )}
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 font-black text-lg"
                                            disabled={submitting}
                                        >
                                            {submitting ? <Loader2 className="animate-spin" /> : 'Report Item'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Hero Section */}
                <div className="mb-12 bg-gradient-to-br from-rose-600 to-orange-500 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-rose-100">
                    <div className="relative z-10 max-w-2xl">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-6 px-4 py-1">Campus Community</Badge>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none">
                            Help Others find <br /> what they lost.
                        </h1>
                        <p className="text-rose-50 text-xl font-medium max-w-md opacity-90 leading-relaxed">
                            Lost an item? Found something? Report it here. Items can be claimed and picked up from the <strong>Lost & Found Department</strong>.
                        </p>
                    </div>
                    <div className="absolute right-[-5%] bottom-[-10%] opacity-10">
                        <HelpCircle size={400} />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-10">
                    {[
                        { label: 'All Items', value: 'all' },
                        { label: 'Lost Items', value: 'lost' },
                        { label: 'Found Items', value: 'found' }
                    ].map(tab => (
                        <Button
                            key={tab.value}
                            onClick={() => setFilterType(tab.value)}
                            className={`rounded-2xl px-8 h-12 font-bold transition-all ${filterType === tab.value
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'
                                }`}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Items Grid */}
                {filteredItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">No items found</h3>
                        <p className="text-slate-500 font-medium">Be the first to help someone today.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <Card key={item._id} className="group border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white transition-all hover:translate-y-[-8px]">
                                <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                                            <Package className="h-16 w-16 mb-2 opacity-50" />
                                            <span className="text-xs font-black uppercase tracking-widest">No Image Provided</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <Badge className={`px-4 py-1.5 rounded-full border-none font-black text-[10px] uppercase tracking-wider shadow-lg ${item.type === 'lost' ? 'bg-rose-500 text-white' : 'bg-orange-500 text-white'
                                            }`}>
                                            {item.type.toUpperCase()}
                                        </Badge>
                                        {item.status !== 'active' && (
                                            <Badge className="px-4 py-1.5 rounded-full border-none font-black bg-emerald-500 text-white shadow-lg">
                                                {item.status.toUpperCase()}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <CardHeader className="p-6 pb-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                        <Tag className="h-3 w-3" />
                                        {item.category}
                                    </div>
                                    <CardTitle className="text-xl font-black text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                                        {item.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 space-y-4">
                                    <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </p>
                                    <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-slate-600 text-[13px] font-bold">
                                            <MapPin className="h-4 w-4 text-rose-500" />
                                            {item.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 text-[12px] font-medium">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(item.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 pt-2 flex gap-3">
                                    {item.status === 'active' ? (
                                        <>
                                            <Button
                                                onClick={() => {
                                                    setSelectedItemForClaim(item);
                                                    setClaimDialogOpen(true);
                                                }}
                                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl h-12 font-black transition-all"
                                            >
                                                {item.type === 'found' ? 'Claim' : 'I Found it'}
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    const reporterId = (item.reporter._id || item.reporter).toString();
                                                    if (currentUser?._id?.toString() === reporterId) {
                                                        alert("You cannot chat with yourself!");
                                                        return;
                                                    }
                                                    navigate(`/chat/${reporterId}`);
                                                }}
                                                className="bg-slate-900 hover:bg-rose-600 text-white rounded-2xl h-12 w-16 font-black shadow-lg transition-all flex items-center justify-center p-0"
                                            >
                                                <MessageSquare className="h-5 w-5" />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 font-black text-sm">
                                            <ShieldCheck className="h-4 w-4" />
                                            SECURED BY OFFICE
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Claim Dialog */}
            <Dialog open={claimDialogOpen} onOpenChange={setClaimDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-800">Verify Ownership</DialogTitle>
                        <DialogDescription className="font-medium text-slate-500">
                            Tell us a unique detail about this item to verify it's yours.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-xs font-black uppercase text-slate-400 mb-1">Item Title</p>
                            <p className="font-bold text-slate-700">{selectedItemForClaim?.title}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Verification Note</label>
                            <Textarea
                                placeholder="e.g. Serial number, specific wallpaper, scratch on left side..."
                                className="rounded-xl border-slate-200 min-h-[120px]"
                                value={claimNote}
                                onChange={e => setClaimNote(e.target.value)}
                            />
                        </div>
                        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex gap-3">
                            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                            <p className="text-[12px] font-medium text-rose-800">
                                Once claimed, the item will be moved to the <strong>Office</strong>. Verification will be done by the Lost & Found department at the desk.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleClaim}
                            className="w-full bg-slate-900 hover:bg-rose-600 text-white rounded-xl h-12 font-black text-lg"
                        >
                            Submit Claim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LostFound;
