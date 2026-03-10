import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
    ShoppingCart,
    Package,
    BarChart3,
    Shield,
    Zap,
    Users,
    Check,
    Star,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    ArrowRight,
    TrendingUp,
    CreditCard,
    Truck
} from 'lucide-react';

const EcommerceLandingPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const features = [
        {
            icon: <ShoppingCart className="w-10 h-10 text-primary" />,
            title: "Smart Shopping Cart",
            description: "Advanced cart management with real-time updates, saved items, and seamless checkout experience."
        },
        {
            icon: <Package className="w-10 h-10 text-primary" />,
            title: "Product Management",
            description: "Comprehensive product catalog with inventory tracking, variants, and automated stock alerts."
        },
        {
            icon: <BarChart3 className="w-10 h-10 text-primary" />,
            title: "Analytics Dashboard",
            description: "Powerful insights into sales, customer behavior, and performance metrics in real-time."
        },
        {
            icon: <Shield className="w-10 h-10 text-primary" />,
            title: "Secure Payments",
            description: "PCI-compliant payment processing with multiple payment gateways and fraud protection."
        },
        {
            icon: <Truck className="w-10 h-10 text-primary" />,
            title: "Order Tracking",
            description: "Complete order lifecycle management with automated notifications and tracking updates."
        },
        {
            icon: <Users className="w-10 h-10 text-primary" />,
            title: "Customer Management",
            description: "Build lasting relationships with customer profiles, purchase history, and loyalty programs."
        }
    ];



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4" variant="secondary">
                            <Zap className="w-3 h-3 mr-1" />
                            Trusted by 10,000+ businesses
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                            Build Your Dream
                            <span className="text-primary"> E-Commerce Store</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Launch, manage, and grow your online business with our powerful all-in-one platform. No coding required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                Watch Demo
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            No credit card required • 14-day free trial • Cancel anytime
                        </p>
                    </div>
                </div>
            </section>

            {/* Proof Section */}
            <section className="py-16 border-b border-border bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <TrendingUp className="w-6 h-6 text-primary mr-2" />
                                <div className="text-3xl md:text-4xl font-bold text-foreground">$2.5B+</div>
                            </div>
                            <p className="text-muted-foreground">Total Sales Processed</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Users className="w-6 h-6 text-primary mr-2" />
                                <div className="text-3xl md:text-4xl font-bold text-foreground">10K+</div>
                            </div>
                            <p className="text-muted-foreground">Active Merchants</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <ShoppingCart className="w-6 h-6 text-primary mr-2" />
                                <div className="text-3xl md:text-4xl font-bold text-foreground">50M+</div>
                            </div>
                            <p className="text-muted-foreground">Orders Fulfilled</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Star className="w-6 h-6 text-primary mr-2" />
                                <div className="text-3xl md:text-4xl font-bold text-foreground">4.9/5</div>
                            </div>
                            <p className="text-muted-foreground">Customer Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge className="mb-4" variant="outline">Features</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed to help you sell more and manage your business efficiently
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="mb-4">{feature.icon}</div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>



            {/* Contact Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge className="mb-4" variant="outline">Contact</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <div>
                            <Card className="border-border">
                                <CardHeader>
                                    <CardTitle>Send us a message</CardTitle>
                                    <CardDescription>Fill out the form and we'll get back to you within 24 hours</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="Your name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="your@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us how we can help..."
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <Card className="border-border">
                                <CardContent className="pt-6">
                                    <div className="flex items-start">
                                        <Mail className="w-6 h-6 text-primary mr-4 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Email</h3>
                                            <p className="text-muted-foreground">support@ecommerce.com</p>
                                            <p className="text-muted-foreground">sales@ecommerce.com</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-border">
                                <CardContent className="pt-6">
                                    <div className="flex items-start">
                                        <Phone className="w-6 h-6 text-primary mr-4 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Phone</h3>
                                            <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                            <p className="text-sm text-muted-foreground">Mon-Fri 9am-6pm EST</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-border">
                                <CardContent className="pt-6">
                                    <div className="flex items-start">
                                        <MapPin className="w-6 h-6 text-primary mr-4 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Office</h3>
                                            <p className="text-muted-foreground">123 Commerce Street</p>
                                            <p className="text-muted-foreground">San Francisco, CA 94102</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted/50 border-t border-border py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <ShoppingCart className="w-8 h-8 text-primary mr-2" />
                                <span className="text-xl font-bold text-foreground">EcomPlatform</span>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                The all-in-one e-commerce solution for modern businesses.
                            </p>
                            <div className="flex gap-3">
                                <Button size="icon" variant="outline">
                                    <Facebook className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="outline">
                                    <Twitter className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="outline">
                                    <Instagram className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="outline">
                                    <Linkedin className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Status</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                            © 2024 EcomPlatform. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default EcommerceLandingPage;
