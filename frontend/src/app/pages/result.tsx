import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { RefreshCcw } from "lucide-react";
import VotingStatusView from "../components/VotingStatusView";
import { FinalResultView } from "../components/FinalResultView";
import { LoadingOverlay } from "../components/ui/loading-overlay";
import { finalizeEvent } from "../lib/api/events";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useResultData } from "../hooks/useResultData";



export default function Result() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const {
    organizerId,
    organizerName,
    organizerDates,
    participants,
    eventData,
    errorMessage,
    isLoading,
    refetch
  } = useResultData(eventId);

  const [isFinalizing, setIsFinalizing] = useState(false);

  const handleFinalizeEvent = async () => {
    if (!eventId || isFinalizing) return;
    setIsFinalizing(true);
    try {
      await finalizeEvent(eventId);



      window.location.reload();

    } catch (err: any) {
      console.error("Failed to finalize event:", err);

      let message = "イベントの確定に失敗しました";
      // Try to parse Supabase FunctionsHttpError body if it exists
      if (err && typeof err === 'object') {
        // If the edge function returned a JSON error (e.g. { error: "No users found" })
        // Supabase client might wrap it. Adjust based on actual error structure.
        // Commonly err.message is the string "Edge Function returned a non-2xx status code"
        // and we can find details in context or body.
        // For simplistic handling, we check if the message itself is useful.

        if (err.context && err.context.json && err.context.json.error) {
          message = `エラー: ${err.context.json.error}`;
        } else if (err.message) {
          message = `エラー: ${err.message}`;
        }
      }
      toast.error(message);
      setIsFinalizing(false);
    }
  };

  if (errorMessage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-gray-50 text-center">
        <h1 className="text-xl font-bold text-red-600 mb-4">エラーが発生しました</h1>
        <p className="text-gray-700 mb-6 max-w-md break-words">{errorMessage}</p>
        <button
          onClick={() => refetch()}
          className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          再読み込み
        </button>
      </div>
    );
  }

  if (isLoading || !eventData) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-20">
          <LoadingOverlay isVisible={true} message="イベント情報を読み込んでいます..." />
        </main>
        <Footer />
      </div>
    );
  }

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
        <LoadingOverlay isVisible={isFinalizing} message="最適なスケジュールとお店を計算しています..." />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}