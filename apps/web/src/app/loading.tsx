export default function Loading() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-rawr-red text-white z-[100] fixed top-0 left-0">
            <div className="animate-pulse">
                <h1 className="text-6xl md:text-9xl font-heading font-black uppercase tracking-tighter">
                    LOADING
                </h1>
            </div>
            <p className="font-mono text-sm uppercase tracking-widest mt-4">
                Systems Initializing...
            </p>
        </div>
    );
}
