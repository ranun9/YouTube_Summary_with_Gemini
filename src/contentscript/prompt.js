// HH:MM:SS形式に変換するヘルパー関数
function formatTime(seconds) {
    const date = new Date(0);
    // parseFloatで秒数を数値に変換し、無効な場合は0をデフォルト値とする
    date.setSeconds(parseFloat(seconds || 0));
    // getUTCHours, getUTCMinutes, getUTCSecondsを使ってHH:MM:SSを生成
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const secondsFormatted = String(date.getUTCSeconds()).padStart(2, '0');
    // 1時間未満でもHHを含める
    return `${hours}:${minutes}:${secondsFormatted}`;
}

// 新しいプロンプト生成関数
export function getSummaryPrompt(rawTranscript) {
    let title = "Could not find title"; // デフォルト値
    // ★★★ セレクタを更新 ★★★
    const titleElement = document.querySelector('ytd-watch-metadata div#title h1 yt-formatted-string');

    if (titleElement && titleElement.textContent) {
        title = titleElement.textContent.replace(/\n+/g, " ").trim();
    } else {
        // もし上記セレクタで見つからない場合のフォールバックとしてdocument.titleを使う
        console.warn("Could not find title element using specific selector, falling back to document.title");
        // 簡単な通知数除去処理 (改良版)
        title = document.title.replace(/^\(\d+\)\s*/, '').replace(/\n+/g, " ").trim();
    }

    // タイムスタンプ付きトランスクリプトを生成
    const transcriptWithTimestamps = rawTranscript
        .filter(item => item.text && item.text.trim() !== '')
        .map(item => `(${formatTime(item.start)}) ${item.text.replace(/\n+/g, " ").trim()}`) // 括弧付きを推奨
        // .map(item => `${formatTime(item.start)} ${item.text.replace(/\n+/g, " ").trim()}`) // 括弧なしを試す場合
        .join('\n');

    // ★★★ Markdown形式のプロンプト ★★★
    const taskDescription = "要約しろ。話題毎のタイムスタンプを作れ。日本語で答えろ。";

    return `# Task\n${taskDescription}\n\n# YouTubeTitle\n${title}\n\n# TranscriptWithTimestamps\n${transcriptWithTimestamps}`;
}

// 不要になった関数を削除またはコメントアウト
/*
const limit = 14000;

export function getChunckedTranscripts(textData, textDataOriginal) {
  // ... (省略) ...
}

function truncateTranscript(str) {
  // ... (省略) ...
}

function textToBinaryString(str) {
  // ... (省略) ...
}
*/