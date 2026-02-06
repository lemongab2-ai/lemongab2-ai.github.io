// 无貌之神的演员 - 数值共享模块
// 用于后台和副本之间的数值同步

const SharedData = {
    san: 100,                          // SAN值（0-100）
    bond: 0,                           // 羁绊度（0-100）
    souvenirs: [],                      // 纪念品列表
    currentDungeon: "",                 // 当前副本ID
    completedDungeons: [],               // 已完成副本列表
    currentDungeonStoryIndex: 0,         // 当前副本台词进度
    // ===== NPC系统（太宰 - 恋人）=====
    loverBond: 0,                       // 太宰羁绊值 (0-100)
    loverEvents: {                      // 羁绊值达到的通信解锁（防止重复显示）
        message: false,                 // 短信 (羁绊值 Lv.1 = 20)
        call: false,                   // 电话 (羁绊值 Lv.2 = 40)
        gift: false,                   // 礼物 (羁绊值 Lv.3 = 60)
        visit: false,                  // 深夜来访 (羁绊值 Lv.4 = 80)
        letter: false                  // 信件 (羁绊值 Lv.5 = 100)
    },
    unlockedAVGScenes: [],              // 已解锁的5个地点AVG剧情
    
    // ===== 现实锚点系统（与app.html对接）=====
    dungeonTime: {
        accumulated: 0,                 // 累计副本时间（秒）
        accelerator: 2,                 // 加速倍率（现实1秒 = 虚拟2秒）
        isActive: false,                // 是否正在积累（番茄钟运行中）
        enterTimestamp: null,           // 进入副本的时间戳
        lastUpdate: null                // 上次更新时间戳
    },
    realityAnchor: {
        totalFocusTime: 0,              // 累计专注时间（秒）
        sessionsCompleted: 0,           // 完成的番茄钟次数
        lastSignalTime: null,           // 最后一次信号时间
        selectedDungeon: null           // 预选的副本ID
    }
};

// 副本配置（已添加循环退出条件）
const DungeonConfig = {
    "mars_casino": {
        id: "mars_casino",
        name: "火星赌场",
        difficulty: 2,
        sanCost: 10,
        sanReward: 10,
        clearConditions: {              // 通关条件（显示完成按钮）
            "侦查": 5, 
            "追踪": 5
        },
        loopExitConditions: {           // 循环退出条件（停止循环播放）
            "侦查": 3,                   // 60%
            "追踪": 3                    // 60%
        },
        souvenir: {
            id: "spike_cigarette_box",
            name: "Spike的空烟盒",
            rarity: "稀有",
            buff: "羁绊度获取+5%"
        }
    },
    "cyber_city": {
        id: "cyber_city",
        name: "电子脑都市",
        difficulty: 3,
        sanCost: 15,
        sanReward: 15,
        clearConditions: {
            "黑客": 8, 
            "侦查": 6
        },
        loopExitConditions: {
            "黑客": 6,                   // 75%
            "侦查": 4                    // 67%
        },
        souvenir: {
            id: "unknown_chip",
            name: "来历不明的芯片",
            rarity: "稀有",
            buff: "演技经验+10%"
        }
    },
    "witch_labyrinth": {
        id: "witch_labyrinth",
        name: "魔女结界",
        difficulty: 3,
        sanCost: 15,
        sanReward: 12,
        clearConditions: {
            "战斗": 7, 
            "情感": 6
        },
        loopExitConditions: {
            "战斗": 5,                   // 71%
            "情感": 4                    // 67%
        },
        souvenir: {
            id: "grief_seed",
            name: "悲叹之种",
            rarity: "珍贵",
            buff: "SAN消耗-10%（代价未知）"
        }
    },
    "hinamizawa": {
        id: "hinamizawa",
        name: "雏见泽村",
        difficulty: 3,
        sanCost: 15,
        sanReward: 12,
        clearConditions: {
            "侦查": 7, 
            "专注": 6
        },
        loopExitConditions: {
            "侦查": 5,                   // 71%
            "专注": 4                    // 67%
        },
        souvenir: {
            id: "bloody_cotton",
            name: "染血的棉花",
            rarity: "稀有",
            buff: "剧本中SAN消耗-5%"
        }
    },
    "innsmouth": {
        id: "innsmouth",
        name: "印斯茅斯",
        difficulty: 3,
        sanCost: 15,
        sanReward: 13,
        clearConditions: {
            "专注": 7, 
            "情感": 6
        },
        loopExitConditions: {
            "专注": 5,                   // 71%
            "情感": 4                    // 67%
        },
        souvenir: {
            id: "deep_coin",
            name: "深海的金币",
            rarity: "稀有",
            buff: "SAN上限+5"
        }
    },
    "tokyo3": {
        id: "tokyo3",
        name: "第三新东京市",
        difficulty: 4,
        sanCost: 20,
        sanReward: 18,
        clearConditions: {
            "战斗": 10, 
            "情感": 8
        },
        loopExitConditions: {
            "战斗": 7,                   // 70%
            "情感": 6                    // 75%
        },
        souvenir: {
            id: "gendo_glasses",
            name: "碇司令的眼镜碎片",
            rarity: "珍贵",
            buff: "SAN消耗-10%"
        }
    },
    "fuyuki": {
        id: "fuyuki",
        name: "冬木市",
        difficulty: 4,
        sanCost: 20,
        sanReward: 18,
        clearConditions: {
            "战斗": 10, 
            "交涉": 8
        },
        loopExitConditions: {
            "战斗": 7,                   // 70%
            "交涉": 6                    // 75%
        },
        souvenir: {
            id: "nameless_sword",
            name: "无铭的剑碎片",
            rarity: "稀有",
            buff: "演技经验+15%"
        }
    },
    "nameless_city": {
        id: "nameless_city",
        name: "无名之城",
        difficulty: 5,
        sanCost: 25,
        sanReward: 25,
        clearConditions: {
            "专注": 12, 
            "情感": 10, 
            "侦查": 10
        },
        loopExitConditions: {
            "专注": 8,                   // 67%
            "情感": 7,                   // 70%
            "侦查": 7                    // 70%
        },
        souvenir: {
            id: "nameless_tablet",
            name: "无名之城的石板碎片",
            rarity: "珍贵",
            buff: "SAN上限+10，剧本后SAN恢复+20%"
        }
    }
};

// 保存共享数据到localStorage
function saveSharedData() {
    localStorage.setItem('yokohama_shared', JSON.stringify(SharedData));
}

// 从localStorage加载共享数据
function loadSharedData() {
    const saved = localStorage.getItem('yokohama_shared');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(SharedData, parsed);
        } catch (e) {
            console.error("Failed to load shared data:", e);
        }
    }
}

// 进入副本
function enterDungeon(dungeonId) {
    SharedData.currentDungeon = dungeonId;
    SharedData.currentDungeonStoryIndex = 0;
    saveSharedData();
}

// 退出副本（中途放弃）
function exitDungeonAbandon() {
    // 不获得任何奖励，SAN值保持不变
    SharedData.currentDungeon = "";
    SharedData.currentDungeonStoryIndex = 0;
    saveSharedData();
}

// 副本通关
function completeDungeon(dungeonId) {
    const dungeon = DungeonConfig[dungeonId];
    if (!dungeon) return;

    // 检查是否已经完成过
    if (SharedData.completedDungeons.includes(dungeonId)) {
        // 重复完成，只给SAN奖励
        SharedData.san = Math.min(100, SharedData.san + dungeon.sanReward);
    } else {
        // 首次完成
        SharedData.completedDungeons.push(dungeonId);
        SharedData.souvenirs.push(dungeon.souvenir);
        SharedData.san = Math.min(100, SharedData.san + dungeon.sanReward);
    }

    SharedData.currentDungeon = "";
    SharedData.currentDungeonStoryIndex = 0;
    saveSharedData();
}

// 检查副本通关条件
function checkDungeonClearConditions(dungeonId, skillLevels) {
    const dungeon = DungeonConfig[dungeonId];
    if (!dungeon) return false;

    const conditions = dungeon.clearConditions;
    let allMet = true;

    for (const skillName in conditions) {
        const requiredLevel = conditions[skillName];
        const currentLevel = skillLevels[skillName] || 0;

        if (currentLevel < requiredLevel) {
            allMet = false;
            break;
        }
    }

    return allMet;
}

// ========== 副本模式标志 ==========

// 全局副本模式标志（副本模式下为 true）
let isDungeonMode = false;

// 检查是否在副本模式
function isInDungeonMode() {
    return window.isDungeonMode === true;
}

// 标记进入副本模式
function setDungeonMode(enabled) {
    isDungeonMode = enabled;
    window.isDungeonMode = enabled;
    console.log(`副本模式: ${enabled ? "开启" : "关闭"}`);
}