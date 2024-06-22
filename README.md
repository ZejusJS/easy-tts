# easy-tts (not ready yet)

This package is meant to lighten the work around TTS in browsers. It's compatible for every browser because it calls Google Translate API as backup speech.

For now it provides basic configuration, but it will be updated.

## Installation
```bash
npm i easy-tts
```

## Usage

### Basic
```ts
import { speak, listWords } from "easy-tts"

speak({
  lng: "en",
  text: "Hey, hear my beautiful voice!",
  voiceName: listWords("EN").filteredVoiceNames[0],
  volume: 75,
});
```

### Advenced

```ts
import { speak, GoogleVoiceName } from "easy-tts"

await speak({
  lng: "en",
  text: "Hey, hear my beautiful voice!",
  voiceName: GoogleVoiceName, // sets the voice of Google Translate
  volume: 75,
  stopCurrentSpeech: false,
  pitch: 1.5,
  rate: 2, // 2x speed of voice
  forceGoogleMinRate: 0.5,
  forceGoogleMaxRate: 5
});
```

### Google TTS

```ts
import { speak, listWords } from "easy-tts"

await speak({
  lng: "en",
  text: "Hey, hear my beautiful voice!",
  voiceName: "Google Voice",
  volume: 75,
});
```

### SpeechSynthesis Compatibility
Check whether or not the user's browser is capable of using built in TTS.

[Speech Synthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)

```ts
import { checkSpeechSynthesisCompatibility } from "easy-tts"

checkSpeechSynthesisCompatibility()
checkSpeechSynthesisCompatibility("en")
```

### Pause, resume and cancel speech
```ts
import { cancelSpeech, resumeSpeech, pauseSpeech, speak } from "easy-tts";

speak({...})
pauseSpeech()
resumeSpeech()

speak({...})
cancelSpeech()
```

## Examples

## TODOS

- [x] Appending hidden audio element
- [ ] Provide example of user's choice of TTS voice
- [x] Fn stop
- [x] Fn pause
- [x] Fn resume
- [ ] Fn isSpeaking
- [x] Pitch option
- [ ] Async