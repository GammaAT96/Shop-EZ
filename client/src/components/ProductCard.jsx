import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
    const isOutOfStock = product.stock <= 0;

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="h-full"
        >
            <Card className="overflow-hidden h-full flex flex-col">
                <Link to={`/product/${product._id}`} className="relative aspect-square overflow-hidden bg-muted block">
                    <img
                        src={product.thumbnailUrl || product.imageUrls?.[0] || 'https://via.placeholder.com/500'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                    )}
                    {product.discountPercentage > 0 && (
                        <div className="absolute top-2 right-2">
                            <Badge variant="destructive">-{product.discountPercentage}%</Badge>
                        </div>
                    )}
                </Link>
                <CardContent className="p-4 flex-1 flex flex-col">
                    <Badge variant="outline" className="w-fit mb-2">{product.category}</Badge>
                    <Link to={`/product/${product._id}`}>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{product.rating || '0.0'}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviews || 0})</span>
                    </div>
                    <div className="mt-auto pt-2">
                        <div className="flex items-end gap-2 mb-3">
                            <p className="text-2xl font-bold text-primary">${product.price}</p>
                            {product.discountPercentage > 0 && (
                                <p className="text-sm text-muted-foreground line-through mb-1">
                                    ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                                </p>
                            )}
                        </div>
                        <Button
                            className="w-full"
                            onClick={(e) => {
                                e.preventDefault();
                                onAddToCart(product);
                            }}
                            disabled={isOutOfStock}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
