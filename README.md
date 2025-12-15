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
- Node.js 18+

## Installation

```bash
cd audilupz-recorder
npm install
```

## Usage

### Run the app

```bash
npm start
```

1. Start your video call in a browser
2. Click **Start Recording**
3. Do your call
4. Click **Stop**
5. Click **Save Recording...** and pick where to save

### Local API

The app runs a local HTTP server on port `3333` for integration with other apps.

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

**Save last recording:**
```bash
curl -X POST http://localhost:3333/save -H "Content-Type: application/json" -d "{\"path\": \"C:/recordings/call.webm\"}"
```

## License

MIT - see [LICENSE](LICENSE)

## Disclaimer

Only record calls when you have consent from all participants and your organization's policy allows it. Recordings may contain sensitive information.
