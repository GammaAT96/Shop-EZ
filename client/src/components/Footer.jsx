import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                <div className="space-y-6">
                    <span className="font-black text-3xl tracking-tighter text-white drop-shadow-sm">ShopEZ.</span>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                        The ultimate destination for premium quality products. We focus on curating exactly what you need with an uncompromised experience.
                    </p>
                    <div className="flex space-x-4 text-slate-400">
                        <a href="#" className="hover:text-white hover:-translate-y-1 transition-all"><Facebook className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white hover:-translate-y-1 transition-all"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white hover:-translate-y-1 transition-all"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white hover:-translate-y-1 transition-all"><Youtube className="w-5 h-5" /></a>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-white font-semibold tracking-wide uppercase text-sm">Shop</h3>
                    <ul className="space-y-3 text-sm font-medium">
                        <li><a href="#" className="hover:text-white transition-colors">Women's Clothing</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Men's Fashion</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Electronics & Tech</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Home & Living</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Beauty & Health</a></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="text-white font-semibold tracking-wide uppercase text-sm">Company</h3>
                    <ul className="space-y-3 text-sm font-medium">
                        <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="text-white font-semibold tracking-wide uppercase text-sm">Stay in the loop</h3>
                    <p className="text-slate-400 text-sm">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                    <form className="flex space-x-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-slate-900 border border-slate-800 text-sm rounded-lg flex-grow px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-all shadow-inner"
                        />
                        <button className="bg-white text-slate-900 px-4 py-2.5 rounded-lg text-sm font-bold shadow hover:bg-slate-200 transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
                <p>&copy; {new Date().getFullYear()} ShopEZ Inc. All rights reserved.</p>
                <p className="flex items-center gap-1 mt-4 md:mt-0">Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Antigravity</p>
            </div>
        </footer>
    );
}
