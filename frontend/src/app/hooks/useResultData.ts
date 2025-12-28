import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../lib/supabaseClient";

export type Participant = {
    id: string;
    name: string | null;
    dates: string[];
};

export interface EventData {
    amount: number;
    confirmed_date: string | null;
    restaurant_info: any;
    target_station: string | null;
}

export const useResultData = (eventId: string | null) => {
    const [organizerId, setOrganizerId] = useState<string | null>(null);
    const [organizerName, setOrganizerName] = useState<string | null>(null);
    const [organizerDates, setOrganizerDates] = useState<string[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResultData = async () => {
            if (!eventId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                // 1. Fetch Event Data
                const { data: event, error: eventError } = await supabase
                    .from("events")
                    .select("amount, confirmed_date, restaurant_info, target_station")
                    .eq("id", eventId)
                    .single();

                if (eventError) throw eventError;
                setEventData(event);

                // 2. Fetch Organizer
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("id, name")
                    .eq("event_id", eventId)
                    .eq("role", "organizer")
                    .single();

                if (userError || !userData) throw userError;
                setOrganizerId(userData.id);
                setOrganizerName(userData.name ?? null);

                const { data: scheduleData, error: schedError } = await supabase
                    .from("schedules")
                    .select("date")
                    .eq("user_id", userData.id);

                if (schedError) throw schedError;
                setOrganizerDates((scheduleData || []).map((s) => s.date));

                // 3. Fetch Participants
                const { data: participantUsers, error: participantsError } = await supabase
                    .from("users")
                    .select("id, name")
                    .eq("event_id", eventId)
                    .neq("role", "organizer");

                if (participantsError) throw participantsError;

                const participantIds = (participantUsers ?? []).map((user) => user.id);

                if (participantIds.length === 0) {
                    setParticipants([]);
                    return;
                }

                const { data: participantSchedules, error: participantSchedError } = await supabase
                    .from("schedules")
                    .select("user_id, date")
                    .in("user_id", participantIds);

                if (participantSchedError) throw participantSchedError;

                const schedulesByUser = new Map<string, string[]>();
                (participantSchedules ?? []).forEach((schedule) => {
                    const dates = schedulesByUser.get(schedule.user_id) ?? [];
                    dates.push(schedule.date);
                    schedulesByUser.set(schedule.user_id, dates);
                });

                setParticipants(
                    participantIds.map((id) => {
                        const user = participantUsers?.find((participant) => participant.id === id);
                        return {
                            id,
                            name: user?.name ?? null,
                            dates: schedulesByUser.get(id) ?? []
                        };
                    })
                );
            } catch (err: any) {
                console.error("Error fetching data:", err);
                const msg = err.message || "データの取得に失敗しました";
                setErrorMessage(msg);
                toast.error(msg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResultData();
    }, [eventId]);

    return {
        organizerId,
        organizerName,
        organizerDates,
        participants,
        eventData,
        errorMessage,
        isLoading
    };
};
