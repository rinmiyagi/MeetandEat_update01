import { useState, useEffect } from 'react';
import { LocationData } from '../components/LocationSearch';

export type NominatimAddress = {
    province?: string;
    city?: string;
    town?: string;
    village?: string;
    ward?: string;
    city_district?: string;
    suburb?: string;
    neighbourhood?: string;
    road?: string;
    house_number?: string;
    amenity?: string;
    building?: string;
    shop?: string;
    office?: string;
    tourism?: string;
    historic?: string;
    [key: string]: string | undefined;
};

export type NominatimResult = {
    display_name: string;
    lat: string;
    lon: string;
    address?: NominatimAddress;
};

export function useLocationSearch(onSelect: (location: LocationData) => void, defaultValue = "") {
    const [query, setQuery] = useState(defaultValue);
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [detectedAddress, setDetectedAddress] = useState<string | null>(null);

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length > 1 && isOpen) {
                searchLocation(query);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, isOpen]);

    const formatAddress = (result: NominatimResult): { name: string; region: string } => {
        if (!result.address) {
            const parts = result.display_name.split(',');
            return {
                name: parts[0],
                region: parts.slice(1).join(',').trim()
            };
        }

        const { address } = result;
        // 都道府県: state, province, regionなどの揺らぎに対応
        const prefecture = address.state || address.province || address.region || "";
        // 市区町村 (Municipality): city, ward, town, village
        const city = address.city || address.ward || address.town || address.village || "";
        const region = `${prefecture}${city}`;

        // 名前: display_nameの先頭部分を使用し、セミコロンで区切られた詳細情報（出口番号など）を除去
        let namePart = result.display_name.split(',')[0];
        namePart = namePart.split(';')[0]; // "新宿駅;3番出口" -> "新宿駅"

        // 名前がregionと完全に一致する場合は、重複表示を避けるためにnamePartを空にするか調整
        // しかし、ユーザーの要望は「建物名、都道府県」なので、必ず分けたほうが扱いやすい

        return { name: namePart, region };
    };

    const searchLocation = async (q: string) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                q: q,
                format: 'json',
                addressdetails: '1',
                limit: '5',
                countrycodes: 'jp'
            });
            // accept-language header for ensure Japanese
            const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
                headers: { 'Accept-Language': 'ja' }
            });
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchNearestStation = async (lat: number, lon: number): Promise<{ name: string, lat: number, lng: number } | null> => {
        try {
            const res = await fetch(`https://express.heartrails.com/api/json?method=getStations&x=${lon}&y=${lat}`);
            const data = await res.json();
            // HeartRails returns response.station as an array. The first one is nearest.
            if (data?.response?.station?.[0]) {
                const station = data.response.station[0];
                return {
                    name: station.name,
                    lat: parseFloat(station.y), // y is latitude
                    lng: parseFloat(station.x)  // x is longitude
                };
            }
        } catch (error) {
            console.error("HeartRails API failed", error);
        }
        return null;
    };

    const reverseGeocode = async (lat: number, lon: number) => {
        setIsLoading(true);
        try {
            // 1. Try HeartRails first (Best for Japanese stations)
            const stationData = await fetchNearestStation(lat, lon);
            let name = "";
            let targetLat = lat;
            let targetLng = lon;

            if (stationData) {
                name = stationData.name;
                // HeartRails returns just the name e.g. "新宿". Append "駅" if likely a station.
                if (!name.endsWith('駅')) {
                    name = `${name}駅`;
                }
                // Use station coordinates instead of browser GPS
                targetLat = stationData.lat;
                targetLng = stationData.lng;
            } else {
                // 2. Fallback to Nominatim if no station found
                const params = new URLSearchParams({
                    lat: lat.toString(),
                    lon: lon.toString(),
                    format: 'json',
                });
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
                    headers: { 'Accept-Language': 'ja' }
                });
                const data = await res.json();

                if (data) {
                    // Use formatted address for detection result too?
                    // For reverse geocoding, data.display_name is usually "Building, Road..."
                    // data.address is available if addressdetails=1 (default for reverse mostly? need check)
                    // Let's assume we can use formatAddress pattern if address is present.

                    if (data.address) {
                        const tempResult: NominatimResult = {
                            display_name: data.display_name,
                            lat: data.lat,
                            lon: data.lon,
                            address: data.address
                        };
                        const formatted = formatAddress(tempResult);
                        // 逆ジオコーディングの場合は、inputには "建物名 (地域名)" のように入れておくと親切かも
                        name = formatted.region ? `${formatted.name} ${formatted.region}` : formatted.name;
                    } else if (data.display_name) {
                        name = data.display_name.split(',')[0];
                    }
                }
            }

            if (name) {
                setQuery(name);
                setDetectedAddress(name); // Set specific GPS address for display
                onSelect({
                    name: name,
                    lat: targetLat,
                    lng: targetLng
                });
            } else {
                alert("場所を特定できませんでした");
            }
        } catch (error) {
            console.error("Reverse geocode failed", error);
            alert("場所の特定に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("お使いのブラウザは位置情報をサポートしていません");
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                reverseGeocode(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error("Geolocation error", error);
                setIsLoading(false);
                alert("位置情報の取得に失敗しました。権限を確認してください。");
            }
        );
    };

    const handleSelect = (result: NominatimResult) => {
        const formatted = formatAddress(result);
        // Inputにはシンプルに建物名（または +地域名）を入れる
        const displayName = formatted.region ? `${formatted.name} ${formatted.region}` : formatted.name;

        setQuery(displayName);
        setDetectedAddress(null); // Clear manual detection if picking from list
        setIsOpen(false);
        onSelect({
            name: displayName,
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
        });
    };

    return {
        query,
        setQuery,
        results,
        isLoading,
        isOpen,
        setIsOpen,
        detectedAddress,
        setDetectedAddress,
        handleGetCurrentLocation,
        handleSelect,
        formatAddress // Expose it for UI list
    };
}
