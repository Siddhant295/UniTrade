import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Package, ArrowLeft, Upload, FileImage } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        condition: '', // Months old
        category: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleCategoryChange = (val) => {
        setFormData({ ...formData, category: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!imageFile) {
            setError('Please upload an image of the product');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('condition', formData.condition);
            data.append('category', formData.category);
            data.append('image', imageFile);

            const response = await axios.post('http://localhost:5000/api/products', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.status === 'success') {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => navigate('/')} className="mb-2">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
                </Button>

                <Card className="shadow-sm border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">List an Item</CardTitle>
                        <CardDescription>Sell your pre-loved items to fellow students.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md flex items-center gap-2 mb-6 text-sm">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Engineering Mathematics Textbook"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="h-11"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (₹)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        placeholder="500"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="condition">Age (Months old)</Label>
                                    <Input
                                        id="condition"
                                        name="condition"
                                        type="number"
                                        placeholder="6"
                                        required
                                        value={formData.condition}
                                        onChange={handleChange}
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={handleCategoryChange} required>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                        <SelectItem value="Books">Books</SelectItem>
                                        <SelectItem value="Furniture">Furniture</SelectItem>
                                        <SelectItem value="Clothing">Clothing</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Product Image</Label>
                                <div className="mt-2 border-2 border-dashed border-gray-200 rounded-xl p-4 transition-colors hover:border-gray-300">
                                    {previewUrl ? (
                                        <div className="relative group aspect-video rounded-lg overflow-hidden bg-gray-100">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => document.getElementById('imageUpload').click()}
                                                >
                                                    Change Image
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="imageUpload"
                                            className="flex flex-col items-center justify-center h-48 cursor-pointer"
                                        >
                                            <div className="p-3 bg-gray-100 rounded-full mb-3">
                                                <Upload className="h-6 w-6 text-gray-500" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Click to upload from device</span>
                                            <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                                        </label>
                                    )}
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe the condition, usage, and any other details..."
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="resize-none"
                                />
                            </div>

                            <Button type="submit" className="w-full h-11 bg-black text-white hover:bg-gray-800 font-medium" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Post Product'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddProduct;
