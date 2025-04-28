import { translationStorage } from '@extension/storage';

/**
 * @description Handles audio event messages to control the audio playback element.
 */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
    // Ignore messages not intended for the offscreen document
    if (message.target !== 'offscreen-doc') return;

    // Check if we already have an audio element in state
    let audio = (await translationStorage.get())?.activeAudio;

    console.log(`%c TEST: offscreen.index.${message.action}`, 'background-color:black;color:skyblue;padding:8px', {
      message,
      sender,
      sendResponse,
      audio,
    });

    switch (message.action) {
      // CREATES A NEW AUDIO ELEMENT AND SAVE TO STORAGE
      // ---------------------------------------------------------------------------------------------------------------
      case 'create-audio-offscreen': {
        audio = new Audio(message.data.src);
        audio.play().catch(error => {
          throw error;
        });
        break;
      }

      // PLAYS THE AUDIO ELEMENT
      // ---------------------------------------------------------------------------------------------------------------
      case 'play-audio-offscreen': {
        if (audio)
          audio.play().catch(error => {
            throw error;
          });
        break;
      }

      // PAUSES THE AUDIO ELEMENT
      // ---------------------------------------------------------------------------------------------------------------
      case 'stop-audio-offscreen': {
        audio?.pause();
        break;
      }

      // RESET AUDIO BACK TO BEGINNING
      // ---------------------------------------------------------------------------------------------------------------
      case 'reset-audio-offscreen': {
        if (audio) audio.currentTime = 0;
        break;
      }

      // SET AUDIO PLAYBACK TO SPECIFIC TIME
      // ---------------------------------------------------------------------------------------------------------------
      case 'seek-audio-offscreen': {
        if (audio) audio.currentTime = audio.duration * (message.data.seekTo / 100);
        break;
      }

      // MUTE/UNMUTE AUDIO
      // ---------------------------------------------------------------------------------------------------------------
      case 'toggle-mute-audio-offscreen': {
        if (audio) audio.muted = !audio.muted;
        break;
      }
    }

    if (!audio) return sendResponse({ action: 'error', data: Error('No audio element') });

    sendResponse({ action: 'OK', data: audio });
  } catch (error) {
    sendResponse({ action: 'error', data: error });
  }
});
