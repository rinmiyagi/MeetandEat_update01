# PR: 定数・メッセージの管理 (refactor/constants)

## 概要
アプリケーション内で使用されるテキスト（エラーメッセージ、ローディング表示、プレースホルダー、UIラベルなど）を `src/app/lib/constants.ts` に集約し、各コンポーネントから参照するように変更しました。

## 変更点

- **`src/app/lib/constants.ts` の作成**:
  - `MESSAGES`: エラー、成功、ローディングなどのメッセージ
  - `PLACEHOLDERS`: 入力欄のプレースホルダー
  - `DEFAULTS`: デフォルト値（"幹事"、"参加者"など）
  - `UI_TEXT`: ボタンのラベルやUIパーツのテキスト

- **コンポーネントの修正**:
  - `HeroSection.tsx`, `admin.tsx`, `Participant.tsx`, `result.tsx`, `ShareButtons.tsx`, `LocationSearch.tsx`, `useLocationSearch.ts` 内のハードコードされた文字列を、`constants.ts` の定数に置き換えました。

## メリット
- 文言の一貫性が保たれます。
- 将来的な文言変更や多言語対応が、一箇所の修正で済むようになります。
