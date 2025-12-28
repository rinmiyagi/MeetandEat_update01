import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import VotingStatusView from "../components/VotingStatusView";
import { FinalResultView } from "../components/FinalResultView";
import { supabase } from "../lib/supabaseClient";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type Participant = {
  id: string;
  name: string | null;
  dates: string[];
};

interface EventData {
  amount: number;
  confirmed_date: string | null;
  restaurant_info: any;
  target_station: string | null;
}

export default function Result() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const [organizerId, setOrganizerId] = useState<string | null>(null);
  const [organizerName, setOrganizerName] = useState<string | null>(null);
  const [organizerDates, setOrganizerDates] = useState<string[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchResultData = async () => {
      if (!eventId) return;

      try {
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



        // Auto-finalize removed. Waiting for manual trigger.

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
      }
    };

    fetchResultData();
  }, [eventId]);

  const handleFinalizeEvent = async () => {
    if (!eventId || isFinalizing) return;
    setIsFinalizing(true);
    try {
      const { error } = await supabase.functions.invoke('finalize-event', {
        body: { event_id: eventId },
      });

      if (error) throw error;

      window.location.reload();

    } catch (err: any) {
      console.error("Failed to finalize event:", err);
      toast.error(`イベントの確定に失敗しました: ${err.message}`);
      setIsFinalizing(false);
    }
  };

  if (errorMessage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-gray-50">
        <h1 className="text-xl font-bold text-red-600 mb-4">エラーが発生しました</h1>
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition"
        >
          再読み込み
        </button>
      </div>
    );
  }

  if (!eventData) return <div className="p-10 text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-20">
        {eventData.confirmed_date ? (
          <div className="w-full px-4 max-w-screen-lg mx-auto">
            <FinalResultView
              confirmedDate={eventData.confirmed_date}
              restaurantInfo={eventData.restaurant_info}
              nearestStation={eventData.target_station || "不明な駅"}
              organizerId={organizerId}
              organizerName={organizerName}
              organizerDates={organizerDates}
              participants={participants}
              totalExpectedParticipants={eventData.amount}
            />
          </div>
        ) : isFinalizing ? (
          <div className="flex flex-col items-center justify-center p-10 h-full">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">イベントを確定中...</p>
            <p className="text-gray-500">最適なスケジュールとお店を計算しています！</p>
          </div>
        ) : (
          <div className="w-full px-4 max-w-screen-lg mx-auto">
            {!eventData.confirmed_date && (1 + participants.length) >= eventData.amount && (
              <div className="mb-10 p-8 bg-orange-50 border border-orange-200 rounded-lg text-center shadow-lg transform transition-all hover:scale-[1.01]">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">全員の投票が完了しました！🎉</h2>
                <p className="text-gray-700 mb-6 text-lg">
                  皆様、ご協力ありがとうございます。<br />
                  「結果を見る」ボタンを押して、開催場所とお店を決定しましょう。
                </p>
                <button
                  onClick={handleFinalizeEvent}
                  disabled={isFinalizing}
                  className="bg-orange-600 text-white text-lg font-bold py-3 px-10 rounded-full shadow-lg hover:bg-orange-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFinalizing ? "計算中..." : "結果を見る"}
                </button>
              </div>
            )}
            <VotingStatusView
              organizerId={organizerId}
              organizerName={organizerName}
              organizerDates={organizerDates}
              participants={participants}
              totalExpectedParticipants={eventData.amount}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}