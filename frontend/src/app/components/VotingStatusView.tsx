type CellValue = "circle" | "cross" | null;

type Row = {
  labelLines: string[];
  cells: CellValue[];
  highlight?: boolean;
};

type VotingStatusViewProps = {
  organizerId: string | null;
  organizerName: string | null;
  organizerDates: string[];
  participants: {
    id: string;
    name: string | null;
    dates: string[];
  }[];
  totalExpectedParticipants?: number;
};

const formatDateLabel = (isoString: string) => {
  // Ensure the string is treated as UTC if it doesn't have timezone info
  const dateStr = isoString.endsWith("Z") || isoString.includes("+") ? isoString : `${isoString}Z`;
  const date = new Date(dateStr);
  const dateLabel = date.toLocaleDateString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  });
  const timeLabel = date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  return [dateLabel, timeLabel];
};

export default function VotingStatusView({
  organizerId,
  organizerName,
  organizerDates,
  participants,
  totalExpectedParticipants
}: VotingStatusViewProps) {
  const organizerLabel = organizerName ?? organizerId ?? "幹事";
  const participantLabels = participants.map(
    (participant) => participant.name ?? participant.id ?? "参加者"
  );
  const columns = ["", organizerLabel, ...participantLabels];
  const uniqueDates = Array.from(new Set(organizerDates)).sort();
  const participantDateSets = new Map(
    participants.map((participant) => [participant.id, new Set(participant.dates)])
  );
  const rowsWithMeta = uniqueDates.map((date) => {
    const participantCells = participants.map((participant) =>
      participantDateSets.get(participant.id)?.has(date) ? "circle" : "cross"
    );
    const circleCount =
      1 + participantCells.reduce((count, cell) => (cell === "circle" ? count + 1 : count), 0);
    return {
      date,
      row: {
        labelLines: formatDateLabel(date),
        cells: ["circle", ...participantCells] as CellValue[]
      },
      circleCount
    };
  });

  const bestCandidate =
    rowsWithMeta
      .slice()
      .sort((a, b) => {
        if (b.circleCount !== a.circleCount) return b.circleCount - a.circleCount;
        return a.date.localeCompare(b.date);
      })[0] ?? null;

  const rows: Row[] = rowsWithMeta.map(({ date, row }) => ({
    ...row,
    highlight: bestCandidate?.date === date
  }));

  const renderMark = (value: "circle" | "cross" | null) => {
    if (value === "circle") return "○";
    if (value === "cross") return "×";
    return "";
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="py-4 mb-4">
        {bestCandidate ? (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r shadow-sm flex flex-col gap-2">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-orange-800 font-bold text-lg">🌟 現時点での最適候補：</span>
              <span className="text-2xl font-bold text-gray-800 tracking-wide">
                {formatDateLabel(bestCandidate.date).join(" ")}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              <p className="text-sm text-gray-600">
                投票状況: <span className="font-bold">{participantLabels.length + 1}</span> /
                <span className="font-bold ml-1">{totalExpectedParticipants ?? "?"}</span> 人が投票済み
              </p>
            </p>
          </div>
        ) : (
          <div className="text-gray-500 font-medium">現時点での最適候補：未定</div>
        )}
      </div>
      <table className="min-w-[720px] w-full table-fixed border border-slate-300 text-sm text-slate-900">
        <colgroup>
          <col className="w-[220px]" />
          {columns.slice(1).map((name) => (
            <col key={name} className="w-[125px]" />
          ))}
        </colgroup>
        <thead>
          <tr className="bg-white text-black">
            {columns.map((name) => (
              <th
                key={name || "time"}
                className="border border-slate-300 border-b-3 px-3 py-3 text-center font-semibold "
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={row.highlight ? "bg-orange-200" : "bg-white"}>
              <th className="border border-slate-300 px-3 py-4 text-left font-normal">
                <div className={`leading-tight ${row.highlight ? "font-bold text-orange-900" : ""}`}>
                  {row.labelLines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </th>
              {row.cells.map((value, cellIndex) => (
                <td key={cellIndex} className="border border-slate-300 px-3 py-4 text-center text-lg">
                  {renderMark(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
