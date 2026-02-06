// 无貌之神的演员 - 副本主控制器
// 职责：接管 PK2 生命周期，是副本系统的唯一入口
// 注意：story.js 只负责 UI 显示，不做初始化和通关检测

// ========== 副本模式标志 ==========
let isDungeonMode = false;
let dungeonSnapshot = null;
let clearCheckInterval = null;

// ========== 副本快照机制 ==========

// 保存进入副本时的状态快照
function saveDungeonSnapshot() {
    dungeonSnapshot = {
        coins: gameData.coins,
        days: gameData.days,
        totalDays: gameData.totalDays,
        evil: gameData.evil,
        essence: gameData.essence,
        dark_matter: gameData.dark_matter,
        dark_orbs: gameData.dark_orbs,
        hypercubes: gameData.hypercubes,
        skills: {},
        jobs: {}
    };

    // 保存所有技能和职位的等级
    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName];
        if (task instanceof Skill) {
            dungeonSnapshot.skills[taskName] = task.level;
        } else if (task instanceof Job) {
            dungeonSnapshot.jobs[taskName] = task.level;
        }
    }

    console.log("✅ 副本快照已保存");
    localStorage.setItem("dungeonSnapshot", JSON.stringify(dungeonSnapshot));
}

// 恢复副本快照（失败/死亡时调用）
function restoreDungeonSnapshot() {
    const snapshotStr = localStorage.getItem("dungeonSnapshot");
    if (!snapshotStr) {
        console.warn("⚠️ 未找到副本快照");
        return;
    }

    const snapshot = JSON.parse(snapshotStr);

    // 恢复基础数据
    gameData.coins = snapshot.coins;
    gameData.days = snapshot.days;
    gameData.totalDays = snapshot.totalDays;
    gameData.evil = snapshot.evil;
    gameData.essence = snapshot.essence;
    gameData.dark_matter = snapshot.dark_matter;
    gameData.dark_orbs = snapshot.dark_orbs;
    gameData.hypercubes = snapshot.hypercubes;

    // 恢复技能和职位等级
    for (const taskName in snapshot.skills) {
        if (gameData.taskData[taskName]) {
            gameData.taskData[taskName].level = snapshot.skills[taskName];
        }
    }

    for (const taskName in snapshot.jobs) {
        if (gameData.taskData[taskName]) {
            gameData.taskData[taskName].level = snapshot.jobs[taskName];
        }
    }

    console.log("✅ 副本快照已恢复");
    localStorage.removeItem("dungeonSnapshot");
}

// ========== 副本通关检测 ==========

function startDungeonClearCheck() {
    const urlParams = new URLSearchParams(window.location.search);
    const dungeonId = urlParams.get('dungeon');

    if (!dungeonId) return;

    // 清理旧的检测定时器
    if (clearCheckInterval) {
        clearInterval(clearCheckInterval);
    }

    // 每 30 秒检测一次
    clearCheckInterval = setInterval(() => {
        checkClearConditions(dungeonId);
    }, 30000);

    // 初始检测延迟 1 秒执行
    setTimeout(() => checkClearConditions(dungeonId), 1000);
}

function checkClearConditions(dungeonId) {
    loadSharedData();

    const dungeon = DungeonConfig[dungeonId];
    if (!dungeon) return;

    // 获取当前技能等级
    const skillLevels = {};

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName];

        if (task instanceof Skill) {
            skillLevels[task.name] = task.level;
        }
    }

    // 检查是否满足通关条件
    const conditions = dungeon.clearConditions;
    let allMet = true;
    let missingSkills = [];

    for (const skillName in conditions) {
        const requiredLevel = conditions[skillName];
        const currentLevel = skillLevels[skillName] || 0;

        if (currentLevel < requiredLevel) {
            allMet = false;
            missingSkills.push(`${skillName}(${currentLevel}/${requiredLevel})`);
        }
    }

    // 更新通关按钮显示
    const clearButton = document.getElementById('clearButton');

    if (allMet) {
        clearButton.classList.remove('hidden');
        console.log("✅ 通关条件已满足");
    } else {
        clearButton.classList.add('hidden');
        console.log("❌ 通关条件未满足，缺少:", missingSkills.join(', '));
    }
}

// ========== 副本退出逻辑 ==========

// 中途退出（失败）
function exitDungeonAbandon() {
    console.log("🚪 玩家主动退出副本");

    // 停止检测定时器
    if (clearCheckInterval) {
        clearInterval(clearCheckInterval);
        clearCheckInterval = null;
    }

    // 恢复快照
    restoreDungeonSnapshot();

    // 清理剧本UI
    if (window.cleanupDungeonUI) {
        window.cleanupDungeonUI();
    }

    // 标记退出副本
    loadSharedData();
    SharedData.currentDungeon = "";
    SharedData.currentDungeonStoryIndex = 0;
    saveSharedData();

    // 完全清除副本模式状态（避免污染后台）
    window.isDungeonMode = false;
    isDungeonMode = false;

    // 清除副本相关的 localStorage 数据
    localStorage.removeItem("dungeonSnapshot");
    localStorage.removeItem("currentDungeonState");

    console.log("✅ 副本已退出，状态已清理");

    // 跳转回后台
    window.location.href = 'index.html';
}

// 副本通关（成功）
function completeDungeonAndExit() {
    const urlParams = new URLSearchParams(window.location.search);
    const dungeonId = urlParams.get('dungeon');

    if (!dungeonId) return;

    // 停止检测定时器
    if (clearCheckInterval) {
        clearInterval(clearCheckInterval);
        clearCheckInterval = null;
    }

    // 调用共享模块的完成函数
    loadSharedData();
    completeDungeon(dungeonId);

    // 显示完成提示
    const dungeon = DungeonConfig[dungeonId];
    alert(`🎉 剧本完成！\n\n获得纪念品：${dungeon.souvenir.name}\nSAN恢复：+${dungeon.sanReward}\n\n即将返回后台...`);

    // 延迟跳转
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// ========== 初始化入口（唯一的主控点） ==========

document.addEventListener('DOMContentLoaded', function() {
    // 加载共享数据
    loadSharedData();

    // 从 URL 获取副本 ID
    const urlParams = new URLSearchParams(window.location.search);
    const dungeonId = urlParams.get('dungeon');

    if (!dungeonId) {
        console.error("❌ 未提供副本 ID");
        return;
    }

    // ✅ 标记副本模式（PK2 现在知道了）
    isDungeonMode = true;
    window.isDungeonMode = true; // 暴露给全局，方便其他模块检查
    console.log("✅ 进入副本模式:", dungeonId);

    // ✅ 保存进入副本前的快照
    saveDungeonSnapshot();

    // ✅ 初始化剧本 UI（调用 story.js 的函数）
    if (window.initializeDungeonUI) {
        window.initializeDungeonUI(dungeonId);
    }

    // ✅ 启动通关检测
    startDungeonClearCheck();

    // ✅ 更新副本信息显示
    updateDungeonInfoDisplay(dungeonId);
});

function updateDungeonInfoDisplay(dungeonId) {
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

// ========== Hook PK2 死亡处理 ==========

// 保存原版的死亡处理函数
const originalHandleDeath = typeof handleDeath !== 'undefined' ? handleDeath : null;

// 重写死亡处理（副本模式下回滚快照，原版模式下正常转生）
function handleDeath() {
    if (window.isDungeonMode) {
        console.log("💀 副本模式：玩家死亡，回滚快照");

        // 停止检测定时器
        if (clearCheckInterval) {
            clearInterval(clearCheckInterval);
            clearCheckInterval = null;
        }

        // 清理剧本UI
        if (window.cleanupDungeonUI) {
            window.cleanupDungeonUI();
        }

        // 恢复快照
        restoreDungeonSnapshot();

        // 标记退出副本
        loadSharedData();
        SharedData.currentDungeon = "";
        SharedData.currentDungeonStoryIndex = 0;
        saveSharedData();

        // 完全清除副本模式状态（避免污染后台）
        window.isDungeonMode = false;
        isDungeonMode = false;

        // 提示并跳转
        alert("💀 你在副本中死亡！\n\n状态已回滚到进入副本前，未获得任何奖励。");
        window.location.href = 'index.html';
    } else {
        // 原版模式：调用原版死亡处理
        if (originalHandleDeath) {
            originalHandleDeath();
        }
    }
}

// ========== Hook PK2 存档机制 ==========

// 保存原版的存档函数
const originalSaveGameData = typeof saveGameData !== 'undefined' ? saveGameData : null;

// 重写存档函数（副本模式下禁用自动存档）
function saveGameData() {
    if (window.isDungeonMode) {
        console.log("🚫 副本模式：禁用自动存档");
        return;
    }
    // 原版模式：正常存档
    if (originalSaveGameData) {
        originalSaveGameData();
    }
}

// ========== 货币名称覆盖（保持兼容） ==========

const originalFormatCoins = typeof formatCoins !== 'undefined' ? formatCoins : function(amount, element) {
    if (element) element.textContent = format(amount) + " 以太碎片";
    return format(amount) + " 以太碎片";
};

// ========== 导出全局函数供 HTML 调用 ==========

window.exitDungeonAbandon = exitDungeonAbandon;
window.completeDungeonAndExit = completeDungeonAndExit;
