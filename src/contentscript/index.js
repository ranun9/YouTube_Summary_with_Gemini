"use strict";

import { insertSummaryBtn } from "./youtube";

let promptToInject = null; // プロンプトを一時保存
let oldHref = "";

window.onload = async () => {
        
    if (window.location.hostname === "www.youtube.com") {
        
        if (window.location.search !== "" && window.location.search.includes("v=")) {
            insertSummaryBtn();
        }

        const bodyList = document.querySelector("body");
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    insertSummaryBtn();
                }
            });
        });
        observer.observe(bodyList, { childList: true, subtree: true });

    }

    // --- Google AI Studio向けの処理 ---
    if (window.location.hostname === "aistudio.google.com" && window.location.pathname.startsWith('/prompts/new_chat')) {
        chrome.runtime.sendMessage({ message: "getPrompt" }, (response) => {
            if (response && response.prompt && response.prompt !== "") {
                console.log("Prompt received from background:", response.prompt.substring(0, 100) + "...");
                promptToInject = response.prompt;
                // ★★★ MutationObserverを使った関数を呼び出す ★★★
                injectPromptWithObserver();
            } else {
                console.log("No prompt received from background or prompt is empty.");
            }
        });
    }
}

// ★★★ MutationObserverを使ったプロンプト注入関数 ★★★
function injectPromptWithObserver() {
    const inputSelector = 'textarea[aria-label*="Type something"]'; // テキストエリアのセレクタ
    const sendButtonSelector = 'button[aria-label*="Run"], button[aria-label*="実行"]'; // 送信ボタンのセレクタ
    const targetNode = document.body; // 監視対象 (body全体を見るのが確実)
    const config = { childList: true, subtree: true }; // 子要素と、その子孫要素の変更を監視

    // タイムアウトを設定（万が一要素が見つからない場合に備える）
    const timeoutMillis = 10000; // 10秒
    let timeoutId = null;

    const callback = function(mutationsList, observer) {
        const textArea = document.querySelector(inputSelector);
        const sendButton = document.querySelector(sendButtonSelector);

        // テキストエリアと送信ボタンが見つかり、かつプロンプトがあれば処理を実行
        if (textArea && sendButton && promptToInject) {
            console.log("Target elements found. Injecting prompt and clicking send...");
            observer.disconnect(); // 監視を停止
            clearTimeout(timeoutId); // タイムアウトをクリア

            textArea.focus();
            textArea.value = promptToInject;
            textArea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

            // 少し待ってからボタンをクリック（UIの反応を待つため）
            setTimeout(() => {
                sendButton.click();
                console.log("Send button clicked.");
            }, 100); // 100ms待機

            promptToInject = null; // 注入後はクリア
            console.log("Prompt injected and observer disconnected.");
        }
        // 他の要素の変更は無視
    };

    const observer = new MutationObserver(callback);

    // 最初に一度要素が存在するか確認
    const initialTextArea = document.querySelector(inputSelector);
    const initialSendButton = document.querySelector(sendButtonSelector);
    if (initialTextArea && initialSendButton && promptToInject) {
         console.log("Target elements found initially. Injecting prompt and clicking send...");
         initialTextArea.focus();
         initialTextArea.value = promptToInject;
         initialTextArea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
         setTimeout(() => {
             initialSendButton.click();
             console.log("Send button clicked.");
         }, 100);
         promptToInject = null;
         console.log("Prompt injected initially.");
    } else {
        // 要素がまだなければ監視を開始
        observer.observe(targetNode, config);
        console.log("MutationObserver started.");

        // タイムアウト処理
        timeoutId = setTimeout(() => {
            observer.disconnect();
            console.error("MutationObserver timed out. Could not find target elements.");
            promptToInject = null; // タイムアウト時もプロンプトをクリア
        }, timeoutMillis);
    }
}

//waitForElm関数はyoutube.jsに残っていても良いですが、
//AI Studio向けには上記injectPromptWithObserverを使うように変更しました。