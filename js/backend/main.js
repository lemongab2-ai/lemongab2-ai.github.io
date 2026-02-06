// 无貌之神的演员 - 后台主逻辑
// 已集成太宰治通信与AVG支线系统

// ==========================================
// 1. 基础环境文本 (Background Texts)
// ==========================================
const BACKEND_TEXTS = {
    "home": [
        "你窝在沙发里。太宰在另一头翻着什么书，偶尔发出意义不明的轻笑。",
        "你在整理从副本带回来的纪念品。有些已经想不起来是从哪个剧本里来的了。",
        "窗外在下雨。太宰不知道什么时候睡着了，呼吸很轻。",
        "太宰躺在地板上，说他在「体验死亡的预演」。你已经懒得理他了。",
        "房间很安静。他的手指不知何时搭上了你的手腕，没有用力。"
    ],
    "bar": [
        "你坐在吧台边，听着老旧的爵士唱片。太宰在喝他的第三杯。",
        "调酒师安静地擦着杯子。太宰和他似乎很熟，但从不介绍你。",
        "「猜猜这首歌叫什么？」他问。你摇头。他也没有告诉你。",
        "他在讲一个很长的故事，关于某个已经死去的朋友。你只是听着。"
    ],
    "office": [
        "你在帮忙整理档案。太宰在旁边假装工作，实际上在叠纸飞机。",
        "国木田又在吼太宰了。你假装没听到，继续喝茶。",
        "你在茶水间遇到乱步，他盯着你看了三秒，说：「你最近去了很远的地方。」"
    ],
    "town": [
        "你在便利店买了两个饭团。太宰说他不饿，但还是吃掉了一个半。",
        "书店门口的旋转书架。他在看一本《完全自杀手册》，你把它塞了回去。",
        "商店街在举办夏日祭。人群、灯笼、面具摊。他买了一个狐狸面具给你。"
    ],
    "port": [
        "你们并排坐在堤坝上。海风很大，他的外套被吹得猎猎作响。",
        "远处有货轮的汽笛声。他望着海面，不知道在想什么。",
        "「织田作以前喜欢这里。」他说。然后沉默了很久。"
    ]
};

// ==========================================
// 2. 太宰治剧情数据 (Story Data)
// ==========================================

// 通信事件 (仅在安全屋触发)
const DAZAI_MESSAGES = [
    {
        id: "msg_01",
        reqBond: 10, // Lv.1
        title: "📧 新短信：太宰治",
        text: "「我在这一幕的赌局里押了你赢哦。赔率很高，如果输了的话，我会很困扰的——毕竟我的钱包已经在河里冲走了。所以，为了我的晚餐，请务必努力活下来♪」",
        effect: { text: "羁绊 Lv.1 达成" }
    },
    {
        id: "msg_02",
        reqBond: 30, // Lv.2
        title: "📞 深夜来电：02:14 AM",
        text: "「……啊，通了。没什么，只是手指不小心滑到了拨号键。既然醒了，要听笑话吗？刚才有个新来的酒保问我『人生有什么建议』。我告诉他，『不要在这个时间点给除了酒保以外的人打电话』。……哈。你居然没挂断。下次来Lupin吧。这里的唱片机坏了，安静得让人耳鸣。」",
        effect: { text: "Lupin酒吧 剧情点解锁" }
    },
    {
        id: "msg_03",
        reqBond: 50, // Lv.3
        title: "🎁 门口的纸袋",
        text: "里面是一盒完全自杀手册（精装版）和一卷用了一半的绷带。\n便签：「这本送你了。反正我想试的方法都试过了，剩下的都太痛。绷带是干净的，虽然看起来不像。既然你的安全屋那么大，帮我保管一下『重要财产』也是契约者的义务吧？」",
        effect: { text: "武装侦探社 剧情点解锁" }
    },
    {
        id: "msg_04",
        reqBond: 70, // Lv.4
        title: "🚪 深夜来访",
        text: "凌晨 01:43。太宰熟练地撬开了你的锁，举起手里的清酒。\n「哟。这锁的结构比港口那边那个剧本里的简单多了。……我想在这里待一会。只要一会。直到雨停。」\n那一晚他什么都没做，只是听着你的呼吸声，在沙发上睡着了。",
        effect: { text: "横滨商店街 剧情点解锁" }
    },
    {
        id: "msg_05",
        reqBond: 90, // Lv.5
        title: "✉️ 随手折叠的纸条",
        text: "致 共犯者：\n「以前有人对我说，人是为了救赎自己而活的。这话听起来很漂亮，但实行起来太累了。我一直在找一个能让我毫无遗憾地退场的时机。但最近，那个时机变得有点模糊了。别误会。这只是……一种稍微长一点的『留恋』。P.S. 如果哪天我真的消失了，别找我。但如果是你的话，或许能找到吧。」",
        effect: { text: "港口 最终剧情解锁" }
    }
];

// AVG 支线剧本 (各地点触发)
const AVG_SCRIPTS = {
    "home": {
        id: "avg_home_rain",
        reqBond: 70, // Lv.4 (对应通信4)
        scenes: {
            start: {
                title: "🏠 安全屋 · 真实的重量",
                text: "昏暗的客厅，只有电视机发着雪花屏的蓝光。太宰躺在地毯上，不断抛着一枚硬币。\n「你看，正面。又是正面。在这个房间里，硬币连续十次都是正面。这概率可比在外面遇到你也难多了。」\n他侧过头，眼神幽深：「呐，你说。如果我们现在的这段对话，也只是某个三流剧作家写好的台词……你会怎么做？」",
                options: [
                    { label: "关掉电视，坐到他身边", next: "action" },
                    { label: "「如果是剧本，那你的台词太老套了。」", next: "joke" },
                    { label: "抢走他的硬币", next: "break_wall" }
                ]
            },
            action: {
                title: "沉默的回答",
                text: "你关掉了嘈杂的电视。房间陷入寂静，只有雨声。\n他笑了一声：「行动派吗？真像你的作风。」",
                next: "end_normal"
            },
            joke: {
                title: "剧本之外",
                text: "太宰大笑起来：「确实！这台词连三流都算不上。那就让我们演得更即兴一点吧。」",
                next: "end_normal"
            },
            break_wall: {
                title: "打破第四面墙",
                text: "硬币被你按在手心里。他的手指触碰到你的手背，冰凉。\n「哎呀。」他没有抽回手，顺势按住了你的脉搏。\n「……跳得很快呢。是因为生气？还是因为害怕被我看穿？」\n他凑近，几乎贴着你的耳廓：「只有在这里，这个声音听起来……很吵。」",
                options: [
                    { label: "「因为我还活着。」", next: "end_deep" },
                    { label: "反手扣住他，「那你的是真的吗？」", next: "check_anchor" }
                ]
            },
            check_anchor: {
                title: "锚点确认",
                text: "他愣了一瞬。那原本游刃有余的面具裂开了一条缝。\n「……哈。真敏锐啊。」他不再笑了，额头抵在你们交握的手上。\n「如果这双手松开，我可能就会像断了线的气球一样飘到平流层去吧。那里没有氧气，也没有你。」",
                next: "end_true"
            },
            end_normal: {
                title: "雨夜",
                text: "他重新躺回地毯上，闭上眼睛。\n「……稍微，有点困了。」",
                effect: { text: "获得：日常的宁静" },
                isEnd: true
            },
            end_deep: {
                title: "活着的声音",
                text: "「活着吗……」他若有所思地重复了一遍，\n「那就请你继续吵闹下去吧。这里的安静有时候太刺耳了。」",
                effect: { text: "羁绊加深" },
                isEnd: true
            },
            end_true: {
                title: "无言的契约",
                text: "「所以，」他抬起头，耳根有一点红，「在我想好怎么去平流层之前，抓紧点。这可是很累人的工作。你要负责到底哦。」\n\n【获得纪念品】：永远正面的硬币",
                effect: { text: "解锁成就：身份安全感" },
                item: "coin_fake",
                isEnd: true
            }
        }
    },
    "bar": {
        id: "avg_bar_seat",
        reqBond: 30, // Lv.2 (对应通信2)
        scenes: {
            start: {
                title: "🍸 Lupin · 空席",
                text: "他在吧台边，身边有两张空椅子。当你试图走向其中一张时，他突然伸出手拦住了你。\n「啊，抱歉。」他看着那张空荡荡的椅子，眼神变得极远，「有些灰尘是不能被打扰的。你应该能理解吧？」",
                options: [
                    { label: "「那我坐那边角落。」", next: "leave" },
                    { label: "站在他身后点单", next: "intruder" } 
                ]
            },
            leave: {
                title: "距离",
                text: "你选择了退让。他似乎松了一口气，但背影看起来更孤独了。",
                isEnd: true
            },
            intruder: {
                title: "入侵者",
                text: "你没有理会，直接站在他身后点了单。太宰愣了一下，随即轻笑：\n「真强硬啊。明明是个新人演员，却不懂得读空气吗？」\n他第一次正眼看你：「老板，给这位不懂礼貌的客人一杯『洗洁精加冰』——开玩笑的。」",
                next: "toast"
            },
            toast: {
                title: "共饮",
                text: "「呐。你在那些剧本里，见过『结局』吗？」他举杯，对着那张空椅子轻轻碰了一下空气，\n「敬野犬。」",
                options: [
                    { label: "沉默地碰杯", next: "end_silent" },
                    { label: "「敬还活着的人。」", next: "end_alive" }
                ]
            },
            end_silent: {
                title: "无声的默契",
                text: "你也举起杯子。冰块撞击玻璃的声音清脆而寂寞。",
                isEnd: true
            },
            end_alive: {
                title: "贪心的祝酒词",
                text: "他动作停顿了一下。「……敬活着的人吗。真是贪心的祝酒词啊。」\n他仰头饮尽：「好吧。那就顺便，也敬你。」\n\n【获得纪念品】：Lupin的火柴盒",
                item: "matchbox",
                isEnd: true
            }
        }
    },
    "office": {
        id: "avg_office_lazy",
        reqBond: 50, // Lv.3 (对应通信3)
        scenes: {
            start: {
                title: "🏢 侦探社 · 摸鱼",
                text: "国木田正在白板前怒吼：「太宰！！报告书！！」\n太宰正把你拽到办公桌挡板后面，竖起手指：「嘘——紧急避难。现在的国木田君是喷火龙形态。」",
                options: [
                    { label: "躲在他旁边看戏", next: "partner" },
                    { label: "大喊「国木田先生，太宰在这里！」", next: "betray" }
                ]
            },
            betray: {
                title: "出卖",
                text: "太宰露出了被背叛的表情（虽然是装的），然后被国木田拖走了。",
                isEnd: true
            },
            partner: {
                title: "共犯",
                text: "他满意地笑了，递给你一张纸条，上面画着喷火的河马（大概是国木田）。\n「这就是侦探社的日常。你呢？在这个剧本里，你的角色是什么？如果是『太宰治的监护人』，工资可是很低的。」",
                options: [
                    { label: "「我是专门来收你尸的。」", next: "end_grave" },
                    { label: "「我是观众。」", next: "end_audience" }
                ]
            },
            end_grave: {
                title: "收尸人",
                text: "「收尸吗……不错的职业规划。」他把下巴搁在椅背上，塞给你一颗糖（乱步的），\n「这是定金。别让我在无聊的时候死掉啊，搭档。」\n\n【获得纪念品】：乱步的粗点心",
                item: "candy",
                isEnd: true
            },
            end_audience: {
                title: "观众",
                text: "「最好的席位留给你。」他眨了眨眼。",
                isEnd: true
            }
        }
    },
    "town": {
        id: "avg_town_shop",
        reqBond: 70, // Lv.4 (对应通信4)
        scenes: {
            start: {
                title: "🛍️ 商店街 · 次品",
                text: "太宰盯着橱窗里的家庭套装（印着Sweet Home的地垫）一脸嫌弃：\n「真可怕。人类竟然能毫无羞耻地把这种东西摆在家里。不会羞愧到想死吗？」",
                options: [
                    { label: "「确实很可怕。」", next: "agree" },
                    { label: "「那个蓝杯子适合你。」", next: "test" }
                ]
            },
            agree: {
                title: "共鸣",
                text: "「对吧？我们果然合得来。」他满意地点头。",
                isEnd: true
            },
            test: {
                title: "异类测试",
                text: "他走进店里，拿起一个丑得惊人的歪脖子长颈鹿挂件。\n「你看这个眼神，像在说『我为什么要出生』。这才是艺术。呐，你不觉得我们很像它吗？混在正常商品里的次品。」",
                options: [
                    { label: "「我是限量版，你是次品。」", next: "end_gift" }
                ]
            },
            end_gift: {
                title: "次品的归属",
                text: "他笑了，把那个丑长颈鹿扔进你的购物篮。\n「你养它。既然你也是个怪人，应该能容忍它的眼神吧。」\n\n【获得纪念品】：歪脖子长颈鹿",
                item: "giraffe",
                isEnd: true
            }
        }
    },
    "port": {
        id: "avg_port_end",
        reqBond: 90, // Lv.5 (对应通信5)
        scenes: {
            start: {
                title: "⚓️ 港口 · 边缘",
                text: "风很大。他站在防波堤最边缘的水泥台上，身体前倾。仿佛只要一阵风就能带走他。\n「以前觉得这片海是终点。现在看来……只是风景不错的地方罢了。」\n他没有回头，但伸出了一只手，悬在半空。",
                options: [
                    { label: "走过去，站在他旁边", next: "stand" }
                ]
            },
            stand: {
                title: "风景",
                text: "你没有拉他，只是站在他身边。他转过头，露出了左眼的绷带。\n「呐。下一个剧本是什么？如果是那种无聊的剧本，我就不去了。但如果你在的话……再去演一场也无妨。」",
                options: [
                    { label: "「那就一起下去。」", next: "jump" },
                    { label: "拍一下他的手，「走了，去吃蟹肉。」", next: "end_final" }
                ]
            },
            jump: {
                title: "糟糕的演员",
                text: "他大笑起来，笑得弯下了腰。\n「『一起下去』？这是哪门子的台词啊。真是最糟糕的演员。」",
                next: "end_final"
            },
            end_final: {
                title: "无貌之神的共犯",
                text: "他跳下水泥台，顺势抓住了你的手腕。\n「如果你请客的话，我要吃最贵的。还有……刚才那个提议，先保留吧。等我们要谢幕的时候，再兑现也不迟。」\n夕阳将你们的影子融为一体。\n\n【获得纪念品】：生锈的仓库钥匙",
                item: "key",
                effect: { text: "达成结局：无貌之神的共犯" },
                isEnd: true
            }
        }
    }
};


// ==========================================
// 3. 核心逻辑 (Core Logic)
// ==========================================

let textTimer = null;
let textTimerValue = 5;
let currentLocation = "home";
let textIndex = 0;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadSharedData(); // 加载存档
    initializeBackend();
});

function initializeBackend() {
    updateSanDisplay();
    renderDungeons();
    renderSouvenirs();
    startTextTimer();
    startSanRecovery();
    initializeLocationButtons();
    displayLoverStatus();
    
    // ===== 系统时钟 =====
    initSystemClock();
    
    // ===== 副本状态检测 =====
    checkDungeonActiveState();
    
    // ===== 现实锚点系统 =====
    initRealityAnchorSystem();
    
    // 初始文本刷新
    updateText();
    // 检查是否有剧情需要触发 (延时执行，防止DOM未就绪)
    setTimeout(() => checkStoryTriggers("home"), 500);
}

// ==========================================
// 系统时钟 & 副本状态 (System Clock & Dungeon State)
// ==========================================

let dungeonActiveState = false;

function initSystemClock() {
    updateSystemClock();
    setInterval(updateSystemClock, 1000);
}

function updateSystemClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    
    const sysEl = document.getElementById('systemTimeValue');
    if (sysEl) sysEl.textContent = `${h}:${m}:${s}`;
    
    updateDungeonTimeDisplay();
}

function updateDungeonTimeDisplay() {
    const dtEl = document.getElementById('dungeonTimeValue');
    if (!dtEl) return;
    
    let totalSeconds = SharedData.dungeonTime?.accumulated || 0;
    
    if (SharedData.dungeonTime?.isActive && SharedData.dungeonTime?.enterTimestamp) {
        const elapsed = Date.now() - SharedData.dungeonTime.enterTimestamp;
        totalSeconds += Math.floor((elapsed / 1000) * (SharedData.dungeonTime.accelerator || 2));
    }
    
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    dtEl.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function checkDungeonActiveState() {
    const isActive = SharedData.dungeonTime?.isActive || false;
    const currentDungeon = SharedData.currentDungeon || SharedData.realityAnchor?.selectedDungeon;
    
    setDungeonActiveVisual(isActive, currentDungeon);
    
    // 持续检测状态变化
    setInterval(() => {
        const nowActive = SharedData.dungeonTime?.isActive || false;
        if (nowActive !== dungeonActiveState) {
            const dg = SharedData.currentDungeon || SharedData.realityAnchor?.selectedDungeon;
            setDungeonActiveVisual(nowActive, dg);
        }
    }, 1000);
}

function setDungeonActiveVisual(isActive, dungeonId) {
    dungeonActiveState = isActive;
    
    const sysBlock = document.getElementById('systemTimeBlock');
    const dgBlock = document.getElementById('dungeonTimeBlock');
    const overlay = document.getElementById('dungeonOverlay');
    const overlayName = document.getElementById('overlayDungeonName');
    
    if (!sysBlock || !dgBlock) return;
    
    if (isActive) {
        sysBlock.classList.add('in-dungeon');
        dgBlock.classList.add('in-dungeon');
        if (overlay) {
            overlay.classList.add('active');
            if (overlayName && dungeonId && DungeonConfig[dungeonId]) {
                overlayName.textContent = DungeonConfig[dungeonId].name;
            }
        }
    } else {
        sysBlock.classList.remove('in-dungeon');
        dgBlock.classList.remove('in-dungeon');
        if (overlay) overlay.classList.remove('active');
    }
}

function returnToDungeon() {
    const dungeonId = SharedData.currentDungeon || SharedData.realityAnchor?.selectedDungeon;
    if (dungeonId) {
        window.location.href = 'dungeon.html?dungeon=' + dungeonId;
    }
}

// ==========================================

// 渲染地点按钮
function initializeLocationButtons() {
    document.querySelectorAll('.location-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            updateLocation(location);
        });
    });
}

// 切换地点
function updateLocation(newLocation) {
    if (currentLocation === newLocation) return;
    
    currentLocation = newLocation;
    
    // UI更新
    document.querySelectorAll('.location-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const targetBtn = document.querySelector(`[data-location="${newLocation}"]`);
    if (targetBtn) targetBtn.classList.add('active');

    // 重置文本索引
    textIndex = -1;
    updateText();

    // 核心逻辑：先检查剧情
    checkStoryTriggers(newLocation);
}

// 文本轮播
function updateText() {
    const locationTexts = BACKEND_TEXTS[currentLocation];
    if (!locationTexts || locationTexts.length === 0) return;
    
    textIndex = (textIndex + 1) % locationTexts.length;
    const textElement = document.getElementById('textContent');
    
    // 淡入淡出动画
    textElement.style.opacity = 0;
    setTimeout(() => {
        textElement.textContent = locationTexts[textIndex];
        textElement.style.opacity = 1;
    }, 200);
}

// 计时器逻辑
function startTextTimer() {
    setInterval(() => {
        textTimerValue--;
        document.getElementById('textTimer').textContent = textTimerValue;
        if (textTimerValue <= 0) {
            textTimerValue = 5;
            updateText();
        }
    }, 1000);
}

// ==========================================
// 4. 剧情触发引擎 (Story Engine)
// ==========================================

// 检查是否有剧情触发
function checkStoryTriggers(location) {
    const bond = SharedData.loverBond || 0; // 假设 SharedData 里存了 bond
    const seenEvents = SharedData.seenEvents || [];

    // 1. 检查通信 (仅限安全屋)
    if (location === "home") {
        for (let msg of DAZAI_MESSAGES) {
            if (bond >= msg.reqBond && !seenEvents.includes(msg.id)) {
                triggerMessage(msg);
                return true;
            }
        }
    }

    // 2. 检查AVG剧本 (各地点)
    const script = AVG_SCRIPTS[location];
    if (script) {
        if (bond >= script.reqBond && !seenEvents.includes(script.id)) {
            startAVGScene(script.id, script.scenes.start);
            return true;
        }
    }

    return false;
}

// 触发通信弹窗
function triggerMessage(msg) {
    // 标记为已读
    if (!SharedData.seenEvents) SharedData.seenEvents = [];
    SharedData.seenEvents.push(msg.id);
    saveSharedData();

    // 更新UI显示羁绊等级变化
    displayLoverStatus();

    // 显示弹窗
    showPopup({
        title: msg.title,
        text: msg.text,
        effect: msg.effect ? msg.effect.text : "",
        choices: [] // 通信没有选项
    });
}

// 开始AVG场景
function startAVGScene(scriptId, sceneData) {
    // 记录当前剧本ID
    window.currentScriptId = scriptId;
    renderScene(sceneData);
}

// 渲染AVG场景
function renderScene(sceneData) {
    // 准备选项
    let choices = [];
    if (sceneData.options) {
        // 渲染分支选项
        choices = sceneData.options.map(opt => ({
            label: opt.label,
            action: () => {
                // 查找下一个场景
                const script = AVG_SCRIPTS[currentLocation];
                const nextScene = script.scenes[opt.next];
                if (nextScene) {
                    renderScene(nextScene);
                } else {
                    console.error("Scene missing:", opt.next);
                    closeEventPopup();
                }
            }
        }));
    } else if (sceneData.isEnd) {
        // 结束场景
        choices = [{
            label: "结束",
            action: () => {
                finishScript(window.currentScriptId, sceneData);
            }
        }];
    }

    // 显示弹窗
    showPopup({
        title: sceneData.title,
        text: sceneData.text,
        effect: sceneData.effect ? sceneData.effect.text : "",
        choices: choices
    });
}

// 结束剧本
function finishScript(scriptId, endSceneData) {
    if (!SharedData.seenEvents) SharedData.seenEvents = [];
    SharedData.seenEvents.push(scriptId);
    
    // 如果有纪念品奖励
    if (endSceneData.item) {
        let itemName = "特殊物品";
        if(endSceneData.item === "coin_fake") itemName = "永远正面的硬币";
        if(endSceneData.item === "matchbox") itemName = "Lupin火柴盒";
        if(endSceneData.item === "candy") itemName = "乱步的粗点心";
        if(endSceneData.item === "giraffe") itemName = "歪脖子长颈鹿";
        if(endSceneData.item === "key") itemName = "生锈的仓库钥匙";

        SharedData.souvenirs.push({
            name: itemName,
            rarity: "SR",
            buff: "太宰羁绊物品"
        });
        renderSouvenirs();
    }

    saveSharedData();
    closeEventPopup();
}

// ==========================================
// 5. 通用UI逻辑 (UI Logic)
// ==========================================

// 统一弹窗显示函数
function showPopup({ title, text, effect, choices }) {
    const popup = document.getElementById('event-popup');
    const titleEl = document.getElementById('event-title');
    const textEl = document.getElementById('event-text');
    const effectEl = document.getElementById('event-effect');
    const choicesEl = document.getElementById('event-choices');
    const defaultActions = document.getElementById('event-actions');

    // 填充内容
    titleEl.textContent = title;
    // 支持换行符
    textEl.innerHTML = text.replace(/\n/g, '<br>'); 
    
    // 效果显示
    if (effect) {
        effectEl.textContent = effect;
        effectEl.style.display = 'block';
    } else {
        effectEl.style.display = 'none';
    }

    // 清空旧按钮
    choicesEl.innerHTML = '';

    // 生成选项按钮
    if (choices && choices.length > 0) {
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'btn'; // 使用 adr_real.css 的样式
            btn.textContent = choice.label;
            btn.onclick = choice.action;
            choicesEl.appendChild(btn);
        });
        defaultActions.style.display = 'none'; // 隐藏默认关闭按钮
    } else {
        defaultActions.style.display = 'block'; // 显示默认关闭按钮
    }

    popup.style.display = 'flex'; 
}

function closeEventPopup() {
    document.getElementById('event-popup').style.display = 'none';
}

// 更新SAN值显示
function updateSanDisplay() {
    const sanBar = document.getElementById('sanBar');
    const sanValue = document.getElementById('sanValue');
    sanBar.style.width = SharedData.san + '%';
    sanValue.textContent = SharedData.san;
}

// 模拟渲染副本列表 (改为预选机制)
function renderDungeons() {
    const container = document.getElementById('dungeonSelection');
    container.innerHTML = '';
    
    const selectedId = SharedData.realityAnchor?.selectedDungeon;
    
    for (const dungeonId in DungeonConfig) {
        const dungeon = DungeonConfig[dungeonId];
        const isCompleted = SharedData.completedDungeons?.includes(dungeonId);
        const isSelected = dungeonId === selectedId;
        
        const card = document.createElement('div');
        card.className = 'dungeon-card';
        card.dataset.dungeonId = dungeonId;
        
        if (isCompleted) card.classList.add('completed');
        if (isSelected) card.classList.add('selected');
        
        // 生成难度星级
        const stars = '★'.repeat(dungeon.difficulty) + '☆'.repeat(5 - dungeon.difficulty);
        
        // 生成通关条件文本
        const conditionsText = Object.entries(dungeon.clearConditions)
            .map(([skill, level]) => `${skill} Lv.${level}`)
            .join(' / ');
        
        card.innerHTML = `
            <h3>${dungeon.name}</h3>
            <div class="difficulty">${stars}</div>
            <div class="dungeon-info">SAN -${dungeon.sanCost} / +${dungeon.sanReward}</div>
            <p class="conditions">通关条件：${conditionsText}</p>
            <div class="souvenir">纪念品：${dungeon.souvenir.name} (${dungeon.souvenir.rarity})</div>
        `;
        
        // 点击预选副本
        card.onclick = () => selectDungeon(dungeonId);
        
        container.appendChild(card);
    }
}

function renderSouvenirs() {
    const container = document.getElementById('souvenirsGrid');
    container.innerHTML = '';
    if (SharedData.souvenirs.length === 0) {
        container.innerHTML = '<p style="color:#999;font-size:12px;">暂无纪念品</p>';
        return;
    }
    SharedData.souvenirs.forEach(souvenir => {
        const item = document.createElement('div');
        item.className = 'souvenir-item';
        item.innerHTML = `<span style="font-weight:bold">${souvenir.name}</span><span>${souvenir.rarity}</span>`;
        container.appendChild(item);
    });
}

function startSanRecovery() {
    setInterval(() => {
        if (SharedData.san < 100) {
            SharedData.san = Math.min(100, SharedData.san + 1);
            saveSharedData();
            updateSanDisplay();
        }
    }, 10000);
}

// 羁绊状态显示
function displayLoverStatus() {
    let loverPanel = document.getElementById('lover-status-panel');
    if (!loverPanel) {
        loverPanel = document.createElement('div');
        loverPanel.id = 'lover-status-panel';
        // 插入到 backend-header 之后
        const header = document.querySelector('.backend-header');
        header.parentNode.insertBefore(loverPanel, header.nextSibling);
    }
    
    // 初始化 bond (如果 SharedData 里没有)
    if (typeof SharedData.loverBond === 'undefined') {
        SharedData.loverBond = 0; 
    }
    
    const bond = SharedData.loverBond;
    
    // 简单的进度条显示
    loverPanel.innerHTML = `
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; background: #fff;">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-family:'Courier New'">
                <label style="font-weight:bold; color:#333;">太宰治 (Partner)</label>
                <span style="color:#666;">Lv.${Math.floor(bond/20)} (${bond}%)</span>
            </div>
            <div style="background:#eee; height:4px; width:100%;">
                <div style="background:#333; height:100%; width:${bond}%"></div>
            </div>
        </div>
    `;
}

// ==========================================
// 6. 现实锚点信号系统 (Reality Anchor Signal System)
// ==========================================

const SIGNAL_KEY = 'reality_anchor_signal';
let signalPollInterval = null;
let dungeonTimeInterval = null;

// 初始化现实锚点系统
function initRealityAnchorSystem() {
    console.log('🎯 [现实锚点] 系统初始化...');
    
    // 确保数据结构存在
    if (!SharedData.dungeonTime) {
        SharedData.dungeonTime = {
            accumulated: 0,
            accelerator: 2,
            isActive: false,
            enterTimestamp: null,
            lastUpdate: null
        };
    }
    if (!SharedData.realityAnchor) {
        SharedData.realityAnchor = {
            totalFocusTime: 0,
            sessionsCompleted: 0,
            lastSignalTime: null,
            selectedDungeon: null  // 预选的副本ID
        };
    }
    
    // 恢复之前的状态（如果页面刷新时番茄钟还在运行）
    restoreDungeonTimeState();
    
    // 创建UI显示
    createRealityAnchorDisplay();
    
    // 启动信号轮询（每秒检查一次）
    signalPollInterval = setInterval(pollSignals, 1000);
    
    // 启动副本时间更新（每秒更新显示）
    dungeonTimeInterval = setInterval(updateRealityAnchorDisplay, 1000);
    
    console.log('✅ [现实锚点] 系统已启动，正在监听信号...');
}

// 轮询信号
function pollSignals() {
    const signalData = localStorage.getItem(SIGNAL_KEY);
    if (!signalData) return;
    
    try {
        const packet = JSON.parse(signalData);
        
        // 检查是否是新信号（避免重复处理）
        if (SharedData.realityAnchor.lastSignalTime === packet.timestamp) {
            return;
        }
        
        console.log(`🎯 [收到信号] ${packet.type} @ ${new Date(packet.timestamp).toLocaleTimeString()}`);
        
        // 处理信号
        handleSignal(packet);
        
        // 记录处理时间
        SharedData.realityAnchor.lastSignalTime = packet.timestamp;
        saveSharedData();
        
        // 读后即焚
        localStorage.removeItem(SIGNAL_KEY);
        
    } catch (e) {
        console.error('[信号解析错误]', e);
        localStorage.removeItem(SIGNAL_KEY);
    }
}

// 处理信号
function handleSignal(signal) {
    switch(signal.type) {
        case 'ENTER_DUNGEON':
            enterDungeonMode();
            break;
            
        case 'LEAVE_DUNGEON':
            leaveDungeonMode();
            break;
            
        case 'TASK_COMPLETE':
            onTaskComplete();
            break;
            
        default:
            console.log(`[未知信号类型] ${signal.type}`);
    }
}

// 进入副本模式（番茄钟开始）
function enterDungeonMode() {
    if (SharedData.dungeonTime.isActive) {
        console.log('⚠️ [副本模式] 已在运行中');
        return;
    }
    
    SharedData.dungeonTime.isActive = true;
    SharedData.dungeonTime.enterTimestamp = Date.now();
    SharedData.dungeonTime.lastUpdate = Date.now();
    saveSharedData();
    
    console.log('✅ [副本模式] 已进入，开启2倍加速计时');
    
    // 更新UI状态
    updateRealityAnchorUI(true);
    
    // 如果有预选副本，自动跳转到副本页面
    const selectedDungeon = SharedData.realityAnchor?.selectedDungeon;
    if (selectedDungeon && DungeonConfig[selectedDungeon]) {
        console.log(`🚀 [自动进入副本] ${DungeonConfig[selectedDungeon].name}`);
        // 扣除SAN值
        const dungeon = DungeonConfig[selectedDungeon];
        if (SharedData.san >= dungeon.sanCost) {
            SharedData.san -= dungeon.sanCost;
            saveSharedData();
            // 跳转到副本页面
            window.location.href = 'dungeon.html?dungeon=' + selectedDungeon;
        } else {
            showNotification('SAN值不足', `需要 ${dungeon.sanCost} SAN值`);
        }
    }
}

// 离开副本模式（番茄钟暂停/停止）
function leaveDungeonMode() {
    if (!SharedData.dungeonTime.isActive) {
        console.log('⚠️ [副本模式] 未在运行');
        return;
    }
    
    // 计算并累加这段时间
    const now = Date.now();
    const elapsed = now - SharedData.dungeonTime.enterTimestamp;
    const acceleratedTime = Math.floor((elapsed / 1000) * SharedData.dungeonTime.accelerator);
    
    SharedData.dungeonTime.accumulated += acceleratedTime;
    SharedData.dungeonTime.isActive = false;
    SharedData.dungeonTime.enterTimestamp = null;
    SharedData.dungeonTime.lastUpdate = now;
    
    // 累计现实专注时间
    SharedData.realityAnchor.totalFocusTime += Math.floor(elapsed / 1000);
    
    saveSharedData();
    
    console.log(`✅ [副本模式] 已离开，本次获得 ${acceleratedTime} 秒副本时间`);
    
    // 更新UI状态
    updateRealityAnchorUI(false);
    
    // 检查是否触发羁绊值增长
    checkBondGrowth(acceleratedTime);
}

// 任务完成时的额外处理
function onTaskComplete() {
    SharedData.realityAnchor.sessionsCompleted++;
    
    // 每完成一个番茄钟，增加少量羁绊值
    const bondGain = 2;
    SharedData.loverBond = Math.min(100, (SharedData.loverBond || 0) + bondGain);
    
    saveSharedData();
    displayLoverStatus();
    
    console.log(`🎉 [任务完成] 第 ${SharedData.realityAnchor.sessionsCompleted} 个番茄钟，羁绊值 +${bondGain}`);
}

// 检查羁绊值增长（基于副本时间）
function checkBondGrowth(acceleratedTime) {
    if (acceleratedTime >= 300) {
        const bondGain = 1;
        SharedData.loverBond = Math.min(100, (SharedData.loverBond || 0) + bondGain);
        saveSharedData();
        displayLoverStatus();
        console.log(`💕 [羁绊增长] +${bondGain}，当前: ${SharedData.loverBond}`);
    }
}

// 恢复副本时间状态（页面刷新时）
function restoreDungeonTimeState() {
    if (SharedData.dungeonTime && SharedData.dungeonTime.isActive && SharedData.dungeonTime.enterTimestamp) {
        const now = Date.now();
        const elapsed = now - SharedData.dungeonTime.enterTimestamp;
        
        if (elapsed > 2 * 60 * 60 * 1000) {
            console.log('⚠️ [副本模式] 离线时间过长，自动结算');
            const acceleratedTime = Math.floor((2 * 60 * 60) * SharedData.dungeonTime.accelerator);
            SharedData.dungeonTime.accumulated += acceleratedTime;
            SharedData.dungeonTime.isActive = false;
            SharedData.dungeonTime.enterTimestamp = null;
            saveSharedData();
        } else {
            console.log('🔄 [副本模式] 恢复运行状态');
            updateRealityAnchorUI(true);
        }
    }
}

// ==========================================
// 7. 副本预选系统 (Dungeon Selection System)
// ==========================================

// 选择副本（预选，不立即进入）
function selectDungeon(dungeonId) {
    const dungeon = DungeonConfig[dungeonId];
    if (!dungeon) return;
    
    // 检查SAN值是否足够
    if (SharedData.san < dungeon.sanCost) {
        showNotification('SAN值不足', `需要 ${dungeon.sanCost} SAN值才能选择此副本`);
        return;
    }
    
    // 设置预选副本
    SharedData.realityAnchor.selectedDungeon = dungeonId;
    saveSharedData();
    
    console.log(`📍 [预选副本] ${dungeon.name}`);
    
    // 更新UI
    updateDungeonSelectionUI();
    updateRealityAnchorDisplay();
}

// 取消预选
function cancelDungeonSelection() {
    SharedData.realityAnchor.selectedDungeon = null;
    saveSharedData();
    updateDungeonSelectionUI();
    updateRealityAnchorDisplay();
}

// 更新副本选择UI
function updateDungeonSelectionUI() {
    const selectedId = SharedData.realityAnchor?.selectedDungeon;
    
    document.querySelectorAll('.dungeon-card').forEach(card => {
        const cardId = card.dataset.dungeonId;
        if (cardId === selectedId) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

// ==========================================
// 8. 现实锚点UI (Reality Anchor UI) - ADR风格
// ==========================================

function createRealityAnchorDisplay() {
    if (document.getElementById('reality-anchor-panel')) return;
    
    const panel = document.createElement('div');
    panel.id = 'reality-anchor-panel';
    panel.className = 'reality-anchor-section';
    
    const selectedId = SharedData.realityAnchor?.selectedDungeon;
    const selectedDungeon = selectedId ? DungeonConfig[selectedId] : null;
    
    panel.innerHTML = `
        <div class="ra-header">
            <span class="ra-status-dot" id="raStatusDot"></span>
            <span class="ra-title">REALITY_ANCHOR</span>
            <span class="ra-status-text" id="raStatusText">STANDBY</span>
        </div>
        
        <div class="ra-destination" id="raDestination">
            <div class="ra-dest-label">NEXT DESTINATION</div>
            <div class="ra-dest-value" id="raDestValue">${selectedDungeon ? selectedDungeon.name : '未选择'}</div>
            ${selectedDungeon ? `<button class="ra-cancel-btn" onclick="cancelDungeonSelection()">× 取消</button>` : ''}
        </div>
        
        <div class="ra-stats">
            <div class="ra-stat">
                <span class="ra-stat-label">DUNGEON TIME</span>
                <span class="ra-stat-value" id="raDungeonTime">00:00:00</span>
            </div>
            <div class="ra-stat">
                <span class="ra-stat-label">FOCUS TIME</span>
                <span class="ra-stat-value" id="raFocusTime">00:00:00</span>
            </div>
            <div class="ra-stat">
                <span class="ra-stat-label">SESSIONS</span>
                <span class="ra-stat-value" id="raSessions">0</span>
            </div>
        </div>
        
        <div class="ra-accelerator" id="raAccelerator" style="display:none;">
            ● ACTIVE / ×2 ACCELERATION
        </div>
    `;
    
    // 添加ADR风格样式
    const style = document.createElement('style');
    style.id = 'reality-anchor-styles';
    style.textContent = `
        .reality-anchor-section {
            background: #fff;
            border: 1px solid #333;
            padding: 20px;
            margin: 20px 0;
            font-family: "Courier New", monospace;
        }
        
        .ra-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px dashed #ccc;
        }
        
        .ra-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ccc;
        }
        
        .ra-status-dot.active {
            background: #333;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        
        .ra-title {
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 1px;
            color: #333;
            flex-grow: 1;
        }
        
        .ra-status-text {
            font-size: 10px;
            color: #999;
            letter-spacing: 1px;
        }
        
        .ra-status-text.active {
            color: #333;
            font-weight: bold;
        }
        
        .ra-destination {
            background: #f7f7f7;
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 15px;
            position: relative;
        }
        
        .ra-dest-label {
            font-size: 10px;
            color: #999;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        
        .ra-dest-value {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            font-family: "Georgia", serif;
        }
        
        .ra-dest-value.empty {
            color: #ccc;
            font-style: italic;
        }
        
        .ra-cancel-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: 1px solid #ccc;
            padding: 2px 8px;
            font-size: 10px;
            cursor: pointer;
            color: #999;
        }
        
        .ra-cancel-btn:hover {
            border-color: #333;
            color: #333;
        }
        
        .ra-stats {
            display: flex;
            gap: 20px;
        }
        
        .ra-stat {
            flex: 1;
        }
        
        .ra-stat-label {
            display: block;
            font-size: 9px;
            color: #999;
            letter-spacing: 1px;
            margin-bottom: 3px;
        }
        
        .ra-stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
        
        .ra-accelerator {
            margin-top: 15px;
            padding: 10px;
            background: #333;
            color: #fff;
            font-size: 10px;
            letter-spacing: 1px;
            text-align: center;
        }
        
        /* 副本卡片选中状态 */
        .dungeon-card.selected {
            border-color: #333 !important;
            border-left-color: #000 !important;
            background: #f0f0f0;
            position: relative;
        }
        
        .dungeon-card.selected::before {
            content: "▶ SELECTED";
            position: absolute;
            top: 5px;
            left: 10px;
            font-size: 9px;
            color: #333;
            letter-spacing: 1px;
            font-weight: bold;
        }
        
        /* 通知样式 - ADR风格 */
        .ra-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            border: 2px solid #333;
            padding: 15px 20px;
            z-index: 9999;
            font-family: "Courier New", monospace;
            animation: slideIn 0.3s ease;
            max-width: 280px;
        }
        
        .ra-notification h4 {
            margin: 0 0 5px 0;
            font-size: 12px;
            letter-spacing: 1px;
            color: #333;
        }
        
        .ra-notification p {
            margin: 0;
            font-size: 11px;
            color: #666;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    // 移除旧样式
    const oldStyle = document.getElementById('reality-anchor-styles');
    if (oldStyle) oldStyle.remove();
    document.head.appendChild(style);
    
    // 插入到页面
    const sanContainer = document.querySelector('.san-container');
    if (sanContainer) {
        sanContainer.parentNode.insertBefore(panel, sanContainer.nextSibling);
    } else {
        const header = document.querySelector('.backend-header');
        if (header) {
            header.parentNode.insertBefore(panel, header.nextSibling);
        }
    }
    
    // 初始更新
    updateRealityAnchorDisplay();
    updateRealityAnchorUI(SharedData.dungeonTime?.isActive || false);
}

// 更新显示数值
function updateRealityAnchorDisplay() {
    const dungeonTimeEl = document.getElementById('raDungeonTime');
    const focusTimeEl = document.getElementById('raFocusTime');
    const sessionsEl = document.getElementById('raSessions');
    const destValueEl = document.getElementById('raDestValue');
    const destContainer = document.getElementById('raDestination');
    
    if (!dungeonTimeEl) return;
    
    // 计算当前副本时间
    let totalDungeonTime = SharedData.dungeonTime?.accumulated || 0;
    if (SharedData.dungeonTime?.isActive && SharedData.dungeonTime?.enterTimestamp) {
        const elapsed = Date.now() - SharedData.dungeonTime.enterTimestamp;
        totalDungeonTime += Math.floor((elapsed / 1000) * (SharedData.dungeonTime.accelerator || 2));
    }
    
    dungeonTimeEl.textContent = formatTime(totalDungeonTime);
    focusTimeEl.textContent = formatTime(SharedData.realityAnchor?.totalFocusTime || 0);
    sessionsEl.textContent = SharedData.realityAnchor?.sessionsCompleted || 0;
    
    // 更新目的地显示
    const selectedId = SharedData.realityAnchor?.selectedDungeon;
    const selectedDungeon = selectedId ? DungeonConfig[selectedId] : null;
    
    if (destValueEl) {
        if (selectedDungeon) {
            destValueEl.textContent = selectedDungeon.name;
            destValueEl.classList.remove('empty');
        } else {
            destValueEl.textContent = '未选择';
            destValueEl.classList.add('empty');
        }
    }
    
    // 更新取消按钮
    if (destContainer) {
        const existingBtn = destContainer.querySelector('.ra-cancel-btn');
        if (selectedDungeon && !existingBtn) {
            const btn = document.createElement('button');
            btn.className = 'ra-cancel-btn';
            btn.textContent = '× 取消';
            btn.onclick = cancelDungeonSelection;
            destContainer.appendChild(btn);
        } else if (!selectedDungeon && existingBtn) {
            existingBtn.remove();
        }
    }
}

// 更新运行状态UI
function updateRealityAnchorUI(isActive) {
    const dotEl = document.getElementById('raStatusDot');
    const textEl = document.getElementById('raStatusText');
    const accelEl = document.getElementById('raAccelerator');
    
    if (dotEl) {
        dotEl.classList.toggle('active', isActive);
    }
    if (textEl) {
        textEl.textContent = isActive ? 'RUNNING' : 'STANDBY';
        textEl.classList.toggle('active', isActive);
    }
    if (accelEl) {
        accelEl.style.display = isActive ? 'block' : 'none';
    }
}

// 显示通知
function showNotification(title, message) {
    const oldNotif = document.querySelector('.ra-notification');
    if (oldNotif) oldNotif.remove();
    
    const notif = document.createElement('div');
    notif.className = 'ra-notification';
    notif.innerHTML = `<h4>● ${title.toUpperCase()}</h4><p>${message}</p>`;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), 3000);
}

// 格式化时间（秒 -> HH:MM:SS）
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

