// 无貌之神的演员 - PK2 技能数据替换
// 完全替换原版技能为COC技能系统

const skillBaseData = {
    // ========== 基础演技（对应 Fundamentals） ==========
    "侦查": {
        name: "侦查",
        maxXp: 100,
        heroxp: 36,
        effect: 0.01,
        description: "提升观察力和信息收集能力"
    },
    "专注": {
        name: "专注",
        maxXp: 100,
        heroxp: 37,
        effect: 0.01,
        description: "集中注意力，提高学习效率"
    },
    "交涉": {
        name: "交涉",
        maxXp: 100,
        heroxp: 38,
        effect: -0.01,
        description: "说服他人，降低消耗"
    },
    "冥想": {
        name: "冥想",
        maxXp: 100,
        heroxp: 39,
        effect: 0.01,
        description: "平静内心，提高精神稳定性"
    },

    // ========== 战斗演技（对应 Combat） ==========
    "战斗": {
        name: "战斗",
        maxXp: 100,
        heroxp: 40,
        effect: 0.01,
        description: "提升战斗技巧和格斗能力"
    },
    "战术": {
        name: "战术",
        maxXp: 100,
        heroxp: 41,
        effect: 0.01,
        description: "制定战斗策略，提高经验获取"
    },
    "力量": {
        name: "力量",
        maxXp: 100,
        heroxp: 42,
        effect: 0.01,
        description: "锻炼体能，提升力量成长"
    },

    // ========== 神秘演技（对应 Magic） ==========
    "灵感": {
        name: "灵感",
        maxXp: 100,
        heroxp: 46,
        effect: 0.01,
        description: "获得超自然的直觉和洞察力"
    },
    "情感": {
        name: "情感",
        maxXp: 100,
        heroxp: 82,
        effect: 0.01,
        description: "理解他人情感，提升演技表现"
    },
    "时间感知": {
        name: "时间感知",
        maxXp: 100,
        heroxp: 82,
        effect: 0.01,
        description: "感知时间流逝，提升游戏速度"
    },
    "心灵": {
        name: "心灵",
        maxXp: 100,
        heroxp: 100,
        effect: 0.0035,
        description: "提升精神韧性"
    },
    "预知": {
        name: "预知",
        maxXp: 100,
        heroxp: 115,
        effect: 0.006,
        description: "预见未来片段，提升经验获取"
    },
    "精神控制": {
        name: "精神控制",
        maxXp: 100,
        heroxp: 120,
        effect: 0.0027,
        description: "影响他人思想"
    },
    "洗脑": {
        name: "洗脑",
        maxXp: 100,
        heroxp: 145,
        effect: -0.01,
        description: "操控记忆，降低消耗"
    },

    // ========== 黑暗演技（对应 Dark Magic） ==========
    "黑暗影响": {
        name: "黑暗影响",
        maxXp: 100,
        heroxp: 155,
        effect: 0.01,
        description: "SAN损耗提升所有技能经验"
    },
    "疯狂控制": {
        name: "疯狂控制",
        maxXp: 100,
        heroxp: 156,
        effect: 0.01,
        description: "控制SAN损耗，提高收益"
    },
    "威慑": {
        name: "威慑",
        maxXp: 100,
        heroxp: 157,
        effect: -0.01,
        description: "散发恐怖气息，降低消耗"
    },
    "疯狂训练": {
        name: "疯狂训练",
        maxXp: 100,
        heroxp: 174,
        effect: 0.01,
        description: "SAN损耗提升所有技能经验"
    },
    "血祭": {
        name: "血祭",
        maxXp: 100,
        heroxp: 176,
        effect: 0.01,
        description: "牺牲SAN值换取力量"
    },
    "疯狂财富": {
        name: "疯狂财富",
        maxXp: 100,
        heroxp: 178,
        effect: 0.002,
        description: "SAN损耗提升以太碎片获取"
    },
    "黑暗知识": {
        name: "黑暗知识",
        maxXp: 100,
        heroxp: 180,
        effect: 0.003,
        description: "SAN损耗提升经验获取"
    },
    "虚空影响": {
        name: "虚空影响",
        maxXp: 100,
        heroxp: 206,
        effect: 0.0028,
        description: "SAN损耗提升所有技能经验"
    },
    "时间循环": {
        name: "时间循环",
        maxXp: 100,
        heroxp: 207,
        effect: 0.001,
        description: "重复经历，提升游戏速度"
    },
    "疯狂化身": {
        name: "疯狂化身",
        maxXp: 100,
        heroxp: 208,
        effect: 0.01,
        description: "SAN损耗提升技能经验"
    },

    // ========== 副本专属技能 ==========
    "追踪": {
        name: "追踪",
        maxXp: 100,
        heroxp: 50,
        effect: 0.01,
        description: "追踪目标线索（火星赌场）"
    },
    "枪械": {
        name: "枪械",
        maxXp: 100,
        heroxp: 55,
        effect: 0.01,
        description: "使用枪械战斗（火星赌场）"
    },
    "黑客": {
        name: "黑客",
        maxXp: 100,
        heroxp: 60,
        effect: 0.01,
        description: "侵入电子系统（电子脑都市）"
    },
    "义体操作": {
        name: "义体操作",
        maxXp: 100,
        heroxp: 65,
        effect: 0.01,
        description: "控制机械义体（电子脑都市）"
    },
    "魔法感知": {
        name: "魔法感知",
        maxXp: 100,
        heroxp: 70,
        effect: 0.01,
        description: "感知魔法能量（魔女结界）"
    },
    "绝望抗性": {
        name: "绝望抗性",
        maxXp: 100,
        heroxp: 75,
        effect: 0.01,
        description: "抵抗精神攻击（魔女结界）"
    },
    "生存": {
        name: "生存",
        maxXp: 100,
        heroxp: 80,
        effect: 0.01,
        description: "恶劣环境生存能力"
    }
}

// 技能分类（保持原版结构以便UI正常渲染）
const skillCategories = {
    "基础演技": ["侦查", "专注", "交涉", "冥想"],
    "战斗演技": ["战斗", "战术", "力量"],
    "神秘演技": ["灵感", "情感", "时间感知", "心灵", "预知", "精神控制", "洗脑"],
    "黑暗演技": ["黑暗影响", "疯狂控制", "威慑", "疯狂训练", "血祭", "疯狂财富", "黑暗知识", "虚空影响", "时间循环", "疯狂化身"],
    "副本专属": ["追踪", "枪械", "黑客", "义体操作", "魔法感知", "绝望抗性", "生存"]
}

// 职业数据（MVP简化为剧本阶段）
const jobBaseData = {
    "临时演员": { name: "临时演员", maxXp: 50, income: 5, heroxp: 36 },
    "特约演员": { name: "特约演员", maxXp: 100, income: 9, heroxp: 37 },
    "配角": { name: "配角", maxXp: 200, income: 15, heroxp: 38 },
    "配角A级": { name: "配角A级", maxXp: 400, income: 40, heroxp: 39 },
    "配角S级": { name: "配角S级", maxXp: 800, income: 80, heroxp: 40 },
    "主要配角": { name: "主要配角", maxXp: 1600, income: 150, heroxp: 41 },
    "次要主角": { name: "次要主角", maxXp: 3200, income: 300, heroxp: 51 },
    "主角A级": { name: "主角A级", maxXp: 6400, income: 600, heroxp: 52 },
    "主角S级": { name: "主角S级", maxXp: 12800, income: 1200, heroxp: 53 },
    "主角精英": { name: "主角精英", maxXp: 25600, income: 2400, heroxp: 54 },
    "主角王者": { name: "主角王者", maxXp: 51200, income: 4800, heroxp: 57 }
}

// 职业分类
const jobCategories = {
    "剧本阶段": ["临时演员", "特约演员", "配角", "配角A级", "配角S级", "主要配角", "次要主角", "主角A级", "主角S级", "主角精英", "主角王者"]
}

// 物品数据（MVP简化）
const itemBaseData = {
    "临时住所": { name: "临时住所", expense: 0, effect: 1, heromult: 2, heroeffect: 2e6 },
    "简易公寓": { name: "简易公寓", expense: 15, effect: 1.4, heromult: 2, heroeffect: 2e7 },
    "安全屋": { name: "安全屋", expense: 100, effect: 2, heromult: 3, heroeffect: 2e8 },
    "侦探社宿舍": { name: "侦探社宿舍", expense: 750, effect: 3.5, heromult: 3, heroeffect: 2e9 },
    "高级公寓": { name: "高级公寓", expense: 3000, effect: 6, heromult: 4, heroeffect: 2e10 }
}

// 物品分类
const itemCategories = {
    "剧本道具": ["临时住所", "简易公寓", "安全屋", "侦探社宿舍", "高级公寓"]
}

// 货币显示名称覆盖
const currencyNames = {
    coins: "以太碎片",
    days: "幕",
    evil: "SAN损耗",
    essence: "外神的愉悦",
    dark_matter: "真实锚点",
    dark_orbs: "锚点结晶",
    hypercubes: "剧本碎片"
}

// 导出配置以供PK2主逻辑使用
window.COC_SKILL_DATA = {
    skillBaseData,
    skillCategories,
    jobBaseData,
    jobCategories,
    itemBaseData,
    itemCategories,
    currencyNames
};
