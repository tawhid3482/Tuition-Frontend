import bgImage from "../../app/assets/gradient.jpg";

const DetailsCounter = () => {
    const stats = [
        { label: "Total Applied", value: "557449+" },
        { label: "Total Tutors", value: "141876+" },
        { label: "Live Tuition Jobs", value: "1473+" },
        { label: "Average Tutor Rating", value: "4.7" },
    ];

    return (
        <div className="relative w-full py-12 bg-gray-900 text-white overflow-hidden -top-14">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${bgImage.src})` }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                                {stat.value}
                            </h2>
                            <p className="text-sm md:text-base font-medium text-gray-200">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailsCounter;