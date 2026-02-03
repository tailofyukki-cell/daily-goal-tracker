# 📝 1日の目標管理アプリ

シンプルで使いやすい1日のタスク管理Webアプリケーションです。最大5つまでのタスクを登録し、進捗を可視化しながら目標達成を目指せます。

## ✨ 特徴

- **シンプルな操作**: 直感的なUIで誰でも簡単に使えます
- **進捗の可視化**: リアルタイムで達成率を確認できます
- **達成時の演出**: 全タスク完了時に紙吹雪でお祝い🎉
- **データ保存**: ローカルストレージで自動保存、リロードしても安心
- **レスポンシブ対応**: PC・タブレット・スマートフォンで快適に使えます

## 🚀 使い方

### 1. タスクの登録
- 入力欄に今日のタスクを入力して「追加」ボタンをクリック
- 最大5つまでタスクを登録できます
- 不要なタスクは「削除」ボタンで削除可能

### 2. 目標設定
- タスクを登録したら「🎯 目標設定」ボタンをクリック
- 登録したタスクの進捗ボタンが表示されます

### 3. 進捗管理
- 各タスクのボタンをクリックして完了をマーク
- 進捗率がリアルタイムで更新されます
- 完了したタスクは緑色で表示され、再度クリックできません

### 4. 目標達成
- 全てのタスクを完了すると達成メッセージが表示されます
- 紙吹雪のアニメーションでお祝い🎉

### 5. リセット
- 「🔄 今日をリセット」ボタンで全てのデータをクリア
- 新しい1日を始められます

## 🛠️ 技術スタック

- **HTML5**: セマンティックなマークアップ
- **CSS3**: モダンなデザインとアニメーション
- **Vanilla JavaScript**: フレームワーク不要の軽量実装
- **LocalStorage API**: クライアントサイドでのデータ永続化

## 📦 ファイル構成

```
daily-goal-tracker/
├── index.html      # メインHTMLファイル
├── styles.css      # スタイルシート
├── main.js         # アプリケーションロジック
└── README.md       # このファイル
```

## 🌐 デプロイ方法（GitHub Pages）

### 1. GitHubリポジトリの作成
```bash
# リポジトリの初期化
git init
git add .
git commit -m "Initial commit: Daily Goal Tracker"

# GitHubリポジトリにプッシュ
git remote add origin https://github.com/YOUR_USERNAME/daily-goal-tracker.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pagesの有効化
1. GitHubリポジトリのページを開く
2. 「Settings」タブをクリック
3. 左サイドバーの「Pages」をクリック
4. 「Source」で「main」ブランチを選択
5. 「Save」をクリック
6. 数分後、公開URLが表示されます

公開URL: `https://YOUR_USERNAME.github.io/daily-goal-tracker/`

## 📋 機能一覧

### 必須機能
- [x] タスク登録（最大5つ）
- [x] 空文字バリデーション
- [x] 6個目の登録防止とエラー表示
- [x] タスクの追加・削除
- [x] 目標設定ボタン
- [x] 進捗ボタンの生成
- [x] 進捗率の計算と表示
- [x] 進捗バーの表示
- [x] 二重カウント防止
- [x] 全達成時のお祝いメッセージ
- [x] 紙吹雪アニメーション

### 追加機能
- [x] ローカルストレージでのデータ保存
- [x] リセット機能
- [x] レスポンシブデザイン
- [x] スムーズなアニメーション

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

## 🤝 貢献

バグ報告や機能提案は、GitHubのIssuesでお願いします。

## 📞 サポート

問題が発生した場合は、以下を確認してください：
- ブラウザが最新版であること
- JavaScriptが有効になっていること
- ローカルストレージが利用可能であること

---

Made with ❤️ for daily productivity
