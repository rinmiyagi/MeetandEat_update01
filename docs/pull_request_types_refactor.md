# PR: 型定義の集約 (refactor/types)

## 概要
これまで各コンポーネントやHookファイル内に散在していた型定義を、新たに作成した `src/app/lib/types.ts` に集約し、コードの整理と循環参照の防止を図りました。

## 変更点

- **`src/app/lib/types.ts` の作成**:
  以下の型定義を移動・集約しました。
  - `Participant`, `EventData` (from `useResultData.ts`)
  - `CellValue`, `Row` (from `votingUtils.ts`)
  - `NominatimAddress`, `NominatimResult` (from `useLocationSearch.ts`)
  - `Restaurant` (from `RestaurantCard.tsx`)
  - `LocationData` (from `LocationSearch.tsx`)
  - `ViewType` (from `CalendarHeader.tsx`)

- **インポートの参照先変更**:
  - 上記の型を使用しているコンポーネントやHook（`admin.tsx`, `Participant.tsx`, `result.tsx`, `FinalResultView.tsx` など）のインポート修正。

## メリット
- 型定義の場所が統一され、再利用性が向上しました。
- 将来的な機能拡張時に型を探す手間が省けます。
