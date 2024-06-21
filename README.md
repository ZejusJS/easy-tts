# easy-tts (not ready yet)

This package is meant to lighten the work around TTS in browsers. It's compatible for every browser because it calls Google Translate API as backup speech.

For now it provides basic configuration, but it will be updated.

## Usage

### Basic
```ts
import { speak, listWords } from "easy-tts"

speak({
  lng: "en",
  text: "Hey, hear my beautiful voice!",
  voiceName: listWords("EN").filteredVoicesNames[0],
  volume: 75,
});
```

### Google TTS

```ts
import { speak, listWords } from "easy-tts"

speak({
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

## Examples

## TODOS

- [x] Appending hidden audio element
- [ ] Provide example of user's choice of TTS voice
- [x] Fn stop
- [x] Fn pause
- [x] Fn resume
- [ ] Fn isSpeaking
- [x] Pitch option