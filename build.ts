import { version } from './package.json';
import manifest from './manifest.json';
import AdmZip from 'adm-zip';

const result = await Bun.build({
  entrypoints: ['./src/index.ts'],
  target: 'browser'
});

const script = await result.outputs[0].text();

// User Script
const userScript = `// ==UserScript==
// @name         Tweet Diff
// @namespace    http://tampermonkey.net/
// @version      ${version}
// @description  Diff checker on tweet edit history
// @author       Snazzah
// @license      MIT
// @match        https://x.com/*
// @icon         https://raw.githubusercontent.com/Snazzah/TweetDiff/v${version}/icons/icon128.png
// @grant        none
// ==/UserScript==

(function() {'use strict';
${script}
})();`;

await Bun.write('./dist/TweetDiff.user.js', userScript);

// Chrome Zip
const chromeZip = new AdmZip();
chromeZip.addFile('script.js', Buffer.from(script, 'utf8'));
chromeZip.addFile('manifest.json', Buffer.from(JSON.stringify({ ...manifest, version }, null, 2)))
for (const image of ['icon16.png', 'icon32.png', 'icon48.png', 'icon128.png'])
  chromeZip.addFile(`icons/${image}`, Buffer.from(await Bun.file(`./icons/${image}`).arrayBuffer()));
chromeZip.writeZip('./dist/TweetDiff-chrome.zip');

// Firefox Zip
const firefoxZip = new AdmZip();
firefoxZip.addFile('script.js', Buffer.from(script, 'utf8'));
firefoxZip.addFile('manifest.json', Buffer.from(JSON.stringify({
  ...manifest,
  version,
  manifest_version: 2,
  browser_specific_settings: {
    gecko: {
        id: 'twdiff@snazzah.com',
        strict_min_version: '101.0'
    },
    gecko_android: {
        strict_min_version: '101.0'
    }
  },
  web_accessible_resources: [
    'content.js'
  ]
}, null, 2)))
for (const image of ['icon16.png', 'icon32.png', 'icon48.png', 'icon128.png'])
  firefoxZip.addFile(`icons/${image}`, Buffer.from(await Bun.file(`./icons/${image}`).arrayBuffer()));
firefoxZip.writeZip('./dist/TweetDiff-firefox.zip');