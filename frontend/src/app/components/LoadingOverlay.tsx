import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
}

export function LoadingOverlay({ isVisible, message = "処理中..." }: LoadingOverlayProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-white shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
                <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
                <p className="text-lg font-semibold text-gray-700">{message}</p>
            </div>
        </div>
    );
}
