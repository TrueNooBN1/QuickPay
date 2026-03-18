import { createContext, useEffect, useState } from "react";
import { initTelegram } from "../services/initTelegram";
import { loginTelegramUserApi, type TTelegramLoginData } from "../utils/api";
import Preloader from "../components/preloader/preloader";
import { useDispatch } from "../services/store/store";
import { setUser} from "../services/slices/UserSlice/UserSlice";
import { setCookie } from "../utils/cookie";
// import { setCookie } from "../utils/cookie";

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
      //   initData: "query_id=AAG0uZwPAAAAALS5nA_lt-Ab&user=%7B%22id%22%3A261929396%2C%22first_name%22%3A%22Alexey%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22alexey_zzzz%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FRZHj3oeKJAwaz2pAGuGSKRCCXvWxTXM6jmnE1YmXVWw.svg%22%7D&auth_date=1773849511&signature=f5eu9VbQwMjnGAx8GBX2rxhOWuWsr-clcSNuySKsiWrABOUSRwNig6p7cyXNqBa6LOlFo-efcMUtu9CkNrcJCw&hash=0a0c4f33f85aa8bbf2e84e94de4c82cc7b9a8dea50ebe927f5746fe332744011"
      // };

      const auth = await loginTelegramUserApi(authData);
      // console.log(authData);
      
      if(!authData.initData)
        return;

      setLoading(false);
      setWebAppUser(user);
      dispatch(setUser(auth.user));
      localStorage.setItem('refreshToken', auth.refreshToken);
      sessionStorage.setItem('accessToken', auth.accessToken);
      setCookie('accessToken', auth.accessToken);
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