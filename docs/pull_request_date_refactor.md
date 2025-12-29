# PR: 日付ロジックのリファクタリング (refactor/date-utils)

## 概要
日付操作に関する重複コードを削減し、一貫性を保つために `dateUtils.ts` にロジックを集約しました。

## 変更点

### Frontend
- **共通ライブラリ (`src/app/lib/dateUtils.ts`)**:
  - `createDateFromKeyAndHour(dateKey, hour)`: `YYYY-MM-DD` 形式の文字列と時間(数値)から、正確に Date オブジェクトを生成するヘルパー関数を追加。
  - `formatDateWithDay(dateStr)`: `M月D日(曜日)` 形式に変換するフォーマット関数を追加。

- **管理者画面 (`src/app/pages/admin.tsx`)**:
  - `new Date(...)` を直接呼び出して時刻を設定していた箇所を、`createDateFromKeyAndHour` に置き換え。

- **参加者画面 (`src/app/pages/Participant.tsx`)**:
  - 管理者画面と同様に、重複していた Date 生成ロジックを `createDateFromKeyAndHour` に置き換え。

- **日時表示コンポーネント (`src/app/components/AvailabilitySummary.tsx`)**:
  - コンポーネント内で定義されていた独自のフォーマット関数を削除し、`dateUtils.ts` の `formatDateWithDay` を使用するように変更。

## メリット
- 日時生成ロジックが一箇所にまとまり、将来的なタイムゾーン対応やフォーマット変更が容易になります。
- コードの重複が減り、可読性が向上しました。
