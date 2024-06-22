import { AudioElementId } from "./speak";

// region:    --- Misc fns

/**
 * Cancel current TTS
 */
export function stopSpeech() {
  let audioEl = document.getElementById(
    AudioElementId
  ) as HTMLAudioElement | null;

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
  let audioEl = document.getElementById(
    AudioElementId
  ) as HTMLAudioElement | null;

  if (audioEl) audioEl.pause();
  window.speechSynthesis.pause();
}

/**
 * Resume current TTS
 */
export function resumeSpeech() {
  let audioEl = document.getElementById(
    AudioElementId
  ) as HTMLAudioElement | null;

  if (audioEl) audioEl.play();
  window.speechSynthesis.resume();
}

/**
 * @returns `true` when there is TTS playing and isn't paused.
 */
export function isSpeaking(): boolean {
  let audioEl = document.getElementById(
    AudioElementId
  ) as HTMLAudioElement | null;

  return (
    (audioEl && !audioEl.paused) ||
    (window.speechSynthesis.speaking && !window.speechSynthesis.paused)
  );
}

/**
 * @returns `true` when there is no TTS playing or paused.
 */
export function isEnded(): boolean {
  let audioEl = document.getElementById(
    AudioElementId
  ) as HTMLAudioElement | null;

  return (
    ((audioEl && audioEl.ended) || !audioEl) && !window.speechSynthesis.speaking
  );
}

// endregion: --- Misc fns
