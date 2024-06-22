import { stopSpeech } from "./misc";
import { GoogleVoiceName } from "./speak";

// region:    --- SpeechSynthesis

export interface ISpeakSynthesis {
  text: string;
  volume: number;
  selectedVoice: SpeechSynthesisVoice;
  stopCurrentSpeech: boolean;
  pitch: number;
  rate: number;
}

export async function speakSpeechSynthesisUtterance({
  text,
  volume,
  selectedVoice,
  stopCurrentSpeech,
  pitch,
  rate,
}: ISpeakSynthesis) {
  if (stopCurrentSpeech) {
    stopSpeech();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.voice = selectedVoice; // Choose a specific voice
  utterance.volume = volume / 100;
  utterance.lang = utterance.voice.lang;
  utterance.pitch = pitch;
  utterance.rate = rate;

  await speakUtterance(utterance);
}

function speakUtterance(utterance: SpeechSynthesisUtterance) {
  return new Promise((res) => {
    speechSynthesis.speak(utterance);
    utterance.onend = res;
  });
}

export interface IListVoicesReturn {
  /**
   * The list of Speech Synthesis voices filtered
   * by the specified language tag, if provided.
   */
  filteredVoices: SpeechSynthesisVoice[];
  /**
   * The complete list of available
   * Speech Synthesis voices in the browser.
   */
  voices: SpeechSynthesisVoice[];
  /**
   * The names of the filtered voices,
   * with "Google Voice" appended.
   */
  filteredVoiceNames: string[];
  /**
   * The names of all available voices,
   * with "Google Voice" appended.
   */
  voiceNames: string[];
}

/**
 * Lists every available voice in current browser.
 *
 * @param lng Can be set to the first letters (before "-") of any {@link https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1 BCP 47} language (e.g. "en" or "EN") for filtered results.
 */
export function listVoices(lng?: string): IListVoicesReturn {
  const voices = speechSynthesis.getVoices();

  const filteredVoices = lng?.length
    ? voices.filter(
        (v) =>
          v.lang.toLowerCase().startsWith(`${lng.toLowerCase()}-`) ||
          v.lang.toLowerCase().startsWith(`${lng.toLowerCase()}_`)
      )
    : voices;
  const filteredVoiceNames = filteredVoices.map((v) => v.name);
  const voiceNames = voices.map((v) => v.name);
  filteredVoiceNames.push(GoogleVoiceName);
  voiceNames.push(GoogleVoiceName);

  return {
    filteredVoices,
    voices,
    filteredVoiceNames,
    voiceNames,
  } satisfies IListVoicesReturn;
}

/**
 * Check if browser supports
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis SpeechSynthesis}.
 */
export function checkSpeechSynthesisCompatibility(lng?: string): boolean {
  return listVoices(lng).filteredVoices.length > 1;
}
export { checkSpeechSynthesisCompatibility as isSpeechSynthesisCompatible };

// endregion: --- SpeechSynthesis
