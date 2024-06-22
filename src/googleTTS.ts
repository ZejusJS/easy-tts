import { stopSpeech } from "./misc";
import { AudioElementId } from "./speak";

// region:    --- Google TTS

export interface IGoogleTTS {
  text: string;
  lng: string;
  volume: number;
  rate: number;
  stopCurrentSpeech: boolean;
}

export async function speakGoogleTTS({
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

  await playAudio(audioEl)
}

function playAudio(audioEl: HTMLAudioElement) {
  return new Promise((res) => {
    audioEl.play();
    audioEl.onended = res;
  });
}

// endregion: --- Google TTS
