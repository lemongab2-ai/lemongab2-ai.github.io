// 无貌之神的演员 - 剧本台词显示模块
// 职责：纯 UI 显示，不做初始化和通关检测
// 注意：所有初始化逻辑已移至 main.js（副本主控制器）

let storyInterval = null;
let storyData = null;
let currentStoryIndex = 0;

// 加载副本 JSON 数据
function loadDungeonData(dungeonId) {
    const fileName = `../data/${dungeonId}.json`;

    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            storyData = data;
            updateStoryDisplay();
            console.log(`✅ 剧本数据已加载: ${data.story.length} 句`);
        })
        .catch(error => {
            console.error("❌ 加载剧本数据失败:", error);
            document.getElementById('storyText').textContent = "无法加载剧本数据。";
        });
}

// 启动台词循环
function startStoryLoop() {
    if (!storyData || !storyData.story) return;

    // 初始化显示
    currentStoryIndex = 0;
    updateStoryDisplay();

    // 清理旧的定时器
    if (storyInterval) {
        clearInterval(storyInterval);
    }

    // 每 3 秒更新一句台词
    storyInterval = setInterval(() => {
        if (currentStoryIndex < storyData.story.length - 1) {
            currentStoryIndex++;
            updateStoryDisplay();
        }
    }, 3000);
}

// 更新台词显示
function updateStoryDisplay() {
    if (!storyData || !storyData.story) return;

    const storyText = document.getElementById('storyText');
    const storyIndexSpan = document.getElementById('storyIndex');
    const storyTotalSpan = document.getElementById('storyTotal');

    if (storyText) storyText.textContent = storyData.story[currentStoryIndex];
    if (storyIndexSpan) storyIndexSpan.textContent = currentStoryIndex + 1;
    if (storyTotalSpan) storyTotalSpan.textContent = storyData.story.length;

    // 动画效果
    if (storyText) {
        storyText.style.animation = 'none';
        storyText.offsetHeight; // 触发重绘
        storyText.style.animation = 'fadeIn 0.5s ease';
    }
}

// 更新副本信息显示
function updateDungeonInfo(dungeonId) {
    const dungeon = DungeonConfig[dungeonId];

    if (dungeon) {
        const nameElement = document.getElementById('dungeonName');
        const currentElement = document.getElementById('currentDungeonDisplay');
        const sanCostElement = document.getElementById('sanCostDisplay');
        const conditionsElement = document.getElementById('clearConditionsDisplay');

        if (nameElement) nameElement.textContent = dungeon.name;
        if (currentElement) currentElement.textContent = dungeon.name;
        if (sanCostElement) sanCostElement.textContent = dungeon.sanCost;

        if (conditionsElement) {
            const conditionsText = Object.entries(dungeon.clearConditions)
                .map(([skill, level]) => `${skill} Lv.${level}`)
                .join(' / ');
            conditionsElement.textContent = conditionsText;
        }
    }
}

// 确认退出（供 HTML 调用）
function confirmExit() {
    if (confirm("确定要退出副本吗？\n\n⚠️ 中途退出将无法获得任何奖励，SAN值不会恢复。\n\n是否继续？")) {
        // 调用 main.js 的退出函数
        if (window.exitDungeonAbandon) {
            window.exitDungeonAbandon();
        }
    }
}

// 完成副本（供 HTML 调用）
function completeDungeon() {
    const urlParams = new URLSearchParams(window.location.search);
    const dungeonId = urlParams.get('dungeon');

    if (dungeonId) {
        // 调用 main.js 的完成函数
        if (window.completeDungeonAndExit) {
            window.completeDungeonAndExit();
        }
    }
}

// ========== 初始化接口（由 main.js 调用） ==========

// 初始化副本 UI（由 main.js 调用）
function initializeDungeonUI(dungeonId) {
    console.log("🎨 初始化副本 UI...");
    
    // 加载副本数据
    loadDungeonData(dungeonId);
    
    // 更新副本信息
    updateDungeonInfo(dungeonId);
    
    // 启动台词循环
    startStoryLoop();
}

// 清理资源
function cleanupDungeonUI() {
    if (storyInterval) {
        clearInterval(storyInterval);
        storyInterval = null;
    }
    console.log("🧹 副本 UI 已清理");
}

// ========== 导出全局函数 ==========

window.confirmExit = confirmExit;
window.completeDungeon = completeDungeon;
window.initializeDungeonUI = initializeDungeonUI;
window.cleanupDungeonUI = cleanupDungeonUI;
