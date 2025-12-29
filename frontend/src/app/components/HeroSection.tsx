import { Minus, Plus, AlertCircle } from "lucide-react";

import { useCreateEvent } from "../hooks/useCreateEvent";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { LocationSearch } from './LocationSearch';
import { LoadingOverlay } from './ui/loading-overlay';
import { MESSAGES, PLACEHOLDERS } from "../lib/constants";

export function HeroSection() {
  const {
    eventName,
    setEventName,
    organizerName,
    setOrganizerName,
    participants,
    location, // unused in render, but exposed by hook
    setLocation,
    error,
    setError,
    isCreating,
    incrementParticipants,
    decrementParticipants,
    handleCreateEvent
  } = useCreateEvent();



  return (
    <section className="relative bg-gradient-to-b from-orange-50 to-white pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm">
              ミートアンドイート
            </div>
            <h1 className="text-5xl tracking-tight text-gray-900">
              イベントの幹事、
              <br />
              もう悩まない
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              参加者全員の位置情報から中間地点を自動計算。最適なレストランを提案します。ログイン不要ですぐに使えます。
            </p>
          </div>

          <Card className="p-8 shadow-xl border-0 bg-white">
            <h2 className="text-2xl mb-6 text-gray-900">イベントを作成</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-gray-700">あなたの名前</label>
                <Input
                  type="text"
                  placeholder={PLACEHOLDERS.NAME}
                  value={organizerName}
                  onChange={(e) => {
                    setOrganizerName(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-12"
                />
              </div>

              {/* Location Search Input */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  あなたの出発地点（最寄り駅）
                </label>
                <LocationSearch
                  onSelect={setLocation}
                  placeholder={PLACEHOLDERS.STATION}
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">イベント名</label>
                <Input
                  type="text"
                  placeholder={PLACEHOLDERS.EVENT_NAME}
                  value={eventName}
                  onChange={(e) => {
                    setEventName(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-12"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">参加人数</label>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={decrementParticipants} className="h-12 w-12">
                    <Minus className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 text-center">
                    <span className="text-3xl text-gray-900">{participants}</span>
                    <span className="text-sm text-gray-500 ml-1">人</span>
                  </div>
                  <Button variant="outline" size="icon" onClick={incrementParticipants} className="h-12 w-12">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>入力エラー</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleCreateEvent}
                className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white text-lg"
              >
                イベントを作成
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <LoadingOverlay isVisible={isCreating} message={MESSAGES.LOADING.CREATE_EVENT} />
    </section >
  );
}
