import WebApp from "@twa-dev/sdk";

export async function initTelegram() {

  return new Promise<typeof WebApp>((resolve) => {

    const check = () => {

      if (WebApp) {

        WebApp.ready();

        resolve(WebApp);

        return;

      }

      setTimeout(check, 50);

    };

    check();

  });

}