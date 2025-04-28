export type ValueOf<T> = T[keyof T];

export type Translation = {
  id?: string;
  article?: ReadabilityArticle;
  translation?: ReadabilityArticleTranslated;
  activeAudio?: HTMLAudioElement;
};

export type TranslationStorage = Translation & {
  theme: 'light' | 'dark';
  storedTranslations: Translation[];
};

export type TranslationsStorage = TranslationStorage[];

export type ReadabilityArticle = {
  title: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  byline: string;
  dir: string;
  siteName: string;
  lang: string;
  publishedTime: string;
} | null;

export type ReadabilityArticleTranslated = Partial<{
  title: TranslationResult;
  // content: Result;
  content: string;
  textContent: TranslationResult;
  length: number;
  excerpt: TranslationResult;
  byline: TranslationResult;
  dir: string;
  siteName: string;
  lang: string;
  publishedTime: string;
}> | null;

export type TranslationResult = {
  text: string;
  textArray: string[];
  pronunciation: string;
  hasCorrectedLang: boolean;
  src: string;
  hasCorrectedText: boolean;
  correctedText: string;
  translations: [];
  raw: string[][][];
};
