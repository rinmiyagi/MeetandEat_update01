export const APP_NAME = "Meat & Eat";

export const MESSAGES = {
    LOADING: {
        CREATE_EVENT: "イベントを作成しています...",
        LOAD_EVENT: "イベント情報を読み込んでいます...",
        SAVE_SCHEDULE: "日程を保存しています...",
        SAVE_ANSWER: "回答を保存しています...",
        CALCULATING: "最適なスケジュールとお店を計算しています...",
        PROCESSING: "処理中...",
    },
    ERROR: {
        NETWORK_ERROR: "ネットワークエラーが発生しました。インターネット接続を確認してください。",
        REQUIRED_FIELDS: "名前とイベント名を入力してください",
        SAVE_FAILED: "保存に失敗しました",
        CREATE_FAILED: "作成に失敗しました",
        FINALIZE_FAILED: "イベントの確定に失敗しました",
        NO_DATA: "データが見つかりませんでした。URLを確認するか、主催者に問い合わせてください。",
        NO_EVENT_ID: "イベントIDが指定されていません。",
        LOCATION_SEARCH_FAILED: "検索結果が見つかりませんでした",
        LOCATION_DETECT_FAILED: "場所を特定できませんでした",
        LOCATION_PERMISSION_DENIED: "位置情報の利用が許可されていません。ブラウザの設定をご確認ください。",
        LOCATION_NOT_SUPPORTED: "お使いのブラウザは位置情報をサポートしていません",
        COPY_FAILED: "コピーに失敗しました",
        GEOLOCATION_UNAVAILABLE: "位置情報を取得できませんでした。",
        GEOLOCATION_TIMEOUT: "位置情報の取得がタイムアウトしました。",
        GEOLOCATION_FAILED: "位置情報の取得に失敗しました。",
    },
    SUCCESS: {
        COPIED: "コピーしました！",
        LINK_COPIED: "リンクをコピーしました！",
    },
    VALIDATION: {
        SELECT_SCHEDULE: "日程を選択してください",
        USER_NOT_FOUND: "ユーザーIDが見つかりません。イベント作成からやり直してください。",
    },
};

export const PLACEHOLDERS = {
    NAME: "例：山田太郎",
    EVENT_NAME: "例：チーム忘年会",
    STATION: "例：渋谷駅、新宿駅...",
};

export const DEFAULTS = {
    ORGANIZER_NAME: "幹事",
    PARTICIPANT_NAME: "参加者",
    UNKNOWN_STATION: "不明な駅",
};

export const UI_TEXT = {
    SAVE: "保存する",
    SAVING: "保存中...",
    CALCULATING: "計算中...",
    SEE_RESULT: "結果を見る",
    COPY_URL: "URLをコピー",
    RELOAD: "再読み込み",
    SEARCH: "検索",
    CURRENT_LOCATION: "現在地",
    GET_CURRENT_LOCATION: "現在地を取得して設定",
    NO_SEARCH_RESULTS: "検索結果なし",
    FETCH_ERROR: "取得エラー",
    LOCATION_ACQUIRED: "位置情報を取得しました",
    SELECTED_DATE_TIME: "選択日時",
    DRAG_TO_SELECT: "カレンダーをドラッグして、候補日時の範囲を選択してください。",
    CHECK_REQUIRED: "要確認",
    SELECTED_COUNT: "{n}件選択中",
    OPTIMAL_CANDIDATE: "🌟 現時点での最適候補：",
    VOTING_STATUS: "投票状況",
    UNDECIDED: "未定",
    EVENT_FINALIZED: "イベントが確定しました！🎉",
    DATE_TIME: "日時",
    MEETING_PLACE: "集合場所",
    VIEW_RESTAURANT_DETAILS: "お店の詳細を見る",
    SHARE_RESULT: "結果をシェアする",
    SEND: "送る",
    SHARE_TEXT: "イベントの詳細が決まりました！確認してください。",
    LOCATION_NOTE: "※意図しない場所の場合は、検索タブから駅や施設名を指定してください",
    LOCATION_SEARCH_PLACEHOLDER: "駅名を検索...",
};
