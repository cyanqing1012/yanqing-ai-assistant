"use strict";

const categories = [
  { key: "briefing", label: "AI 日报", eyebrow: "每日情报", icon: "◫", tone: "mint", sample: "整理今天最值得关注的 5 条 AI 新闻，说明事件、影响和对制造业从业者的启发，适合发在知乎。" },
  { key: "research", label: "材料研发", eyebrow: "研究协同", icon: "⌬", tone: "violet", sample: "帮我分析聚乙烯纤维实验方案，围绕螺杆转速、冷却方式和牵伸温度设计交互作用实验。" },
  { key: "data", label: "数据分析", eyebrow: "实验与业务", icon: "⌁", tone: "blue", sample: "分析这组实验数据，找出强度变化趋势、异常值和可能的工艺原因，并给出下一轮实验建议。" },
  { key: "slides", label: "PPT 汇报", eyebrow: "结构表达", icon: "▤", tone: "orange", sample: "为材料研发项目制作一份 10 页汇报 PPT，面向管理层，突出问题、方案、结果和下一步计划。" },
  { key: "writing", label: "内容写作", eyebrow: "对外表达", icon: "✎", tone: "mint", sample: "把这段技术内容改成适合知乎发布的文章，专业但不学术化，保留事实并增强可读性。" }
];

const tools = {
  chatgpt: { key: "chatgpt", name: "ChatGPT", mark: "C", accent: "#19c39a", description: "适合复杂推理、结构化写作与跨领域任务协同。", bestFor: ["复杂任务", "深度写作", "多轮优化"], url: "https://chatgpt.com/" },
  deepseek: { key: "deepseek", name: "DeepSeek", mark: "D", accent: "#4b7dff", description: "适合逻辑分析、代码辅助和中文技术任务。", bestFor: ["数据分析", "技术推理", "代码"], url: "https://chat.deepseek.com/" },
  kimi: { key: "kimi", name: "Kimi", mark: "K", accent: "#7457ff", description: "适合长文档阅读、资料整理和信息归纳。", bestFor: ["长文档", "资料检索", "报告"], url: "https://www.kimi.com/" },
  wps: { key: "wps", name: "WPS AI", mark: "W", accent: "#ff5b4d", description: "适合文档、表格和演示文稿的办公落地。", bestFor: ["PPT", "表格", "文档"], url: "https://ai.wps.cn/" }
};

const candidates = {
  briefing: ["kimi", "deepseek", "chatgpt"],
  research: ["deepseek", "kimi", "chatgpt"],
  data: ["deepseek", "wps", "chatgpt"],
  slides: ["wps", "kimi", "deepseek"],
  writing: ["kimi", "deepseek", "chatgpt"],
  other: ["deepseek", "kimi", "wps"]
};

const promptTemplates = [
  { title: "实验结果诊断", category: "材料研发", body: "请基于我提供的实验条件与结果，识别趋势、异常与可能机理，并给出下一轮最小验证实验。" },
  { title: "管理层项目汇报", category: "PPT 汇报", body: "请把以下项目整理为管理层汇报：先讲业务问题，再讲关键证据、解决方案、收益与下一步。" },
  { title: "每日 AI 情报", category: "AI 日报", body: "请筛选今天最重要的 AI 动态，区分事实与判断，并说明对制造业和材料研发的具体影响。" }
];

const historyItems = [
  { time: "今天 09:40", title: "聚乙烯纤维工艺交互实验", type: "材料研发", text: categories[1].sample },
  { time: "昨天 18:20", title: "制造业视角 AI 日报", type: "AI 日报", text: categories[0].sample },
  { time: "8 月 23 日", title: "季度研发汇报框架", type: "PPT 汇报", text: categories[3].sample }
];

const analysisLibrary = {
  briefing: {
    title: "建立一份有判断力的 AI 情报简报",
    goal: "从大量动态中筛出真正值得关注的信息，并转化为行动启发",
    deliverable: "5 条重点新闻 + 影响判断 + 制造业视角总结",
    audience: "关注 AI 与制造业的职场人",
    steps: ["限定时间范围与信息源", "按重要性筛选并交叉核验", "提炼影响与行动建议"],
    note: "新闻类内容需要联网核验；发布前应保留原始来源链接。"
  },
  research: {
    title: "把研发问题拆成可验证的实验路线",
    goal: "识别关键变量、交互作用与最小验证组合，减少无效实验",
    deliverable: "变量表 + 实验矩阵 + 指标体系 + 结果判定规则",
    audience: "材料研发工程师与项目负责人",
    steps: ["明确自变量、控制变量与响应值", "设计主效应和交互作用组合", "定义统计判据与补充实验"],
    note: "AI 可以辅助设计与归纳，但机理结论仍需由实验数据验证。"
  },
  data: {
    title: "从数据中找出趋势、异常与下一步动作",
    goal: "将原始表格转化为可解释结论，并定位值得复核的数据点",
    deliverable: "数据清洗说明 + 关键图表 + 异常清单 + 行动建议",
    audience: "研发人员或业务决策者",
    steps: ["检查字段、缺失值与量纲", "完成趋势和异常分析", "将结论映射到下一步验证"],
    note: "未提供原始数据时，先输出分析框架，不应虚构数值结论。"
  },
  slides: {
    title: "把复杂项目讲成一条清晰决策线",
    goal: "让管理层快速理解问题、证据、方案、收益与下一步",
    deliverable: "10 页左右 PPT 结构 + 每页要点 + 演讲提示",
    audience: "管理层与跨部门项目成员",
    steps: ["确定单一汇报结论", "按问题—证据—方案搭建页面", "压缩文字并突出关键数字"],
    note: "每页只承载一个核心观点，避免把实验过程完整搬上页面。"
  },
  writing: {
    title: "把专业信息改写成目标读者愿意读的内容",
    goal: "保留事实准确性，同时提升结构、节奏与可读性",
    deliverable: "可直接使用的成稿 + 标题备选 + 修改说明",
    audience: "由发布平台和内容目的决定",
    steps: ["识别受众与沟通目的", "重组逻辑并压缩术语", "校对事实、语气和平台风险"],
    note: "涉及公司信息时，应先去除未公开数据、客户名称与内部判断。"
  },
  other: {
    title: "把模糊需求整理成一条可执行路线",
    goal: "先澄清目标与交付物，再选择合适的 AI 工具",
    deliverable: "任务拆解 + 缺失信息 + 推荐工具 + 可执行 Prompt",
    audience: "任务发起人与最终使用者",
    steps: ["确认目标与验收标准", "补齐最多 3 个关键信息", "选择工具并生成执行指令"],
    note: "如果结果用于重要决策，需补充事实来源与人工复核环节。"
  }
};

const state = { view: "workspace", activeCategory: null, analysis: null, selectedTool: "deepseek", prompt: "", optimizing: false };
const viewNames = { workspace: "智能任务台", tools: "工具雷达", prompts: "Prompt 工作台", history: "最近任务" };
const byId = (id) => document.getElementById(id);

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function inferCategory(text) {
  if (/日报|新闻|资讯|热点|情报/.test(text)) return "briefing";
  if (/材料|聚乙烯|配方|纤维|实验|工艺|论文|研发|流变|牵伸/.test(text)) return "research";
  if (/数据|表格|分析|趋势|异常|回归|Excel/i.test(text)) return "data";
  if (/PPT|汇报|演示|答辩|课件/i.test(text)) return "slides";
  if (/文案|文章|润色|邮件|知乎|小红书|朋友圈/.test(text)) return "writing";
  return "other";
}

function analyzeTask(text, category) {
  const signals = [text.length > 24, /面向|受众|给谁/.test(text), /输出|页|条|表|报告|文章/.test(text)];
  return { category, score: Math.min(76 + signals.filter(Boolean).length * 6, 94), ...analysisLibrary[category] };
}

function buildPrompt(text, analysis, tool) {
  const categoryRules = {
    briefing: "只使用可核验的公开信息；每条包含事件、发生时间、来源、影响和关注理由；将事实与判断分开。",
    research: "先列变量和假设，再给实验矩阵；明确主效应、交互作用、响应指标和判定方法；不能把未做的组合宣称为最优。",
    data: "先检查数据质量，再分析趋势和异常；没有数据时只给分析框架；所有结论说明所依据的字段或图表。",
    slides: "按 10 页左右输出，每页包含标题、单一核心观点、3 个以内要点和视觉建议；补充 3 分钟讲稿提纲。",
    writing: "保留事实和立场，不虚构经历；先给成稿，再说明结构、语气和删改理由；提供 3 个不同风格标题。",
    other: "先复述目标；信息不足时只问最多 3 个必要问题；然后给出最省时间的执行步骤和验收标准。"
  };
  return `你是 YanQing.AI 中的专业任务助手。请在 ${tool.name} 中完成下面的工作。\n\n【原始需求】\n${text}\n\n【任务目标】\n${analysis.goal}\n\n【期望交付】\n${analysis.deliverable}\n\n【执行规则】\n1. ${categoryRules[analysis.category]}\n2. 先给结论和可直接使用的结果，再解释过程。\n3. 不确定的信息明确标注“待核验”，不要补造事实或数据。\n4. 输出使用清晰的小标题、编号和表格；中文表达专业、直接、易懂。\n5. 结尾给出下一步最值得执行的 3 个动作。\n\n开始前，请先用一句话确认你对任务的理解。`;
}

function renderCategories() {
  byId("category-chips").innerHTML = categories.map((category) => `<button data-category="${category.key}">${category.icon} ${category.label}</button>`).join("");
  byId("scene-grid").innerHTML = categories.slice(0, 4).map((category, index) => `
    <button class="scene-card ${category.tone}" data-scene="${category.key}">
      <span class="scene-number">0${index + 1}</span><span class="scene-icon">${category.icon}</span>
      <h3>${category.label}</h3><p>${category.eyebrow}</p><b>开始任务 →</b>
    </button>`).join("");
}

function renderTools() {
  byId("tool-atlas").innerHTML = Object.values(tools).map((tool, index) => `
    <article><span class="atlas-index">0${index + 1}</span><span class="atlas-mark" style="--tool-color:${tool.accent}">${tool.mark}</span>
      <h2>${tool.name}</h2><p>${tool.description}</p><div>${tool.bestFor.map((item) => `<span>${item}</span>`).join("")}</div>
      <a href="${tool.url}" target="_blank" rel="noreferrer">访问官网 ↗</a>
    </article>`).join("");
}

function renderTemplates() {
  byId("template-list").innerHTML = promptTemplates.map((template, index) => `
    <button data-template="${index}"><span>0${index + 1}</span><div><em>${template.category}</em><h2>${template.title}</h2><p>${template.body}</p></div><b>→</b></button>`).join("");
  byId("history-table").innerHTML = historyItems.map((item, index) => `
    <button data-history="${index}"><span>${item.time}</span><div><strong>${item.title}</strong><small>${item.type}</small></div><i>▤</i><b>›</b></button>`).join("");
}

function setView(view) {
  state.view = view;
  document.querySelectorAll(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  document.querySelectorAll(".view-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === view));
  byId("route-name").textContent = viewNames[view];
  closeSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function useCategory(key) {
  const category = categories.find((item) => item.key === key);
  if (!category) return;
  byId("task-input").value = category.sample;
  state.activeCategory = key;
  state.analysis = null;
  byId("assistant-result").hidden = true;
  document.querySelectorAll("[data-category]").forEach((button) => button.classList.toggle("active", button.dataset.category === key));
  updateRouteProgress();
  setView("workspace");
  byId("task-input").focus();
}

function updateRouteProgress() {
  const hasTask = Boolean(byId("task-input").value.trim());
  byId("route-step-1").classList.toggle("active", hasTask);
  byId("route-step-2").classList.toggle("active", Boolean(state.analysis));
  byId("route-step-3").classList.toggle("active", Boolean(state.analysis));
}

function renderResult() {
  const analysis = state.analysis;
  const toolKeys = candidates[analysis.category];
  byId("analysis-title").textContent = analysis.title;
  byId("clarity-score").textContent = analysis.score;
  byId("analysis-goal").textContent = analysis.goal;
  byId("analysis-deliverable").textContent = analysis.deliverable;
  byId("analysis-audience").textContent = analysis.audience;
  byId("analysis-note").textContent = analysis.note;
  byId("execution-steps").innerHTML = analysis.steps.map((step, index) => `<div><span>${index + 1}</span><div><b>${escapeHTML(step)}</b><small>${index === 0 ? "先建立边界" : index === 1 ? "完成核心工作" : "形成可验证结果"}</small></div></div>`).join("");
  byId("tool-options").innerHTML = toolKeys.map((key, index) => {
    const tool = tools[key];
    const selected = key === state.selectedTool;
    return `<button class="${selected ? "selected" : ""}" data-tool="${key}" aria-pressed="${selected}"><span class="tool-mark" style="--tool-color:${tool.accent}">${tool.mark}</span><div><strong>${tool.name}${index === 0 ? "<em>首选</em>" : ""}</strong><small>${tool.description}</small></div><span class="tool-select">${selected ? "✓" : "选择"}</span></button>`;
  }).join("");
  state.prompt = buildPrompt(byId("task-input").value.trim(), analysis, tools[state.selectedTool]);
  updatePromptArea();
  byId("assistant-result").hidden = false;
  byId("signal-title").textContent = "1 个任务已就绪";
  byId("signal-copy").textContent = "需求已拆解，Prompt 可直接复制";
  byId("signal-progress").classList.add("complete");
  byId("history-count").textContent = historyItems.length + 1;
  byId("route-preview-title").textContent = "路线已经准备好";
  updateRouteProgress();
}

function updatePromptArea() {
  const tool = tools[state.selectedTool];
  byId("prompt-output").value = state.prompt;
  byId("prompt-tool-label").textContent = `已按 ${tool.name} 优化结构`;
  byId("launch-button").href = tool.url;
  byId("launch-button").innerHTML = `前往 ${tool.name} <span>↗</span>`;
}

function chooseTool(key) {
  if (!tools[key] || !state.analysis) return;
  state.selectedTool = key;
  state.prompt = buildPrompt(byId("task-input").value.trim(), state.analysis, tools[key]);
  renderResult();
}

function runAnalysis() {
  const task = byId("task-input").value.trim();
  if (!task) { showToast("先告诉我你想完成什么任务", true); return; }
  const button = byId("run-button");
  button.disabled = true;
  button.classList.add("loading");
  button.querySelector("b").textContent = "正在拆解";
  byId("route-preview-title").textContent = "正在理解你的目标";
  state.analysis = null;
  byId("assistant-result").hidden = true;
  window.setTimeout(() => {
    const category = state.activeCategory || inferCategory(task);
    state.analysis = analyzeTask(task, category);
    state.activeCategory = category;
    state.selectedTool = candidates[category][0];
    renderResult();
    document.querySelectorAll("[data-category]").forEach((chip) => chip.classList.toggle("active", chip.dataset.category === category));
    button.disabled = false;
    button.classList.remove("loading");
    button.querySelector("b").textContent = "生成执行方案";
    showToast("执行方案已生成");
    window.setTimeout(() => byId("assistant-result").scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }, 620);
}

async function copyPrompt() {
  const content = byId("prompt-output").value;
  try {
    await navigator.clipboard.writeText(content);
    showToast("Prompt 已复制，可以直接去执行");
  } catch (_error) {
    byId("prompt-output").focus();
    byId("prompt-output").select();
    const copied = document.execCommand("copy");
    showToast(copied ? "Prompt 已复制，可以直接去执行" : "复制失败，请手动选择文本", !copied);
  }
}

function showToast(message, isError = false) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function openSidebar() { byId("sidebar").classList.add("open"); byId("sidebar-backdrop").classList.add("show"); }
function closeSidebar() { byId("sidebar").classList.remove("open"); byId("sidebar-backdrop").classList.remove("show"); }

function bindEvents() {
  document.querySelectorAll(".nav-button").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  byId("brand-home").addEventListener("click", () => setView("workspace"));
  byId("menu-button").addEventListener("click", openSidebar);
  byId("sidebar-backdrop").addEventListener("click", closeSidebar);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeSidebar(); });
  byId("category-chips").addEventListener("click", (event) => { const button = event.target.closest("[data-category]"); if (button) useCategory(button.dataset.category); });
  byId("scene-grid").addEventListener("click", (event) => { const button = event.target.closest("[data-scene]"); if (button) useCategory(button.dataset.scene); });
  byId("task-input").addEventListener("input", () => { state.activeCategory = null; document.querySelectorAll("[data-category]").forEach((chip) => chip.classList.remove("active")); updateRouteProgress(); });
  byId("task-input").addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") runAnalysis(); });
  byId("run-button").addEventListener("click", runAnalysis);
  byId("tool-options").addEventListener("click", (event) => { const button = event.target.closest("[data-tool]"); if (button) chooseTool(button.dataset.tool); });
  byId("prompt-output").addEventListener("input", (event) => { state.prompt = event.target.value; });
  byId("copy-button").addEventListener("click", copyPrompt);
  byId("optimize-button").addEventListener("click", () => {
    if (!state.analysis) return;
    state.prompt = `${buildPrompt(byId("task-input").value.trim(), state.analysis, tools[state.selectedTool])}\n\n【额外要求】\n请先给一个最小可行版本，再给进一步优化建议。`;
    updatePromptArea();
    showToast("已加入最小可行版本要求");
  });
  byId("template-list").addEventListener("click", (event) => { const button = event.target.closest("[data-template]"); if (button) { const item = promptTemplates[Number(button.dataset.template)]; byId("task-input").value = item.body; state.activeCategory = inferCategory(item.body); state.analysis = null; byId("assistant-result").hidden = true; setView("workspace"); updateRouteProgress(); byId("task-input").focus(); } });
  byId("history-table").addEventListener("click", (event) => { const button = event.target.closest("[data-history]"); if (button) { const item = historyItems[Number(button.dataset.history)]; byId("task-input").value = item.text; state.activeCategory = inferCategory(item.text); state.analysis = null; byId("assistant-result").hidden = true; setView("workspace"); updateRouteProgress(); byId("task-input").focus(); } });
}

function init() {
  renderCategories();
  renderTools();
  renderTemplates();
  bindEvents();
  updateRouteProgress();
}

document.addEventListener("DOMContentLoaded", init);
