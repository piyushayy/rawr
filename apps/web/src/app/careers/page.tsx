import CareerForm from "./CareerForm";

export default function CareersPage() {
    const roles = [
        {
            title: "Digital Stylist",
            location: "Remote / NYC",
            type: "Full-Time",
            description: "Curate the drops. Define the vibe. You need an eye for the weird and wonderful."
        },
        {
            title: "Supply Chain Ninja",
            location: "London",
            type: "Part-Time",
            description: "Manage the chaos of limited drops. Ensure the pack arrives before the hype dies."
        },
        {
            title: "Vibe Engineer (Frontend)",
            location: "Remote",
            type: "Contract",
            description: "If you can make a scrolling marquee look sick on a potato, we want you."
        }
    ];

    return (
        <div className="bg-rawr-white min-h-screen">
            <div className="container mx-auto px-4 py-20">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-5xl md:text-8xl font-heading font-black uppercase mb-8 leading-none">
                        Join the <span className="text-rawr-red">Pack.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-bold uppercase leading-relaxed">
                        We don&apos;t do corporate. We do chaos. <br />
                        We are building the future of cult commerce.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Role List */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-heading font-black uppercase mb-8 border-b-4 border-rawr-black inline-block">Open Roles</h2>

                        {roles.map((role, i) => (
                            <div key={i} className="border-2 border-rawr-black p-6 hover:bg-black hover:text-white transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-black uppercase">{role.title}</h3>
                                    <span className="border border-current px-2 py-1 text-xs font-bold uppercase">{role.type}</span>
                                </div>
                                <p className="font-bold text-lg mb-4">{role.location}</p>
                                <p className="font-body opacity-80 group-hover:opacity-100">{role.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Application Area */}
                    <div>
                        <h2 className="text-3xl font-heading font-black uppercase mb-8 border-b-4 border-rawr-black inline-block">Apply Now</h2>
                        <p className="mb-8 font-bold text-gray-600">
                            Select a role from the list (or just tell us what you do) and plead your case.
                        </p>

                        <CareerForm position="General Application" />
                    </div>
                </div>
            </div>
        </div>
    );
}
