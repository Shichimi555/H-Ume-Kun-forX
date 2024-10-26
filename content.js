(() => {
  console.log('Twitter拡張スクリプト起動');

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
      if (article.dataset.processed) return; // 重複処理を防ぐ

      const text = article.textContent;
      if (text.includes('ttps://video.twimg.com/')) {
        const setURL = 'h' + text.substring(text.indexOf('ttps://'));
        console.log(setURL);

        const urlArea = createUrlArea(setURL);
        article.closest("div[lang='ja']").appendChild(urlArea);

        article.dataset.processed = 'true'; // 処理済みフラグを設定
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
    urlLink.classList.add('filledURLLink');
    urlLink.href = url;
    urlArea.appendChild(urlLink);

    return urlArea;
  }
})();
