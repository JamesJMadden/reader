import 'webextension-polyfill';

/**
 * @description Sets up an offscreen document, which we can play audio in, and forwards the service worker message to
 * this offscreen document. Using an offscreen document is currently the only way to play audio 100% in the background,
 * without creating a new tab, injecting content scripts or keeping the popup or sidebar open for the whole duration.
 */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  // ENSURE THERE IS AN ACTIVE OFFSCREEN DOCUMENT
  // -------------------------------------------------------------------------------------------------------------------
  if (!(await chrome.offscreen.hasDocument())) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
      justification: 'Play an audio file of translated text received via tts api.',
    });
  }

  // HANDLE AUDIO CONTROL MESSAGES AND FORWARD THEM TO OFFSCREEN DOCUMENT
  // -------------------------------------------------------------------------------------------------------------------
  try {
    switch (message.action) {
      case 'create-audio':
      case 'play-audio':
      case 'stop-audio':
      case 'reset-audio':
      case 'seek-audio':
      case 'toggle-mute-audio': {
        console.log(`%c TEST: background.index.${message}`, 'background-color:black;color:skyblue;padding:8px', {
          message,
          sender,
          sendResponse,
        });

        // Forward message to offscreen document
        const response = await chrome.runtime.sendMessage({
          action: `${message}-offscreen`,
          target: 'offscreen-doc',
          data: message,
        });

        // Propagate the response from the offscreen document back to the source of the message event.
        sendResponse(response);
        break;
      }

      default: {
        console.error('No action provided');
      }
    }
  } catch (error) {
    sendResponse({ action: 'error', data: error });
  }
});
