// --- Types ---
export interface LatLng {
    lat: number;
    lng: number;
}

export interface RouteMatrixElement {
    originIndex: number;
    destinationIndex: number;
    duration?: string; // "3600s"
    distanceMeters?: number;
    status?: { code: number; message: string };
    condition?: string;
}

// --- Helper Functions ---

export function calculateCentroid(locations: LatLng[]): LatLng {
    if (locations.length === 0) return { lat: 0, lng: 0 };
    const sum = locations.reduce(
        (acc, curr) => ({ lat: acc.lat + curr.lat, lng: acc.lng + curr.lng }),
        { lat: 0, lng: 0 }
    );
    return { lat: sum.lat / locations.length, lng: sum.lng / locations.length };
}

export async function searchNearbyStations(center: LatLng, apiKey: string): Promise<{ name: string; location: LatLng }[]> {
    const url = 'https://places.googleapis.com/v1/places:searchNearby';
    const body = {
        includedTypes: ['train_station', 'subway_station', 'light_rail_station'],
        maxResultCount: 5,
        rankPreference: 'POPULARITY',
        languageCode: 'ja',
        locationRestriction: {
            circle: {
                center: { latitude: center.lat, longitude: center.lng },
                radius: 2000.0
            }
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.displayName,places.location'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    // @ts-ignore
    if (!data.places) return [];

    // @ts-ignore
    return data.places.map((p: any) => ({
        name: p.displayName.text,
        location: {
            lat: p.location.latitude,
            lng: p.location.longitude
        }
    }));
}

export async function computeTransitMatrix(
    origins: LatLng[],
    destinations: LatLng[],
    arrivalTime: string,
    apiKey: string
): Promise<RouteMatrixElement[]> {
    const url = `https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix`;
    const body = {
        origins: origins.map(o => ({ waypoint: { location: { latLng: { latitude: o.lat, longitude: o.lng } } } })),
        destinations: destinations.map(d => ({ waypoint: { location: { latLng: { latitude: d.lat, longitude: d.lng } } } })),
        travelMode: 'TRANSIT',
        arrivalTime: arrivalTime
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters,status,condition'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const txt = await response.text();
        console.error('Routes API Error:', txt);
        return [];
    }

    return await response.json();
}

export async function searchRestaurants(location: LatLng, apiKey: string): Promise<any[]> {
    const range = 3;
    const url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${apiKey}&lat=${location.lat}&lng=${location.lng}&range=${range}&format=json&count=5`;

    // Note: Use a proxy if blocking CORS, but server-to-server usually fine for HTTP
    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json();
    if (data.results && data.results.shop && data.results.shop.length > 0) {
        return data.results.shop.map((shop: any) => ({
            name: shop.name,
            address: shop.address,
            genre: { name: shop.genre?.name },
            urls: { pc: shop.urls?.pc },
            photo: { pc: { l: shop.photo?.pc?.l } },
            budget: { name: shop.budget?.name, average: shop.budget?.average },
            catch: shop.catch
        }));
    }
    return [];
}
