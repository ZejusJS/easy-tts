import { AudioElementId } from "./speak";

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
