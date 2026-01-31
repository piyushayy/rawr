"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="bg-rawr-black text-rawr-white min-h-screen">
            <div className="container mx-auto px-4 py-24">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-8xl md:text-[12rem] font-heading font-black leading-[0.8] mb-12 text-rawr-red mix-blend-screen opacity-90">
                        WHY<br />WE<br />EXIST
                    </h1>

                    <div className="space-y-12 font-heading text-2xl md:text-4xl uppercase leading-tight tracking-wide border-l-4 border-rawr-white pl-8 md:pl-16">
                        <p>
                            Fashion is dead. It was killed by mass production, fast trends, and the endless cycle of waste.
                        </p>
                        <p className="text-rawr-red">
                            We are the resurrection.
                        </p>
                        <p>
                            Rawr Store is not a shop. It is an archive of the forgotten. We curate the pieces that have soul, the ones that survived the landfill to tell a story.
                        </p>
                        <p>
                            We believe in <span className="underline decoration-rawr-red underline-offset-8">scarcity</span>.
                            We believe in <span className="underline decoration-rawr-red underline-offset-8">intent</span>.
                            If you buy something from us, it&apos;s because you felt it. Not because an algorithm told you to.
                        </p>
                    </div>

                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {["Curated", "Sustainable", "Radical"].map((item, i) => (
                            <div key={i} className="border-2 border-rawr-white p-8 hover:bg-rawr-white hover:text-rawr-black transition-colors duration-300">
                                <h3 className="text-3xl font-bold">{item}</h3>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
