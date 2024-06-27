import { diffWords } from 'diff';
// @ts-ignore
import styleCSS from './style.css' with { type: 'text' };

const publicToken = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
function getCsrf() {
    let csrf = document.cookie.match(/(?:^|;\s*)ct0=([0-9a-f]+)\s*(?:;|$)/);
    return csrf ? csrf[1] : '';
}

function fetchHistory(id: string) {
  const path = `https://${location.hostname}/i/api/graphql/1I20d3k4y_2gALXHj967Xg/TweetEditHistory?variables=%7B%22tweetId%22%3A%22${id}%22,%22withQuickPromoteEligibilityTweetFields%22%3Atrue%7D&features=%7B%22communities_web_enable_tweet_community_results_fetch%22%3Atrue,%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue,%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue,%22standardized_nudges_misinfo%22%3Atrue,%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue,%22tweetypie_unmention_optimization_enabled%22%3Atrue,%22responsive_web_edit_tweet_api_enabled%22%3Atrue,%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue,%22view_counts_everywhere_api_enabled%22%3Atrue,%22longform_notetweets_consumption_enabled%22%3Atrue,%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue,%22tweet_awards_web_tipping_enabled%22%3Afalse,%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse,%22longform_notetweets_rich_text_read_enabled%22%3Atrue,%22longform_notetweets_inline_media_enabled%22%3Atrue,%22articles_preview_enabled%22%3Atrue,%22rweb_video_timestamps_enabled%22%3Atrue,%22rweb_tipjar_consumption_enabled%22%3Atrue,%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue,%22verified_phone_label_enabled%22%3Afalse,%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue,%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue,%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse,%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
  return fetch(path, {
    headers: {
      'authorization': publicToken,
      'x-csrf-token': getCsrf(),
      'x-twitter-auth-type': 'OAuth2Session',
      'content-type': 'application/json',
      'x-twitter-client-language': navigator.language ? navigator.language : 'en'
    },
    credentials: 'include'
  }).then(r => r.json());
}

interface DiffOptions {
  oldText: string;
  newText: string;
  user?: any;
}

function createButton(diffOpts: DiffOptions) {
  const diff = diffWords(diffOpts.oldText, diffOpts.newText);
  let addCount = 0;
  let removeCount = 0;
  diff.forEach((p) => {
    if (p.added) addCount++;
    else if (p.removed) removeCount++;
  });

  function click() {
    const modal = document.createElement('div');
    modal.className = 'twdiff-modal';
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    const verifiedTick = '<svg viewBox="0 0 22 22" aria-label="Verified account" role="img" data-testid="icon-verified" class="twdiff-user-verified"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path></g></svg>';
    modal.innerHTML = `
      <div class="twdiff-inner-modal">
        <div class="twdiff-header">
          <button class="twdiff-close-button">
            <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg>
          </button>
          <h2>Tweet Diff</h2>
          <div>
            <span class="twdiff-add-preview"></span>
            <span class="twdiff-remove-preview"></span>
          </div>
        </div>
        <div class="twdiff-tweet">
          <img class="twdiff-tweet-avy">
          <div class="twdiff-tweet-content">
            <div class="twdiff-tweet-user">
              <span class="twdiff-tweet-username"></span>
              ${diffOpts.user?.is_blue_verified ? verifiedTick : ''}
              <span class="twdiff-tweet-handle"></span>
            </div>
            <div class="twdiff-tweet-text"></div>
          </div>
        </div>
      </div>
    `;
    modal.querySelector<HTMLSpanElement>('.twdiff-close-button')!.addEventListener('click', () => modal.remove());

    if (diffOpts.user) {
      modal.querySelector<HTMLSpanElement>('.twdiff-tweet-handle')!.innerText = '@' + diffOpts.user.legacy.screen_name;
      modal.querySelector<HTMLSpanElement>('.twdiff-tweet-username')!.innerText = diffOpts.user.legacy.name;
      modal.querySelector<HTMLImageElement>('.twdiff-tweet-avy')!.src = diffOpts.user.legacy.profile_image_url_https;
    }

    if (addCount !== 0) modal.querySelector<HTMLSpanElement>('.twdiff-add-preview')!.innerText = '+' + addCount.toLocaleString();
    if (removeCount !== 0) modal.querySelector<HTMLSpanElement>('.twdiff-remove-preview')!.innerText = '-' + removeCount.toLocaleString();
    const tweetText = modal.querySelector<HTMLSpanElement>('.twdiff-tweet-text')!;
    for (const part of diff) {
      const span = document.createElement('span');
      if (part.added) span.classList.add('twdiff-add');
      else if (part.removed) span.classList.add('twdiff-remove');
      span.innerText = part.value;
      tweetText.appendChild(span);
    }

    document.body.appendChild(modal);
  }

  const button = document.createElement('button');
  button.className = 'twdiff-button';
  if (addCount === 0 && removeCount === 0) {
    button.innerText = 'No difference found';
    button.disabled = true;
  } else {
    button.innerHTML = '<span class="twdiff-add-preview"></span><span class="twdiff-remove-preview"></span><span>· Show Diff</span>';
    if (addCount !== 0) button.querySelector<HTMLSpanElement>('.twdiff-add-preview')!.innerText = '+' + addCount.toLocaleString();
    if (removeCount !== 0) button.querySelector<HTMLSpanElement>('.twdiff-remove-preview')!.innerText = '-' + removeCount.toLocaleString();
    button.addEventListener('click', click);
  }
  return button;
}

function getTweetElements(username: string) {
  const tweets = Array.from(document.querySelectorAll<HTMLElement>('article[data-testid="tweet"]'));
  let sortedTweets: Record<string, HTMLElement> = {};

  for (const tweet of tweets) {
    const link = tweet.querySelector<HTMLAnchorElement>(`a[href^="/${username}/status/"`);
    if (!link) continue;
    const tweetId = link.href.split('/').reverse()[0];
    if (/^\d+$/.test(tweetId)) sortedTweets[tweetId] = tweet;
  }

  return sortedTweets;
}

async function hookIntoTweets() {
  const [_, username, __, tweetId] = location.pathname.split('/');
  console.log('Starting to hook into tweet', username, tweetId);
  const tweetElems = getTweetElements(username);

  const data = await fetchHistory(tweetId);
  const editHistory = data.data.tweet_result_by_rest_id.result.edit_history_timeline.timeline.instructions[1].entries!;
  const user = editHistory[0].content.items[0].item.itemContent.tweet_results.result.core.user_results.result;
  const tweets: { index: number; id: string; text: string }[] = [
    editHistory![0].content.items[0].item.itemContent.tweet_results.result,
    ...editHistory[1].content.items.map((e: any) => e.item.itemContent.tweet_results.result.tweet)
  ].map((t, i) => ({ index: i, id: t.rest_id, text: t.note_tweet?.note_tweet_results?.result.text ?? t.legacy.full_text }));

  for (const tweet of tweets) {
    if (tweet.index >= tweets.length - 1) break;
    if (!tweetElems[tweet.id] || tweetElems[tweet.id].dataset.twdiff === '1') continue;
    const prevTweet = tweets[tweet.index + 1];
    const parentElem = tweetElems[tweet.id].querySelector('[data-testid="tweetText"]')!.parentElement!;
    parentElem.appendChild(createButton({
      oldText: prevTweet.text,
      newText: tweet.text,
      user
    }));
    tweetElems[tweet.id].dataset.twdiff = '1';
  }
}

function onReady() {
  const style = document.createElement('style');
  const head = document.head || document.getElementsByTagName('head')[0];
  style.innerHTML = styleCSS;
  head.appendChild(style);

  let lastHistory = '';
  setInterval(() => {
    const [_, username, userType, tweetId, tweetType] = location.pathname.split('/');
    const isOnHistory = (username !== 'home' && username !== 'i') && userType === 'status' && tweetType === 'history' && !!document.querySelector('section[aria-labelledby^="accessible-list-"] h2[aria-level="2"][role="heading"]');
    if (!isOnHistory) lastHistory = '';
    else if (lastHistory !== tweetId) {
      lastHistory = tweetId;
      try {
        hookIntoTweets();
      } catch (e) {
        console.log('Failed to hook tweetdiff', e);
      }
    }
  }, 1000);
}

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') onReady();
});
