export const AUTHORIZE_URL = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.TWITCH_REDIRECT_URI}&response_type=token&scope=user:read:follows`;

export const LANGUAGE_OPTIONS = [
  {
    value: "en",
    title: "English",
  },
  {
    value: "id",
    title: "Bahasa Indonesia",
  },
  {
    value: "ca",
    title: "Català",
  },
  {
    value: "da",
    title: "Dansk",
  },
  {
    value: "de",
    title: "Deutsch",
  },
  {
    value: "es",
    title: "Español",
  },
  {
    value: "fr",
    title: "Français",
  },
  {
    value: "it",
    title: "Italiano",
  },
  {
    value: "hu",
    title: "Magyar",
  },
  {
    value: "nl",
    title: "Nederlands",
  },
  {
    value: "no",
    title: "Norsk",
  },
  {
    value: "pl",
    title: "Polski",
  },
  {
    value: "pt",
    title: "Português",
  },
  {
    value: "ro",
    title: "Română",
  },
  {
    value: "sk",
    title: "Slovenčina",
  },
  {
    value: "fi",
    title: "Suomi",
  },
  {
    value: "sv",
    title: "Svenska",
  },
  {
    value: "tl",
    title: "Tagalog",
  },
  {
    value: "vi",
    title: "Tiếng Việt",
  },
  {
    value: "tr",
    title: "Türkçe",
  },
  {
    value: "cs",
    title: "Čeština",
  },
  {
    value: "el",
    title: "Ελληνικά",
  },
  {
    value: "bg",
    title: "Български",
  },
  {
    value: "ru",
    title: "Русский",
  },
  {
    value: "uk",
    title: "Українська",
  },
  {
    value: "ar",
    title: "العربية",
  },
  {
    value: "ms",
    title: "بهاس ملايو",
  },
  {
    value: "hi",
    title: "मानक हिन्दी",
  },
  {
    value: "th",
    title: "ภาษาไทย",
  },
  {
    value: "zh",
    title: "中文",
  },
  {
    value: "ja",
    title: "日本語",
  },
  {
    value: "zh-hk",
    title: "粵語",
  },
  {
    value: "ko",
    title: "한국어",
  },
  {
    value: "asl",
    title: "American Sign Language",
  },
  {
    value: "other",
    title: "Other",
  },
];

export enum ClickAction {
  OpenChannel,
  OpenChat,
  Popout,
}

export enum ClickBehavior {
  CreateTab,
  CreateWindow,
}
