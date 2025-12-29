# PR: ディレクトリ構成の改善 (refactor/unify-lib)

## 概要
分散していたユーティリティ関数や設定ファイルを `src/app/lib` に集約し、プロジェクト構造を簡素化・標準化しました。

## 変更点

- **`src/app/utils/` ディレクトリの削除**:
  - `votingUtils.ts` を `src/app/lib/votingUtils.ts` に移動。
  - これに伴い、`VotingStatusView` や `FinalResultView` の import パスを更新。

- **`src/app/components/ui/utils.ts` の移動**:
  - `src/app/lib/utils.ts` に移動。
  - すべての UI コンポーネント (shadcn/ui等) の import パス (`from "./utils"`) を `from "../../lib/utils"` に一括更新。

## 配置のルール (New)
- **`src/app/lib/`**: ロジック、ユーティリティ、設定ファイル、APIクライアントなど、**UIを描画しないもの**の置き場。
- **`src/app/components/`**: Reactコンポーネント (HTML/UI) の置き場。

これにより、どこに何があるかがより明確になります。
