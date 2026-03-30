export interface VocabularyEntry {
  estonian: string;
  english: string;
  audio?: string;
}

export type Vocabulary = Record<string, VocabularyEntry>;

export const DAY_VOCABULARY: Vocabulary = {
  bench: {
    estonian: "pink",
    english: "bench",
    audio: "/audio/pink.mp3",
  },
  canoe: {
    estonian: "kanuu",
    english: "canoe",
    audio: "/audio/kanuu.mp3",
  },
  flowers: {
    estonian: "lilled",
    english: "flowers",
    audio: "/audio/lilled.mp3",
  },
  mushrooms: {
    estonian: "seened",
    english: "mushrooms",
    audio: "/audio/seened.mp3",
  },
  stone: {
    estonian: "kivi",
    english: "stone",
    audio: "/audio/kivi.mp3",
  },
  tree: {
    estonian: "puu",
    english: "tree",
    audio: "/audio/puu.mp3",
  },
  path: {
    estonian: "teerada",
    english: "path",
    audio: "/audio/teerada.mp3",
  },
  fence: {
    estonian: "aed",
    english: "fence",
    audio: "/audio/aed.mp3",
  },
};

export const NIGHT_VOCABULARY: Vocabulary = {
  frog: {
    estonian: "konn",
    english: "frog",
    audio: "/audio/konn.mp3",
  },
  deer: {
    estonian: "hirv",
    english: "deer",
    audio: "/audio/hirv.mp3",
  },
  owl: {
    estonian: "öökull",
    english: "owl",
    audio: "/audio/ookull.mp3",
  },
  campfire: {
    estonian: "lõke",
    english: "campfire",
    audio: "/audio/loke.mp3",
  },
  tent: {
    estonian: "telk",
    english: "tent",
    audio: "/audio/telk.mp3",
  },
  moon: {
    estonian: "kuu",
    english: "moon",
    audio: "/audio/kuu.mp3",
  },
};
