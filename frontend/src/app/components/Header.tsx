import { ReactNode } from "react";

interface HeaderProps {
    children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <img src="/meetAndEat_circle.png" alt="Meet and Eat Circle Icon" className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-xl text-gray-900">ミートアンドイート</h1>
                        <p className="text-xs text-gray-500">Meet and Eat</p>
                    </div>
                </div>
                {children}
            </div>
        </header>
    );
}
