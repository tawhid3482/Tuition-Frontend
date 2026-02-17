import { BannerSlide } from "@/src/components/Banner/Banner";

// data/bannerData.ts
export const bannerSlides: BannerSlide[] = [
    {
        id: "1",
        bgImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
        title: "Welcome to Our Platform",
        description: "Discover amazing features and services tailored just for you. Join us today and start your journey.",
        buttonText: "Get Started",
        buttonLink: "/signup",
        rightImage: "https://images.unsplash.com/photo-1573164713988-2485fc6d8e2a?q=80&w=2069&auto=format&fit=crop",
    },
    {
        id: "2",
        bgImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
        title: "Learn from Experts",
        description: "Access high-quality courses and tutorials created by industry professionals.",
        buttonText: "Explore Courses",
        buttonLink: "/courses",
        rightImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    },
    {
        id: "3",
        bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
        title: "Join Our Community",
        description: "Connect with like-minded individuals and grow together.",
        buttonText: "Join Now",
        buttonLink: "/community",
        rightImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    },
];