export type CellValue = "circle" | "cross" | null;

export type Row = {
    labelLines: string[];
    cells: CellValue[];
    highlight?: boolean;
};

export const formatDateLabel = (isoString: string) => {
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

export const calculateVotingData = (
    organizerId: string | null,
    organizerName: string | null,
    organizerDates: string[],
    participants: { id: string; name: string | null; dates: string[] }[]
) => {
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

    return { columns, rows, bestCandidate, participantLabels };
};
