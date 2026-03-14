import { createContext, useEffect, useState } from "react";
import { initTelegram } from "../services/initTelegram";
import { loginTelegramUserApi, type TTelegramLoginData } from "../utils/api";
import Preloader from "../components/preloader/preloader";
import { useDispatch } from "../services/store/store";
import { setUser} from "../services/slices/UserSlice/UserSlice";
import { setCookie } from "../utils/cookie";

export const TelegramContext = createContext<any>(null);

export function TelegramProvider({ children }: any) {

  const [loading, setLoading] = useState(true);
  const [webAppUser, setWebAppUser] = useState<any| null>(null);

  const dispatch = useDispatch();

  useEffect(() => {

    async function start() {

      const tg = await initTelegram();

      const initData = tg.initData;

      const user = tg.initDataUnsafe?.user;

      const authData: TTelegramLoginData = {
        telegramId: String(user?.id),
        initData: initData
      };

      // const authData: TTelegramLoginData = {
      //   telegramId: "123",
      //   initData: "123321321"
      // };

      const auth = await loginTelegramUserApi(authData);
      // console.log(authData);
      
      if(!authData.initData)
        return;

      setLoading(false);
      setWebAppUser(user);
      dispatch(setUser(auth.user));
      setCookie('accessToken', auth.accessToken);
      localStorage.setItem('refreshToken', auth.refreshToken);
    }

    start();

  }, []);

  if (loading) {
    return <Preloader></Preloader>;
  }

  return (
    <TelegramContext.Provider value={{ webAppUser }}>
      {children}
    </TelegramContext.Provider>
  );
}