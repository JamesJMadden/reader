import React, { useCallback, useState } from 'react';
import tr from 'googletrans';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import type { ReadabilityArticleTranslated, ReadabilityArticle } from '@extension/shared';
import { translationStorage } from '@extension/storage';
import { Button } from '@extension/ui';
import * as AudioPlayer from '@src/AudioPlayer';
import * as Reader from '@src/Reader';
import '@fontsource/roboto/400.css';
import '@src/Popup.css';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/16/solid';
import { Cog6ToothIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import GoogleLogo from '../public/logo_google.svg';

const tab = {
  active: true,
  audible: false,
  autoDiscardable: true,
  discarded: false,
  favIconUrl: 'https://static.guim.co.uk/images/favicon-32x32.ico',
  groupId: -1,
  height: 958,
  highlighted: true,
  id: 1274639158,
  incognito: false,
  index: 9,
  lastAccessed: 1728759540259.038,
  mutedInfo: {
    muted: false,
  },
  openerTabId: 1274639153,
  pinned: false,
  selected: true,
  status: 'complete',
  title: 'Fears for future of ski tourism as resorts adapt to thawing snow season | Ski resorts | The Guardian',
  url: 'https://www.theguardian.com/travel/2024/oct/12/fears-for-future-of-ski-tourism-as-resorts-adapt-to-thawing-snow-season',
  width: 1728,
  windowId: 1274638990,
};

/**
 * @description Translates and article into target language
 * @param article Source article object to translate from.
 * @param language Target language to translate. Defaults to Irish(ga)
 */
const translateArticle = async (article: ReadabilityArticle, language = 'ga') => {
  const translation: ReadabilityArticleTranslated = {};

  translation.textContent = await tr([article?.['textContent'] || ''], language);
  translation.excerpt = await tr([article?.['excerpt'] || ''], language);
  translation.title = await tr([article?.['title'] || ''], language);

  // TODO: google translate api returns 400 for html content but could be useful to convert to Speech Synthesis
  //  Markup Language (SSML)
  // translation.content = (await tr([article?.['content'] || ''], 'ga')).text;

  await translationStorage.set(prevState => ({ ...prevState, translation }));

  return translation;
};

/**
 * @description Tests the current tab to see if the page contains content worth reading.
 */
const checkPageForReadability = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const pageHasMeaningfulResult = await chrome.tabs.sendMessage(Number(tab.id), {
    action: 'check-page-for-readability',
  });

  console.log('%c TEST: Popup.checkPageForReadability', 'background-color:black;color:deeppink;padding:8px', {
    pageHasMeaningfulResult,
    tab,
  });

  return pageHasMeaningfulResult;
};

/**
 * @description Reads the current page for an article, translates that article and generates audio of that translation.
 */
const generateAudioFromPage = async ({ voice }: { voice: string }) => {
  try {
    // PREPARE TRANSLATED TEXT TO SEND TO tts API
    // -----------------------------------------------------------------------------------------------------------------
    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    console.trace('%c TEST: Popup.generateAudioFromPage', 'background-color:black;color:deeppink;padding:8px', tab);

    // Get the current article content from the active tab
    const article = await chrome.tabs.sendMessage(Number(tab.id), { action: 'read-article' });

    console.trace('%c TEST: Popup.generateAudioFromPage', 'background-color:black;color:deeppink;padding:8px', article);

    // Translate the article content
    const translation = await translateArticle(article);

    // Open the extension side panel
    const sidePanel = await chrome.sidePanel.open({ windowId: tab.windowId });

    console.log('%c TEST: Popup.onClickHandler.translation.pre', 'background-color:black;color:pink;padding:8px', {
      translation,
      article,
      tab,
      sidePanel,
    });

    // MAKE REQUEST TO GENERATE AUDIO FROM ARTICLE TEXT CONTENT
    // -----------------------------------------------------------------------------------------------------------------
    const response = await fetch('http://localhost:3001/api/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: `tts-file_${new Date().getTime()}`,
        voice,
        textContent: translation.textContent?.text,
      }),
    });

    // SET UP AUDIO ELEMENT IN OFFSCREEN DOCUMENT
    // -----------------------------------------------------------------------------------------------------------------
    // Grab audio blob and covert to object URL
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Create and play audio element in offscreen document
    const messageResponse = await chrome.runtime.sendMessage({
      action: 'create-audio',
      data: { src: url },
    });

    // SET NEW TRANSLATION TO STATE
    // -----------------------------------------------------------------------------------------------------------------
    if (messageResponse.action !== 'error') {
      await translationStorage.set(prevState => {
        const newTranslation = {
          id: String(Date.now()),
          article,
          translation,
          activeAudio: messageResponse.activeAudio,
        };

        return {
          ...prevState,
          ...newTranslation,
          storedTranslations: [...prevState.storedTranslations, newTranslation],
        };
      });
    }

    console.log('%c TEST: Popup.onClickHandler.translation.post', 'background-color:black;color:pink;padding:8px', {
      response,
      messageResponse,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * @description The main Popup Component
 * @constructor
 */
const Popup = () => {
  const [view, setView] = useState('reader');
  const [tabInfo, setTabInfo] = useState<chrome.tabs.Tab | null>();
  const [voice, setVoice] = useState('ga-IE-ColmNeural');
  const [isPageReadable, setIsPageReadable] = useState(null);
  const readPage = useCallback(async () => void generateAudioFromPage({ voice }), [voice]);
  const checkPage = useCallback(async () => setIsPageReadable(await checkPageForReadability()), []);
  const getTabInfo = useCallback(async () => {
    // Reset tab info
    setTabInfo(null);

    // Fetch new tab info
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await new Promise(r => setTimeout(r, 300));

    setTabInfo(tab);
  }, []);
  const storage = useStorage(translationStorage);

  console.log('%c TEST: Popup 2', 'background-color:black;color:green;padding:8px', {
    storage,
    href: window.location.href,
    tabInfo,
  });

  React.useEffect(() => {
    void checkPage();
    void getTabInfo();
  }, [checkPage, getTabInfo]);

  return (
    <>
      <AudioPlayer.Main>
        <AudioPlayer.Header
          title={'Test Title'}
          description={'A dest description of the current translation'}
          onClickBack={() => setView('reader')}
          onClickMenu={() => setView('menu')}
        />
        <AudioPlayer.Track audio={storage?.activeAudio} />
        <AudioPlayer.Controls />
      </AudioPlayer.Main>

      <hr />

      <Reader.Main>
        <div className="reader-header">
          <div className="reader-header-text">
            <p>{tabInfo?.title}</p>
            <small>Read this pages and listen to it in Irish.</small>
          </div>
          <div className="reader-header-actions">
            <Button onClick={() => setView('menu')} icon={<ListBulletIcon className="size-8" />} />
            <Button onClick={() => setView('settings')} icon={<Cog6ToothIcon className="size-8" />} />
          </div>
        </div>

        <div className="reader-action">
          <Button
            onClick={readPage}
            variant="outline"
            disabled={!isPageReadable}
            icon={<PlusIcon className="size-6" />}>
            Read Page
          </Button>

          <Button
            onClick={checkPage}
            variant="outline"
            loading={!tabInfo}
            icon={<ArrowPathIcon className="size-6" />}
          />
        </div>
      </Reader.Main>

      <hr />

      <main>
        <p>General settings related to account, translation and playback.</p>

        <select className="" onChange={e => setVoice(e.target.value)} value={voice}>
          <option value="ga-IE-ColmNeural">Colm</option>
          <option value="ga-IE-OrlaNeural">Orla</option>
        </select>
      </main>

      <hr />

      <main>
        <p>Login</p>
        <input type="email" />
        <input type="password" />
        <Button icon={<img width={24} src={GoogleLogo} alt="Google Logo" />}>Sign In With Google</Button>
      </main>

      <hr />

      <main>
        <p>A list of previously saved translations.</p>
      </main>
    </>
  );

  // return (() => {
  //
  //   // -----------------------------------------------------------------------------------------------------------------
  //   switch (view) {
  //
  //     case 'player': {
  //       return (
  //         <AudioPlayer.Main>
  //           <AudioPlayer.Header
  //             title={'Test Title'}
  //             description={'A dest description of the current translation'}
  //             onClickBack={() => setView('reader')}
  //             onClickMenu={() => setView('menu')}
  //           />
  //           <AudioPlayer.Track
  //             audio={storage?.activeAudio}
  //           />
  //           <AudioPlayer.Controls />
  //         </AudioPlayer.Main>
  //       );
  //     }
  //
  //     // -----------------------------------------------------------------------------------------------------------
  //     case 'settings': {
  //       return (
  //         <main><p>General settings related to account, translation and playback.</p></main>
  //       );
  //     }
  //
  //     // -----------------------------------------------------------------------------------------------------------
  //     case 'menu': {
  //       return (
  //         <main><p>A list of previously saved translations.</p></main>
  //       );
  //     }
  //
  //     // -----------------------------------------------------------------------------------------------------------
  //     case 'reader':
  //     default: {
  //       return (
  //         <Reader.Main>
  //           <Button
  //             onClick={readPage}
  //             variant="outline"
  //             disabled={!isPageReadable}
  //             icon={<PlusIcon className="size-6" />}
  //           >
  //             Read Page
  //           </Button>
  //           <Button
  //             onClick={checkPage}
  //             variant="outline"
  //             icon={<ArrowPathIcon className="size-6" />}
  //           />
  //           <select
  //             className=""
  //             onChange={(e) => setVoice(e.target.value)}
  //             value={voice}
  //           >
  //             <option value="ga-IE-ColmNeural">Colm</option>
  //             <option value="ga-IE-OrlaNeural">Orla</option>
  //           </select>
  //         </Reader.Main>
  //       );
  //     }
  //   }
  // })();
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
