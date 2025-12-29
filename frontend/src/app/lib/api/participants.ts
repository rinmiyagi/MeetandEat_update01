import { supabase } from "../supabaseClient";

type ParticipantRegistration = {
    eventId: string;
    name: string;
    role?: "organizer" | "participant"; // Default participant
    lat?: number | null;
    lng?: number | null;
    nearestStation?: string | null;
};

/**
 * Registers a new participant (or organizer) for an event.
 */
export async function registerParticipant({
    eventId,
    name,
    role = "participant",
    lat = null,
    lng = null,
    nearestStation = null,
}: ParticipantRegistration) {
    const { data, error } = await supabase
        .from("users")
        .insert([
            {
                event_id: eventId,
                name: name,
                role: role,
                lat: lat,
                lng: lng,
                nearest_station: nearestStation,
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}
