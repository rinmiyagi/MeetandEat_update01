import { Calendar, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import VotingStatusView from "./VotingStatusView";
import ShareButtons from "./ShareButtons";

import { RestaurantCard, Restaurant } from "./RestaurantCard";
import { formatDateLabel } from "../utils/votingUtils";

/* interface Restaurant removed - imported from RestaurantCard */

interface FinalResultViewProps {
    confirmedDate: string;
    restaurantInfo: Restaurant[];
    nearestStation: string;
    organizerId: string | null;
    organizerName: string | null;
    organizerDates: string[];
    participants: {
        id: string;
        name: string | null;
        dates: string[];
    }[];
    totalExpectedParticipants?: number;
}

export const FinalResultView = ({
    confirmedDate,
    restaurantInfo,
    nearestStation,
    organizerId,
    organizerName,
    organizerDates,
    participants,
    totalExpectedParticipants
}: FinalResultViewProps) => {
    const [isVotingDetailsOpen, setIsVotingDetailsOpen] = useState(false);
    const [dateStr, timeStr] = formatDateLabel(confirmedDate);



    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">イベントが確定しました！🎉</h1>

            {/* Event Summary Card */}
            <div className="w-full bg-orange-50 rounded-xl border border-orange-100 p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-400"></div>

                {/* Date & Time */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-2 bg-white rounded-lg shadow-sm mt-1">
                        <Calendar className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">日時</p>
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                            <p className="text-2xl font-bold text-gray-800">{dateStr}</p>
                            <div className="flex items-center gap-1 text-gray-700 font-semibold">
                                <Clock className="w-4 h-4 text-orange-400" />
                                <span>{timeStr}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-orange-200/50 my-4"></div>

                {/* Location */}
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm mt-1">
                        <MapPin className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">集合場所</p>
                        <p className="text-xl font-bold text-gray-800">{nearestStation}</p>
                    </div>
                </div>
            </div>

            {/* Share Buttons */}
            <ShareButtons url={window.location.href} />

            {/* Restaurant Info */}
            {/* Restaurant Info */}
            <div className="w-full border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">お店一覧</h2>
                {restaurantInfo.map((shop, index) => (
                    <RestaurantCard key={index} shop={shop} index={index} />
                ))}
            </div>

            {/* Voting Details Toggle */}
            <div className="w-full border-t border-gray-100 pt-6 mt-6">
                <button
                    onClick={() => setIsVotingDetailsOpen(!isVotingDetailsOpen)}
                    className="flex items-center justify-center w-full gap-2 text-gray-500 hover:text-orange-600 transition-colors py-2"
                >
                    <span className="font-medium text-sm">投票結果の詳細を見る</span>
                    {isVotingDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isVotingDetailsOpen && (
                    <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <VotingStatusView
                            organizerId={organizerId}
                            organizerName={organizerName}
                            organizerDates={organizerDates}
                            participants={participants}
                            totalExpectedParticipants={totalExpectedParticipants}
                            showSummary={false}
                        />
                    </div>
                )}
            </div>

        </div>
    );
};
