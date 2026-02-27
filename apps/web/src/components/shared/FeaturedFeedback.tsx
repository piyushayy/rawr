import { Star } from "lucide-react";

const reviews = [
    { text: "Fast delivery and proper packaging. The cut is perfect and size chart is accurate. Will order again for sure.", author: "Pratik S.", verified: true },
    { text: "Material feels premium and comfortable. Took a little time to arrive but product quality makes up for it.", author: "Pritam D.", verified: true },
    { text: "Great experience overall. The drop looks exactly like the pictures. Proper packaging and smooth delivery.", author: "Rohit S.", verified: true },
    { text: "Quality is actually better than I expected. Fabric feels dense and printing is clean. Worth the wait.", author: "Manish K.", verified: true },
    { text: "One of the best underground stores. Fast delivery, good stitching and very responsive support team.", author: "Arnav K.", verified: false },
    { text: "Totally satisfied with my order. Fast delivery, clean printing, and comfortable fabric. This is my go-to now.", author: "Aditya M.", verified: true }
];

export function FeaturedFeedback() {
    return (
        <section className="bg-rawr-white border-t-2 border-rawr-black py-20 px-4">
            <div className="container mx-auto">
                <div className="flex flex-col items-center mb-16 text-center">
                    <h2 className="text-5xl md:text-7xl font-heading font-black text-rawr-black uppercase mb-4">
                        Cult Feedback
                    </h2>
                    <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-6 h-6 fill-rawr-red text-rawr-red" />
                        ))}
                    </div>
                    <p className="font-heading font-bold text-lg text-gray-500">Based on 1,400+ Trusted Reviews</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-white border-2 border-rawr-black p-6 shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#E60000] transition-all">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-4 h-4 fill-rawr-red text-rawr-red" />
                                ))}
                            </div>
                            <p className="font-body text-rawr-black text-lg font-medium leading-relaxed mb-6">&quot;{review.text}&quot;</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="font-heading font-black text-xl uppercase">{review.author}</span>
                                {review.verified && (
                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 uppercase border border-green-800">Verified</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
