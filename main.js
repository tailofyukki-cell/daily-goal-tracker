// ===== ポジティブメッセージ集 =====
const MESSAGES = {
    // 1個できた時
    first: [
        '1つできた。今日はもう前進してる。',
        'ゼロじゃない。ちゃんと積み上がった。',
        '小さくても進んだ。これは勝ち。',
        '今日の自分、ちゃんと動いた。',
        '1個できた。それだけで今日は十分。',
    ],
    // 複数できた時
    multiple: [
        '完璧じゃなくていい。積み上げた事実がある。',
        '予定外でも、できたことはちゃんと成果。',
        '今日はいい流れ。着実に積み上がってる。',
        '全部できなくても、ゼロじゃない。',
        '今日も何かできた。それだけで十分。',
    ],
    // また今度にした時
    later: [
        'また今度に回した。作戦変更も前進。',
        '今日はここまででOK。',
        '無理しない判断も大事。',
        '今日はここまで。それでいい。',
    ],
    // ちょっとできた時
    partial: [
        'ちょっとできた。それも立派な前進。',
        '完全じゃなくても、動いた事実がある。',
        '少しでも動けた。それが積み上げ。',
    ],
    // 全達成ボーナス
    bonus: [
        '全部できた。今日は特別な日。',
        '完璧な1日。自分を褒めよう。',
        'ボーナス達成！今日はやりきった。',
    ],
};

// ランダムにメッセージを取得
function pickMessage(category) {
    const list = MESSAGES[category];
    return list[Math.floor(Math.random() * list.length)];
}

// ===== データ管理クラス =====
class ProgressLog {
    constructor() {
        // タスク候補リスト: [{ id, text }]
        this.tasks = [];
        // 各タスクの状態: { taskId: 'pending' | 'done' | 'partial' | 'later' }
        this.taskStates = {};
        // 予定外にできたこと: [{ id, text }]
        this.extraDone = [];
        // 候補を並べたかどうか
        this.isStarted = false;
        // 今日のメッセージ
        this.currentMessage = '';
        // 最終更新日
        this.lastDate = '';

        this.loadFromStorage();
    }

    // ローカルストレージから読み込み（旧形式の移行対応）
    loadFromStorage() {
        try {
            const raw = localStorage.getItem('dailyGoalTracker');
            if (!raw) return;

            const parsed = JSON.parse(raw);

            // 新形式かどうか判定（versionキーで識別）
            if (parsed.version === 2) {
                this.tasks = parsed.tasks || [];
                this.taskStates = parsed.taskStates || {};
                this.extraDone = parsed.extraDone || [];
                this.isStarted = parsed.isStarted || false;
                this.currentMessage = parsed.currentMessage || '';
                this.lastDate = parsed.lastDate || '';
            } else {
                // 旧形式（v1）からの移行
                this._migrateFromV1(parsed);
            }
        } catch (e) {
            console.error('ストレージ読み込みエラー:', e);
        }
    }

    // 旧形式データの移行
    _migrateFromV1(old) {
        const oldTasks = old.tasks || [];
        const oldCompleted = new Set(old.completedTasks || []);

        this.tasks = oldTasks.map((text, i) => ({ id: i, text }));
        this.taskStates = {};
        this.tasks.forEach((t, i) => {
            this.taskStates[t.id] = oldCompleted.has(i) ? 'done' : 'pending';
        });
        this.isStarted = old.isGoalSet || false;
        this.extraDone = [];
        this.currentMessage = '';
        this.lastDate = '';
        this.saveToStorage();
    }

    // ローカルストレージに保存
    saveToStorage() {
        try {
            const data = {
                version: 2,
                tasks: this.tasks,
                taskStates: this.taskStates,
                extraDone: this.extraDone,
                isStarted: this.isStarted,
                currentMessage: this.currentMessage,
                lastDate: this.lastDate,
            };
            localStorage.setItem('dailyGoalTracker', JSON.stringify(data));
        } catch (e) {
            console.error('ストレージ保存エラー:', e);
        }
    }

    // タスク候補を追加
    addTask(text) {
        const trimmed = text.trim();
        if (!trimmed) {
            return { success: false, message: 'やれたらいいことを入力してください' };
        }
        if (this.tasks.length >= 5) {
            return { success: false, message: '候補は最大5つまでです' };
        }
        const id = Date.now();
        this.tasks.push({ id, text: trimmed });
        this.taskStates[id] = 'pending';
        this.saveToStorage();
        return { success: true };
    }

    // タスク候補を削除
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        delete this.taskStates[id];
        this.saveToStorage();
    }

    // 候補を並べる（開始）
    start() {
        if (this.tasks.length === 0) {
            return { success: false, message: 'やれたらいいことを1つ以上入力してください' };
        }
        this.isStarted = true;
        // 状態をリセット（pendingに戻す）
        this.tasks.forEach(t => {
            this.taskStates[t.id] = 'pending';
        });
        this.saveToStorage();
        return { success: true };
    }

    // タスク状態を更新
    setTaskState(id, state) {
        this.taskStates[id] = state;
        this.saveToStorage();
    }

    // 予定外にできたことを追加
    addExtraDone(text) {
        const trimmed = text.trim();
        if (!trimmed) {
            return { success: false, message: 'できたことを入力してください' };
        }
        this.extraDone.push({ id: Date.now(), text: trimmed });
        this.saveToStorage();
        return { success: true };
    }

    // 予定外にできたことを削除
    deleteExtraDone(id) {
        this.extraDone = this.extraDone.filter(e => e.id !== id);
        this.saveToStorage();
    }

    // できた数を取得（done + partial）
    getDoneCount() {
        let count = 0;
        this.tasks.forEach(t => {
            const s = this.taskStates[t.id];
            if (s === 'done' || s === 'partial') count++;
        });
        count += this.extraDone.length;
        return count;
    }

    // 積み上げ率（0〜1）
    getStackRate() {
        const total = this.tasks.length;
        if (total === 0) return 0;
        let done = 0;
        this.tasks.forEach(t => {
            const s = this.taskStates[t.id];
            if (s === 'done') done += 1;
            else if (s === 'partial') done += 0.5;
        });
        return done / total;
    }

    // 全達成チェック（done のみ）
    isAllDone() {
        if (this.tasks.length === 0) return false;
        return this.tasks.every(t => this.taskStates[t.id] === 'done');
    }

    // できたこと一覧（done + partial + extra）
    getDoneItems() {
        const items = [];
        this.tasks.forEach(t => {
            const s = this.taskStates[t.id];
            if (s === 'done') items.push({ text: t.text, type: 'done' });
            else if (s === 'partial') items.push({ text: t.text, type: 'partial' });
        });
        this.extraDone.forEach(e => {
            items.push({ text: e.text, type: 'extra' });
        });
        return items;
    }

    // リセット
    reset() {
        this.tasks = [];
        this.taskStates = {};
        this.extraDone = [];
        this.isStarted = false;
        this.currentMessage = '';
        this.lastDate = '';
        this.saveToStorage();
    }
}

// ===== UI管理クラス =====
class UIManager {
    constructor(log) {
        this.log = log;
        this._initElements();
        this._attachEvents();
        this.render();
    }

    _initElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.taskList = document.getElementById('taskList');
        this.taskCount = document.getElementById('taskCount');
        this.setGoalBtn = document.getElementById('setGoalBtn');
        this.resetBtn = document.getElementById('resetBtn');

        this.progressMessageSection = document.getElementById('progressMessageSection');
        this.progressMessage = document.getElementById('progressMessage');

        this.doneSection = document.getElementById('doneSection');
        this.doneList = document.getElementById('doneList');
        this.doneCountBadge = document.getElementById('doneCountBadge');

        this.stackBarSection = document.getElementById('stackBarSection');
        this.stackBar = document.getElementById('stackBar');

        this.progressSection = document.getElementById('progressSection');
        this.taskButtons = document.getElementById('taskButtons');

        this.extraDoneInput = document.getElementById('extraDoneInput');
        this.addExtraDoneBtn = document.getElementById('addExtraDoneBtn');
        this.extraErrorMessage = document.getElementById('extraErrorMessage');

        this.bonusModal = document.getElementById('bonusModal');
        this.closeBonusBtn = document.getElementById('closeBonusBtn');
        this.confettiCanvas = document.getElementById('confettiCanvas');
    }

    _attachEvents() {
        // 候補追加
        this.addTaskBtn.addEventListener('click', () => this._handleAddTask());
        this.taskInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') this._handleAddTask();
        });

        // 候補を並べる
        this.setGoalBtn.addEventListener('click', () => this._handleStart());

        // リセット
        this.resetBtn.addEventListener('click', () => this._handleReset());

        // 予定外できたこと追加
        this.addExtraDoneBtn.addEventListener('click', () => this._handleAddExtraDone());
        this.extraDoneInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') this._handleAddExtraDone();
        });

        // ボーナスモーダルを閉じる
        this.closeBonusBtn.addEventListener('click', () => {
            this.bonusModal.classList.add('hidden');
        });
        this.bonusModal.addEventListener('click', e => {
            if (e.target === this.bonusModal) this.bonusModal.classList.add('hidden');
        });
    }

    _handleAddTask() {
        const result = this.log.addTask(this.taskInput.value);
        if (result.success) {
            this.taskInput.value = '';
            this.errorMessage.textContent = '';
            this._renderTaskList();
        } else {
            this.errorMessage.textContent = result.message;
        }
    }

    _handleStart() {
        const result = this.log.start();
        if (result.success) {
            this.errorMessage.textContent = '';
            this.render();
        } else {
            this.errorMessage.textContent = result.message;
        }
    }

    _handleReset() {
        if (confirm('今日の記録を消します。よろしいですか？\nできたことも消えるため、必要ならメモしておいてください。')) {
            this.log.reset();
            this.render();
        }
    }

    _handleAddExtraDone() {
        const result = this.log.addExtraDone(this.extraDoneInput.value);
        if (result.success) {
            this.extraDoneInput.value = '';
            this.extraErrorMessage.textContent = '';
            this._renderDoneSection();
            this._renderStackBar();
            this._renderProgressMessage('extra');
        } else {
            this.extraErrorMessage.textContent = result.message;
        }
    }

    _handleStateChange(taskId, state) {
        const prev = this.log.taskStates[taskId];
        // 同じ状態をもう一度押したらpendingに戻す（トグル）
        if (prev === state) {
            this.log.setTaskState(taskId, 'pending');
        } else {
            this.log.setTaskState(taskId, state);
        }

        this._renderTaskButtons();
        this._renderDoneSection();
        this._renderStackBar();

        const newState = this.log.taskStates[taskId];
        const doneCount = this.log.getDoneCount();
        if (newState === 'later') {
            // また今度：既にできたことがあればdoneメッセージを優先、なければlaterメッセージ
            if (doneCount > 0) {
                this._renderProgressMessage('done');
            } else {
                this._renderProgressMessage('later');
            }
        } else if (newState !== 'pending') {
            this._renderProgressMessage(newState);
        }

        // 全達成チェック
        if (this.log.isAllDone()) {
            setTimeout(() => this._showBonus(), 400);
        }
    }

    // ===== レンダリング =====
    render() {
        this._renderTaskList();
        this._renderDoneSection();
        this._renderStackBar();
        this._renderProgressSection();
        this._renderProgressMessage(null);
    }

    _renderTaskList() {
        this.taskList.innerHTML = '';
        this.taskCount.textContent = this.log.tasks.length;

        this.log.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';

            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '削除';
            deleteBtn.addEventListener('click', () => {
                this.log.deleteTask(task.id);
                this._renderTaskList();
            });

            li.appendChild(span);
            li.appendChild(deleteBtn);
            this.taskList.appendChild(li);
        });
    }

    _renderDoneSection() {
        const items = this.log.getDoneItems();
        const count = this.log.getDoneCount();

        if (items.length === 0) {
            this.doneSection.classList.add('hidden');
            return;
        }

        this.doneSection.classList.remove('hidden');
        this.doneList.innerHTML = '';

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'done-item' + (item.type === 'partial' ? ' partial' : '');

            const icon = document.createElement('span');
            icon.className = 'done-icon';
            icon.textContent = item.type === 'done' ? '✅' : item.type === 'partial' ? '🔵' : '⭐';

            const text = document.createElement('span');
            text.className = 'done-text';
            text.textContent = item.text;

            const tag = document.createElement('span');
            tag.className = 'done-tag';
            tag.textContent = item.type === 'done' ? 'できた！' : item.type === 'partial' ? 'ちょっとできた' : '予定外';

            li.appendChild(icon);
            li.appendChild(text);
            li.appendChild(tag);
            this.doneList.appendChild(li);
        });

        this.doneCountBadge.textContent = `${count}個できた`;
    }

    _renderStackBar() {
        const rate = this.log.getStackRate();
        const doneCount = this.log.getDoneCount();

        if (doneCount === 0 && !this.log.isStarted) {
            this.stackBarSection.classList.add('hidden');
            return;
        }

        this.stackBarSection.classList.remove('hidden');
        this.stackBar.style.width = `${Math.round(rate * 100)}%`;
    }

    _renderProgressSection() {
        if (!this.log.isStarted) {
            this.progressSection.classList.add('hidden');
            return;
        }
        this.progressSection.classList.remove('hidden');
        this._renderTaskButtons();
    }

    _renderTaskButtons() {
        this.taskButtons.innerHTML = '';

        this.log.tasks.forEach(task => {
            const state = this.log.taskStates[task.id] || 'pending';

            const group = document.createElement('div');
            group.className = 'task-btn-group';

            const label = document.createElement('div');
            label.className = 'task-btn-label';
            label.textContent = task.text;
            label.title = task.text;

            const actions = document.createElement('div');
            actions.className = 'task-btn-actions';

            // できた！ボタン
            const btnDone = document.createElement('button');
            btnDone.className = 'state-btn btn-done' + (state === 'done' ? ' active' : '');
            btnDone.textContent = 'できた！';
            btnDone.addEventListener('click', () => this._handleStateChange(task.id, 'done'));

            // ちょっとできたボタン
            const btnPartial = document.createElement('button');
            btnPartial.className = 'state-btn btn-partial' + (state === 'partial' ? ' active' : '');
            btnPartial.textContent = 'ちょっとできた';
            btnPartial.addEventListener('click', () => this._handleStateChange(task.id, 'partial'));

            // また今度ボタン
            const btnLater = document.createElement('button');
            btnLater.className = 'state-btn btn-later' + (state === 'later' ? ' active' : '');
            btnLater.textContent = 'また今度';
            btnLater.addEventListener('click', () => this._handleStateChange(task.id, 'later'));

            actions.appendChild(btnDone);
            actions.appendChild(btnPartial);
            actions.appendChild(btnLater);

            group.appendChild(label);
            group.appendChild(actions);
            this.taskButtons.appendChild(group);
        });
    }

    _renderProgressMessage(trigger) {
        const doneCount = this.log.getDoneCount();

        if (doneCount === 0 && !trigger) {
            this.progressMessageSection.classList.add('hidden');
            return;
        }

        let msg = '';
        if (trigger === 'later') {
            msg = pickMessage('later');
        } else if (trigger === 'partial') {
            msg = pickMessage('partial');
        } else if (trigger === 'done' || trigger === 'extra' || doneCount >= 1) {
            if (doneCount === 1) {
                msg = pickMessage('first');
            } else {
                msg = pickMessage('multiple');
            }
        } else {
            this.progressMessageSection.classList.add('hidden');
            return;
        }

        this.progressMessage.textContent = msg;
        this.progressMessageSection.classList.remove('hidden');
    }

    _showBonus() {
        this.bonusModal.classList.remove('hidden');
        this._startConfetti();
    }

    // ===== 紙吹雪 =====
    _startConfetti() {
        const canvas = this.confettiCanvas;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#68d391', '#4fd1c5', '#f6ad55', '#667eea', '#fc8181', '#b794f4'];
        const pieces = [];

        for (let i = 0; i < 120; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach((p, i) => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();

                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += 4;

                if (p.y > canvas.height) pieces.splice(i, 1);
            });

            if (pieces.length > 0) requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        animate();
    }
}

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
    const log = new ProgressLog();
    const ui = new UIManager(log);
});
