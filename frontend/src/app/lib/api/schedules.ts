import { supabase } from "../supabaseClient";

type ScheduleInsert = {
    user_id: string;
    date: string;
};

/**
 * Saves availability schedules for a user.
 */
export async function saveSchedules(schedules: ScheduleInsert[]) {
    const { error } = await supabase.from("schedules").insert(schedules);
    if (error) throw error;
}

/**
 * Fetches schedules for a specific user.
 */
export async function getUserSchedules(userId: string) {
    const { data, error } = await supabase
        .from("schedules")
        .select("date")
        .eq("user_id", userId);

    if (error) throw error;
    return data;
}
