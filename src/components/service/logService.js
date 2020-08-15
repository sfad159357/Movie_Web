import * as Sentry from "@sentry/react";

function init() {
  Sentry.init({
    dsn:
      "https://1338b48577f04328a2fdde29ae7792c3@o432473.ingest.sentry.io/5385223",
    release: "1-0-0",
    environment: "development-test",
  });
}

function log(error) {
  Sentry.captureException(error); // 我們只想要監控未預期的錯誤
}

export default {
  init,
  log,
};
