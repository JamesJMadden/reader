import { SpeechConfig, AudioConfig, SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';
import type { SpeechSynthesisResult } from 'microsoft-cognitiveservices-speech-sdk';
import fs from 'fs';
import path from 'path';

const SpeechSynthesis = ({
  fileName = 'speechSynthesis',
  voice = 'ga-IE-OrlaNeural',
  textContent = 'The quick brown fox jumps over the lazy dog near the bank of the river.',
  subscriptionKey = '',
  region = '',
}: {
  fileName: string;
  voice: 'ga-IE-OrlaNeural' | 'ga-IE-ColmNeural';
  textContent: string;
  subscriptionKey?: string;
  region?: string;
}) => {
  console.log(`SpeechSynthesis: Starting...`);
  const filename = `${fileName}.wav`;
  const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region);
  const audioConfig = AudioConfig.fromAudioFileOutput(filename);

  // The language of the voice that speaks.
  speechConfig.speechSynthesisVoiceName = voice;

  // Create the speech synthesizer.
  const speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

  const generateFile = (resolve: (value: SpeechSynthesisResult) => void, reject: (value?: unknown) => void) => {
    try {
      console.log(`SpeechSynthesis: Generate file started...`);

      speechSynthesizer.speakTextAsync(
        textContent,
        result => {
          speechSynthesizer.close();

          if (result) {
            // Save audio data to file
            fs.createReadStream(`${fileName}.wav`);

            // Move file to speeches directory
            fs.rename(
              path.resolve(`./${filename}`),
              path.resolve(process.cwd(), `./server/speeches/${filename}`),
              e => {
                console.log(`SpeechSynthesis: renamed file - ${filename}`, e || 'Success');
              },
            );

            return resolve(result);
          }
        },
        error => {
          console.log('SpeechSynthesis: SpeakTextAsync Error - ', error);
          speechSynthesizer.close();
          reject(error);
        },
      );
    } catch (error) {
      console.log('SpeechSynthesis: Error - ', error);
      reject(error);
    }
  };

  return new Promise(generateFile);
};

export default SpeechSynthesis;
