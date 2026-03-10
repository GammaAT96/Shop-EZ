import React from 'react';
import { ShoppingBag, Shield, Truck, RefreshCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
    return (
        <footer className="bg-muted/50 border-t border-border mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">shopEZ</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your one-stop shop for everything you need.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>New Arrivals</li>
                            <li>Best Sellers</li>
                            <li>Sale</li>
                            <li>Categories</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Contact Us</li>
                            <li>FAQs</li>
                            <li>Shipping</li>
                            <li>Returns</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                </div>
                <Separator className="my-8" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2024 shopEZ. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        <Truck className="w-5 h-5 text-muted-foreground" />
                        <RefreshCcw className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
