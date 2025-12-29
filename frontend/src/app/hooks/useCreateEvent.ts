import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createEvent } from "../lib/api/events";
import { registerParticipant } from "../lib/api/participants";
import { MESSAGES } from "../lib/constants";
import { LocationData } from "../lib/types";

export const useCreateEvent = () => {
    const [eventName, setEventName] = useState("");
    const [organizerName, setOrganizerName] = useState("");
    const [participants, setParticipants] = useState(2);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    const incrementParticipants = () => {
        if (participants < 20) setParticipants(participants + 1);
    };

    const decrementParticipants = () => {
        if (participants > 1) setParticipants(participants - 1);
    };

    const handleCreateEvent = async () => {
        setError(null);
        if (!eventName.trim() || !organizerName.trim()) {
            setError(MESSAGES.ERROR.REQUIRED_FIELDS);
            toast.error(MESSAGES.ERROR.REQUIRED_FIELDS);
            return;
        }

        try {
            setIsCreating(true);
            const eventData = await createEvent(eventName, participants);
            const userData = await registerParticipant({
                eventId: eventData.id,
                name: organizerName,
                role: "organizer",
                lat: location?.lat,
                lng: location?.lng,
                nearestStation: location?.name
            });

            navigate(`/admin?hash=${eventData.hash}`, {
                state: {
                    eventId: eventData.id,
                    userId: userData.id,
                    eventName: eventData.name
                }
            });
        } catch (error: any) {
            console.error("Error creating event:", error);
            toast.error(`${MESSAGES.ERROR.CREATE_FAILED}: ${error.message}`);
            setIsCreating(false);
        }
    };

    return {
        eventName,
        setEventName,
        organizerName,
        setOrganizerName,
        participants,
        location,
        setLocation,
        error,
        setError,
        isCreating,
        incrementParticipants,
        decrementParticipants,
        handleCreateEvent
    };
};
