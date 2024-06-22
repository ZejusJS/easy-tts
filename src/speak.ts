import { speakGoogleTTS } from "./googleTTS";
import { listVoices, speakSpeechSynthesisUtterance } from "./synthesis";

export const GoogleVoiceName = "Google Voice";
export const AudioElementId = "easy-tts-audio";
export const MaxPitch = 2;
export const MinPitch = 0;
export const MaxVolume = 100;
export const MinVolume = 0;
export const MaxRate = 10;
export const MinRate = 0.1;

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
   * force any minimum for "Google Voice" by setting `forceGoogleMinRate`
   * and any maximum by `forceGoogleMaxRate`.
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
 * from {@link https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis SpeechSynthesis}.
 *
 * Valid voice names can be retrieved by `listVoices()` function.
 *
 * @param {ISpeak} opts Options for TTS
 *
 */
export async function speak({
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

  if (volume && (volume > MaxVolume || volume < MinVolume)) {
    console.warn(`Volume must be between ${MinVolume} and ${MaxVolume}`);
    volume = 100;
  }
  if (pitch && (pitch > MaxPitch || pitch < MinPitch)) {
    console.warn(`Pitch must be between ${MinPitch} and ${MaxPitch}`);
    pitch = 1;
  }
  if (rate && (rate > MaxRate || rate < MinRate)) {
    console.warn(`Rate must be between ${MinRate} and ${MaxRate}`);
    rate = 1;
  }

  if (
    forceGoogleMaxRate &&
    forceGoogleMinRate &&
    forceGoogleMaxRate < forceGoogleMinRate
  ) {
    console.error(
      `forceGoogleMinRate can't be set to higher value than forceGoogleMaxRate (${forceGoogleMinRate} > ${forceGoogleMaxRate})`
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
    await speakSpeechSynthesisUtterance({
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

    await speakGoogleTTS({ text, lng, volume, rate, stopCurrentSpeech });
  }
}
// endregion: --- Main speak
