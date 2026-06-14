/*
  Suguru Interest News (Vanilla JS)
  - Main / Category / Filter タグ
  - 声優 + テーマニュース
  - 自動収集パネル（モック）
  - 検索 / 保存 / 元記事リンク
*/

const STORAGE_KEYS = {
  actors: "favoriteVoiceActorsV1",
  savedArticles: "savedVoiceActorArticlesV1",
  newsCache: "voiceActorNewsCacheV14",
  tagSelection: "newsTagSelectionV1"
};

const PRIORITY_ACTORS = ["花澤香菜", "早見沙織", "悠木碧", "水瀬いのり", "松井恵理子", "大塚明夫"];
const BASE_FILTER_TAGS = ["新着", "公開日", "PV", "配信", "特典", "ボイス"];
const ANIME_FILTER_TAGS = ["TVアニメ", "アニメ映画", "イベント"];
const LIVE_ACTION_FILTER_TAGS = ["邦画", "洋画"];
const ROBOTICS_FILTER_TAGS = ["ヒューマノイド", "Physical AI", "現場導入"];
const NO_SUMMARY_MESSAGE = "説明はありません。元記事をご確認ください。";

const ANIME_PRIORITY_KEYWORDS = [
  "ガンダム",
  "新海誠",
  "細田守",
  "sf",
  "エスエフ",
  "mfゴースト",
  "学園",
  "キルアオ",
  "ガンアクション",
  "ブラックラグーン"
];

const ANIME_EXCLUDE_KEYWORDS = [
  "ディズニー",
  "ジブリ",
  "プリキュア",
  "しまじろう",
  "アンパンマン",
  "幼馴染とはラブコメにならない",
  "ラブコメ"
];

const EVENT_CHAIN_INCLUDE_KEYWORDS = [
  "コラボ",
  "キャンペーン",
  "フェア",
  "展示",
  "ファミマ",
  "ファミリーマート",
  "セブン",
  "ローソン",
  "ミニストップ",
  "デイリーヤマザキ",
  "ガスト",
  "サイゼリヤ",
  "ココス",
  "ジョナサン",
  "びっくりドンキー",
  "マクドナルド",
  "モスバーガー",
  "ケンタッキー",
  "すき家",
  "松屋",
  "吉野家"
];

const EVENT_REGION_EXCLUDE_KEYWORDS = [
  "期間限定カフェ",
  "コラボカフェ",
  "ポップアップカフェ",
  "popup cafe",
  "渋谷限定",
  "池袋限定",
  "秋葉原限定",
  "名古屋限定",
  "大阪限定",
  "福岡限定",
  "東京限定",
  "会場限定"
];

const LIVE_ACTION_PRIORITY_KEYWORDS = [
  "sf",
  "sci-fi",
  "ファンタジー",
  "アクション",
  "アドベンチャー",
  "戦争",
  "ミステリー",
  "サスペンス",
  "社会派",
  "知的エンタメ",
  "レース",
  "乗り物",
  "公開予定",
  "上映予定"
];

const LIVE_ACTION_EXCLUDE_KEYWORDS = [
  "子供向け",
  "キッズ",
  "ファミリー向け",
  "ホラー",
  "恐怖",
  "任侠",
  "極道",
  "ヤクザ",
  "ミュージカル",
  "音楽映画",
  "ドキュメンタリー"
];

const JAPANESE_MOVIE_PRIORITY_PEOPLE = [
  "玉木宏",
  "藤原竜也",
  "佐藤健"
];

const FOREIGN_MOVIE_PRIORITY_PEOPLE = [
  "クリストファー・ノーラン",
  "christopher nolan",
  "トム・クルーズ",
  "tom cruise",
  "キアヌ・リーヴス",
  "keanu reeves"
];

const JAPANESE_MOVIE_FAVORITE_TITLES = [
  "ラプラスの魔女",
  "ピンポン",
  "シン・ゴジラ",
  "私をスキーに連れてって",
  "銀色のシーズン",
  "ロボジー",
  "robo-g",
  "ai崩壊",
  "るろうに剣心",
  "ハゲタカ",
  "億男",
  "カイジ",
  "22年目の告白",
  "亡国のイージス",
  "天使がいた屋上",
  "沈黙の艦隊"
];

const FOREIGN_MOVIE_FAVORITE_TITLES = [
  "ザ・コンサルタント",
  "the accountant",
  "ラッシュ",
  "rush",
  "アウトロー",
  "jack reacher",
  "トップガン マーヴェリック",
  "top gun maverick",
  "ファイト・クラブ",
  "fight club",
  "バンド・オブ・ブラザース",
  "band of brothers",
  "インターステラー",
  "interstellar",
  "インセプション",
  "inception",
  "バック・トゥ・ザ・フューチャー",
  "back to the future",
  "tenet",
  "テネット",
  "2001年宇宙の旅",
  "2001 a space odyssey",
  "ジュラシック・パーク",
  "jurassic park",
  "ジュラシック・ワールド",
  "jurassic world",
  "シックス・センス",
  "the sixth sense",
  "ザ・ロック",
  "the rock",
  "キャスト・アウェイ",
  "cast away",
  "ユー・ガット・メール",
  "you've got mail",
  "ブラックホーク・ダウン",
  "black hawk down",
  "スナッチ",
  "snatch",
  "ジャッキー・ブラウン",
  "jackie brown"
];

const JAPANESE_MOVIE_HINTS = [
  "邦画",
  "日本映画",
  "日本版",
  "東宝",
  "松竹",
  "日本公開"
];

const FOREIGN_MOVIE_HINTS = [
  "洋画",
  "海外映画",
  "ハリウッド",
  "hollywood",
  "全米",
  "world premiere"
];

const HUMANOID_ROBOTICS_KEYWORDS = [
  "humanoid",
  "bipedal",
  "ヒューマノイド",
  "人型ロボット",
  "二足歩行",
  "tesla optimus",
  "optimus",
  "figure ai",
  "figure",
  "unitree",
  "atlas",
  "boston dynamics",
  "agility robotics",
  "digit",
  "1x",
  "neo",
  "apptronik",
  "apollo"
];

const PHYSICAL_AI_KEYWORDS = [
  "physical ai",
  "embodied ai",
  "robot foundation model",
  "foundation model",
  "world model",
  "robot brain",
  "sim-to-real",
  "teleoperation",
  "training data",
  "身体性ai",
  "フィジカルai",
  "基盤モデル",
  "遠隔操作",
  "学習データ"
];

const ROBOTICS_CORE_KEYWORDS = [
  "robot",
  "robots",
  "robotics",
  "automation",
  "autonomous",
  "ロボット",
  "ロボティクス",
  "自動化"
];

const ROBOTICS_DEPLOYMENT_KEYWORDS = [
  "warehouse",
  "logistics",
  "factory",
  "manufacturing",
  "deployment",
  "pilot",
  "commercial",
  "customer",
  "倉庫",
  "物流",
  "工場",
  "製造",
  "導入",
  "実証",
  "商用",
  "現場"
];

const MOVIE_SOURCE_CONFIG = {
  eigaComingIcs: {
    url: "https://eiga.com/movie/coming.ics",
    source: "映画.com 公開スケジュール"
  },
  thrMovies: {
    url: "https://hollywoodreporter.jp/c/movies/",
    source: "THE HOLLYWOOD REPORTER JAPAN"
  }
};

const ANIME_SOURCE_CONFIG = {
  animeHack: {
    url: "https://anime.eiga.com/news/",
    source: "アニメハック"
  },
  animeAnime: {
    url: "https://animeanime.jp/category/news/latest/latest/",
    source: "アニメ！アニメ！"
  },
  comicNatalie: {
    url: "https://natalie.mu/comic/news/list/tag_id/3",
    source: "コミックナタリー"
  }
};

const ROBOTICS_SOURCE_CONFIG = {
  roboHub: {
    url: "https://robohub.org/",
    feedUrl: "https://robohub.org/feed/",
    source: "RoboHub",
    linkPrefix: "https://robohub.org/"
  },
  techCrunch: {
    url: "https://techcrunch.com/category/robotics/",
    feedUrl: "https://techcrunch.com/category/robotics/feed/",
    source: "TechCrunch Robotics",
    linkPrefix: "https://techcrunch.com/"
  },
  nvidiaRobotics: {
    url: "https://blogs.nvidia.com/blog/category/robotics/",
    feedUrl: "https://blogs.nvidia.com/blog/category/robotics/feed/",
    source: "NVIDIA Robotics",
    linkPrefix: "https://blogs.nvidia.com/"
  }
};

const CONFIG = {
  rssProxyBases: [
    "https://api.allorigins.win/raw?url=",
    "https://api.codetabs.com/v1/proxy?quest="
  ],
  rssJsonProxyBase: "https://api.rss2json.com/v1/api.json?rss_url=",
  maxItems: 15,
  movieLiveMaxItems: 30,
  roboticsMaxItems: 20,
  newsLookbackDays: 90,
  requestTimeoutMs: 5000,
  mainTags: [
    { key: "all", label: "すべて" },
    { key: "anime_group", label: "アニメ系" },
    { key: "movie_live", label: "映画実写" },
    { key: "robotics", label: "ロボティクス" },
    { key: "foodtech", label: "フードテック" }
  ],
  categoryTags: [
    { key: "voice", label: "声優" },
    { key: "anime", label: "アニメ" },
    { key: "movie_live", label: "映画" },
    { key: "car", label: "車" }
  ],
  sourceFeeds: ["声優ニュース", "アニメニュース", "映画ニュース", "テックニュース"]
};

const savedTagSelection = loadTagSelection();

const state = {
  favorites: normalizeFavorites(loadJSON(STORAGE_KEYS.actors, [])),
  selectedActor: "",
  selectedMainTag: savedTagSelection.selectedMainTag,
  selectedCategoryTag: savedTagSelection.selectedCategoryTag,
  selectedFilterTag: savedTagSelection.selectedFilterTag,
  activeTag: savedTagSelection.selectedCategoryTag || savedTagSelection.selectedMainTag,
  searchText: "",
  savedOnly: false,
  items: [],
  collectedItems: [],
  filteredItems: [],
  expandedItemKey: "",
  savedMap: loadSavedMap(),
  autoCollectEnabled: true,
  collectorStatus: "待機中",
  collectorCount: 0,
  collectorLastAt: "未実行",
  collectionLogs: ["初期化完了", "声優・アニメ・映画・テック系ニュースを監視待機中"],
  sourceFeedMap: Object.fromEntries(CONFIG.sourceFeeds.map((name) => [name, true])),
  loadRequestSeq: 0,
  currentDialogItem: null
};

const ui = {
  status: document.getElementById("status"),
  list: document.getElementById("newsList"),
  refreshBtn: document.getElementById("refreshBtn"),
  actorPanel: document.getElementById("actorPanel"),
  actorInput: document.getElementById("actorInput"),
  addActorBtn: document.getElementById("addActorBtn"),
  actorChips: document.getElementById("actorChips"),
  mainTagChips: document.getElementById("mainTagChips"),
  categoryTagChips: document.getElementById("categoryTagChips"),
  filterTagChips: document.getElementById("filterTagChips"),
  sourceFeedChips: document.getElementById("sourceFeedChips"),
  logs: document.getElementById("collectionLogs"),
  toggleAutoCollectBtn: document.getElementById("toggleAutoCollectBtn"),
  runMockCollectBtn: document.getElementById("runMockCollectBtn"),
  searchInput: document.getElementById("searchInput"),
  savedOnlyBtn: document.getElementById("savedOnlyBtn"),
  currentTagLabel: document.getElementById("currentTagLabel"),
  trackedCount: document.getElementById("trackedCount"),
  collectedCount: document.getElementById("collectedCount"),
  visibleCount: document.getElementById("visibleCount"),
  savedCount: document.getElementById("savedCount"),
  collectorEnabledText: document.getElementById("collectorEnabledText"),
  collectorStatusText: document.getElementById("collectorStatusText"),
  collectorLastText: document.getElementById("collectorLastText"),
  collectorCountText: document.getElementById("collectorCountText"),
  dialog: document.getElementById("newsDialog"),
  dialogTitle: document.getElementById("dialogTitle"),
  dialogMeta: document.getElementById("dialogMeta"),
  dialogDesc: document.getElementById("dialogDesc"),
  dialogLink: document.getElementById("dialogLink"),
  dialogSaveBtn: document.getElementById("dialogSaveBtn"),
  closeDialogBtn: document.getElementById("closeDialogBtn")
};

function loadJSON(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallbackValue;
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readTagSelectionParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    selectedMainTag: params.get("main") || "",
    selectedCategoryTag: params.get("category") || "",
    selectedFilterTag: params.get("filter") || ""
  };
}

function loadTagSelection() {
  const saved = loadJSON(STORAGE_KEYS.tagSelection, {});
  const params = readTagSelectionParams();
  const mainKeys = new Set(CONFIG.mainTags.map((tag) => tag.key));
  const categoryKeys = new Set(CONFIG.categoryTags.map((tag) => tag.key));
  const mainTag = params.selectedMainTag || saved?.selectedMainTag;
  const categoryTag = params.selectedCategoryTag || saved?.selectedCategoryTag;
  const filterTag = params.selectedFilterTag || saved?.selectedFilterTag;

  return {
    selectedMainTag: mainKeys.has(mainTag) ? mainTag : "anime_group",
    selectedCategoryTag: categoryKeys.has(categoryTag) ? categoryTag : "",
    selectedFilterTag: typeof filterTag === "string" ? filterTag : ""
  };
}

function saveTagSelection() {
  saveJSON(STORAGE_KEYS.tagSelection, {
    selectedMainTag: state.selectedMainTag,
    selectedCategoryTag: state.selectedCategoryTag,
    selectedFilterTag: state.selectedFilterTag
  });
  syncTagSelectionUrl();
}

function syncTagSelectionUrl() {
  if (typeof window === "undefined" || !window.history?.replaceState) return;

  const url = new URL(window.location.href);
  url.searchParams.set("main", state.selectedMainTag);
  if (state.selectedCategoryTag) {
    url.searchParams.set("category", state.selectedCategoryTag);
  } else {
    url.searchParams.delete("category");
  }
  if (state.selectedFilterTag) {
    url.searchParams.set("filter", state.selectedFilterTag);
  } else {
    url.searchParams.delete("filter");
  }
  window.history.replaceState(null, "", url);
}

function normalizeFavorites(inputList) {
  const merged = [...PRIORITY_ACTORS, ...(Array.isArray(inputList) ? inputList : [])];
  const unique = [];
  const seen = new Set();

  for (const raw of merged) {
    const name = String(raw || "").trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    unique.push(name);
  }

  return unique;
}

function loadSavedMap() {
  const savedArray = loadJSON(STORAGE_KEYS.savedArticles, []);
  const map = new Map();
  for (const item of savedArray) {
    if (item && item.link) map.set(item.link, item);
  }
  return map;
}

function persistSavedMap() {
  saveJSON(STORAGE_KEYS.savedArticles, [...state.savedMap.values()]);
}

function loadNewsCacheMap() {
  const rows = loadJSON(STORAGE_KEYS.newsCache, []);
  const map = new Map();
  for (const row of rows) {
    if (row && row.key && Array.isArray(row.items)) {
      map.set(row.key, row.items);
    }
  }
  return map;
}

const newsCacheMap = loadNewsCacheMap();

function cacheKey(tagKey, actor = "") {
  return `${tagKey}::${actor || "__general__"}`;
}

function readCachedNews(tagKey, actor = "") {
  return newsCacheMap.get(cacheKey(tagKey, actor)) || [];
}

function writeCachedNews(tagKey, actor, items) {
  newsCacheMap.set(cacheKey(tagKey, actor), items);
  const rows = [...newsCacheMap.entries()].map(([k, v]) => ({ key: k, items: v }));
  saveJSON(STORAGE_KEYS.newsCache, rows);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = CONFIG.requestTimeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") throw new Error(`タイムアウト: ${timeoutMs}ms`);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function setStatus(message, isError = false) {
  ui.status.textContent = message;
  ui.status.classList.toggle("error", isError);
}

function stripHtml(input = "") {
  return String(input || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForCompare(text) {
  return String(text || "")
    .replace(/[「」『』【】\[\]\(\)"'`]/g, "")
    .replace(/[！!？?：:・,，。、.\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function buildSummary(title, description) {
  const cleanTitle = String(title || "").trim();
  let summary = stripHtml(description);
  if (!summary) return NO_SUMMARY_MESSAGE;

  const variants = [cleanTitle, `「${cleanTitle}」`, `『${cleanTitle}』`, `【${cleanTitle}】`];
  for (const v of variants) {
    if (v && summary.startsWith(v)) {
      summary = summary.slice(v.length).trim();
      break;
    }
  }

  summary = summary.replace(/^[-:：\s、。,，]+/, "").trim();
  if (!summary) return NO_SUMMARY_MESSAGE;

  const normalizedSummary = normalizeForCompare(summary);
  const normalizedTitle = normalizeForCompare(cleanTitle);
  if (!normalizedSummary || normalizedSummary === normalizedTitle) return NO_SUMMARY_MESSAGE;

  return summary.length >= 8 ? summary : NO_SUMMARY_MESSAGE;
}

function isMeaningfulArticle(item) {
  return buildSummary(item.title, item.description) !== NO_SUMMARY_MESSAGE;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "日時不明";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
}

function buildGoogleNewsRssUrl(query) {
  const normalizedQuery = /\bwhen:\d+[dmy]\b/i.test(query) ? query : `${query} when:${CONFIG.newsLookbackDays}d`;
  const encoded = encodeURIComponent(normalizedQuery);
  return `https://news.google.com/rss/search?q=${encoded}&hl=ja&gl=JP&ceid=JP:ja`;
}

function isWithinLookbackRange(dateStr) {
  const time = new Date(dateStr).getTime();
  if (!time) return false;

  const lookbackMs = CONFIG.newsLookbackDays * 24 * 60 * 60 * 1000;
  return Date.now() - time <= lookbackMs;
}

function tagLabel(tagKey) {
  const map = {
    all: "すべて",
    anime_group: "アニメ系",
    voice: "声優",
    anime: "アニメ",
    movie_live: "映画実写",
    foodtech: "フードテック",
    robotics: "ロボティクス",
    car: "車"
  };
  return map[tagKey] || "ニュース";
}

function buildVoiceQueries(actor) {
  const q = actor.trim();
  return [`"${q}" 声優 近況 OR 最新 OR ニュース OR 話題`, `"${q}" 声優 出演`, `"${q}"`];
}

function buildTopicQueries(tagKey) {
  if (tagKey === "anime") {
    return [
      "アニメ OR アニメ映画 最新 ガンダム OR SF OR 学園 OR ガンアクション",
      "新海誠 OR 細田守 OR MFゴースト OR ブラックラグーン アニメ 最新"
    ];
  }
  if (tagKey === "movie_live") {
    return [
      "邦画 映画 公開予定 OR 上映予定 SF OR アクション OR サスペンス OR ミステリー 玉木宏 OR 藤原竜也 OR 佐藤健",
      "洋画 映画 公開予定 OR 上映予定 SF OR アクション OR 戦争 OR ミステリー Tom Cruise OR Keanu Reeves OR Christopher Nolan",
      "\"シン・ゴジラ\" OR \"AI崩壊\" OR \"沈黙の艦隊\" OR \"るろうに剣心\" 公開予定 映画",
      "\"Interstellar\" OR \"Inception\" OR TENET OR \"Top Gun Maverick\" OR \"John Wick\" 公開予定 movie"
    ];
  }
  if (tagKey === "foodtech") return ["フードテック 最新", "フードテック 産業"];
  if (tagKey === "robotics") {
    return [
      "humanoid robots OR bipedal robot OR Tesla Optimus OR Figure AI OR Unitree robotics",
      "\"physical AI\" OR \"embodied AI\" OR \"robot foundation model\" OR teleoperation robotics",
      "robotics deployment warehouse OR factory OR logistics"
    ];
  }
  if (tagKey === "car") return ["自動車 最新 ニュース", "車 産業 最新"];
  return ["ニュース 最新"];
}

function buildMovieLiveQueryGroups() {
  return {
    japanese: [
      "邦画 映画 公開予定 OR 上映予定 SF OR アクション OR サスペンス OR ミステリー 玉木宏 OR 藤原竜也 OR 佐藤健",
      "\"シン・ゴジラ\" OR \"AI崩壊\" OR \"沈黙の艦隊\" OR \"るろうに剣心\" 公開予定 OR 新作 映画"
    ],
    foreign: [
      "洋画 映画 公開予定 OR 上映予定 OR 新作 SF OR アクション OR 戦争 OR ミステリー トム・クルーズ OR キアヌ・リーヴス OR クリストファー・ノーラン",
      "\"Interstellar\" OR \"Inception\" OR TENET OR \"Top Gun Maverick\" OR \"John Wick\" 公開予定 OR 新作 movie",
      "トム・クルーズ OR キアヌ・リーヴス OR クリストファー・ノーラン 洋画 映画 予告 OR 特報 OR 公開日"
    ]
  };
}

function buildRoboticsSourceQueries() {
  return [
    "site:robohub.org humanoid OR robotics OR \"physical AI\" OR deployment",
    "site:techcrunch.com robotics humanoid OR \"physical AI\" OR warehouse",
    "site:blogs.nvidia.com robotics OR \"physical AI\" OR humanoid OR Isaac"
  ];
}

function parseRssItems(xml, meta) {
  const sourceName = xml.querySelector("channel > title")?.textContent?.trim() || "RSS";
  const nodes = [...xml.querySelectorAll("item")];

  return nodes.map((item) => ({
    id: `${meta.key}-${item.querySelector("guid")?.textContent?.trim() || item.querySelector("link")?.textContent?.trim() || Math.random()}`,
    actor: meta.actor || "",
    category: meta.categoryLabel,
    categoryKey: meta.categoryKey,
    title: item.querySelector("title")?.textContent?.trim() || "タイトルなし",
    link: item.querySelector("link")?.textContent?.trim() || "#",
    publishedAt: item.querySelector("pubDate")?.textContent?.trim() || "",
    description: stripHtml(item.querySelector("description")?.textContent || ""),
    source: item.querySelector("source")?.textContent?.trim() || sourceName
  }));
}

async function fetchRssXmlWithFallback(feedUrl) {
  let lastError = null;

  for (const proxyBase of CONFIG.rssProxyBases) {
    try {
      const proxyUrl = `${proxyBase}${encodeURIComponent(feedUrl)}`;
      const response = await fetchWithTimeout(proxyUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`RSS取得失敗: ${response.status}`);

      const xmlText = await response.text();
      const xml = new DOMParser().parseFromString(xmlText, "text/xml");
      if (xml.querySelector("parsererror")) throw new Error("RSS解析に失敗");
      return xml;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("RSS取得に失敗");
}

async function fetchTextWithProxyFallback(url) {
  let lastError = null;

  for (const proxyBase of CONFIG.rssProxyBases) {
    try {
      const proxyUrl = `${proxyBase}${encodeURIComponent(url)}`;
      const response = await fetchWithTimeout(proxyUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`取得失敗: ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("テキスト取得に失敗");
}

async function fetchRss2JsonItems(feedUrl, meta) {
  const endpoint = `${CONFIG.rssJsonProxyBase}${encodeURIComponent(feedUrl)}`;
  const response = await fetchWithTimeout(endpoint, { cache: "no-store" });
  if (!response.ok) throw new Error(`RSS2JSON取得失敗: ${response.status}`);

  const data = await response.json();
  if (!Array.isArray(data.items)) throw new Error("RSS2JSON形式が不正");

  return data.items.map((item) => ({
    id: `${meta.key}-${item.guid || item.link || Math.random()}`,
    actor: meta.actor || "",
    category: meta.categoryLabel,
    categoryKey: meta.categoryKey,
    title: (item.title || "タイトルなし").trim(),
    link: (item.link || "#").trim(),
    publishedAt: item.pubDate || "",
    description: stripHtml(item.description || item.content || ""),
    source: item.author || data.feed?.title || "RSS"
  }));
}

async function fetchNewsByQueries(queries, meta, options = {}) {
  const collectAll = Boolean(options.collectAll);
  let lastError = null;
  const collected = [];

  for (const query of queries) {
    const feedUrl = buildGoogleNewsRssUrl(query);
    try {
      const xml = await fetchRssXmlWithFallback(feedUrl);
      const items = parseRssItems(xml, meta);
      if (items.length > 0) {
        if (!collectAll) return items;
        collected.push(...items);
        continue;
      }
    } catch (error) {
      lastError = error;
    }

    try {
      const items = await fetchRss2JsonItems(feedUrl, meta);
      if (items.length > 0) {
        if (!collectAll) return items;
        collected.push(...items);
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (collectAll && collected.length > 0) {
    return dedupeLatestByContent(sortByDateDesc(collected));
  }

  throw lastError || new Error("該当ニュースなし");
}

function unfoldIcsText(text) {
  return String(text || "").replace(/\r?\n[ \t]/g, "");
}

function parseIcsDateToIso(raw) {
  const value = String(raw || "").trim();
  const match = value.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return "";

  const [, year, month, day] = match;
  return new Date(`${year}-${month}-${day}T09:00:00+09:00`).toISOString();
}

function parseEigaComingItems(icsText) {
  const text = unfoldIcsText(icsText);
  const blocks = text.split("BEGIN:VEVENT").slice(1);

  return blocks.map((block, index) => {
    const title = block.match(/SUMMARY:(.+)/)?.[1]?.trim() || "タイトルなし";
    const releaseDate = block.match(/DTSTART[^:]*:(.+)/)?.[1]?.trim() || "";
    const url = block.match(/URL:(.+)/)?.[1]?.trim() || "https://eiga.com/coming/";

    return {
      id: `movie-live-eiga-${index}-${title}`,
      actor: "",
      category: "映画実写",
      categoryKey: "movie_live",
      title,
      link: url,
      publishedAt: parseIcsDateToIso(releaseDate),
      description: "映画.com 公開スケジュール掲載の公開予定作品です。",
      source: MOVIE_SOURCE_CONFIG.eigaComingIcs.source
    };
  }).filter((item) => item.title && item.publishedAt);
}

function normalizeWhitespace(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function parseThrMovieItems(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const anchors = [...doc.querySelectorAll("article a, h2 a, h3 a")];
  const seen = new Set();
  const items = [];

  for (const anchor of anchors) {
    const title = normalizeWhitespace(anchor.textContent);
    const href = anchor.href || anchor.getAttribute("href") || "";
    if (!title || title.length < 8) continue;
    if (!href.startsWith("https://hollywoodreporter.jp/")) continue;
    if (/\/page\/\d+\/?$/.test(href)) continue;
    if (/\/tag\//.test(href)) continue;
    if (seen.has(href)) continue;

    const container = anchor.closest("article, li, section, div");
    const timeNode = container?.querySelector("time");
    const publishedAtRaw = timeNode?.getAttribute("datetime") || timeNode?.textContent || "";
    const publishedAt = publishedAtRaw ? new Date(publishedAtRaw).toISOString() : "";
    const description = normalizeWhitespace(container?.textContent || title).slice(0, 160) || title;

    seen.add(href);
    items.push({
      id: `movie-live-thr-${items.length}-${title}`,
      actor: "",
      category: "映画実写",
      categoryKey: "movie_live",
      title,
      link: href,
      publishedAt,
      description,
      source: MOVIE_SOURCE_CONFIG.thrMovies.source
    });
  }

  return items.filter((item) => item.publishedAt);
}

function parseJapaneseDateTime(text) {
  const value = normalizeWhitespace(text);
  const match = value.match(/(20\d{2})[年./-]\s*(\d{1,2})[月./-]\s*(\d{1,2})日?(?:[（(][^)）]+[)）])?\s*(\d{1,2})?:?(\d{2})?/);
  if (!match) return "";

  const [, year, month, day, hour = "09", minute = "00"] = match;
  return new Date(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute}:00+09:00`
  ).toISOString();
}

function parseDateToIso(raw) {
  const direct = new Date(raw);
  if (!Number.isNaN(direct.getTime())) return direct.toISOString();
  return parseJapaneseDateTime(raw);
}

function toAbsoluteUrl(href, baseUrl) {
  try {
    return new URL(href, baseUrl).href;
  } catch {
    return "";
  }
}

function buildAnimeSourceItem({ sourceKey, sourceLabel, title, link, publishedAt, description }) {
  return {
    id: `${sourceKey}-${link || title}`,
    actor: "",
    category: "アニメ",
    categoryKey: "anime",
    title,
    link,
    publishedAt,
    description: description || title,
    source: sourceLabel
  };
}

function parseAnimeHackItems(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const anchors = [...doc.querySelectorAll("a")];
  const seen = new Set();
  const items = [];

  for (const anchor of anchors) {
    const title = normalizeWhitespace(anchor.textContent);
    const link = toAbsoluteUrl(anchor.getAttribute("href") || "", ANIME_SOURCE_CONFIG.animeHack.url);
    if (!title || title.length < 8 || !link.startsWith("https://anime.eiga.com/news/")) continue;
    if (seen.has(link)) continue;

    const container = anchor.closest("li, article, div") || anchor.parentElement;
    const text = normalizeWhitespace(container?.textContent || title);
    const publishedAt = parseJapaneseDateTime(text);
    if (!publishedAt) continue;

    seen.add(link);
    items.push(buildAnimeSourceItem({
      sourceKey: "anime-hack",
      sourceLabel: ANIME_SOURCE_CONFIG.animeHack.source,
      title,
      link,
      publishedAt,
      description: text.replace(title, "").slice(0, 180)
    }));
  }

  return items;
}

function parseAnimeAnimeItems(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const anchors = [...doc.querySelectorAll("article a, li a")];
  const seen = new Set();
  const items = [];

  for (const anchor of anchors) {
    const text = normalizeWhitespace(anchor.textContent);
    const title = text.replace(/^ニュース\s+20\d{2}\.\d{1,2}\.\d{1,2}\([^)]*\)\s+\d{1,2}:\d{2}\s*/, "").trim();
    const link = toAbsoluteUrl(anchor.getAttribute("href") || "", ANIME_SOURCE_CONFIG.animeAnime.url);
    if (!title || title.length < 8 || !link.startsWith("https://animeanime.jp/article/")) continue;
    if (seen.has(link)) continue;

    const container = anchor.closest("article, li, div") || anchor.parentElement;
    const combined = normalizeWhitespace(container?.textContent || text);
    const publishedAt = parseJapaneseDateTime(combined);
    if (!publishedAt) continue;

    seen.add(link);
    items.push(buildAnimeSourceItem({
      sourceKey: "anime-anime",
      sourceLabel: ANIME_SOURCE_CONFIG.animeAnime.source,
      title,
      link,
      publishedAt,
      description: combined.replace(title, "").slice(0, 180)
    }));
  }

  return items;
}

function parseComicNatalieAnimeItems(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const anchors = [...doc.querySelectorAll("article a, li a, h2 a, h3 a")];
  const seen = new Set();
  const items = [];

  for (const anchor of anchors) {
    const title = normalizeWhitespace(anchor.textContent);
    const link = toAbsoluteUrl(anchor.getAttribute("href") || "", ANIME_SOURCE_CONFIG.comicNatalie.url);
    if (!title || title.length < 8 || !link.startsWith("https://natalie.mu/comic/news/")) continue;
    if (seen.has(link)) continue;

    const container = anchor.closest("article, li, div") || anchor.parentElement;
    const timeNode = container?.querySelector("time");
    const publishedAtRaw = timeNode?.getAttribute("datetime") || timeNode?.textContent || normalizeWhitespace(container?.textContent || "");
    const publishedAt = publishedAtRaw ? parseDateToIso(publishedAtRaw) : "";
    if (!publishedAt) continue;

    const description = normalizeWhitespace(container?.textContent || title).replace(title, "").slice(0, 180);
    seen.add(link);
    items.push(buildAnimeSourceItem({
      sourceKey: "comic-natalie-anime",
      sourceLabel: ANIME_SOURCE_CONFIG.comicNatalie.source,
      title,
      link,
      publishedAt,
      description
    }));
  }

  return items;
}

async function fetchAnimeSourceItems() {
  const results = await Promise.allSettled([
    fetchTextWithProxyFallback(ANIME_SOURCE_CONFIG.animeHack.url).then(parseAnimeHackItems),
    fetchTextWithProxyFallback(ANIME_SOURCE_CONFIG.animeAnime.url).then(parseAnimeAnimeItems),
    fetchTextWithProxyFallback(ANIME_SOURCE_CONFIG.comicNatalie.url).then(parseComicNatalieAnimeItems)
  ]);

  return results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value);
}

function buildRoboticsSourceItem({ sourceKey, sourceLabel, title, link, publishedAt, description }) {
  return {
    id: `${sourceKey}-${link || title}`,
    actor: "",
    category: "ロボティクス",
    categoryKey: "robotics",
    title,
    link,
    publishedAt,
    description: description || title,
    source: sourceLabel
  };
}

function parseRoboticsSourceItems(htmlText, sourceConfig, sourceKey) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const anchors = [...doc.querySelectorAll("article a, h2 a, h3 a, li a")];
  const seen = new Set();
  const items = [];

  for (const anchor of anchors) {
    const title = normalizeWhitespace(anchor.textContent);
    const link = toAbsoluteUrl(anchor.getAttribute("href") || "", sourceConfig.url);
    if (!title || title.length < 8 || !link.startsWith(sourceConfig.linkPrefix)) continue;
    if (seen.has(link)) continue;

    const container = anchor.closest("article, li, section, div") || anchor.parentElement;
    const text = normalizeWhitespace(container?.textContent || title);
    const timeNode = container?.querySelector("time");
    const publishedAtRaw = timeNode?.getAttribute("datetime") || timeNode?.textContent || text;
    const publishedAt = parseDateToIso(publishedAtRaw) || new Date().toISOString();

    seen.add(link);
    items.push(buildRoboticsSourceItem({
      sourceKey,
      sourceLabel: sourceConfig.source,
      title,
      link,
      publishedAt,
      description: text.replace(title, "").slice(0, 180)
    }));
  }

  return items;
}

async function fetchRoboticsRssItems(sourceConfig, sourceKey) {
  const meta = {
    key: sourceKey,
    actor: "",
    categoryKey: "robotics",
    categoryLabel: "ロボティクス"
  };

  try {
    const xml = await fetchRssXmlWithFallback(sourceConfig.feedUrl);
    return parseRssItems(xml, meta).map((item) => ({
      ...item,
      id: `${sourceKey}-${item.link || item.title}`,
      source: sourceConfig.source
    }));
  } catch {
    try {
      const items = await fetchRss2JsonItems(sourceConfig.feedUrl, meta);
      return items.map((item) => ({
        ...item,
        id: `${sourceKey}-${item.link || item.title}`,
        source: sourceConfig.source
      }));
    } catch {
      return [];
    }
  }
}

async function fetchRoboticsSingleSourceItems(sourceConfig, sourceKey) {
  const rssItems = await fetchRoboticsRssItems(sourceConfig, sourceKey);
  if (rssItems.length > 0) return rssItems;

  try {
    const html = await fetchTextWithProxyFallback(sourceConfig.url);
    return parseRoboticsSourceItems(html, sourceConfig, sourceKey);
  } catch {
    return [];
  }
}

async function fetchRoboticsSourceItems() {
  const results = await Promise.allSettled([
    fetchRoboticsSingleSourceItems(ROBOTICS_SOURCE_CONFIG.roboHub, "robohub"),
    fetchRoboticsSingleSourceItems(ROBOTICS_SOURCE_CONFIG.techCrunch, "techcrunch-robotics"),
    fetchRoboticsSingleSourceItems(ROBOTICS_SOURCE_CONFIG.nvidiaRobotics, "nvidia-robotics")
  ]);

  return results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value);
}

async function fetchMovieLiveSourceItems() {
  const [eigaResult, thrResult] = await Promise.allSettled([
    fetchTextWithProxyFallback(MOVIE_SOURCE_CONFIG.eigaComingIcs.url).then(parseEigaComingItems),
    fetchTextWithProxyFallback(MOVIE_SOURCE_CONFIG.thrMovies.url).then(parseThrMovieItems)
  ]);

  return [eigaResult, thrResult]
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value);
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => (new Date(b.publishedAt).getTime() || 0) - (new Date(a.publishedAt).getTime() || 0));
}

function balanceItemsBySource(items, limit) {
  const groups = new Map();
  for (const item of sortByDateDesc(items)) {
    const source = item.source || "unknown";
    if (!groups.has(source)) groups.set(source, []);
    groups.get(source).push(item);
  }

  const orderedSources = [...groups.keys()].sort((a, b) => {
    const aTime = new Date(groups.get(a)[0]?.publishedAt).getTime() || 0;
    const bTime = new Date(groups.get(b)[0]?.publishedAt).getTime() || 0;
    return bTime - aTime;
  });

  const balanced = [];
  while (balanced.length < limit && orderedSources.some((source) => groups.get(source).length > 0)) {
    for (const source of orderedSources) {
      const next = groups.get(source).shift();
      if (next) balanced.push(next);
      if (balanced.length >= limit) break;
    }
  }

  return balanced;
}

function canonicalTitleKey(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/【[^】]*】/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[「」『』]/g, " ")
    .replace(/[！!？?：:・,，。、.\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTopicToken(title) {
  const raw = String(title || "");
  const quoted = raw.match(/[「『【]([^」』】]{2,40})[」』】]/);
  if (quoted && quoted[1]) return quoted[1].trim().toLowerCase();

  const words = raw
    .replace(/[！!？?：:・,，。、.\-]/g, " ")
    .split(/\s+/)
    .map((v) => v.trim())
    .filter(Boolean)
    .filter((v) => /[\u3040-\u30ff\u3400-\u9fff]{2,}/.test(v));

  return words[0]?.toLowerCase() || "";
}

function dedupeLatestByContent(items) {
  const map = new Map();

  for (const item of items) {
    const titleKey = canonicalTitleKey(item.title);
    const topic = extractTopicToken(item.title);
    const fallback = item.link && item.link !== "#" ? item.link : item.id;
    const key = item.categoryKey === "movie_live"
      ? (titleKey || fallback)
      : (topic ? `${item.categoryKey}::${topic}` : (titleKey || fallback));
    if (!key) continue;

    const prev = map.get(key);
    if (!prev) {
      map.set(key, item);
      continue;
    }

    const prevTime = new Date(prev.publishedAt).getTime() || 0;
    const nextTime = new Date(item.publishedAt).getTime() || 0;
    if (nextTime >= prevTime) map.set(key, item);
  }

  return [...map.values()];
}

function deriveSubCategory(item) {
  if (item.categoryKey === "movie_live") return inferLiveActionType(item);
  if (item.categoryKey === "anime") return "TVアニメ";
  if (item.categoryKey === "voice") return "声優";
  if (item.categoryKey === "robotics") return inferRoboticsType(item);
  return item.category;
}

function inferTags(item) {
  const tags = [item.category, deriveSubCategory(item)];
  const title = `${item.title} ${item.description}`;

  if (item.actor) tags.push(item.actor);
  if (item.categoryKey === "voice") {
    if (/出演|登壇|発表/.test(title)) tags.push("出演");
    if (/ボイス|CV/.test(title)) tags.push("ボイス");
    return [...new Set(tags.filter(Boolean))].slice(0, 5);
  }

  if (item.categoryKey === "anime") {
    if (/映画|劇場版/.test(title)) tags.push("アニメ映画");
    if (/展示|コラボ/.test(title)) tags.push("イベント");
    if (!/映画|劇場版/.test(title)) tags.push("TVアニメ");
    if (/PV|特報|映像|ビジュアル/.test(title)) tags.push("PV");
    return [...new Set(tags.filter(Boolean))].slice(0, 5);
  }

  if (item.categoryKey === "movie_live") {
    tags.push(inferLiveActionType(item));
    if (/公開|解禁|上映/.test(title)) tags.push("公開日");
    if (/予告|特報|映像|ビジュアル/.test(title)) tags.push("映像");
    return [...new Set(tags.filter(Boolean))].slice(0, 5);
  }

  if (item.categoryKey === "robotics") {
    if (isHumanoidRoboticsArticle(item)) tags.push("ヒューマノイド");
    if (isPhysicalAiRoboticsArticle(item)) tags.push("Physical AI");
    if (isRoboticsDeploymentArticle(item)) tags.push("現場導入");
    return [...new Set(tags.filter(Boolean))].slice(0, 5);
  }

  return [...new Set(tags.filter(Boolean))].slice(0, 5);
}

function includesAny(text, keywords) {
  return keywords.some((word) => text.includes(String(word).toLowerCase()));
}

function roboticsText(item) {
  return [item.title, item.description, item.source].join(" ").toLowerCase();
}

function isHumanoidRoboticsArticle(item) {
  return includesAny(roboticsText(item), HUMANOID_ROBOTICS_KEYWORDS);
}

function isPhysicalAiRoboticsArticle(item) {
  return includesAny(roboticsText(item), PHYSICAL_AI_KEYWORDS);
}

function isRoboticsDeploymentArticle(item) {
  return includesAny(roboticsText(item), ROBOTICS_DEPLOYMENT_KEYWORDS);
}

function inferRoboticsType(item) {
  if (isHumanoidRoboticsArticle(item)) return "ヒューマノイド";
  if (isPhysicalAiRoboticsArticle(item)) return "Physical AI";
  if (isRoboticsDeploymentArticle(item)) return "現場導入";
  return "ロボティクス";
}

function isRoboticsArticleAllowed(item) {
  return includesAny(roboticsText(item), ROBOTICS_CORE_KEYWORDS) ||
    isHumanoidRoboticsArticle(item) ||
    isPhysicalAiRoboticsArticle(item) ||
    isRoboticsDeploymentArticle(item);
}

function isNationalChainEvent(item) {
  const text = [item.title, item.description, item.source].join(" ").toLowerCase();
  const hasInclude = includesAny(text, EVENT_CHAIN_INCLUDE_KEYWORDS);
  const hasRegionalExclude = includesAny(text, EVENT_REGION_EXCLUDE_KEYWORDS);
  return hasInclude && !hasRegionalExclude;
}

function isAnimeArticleAllowed(item) {
  const text = [item.title, item.description, item.source, item.actor].join(" ").toLowerCase();

  if (includesAny(text, ANIME_EXCLUDE_KEYWORDS)) return false;

  const hasAnimeSignal = /アニメ|劇場版|映画|放送|新作/.test(text);
  if (!hasAnimeSignal) return false;

  const hasPriority = includesAny(text, ANIME_PRIORITY_KEYWORDS);
  const hasActor = Boolean(item.actor && item.actor.trim());
  return hasPriority || hasActor;
}

function inferLiveActionType(item) {
  const text = [item.title, item.description, item.source].join(" ").toLowerCase();
  if (
    includesAny(text, JAPANESE_MOVIE_PRIORITY_PEOPLE) ||
    includesAny(text, JAPANESE_MOVIE_FAVORITE_TITLES) ||
    includesAny(text, JAPANESE_MOVIE_HINTS)
  ) return "邦画";
  if (
    includesAny(text, FOREIGN_MOVIE_PRIORITY_PEOPLE) ||
    includesAny(text, FOREIGN_MOVIE_FAVORITE_TITLES) ||
    includesAny(text, FOREIGN_MOVIE_HINTS)
  ) return "洋画";
  return /邦画|日本映画|日本版/.test(text) ? "邦画" : "洋画";
}

function isLiveActionArticleAllowed(item, options = {}) {
  const strict = options.strict !== false;
  const text = [item.title, item.description, item.source, item.actor].join(" ").toLowerCase();

  if (includesAny(text, LIVE_ACTION_EXCLUDE_KEYWORDS)) return false;

  const hasMovieSignal = /映画|実写|劇場|公開|主演|監督/.test(text);
  if (!hasMovieSignal) return false;

  const hasReleaseSignal = /公開予定|上映予定|公開|ロードショー|劇場公開|予告|新作|続編|公開日|特報|映像/.test(text);

  const hasPriorityGenre = includesAny(text, LIVE_ACTION_PRIORITY_KEYWORDS);
  const hasPriorityPerson =
    includesAny(text, JAPANESE_MOVIE_PRIORITY_PEOPLE) || includesAny(text, FOREIGN_MOVIE_PRIORITY_PEOPLE);
  const hasFavoriteTitle =
    includesAny(text, JAPANESE_MOVIE_FAVORITE_TITLES) || includesAny(text, FOREIGN_MOVIE_FAVORITE_TITLES);

  if (strict) {
    if (!hasReleaseSignal) return false;
    return hasPriorityGenre || hasPriorityPerson || hasFavoriteTitle || /邦画|洋画|実写/.test(text);
  }

  return (
    hasPriorityGenre ||
    hasPriorityPerson ||
    hasFavoriteTitle ||
    hasReleaseSignal ||
    /邦画|洋画|実写|日本映画|ハリウッド|海外映画/.test(text)
  );
}

function isSaved(link) {
  return state.savedMap.has(link);
}

function openArticleUrl(url) {
  if (!url || url === "#") return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function syncDialogSaveButton() {
  const item = state.currentDialogItem;
  if (!item || !ui.dialogSaveBtn) return;
  ui.dialogSaveBtn.textContent = isSaved(item.link) ? "保存解除" : "保存";
}

function openDialog(item) {
  if (!item || !ui.dialog || !ui.dialogTitle || !ui.dialogMeta || !ui.dialogDesc || !ui.dialogLink) {
    openArticleUrl(item?.link);
    return;
  }

  state.currentDialogItem = item;
  ui.dialogTitle.textContent = item.title;

  const metaParts = [];
  if (item.actor) metaParts.push(item.actor);
  metaParts.push(item.category, item.source, formatDate(item.publishedAt));
  ui.dialogMeta.textContent = metaParts.join(" / ");
  ui.dialogDesc.textContent = buildSummary(item.title, item.description);
  ui.dialogLink.href = item.link || "#";
  syncDialogSaveButton();

  if (typeof ui.dialog.showModal === "function") {
    ui.dialog.showModal();
  } else {
    openArticleUrl(item.link);
  }
}

function updateCollectorPanel() {
  ui.collectorEnabledText.textContent = state.autoCollectEnabled ? "ON" : "OFF";
  ui.collectorStatusText.textContent = state.collectorStatus;
  ui.collectorLastText.textContent = state.collectorLastAt;
  ui.collectorCountText.textContent = `${state.collectorCount}件`;
}

function updateDashboardStats() {
  ui.trackedCount.textContent = String(state.favorites.length);
  ui.collectedCount.textContent = String(state.collectedItems.length);
  ui.savedCount.textContent = String(state.savedMap.size);
  ui.visibleCount.textContent = String(state.filteredItems.length);
  ui.currentTagLabel.textContent = `現在: ${tagLabel(state.activeTag)} / 検索: ${state.searchText || "なし"}`;
}

function renderLogs() {
  ui.logs.innerHTML = "";
  for (const log of state.collectionLogs.slice(0, 8)) {
    const li = document.createElement("li");
    li.textContent = `・${log}`;
    ui.logs.appendChild(li);
  }
}

function renderSourceFeeds() {
  ui.sourceFeedChips.innerHTML = "";
  for (const name of CONFIG.sourceFeeds) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip${state.sourceFeedMap[name] ? " active" : ""}`;
    btn.textContent = name;
    btn.dataset.feed = name;
    ui.sourceFeedChips.appendChild(btn);
  }
}

function utilityFilterTags() {
  const isAnimeContext =
    state.selectedMainTag === "anime_group" ||
    state.selectedCategoryTag === "anime" ||
    state.activeTag === "anime";
  const isRoboticsContext =
    state.selectedMainTag === "robotics" ||
    state.activeTag === "robotics";

  if (isAnimeContext) {
    return [...ANIME_FILTER_TAGS];
  }

  if (isRoboticsContext) {
    return [...ROBOTICS_FILTER_TAGS];
  }

  return [...BASE_FILTER_TAGS];
}

function syncSelectedFilterTagToContext() {
  const availableTags = utilityFilterTags();
  if (state.selectedFilterTag && !availableTags.includes(state.selectedFilterTag)) {
    state.selectedFilterTag = "";
  }
}

function resetViewForCategorySwitch() {
  state.selectedFilterTag = "";
  state.searchText = "";
  ui.searchInput.value = "";
}

function matchesSpecialFilter(item, filterTag) {
  const text = [item.title, item.description, item.category, item.actor, item.source]
    .join(" ")
    .toLowerCase();

  if (filterTag === "TVアニメ") {
    return /アニメ/.test(text) && !/映画|劇場版/.test(text);
  }
  if (filterTag === "アニメ映画") {
    return /映画|劇場版/.test(text);
  }
  if (filterTag === "配信") {
    return /配信|ストリーミング|見放題|vod/.test(text);
  }
  if (filterTag === "イベント") {
    // ユーザー要望: 全国チェーンとのコラボ/展示のみ
    return isNationalChainEvent(item);
  }
  if (filterTag === "邦画") {
    return inferLiveActionType(item) === "邦画";
  }
  if (filterTag === "洋画") {
    return inferLiveActionType(item) === "洋画";
  }
  if (filterTag === "ヒューマノイド") {
    return isHumanoidRoboticsArticle(item);
  }
  if (filterTag === "Physical AI") {
    return isPhysicalAiRoboticsArticle(item);
  }
  if (filterTag === "現場導入") {
    return isRoboticsDeploymentArticle(item);
  }
  return null;
}

function renderMainTagChips() {
  ui.mainTagChips.innerHTML = "";
  for (const tag of CONFIG.mainTags) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip${state.selectedMainTag === tag.key ? " active" : ""}`;
    btn.textContent = `#${tag.label}`;
    btn.dataset.mainTag = tag.key;
    ui.mainTagChips.appendChild(btn);
  }
}

function renderCategoryTagChips() {
  ui.categoryTagChips.innerHTML = "";
  for (const tag of CONFIG.categoryTags) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip${state.selectedCategoryTag === tag.key ? " active" : ""}`;
    btn.textContent = `#${tag.label}`;
    btn.dataset.categoryTag = tag.key;
    ui.categoryTagChips.appendChild(btn);
  }
}

function renderFilterTagChips() {
  ui.filterTagChips.innerHTML = "";
  for (const tag of utilityFilterTags()) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip${state.selectedFilterTag === tag ? " active" : ""}`;
    btn.dataset.filterTag = tag;

    const label = document.createElement("span");
    label.textContent = `#${tag}`;
    btn.appendChild(label);

    const isFixedCategoryTag = ANIME_FILTER_TAGS.includes(tag) || ROBOTICS_FILTER_TAGS.includes(tag);
    if (isFixedCategoryTag) {
      const count = countMatchedByFilterTag(tag);
      const badge = document.createElement("span");
      badge.className = "chip-count";
      badge.textContent = String(count);
      btn.appendChild(badge);
    }

    ui.filterTagChips.appendChild(btn);
  }
}

function countMatchedByFilterTag(filterTag) {
  const q = state.searchText.trim().toLowerCase();
  const pool = sortByDateDesc(dedupeLatestByContent([...state.collectedItems, ...state.items]))
    .filter((item) => isWithinLookbackRange(item.publishedAt));

  let counted = pool.filter((item) => {
    if (state.savedOnly && !isSaved(item.link)) return false;

    if (q) {
      const area = [item.title, item.description, item.source, item.category, item.actor].join(" ").toLowerCase();
      if (!area.includes(q)) return false;
    }

    const special = matchesSpecialFilter(item, filterTag);
    if (typeof special === "boolean" && !special) return false;
    if (typeof special !== "boolean") {
      const area = [item.title, item.description, item.category, item.actor, ...inferTags(item)].join(" ").toLowerCase();
      if (!area.includes(filterTag.toLowerCase())) return false;
    }

    const isAnimeContext =
      state.selectedMainTag === "anime_group" ||
      state.selectedCategoryTag === "anime" ||
      state.activeTag === "anime";
    const isMovieContext =
      state.selectedMainTag === "movie_live" ||
      state.selectedCategoryTag === "movie_live" ||
      state.activeTag === "movie_live";
    const isRoboticsContext =
      state.selectedMainTag === "robotics" ||
      state.activeTag === "robotics";

    if (isAnimeContext) {
      if (filterTag === "イベント") return isNationalChainEvent(item);
      if (filterTag === "アニメ映画") {
        return /映画|劇場版/.test([item.title, item.description].join(" ").toLowerCase()) && isAnimeArticleAllowed(item);
      }
      if (filterTag === "TVアニメ") {
        return !/映画|劇場版/.test([item.title, item.description].join(" ").toLowerCase()) && isAnimeArticleAllowed(item);
      }
      return isAnimeArticleAllowed(item);
    }

    if (isMovieContext) {
      if (filterTag === "邦画") return inferLiveActionType(item) === "邦画" && isLiveActionArticleAllowed(item);
      if (filterTag === "洋画") return inferLiveActionType(item) === "洋画" && isLiveActionArticleAllowed(item);
      return isLiveActionArticleAllowed(item);
    }

    if (isRoboticsContext) {
      if (ROBOTICS_FILTER_TAGS.includes(filterTag)) return matchesSpecialFilter(item, filterTag);
      return isRoboticsArticleAllowed(item);
    }

    return true;
  });

  const meaningful = counted.filter((item) => isMeaningfulArticle(item));
  counted = meaningful.length > 0 ? meaningful : counted;

  return counted.length;
}

function renderActorChips() {
  ui.actorChips.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (const actor of state.favorites) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip actor-chip${state.selectedActor === actor ? " active" : ""}`;
    chip.dataset.actor = actor;

    const name = document.createElement("span");
    name.textContent = actor;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "actor-remove";
    remove.dataset.removeActor = actor;
    remove.textContent = "×";

    chip.append(name, remove);
    fragment.appendChild(chip);
  }

  ui.actorChips.appendChild(fragment);
}

function renderList(items, emptyMessage = "該当ニュースがありません。タグや検索条件を変えてください。") {
  ui.list.innerHTML = "";

  if (!items.length) {
    ui.list.innerHTML = `<li class="news-item"><div class="news-body">${emptyMessage}</div></li>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "news-item";

    const body = document.createElement("div");
    body.className = "news-body";

    const top = document.createElement("div");
    top.className = "news-item-top";

    const leftTop = document.createElement("div");
    leftTop.style.display = "flex";
    leftTop.style.gap = "6px";
    leftTop.style.alignItems = "center";
    leftTop.style.flexWrap = "wrap";

    const badge = document.createElement("span");
    badge.className = "category-badge";
    badge.textContent = item.actor ? `${item.actor} / ${item.category}` : item.category;

    const sub = document.createElement("span");
    sub.className = "subcat-badge";
    sub.textContent = deriveSubCategory(item);

    leftTop.append(badge, sub);

    const date = document.createElement("span");
    date.className = "meta";
    date.textContent = formatDate(item.publishedAt);

    top.append(leftTop, date);

    const title = document.createElement("h3");
    title.className = "news-title";
    title.textContent = item.title;

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `${item.source} / ${tagLabel(item.categoryKey)}`;

    const tagsRow = document.createElement("div");
    tagsRow.className = "tags-row";
    for (const tag of inferTags(item)) {
      const pill = document.createElement("span");
      pill.className = "tag-pill";
      pill.textContent = `#${tag}`;
      tagsRow.appendChild(pill);
    }

    const actions = document.createElement("div");
    actions.className = "actions-row";

    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.className = "action-btn";
    openBtn.dataset.action = "open-link";
    openBtn.dataset.index = String(index);
    openBtn.textContent = "元記事";

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = `save-btn${isSaved(item.link) ? " saved" : ""}`;
    saveBtn.dataset.action = "save";
    saveBtn.dataset.index = String(index);
    saveBtn.textContent = isSaved(item.link) ? "保存済み" : "保存";

    actions.append(openBtn, saveBtn);

    body.append(top, title, meta, tagsRow, actions);
    const summaryText = buildSummary(item.title, item.description);
    if (summaryText === NO_SUMMARY_MESSAGE) {
      openBtn.classList.add("primary");
      openBtn.textContent = "元記事を開く";
    }

    li.appendChild(body);
    fragment.appendChild(li);
  });

  ui.list.appendChild(fragment);
}

function applyFilterAndRender() {
  const q = state.searchText.trim().toLowerCase();

  let target = dedupeLatestByContent([...state.collectedItems, ...state.items]);
  target = sortByDateDesc(target);
  target = target.filter((item) => isWithinLookbackRange(item.publishedAt));

  if (state.savedOnly) target = target.filter((item) => isSaved(item.link));

  if (state.selectedFilterTag) {
    target = target.filter((item) => {
      const special = matchesSpecialFilter(item, state.selectedFilterTag);
      if (typeof special === "boolean") return special;
      const area = [item.title, item.description, item.category, item.actor, ...inferTags(item)].join(" ").toLowerCase();
      return area.includes(state.selectedFilterTag.toLowerCase());
    });
  }

  if (q) {
    target = target.filter((item) => {
      const area = [item.title, item.description, item.source, item.category, item.actor].join(" ").toLowerCase();
      return area.includes(q);
    });
  }

  // アニメ系ルール: 優先/除外ジャンルと出演情報を反映
  const isAnimeContext =
    state.selectedMainTag === "anime_group" ||
    state.selectedCategoryTag === "anime" ||
    state.activeTag === "anime";
  const isMovieContext =
    state.selectedMainTag === "movie_live" ||
    state.selectedCategoryTag === "movie_live" ||
    state.activeTag === "movie_live";
  const isRoboticsContext =
    state.selectedMainTag === "robotics" ||
    state.activeTag === "robotics";

  if (isAnimeContext) {
    target = target.filter((item) => {
      if (state.selectedFilterTag === "イベント") {
        return isNationalChainEvent(item);
      }
      if (state.selectedFilterTag === "アニメ映画") {
        return /映画|劇場版/.test([item.title, item.description].join(" ").toLowerCase()) && isAnimeArticleAllowed(item);
      }
      if (state.selectedFilterTag === "TVアニメ") {
        return !/映画|劇場版/.test([item.title, item.description].join(" ").toLowerCase()) && isAnimeArticleAllowed(item);
      }
      return isAnimeArticleAllowed(item);
    });
  }

  if (isMovieContext) {
    const strictMovieItems = target.filter((item) => {
      if (state.selectedFilterTag === "邦画") {
        return inferLiveActionType(item) === "邦画" && isLiveActionArticleAllowed(item);
      }
      if (state.selectedFilterTag === "洋画") {
        return inferLiveActionType(item) === "洋画" && isLiveActionArticleAllowed(item);
      }
      return isLiveActionArticleAllowed(item);
    });

    // 件数が少なすぎる時は、公開予定まわりの条件を少し緩めて実用件数を優先する
    if (strictMovieItems.length >= 5) {
      target = strictMovieItems;
    } else {
      target = target.filter((item) => {
        if (state.selectedFilterTag === "邦画") {
          return inferLiveActionType(item) === "邦画" && isLiveActionArticleAllowed(item, { strict: false });
        }
        if (state.selectedFilterTag === "洋画") {
          return inferLiveActionType(item) === "洋画" && isLiveActionArticleAllowed(item, { strict: false });
        }
        return isLiveActionArticleAllowed(item, { strict: false });
      });
    }
  }

  if (isRoboticsContext) {
    target = target.filter((item) => {
      if (state.selectedFilterTag && ROBOTICS_FILTER_TAGS.includes(state.selectedFilterTag)) {
        return matchesSpecialFilter(item, state.selectedFilterTag);
      }
      return isRoboticsArticleAllowed(item);
    });
  }

  const meaningful = target.filter((item) => isMeaningfulArticle(item));
  target = isMovieContext ? target : (meaningful.length > 0 ? meaningful : target);

  state.filteredItems = target;
  const emptyMessage = state.selectedFilterTag === "イベント"
    ? "イベント条件に合う記事がありません。全国チェーンのコラボ/展示ニュース時に表示されます。"
    : isRoboticsContext
      ? "ロボティクス条件に合う記事がありません。指定3サイトの90日以内の記事が入ると表示されます。"
    : state.selectedFilterTag === "邦画"
      ? "邦画条件に合う記事がありません。優先俳優や優先ジャンルの記事が入ると表示されます。"
      : state.selectedFilterTag === "洋画"
        ? "洋画条件に合う記事がありません。優先俳優・監督や優先ジャンルの記事が入ると表示されます。"
        : "該当ニュースがありません。タグや検索条件を変えてください。";
  renderList(target, emptyMessage);
  renderFilterTagChips();
  updateDashboardStats();
}

function syncActiveTagFromSelection() {
  if (state.selectedCategoryTag) {
    state.activeTag = state.selectedCategoryTag;
    return;
  }
  state.activeTag = state.selectedMainTag;
}

function isVoiceMode() {
  return ["voice", "anime_group", "all"].includes(state.activeTag);
}

function fetchVoiceItemsForActor(actor) {
  const name = String(actor || "").trim();
  if (!name) return Promise.resolve([]);

  return fetchNewsByQueries(buildVoiceQueries(name), {
    key: `voice-${name}`,
    actor: name,
    categoryKey: "voice",
    categoryLabel: "声優"
  });
}

async function fetchAllFavoriteVoiceItems() {
  const results = await Promise.allSettled(state.favorites.map((actor) => fetchVoiceItemsForActor(actor)));
  return results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value);
}

async function fetchTagItems(tagKey) {
  if (tagKey === "voice") {
    return fetchVoiceItemsForActor(state.selectedActor);
  }

  if (tagKey === "anime") {
    const directItems = await fetchAnimeSourceItems();
    if (directItems.length > 0) return directItems;
  }

  if (tagKey === "robotics") {
    const directItems = await fetchRoboticsSourceItems();
    if (directItems.length > 0) return directItems;

    try {
      return await fetchNewsByQueries(buildRoboticsSourceQueries(), {
        key: "robotics-source-fallback",
        actor: "",
        categoryKey: "robotics",
        categoryLabel: tagLabel(tagKey)
      }, { collectAll: true });
    } catch {
      return [];
    }
  }

  if (tagKey === "anime_group") {
    const groups = await Promise.allSettled([fetchAllFavoriteVoiceItems(), fetchTagItems("anime")]);
    return groups.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
  }

  if (tagKey === "movie_live") {
    const directItems = await fetchMovieLiveSourceItems();
    if (directItems.length > 0) return directItems;

    const groups = buildMovieLiveQueryGroups();
    const [japaneseResult, foreignResult] = await Promise.allSettled([
      fetchNewsByQueries(groups.japanese, {
        key: "movie-live-japanese",
        actor: "",
        categoryKey: "movie_live",
        categoryLabel: tagLabel(tagKey)
      }, { collectAll: true }),
      fetchNewsByQueries(groups.foreign, {
        key: "movie-live-foreign",
        actor: "",
        categoryKey: "movie_live",
        categoryLabel: tagLabel(tagKey)
      }, { collectAll: true })
    ]);

    return [japaneseResult, foreignResult]
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value);
  }

  const queries = buildTopicQueries(tagKey);
  return fetchNewsByQueries(queries, {
    key: tagKey,
    actor: "",
    categoryKey: tagKey,
    categoryLabel: tagLabel(tagKey)
  }, {
    // 実写映画は邦画/洋画の両方を混ぜて取りたいので全クエリを合算する
    collectAll: tagKey === "movie_live"
  });
}

async function fetchCurrentTagNews() {
  if (state.activeTag === "all") {
    return fetchAllFavoriteVoiceItems();
  }

  return fetchTagItems(state.activeTag);
}

async function loadNewsForCurrentSelection() {
  syncActiveTagFromSelection();

  if (state.activeTag === "voice" && !state.selectedActor) {
    state.items = [];
    applyFilterAndRender();
    setStatus("お気に入り声優を追加してください。");
    return;
  }

  ui.refreshBtn.disabled = true;
  const requestTag = state.activeTag;
  const actor = requestTag === "voice"
    ? state.selectedActor
    : requestTag === "all" || requestTag === "anime_group"
      ? state.favorites.join("|")
      : "";
  const label = tagLabel(requestTag);
  const requestSeq = ++state.loadRequestSeq;

  const cachedItems = readCachedNews(requestTag, actor);
  if (cachedItems.length > 0) {
    state.items = cachedItems;
    applyFilterAndRender();
    setStatus(`${label}の前回データを表示中。最新ニュースを更新しています...`);
  } else {
    // 前カテゴリの記事が一瞬残らないよう、取得開始時に一覧を空へ切り替える
    state.items = [];
    state.filteredItems = [];
    renderList([], `${label}ニュースを取得中...`);
    updateDashboardStats();
    setStatus(`${label}ニュースを取得中...`);
  }

  try {
    const fetched = await fetchCurrentTagNews();
    if (requestSeq !== state.loadRequestSeq || requestTag !== state.activeTag || (requestTag === "voice" && actor !== state.selectedActor)) {
      return;
    }

    const itemLimit = requestTag === "movie_live"
      ? CONFIG.movieLiveMaxItems
      : requestTag === "robotics"
        ? CONFIG.roboticsMaxItems
        : CONFIG.maxItems;
    const candidates = sortByDateDesc(dedupeLatestByContent(fetched))
      .filter((item) => isWithinLookbackRange(item.publishedAt));
    const normalized = requestTag === "robotics"
      ? balanceItemsBySource(candidates, itemLimit)
      : candidates.slice(0, itemLimit);
    state.items = normalized;
    writeCachedNews(requestTag, actor, normalized);
    applyFilterAndRender();
    setStatus(`${label}ニュースを ${state.filteredItems.length} 件表示中`);
  } catch (error) {
    console.error(error);
    if (requestSeq !== state.loadRequestSeq || requestTag !== state.activeTag || (requestTag === "voice" && actor !== state.selectedActor)) {
      return;
    }

    if (cachedItems.length > 0) {
      setStatus("最新取得に失敗しました。前回データを表示しています。", true);
    } else {
      state.items = [];
      applyFilterAndRender();
      setStatus("ニュース取得に失敗しました。時間をおいて更新してください。", true);
    }
  } finally {
    if (requestSeq === state.loadRequestSeq) {
      ui.refreshBtn.disabled = false;
    }
  }
}

function addActorFromInput() {
  const actor = ui.actorInput.value.trim();
  if (!actor) return;

  if (!state.favorites.includes(actor)) state.favorites.push(actor);
  state.favorites = normalizeFavorites(state.favorites);
  saveJSON(STORAGE_KEYS.actors, state.favorites);
  state.selectedActor = actor;
  ui.actorInput.value = "";

  renderActorChips();
  renderFilterTagChips();

  if (isVoiceMode()) loadNewsForCurrentSelection();
}

function removeActor(actor) {
  state.favorites = state.favorites.filter((name) => name !== actor);
  if (state.favorites.length === 0) state.favorites = [...PRIORITY_ACTORS];
  saveJSON(STORAGE_KEYS.actors, state.favorites);

  if (state.selectedActor === actor) state.selectedActor = state.favorites[0] || "";
  if (state.selectedFilterTag === actor) state.selectedFilterTag = "";

  renderActorChips();
  renderFilterTagChips();
  if (isVoiceMode()) loadNewsForCurrentSelection();
}

function toggleSaveArticle(item) {
  if (!item?.link || item.link === "#") return;

  if (state.savedMap.has(item.link)) {
    state.savedMap.delete(item.link);
  } else {
    state.savedMap.set(item.link, {
      actor: item.actor,
      category: item.category,
      title: item.title,
      link: item.link,
      publishedAt: item.publishedAt,
      description: item.description,
      source: item.source
    });
  }

  persistSavedMap();
  syncDialogSaveButton();
  applyFilterAndRender();
}

function appendLog(message) {
  state.collectionLogs = [message, ...state.collectionLogs].slice(0, 12);
  renderLogs();
}

function runMockCollection() {
  if (!state.autoCollectEnabled) {
    state.collectorStatus = "停止中";
    appendLog("自動収集がOFFのため実行できません");
    updateCollectorPanel();
    return;
  }

  state.collectorStatus = "収集中";
  updateCollectorPanel();
  appendLog(`収集開始: ${Object.keys(state.sourceFeedMap).filter((k) => state.sourceFeedMap[k]).join(" / ") || "対象なし"}`);

  window.setTimeout(() => {
    const now = new Date();
    const actor = state.selectedActor || "注目声優";
    const dateIso = now.toISOString();
    const label = tagLabel(state.activeTag);

    const mock = [
      {
        id: `mock-${Date.now()}-1`,
        actor: state.activeTag === "voice" ? actor : "",
        category: label,
        categoryKey: state.activeTag,
        title: `${actor}関連の新着トピックを自動収集`,
        link: "https://example.com/mock-1",
        publishedAt: dateIso,
        description: "自動収集テストで追加したモックニュースです。実運用ではRSS取得結果に置き換わります。",
        source: "自動収集テスト"
      },
      {
        id: `mock-${Date.now()}-2`,
        actor: "",
        category: label,
        categoryKey: state.activeTag,
        title: `${label}カテゴリの補助ニュース`,
        link: "https://example.com/mock-2",
        publishedAt: new Date(now.getTime() - 1000 * 60).toISOString(),
        description: "表示テスト用の補助ニュースです。",
        source: "自動収集テスト"
      }
    ];

    state.collectedItems = [...mock, ...state.collectedItems].slice(0, 20);
    state.collectorCount += mock.length;
    state.collectorStatus = "収集完了";
    state.collectorLastAt = new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(now);

    appendLog(`収集完了: ${mock.length}件追加`);
    updateCollectorPanel();
    applyFilterAndRender();
  }, 650);
}

ui.addActorBtn.addEventListener("click", addActorFromInput);
ui.actorInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addActorFromInput();
});

ui.actorChips.addEventListener("click", (event) => {
  const remove = event.target.closest("button[data-remove-actor]");
  if (remove) {
    removeActor(remove.dataset.removeActor);
    return;
  }

  const actorBtn = event.target.closest("button[data-actor]");
  if (!actorBtn) return;
  const actor = actorBtn.dataset.actor;
  if (!actor || actor === state.selectedActor) return;

  state.selectedActor = actor;
  renderActorChips();
  if (isVoiceMode()) loadNewsForCurrentSelection();
});

ui.mainTagChips.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-main-tag]");
  if (!btn) return;
  state.selectedMainTag = btn.dataset.mainTag;
  state.selectedCategoryTag = "";
  resetViewForCategorySwitch();
  syncSelectedFilterTagToContext();
  saveTagSelection();
  renderMainTagChips();
  renderCategoryTagChips();
  renderFilterTagChips();
  loadNewsForCurrentSelection();
});

ui.categoryTagChips.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-category-tag]");
  if (!btn) return;

  const key = btn.dataset.categoryTag;
  state.selectedCategoryTag = state.selectedCategoryTag === key ? "" : key;
  resetViewForCategorySwitch();
  syncSelectedFilterTagToContext();
  saveTagSelection();
  renderCategoryTagChips();
  renderFilterTagChips();
  loadNewsForCurrentSelection();
});

ui.filterTagChips.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-filter-tag]");
  if (!btn) return;

  const tag = btn.dataset.filterTag;
  state.selectedFilterTag = state.selectedFilterTag === tag ? "" : tag;
  saveTagSelection();
  renderFilterTagChips();
  applyFilterAndRender();
});

ui.sourceFeedChips.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-feed]");
  if (!btn) return;

  const name = btn.dataset.feed;
  state.sourceFeedMap[name] = !state.sourceFeedMap[name];
  renderSourceFeeds();
});

ui.toggleAutoCollectBtn.addEventListener("click", () => {
  state.autoCollectEnabled = !state.autoCollectEnabled;
  ui.toggleAutoCollectBtn.textContent = state.autoCollectEnabled ? "停止" : "開始";
  state.collectorStatus = state.autoCollectEnabled ? "待機中" : "停止中";
  updateCollectorPanel();
  appendLog(`自動収集を${state.autoCollectEnabled ? "ON" : "OFF"}に変更`);
});

ui.runMockCollectBtn.addEventListener("click", runMockCollection);

ui.searchInput.addEventListener("input", (event) => {
  state.searchText = event.target.value;
  applyFilterAndRender();
});

ui.savedOnlyBtn.addEventListener("click", () => {
  state.savedOnly = !state.savedOnly;
  ui.savedOnlyBtn.textContent = `保存のみ: ${state.savedOnly ? "ON" : "OFF"}`;
  applyFilterAndRender();
});

ui.refreshBtn.addEventListener("click", loadNewsForCurrentSelection);

ui.list.addEventListener("click", (event) => {
  const actionBtn = event.target.closest("button[data-action]");
  if (!actionBtn) return;

  const index = Number(actionBtn.dataset.index);
  const item = state.filteredItems[index];
  if (!item) return;

  const action = actionBtn.dataset.action;
  if (action === "save") {
    toggleSaveArticle(item);
    return;
  }

  if (action === "open-link") {
    openArticleUrl(item.link);
    return;
  }

});

if (ui.dialogSaveBtn) {
  ui.dialogSaveBtn.addEventListener("click", () => {
    if (state.currentDialogItem) toggleSaveArticle(state.currentDialogItem);
  });
}

if (ui.closeDialogBtn) {
  ui.closeDialogBtn.addEventListener("click", () => {
    if (ui.dialog && typeof ui.dialog.close === "function") ui.dialog.close();
  });
}

function initialize() {
  if (state.favorites.length > 0) state.selectedActor = state.favorites[0];
  saveJSON(STORAGE_KEYS.actors, state.favorites);
  syncSelectedFilterTagToContext();
  saveTagSelection();

  renderMainTagChips();
  renderCategoryTagChips();
  renderFilterTagChips();
  renderActorChips();
  renderSourceFeeds();
  renderLogs();
  updateCollectorPanel();
  updateDashboardStats();
  loadNewsForCurrentSelection();
}

initialize();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
      console.log("Service Worker registered");
    } catch (err) {
      console.warn("Service Worker registration failed", err);
    }
  });
}
