import { Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { formatDateWithDay } from '../lib/dateUtils';

interface AvailabilitySummaryProps {
  selectedSlots: Set<string>;
  errorMessage?: string | null;
}

export function AvailabilitySummary({ selectedSlots, errorMessage }: AvailabilitySummaryProps) {
  // ... (groupSlotsByDate function) ...
  const groupSlotsByDate = () => {
    // ... (same implementation)
    const grouped: { [key: string]: number[] } = {};

    selectedSlots.forEach((slotKey) => {
      const parts = slotKey.split('-');
      const hour = Number(parts[parts.length - 1]);
      const dateStr = parts.slice(0, -1).join('-');

      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(hour);
    });

    // Sort hours for each date
    Object.keys(grouped).forEach((dateStr) => {
      grouped[dateStr].sort((a, b) => a - b);
    });

    return grouped;
  };

  const formatTimeRange = (hours: number[]) => {
    // ... (same implementation)
    if (hours.length === 0) return '';

    const ranges: string[] = [];
    let start = hours[0];
    let end = hours[0];

    for (let i = 1; i <= hours.length; i++) {
      if (i < hours.length && hours[i] === end + 1) {
        end = hours[i];
      } else {
        const startTime = formatTime(start);
        const endTime = formatTime(end + 1);
        ranges.push(`${startTime} - ${endTime}`);
        if (i < hours.length) {
          start = hours[i];
          end = hours[i];
        }
      }
    }

    return ranges.join(', ');
  };

  const formatTime = (hour: number) => {
    return `${hour}:00`;
  };

  /* Removed local formatDate, using import */

  const groupedSlots = groupSlotsByDate();
  const hasSelection = selectedSlots.size > 0;

  if (!hasSelection) {
    return (
      <div className="bg-white border-l border-gray-200 p-6 w-80 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <h3 className="text-gray-900">選択日時</h3>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-gray-500">
          カレンダーをドラッグして、候補日時の範囲を選択してください。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-l border-gray-200 p-6 w-80 overflow-auto flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-orange-600" />
        <h3 className="text-gray-900">選択日時</h3>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>要確認</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-auto">
        {Object.entries(groupedSlots)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([dateStr, hours]) => (
            <div key={dateStr} className="pb-3 border-b border-gray-100 last:border-b-0">
              <div className="text-sm mb-1 text-gray-900">
                {formatDateWithDay(dateStr)}
              </div>
              <div className="text-sm text-gray-600">
                {formatTimeRange(hours)}
              </div>
            </div>
          ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {selectedSlots.size}件選択中
        </div>
      </div>
    </div>
  );
}
