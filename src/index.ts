export const GoogleVoiceName = "Google Voice" as const;
export const AudioElementId = "easy-tts-audio" as const;

// region:    --- Main speak

export interface ISpeak {
  /** Text for TTS */
  text: string;
  /**
   * Spoken language by TTS
   *
   * Must be set to the first letters (before "-") of any
   * {@link https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1 BCP 47} language
   * (e.g. "en" or "EN").
   *
   * */
  lng: string;
  /**
   * Value ranges **between 0 and 100**.
   *
   * If `0`, TTS will not start at all.
   */
  volume: number;
  /**
   * Voice name of TTS.
   *
   * Available voice names can be find by provided function `listVoices()`.
   *
   * For Google TTS, set "Google Voice" as `voiceName`.
   *
   * **If `voiceName` isn't provided, the first available
   * voice on a device will be selected.**
   */
  voiceName?: string;
  /**
   * Stops current speech and starts a new one.
   *
   * Google TTS ( `{voiceName: "Google Voice"}` ) is
   * always cancelled
   *
   * @default true
   */
  stopCurrentSpeech?: boolean;
  /**
   * Pitch of the voice.
   * Works only for Speech Synthesis API (not for "Google Voice").
   *
   *
   * Some voices don't support pitch.
   * For example Microsoft voices with "(natural)"
   * in their name.
   *
   * **Ranges between 0 - 2.**
   *
   * @default 1
   */
  pitch?: number;
  /**
   * Speed of voice
   *
   * For "Google Voice" as `voiceName`, it's recommended
   * to use a value of 0.6 as a minimum and 5 as a maximum. You can
   * force any minimum for "Google Voice" by setting forceGoogleMinRate.
   *
   * **Ranges between 0.1 and 10.**
   *
   * @default 1
   */
  rate?: number;
  /**
   * Sets the minimum posible rate for "Google Voice"
   * as `voiceName`. It's recommended to set 0.6.
   *
   * **Ranges between 0.1 and 10.**
   */
  forceGoogleMinRate?: number;
  /**
   * Sets the maximum posible rate for "Google Voice"
   * as `voiceName`. It's recommended to set 7.
   *
   * **Ranges between 0.1 and 10.**
   */
  forceGoogleMaxRate?: number;
}

/**
 * There are two types of TTS which this function can play.
 * - If you set `opts.voiceName` to "Google Voice" or some invalid value,
 * the function will set URL for requesting Google translate API that returns playable
 * sound file to hidden audio player and play it.
 * - If you set valid voice name to `opts.voiceName`, the TTS will be played
 * from {@link https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis Web Speech API}.
 *
 * Valid voice names can be retrieved by `listVoices()` function.
 *
 * @param {ISpeak} opts Options for TTS
 *
 */
export function speak({
  text,
  lng,
  volume,
  voiceName,
  stopCurrentSpeech = true,
  pitch = 1,
  rate = 1,
  forceGoogleMinRate,
  forceGoogleMaxRate,
}: ISpeak) {
  if (!volume) return;

  if (volume && (volume > 100 || volume < 0)) {
    console.warn("Volume must be between 0 and 100");
    volume = 100;
  }
  if (pitch && (pitch > 2 || pitch < 0)) {
    console.warn("Pitch must be between 0 and 2");
    pitch = 1;
  }
  if (rate && (rate > 10 || rate < 0.1)) {
    console.warn("Rate must be between 0.1 and 10");
    rate = 1;
  }
  if (typeof stopCurrentSpeech !== "boolean") {
    stopCurrentSpeech = true;
  }

  if (
    forceGoogleMaxRate &&
    forceGoogleMinRate &&
    forceGoogleMaxRate < forceGoogleMinRate
  ) {
    console.error(
      "forceGoogleMinRate can't be set to higher value than forceGoogleMaxRate"
    );
    return;
  }

  let filteredVoices = listVoices(lng).filteredVoices;

  const selectedVoice =
    filteredVoices.find((v) => v.name === voiceName) || filteredVoices[0];

  if (
    selectedVoice &&
    selectedVoice.name !== GoogleVoiceName &&
    voiceName !== GoogleVoiceName
  ) {
    speakSpeechSynthesisUtterance({
      text,
      volume,
      selectedVoice,
      stopCurrentSpeech,
      pitch,
      rate,
    });
  } else {
    if (forceGoogleMinRate && rate < forceGoogleMinRate)
      rate = forceGoogleMinRate;
    else if (forceGoogleMaxRate && rate > forceGoogleMaxRate)
      rate = forceGoogleMaxRate;

    speakGoogleTTS({ text, lng, volume, rate, stopCurrentSpeech });
  }
}
// endregion: --- Main speak

// region:    --- SpeechSynthesis

export interface ISpeakSynthesis {
  text: string;
  volume: number;
  selectedVoice: SpeechSynthesisVoice;
  stopCurrentSpeech: boolean;
  pitch: number;
  rate: number;
}

function speakSpeechSynthesisUtterance({
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

  speechSynthesis.speak(utterance);
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
  filteredVoicesNames: string[];
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
  const filteredVoicesNames = filteredVoices.map((v) => v.name);
  const voiceNames = voices.map((v) => v.name);
  filteredVoicesNames.push(GoogleVoiceName);
  voiceNames.push(GoogleVoiceName);

  return {
    filteredVoices,
    voices,
    filteredVoicesNames,
    voiceNames,
  } satisfies IListVoicesReturn;
}

export function checkSpeechSynthesisCompatibility(lng?: string): boolean {
  return listVoices(lng).filteredVoices.length > 1;
}
export { checkSpeechSynthesisCompatibility as isSpeechSynthesisCompatible };

// endregion: --- SpeechSynthesis

// region:    --- Google TTS

export interface IGoogleTTS {
  text: string;
  lng: string;
  volume: number;
  rate: number;
  stopCurrentSpeech: boolean;
}

function speakGoogleTTS({
  lng,
  text,
  volume,
  rate,
  stopCurrentSpeech,
}: IGoogleTTS) {
  if (stopCurrentSpeech) {
    stopSpeech();
  }

  let audioEl = document.getElementById(AudioElementId) as HTMLAudioElement;

  if (!audioEl) {
    const newAudioEl = document.createElement("audio");
    newAudioEl.style.display = "none";
    newAudioEl.ariaHidden = "true";
    newAudioEl.id = AudioElementId;
    document.body.appendChild(newAudioEl);

    audioEl = newAudioEl;
  }

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lng.toLowerCase()}&client=tw-ob&q="${text}"`;

  audioEl.pause();

  audioEl.src = url;
  audioEl.volume = volume / 100;
  audioEl.playbackRate = rate;

  audioEl.play();
}

// endregion: --- Google TTS

// region:    --- Misc fns

/**
 * Cancel current TTS
 */
export function stopSpeech() {
  let audioEl = document.getElementById(AudioElementId) as HTMLAudioElement;

  if (audioEl) {
    audioEl.pause();
    audioEl.src = "";
  }
  window.speechSynthesis.cancel();
}
export { stopSpeech as cancelSpeech };

/**
 * Pause current TTS
 */
export function pauseSpeech() {
  let audioEl = document.getElementById(AudioElementId) as HTMLAudioElement;

  if (audioEl) audioEl.pause();
  speechSynthesis.pause();
}

/**
 * Resume current TTS
 */
export function resumeSpeech() {
  let audioEl = document.getElementById(AudioElementId) as HTMLAudioElement;

  if (audioEl) audioEl.play();
  speechSynthesis.resume();
}

// endregion: --- Misc fns
