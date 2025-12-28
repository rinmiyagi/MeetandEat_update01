export interface Restaurant {
    name: string;
    address: string;
    urls: { pc: string };
    genre?: { name: string };
}

interface RestaurantCardProps {
    shop: Restaurant;
    index: number;
}

export const RestaurantCard = ({ shop, index }: RestaurantCardProps) => {
    return (
        <div className="flex flex-col gap-2 mb-6 border-b border-gray-100 last:border-0 pb-6 last:pb-0">
            <h3 className="text-xl font-bold text-gray-900">{index + 1}. {shop.name}</h3>
            {shop.genre && <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs w-fit">{shop.genre.name}</span>}
            <p className="text-gray-600 mt-2 text-sm">{shop.address}</p>

            {shop.urls?.pc && (
                <a
                    href={shop.urls.pc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-center w-full block bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                    お店の詳細を見る
                </a>
            )}
        </div>
    );
};
