"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-rawr-white group-[.toaster]:text-rawr-black group-[.toaster]:border-2 group-[.toaster]:border-rawr-black group-[.toaster]:shadow-[4px_4px_0px_0px_#050505] group-[.toaster]:font-bold group-[.toaster]:uppercase group-[.toaster]:rounded-none",
                    description: "group-[.toast]:text-gray-500",
                    actionButton:
                        "group-[.toast]:bg-rawr-black group-[.toast]:text-rawr-white",
                    cancelButton:
                        "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
