# YouTube Summary with Gemini

YouTube Summary with Gemini is a simple Chrome Extension (manifest v3) that allows you to get both YouTube video summary of the video with Google AI Studio.

## How to Install

To install this extension, follow these steps:

1. Download the code on GitHub.
2. Unzip the downloaded file.
3. Open the code in your favorite IDE like VS Code.
4. Run `npm install` in terminal
```
npm install
```
5. Run `npm run build` or `npm run build-release` to run webpack to generate **dist** folder.
```
npm run build
```
6. In case of Google Chrome, open the Extensions page (chrome://extensions/).
7. Turn on Developer mode by clicking the toggle switch in the top right corner of the page.
8. Click the `Load unpacked` button and select the **dist** directory.
9. YouTube Summary with Gemini extension should be installed and active!

## How to Use

To use YouTube Summary with Gemini extension, follow these steps.

1. Go to any YouTube videos.
2. Click the small box on the right top that says `Transcript & Summary`.
3. Click `View AI Summary` button (It automatically copies the prompt for you and opens the Google AI Studio page!)
4. You'll see a magic!

## Notes

- This code manually fetches the YouTube video transcripts, and the platform might change the system so I also cannot guarantee that the YouTube video transcript code works forever.
