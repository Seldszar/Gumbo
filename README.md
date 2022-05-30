# <img src="public/icon-48.png" width="38" align="left" /> Gumbo

> Swollen companion keeping you updated on your Twitch experience

Gumbo is a spiritual successor of Twitch Now allowing you to access your Twitch experience outside the main ecosystem.

From its user interface, you can check your followed channels and track live streams, as well as discover the popular streams and categories of the moment, all with the possibility to personalize your experience thanks to the multitude of preferences at your disposal.

This extension also informs you when a channel goes online, with the option to pick the notifications you want.

## Install

[link-chrome]: https://chrome.google.com/webstore/detail/gumbo-twitch-companion/aalmjfpohaedoddkobnibokclgeefamn 'Version published on Chrome Web Store'
[link-firefox]: https://addons.mozilla.org/firefox/addon/gumbo-twitch-companion 'Version published on Mozilla Add-ons'

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

## Contributing

### Donating

Gumbo is a free extension that does not collect or sell personal user data.

Donations, although optional but greatly appreciated, help support my work and encourage me to offer the best quality products possible.

If you'd like to help my initiative, please consider contributing using [PayPal](https://go.seldszar.fr/paypal) or [Coinbase](https://go.seldszar.fr/coinbase).

### Translating

You can help translate Gumbo by [registering on Weblate](https://hosted.weblate.org/accounts/register), and join the [translation project](https://hosted.weblate.org/projects/gumbo).

## Frequently Asked Questions

### Why does it break randomly?

Gumbo can randomly break due to a bug with Chromium itself, with can put the extension in a limbo state.
It's a known issue, which is unfortunately on the hands of the Chromium team.

- https://bugs.chromium.org/p/chromium/issues/detail?id=1271154

### Are sound notifications supported?

Not officially, Manifest V3 doesn't provide the ability to play audio from a service worker. Workarounds exist, but aren't worth the trouble.

- https://bugs.chromium.org/p/chromium/issues/detail?id=1131236

## License

Copyright (c) 2022-present Alexandre Breteau

This software is released under the terms of the MIT License.
See the [LICENSE](LICENSE) file for further information.
