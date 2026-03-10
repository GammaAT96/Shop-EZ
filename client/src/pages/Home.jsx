import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

export default function Home() {
    return (
        <div className="bg-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center bg-slate-50">
                <div className="absolute inset-0 z-0 bg-grid-pattern opacity-50"></div>

                {/* Decorative blob */}
                <div className="absolute top-1/4 right-0 transform translate-x-1/2 -translate-y-1/2 rounded-full w-[800px] h-[800px] bg-gradient-to-tr from-blue-100 to-indigo-50 blur-[100px] z-0 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col md:flex-row items-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="flex-1 space-y-8 text-center md:text-left pr-0 md:pr-12"
                    >
                        <motion.span
                            variants={fadeIn}
                            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold tracking-widest text-xs uppercase shadow-sm border border-blue-100"
                        >
                            2024 Collection
                        </motion.span>
                        <motion.h1
                            variants={fadeIn}
                            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]"
                        >
                            Redefine Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Everyday Style.</span>
                        </motion.h1>
                        <motion.p
                            variants={fadeIn}
                            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium"
                        >
                            Discover thousands of premium goods curated just for you. Quality materials, stunning designs, and fast delivery right to your door.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                            <Link to="/shop" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-xl shadow-slate-900/30 hover:bg-blue-600 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                                Start Shopping <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/shop" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 text-center">
                                View Lookbook
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50, rotate: 5 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex-1 mt-12 md:mt-0 relative hidden lg:block"
                    >
                        {/* Placeholder for Stunning Hero Image */}
                        <div className="relative w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-200/50 border-[8px] border-white">
                            <img
                                src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=2670"
                                alt="Fashion showcase"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>

                            {/* Floating tag */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4"
                            >
                                <div className="bg-yellow-400 p-2 rounded-full text-white">
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                                <div>
                                    <p className="text-slate-900 font-bold text-lg">Top Rated</p>
                                    <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">in 2024</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Row */}
            <section className="border-y border-slate-100 bg-white py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">Free Shipping</h4>
                            <p className="text-sm text-slate-500 font-medium">On orders over $99</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">Buyer Protection</h4>
                            <p className="text-sm text-slate-500 font-medium">Guaranteed authenticity</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                            <Star className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">Quality Assured</h4>
                            <p className="text-sm text-slate-500 font-medium">Hand-picked items</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">Secure Payment</h4>
                            <p className="text-sm text-slate-500 font-medium">Stripe encryptions</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories (Mock visuals) */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
                        <p className="mt-4 text-slate-500 font-medium">Explore our meticulously organized catalog and find exactly what fits your vibe today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Category 1 */}
                        <Link to="/shop?category=women" className="group relative h-96 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1500" alt="Women" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                                <div>
                                    <h3 className="text-white font-black text-2xl tracking-wide">Women</h3>
                                    <p className="text-slate-300 font-medium mt-1">1,200+ Products</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>

                        {/* Category 2 */}
                        <Link to="/shop?category=men" className="group relative h-96 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 mt-0 md:mt-12">
                            <img src="https://images.unsplash.com/photo-1505506874110-6a7a6c9924cb?auto=format&fit=crop&q=80&w=1500" alt="Men" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                                <div>
                                    <h3 className="text-white font-black text-2xl tracking-wide">Men</h3>
                                    <p className="text-slate-300 font-medium mt-1">940+ Products</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>

                        {/* Category 3 */}
                        <Link to="/shop?category=accessories" className="group relative h-96 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                            <img src="https://images.unsplash.com/photo-1446976214159-823656efa488?auto=format&fit=crop&q=80&w=1500" alt="Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                                <div>
                                    <h3 className="text-white font-black text-2xl tracking-wide">Accessories</h3>
                                    <p className="text-slate-300 font-medium mt-1">500+ Products</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
