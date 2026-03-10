import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const HeroBanner = () => {
    return (
        <div className="relative bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 overflow-hidden">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-4 text-xs tracking-wider">NEW ARRIVALS</Badge>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                            Shop the Latest Trends
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Discover amazing products at unbeatable prices. Free shipping on orders over $50.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/shop">
                                <Button size="lg" className="gap-2">
                                    Shop Now <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link to="/shop">
                                <Button size="lg" variant="outline">
                                    View Deals
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-l from-primary to-transparent" />
            </div>
        </div>
    );
};

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { fetchCart } = useCart();
    const { userInfo } = useAuth();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const { data } = await axios.get('/api/products?page=1&limit=8');
                setFeaturedProducts(data.products || data);
            } catch (err) {
                console.error("Failed to load featured products", err);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const handleAddToCart = async (product) => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post('/api/cart', {
                productId: product._id,
                quantity: 1
            }, config);
            await fetchCart();
        } catch (error) {
            console.error("Failed adding to cart", error);
        }
    };

    return (
        <div className="bg-background">
            <HeroBanner />

            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">Featured Products</h2>
                    <Button variant="outline" asChild>
                        <Link to="/shop">View All</Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            ))
                        ) : (
                            <p className="text-muted-foreground col-span-full text-center">No products found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
