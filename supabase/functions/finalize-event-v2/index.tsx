// @ts-ignore: Deno types
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import {
    calculateCentroid,
    searchNearbyStations,
    computeTransitMatrix,
    searchRestaurants,
    findOptimalTime,
    selectBestStation,
    LatLng
} from "./logic.ts";

// --- Types ---
interface User {
    id: string;
    lat: number | null;
    lng: number | null;
}

// --- Configuration ---
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Main Handler ---

// @ts-ignore: Deno global
Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { event_id } = await req.json();
        if (!event_id) throw new Error('Event ID is required');

        // @ts-ignore: Deno global
        const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
        // @ts-ignore: Deno global
        const HOTPEPPER_KEY = Deno.env.get('HOTPEPPER_KEY');
        // @ts-ignore: Deno global
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
        // @ts-ignore: Deno global
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

        if (!GOOGLE_MAPS_API_KEY || !HOTPEPPER_KEY) {
            throw new Error('Missing API Config');
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const { data: users, error: fetchError } = await supabase
            .from('users')
            .select('id, lat, lng')
            .eq('event_id', event_id);

        if (fetchError || !users || users.length === 0) throw new Error('No users found');

        const validUsers = users.filter((u: any) => u.lat != null && u.lng != null && u.lat !== 0 && u.lng !== 0) as User[];
        if (validUsers.length === 0) throw new Error('No valid user locations');

        const centroid = calculateCentroid(validUsers.map(u => ({ lat: u.lat!, lng: u.lng! })));

        let stations = await searchNearbyStations(centroid, GOOGLE_MAPS_API_KEY);

        // Fallback
        if (stations.length === 0) {
            stations.push({ name: "Middle Point", location: centroid });
        }

        // --- Determine Arrival Time from Schedules ---
        // 1. Fetch all schedules for these users
        const userIds = users.map((u: any) => u.id);
        const { data: schedules, error: schedError } = await supabase
            .from('schedules')
            .select('date')
            .in('user_id', userIds);

        const arrivalTime = findOptimalTime((!schedError && schedules) ? schedules : []);

        console.log("Using Arrival Time:", arrivalTime);

        const matrix = await computeTransitMatrix(
            validUsers.map(u => ({ lat: u.lat!, lng: u.lng! })),
            stations.map(s => s.location),
            arrivalTime,
            GOOGLE_MAPS_API_KEY
        );

        const bestStation = selectBestStation(stations, matrix);

        const restaurant = await searchRestaurants(bestStation.location, HOTPEPPER_KEY);

        const { error: updateError } = await supabase
            .from('events')
            .update({
                restaurant_info: (restaurant && restaurant.length > 0) ? restaurant : [{ name: "Restaurant not found", text: "Please search manually nearby." }],
                target_station: bestStation.name,
                target_lat: bestStation.location.lat,
                target_lng: bestStation.location.lng,
                confirmed_date: arrivalTime,
            })
            .eq('id', event_id);

        if (updateError) throw updateError;

        return new Response(
            JSON.stringify({
                success: true,
                station: bestStation,
                restaurant: restaurant,
                center: centroid
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
});
