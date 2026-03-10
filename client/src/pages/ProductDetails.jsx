import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck, ArrowLeft, Star, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { userInfo } = useAuth();
    const { fetchCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCartHandler = async () => {
        if (!userInfo) {
            window.location.href = '/login';
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post('/api/cart', {
                productId: product._id,
                quantity: quantity
            }, config);

            await fetchCart();
            navigate('/cart');
        } catch (error) {
            console.error("Failed adding to cart", error);
            alert("Error adding to cart.");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return <div className="text-center py-24 min-h-screen pt-40 font-bold text-2xl text-muted-foreground">Product Not Found</div>;

    return (
        <div className="bg-background min-h-screen pt-12 pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/shop">
                    <Button variant="ghost" className="mb-8 gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Catalog
                    </Button>
                </Link>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Image Gallery */}
                    <div className="lg:w-1/2">
                        <div className="aspect-square bg-muted rounded-2xl overflow-hidden shadow-sm border border-border sticky top-32">
                            <img
                                src={product.thumbnailUrl || product.imageUrls?.[0] || "https://images.unsplash.com/photo-1531306728370-53bf9ce8cb6d?auto=format&fit=crop&q=80"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {product.discountPercentage > 0 && (
                                <div className="absolute top-4 left-4">
                                    <Badge variant="destructive" className="px-3 py-1 text-sm bg-red-600 text-white border-0 shadow-lg">
                                        {product.discountPercentage}% OFF
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:w-1/2 flex flex-col pt-4">
                        <div className="mb-6">
                            <Badge variant="outline" className="mb-4 tracking-wider uppercase">{product.category || 'Category'}</Badge>
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">{product.name}</h1>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold ml-2">{product.rating || '0.0'}</span>
                                </div>
                                <span className="text-muted-foreground underline">({product.reviews || 0} reviews)</span>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="mb-6 flex items-end gap-4">
                            <div className="text-4xl font-bold text-primary">
                                ${product.price.toFixed(2)}
                            </div>
                            {product.discountPercentage > 0 && (
                                <div className="text-xl text-muted-foreground line-through mb-1">
                                    ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                                </div>
                            )}
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Add To Cart Form */}
                        <div className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className={`font-semibold ${product.stock > 0 ? 'text-primary' : 'text-destructive'}`}>
                                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                                </span>
                            </div>

                            {product.stock > 0 && (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-border rounded-md w-32 max-w-full">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-r-none border-r border-border hover:bg-muted"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="flex-1 text-center font-semibold bg-background">{quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-l-none border-l border-border hover:bg-muted"
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <Button
                                size="lg"
                                onClick={addToCartHandler}
                                disabled={product.stock === 0}
                                className="w-full gap-2 text-md transition-transform active:scale-95"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 p-4 rounded-lg border border-border">
                                <Truck className="w-5 h-5" />
                                <span className="text-sm font-medium">Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 p-4 rounded-lg border border-border">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="text-sm font-medium">Money-back Guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
