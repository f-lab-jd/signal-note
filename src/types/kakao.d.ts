type KakaoShareScrapPayload = {
  requestUrl: string;
};

interface KakaoShare {
  sendScrap(payload: KakaoShareScrapPayload): void;
}

interface KakaoSDK {
  init(appKey: string): void;
  isInitialized(): boolean;
  Share?: KakaoShare;
}

interface Window {
  Kakao?: KakaoSDK;
}
