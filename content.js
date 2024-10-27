(() => {
  console.log('H-Ume-Kun-forX / ver. 1.0.1');

  const observer = new MutationObserver(() => {
    if (document.querySelector("div[lang='ja'] > span")) {
      processTweets();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  function processTweets() {
    const articles = document.querySelectorAll("div[lang='ja'] > span");
    articles.forEach((article) => {
      if (article.dataset.processed) return; // 二重処理防止

      const text = article.textContent;
      if (text.includes('ttps://video.twimg.com/')) {
        const videoURL = 'h' + text.substring(text.indexOf('ttps://'));
        console.log(videoURL);

        const urlArea = createUrlArea(videoURL);
        article.closest("div[lang='ja']").appendChild(urlArea);

        const currentURL = document.location.href
        if (/^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(currentURL)) {
          const previewElement = createPreview(videoURL);
          urlArea.appendChild(previewElement);
        }

        article.dataset.processed = 'true';
      }
    });
  }

  function createUrlArea(url) {
    const urlArea = document.createElement('div');
    urlArea.classList.add('filledURLArea');

    const header = document.createElement('p');
    header.textContent = 'H埋めくん';
    header.classList.add('header');
    urlArea.appendChild(header);

    const urlLink = document.createElement('a');
    urlLink.textContent = url;
    urlLink.href = url;
    urlLink.target = '_blank';
    urlLink.rel = 'noopener noreferrer';
    urlLink.classList.add('filledURLLink');
    urlArea.appendChild(urlLink);

    return urlArea;
  }

  function createPreview(url) {
    const details = document.createElement('details');
    details.classList.add('previewPlayerDetails');
    
    const summary = document.createElement('summary');
    summary.textContent = '動画をプレビュー'; // ツイート画面用

    details.appendChild(summary);

    const video = document.createElement('video');
    video.name = 'media';
    video.setAttribute('controls', '');
    video.classList.add('previewPlayerVideo');

    const source = document.createElement('source');
    source.src = url;
    source.type = 'video/mp4';
    video.appendChild(source);

    details.appendChild(video);

    // details が閉じたときに動画を停止
    details.addEventListener('toggle', () => {
      if (!details.open) {
        video.pause();
        video.currentTime = 0; // 再生位置リセット
      }
    });

    return details;
  }
})();
