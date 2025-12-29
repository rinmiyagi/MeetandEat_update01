import { supabase } from "../supabaseClient";

/**
 * Creates a new event.
 */
export async function createEvent(eventName: string, participants: number) {
    const { data, error } = await supabase
        .from("events")
        .insert([
            {
                name: eventName,
                amount: participants,
                hash: Math.random().toString(36).substring(2, 10),
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Fetches event details by ID.
 */
export async function getEvent(eventId: string) {
    const { data, error } = await supabase
        .from("events")
        .select("name")
        .eq("id", eventId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Finalizes the event by calling the edge function.
 */
export async function finalizeEvent(eventId: string) {
    const { data, error } = await supabase.functions.invoke("finalize-event-v2", {
        body: { event_id: eventId },
    });

    if (error) throw error;
    return data;
}
