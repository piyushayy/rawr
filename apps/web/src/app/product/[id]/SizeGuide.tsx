
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";

export const SizeGuide = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 font-bold uppercase">
                    <Ruler className="w-4 h-4" /> Size Guide
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-rawr-white border-2 border-rawr-black p-0 overflow-hidden">
                <DialogHeader className="p-6 bg-rawr-black text-white">
                    <DialogTitle className="text-3xl font-heading font-black uppercase">Fit Protocol</DialogTitle>
                    <DialogDescription className="text-gray-400 font-bold uppercase">
                        All measurements in inches. Fits are intentionally boxy.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm font-body text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-rawr-black">
                                    <th className="py-2 px-4 uppercase font-black bg-gray-100">Size</th>
                                    <th className="py-2 px-4 uppercase font-black bg-gray-100">Chest</th>
                                    <th className="py-2 px-4 uppercase font-black bg-gray-100">Length</th>
                                    <th className="py-2 px-4 uppercase font-black bg-gray-100">Sleeve</th>
                                    <th className="py-2 px-4 uppercase font-black bg-gray-100">Shoulder</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-bold">S</td>
                                    <td className="py-3 px-4">20"</td>
                                    <td className="py-3 px-4">26"</td>
                                    <td className="py-3 px-4">8"</td>
                                    <td className="py-3 px-4">18"</td>
                                </tr>
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-bold">M</td>
                                    <td className="py-3 px-4">22"</td>
                                    <td className="py-3 px-4">27"</td>
                                    <td className="py-3 px-4">8.5"</td>
                                    <td className="py-3 px-4">19"</td>
                                </tr>
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-bold">L</td>
                                    <td className="py-3 px-4">24"</td>
                                    <td className="py-3 px-4">28"</td>
                                    <td className="py-3 px-4">9"</td>
                                    <td className="py-3 px-4">20"</td>
                                </tr>
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-bold">XL</td>
                                    <td className="py-3 px-4">26"</td>
                                    <td className="py-3 px-4">29"</td>
                                    <td className="py-3 px-4">9.5"</td>
                                    <td className="py-3 px-4">21"</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-bold">XXL</td>
                                    <td className="py-3 px-4">28"</td>
                                    <td className="py-3 px-4">30"</td>
                                    <td className="py-3 px-4">10"</td>
                                    <td className="py-3 px-4">22"</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600">
                        <p className="mb-2"><span className="font-bold uppercase">Chest:</span> Measured across the chest one inch below armhole when laid flat.</p>
                        <p><span className="font-bold uppercase">Length:</span> Measured from highest point of shoulder to bottom hem.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
