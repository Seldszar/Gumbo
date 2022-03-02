# <img src="public/icon-48.png" width="38" align="left" /> Gumbo

> Swollen companion keeping you updated on your Twitch experience

## Install

[link-chrome]: https://chrome.google.com/webstore/detail/gumbo-twitch-companion/aalmjfpohaedoddkobnibokclgeefamn 'Version published on Chrome Web Store'
[link-firefox]: https://addons.mozilla.org/firefox/addon/gumbo-twitch-companion/ 'Version published on Mozilla Add-ons'

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/aalmjfpohaedoddkobnibokclgeefamn.svg?label=%20">][link-chrome] also compatible with [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge.svg" width="24" alt="Edge" valign="middle">][link-chrome] [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera.svg" width="24" alt="Opera" valign="middle">][link-chrome]

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox.svg" width="48" alt="Firefox" valign="middle">][link-firefox] [<img valign="middle" src="https://img.shields.io/amo/v/gumbo-twitch-companion.svg?label=%20">][link-firefox]

## Build

1. Create (or use) a [Twitch Application](https://dev.twitch.tv/console/apps).

2. Create a `.env` file in the root of your project with the above Twitch Application's Client ID:

    ```
    TWITCH_CLIENT_ID=tk0nbw3xavxi9eeor93rpsg6ppxtyd
    ```

3. Install the dependencies (`yarn install`) and build for the desired platform:

    - `yarn build:chrome` if you want to build for Google Chrome
    - `yarn build:firefox` if you want to build for Mozilla Firefox

## Frequently Asked Questions

### When I'm logging in, I get a blank page

It's probably due to an active browser extension affecting the browser's tabs, like [Conex](https://addons.mozilla.org/en-US/firefox/addon/conex/) or similar.

- https://github.com/Seldszar/Gumbo/issues/5#issuecomment-1056918389

### Are sound notifications supported?

Not officially, Manifest V3 doesn't provide the ability to play audio from a service worker. Workarounds exist, but aren't worth the trouble.

- https://bugs.chromium.org/p/chromium/issues/detail?id=1131236

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)
