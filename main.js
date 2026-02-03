// アプリケーションの状態管理
class TaskManager {
    constructor() {
        this.tasks = [];
        this.completedTasks = new Set();
        this.isGoalSet = false;
        this.loadFromStorage();
    }

    // ローカルストレージから読み込み
    loadFromStorage() {
        try {
            const data = localStorage.getItem('dailyGoalTracker');
            if (data) {
                const parsed = JSON.parse(data);
                this.tasks = parsed.tasks || [];
                this.completedTasks = new Set(parsed.completedTasks || []);
                this.isGoalSet = parsed.isGoalSet || false;
            }
        } catch (error) {
            console.error('ストレージからの読み込みエラー:', error);
        }
    }

    // ローカルストレージに保存
    saveToStorage() {
        try {
            const data = {
                tasks: this.tasks,
                completedTasks: Array.from(this.completedTasks),
                isGoalSet: this.isGoalSet
            };
            localStorage.setItem('dailyGoalTracker', JSON.stringify(data));
        } catch (error) {
            console.error('ストレージへの保存エラー:', error);
        }
    }

    // タスク追加
    addTask(taskText) {
        if (!taskText.trim()) {
            return { success: false, message: 'タスクを入力してください' };
        }
        if (this.tasks.length >= 5) {
            return { success: false, message: 'タスクは最大5つまでです' };
        }
        this.tasks.push(taskText.trim());
        this.saveToStorage();
        return { success: true };
    }

    // タスク削除
    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveToStorage();
    }

    // 目標設定
    setGoal() {
        if (this.tasks.length === 0) {
            return { success: false, message: 'タスクを最低1つ登録してください' };
        }
        this.isGoalSet = true;
        this.completedTasks.clear();
        this.saveToStorage();
        return { success: true };
    }

    // タスク完了
    completeTask(index) {
        this.completedTasks.add(index);
        this.saveToStorage();
    }

    // 進捗率計算
    getProgress() {
        if (this.tasks.length === 0) return 0;
        return Math.round((this.completedTasks.size / this.tasks.length) * 100);
    }

    // 全達成チェック
    isAllCompleted() {
        return this.tasks.length > 0 && this.completedTasks.size === this.tasks.length;
    }

    // リセット
    reset() {
        this.tasks = [];
        this.completedTasks.clear();
        this.isGoalSet = false;
        this.saveToStorage();
    }
}

// UI管理
class UIManager {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.initElements();
        this.attachEventListeners();
        this.render();
    }

    initElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.taskList = document.getElementById('taskList');
        this.taskCount = document.getElementById('taskCount');
        this.setGoalBtn = document.getElementById('setGoalBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.progressSection = document.getElementById('progressSection');
        this.progressPercent = document.getElementById('progressPercent');
        this.progressBar = document.getElementById('progressBar');
        this.taskButtons = document.getElementById('taskButtons');
        this.achievementMessage = document.getElementById('achievementMessage');
        this.confettiCanvas = document.getElementById('confettiCanvas');
    }

    attachEventListeners() {
        // タスク追加
        this.addTaskBtn.addEventListener('click', () => this.handleAddTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAddTask();
        });

        // 目標設定
        this.setGoalBtn.addEventListener('click', () => this.handleSetGoal());

        // リセット
        this.resetBtn.addEventListener('click', () => this.handleReset());

        // 達成メッセージクリック
        this.achievementMessage.addEventListener('click', () => {
            this.achievementMessage.classList.add('hidden');
        });
    }

    handleAddTask() {
        const taskText = this.taskInput.value;
        const result = this.taskManager.addTask(taskText);
        
        if (result.success) {
            this.taskInput.value = '';
            this.errorMessage.textContent = '';
            this.renderTaskList();
        } else {
            this.errorMessage.textContent = result.message;
        }
    }

    handleSetGoal() {
        const result = this.taskManager.setGoal();
        
        if (result.success) {
            this.errorMessage.textContent = '';
            this.render();
        } else {
            this.errorMessage.textContent = result.message;
        }
    }

    handleReset() {
        if (confirm('今日のデータをリセットしますか?')) {
            this.taskManager.reset();
            this.render();
        }
    }

    handleTaskComplete(index) {
        this.taskManager.completeTask(index);
        this.renderProgress();
        
        if (this.taskManager.isAllCompleted()) {
            this.showAchievement();
        }
    }

    renderTaskList() {
        this.taskList.innerHTML = '';
        this.taskCount.textContent = this.taskManager.tasks.length;

        this.taskManager.tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            
            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '削除';
            deleteBtn.addEventListener('click', () => {
                this.taskManager.deleteTask(index);
                this.renderTaskList();
            });
            
            li.appendChild(span);
            li.appendChild(deleteBtn);
            this.taskList.appendChild(li);
        });
    }

    renderProgress() {
        if (!this.taskManager.isGoalSet) {
            this.progressSection.classList.add('hidden');
            return;
        }

        this.progressSection.classList.remove('hidden');
        
        // 進捗率更新
        const progress = this.taskManager.getProgress();
        this.progressPercent.textContent = progress;
        this.progressBar.style.width = `${progress}%`;

        // タスクボタン生成
        this.taskButtons.innerHTML = '';
        this.taskManager.tasks.forEach((task, index) => {
            const btn = document.createElement('button');
            btn.className = 'task-btn';
            btn.textContent = task;
            
            const isCompleted = this.taskManager.completedTasks.has(index);
            if (isCompleted) {
                btn.disabled = true;
                btn.classList.add('completed');
                btn.textContent = `✓ ${task}`;
            } else {
                btn.addEventListener('click', () => this.handleTaskComplete(index));
            }
            
            this.taskButtons.appendChild(btn);
        });
    }

    showAchievement() {
        this.achievementMessage.classList.remove('hidden');
        this.startConfetti();
    }

    render() {
        this.renderTaskList();
        this.renderProgress();
    }

    // 紙吹雪アニメーション
    startConfetti() {
        const canvas = this.confettiCanvas;
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confetti = [];
        const colors = ['#667eea', '#764ba2', '#48bb78', '#f6ad55', '#fc8181'];
        
        // 紙吹雪生成
        for (let i = 0; i < 100; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360
            });
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            confetti.forEach((piece, index) => {
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.rotation * Math.PI / 180);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
                ctx.restore();
                
                piece.y += piece.speedY;
                piece.x += piece.speedX;
                piece.rotation += 5;
                
                // 画面外に出たら削除
                if (piece.y > canvas.height) {
                    confetti.splice(index, 1);
                }
            });
            
            if (confetti.length > 0) {
                animationId = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
        
        animate();
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    const uiManager = new UIManager(taskManager);
});
