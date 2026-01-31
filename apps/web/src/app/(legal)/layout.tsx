
export default function LegalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-rawr-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto prose prose-lg prose-headings:font-heading prose-headings:uppercase prose-p:font-body bg-white border-2 border-rawr-black p-8 md:p-12 shadow-[8px_8px_0px_0px_#050505]">
                {children}
            </div>
        </div>
    )
}
