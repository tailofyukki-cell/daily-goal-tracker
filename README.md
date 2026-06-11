# 🌱 今日の前進ログ (Daily Progress Log)

「今日できたこと」に意識を向け、小さな前進を拾い集めるWebアプリケーションです。
目標を全て達成することを目指すのではなく、1つでもできたことを肯定し、日々の積み上げを実感できる設計になっています。

## ✨ コンセプト

- **できたことを主役に**: 未達成のタスクではなく、今日できた数や積み上げにフォーカスします。
- **3つのやさしい選択肢**: 「できた！」「ちょっとできた」「また今度」の3択で、完璧じゃなくても前進を肯定します。
- **予定外の成果も記録**: 「できたことを追加」機能で、予定していなかった小さな勝ちも記録できます。
- **ポジティブなフィードバック**: 1つでもできたら前向きなメッセージが表示され、全達成は「ボーナス」としてお祝いします。
- **やさしいデザイン**: プレッシャーを感じさせない、明るく穏やかな配色を採用しています。

## 🚀 使い方

### 1. 今日の候補を並べる
- 「今日やれたらいいこと」を入力して追加します。（最大5つ）
- 「🌿 今日の候補を並べる」ボタンを押してスタートします。

### 2. 前進を記録する
各項目に対して、以下の3つから状態を選びます：
- **できた！**: 完了したこと
- **ちょっとできた**: 完全ではないけれど、少しでも手をつたこと
- **また今度**: 今日は無理しないと判断したこと（ネガティブな演出はありません）

### 3. 予定外の成果を追加する
- 「💡 できたことを追加」から、予定していなかったけれどできたこと（例：洗濯できた、5分だけ作業できた）を追加できます。

### 4. 積み上げを確認する
- 画面上部の「✨ 今日できたこと」に、今日の前進がリストアップされます。
- 1つでもできると、前向きなメッセージが表示されます。

### 5. 新しい1日を始める
- 「🌅 新しい1日を始める」ボタンで記録をクリアし、明日に進むことができます。

## 🛠️ 技術スタック

- **HTML5**: セマンティックなマークアップ
- **CSS3**: モダンなデザインとアニメーション
- **Vanilla JavaScript**: フレームワーク不要の軽量実装
- **LocalStorage API**: クライアントサイドでのデータ永続化（旧バージョンからの自動データ移行対応）

## 📦 ファイル構成

```
daily-goal-tracker/
├── index.html      # メインHTMLファイル
├── styles.css      # スタイルシート
├── main.js         # アプリケーションロジック
└── README.md       # このファイル
```

## 🌐 デプロイ方法（GitHub Pages）

このリポジトリは GitHub Pages を使用してホスティングされています。
設定は GitHub のリポジトリ設定から `Pages` を選択し、`main` ブランチをソースに指定するだけで完了します。

## 🔒 プライバシー

このアプリケーションは完全にクライアントサイドで動作します。

- データは全てブラウザのローカルストレージに保存されます
- サーバーへのデータ送信は一切ありません
- 広告やトラッキングは含まれていません

## 📄 ライセンス

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
