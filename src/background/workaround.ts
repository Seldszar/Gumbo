/**
 * Workaround reloading the extension when the service worker is unresponsive.
 *
 * @see https://bugs.chromium.org/p/chromium/issues/detail?id=1316588
 */

let dispatched: boolean;

browser.storage.onChanged.addListener(() => {
  dispatched = true;
});

function check() {
  dispatched = false;

  const promise = new Promise((resolve) => {
    browser.storage.local.set({
      checkDate: Date.now(),
    });

    setTimeout(resolve, 100);
  });

  promise.then(() => (dispatched ? setTimeout(check, 10_000) : browser.runtime.reload()));
}

check();
