import { MapPin, ExternalLink, Banknote } from "lucide-react";
import { UI_TEXT } from "../lib/constants";

export interface Restaurant {
    name: string;
    address: string;
    urls: { pc: string };
    genre?: { name: string };
    photo?: { pc: { l: string } };
    budget?: { name: string; average: string };
    catch?: string;
}

interface RestaurantCardProps {
    shop: Restaurant;
    index: number;
}

export const RestaurantCard = ({ shop, index }: RestaurantCardProps) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6 border border-gray-100 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            {/* Image Section */}
            <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                {shop.photo?.pc?.l ? (
                    <img
                        src={shop.photo.pc.l}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">No Image</span>
                    </div>
                )}
                {/* Ranking Badge */}
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    #{index + 1}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow justify-between">
                <div>
                    {/* Genre & Catch */}
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                        {shop.genre && (
                            <span className="text-xs font-medium bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-100">
                                {shop.genre.name}
                            </span>
                        )}
                        {shop.catch && (
                            <span className="text-xs text-gray-500 line-clamp-1">
                                {shop.catch}
                            </span>
                        )}
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                        {shop.name}
                    </h3>

                    {/* Info Grid */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                            <span className="line-clamp-2">{shop.address}</span>
                        </div>
                        {shop.budget && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Banknote className="w-4 h-4 flex-shrink-0 text-gray-400" />
                                <span>{shop.budget.average || shop.budget.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                {shop.urls?.pc && (
                    <a
                        href={shop.urls.pc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors mt-2 sm:mt-0"
                    >
                        <span>{UI_TEXT.VIEW_RESTAURANT_DETAILS}</span>
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>
    );
};
