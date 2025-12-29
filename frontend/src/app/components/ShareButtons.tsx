import { useState, useEffect } from "react";
import { Link, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { MESSAGES, UI_TEXT } from "../lib/constants";

interface ShareButtonsProps {
    url: string;
    title?: string;
}

export default function ShareButtons({ url, title = "Meat & Eat イベント結果" }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [canShare, setCanShare] = useState(false);

    useEffect(() => {
        // Check if the Web Share API is available
        if (typeof navigator.share === 'function') {
            setCanShare(true);
        }
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success(MESSAGES.SUCCESS.LINK_COPIED);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            toast.error(MESSAGES.ERROR.COPY_FAILED);
        }
    };

    const handleShare = async () => {
        if (!navigator.share) return;
        try {
            await navigator.share({
                title: title,
                text: UI_TEXT.SHARE_TEXT,
                url: url,
            });
        } catch (err) {
            // User cancelled or failed
            console.log("Share cancelled or failed", err);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3 w-full mt-0 mb-8">
            <h3 className="text-gray-500 font-medium text-sm">{UI_TEXT.SHARE_RESULT}</h3>
            <div className="flex gap-4 w-full justify-center">
                {/* Copy Link Button */}
                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-md ${copied
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
                        }`}
                >
                    {copied ? <Check className="w-5 h-5" /> : <Link className="w-5 h-5" />}
                    {copied ? MESSAGES.SUCCESS.COPIED : UI_TEXT.COPY_URL}
                </button>

                {/* Native Share Button (Mobile/Supported Browsers) */}
                {canShare && (
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-blue-500 hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md"
                    >
                        <Share2 className="w-5 h-5" />
                        {UI_TEXT.SEND}
                    </button>
                )}
            </div>
        </div>
    );
}
