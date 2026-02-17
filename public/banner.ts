import { BannerSlide } from "@/src/components/Banner/Banner";


export const bannerSlides: BannerSlide[] = [
    {
        id: "1",
        bgImage: "https://images.unsplash.com/photo-1496449904483-8e2f10a5a0b1?q=80&w=2070&auto=format&fit=crop",
        title: "Welcome to Our Platform",
        description: "Discover amazing features and services tailored just for you. Join us today and start your journey.",
        buttonText: "Get Started",
        buttonLink: "/signup",
        // rightImage is optional, so we omit it
    },
    {
        id: "2",
        bgImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
        title: "Learn from Experts",
        description: "Access high-quality courses and tutorials created by industry professionals.",
        buttonText: "Explore Courses",
        buttonLink: "/courses",
    },
    {
        id: "3",
        bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
        title: "Join Our Community",
        description: "Connect with like-minded individuals and grow together.",
        buttonText: "Join Now",
        buttonLink: "/community",
    },
];