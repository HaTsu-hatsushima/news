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

const VOICE_SOURCE_FEED = "声優ニュース";
const PRIORITY_ACTORS = ["花澤香菜", "早見沙織", "悠木碧", "水瀬いのり", "松井恵理子", "大塚明夫"];
const BASE_FILTER_TAGS = ["新着", "公開日", "PV", "配信", "特典", "ボイス"];
const ANIME_FILTER_TAGS = ["すべて", "新作TV", "アニメ映画", "放送・制作"];
const VOICE_FILTER_TAGS = ["すべて", "アニメ出演", "ゲーム出演", "イベント"];
const LIVE_ACTION_FILTER_TAGS = ["すべて", "新作映画", "公開日", "出演", "監督", "その他"];
const ROBOTICS_FILTER_TAGS = ["すべて", "ヒューマノイド", "現場導入", "新製品", "家庭用", "日本企業", "海外企業", "その他"];
const FOODTECH_FILTER_TAGS = ["すべて", "代替肉・培養肉", "昆虫食", "農業テック", "植物工場", "新素材", "植物ワクチン", "その他"];
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
  "スタジオジブリ",
  "宮崎駿",
  "鈴木敏夫",
  "プリキュア",
  "しまじろう",
  "アンパンマン",
  "ドラえもん",
  "クレヨンしんちゃん",
  "ちびまる子ちゃん",
  "ポケットモンスター",
  "ポケモン",
  "子供向け",
  "こども向け",
  "キッズ",
  "幼児",
  "未就学児",
  "ファミリー向け",
  "幼馴染とはラブコメにならない",
  "ラブコメ",
  "コラボ",
  "カフェ",
  "ココス",
  "くじ",
  "グッズ",
  "フィギュア",
  "プラモデル",
  "イヤーアクセ",
  "キャンペーン",
  "フェア",
  "展示",
  "ランキング",
  "アンケート",
  "コラム",
  "考察",
  "行ってみた",
  "写真・画像",
  "新商品",
  "くりーむパン",
  "食品",
  "ブラウザゲーム",
  "スマホゲーム",
  "アプリゲーム",
  "正式サービス開始"
];

const ANIME_TV_NEWS_KEYWORDS = [
  "tvアニメ",
  "テレビアニメ",
  "アニメ化",
  "放送開始",
  "放送決定",
  "放送日",
  "放送時期",
  "放送予定",
  "オンエア",
  "キャスト発表",
  "メインキャスト",
  "追加キャスト",
  "スタッフ発表",
  "制作決定",
  "制作中",
  "制作は",
  "アニメ制作",
  "キービジュアル",
  "メインビジュアル",
  "pv公開",
  "新pv",
  "ティザー",
  "第2期",
  "season",
  "新シリーズ",
  "続編"
];

const ANIME_MOVIE_NEWS_KEYWORDS = [
  "劇場アニメ",
  "劇場版",
  "映画",
  "上映",
  "公開日",
  "公開決定",
  "公開予定",
  "ロードショー"
];

const ANIME_PRODUCTION_NEWS_KEYWORDS = [
  "制作決定",
  "制作中",
  "制作は",
  "アニメ制作",
  "スタッフ発表",
  "キャスト発表",
  "メインキャスト",
  "追加キャスト",
  "キービジュアル",
  "メインビジュアル",
  "pv公開",
  "新pv",
  "特報",
  "ティザー"
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

const VOICE_EXCLUDE_KEYWORDS = [
  "結婚",
  "離婚",
  "妊娠",
  "出産",
  "熱愛",
  "不倫",
  "炎上",
  "謝罪",
  "降板",
  "体調不良",
  "活動休止",
  "移籍",
  "退所",
  "訃報"
];

const LIVE_ACTION_PRIORITY_KEYWORDS = [
  "新作映画",
  "最新作",
  "映画化",
  "実写映画",
  "公開予定",
  "公開日",
  "上映予定",
  "上映開始",
  "劇場公開",
  "主演",
  "出演",
  "監督"
];

const LIVE_ACTION_EXCLUDE_KEYWORDS = [
  "子供向け",
  "キッズ",
  "ファミリー向け",
  "韓国",
  "韓流",
  "韓国映画",
  "韓国発",
  "k-movie",
  "ランキング",
  "総まとめ",
  "興行収入",
  "オープニング",
  "離婚",
  "予告",
  "特報",
  "イベント",
  "展示",
  "展示会",
  "舞台挨拶",
  "試写会",
  "キャンペーン",
  "完成披露",
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
  "スティーヴン・スピルバーグ",
  "steven spielberg",
  "ジョージ・ルーカス",
  "george lucas",
  "トム・クルーズ",
  "tom cruise",
  "キアヌ・リーヴス",
  "keanu reeves"
];

const LIVE_ACTION_APPEARANCE_PRIORITY_PEOPLE = [
  "玉木宏",
  "藤原竜也",
  "佐藤健",
  "トム・クルーズ",
  "tom cruise",
  "キアヌ・リーヴス",
  "keanu reeves"
];

const LIVE_ACTION_DIRECTOR_PRIORITY_PEOPLE = [
  "クリストファー・ノーラン",
  "christopher nolan",
  "スティーヴン・スピルバーグ",
  "steven spielberg",
  "ジョージ・ルーカス",
  "george lucas"
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

const ROBOTICS_PRODUCT_KEYWORDS = [
  "new robot",
  "new model",
  "new product",
  "launch",
  "launched",
  "unveil",
  "unveiled",
  "introduce",
  "introduced",
  "debut",
  "発表",
  "公開",
  "投入",
  "発売",
  "新製品",
  "新型",
  "新モデル",
  "新ロボット",
  "新機種",
  "お披露目"
];

const ROBOTICS_HOME_KEYWORDS = [
  "home robot",
  "household robot",
  "domestic robot",
  "personal robot",
  "consumer robot",
  "assistive robot",
  "家庭用ロボット",
  "ホームロボット",
  "家事ロボット",
  "見守りロボット",
  "個人向けロボット",
  "家庭向けロボット",
  "lovot",
  "ballie",
  "neo"
];

const ROBOTICS_JAPAN_COMPANY_KEYWORDS = [
  "川崎重工",
  "kawasaki heavy industries",
  "ファナック",
  "fanuc",
  "安川電機",
  "yaskawa",
  "mujin",
  "ムジン",
  "ラピュタロボティクス",
  "rapyuta robotics",
  "ユカイ工学",
  "yukai engineering",
  "groove x",
  "groovex",
  "lovot",
  "ugo",
  "u-go",
  "preferred robotics",
  "ソニー",
  "sony"
];

const ROBOTICS_FOREIGN_COMPANY_KEYWORDS = [
  "boston dynamics",
  "figure ai",
  "figure",
  "tesla optimus",
  "optimus",
  "unitree",
  "agility robotics",
  "digit",
  "1x",
  "apptronik",
  "apollo",
  "sanctuary ai",
  "phoenix",
  "nvidia",
  "isaac",
  "embodied",
  "physical intelligence"
];

const ROBOTICS_EXCLUDE_KEYWORDS = [
  "funding",
  "raises",
  "raised",
  "series a",
  "series b",
  "series c",
  "acquisition",
  "acquire",
  "merger",
  "investment",
  "investor",
  "資金調達",
  "出資",
  "買収",
  "投資",
  "論文",
  "paper",
  "preprint",
  "arxiv",
  "大学",
  "university",
  "研究室",
  "研究論文",
  "研究成果"
];

const FOODTECH_ALT_PROTEIN_KEYWORDS = [
  "alternative protein",
  "plant-based",
  "cultivated meat",
  "cell-based",
  "lab-grown",
  "alternative meat",
  "代替肉",
  "培養肉",
  "細胞培養",
  "植物肉",
  "プラントベース"
];

const FOODTECH_INSECT_KEYWORDS = [
  "insect protein",
  "edible insect",
  "edible insects",
  "insect-based",
  "昆虫食",
  "食用昆虫",
  "コオロギ",
  "ミールワーム"
];

const FOODTECH_AGTECH_KEYWORDS = [
  "agtech",
  "agri-tech",
  "agrifood",
  "agrifoodtech",
  "food system",
  "smart agriculture",
  "precision agriculture",
  "agriculture technology",
  "smart greenhouse",
  "greenhouse tech",
  "crop monitoring",
  "harvest automation",
  "農業テック",
  "食農",
  "食農テック",
  "スマート農業",
  "農業dx",
  "農業技術",
  "栽培管理",
  "収穫自動化",
  "温室栽培",
  "スマート温室"
];

const FOODTECH_VERTICAL_FARMING_KEYWORDS = [
  "vertical farming",
  "indoor farming",
  "cea",
  "controlled environment agriculture",
  "植物工場",
  "垂直農法",
  "屋内農業"
];

const FOODTECH_NEW_INGREDIENT_KEYWORDS = [
  "novel ingredient",
  "food ingredient",
  "functional ingredient",
  "fermentation-derived",
  "precision fermentation",
  "新素材",
  "新規食品素材",
  "発酵由来",
  "精密発酵"
];

const FOODTECH_PLANT_VACCINE_KEYWORDS = [
  "plant-made vaccine",
  "plant-based vaccine",
  "molecular farming",
  "植物ワクチン",
  "植物由来ワクチン",
  "分子農業"
];

const FOODTECH_CORE_KEYWORDS = [
  "food tech",
  "foodtech",
  "agri-food",
  "agriculture",
  "食品",
  "食",
  "フードテック"
];

const FOODTECH_EXCLUDE_KEYWORDS = [
  "funding",
  "raises",
  "raised",
  "series a",
  "series b",
  "series c",
  "acquisition",
  "merger",
  "investment",
  "investor",
  "資金調達",
  "出資",
  "買収",
  "投資",
  "recipe",
  "restaurant",
  "menu",
  "food fair",
  "food festival",
  "レシピ",
  "飲食店",
  "新メニュー",
  "グルメ",
  "物産展",
  "フェア",
  "カフェ",
  "研究論文",
  "paper",
  "preprint",
  "arxiv"
];

const MOVIE_SOURCE_CONFIG = {
  eigaComingFeed: {
    url: "https://feeds.eiga.com/eiga_comingsoon.xml",
    source: "映画.com 公開スケジュール"
  },
  thrMoviesFeed: {
    url: "https://hollywoodreporter.jp/category/movies/feed/",
    source: "THE HOLLYWOOD REPORTER JAPAN"
  }
};

const ANIME_SOURCE_CONFIG = {
  animeHack: {
    url: "https://anime.eiga.com/news/",
    source: "アニメハック",
    parser: parseAnimeHackItems
  },
  animeAnime: {
    url: "https://animeanime.jp/category/news/latest/latest/",
    feedUrl: "https://animeanime.jp/rss20/index.rdf",
    source: "アニメ！アニメ！",
    parser: parseAnimeAnimeItems
  },
  comicNatalie: {
    url: "https://natalie.mu/comic/news",
    source: "コミックナタリー",
    parser: parseComicNatalieAnimeItems
  }
};

const ROBOTICS_SOURCE_CONFIG = {
  mujinNews: {
    url: "https://www.mujin.co.jp/news/",
    source: "Mujin",
    linkPrefix: "https://www.mujin.co.jp/",
    linkIncludePattern: "/news/",
    requiresDate: true
  },
  theRobotReport: {
    url: "https://www.therobotreport.com/",
    feedUrl: "https://www.therobotreport.com/feed/",
    source: "The Robot Report",
    linkPrefix: "https://www.therobotreport.com/"
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

const FOODTECH_SOURCE_CONFIG = {
  agFunderNews: {
    source: "AgFunderNews",
    sourceMatches: ["agfundernews"],
    timeoutMs: 8000,
    queries: [
      "site:agfundernews.com cultivated meat OR alternative protein OR plant-based OR fermentation",
      "site:agfundernews.com vertical farming OR indoor farming OR agtech OR insect protein"
    ]
  },
  greenQueen: {
    source: "Green Queen",
    sourceMatches: ["green queen", "greenqueen"],
    timeoutMs: 12000,
    queries: [
      "site:greenqueen.com.hk cultivated meat OR plant-based OR fermentation OR alternative protein",
      "site:greenqueen.com.hk insect protein OR vertical farming OR indoor farming OR molecular farming"
    ]
  },
  prTimes: {
    source: "PR TIMES",
    sourceMatches: ["pr times", "prtimes"],
    timeoutMs: 8000,
    queries: [
      "site:prtimes.jp 代替肉 OR 培養肉 OR 植物工場 OR 昆虫食 OR 農業テック OR 植物ワクチン",
      "site:prtimes.jp 新素材 OR 発酵由来 OR 精密発酵 OR 分子農業"
    ]
  },
  agriTech: {
    source: "AgriTech",
    sourceMatches: [],
    timeoutMs: 8000,
    queries: [
      "\"スマート農業\" OR \"農業AI\" OR \"農業dx\" OR \"agritech\" OR \"smart agriculture\"",
      "\"植物工場\" OR \"vertical farming\" OR \"indoor farming\" OR \"smart greenhouse\" OR \"栽培管理\""
    ]
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
  animeMinDisplayItems: 3,
  foodtechMinDisplayItems: 3,
  newsLookbackDays: 90,
  cacheFallbackMinRatio: 0.7,
  requestTimeoutMs: 5000,
  mainTags: [
    { key: "anime_group", label: "アニメ系" },
    { key: "movie_live", label: "映画実写" },
    { key: "robotics", label: "ロボティクス" },
    { key: "foodtech", label: "フードテック" }
  ],
  categoryTags: [
    { key: "voice", label: "声優" },
    { key: "anime", label: "アニメ" },
    { key: "movie_live", label: "映画" },
    { key: "robotics", label: "ロボット" },
    { key: "foodtech", label: "食" },
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
  sourceFeedMap: Object.fromEntries([
    ...CONFIG.sourceFeeds,
    ...Object.values(ANIME_SOURCE_CONFIG).map((source) => source.source),
    ...Object.values(ROBOTICS_SOURCE_CONFIG).map((source) => source.source),
    ...Object.values(FOODTECH_SOURCE_CONFIG).map((source) => source.source)
  ].map((name) => [name, true])),
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
    hasMainParam: params.has("main"),
    hasCategoryParam: params.has("category"),
    hasFilterParam: params.has("filter"),
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
  const mainTag = params.hasMainParam ? params.selectedMainTag : saved?.selectedMainTag;
  const categoryTag = params.hasMainParam
    ? (params.hasCategoryParam ? params.selectedCategoryTag : "")
    : saved?.selectedCategoryTag;
  const filterTag = params.hasMainParam
    ? (params.hasFilterParam ? params.selectedFilterTag : "")
    : saved?.selectedFilterTag;
  const selectedMainTag = mainKeys.has(mainTag) ? mainTag : "anime_group";
  const selectedCategoryTag = normalizeCategoryForMain(
    selectedMainTag,
    categoryKeys.has(categoryTag) ? categoryTag : ""
  );

  return {
    selectedMainTag,
    selectedCategoryTag,
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
    if (item && item.link) map.set(item.link, normalizeSavedArticle(item));
  }
  return map;
}

function normalizeSavedArticle(item) {
  const summary = stripHtml(item.summary || "");
  const tags = Array.isArray(item.tags) ? item.tags : [];

  return {
    apiReadyVersion: item.apiReadyVersion || 1,
    actor: item.actor || "",
    category: item.category || "",
    categoryKey: item.categoryKey || "",
    title: item.title || "タイトルなし",
    link: item.link || "#",
    publishedAt: item.publishedAt || "",
    source: item.source || "",
    description: item.description || "",
    summary,
    summaryStatus: summary ? (item.summaryStatus || "manual") : (item.summaryStatus || "pending"),
    summaryUpdatedAt: item.summaryUpdatedAt || "",
    tags
  };
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

function stableCacheKey(tagKey, actor = "") {
  return `${cacheKey(tagKey, actor)}::stable`;
}

function readCachedNews(tagKey, actor = "") {
  return newsCacheMap.get(cacheKey(tagKey, actor)) || [];
}

function readStableCachedNews(tagKey, actor = "") {
  return newsCacheMap.get(stableCacheKey(tagKey, actor)) || [];
}

function writeCachedNews(tagKey, actor, items) {
  newsCacheMap.set(cacheKey(tagKey, actor), items);
  const rows = [...newsCacheMap.entries()].map(([k, v]) => ({ key: k, items: v }));
  saveJSON(STORAGE_KEYS.newsCache, rows);
}

function writeStableCachedNews(tagKey, actor, items) {
  newsCacheMap.set(stableCacheKey(tagKey, actor), items);
  const rows = [...newsCacheMap.entries()].map(([k, v]) => ({ key: k, items: v }));
  saveJSON(STORAGE_KEYS.newsCache, rows);
}

function clearStableCachedNews(tagKey, actor) {
  newsCacheMap.delete(stableCacheKey(tagKey, actor));
  const rows = [...newsCacheMap.entries()].map(([k, v]) => ({ key: k, items: v }));
  saveJSON(STORAGE_KEYS.newsCache, rows);
}

function shouldKeepCachedNews(requestTag, freshItems, cachedItems, freshVisibleCount, cachedVisibleCount) {
  if (!cachedItems.length || cachedVisibleCount <= 0) return false;
  if (!["anime", "anime_group", "voice"].includes(requestTag)) return false;
  if (!freshItems.length || freshVisibleCount === 0) return true;

  const minExpected = Math.max(1, Math.floor(cachedItems.length * CONFIG.cacheFallbackMinRatio));
  const minVisibleExpected = Math.max(1, Math.floor(cachedVisibleCount * CONFIG.cacheFallbackMinRatio));
  return freshItems.length < minExpected || freshVisibleCount < minVisibleExpected;
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

function formatErrorMessage(error) {
  const raw = String(error?.message || error || "不明なエラー");
  return raw.replace(/\s+/g, " ").slice(0, 80);
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

function displaySummaryForItem(item) {
  const savedSummary = stripHtml(item?.summary || "");
  return savedSummary || buildSummary(item?.title, item?.description);
}

function summaryStatusForItem(item) {
  if (stripHtml(item?.summary || "")) return item.summaryStatus || "manual";
  return item?.summaryStatus || "pending";
}

function isMeaningfulArticle(item) {
  return displaySummaryForItem(item) !== NO_SUMMARY_MESSAGE;
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
  return [`"${q}" 声優 出演 OR キャスト OR ゲーム OR イベント`];
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
      "映画 新作映画 OR 公開予定 OR 公開日 OR 上映開始",
      "映画 主演 OR 出演 OR キャスト 玉木宏 OR 藤原竜也 OR 佐藤健 OR トム・クルーズ OR キアヌ・リーヴス",
      "映画 監督 新作 OR 最新作 OR 公開日 クリストファー・ノーラン OR Christopher Nolan"
    ];
  }
  if (tagKey === "foodtech") {
    return [
      "site:agfundernews.com cultivated meat OR alternative protein OR plant-based OR fermentation",
      "site:greenqueen.com.hk cultivated meat OR plant-based OR fermentation OR alternative protein",
      "site:prtimes.jp 代替肉 OR 培養肉 OR 植物工場 OR 昆虫食 OR 農業テック OR 植物ワクチン"
    ];
  }
  if (tagKey === "robotics") {
    return [
      "site:mujin.co.jp/news ロボット OR 物流 OR 工場 OR 自動化 OR フィジカルAI",
      "site:yaskawa.co.jp/newsrelease ロボット OR 産業用ロボット OR 自動化 OR 工場",
      "humanoid robots OR bipedal robot OR Tesla Optimus OR Figure AI OR Unitree robotics",
      "\"physical AI\" OR \"embodied AI\" OR \"robot foundation model\" OR NVIDIA Isaac",
      "robotics deployment warehouse OR factory OR logistics",
      "home robot OR household robot OR personal robot OR LOVOT",
      "川崎重工 OR ファナック OR 安川電機 OR Mujin OR ラピュタロボティクス ロボット 導入 OR 新製品"
    ];
  }
  if (tagKey === "car") return ["自動車 最新 ニュース", "車 産業 最新"];
  return ["ニュース 最新"];
}

function buildAnimeSourceFallbackQueries() {
  return [
    "site:anime.eiga.com/news/ アニメ 放送 OR 制作 OR 公開日 OR 劇場版",
    "site:animeanime.jp/article/ アニメ 放送 OR 制作 OR 公開日 OR 劇場版",
    "site:natalie.mu/comic/news/ アニメ 放送 OR 制作 OR 公開日 OR 劇場版"
  ];
}

function buildMovieLiveQueryGroups() {
  return {
    japanese: [
      "映画 新作映画 OR 公開予定 OR 公開日 OR 上映開始",
      "玉木宏 OR 藤原竜也 OR 佐藤健 映画 主演 OR 出演 OR キャスト"
    ],
    foreign: [
      "トム・クルーズ OR キアヌ・リーヴス 映画 主演 OR 出演 OR 公開日",
      "クリストファー・ノーラン OR Christopher Nolan 映画 監督 新作 OR 最新作 OR 公開日"
    ]
  };
}

function buildRoboticsSourceQueries(enabledSourceNames = []) {
  const enabled = new Set(enabledSourceNames);
  const queries = [];
  const isMujinOnly = enabled.size === 1 && enabled.has("Mujin");

  if (isMujinOnly) {
    return [
      "site:mujin.co.jp/news ロボット OR 物流 OR 工場 OR 自動化 OR フィジカルAI"
    ];
  }

  if (enabled.size === 0 || enabled.has("Mujin")) {
    queries.push("site:mujin.co.jp/news ロボット OR 物流 OR 工場 OR 自動化 OR フィジカルAI");
    queries.push("site:yaskawa.co.jp/newsrelease ロボット OR 産業用ロボット OR 自動化 OR 工場");
    queries.push("site:prtimes.jp ロボット 物流 OR 工場 OR 自動化 OR フィジカルAI");
    queries.push("川崎重工 OR ファナック OR 安川電機 OR Mujin OR ラピュタロボティクス ロボット 導入 OR 新製品");
  }
  if (enabled.size === 0 || enabled.has("The Robot Report")) {
    queries.push("site:therobotreport.com humanoid OR robotics OR warehouse OR factory OR logistics");
  }
  if (enabled.size === 0 || enabled.has("TechCrunch Robotics")) {
    queries.push("site:techcrunch.com robotics humanoid OR \"physical AI\" OR warehouse");
  }
  if (enabled.size === 0 || enabled.has("NVIDIA Robotics")) {
    queries.push("site:blogs.nvidia.com robotics OR \"physical AI\" OR humanoid OR Isaac");
  }
  if (enabled.size === 0 || enabled.has("The Robot Report") || enabled.has("TechCrunch Robotics")) {
    queries.push("home robot OR household robot OR personal robot OR LOVOT");
  }

  return [...new Set(queries)];
}

function buildFoodtechSourceQueries(enabledSourceNames = []) {
  const enabled = new Set(enabledSourceNames);
  return Object.values(FOODTECH_SOURCE_CONFIG)
    .filter((source) => enabled.size === 0 || enabled.has(source.source))
    .flatMap((source) => source.queries);
}

function filterRoboticsFallbackItemsByEnabledSources(items, enabledSources) {
  if (!Array.isArray(items) || items.length === 0) return [];
  if (!Array.isArray(enabledSources) || enabledSources.length === 0) return items;

  if (enabledSources.length === 1) {
    const [singleSource] = enabledSources;
    if (singleSource?.linkPrefix) {
      return items.filter((item) => String(item.link || "").startsWith(singleSource.linkPrefix));
    }
  }

  return items;
}

function foodtechText(item) {
  return [item.title, item.description, item.source].join(" ").toLowerCase();
}

function isFoodtechAltProteinArticle(item) {
  return includesAny(foodtechText(item), FOODTECH_ALT_PROTEIN_KEYWORDS);
}

function isFoodtechInsectArticle(item) {
  return includesAny(foodtechText(item), FOODTECH_INSECT_KEYWORDS);
}

function isFoodtechAgtechArticle(item) {
  return includesAny(foodtechText(item), FOODTECH_AGTECH_KEYWORDS);
}

function isFoodtechVerticalFarmingArticle(item) {
  return includesAny(foodtechText(item), FOODTECH_VERTICAL_FARMING_KEYWORDS);
}

function isFoodtechNewIngredientArticle(item) {
  return includesAny(foodtechText(item), FOODTECH_NEW_INGREDIENT_KEYWORDS);
}

function isFoodtechPlantVaccineArticle(item) {
  return includesAny(foodtechText(item), FOODTECH_PLANT_VACCINE_KEYWORDS);
}

function inferFoodtechType() {
  return "食";
}

function isFoodtechArticleAllowed(item) {
  const text = foodtechText(item);

  if (includesAny(text, FOODTECH_EXCLUDE_KEYWORDS)) return false;

  const hasSignal =
    includesAny(text, FOODTECH_CORE_KEYWORDS) ||
    isFoodtechAltProteinArticle(item) ||
    isFoodtechInsectArticle(item) ||
    isFoodtechAgtechArticle(item) ||
    isFoodtechVerticalFarmingArticle(item) ||
    isFoodtechNewIngredientArticle(item) ||
    isFoodtechPlantVaccineArticle(item);

  if (!hasSignal) return false;
  return !/映画|アニメ|ゲーム|レストランレビュー|食べ歩き/.test(text);
}

function primaryFoodtechFilterTag(item) {
  if (!isFoodtechArticleAllowed(item)) return "";
  if (isFoodtechPlantVaccineArticle(item)) return "植物ワクチン";
  if (isFoodtechVerticalFarmingArticle(item)) return "植物工場";
  if (isFoodtechAgtechArticle(item)) return "農業テック";
  if (isFoodtechAltProteinArticle(item)) return "代替肉・培養肉";
  if (isFoodtechInsectArticle(item)) return "昆虫食";
  if (isFoodtechNewIngredientArticle(item)) return "新素材";
  return "その他";
}

function matchesFoodtechFilter(item, filterTag = "") {
  if (!isFoodtechArticleAllowed(item)) return false;
  if (!filterTag || filterTag === "すべて") return true;
  if (FOODTECH_FILTER_TAGS.includes(filterTag)) {
    return primaryFoodtechFilterTag(item) === filterTag;
  }
  return true;
}

function filterFoodtechSourceItemsByMatch(items, sourceConfig) {
  if (!Array.isArray(items) || items.length === 0) return [];
  const matchTerms = Array.isArray(sourceConfig.sourceMatches) ? sourceConfig.sourceMatches : [];
  if (matchTerms.length === 0) {
    return items.map((item) => ({
      ...item,
      source: sourceConfig.source,
      sourceHint: sourceConfig.source
    }));
  }

  return items.filter((item) => {
    const sourceText = `${item.source || ""} ${item.link || ""} ${item.title || ""} ${item.description || ""}`.toLowerCase();
    return matchTerms.some((term) => sourceText.includes(String(term).toLowerCase()));
  }).map((item) => ({
    ...item,
    source: sourceConfig.source,
    sourceHint: sourceConfig.source
  }));
}

function normalizeFoodtechSourceName(item) {
  if (item?.sourceHint) {
    return {
      ...item,
      source: item.sourceHint
    };
  }

  const sourceText = `${item.source || ""} ${item.link || ""} ${item.title || ""} ${item.description || ""}`.toLowerCase();
  for (const sourceConfig of Object.values(FOODTECH_SOURCE_CONFIG)) {
    const matchTerms = Array.isArray(sourceConfig.sourceMatches) ? sourceConfig.sourceMatches : [];
    if (matchTerms.some((term) => sourceText.includes(String(term).toLowerCase()))) {
      return {
        ...item,
        source: sourceConfig.source
      };
    }
  }
  return item;
}

async function fetchFoodtechSingleSourceItems(sourceConfig, sourceKey) {
  const items = await fetchNewsByQueries(sourceConfig.queries, {
    key: sourceKey,
    actor: "",
    categoryKey: "foodtech",
    categoryLabel: "フードテック"
  }, {
    collectAll: true,
    timeoutMs: sourceConfig.timeoutMs
  });

  return filterFoodtechSourceItemsByMatch(items, sourceConfig);
}

async function fetchFoodtechSourceItems() {
  const sourceEntries = Object.entries(FOODTECH_SOURCE_CONFIG)
    .filter(([, sourceConfig]) => state.sourceFeedMap[sourceConfig.source] !== false);

  if (sourceEntries.length === 0) {
    appendLog("フードテック: 有効な収集元がありません");
    return [];
  }

  appendLog(`フードテック取得開始: ${sourceEntries.map(([, sourceConfig]) => sourceConfig.source).join(" / ")}`);

  const results = await Promise.allSettled(
    sourceEntries.map(([sourceKey, sourceConfig]) => fetchFoodtechSingleSourceItems(sourceConfig, sourceKey))
  );

  return results.flatMap((result, index) => {
    const [, sourceConfig] = sourceEntries[index];
    if (result.status === "fulfilled") {
      appendFoodtechDiagnostics(sourceConfig.source, result.value);
      return result.value;
    }
    appendLog(`${sourceConfig.source}: 取得失敗 (${formatErrorMessage(result.reason)})`);
    return [];
  });
}

function foodtechDiagnostics(items) {
  const withinLookback = items.filter((item) => isWithinLookbackRange(item.publishedAt));
  const displayCandidates = withinLookback.filter((item) => matchesFoodtechFilter(item, ""));
  return {
    fetched: items.length,
    withinLookback: withinLookback.length,
    displayCandidates: displayCandidates.length
  };
}

function appendFoodtechDiagnostics(sourceName, items) {
  const stats = foodtechDiagnostics(items);
  appendLog(`${sourceName}: 取得${stats.fetched}件 / 90日以内${stats.withinLookback}件 / 表示候補${stats.displayCandidates}件`);
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

async function fetchRssXmlWithFallback(feedUrl, timeoutMs = CONFIG.requestTimeoutMs) {
  let lastError = null;

  for (const proxyBase of CONFIG.rssProxyBases) {
    try {
      const proxyUrl = `${proxyBase}${encodeURIComponent(feedUrl)}`;
      const response = await fetchWithTimeout(proxyUrl, { cache: "no-store" }, timeoutMs);
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

async function fetchTextWithProxyFallback(url, timeoutMs = CONFIG.requestTimeoutMs) {
  let lastError = null;

  for (const proxyBase of CONFIG.rssProxyBases) {
    try {
      const proxyUrl = `${proxyBase}${encodeURIComponent(url)}`;
      const response = await fetchWithTimeout(proxyUrl, { cache: "no-store" }, timeoutMs);
      if (!response.ok) throw new Error(`取得失敗: ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("テキスト取得に失敗");
}

async function fetchRss2JsonItems(feedUrl, meta, timeoutMs = CONFIG.requestTimeoutMs) {
  const endpoint = `${CONFIG.rssJsonProxyBase}${encodeURIComponent(feedUrl)}`;
  const response = await fetchWithTimeout(endpoint, { cache: "no-store" }, timeoutMs);
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
  const timeoutMs = options.timeoutMs || CONFIG.requestTimeoutMs;
  let lastError = null;
  const collected = [];

  for (const query of queries) {
    const feedUrl = buildGoogleNewsRssUrl(query);
    try {
      const xml = await fetchRssXmlWithFallback(feedUrl, timeoutMs);
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
      const items = await fetchRss2JsonItems(feedUrl, meta, timeoutMs);
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
      source: MOVIE_SOURCE_CONFIG.eigaComingFeed.source
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
      source: MOVIE_SOURCE_CONFIG.thrMoviesFeed.source
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

function getEnabledAnimeSources() {
  return Object.values(ANIME_SOURCE_CONFIG)
    .filter((source) => state.sourceFeedMap[source.source] !== false);
}

function getEnabledAnimeSourceCacheKey() {
  const names = getEnabledAnimeSources().map((source) => source.source);
  return names.length > 0 ? names.join("|") : "__no_anime_sources__";
}

function getEnabledFoodtechSources() {
  return Object.values(FOODTECH_SOURCE_CONFIG)
    .filter((source) => state.sourceFeedMap[source.source] !== false);
}

function getEnabledFoodtechSourceCacheKey() {
  const names = getEnabledFoodtechSources().map((source) => source.source);
  return names.length > 0 ? names.join("|") : "__no_foodtech_sources__";
}

function isSingleFoodtechSourceSelection() {
  return getEnabledFoodtechSources().length === 1;
}

function getEnabledRoboticsSources() {
  return Object.values(ROBOTICS_SOURCE_CONFIG)
    .filter((source) => state.sourceFeedMap[source.source] !== false);
}

function getEnabledRoboticsSourceCacheKey() {
  const names = getEnabledRoboticsSources().map((source) => source.source);
  return names.length > 0 ? names.join("|") : "__no_robotics_sources__";
}

function isSingleRoboticsSourceSelection() {
  return getEnabledRoboticsSources().length === 1;
}

function isVoiceSourceEnabled() {
  return state.sourceFeedMap[VOICE_SOURCE_FEED] !== false;
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

    const container = anchor.closest("li, article") || anchor.closest("section, div") || anchor.parentElement;
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

    const container = anchor.closest("article, li") || anchor.closest("section, div") || anchor.parentElement;
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

    const container = anchor.closest("article, li") || anchor.closest("section, div") || anchor.parentElement;
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
  const enabledSources = getEnabledAnimeSources();
  if (enabledSources.length === 0) return [];

  appendLog(`アニメ取得開始: ${enabledSources.map((source) => source.source).join(" / ")}`);
  const results = await Promise.allSettled(
    enabledSources.map((source) => fetchAnimeItemsFromSource(source))
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      const detail = result.value;
      appendLog(`${detail.sourceName}: ${detail.items.length}件取得 (${detail.method})`);
    } else {
      appendLog(`アニメ取得失敗: ${formatErrorMessage(result.reason)}`);
    }
  }

  return results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value.items);
}

async function fetchAnimeItemsFromSource(source) {
  const errors = [];

  if (source.feedUrl) {
    try {
      const items = await fetchRss2JsonItems(source.feedUrl, {
        key: `anime-source-${source.source}`,
        actor: "",
        categoryKey: "anime",
        categoryLabel: "アニメ"
      });
      if (items.length > 0) {
        return {
          sourceName: source.source,
          method: "RSS2JSON",
          items: items.map((item) => ({ ...item, source: source.source }))
        };
      }
      errors.push("RSS2JSON: 0件");
    } catch (error) {
      errors.push(`RSS2JSON: ${formatErrorMessage(error)}`);
      try {
        const xml = await fetchRssXmlWithFallback(source.feedUrl);
        const items = parseRssItems(xml, {
          key: `anime-source-${source.source}`,
          actor: "",
          categoryKey: "anime",
          categoryLabel: "アニメ"
        });
        if (items.length > 0) {
          return {
            sourceName: source.source,
            method: "RSS",
            items: items.map((item) => ({ ...item, source: source.source }))
          };
        }
        errors.push("RSS: 0件");
      } catch (rssError) {
        errors.push(`RSS: ${formatErrorMessage(rssError)}`);
        // HTML parsing below is the last fallback for sites with no usable feed response.
      }
    }
  }

  try {
    const htmlText = await fetchTextWithProxyFallback(source.url);
    const items = source.parser(htmlText);
    return {
      sourceName: source.source,
      method: "HTML",
      items
    };
  } catch (error) {
    errors.push(`HTML: ${formatErrorMessage(error)}`);
    throw new Error(`${source.source} ${errors.join(" / ")}`);
  }
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
    if (sourceConfig.linkIncludePattern && !link.includes(sourceConfig.linkIncludePattern)) continue;
    if (seen.has(link)) continue;

    const container = anchor.closest("article, li, section, div") || anchor.parentElement;
    const text = normalizeWhitespace(container?.textContent || title);
    const timeNode = container?.querySelector("time");
    const publishedAtRaw = timeNode?.getAttribute("datetime") || timeNode?.textContent || text;
    const parsedPublishedAt = parseDateToIso(publishedAtRaw);
    if (sourceConfig.requiresDate && !parsedPublishedAt) continue;
    const publishedAt = parsedPublishedAt || new Date().toISOString();

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
  const sourceEntries = [
    ["mujin-news", ROBOTICS_SOURCE_CONFIG.mujinNews],
    ["the-robot-report", ROBOTICS_SOURCE_CONFIG.theRobotReport],
    ["techcrunch-robotics", ROBOTICS_SOURCE_CONFIG.techCrunch],
    ["nvidia-robotics", ROBOTICS_SOURCE_CONFIG.nvidiaRobotics]
  ].filter(([, sourceConfig]) => state.sourceFeedMap[sourceConfig.source] !== false);

  if (sourceEntries.length === 0) {
    appendLog("ロボティクス: 有効な収集元がありません");
    return [];
  }

  const results = await Promise.allSettled(
    sourceEntries.map(([sourceKey, sourceConfig]) => fetchRoboticsSingleSourceItems(sourceConfig, sourceKey))
  );

  return results.flatMap((result, index) => {
    const [, sourceConfig] = sourceEntries[index];
    if (result.status === "fulfilled") {
      appendRoboticsDiagnostics(sourceConfig.source, result.value);
      return result.value;
    }
    appendLog(`${sourceConfig.source}: 取得失敗 (${formatErrorMessage(result.reason)})`);
    return [];
  });
}

function roboticsDiagnostics(items) {
  const withinLookback = items.filter((item) => isWithinLookbackRange(item.publishedAt));
  const displayCandidates = withinLookback.filter((item) => matchesRoboticsFilter(item, ""));
  return {
    fetched: items.length,
    withinLookback: withinLookback.length,
    displayCandidates: displayCandidates.length
  };
}

function appendRoboticsDiagnostics(sourceName, items) {
  const stats = roboticsDiagnostics(items);
  appendLog(`${sourceName}: 取得${stats.fetched}件 / 90日以内${stats.withinLookback}件 / 表示候補${stats.displayCandidates}件`);
}

function isJapaneseText(text) {
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(String(text || ""));
}

function isPreferredJapaneseRoboticsItem(item) {
  return item.source === "Mujin" ||
    isJapaneseRoboticsArticle(item) ||
    isJapaneseText(`${item.title} ${item.description}`);
}

function prioritizeRoboticsSourceMix(items, limit) {
  const preferred = items.filter((item) => isPreferredJapaneseRoboticsItem(item));
  const others = items.filter((item) => !isPreferredJapaneseRoboticsItem(item));
  const preferredBalanced = balanceItemsBySource(preferred, limit);
  if (preferredBalanced.length >= limit) return preferredBalanced.slice(0, limit);
  return [...preferredBalanced, ...balanceItemsBySource(others, limit - preferredBalanced.length)].slice(0, limit);
}

function movieLiveDiagnostics(items) {
  const withinLookback = items.filter((item) => isWithinLookbackRange(item.publishedAt));
  const displayCandidates = withinLookback.filter((item) => matchesLiveActionFilter(item, ""));
  return {
    fetched: items.length,
    withinLookback: withinLookback.length,
    displayCandidates: displayCandidates.length
  };
}

function appendMovieLiveDiagnostics(sourceName, items) {
  const stats = movieLiveDiagnostics(items);
  appendLog(`${sourceName}: 取得${stats.fetched}件 / 90日以内${stats.withinLookback}件 / 表示候補${stats.displayCandidates}件`);
}

async function fetchMovieLiveFeedItems(sourceConfig) {
  const meta = {
    key: `movie-feed-${sourceConfig.source}`,
    actor: "",
    categoryKey: "movie_live",
    categoryLabel: "映画実写"
  };

  try {
    const items = await fetchRss2JsonItems(sourceConfig.url, meta);
    appendMovieLiveDiagnostics(`${sourceConfig.source}(RSS2JSON)`, items);
    return items;
  } catch (rss2jsonError) {
    appendLog(`${sourceConfig.source}(RSS2JSON): 取得失敗 (${formatErrorMessage(rss2jsonError)})`);
  }

  try {
    const xml = await fetchRssXmlWithFallback(sourceConfig.url);
    const items = parseRssItems(xml, meta);
    const normalized = items.map((item) => ({ ...item, source: sourceConfig.source }));
    appendMovieLiveDiagnostics(`${sourceConfig.source}(RSS)`, normalized);
    return normalized;
  } catch (rssError) {
    appendLog(`${sourceConfig.source}(RSS): 取得失敗 (${formatErrorMessage(rssError)})`);
    return [];
  }
}

async function fetchMovieLiveSourceItems() {
  appendLog("映画実写取得開始: 映画.com feed / THR Japan feed");
  const [eigaItems, thrItems] = await Promise.all([
    fetchMovieLiveFeedItems(MOVIE_SOURCE_CONFIG.eigaComingFeed),
    fetchMovieLiveFeedItems(MOVIE_SOURCE_CONFIG.thrMoviesFeed)
  ]);

  return [...eigaItems, ...thrItems];
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

function balanceItemsByCategory(items, limit) {
  const groups = new Map();
  for (const item of sortByDateDesc(items)) {
    const categoryKey = item.categoryKey || "unknown";
    if (!groups.has(categoryKey)) groups.set(categoryKey, []);
    groups.get(categoryKey).push(item);
  }

  const orderedCategories = [...groups.keys()].sort((a, b) => {
    const aTime = new Date(groups.get(a)[0]?.publishedAt).getTime() || 0;
    const bTime = new Date(groups.get(b)[0]?.publishedAt).getTime() || 0;
    return bTime - aTime;
  });

  const balanced = [];
  while (balanced.length < limit && orderedCategories.some((categoryKey) => groups.get(categoryKey).length > 0)) {
    for (const categoryKey of orderedCategories) {
      const next = groups.get(categoryKey).shift();
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
  if (item.categoryKey === "movie_live") return "映画";
  if (item.categoryKey === "anime") {
    if (isAnimeMovieNews(item)) return "アニメ映画";
    if (isAnimeTvNews(item)) return "新作TV";
    if (isAnimeProductionNews(item)) return "放送・制作";
    return "アニメ";
  }
  if (item.categoryKey === "voice") return "声優";
  if (item.categoryKey === "robotics") return inferRoboticsType(item);
  if (item.categoryKey === "foodtech") return inferFoodtechType(item);
  return item.category;
}

function inferTags(item) {
  const tags = [item.category, deriveSubCategory(item)];
  const title = `${item.title} ${item.description}`;

  if (item.actor) tags.push(item.actor);
  if (item.categoryKey === "voice") {
    if (isVoiceAnimeAppearance(item)) tags.push("アニメ出演");
    if (isVoiceGameAppearance(item)) tags.push("ゲーム出演");
    if (isNationalChainEvent(item)) tags.push("イベント");
    if (/出演|登壇|発表/.test(title)) tags.push("出演");
    if (/ボイス|CV/.test(title)) tags.push("ボイス");
    return [...new Set(tags.filter(Boolean))].slice(0, 5);
  }

  if (item.categoryKey === "anime") {
    if (isAnimeMovieNews(item)) tags.push("アニメ映画");
    if (isNationalChainEvent(item)) tags.push("イベント");
    if (isAnimeTvNews(item)) tags.push("新作TV");
    if (isAnimeTvNews(item) || isAnimeProductionNews(item)) tags.push("放送・制作");
    if (/PV|特報|映像|ビジュアル/.test(title)) tags.push("PV");
    return [...new Set(tags.filter(Boolean))].slice(0, 5);
  }

  if (item.categoryKey === "movie_live") {
    const primaryFilter = primaryLiveActionFilterTag(item);
    if (primaryFilter) tags.push(primaryFilter);
    return [...new Set(tags.filter(Boolean))].slice(0, 5);
  }

  if (item.categoryKey === "robotics") {
    const primaryFilter = primaryRoboticsFilterTag(item);
    if (primaryFilter) tags.push(primaryFilter);
    return [...new Set(tags.filter(Boolean))].slice(0, 5);
  }

  if (item.categoryKey === "foodtech") {
    const primaryFilter = primaryFoodtechFilterTag(item);
    if (primaryFilter) tags.push(primaryFilter);
    return [...new Set(tags.filter(Boolean))].slice(0, 5);
  }

  return [...new Set(tags.filter(Boolean))].slice(0, 5);
}

function includesAny(text, keywords) {
  return keywords.some((word) => text.includes(String(word).toLowerCase()));
}

function isAnimeSourceItem(item) {
  return Object.values(ANIME_SOURCE_CONFIG).some((source) => source.source === item.source);
}

function animeText(item) {
  return [item.title, item.description, item.source, item.actor].join(" ").toLowerCase();
}

function animeContentText(item) {
  return [item.title, item.description, item.actor].join(" ").toLowerCase();
}

function isAnimeMovieNews(item) {
  const text = animeContentText(item);
  if (/実写|主演|imax|場面写真/.test(text)) return false;
  if (/劇場アニメ|劇場版|アニメ映画/.test(text)) return true;
  return /映画|上映|公開日|公開決定|公開予定|ロードショー/.test(text) &&
    /アニメ|アニメーション/.test(text);
}

function isAnimeTvNews(item) {
  const text = animeContentText(item);
  return !isAnimeMovieNews(item) && includesAny(text, ANIME_TV_NEWS_KEYWORDS);
}

function isAnimeProductionNews(item) {
  return includesAny(animeContentText(item), ANIME_PRODUCTION_NEWS_KEYWORDS);
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

function isRoboticsProductArticle(item) {
  return includesAny(roboticsText(item), ROBOTICS_PRODUCT_KEYWORDS);
}

function isRoboticsHomeArticle(item) {
  return includesAny(roboticsText(item), ROBOTICS_HOME_KEYWORDS);
}

function isJapaneseRoboticsArticle(item) {
  return includesAny(roboticsText(item), ROBOTICS_JAPAN_COMPANY_KEYWORDS);
}

function isForeignRoboticsArticle(item) {
  return includesAny(roboticsText(item), ROBOTICS_FOREIGN_COMPANY_KEYWORDS);
}

function inferRoboticsType(item) {
  return "ロボット";
}

function isRoboticsArticleAllowed(item) {
  const text = roboticsText(item);

  if (includesAny(text, ROBOTICS_EXCLUDE_KEYWORDS)) return false;

  const hasSignal =
    includesAny(text, ROBOTICS_CORE_KEYWORDS) ||
    isHumanoidRoboticsArticle(item) ||
    isPhysicalAiRoboticsArticle(item) ||
    isRoboticsDeploymentArticle(item) ||
    isRoboticsProductArticle(item) ||
    isRoboticsHomeArticle(item) ||
    isJapaneseRoboticsArticle(item) ||
    isForeignRoboticsArticle(item);

  if (!hasSignal) return false;
  return !/ゲーム|映画|アニメ|玩具|おもちゃ/.test(text);
}

function primaryRoboticsFilterTag(item) {
  if (!isRoboticsArticleAllowed(item)) return "";
  if (isRoboticsHomeArticle(item)) return "家庭用";
  if (isRoboticsDeploymentArticle(item)) return "現場導入";
  if (isHumanoidRoboticsArticle(item)) return "ヒューマノイド";
  if (isRoboticsProductArticle(item)) return "新製品";
  if (isJapaneseRoboticsArticle(item)) return "日本企業";
  if (isForeignRoboticsArticle(item)) return "海外企業";
  return "その他";
}

function matchesRoboticsFilter(item, filterTag = "") {
  if (!isRoboticsArticleAllowed(item)) return false;
  if (!filterTag || filterTag === "すべて") return true;
  if (ROBOTICS_FILTER_TAGS.includes(filterTag)) {
    return primaryRoboticsFilterTag(item) === filterTag;
  }
  return true;
}

function isNationalChainEvent(item) {
  const text = [item.title, item.description, item.source].join(" ").toLowerCase();
  const hasInclude = includesAny(text, EVENT_CHAIN_INCLUDE_KEYWORDS);
  const hasRegionalExclude = includesAny(text, EVENT_REGION_EXCLUDE_KEYWORDS);
  return hasInclude && !hasRegionalExclude;
}

function voiceText(item) {
  return [item.title, item.actor].join(" ").toLowerCase();
}

function isVoiceArticleAllowed(item) {
  const text = voiceText(item);
  if (includesAny(text, VOICE_EXCLUDE_KEYWORDS)) return false;
  return isVoiceAnimeAppearance(item) || isVoiceGameAppearance(item) || isNationalChainEvent(item);
}

function isVoiceAnimeAppearance(item) {
  const text = voiceText(item);
  return /アニメ|劇場アニメ|劇場版|キャスト|追加声優|出演|cv|放送|声優/.test(text);
}

function isVoiceGameAppearance(item) {
  const text = voiceText(item);
  return /ゲーム|新作ゲーム|rpg|スマホゲーム|コンシューマ|switch|playstation|steam|パズドラ/.test(text);
}

function matchesVoiceFilter(item, filterTag = "") {
  if (!isVoiceArticleAllowed(item)) return false;
  if (!filterTag || filterTag === "すべて") return true;
  if (VOICE_FILTER_TAGS.includes(filterTag)) {
    return primaryVoiceFilterTag(item) === filterTag;
  }
  return true;
}

function primaryVoiceFilterTag(item) {
  if (!isVoiceArticleAllowed(item)) return "";
  if (isNationalChainEvent(item)) return "イベント";
  if (isVoiceGameAppearance(item)) return "ゲーム出演";
  if (isVoiceAnimeAppearance(item)) return "アニメ出演";
  return "";
}

function isAnimeArticleAllowed(item) {
  const text = animeText(item);

  if (includesAny(text, ANIME_EXCLUDE_KEYWORDS)) return false;
  return isAnimeTvNews(item) || isAnimeMovieNews(item) || isAnimeProductionNews(item);
}

function matchesAnimeFilter(item, filterTag = "") {
  if (filterTag === "イベント") {
    return isNationalChainEvent(item);
  }
  if (filterTag === "アニメ映画") {
    return isAnimeMovieNews(item) && isAnimeArticleAllowed(item);
  }
  if (filterTag === "新作TV" || filterTag === "TVアニメ") {
    return isAnimeTvNews(item) && isAnimeArticleAllowed(item);
  }
  if (filterTag === "放送・制作") {
    return (isAnimeTvNews(item) || isAnimeProductionNews(item)) && isAnimeArticleAllowed(item);
  }
  return isAnimeArticleAllowed(item);
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

  const hasReleaseSignal = /公開予定|上映予定|公開|ロードショー|劇場公開|新作|続編|公開日|上映開始|映画化|製作|制作/.test(text);

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

function isLiveActionNewMovieNews(item) {
  const text = [item.title, item.description, item.source, item.actor].join(" ").toLowerCase();
  return /新作映画|最新作|新作|製作|制作|映画化|実写映画|劇場公開|ロードショー/.test(text);
}

function isLiveActionReleaseDateNews(item) {
  const text = [item.title, item.description, item.source, item.actor].join(" ").toLowerCase();
  return /公開日|公開予定|公開決定|公開される|公開開始|上映開始|劇場公開|ロードショー/.test(text);
}

function isLiveActionAppearanceNews(item) {
  const text = [item.title, item.description, item.source, item.actor].join(" ").toLowerCase();
  return includesAny(text, LIVE_ACTION_APPEARANCE_PRIORITY_PEOPLE);
}

function isLiveActionDirectorNews(item) {
  const text = [item.title, item.description, item.source, item.actor].join(" ").toLowerCase();
  return includesAny(text, LIVE_ACTION_DIRECTOR_PRIORITY_PEOPLE);
}

function primaryLiveActionFilterTag(item) {
  if (!isLiveActionArticleAllowed(item)) return "";
  if (isLiveActionReleaseDateNews(item)) return "公開日";
  if (isLiveActionAppearanceNews(item)) return "出演";
  if (isLiveActionDirectorNews(item)) return "監督";
  if (isLiveActionNewMovieNews(item)) return "新作映画";
  return "その他";
}

function matchesLiveActionFilter(item, filterTag) {
  if (!isLiveActionArticleAllowed(item)) return false;
  if (!filterTag || filterTag === "すべて") return true;
  if (LIVE_ACTION_FILTER_TAGS.includes(filterTag)) {
    return primaryLiveActionFilterTag(item) === filterTag;
  }
  return true;
}

function prioritizeMovieSourceMix(items) {
  return balanceItemsBySource(items, items.length);
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
  ui.dialogDesc.textContent = displaySummaryForItem(item);
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

function isAnimeContextSelected() {
  return state.selectedMainTag === "anime_group" ||
    state.selectedCategoryTag === "anime" ||
    state.activeTag === "anime";
}

function isVoiceContextSelected() {
  return state.selectedCategoryTag === "voice" || state.activeTag === "voice";
}

function isMixedAnimeGroupContext() {
  return state.activeTag === "anime_group" && !state.selectedCategoryTag;
}

function currentSourceFeeds() {
  if (state.selectedCategoryTag === "voice" || state.activeTag === "voice") {
    return [VOICE_SOURCE_FEED];
  }
  if (isMixedAnimeGroupContext()) {
    return [];
  }
  if (isAnimeContextSelected()) {
    return Object.values(ANIME_SOURCE_CONFIG).map((source) => source.source);
  }
  if (state.selectedMainTag === "foodtech" || state.selectedCategoryTag === "foodtech" || state.activeTag === "foodtech") {
    return Object.values(FOODTECH_SOURCE_CONFIG).map((source) => source.source);
  }
  if (state.selectedMainTag === "robotics" || state.selectedCategoryTag === "robotics" || state.activeTag === "robotics") {
    return Object.values(ROBOTICS_SOURCE_CONFIG).map((source) => source.source);
  }
  return CONFIG.sourceFeeds;
}

function categoryTagsForMain(mainTag) {
  if (mainTag === "anime_group") {
    return CONFIG.categoryTags.filter((tag) => ["voice", "anime"].includes(tag.key));
  }
  if (mainTag === "movie_live") {
    return CONFIG.categoryTags.filter((tag) => tag.key === "movie_live");
  }
  if (mainTag === "robotics") {
    return CONFIG.categoryTags.filter((tag) => tag.key === "robotics");
  }
  if (mainTag === "foodtech") {
    return CONFIG.categoryTags.filter((tag) => tag.key === "foodtech");
  }
  return [];
}

function defaultCategoryForMain(mainTag) {
  const tags = categoryTagsForMain(mainTag);
  return tags[0]?.key || "";
}

function normalizeCategoryForMain(mainTag, categoryKey) {
  const allowedKeys = new Set(categoryTagsForMain(mainTag).map((tag) => tag.key));
  if (allowedKeys.size === 0) return "";
  return allowedKeys.has(categoryKey) ? categoryKey : defaultCategoryForMain(mainTag);
}

function renderSourceFeeds() {
  ui.sourceFeedChips.innerHTML = "";
  for (const name of currentSourceFeeds()) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip${state.sourceFeedMap[name] ? " active" : ""}`;
    btn.textContent = name;
    btn.dataset.feed = name;
    ui.sourceFeedChips.appendChild(btn);
  }
}

function utilityFilterTags() {
  const isVoiceContext = isVoiceContextSelected();
  const isAnimeContext =
    state.selectedCategoryTag === "anime" ||
    state.activeTag === "anime";
  const isRoboticsContext =
    state.selectedMainTag === "robotics" ||
    state.activeTag === "robotics";
  const isFoodtechContext =
    state.selectedMainTag === "foodtech" ||
    state.selectedCategoryTag === "foodtech" ||
    state.activeTag === "foodtech";
  const isMovieContext =
    state.selectedMainTag === "movie_live" ||
    state.selectedCategoryTag === "movie_live" ||
    state.activeTag === "movie_live";

  if (isVoiceContext) {
    return [...VOICE_FILTER_TAGS];
  }

  if (isMixedAnimeGroupContext()) {
    return ["すべて"];
  }

  if (isAnimeContext) {
    return [...ANIME_FILTER_TAGS];
  }

  if (isRoboticsContext) {
    return [...ROBOTICS_FILTER_TAGS];
  }

  if (isFoodtechContext) {
    return [...FOODTECH_FILTER_TAGS];
  }

  if (isMovieContext) {
    return [...LIVE_ACTION_FILTER_TAGS];
  }

  return [...BASE_FILTER_TAGS];
}

function syncSelectedFilterTagToContext() {
  const availableTags = utilityFilterTags();
  const defaultTag = availableTags[0] || "";
  if (!state.selectedFilterTag || !availableTags.includes(state.selectedFilterTag)) {
    state.selectedFilterTag = defaultTag;
  }
}

function resetViewForCategorySwitch() {
  state.selectedFilterTag = "すべて";
  state.searchText = "";
  ui.searchInput.value = "";
}

function matchesSpecialFilter(item, filterTag) {
  const text = [item.title, item.description, item.category, item.actor, item.source]
    .join(" ")
    .toLowerCase();

  if (filterTag === "すべて") {
    return true;
  }
  if (filterTag === "新作TV" || filterTag === "TVアニメ") {
    return /アニメ/.test(text) && !/映画|劇場版/.test(text);
  }
  if (filterTag === "アニメ映画") {
    return /映画|劇場版/.test(text);
  }
  if (filterTag === "放送・制作") {
    return /放送|制作|アニメ化|pv|特報|映像|ビジュアル/.test(text);
  }
  if (filterTag === "配信") {
    return /配信|ストリーミング|見放題|vod/.test(text);
  }
  if (filterTag === "イベント") {
    // ユーザー要望: 全国チェーンとのコラボ/展示のみ
    return isNationalChainEvent(item);
  }
  if (LIVE_ACTION_FILTER_TAGS.includes(filterTag)) {
    return matchesLiveActionFilter(item, filterTag);
  }
  if (ROBOTICS_FILTER_TAGS.includes(filterTag)) {
    return matchesRoboticsFilter(item, filterTag);
  }
  if (FOODTECH_FILTER_TAGS.includes(filterTag)) {
    return matchesFoodtechFilter(item, filterTag);
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
  for (const tag of categoryTagsForMain(state.selectedMainTag)) {
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

    const isFixedCategoryTag =
      ANIME_FILTER_TAGS.includes(tag) ||
      VOICE_FILTER_TAGS.includes(tag) ||
      ROBOTICS_FILTER_TAGS.includes(tag) ||
      FOODTECH_FILTER_TAGS.includes(tag) ||
      LIVE_ACTION_FILTER_TAGS.includes(tag);
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

function filterRoboticsItemsByEnabledSources(items) {
  const enabledSources = getEnabledRoboticsSources();
  if (enabledSources.length === 0) return [];

  const enabledSourceNames = new Set(enabledSources.map((source) => source.source));
  return items.filter((item) => enabledSourceNames.has(item.source));
}

function filterFoodtechItemsByEnabledSources(items) {
  const enabledSources = getEnabledFoodtechSources();
  if (enabledSources.length === 0) return [];
  if (enabledSources.length === Object.keys(FOODTECH_SOURCE_CONFIG).length) {
    return items.map((item) => normalizeFoodtechSourceName(item));
  }

  return items
    .map((item) => normalizeFoodtechSourceName(item))
    .filter((item) => {
      const sourceText = `${item.source || ""} ${item.link || ""} ${item.title || ""} ${item.description || ""}`.toLowerCase();
      return enabledSources.some((sourceConfig) => {
        if (item.source === sourceConfig.source) return true;
        if (item.sourceHint === sourceConfig.source) return true;
        const matchTerms = Array.isArray(sourceConfig.sourceMatches) ? sourceConfig.sourceMatches : [];
        return matchTerms.some((term) => sourceText.includes(String(term).toLowerCase()));
      });
    });
}

function countMatchedByFilterTag(filterTag) {
  const q = state.searchText.trim().toLowerCase();
  const isRoboticsContext =
    state.selectedMainTag === "robotics" ||
    state.activeTag === "robotics";
  const isFoodtechContext =
    state.selectedMainTag === "foodtech" ||
    state.selectedCategoryTag === "foodtech" ||
    state.activeTag === "foodtech";
  const basePool = isRoboticsContext
    ? [...state.items]
    : isFoodtechContext
      ? [...state.items]
    : [...state.collectedItems, ...state.items];
  const pool = sortByDateDesc(dedupeLatestByContent(basePool))
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
      state.selectedCategoryTag === "anime" ||
      state.activeTag === "anime";
    const isVoiceContext = isVoiceContextSelected();
    const isMovieContext =
      state.selectedMainTag === "movie_live" ||
      state.selectedCategoryTag === "movie_live" ||
      state.activeTag === "movie_live";
    const isFoodtechActive =
      state.selectedMainTag === "foodtech" ||
      state.selectedCategoryTag === "foodtech" ||
      state.activeTag === "foodtech";

    if (isVoiceContext) {
      return matchesVoiceFilter(item, filterTag);
    }

    if (isAnimeContext) {
      return matchesAnimeFilter(item, filterTag);
    }

    if (isMixedAnimeGroupContext()) {
      if (item.categoryKey === "voice") return matchesVoiceFilter(item, "");
      if (item.categoryKey === "anime") return matchesAnimeFilter(item, "");
      return false;
    }

    if (isMovieContext) {
      return matchesLiveActionFilter(item, filterTag);
    }

    if (isRoboticsContext) {
      return matchesRoboticsFilter(item, filterTag);
    }

    if (isFoodtechActive) {
      return matchesFoodtechFilter(item, filterTag);
    }

    return true;
  });

  if (isRoboticsContext) {
    counted = filterRoboticsItemsByEnabledSources(counted);
    const meaningful = counted.filter((item) => isMeaningfulArticle(item));
    counted = meaningful.length > 0 ? meaningful : counted;

    if (!filterTag || filterTag === "すべて") {
      return counted.length;
    }
    if (ROBOTICS_FILTER_TAGS.includes(filterTag)) {
      return counted.filter((item) => primaryRoboticsFilterTag(item) === filterTag).length;
    }
  }

  if (isFoodtechContext) {
    counted = filterFoodtechItemsByEnabledSources(counted);
  }

  const preserveNonMeaningful = isFoodtechContext;
  if (!preserveNonMeaningful) {
    const meaningful = counted.filter((item) => isMeaningfulArticle(item));
    counted = meaningful.length > 0 ? meaningful : counted;
  }

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
    const summaryText = displaySummaryForItem(item);
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
    state.selectedCategoryTag === "anime" ||
    state.activeTag === "anime";
  const isVoiceContext = isVoiceContextSelected();
  const isFoodtechContext =
    state.selectedMainTag === "foodtech" ||
    state.selectedCategoryTag === "foodtech" ||
    state.activeTag === "foodtech";
  const isMovieContext =
    state.selectedMainTag === "movie_live" ||
    state.selectedCategoryTag === "movie_live" ||
    state.activeTag === "movie_live";
  const isRoboticsContext =
    state.selectedMainTag === "robotics" ||
    state.activeTag === "robotics";

  if (isVoiceContext) {
    target = target.filter((item) => matchesVoiceFilter(item, state.selectedFilterTag));
  }

  if (isAnimeContext) {
    target = target.filter((item) => matchesAnimeFilter(item, state.selectedFilterTag));
  }

  if (isMixedAnimeGroupContext()) {
    target = target.filter((item) => {
      if (item.categoryKey === "voice") return matchesVoiceFilter(item, "");
      if (item.categoryKey === "anime") return matchesAnimeFilter(item, "");
      return false;
    });
  }

  if (isMovieContext) {
    const strictMovieItems = target.filter((item) => matchesLiveActionFilter(item, state.selectedFilterTag));

    // 件数が少なすぎる時は、公開予定まわりの条件を少し緩めて実用件数を優先する
    if (strictMovieItems.length >= 5) {
      target = prioritizeMovieSourceMix(strictMovieItems);
    } else {
      target = prioritizeMovieSourceMix(target.filter((item) => {
        if (!isLiveActionArticleAllowed(item, { strict: false })) return false;
        if (!state.selectedFilterTag || state.selectedFilterTag === "すべて") return true;
        if (LIVE_ACTION_FILTER_TAGS.includes(state.selectedFilterTag)) {
          return primaryLiveActionFilterTag(item) === state.selectedFilterTag;
        }
        return true;
      }));
    }
  }

  if (isRoboticsContext) {
    target = target.filter((item) => {
      if (state.selectedFilterTag && ROBOTICS_FILTER_TAGS.includes(state.selectedFilterTag)) {
        return matchesRoboticsFilter(item, state.selectedFilterTag);
      }
      return isRoboticsArticleAllowed(item);
    });
  }

  if (isFoodtechContext) {
    target = filterFoodtechItemsByEnabledSources(target);
    target = target.filter((item) => {
      if (state.selectedFilterTag && FOODTECH_FILTER_TAGS.includes(state.selectedFilterTag)) {
        return matchesFoodtechFilter(item, state.selectedFilterTag);
      }
      return isFoodtechArticleAllowed(item);
    });
  }

  const meaningful = target.filter((item) => isMeaningfulArticle(item));
  target = (isMovieContext || isFoodtechContext) ? target : (meaningful.length > 0 ? meaningful : target);

  state.filteredItems = target;
  const emptyMessage = isMixedAnimeGroupContext()
    ? "声優またはアニメを選んでください。混合取得は安定優先のため停止中です。"
    : state.selectedFilterTag === "イベント"
    ? "イベント条件に合う記事がありません。全国チェーンのコラボ/展示ニュース時に表示されます。"
    : isFoodtechContext
      ? "フードテック条件に合う記事がありません。取得元やFilterを切り替えると表示されます。"
    : isRoboticsContext
      ? "ロボティクス条件に合う記事がありません。指定3サイトの90日以内の記事が入ると表示されます。"
    : isMovieContext
      ? "映画実写条件に合う記事がありません。新作映画・公開日・出演・監督の記事が入ると表示されます。"
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
  return state.activeTag === "voice";
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
    if (!isVoiceSourceEnabled()) return [];
    return fetchAllFavoriteVoiceItems();
  }

  if (tagKey === "anime") {
    const directItems = await fetchAnimeSourceItems();
    if (getEnabledAnimeSources().length === 0) return [];
    const directDisplayItems = directItems.filter((item) =>
      isWithinLookbackRange(item.publishedAt) && matchesAnimeFilter(item, "")
    );
    if (directDisplayItems.length >= CONFIG.animeMinDisplayItems) return directItems;

    appendLog(`アニメ直接取得の表示候補が${directDisplayItems.length}件のため、Googleニュース経由で補填します`);
    try {
      const fallbackItems = await fetchNewsByQueries(buildAnimeSourceFallbackQueries(), {
        key: `anime-source-fallback-${getEnabledAnimeSourceCacheKey()}`,
        actor: "",
        categoryKey: "anime",
        categoryLabel: tagLabel(tagKey)
      }, { collectAll: true });
      appendLog(`Googleニュース経由: ${fallbackItems.length}件取得`);
      return dedupeLatestByContent([...directItems, ...fallbackItems]);
    } catch (error) {
      appendLog(`Googleニュース経由も失敗: ${formatErrorMessage(error)}`);
      return directItems;
    }
  }

  if (tagKey === "foodtech") {
    const directItems = await fetchFoodtechSourceItems();
    const directDisplayItems = directItems.filter((item) =>
      isWithinLookbackRange(item.publishedAt) && matchesFoodtechFilter(item, "")
    );
    if (directDisplayItems.length >= CONFIG.foodtechMinDisplayItems) return directItems;

    try {
      const enabledFoodtechSourceNames = getEnabledFoodtechSources().map((source) => source.source);
      const fallbackItems = await fetchNewsByQueries(buildFoodtechSourceQueries(enabledFoodtechSourceNames), {
        key: `foodtech-source-fallback-${getEnabledFoodtechSourceCacheKey()}`,
        actor: "",
        categoryKey: "foodtech",
        categoryLabel: tagLabel(tagKey)
      }, { collectAll: true });
      const normalizedFallbackItems = filterFoodtechItemsByEnabledSources(fallbackItems.map((item) => normalizeFoodtechSourceName({
        ...item,
        source: item.source || "foodtech"
      })));
      const mergedItems = dedupeLatestByContent(sortByDateDesc([...directItems, ...normalizedFallbackItems]));
      if (directDisplayItems.length > 0 || normalizedFallbackItems.length > 0) {
        appendLog(`フードテック直接取得の表示候補が${directDisplayItems.length}件のため、Googleニュース経由で補填します`);
      }
      appendFoodtechDiagnostics("Googleニュース補填", normalizedFallbackItems);
      return mergedItems;
    } catch {
      return directItems;
    }
  }

  if (tagKey === "robotics") {
    const directItems = await fetchRoboticsSourceItems();
    if (directItems.length > 0) return directItems;

    try {
      const enabledRoboticsSources = getEnabledRoboticsSources();
      const enabledRoboticsSourceNames = enabledRoboticsSources.map((source) => source.source);
      const fallbackItems = await fetchNewsByQueries(buildRoboticsSourceQueries(enabledRoboticsSourceNames), {
        key: `robotics-source-fallback-${getEnabledRoboticsSourceCacheKey()}`,
        actor: "",
        categoryKey: "robotics",
        categoryLabel: tagLabel(tagKey)
      }, { collectAll: true });
      return filterRoboticsFallbackItemsByEnabledSources(fallbackItems, enabledRoboticsSources);
    } catch {
      return [];
    }
  }

  if (tagKey === "anime_group") {
    return [];
  }

  if (tagKey === "movie_live") {
    const directItems = await fetchMovieLiveSourceItems();
    if (directItems.length > 0) return directItems;

    appendLog("映画直接取得が0件のため、Googleニュース経由で補填します");
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

    if (japaneseResult.status === "fulfilled") {
      appendMovieLiveDiagnostics("Googleニュース(新作・出演)", japaneseResult.value);
    } else {
      appendLog(`Googleニュース(新作・出演): 取得失敗 (${formatErrorMessage(japaneseResult.reason)})`);
    }
    if (foreignResult.status === "fulfilled") {
      appendMovieLiveDiagnostics("Googleニュース(出演・監督)", foreignResult.value);
    } else {
      appendLog(`Googleニュース(出演・監督): 取得失敗 (${formatErrorMessage(foreignResult.reason)})`);
    }

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
    // 実写映画は新作・公開日・出演・監督の各クエリを合算する
    collectAll: tagKey === "movie_live"
  });
}

async function fetchCurrentTagNews() {
  return fetchTagItems(state.activeTag);
}

async function loadNewsForCurrentSelection() {
  syncActiveTagFromSelection();
  renderSourceFeeds();

  if (state.activeTag === "voice" && state.favorites.length === 0) {
    state.items = [];
    applyFilterAndRender();
    setStatus("お気に入り声優を追加してください。");
    return;
  }

  if (isMixedAnimeGroupContext()) {
    state.items = [];
    state.filteredItems = [];
    applyFilterAndRender();
    setStatus("声優またはアニメを選んでください。");
    return;
  }

  ui.refreshBtn.disabled = true;
  const requestTag = state.activeTag;
  const animeSourceCacheKey = getEnabledAnimeSourceCacheKey();
  const foodtechSourceCacheKey = getEnabledFoodtechSourceCacheKey();
  const roboticsSourceCacheKey = getEnabledRoboticsSourceCacheKey();
  const voiceSourceCacheKey = isVoiceSourceEnabled() ? VOICE_SOURCE_FEED : "__no_voice_source__";
  const favoriteVoiceCacheKey = `${state.favorites.join("|")}::${voiceSourceCacheKey}`;
  const actor = requestTag === "voice"
    ? favoriteVoiceCacheKey
    : requestTag === "anime_group"
      ? `anime=${animeSourceCacheKey}::voice=${favoriteVoiceCacheKey}`
      : requestTag === "anime"
        ? animeSourceCacheKey
    : requestTag === "foodtech"
      ? foodtechSourceCacheKey
    : requestTag === "robotics"
      ? roboticsSourceCacheKey
      : "";
  const label = tagLabel(requestTag);
  const requestSeq = ++state.loadRequestSeq;
  const disableStableCache =
    (requestTag === "robotics" && isSingleRoboticsSourceSelection()) ||
    (requestTag === "foodtech" && isSingleFoodtechSourceSelection());

  const stableCachedItems = disableStableCache ? [] : readStableCachedNews(requestTag, actor);
  const cachedItems = stableCachedItems.length > 0 ? stableCachedItems : readCachedNews(requestTag, actor);
  let cachedVisibleCount = 0;
  if (cachedItems.length > 0) {
    state.items = cachedItems;
    applyFilterAndRender();
    cachedVisibleCount = state.filteredItems.length;
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
    if (requestSeq !== state.loadRequestSeq || requestTag !== state.activeTag) {
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
      ? prioritizeRoboticsSourceMix(candidates, itemLimit)
      : requestTag === "foodtech"
        ? filterFoodtechItemsByEnabledSources(candidates).slice(0, itemLimit)
      : requestTag === "anime_group"
        ? sortByDateDesc([
          ...candidates.filter((item) => item.categoryKey === "voice").slice(0, 10),
          ...candidates.filter((item) => item.categoryKey === "anime").slice(0, 5)
        ])
        : candidates.slice(0, itemLimit);

    state.items = normalized;
    applyFilterAndRender();
    const freshVisibleCount = state.filteredItems.length;

    if (shouldKeepCachedNews(requestTag, normalized, cachedItems, freshVisibleCount, cachedVisibleCount)) {
      state.items = cachedItems;
      applyFilterAndRender();
      appendLog(`${label}: 最新表示${freshVisibleCount}件が少ないため前回表示${state.filteredItems.length}件を維持`);
      setStatus(`最新取得が少ないため、${label}の前回データを表示しています。`, true);
      return;
    }

    if (state.filteredItems.length > 0) {
      writeCachedNews(requestTag, actor, normalized);
      writeStableCachedNews(requestTag, actor, normalized);
    } else if (requestTag === "robotics" && isSingleRoboticsSourceSelection()) {
      writeCachedNews(requestTag, actor, normalized);
      clearStableCachedNews(requestTag, actor);
      appendLog(`${label}: 単一収集元で0件のため前回stable cacheをクリア`);
    } else if (requestTag === "foodtech" && isSingleFoodtechSourceSelection()) {
      writeCachedNews(requestTag, actor, normalized);
      clearStableCachedNews(requestTag, actor);
      appendLog(`${label}: 単一収集元で0件のため前回stable cacheをクリア`);
    } else if (["anime", "anime_group", "voice"].includes(requestTag)) {
      appendLog(`${label}: 表示0件のためキャッシュ更新を停止`);
    } else {
      writeCachedNews(requestTag, actor, normalized);
    }
    if (requestTag === "anime" || requestTag === "anime_group" || requestTag === "movie_live" || requestTag === "robotics" || requestTag === "foodtech") {
      appendLog(`${label}: 取得${fetched.length}件 / 90日以内${candidates.length}件 / 表示${state.filteredItems.length}件`);
    }
    setStatus(`${label}ニュースを ${state.filteredItems.length} 件表示中`);
  } catch (error) {
    console.error(error);
    if (requestSeq !== state.loadRequestSeq || requestTag !== state.activeTag) {
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
    const summary = stripHtml(item.summary || "");
    state.savedMap.set(item.link, {
      apiReadyVersion: 1,
      actor: item.actor,
      category: item.category,
      categoryKey: item.categoryKey,
      title: item.title,
      link: item.link,
      publishedAt: item.publishedAt,
      description: item.description,
      source: item.source,
      summary,
      summaryStatus: summary ? summaryStatusForItem(item) : "pending",
      summaryUpdatedAt: summary ? new Date().toISOString() : "",
      tags: inferTags(item)
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
  state.selectedCategoryTag = defaultCategoryForMain(state.selectedMainTag);
  resetViewForCategorySwitch();
  syncSelectedFilterTagToContext();
  saveTagSelection();
  renderMainTagChips();
  renderCategoryTagChips();
  renderFilterTagChips();
  renderSourceFeeds();
  loadNewsForCurrentSelection();
});

ui.categoryTagChips.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-category-tag]");
  if (!btn) return;

  const key = btn.dataset.categoryTag;
  state.selectedCategoryTag = normalizeCategoryForMain(state.selectedMainTag, key);
  resetViewForCategorySwitch();
  syncSelectedFilterTagToContext();
  saveTagSelection();
  renderCategoryTagChips();
  renderFilterTagChips();
  renderSourceFeeds();
  loadNewsForCurrentSelection();
});

ui.filterTagChips.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-filter-tag]");
  if (!btn) return;

  const tag = btn.dataset.filterTag;
  state.selectedFilterTag = state.selectedFilterTag === tag ? "すべて" : tag;
  syncSelectedFilterTagToContext();
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

  if (
    isAnimeContextSelected() ||
    state.selectedMainTag === "robotics" ||
    state.activeTag === "robotics" ||
    state.selectedMainTag === "foodtech" ||
    state.selectedCategoryTag === "foodtech" ||
    state.activeTag === "foodtech"
  ) {
    loadNewsForCurrentSelection();
  }
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
