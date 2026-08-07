            # 編集・更新依頼: nevi-web-center

            ネヴィがご主人さまから受け取った要件です。

            ## 変更要件

            問題点
- **[重大度: 高] BUILD_PROMPT.md の主要要件「実データ・実API連携」の未対応と偽装ロジックの残留**（該当ファイル: [index.html](file:///C:/Users/umuta/AppData/Local/Temp/nevi-qa-pscj4_0i/index.html#L998-L1000), [index.html](file:///C:/Users/umuta/AppData/Local/Temp/nevi-qa-pscj4_0i/index.html#L1180-L1182), [index.html](file:///C:/Users/umuta/AppData/Local/Temp/nevi-qa-pscj4_0i/index.html#L2160-L2223)）
  `BUILD_PROMPT.md` の要求「モックデータで実装されている部分を、実際のデータ・API連携に置き換えて本実装にしてください」に対し、CPU負荷等はマイクロベンチマークおよび `Math.sin()` 等による疑似計算が大半を占めており、バックエンド API 同期も通信失敗を無言でキャッチして LocalStorage / デモデータで動作させている。また、UI上の注記文章（「ローカル生成のシミュレーション値を2秒ごとに更新しています（要差し替え）」「OAuth未接続のため、予定はブラウザ内のみに保存される疑似データです（要差し替え）」など）が削除されずに残っている。
- **[重大度: 高] デフォルトの管理者許可リストにダミーIDがハードコードされているセキュリティ上の問題**（該当ファイル: [index.html](file:///C:/Users/umuta/AppData/Local/Temp/nevi-qa-pscj4_0i/index.html#L1490), [index.html](file:///C:/Users/umuta/AppData/Local/Temp/nevi-qa-pscj4_0i/index.html#L1633-L1639)）
  `state.settings.allowIds` の初期値としてダミーID `"108927491234567890"` が設定されており、デフォルトのデモモード状態では「ご主人さま（管理者アカウント）」ボタンを押すだけで実際の認証を経ずに誰でも管理者ダッシュボードへアクセスできる。
- **[重大度: 中] REST API / Webhook 送信シミュレータが外部通信を一切行わない疑似実装にとどまっている**（該当ファイル: [index.html](file:///C:/Users/umuta/AppData/Local/Temp/nevi-qa-pscj4_0i/index.html#L1235-L1236), [index.html](file:///C:/Users/umuta/AppData/Local/Temp/nevi-qa-pscj4_0i/index.html#L2918-L2955)）問題点の修正
  シミュレータ画面からの送信実行時、`fetch` や `XMLHttpRequest` 等の外部リクエストを発行せず、`setTimeout` により固定のダミー成功レスポンス JSON を表示する仕様になっている

            ## 実装ルール

            - 静的Webサイトとして実装・更新する
            - `index.html` を必ずプロジェクトルートに置く
            - 外部CDN・外部フォント・外部スタイルシートを使わない（自己完結させる）
              画像は inline SVG か data: URI で埋め込む
            - レスポンシブにする。スマホで横スクロールが発生してはいけない
            - `prefers-color-scheme` でライト/ダーク両対応にする
            - セマンティックなHTMLと十分なコントラストを確保する
            - ダミーテキスト（lorem ipsum）ではなく、意味のある実際の文章を書く
            - ファイル数は必要最小限にする
            - 実在の人物・団体について事実を捏造しない
            - ブラウザ自動テスト・動作確認を必ず実施する（Playwright/Puppeteer/ローカル開発サーバー等で実際に表示・クリック・JS例外エラー等のコンソールチェックを行い、正常動作を確認して完了すること）

            ---

            完成したら Discord で `/deploy nevi-web-center` を実行すると、
            ネヴィが GitHub にリポジトリを作って公開まで進めます。
