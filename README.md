# Audilupz

Record system audio + microphone on Windows. Built for recording telehealth calls (VA Video Connect, etc.) where you need to capture both sides of the conversation.

## Features

- Captures system audio (remote participant) + microphone (you)
- Adjustable volume levels for each source
- Save As dialog to pick where recordings go
- Local HTTP API for integration with other apps
- No third-party audio drivers required

## Credits

Built using [electron-audio-loopback](https://github.com/alectrocute/electron-audio-loopback) by [@alectrocute](https://github.com/alectrocute) - MIT licensed.

## Requirements

- Windows 10+
- Node.js 18+ (download from https://nodejs.org)

## Installation

```bash
# Clone or download this repo, then:
cd audilupz-recorder
npm install
```

## Usage

### Run the app

```bash
cd audilupz-recorder
npm start
```

### Recording a call

1. Start the app with `npm start`
2. Open VA Video Connect (or any browser-based call) in your browser
3. In the Audilupz window, click **Start Recording**
4. Conduct your call (use headphones to avoid echo)
5. Click **Stop** when done
6. Click **Save Recording...** to choose where to save the .webm file

### Volume controls

- **System Audio Level**: Adjusts the remote participant's volume in the recording
- **Mic Level**: Adjusts your microphone volume in the recording

## Local API (Optional)

The app runs a local HTTP server on port `3333` for integration with other apps (e.g., automation, transcription services).

**Start recording:**
```bash
curl -X POST http://localhost:3333/start
```

**Stop recording:**
```bash
curl -X POST http://localhost:3333/stop
```

**Get status:**
```bash
curl http://localhost:3333/status
```

**Save last recording to a specific path:**
```bash
curl -X POST http://localhost:3333/save -H "Content-Type: application/json" -d "{\"path\": \"C:/recordings/call.webm\"}"
```

## Troubleshooting

- **No system audio captured**: Make sure other apps are playing sound. The recorder captures all system audio.
- **Echo in recording**: Use headphones instead of speakers.
- **App won't start**: Make sure Node.js 18+ is installed (`node -v` to check).

## Future

- Standalone .exe (no Node.js required)
- Auto-start recording option
- Transcription integration

## License

MIT - see [LICENSE](LICENSE)

## Disclaimer

Only record calls when you have consent from all participants and your organization's policy allows it. Recordings may contain sensitive/protected health information.
