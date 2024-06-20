export const GoogleVoiceName = "Google Voice" as const;

// region:    --- Main speak

export interface ISpeak {
  /** Text for TTS */
  text: string;
  /** Spoken language by TTS */
  lng: string;
  /**
   * Value from 0 - 100.
   *
   * If 0, TTS will not start.
   */
  volume: number;
  /**
   * Voice name for TTS.
   *
   * Available voice names can be find by provided function listVoices().
   *
   * For Google TTS, set "Google Voice" as voiceName.
   */
  voiceName: string | undefined;
}

/**
 * There are two types of TTS which this function can play.
 * - If you set opts.voiceName to "Google Voice" or some invalid value,
 * the function will set URL for requesting Google translate API that returns playable
 * sound file to hidden audio player and play it.
 * - If you set valid voice name to opts.voiceName, the TTS will be played
 * from {@link https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis Web Speech API}.
 *
 * Valid voice names can be retrieved by listVoices() function.
 *
 * @param {ISpeak} opts Options for TTS
 *
 */
export function speak(opts: ISpeak) {
  const { text, lng, volume, voiceName } = opts;

  if (!volume || volume > 100 || volume < 0) return;

  let voices = listVoices(lng).filteredVoices;

  const selectedVoice = voices.find((v) => v.name === voiceName);

  if ((selectedVoice || voices[0]) && voiceName !== GoogleVoiceName) {
    speakSpeechSynthesisUtterance({ text, volume, voices, selectedVoice });
  } else {
    speakGoogleTTS({ text, lng, volume });
  }
}
// endregion: --- Main speak

// region:    --- SpeechSynthesis

export interface ISpeakSynthesis {
  text: string;
  volume: number;
  voices: SpeechSynthesisVoice[];
  selectedVoice?: SpeechSynthesisVoice;
}

export function speakSpeechSynthesisUtterance(opts: ISpeakSynthesis) {
  const { text, voices, volume, selectedVoice } = opts;

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.voice = selectedVoice ? selectedVoice : voices[0]; // Choose a specific voice
  utterance.volume = volume / 100;
  utterance.lang = utterance.voice.lang;

  speechSynthesis.speak(utterance);
}

/**
 * This lists every available voice in current browser
 *
 *
 * @param lng Can be set to first two letters of any {@link https://www.techonthenet.com/js/language_tags.php BCP 47} language
 *
 * @returns
 * @returns {SpeechSynthesisVoice[]} return.filteredVoices - The list of voices filtered by the specified language tag, if provided.
 * @returns {SpeechSynthesisVoice[]} return.voices - The complete list of available voices in the browser.
 * @returns {string[]} return.filteredVoicesNames - The names of the filtered voices, with "Google Voice" appended.
 * @returns {string[]} return.voiceNames - The names of all available voices, with "Google Voice" appended.
 */
export function listVoices(lng?: string) {
  const voices = speechSynthesis.getVoices();

  const filteredVoices = lng?.length
    ? voices.filter(
        (v) =>
          v.lang.toLowerCase().startsWith(`${lng.toLowerCase()}-`) ||
          v.lang.toLowerCase().startsWith(`${lng.toLowerCase()}_`)
      )
    : voices;
  const filteredVoicesNames = filteredVoices.map((v) => v.name);
  const voiceNames = voices.map((v) => v.name);
  filteredVoicesNames.push(GoogleVoiceName);
  voiceNames.push(GoogleVoiceName);

  return {
    filteredVoices,
    voices,
    filteredVoicesNames,
    voiceNames,
  };
}

export function checkSpeechSynthesisCompatibility(lng?: string): boolean {
  return listVoices(lng).filteredVoices.length > 1;
}

// endregion: --- SpeechSynthesis

// region:    --- Google TTS

export interface IGoogleTTS {
  text: string;
  lng: string;
  volume: number;
}

export function speakGoogleTTS(opts: IGoogleTTS) {
  const { lng, text, volume } = opts;

  const audioEl = document.getElementById("tts-audio") as HTMLAudioElement;

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lng}&client=tw-ob&q="${text}"`;

  if (audioEl) {
    audioEl.src = url;
    audioEl.volume = volume / 100;

    audioEl.play();
  }
}

// endregion: --- Google TTS
