# Pull Request: Landing Page and Documentation Updates

## 概要
ランディングページ（Features, How It Works, Footer）およびドキュメント（Overview）を、現在の実装状況に合わせて更新しました。

## 変更点

### 1. ドキュメント更新 (`docs/overview.md`)
- 「ブラウザ自動取得」や「AI提案」といった未実装/仕様変更された記述を修正。
- 「Google Places API」による駅検索、「Google Routes API」による経路最適化、「HotPepper API」による店舗検索という実態に合わせて記述を統一。

### 2. ランディングページ更新
- **Features (`Features.tsx`)**:
  - タイトルと説明文の改行位置を調整し、可読性を向上。
  - バナーのAPIリストを `Compute Route Matrix Pro` から `Google Places API` に修正。
- **How It Works (`HowItWorks.tsx`)**:
  - フローの説明を「位置情報共有」から「最寄り駅入力」へ変更。
- **Footer (`Footer.tsx`)**:
  - デザインを刷新（メニュー、クレジット、コピーライト）。
  - 使用している外部APIへのクレジット表記を明確化。
  - 背景色を元の `bg-gray-900` に戻しつつ、レイアウト改善を維持。

## 確認事項
- `npm run build` が正常に完了することを確認済み。
- ブラウザでの表示崩れがないことを確認済み。
