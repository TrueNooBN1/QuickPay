import { apiUrl } from '../const/const';
import { setCookie, getCookie } from './cookie';
import type { TAdminData, TNewOrder, TOrder, TOrdersData, TOrdersFilter, TOrderStatus, TRate, TUser } from './types';

const API_URL = apiUrl;

const checkResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json();
  if (!res.ok) {
    // console.log("error", data);
    return Promise.reject(data);
  }
  // console.log("res.ok true", data);
  return data;
}

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

type TRateResponse = TServerResponse<{
  rates: TRate;
}>;

type TOrdersResponse = TServerResponse<TOrdersData>;


type TNewOrderResponse = TServerResponse<{
  order: TOrder;
}>;

export const getRateApi = ()=>
  fetch(`${API_URL}/order/rates`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `Bearer ${getCookie('accessToken')}`
    } as HeadersInit
  })
  .then((res) => checkResponse<TRateResponse>(res))
  .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });


export const getOrdersApi = (filter: TOrdersFilter) =>{
  return fetchWithRefresh<TOrdersResponse>(`${API_URL}/order/filtered`, {
    method: 'PATCH',
    body: JSON.stringify(filter),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `Bearer ${getCookie('accessToken')}`
    } as HeadersInit,
  }).then((data) => {
    // console.log("getOrdersApi", data);
    if (data?.success) return data;
    return Promise.reject(data);
  });
}

export const getAllOrdersApi = (filter: TOrdersFilter) =>{
  return fetchWithRefresh<TOrdersResponse>(`${API_URL}/order/admin`, {
    method: 'PATCH',
    body: JSON.stringify(filter),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `Bearer ${getCookie('accessToken')}`
    } as HeadersInit,
  }).then((data) => {
    // console.log("getAllOrdersApi", data);
    if (data?.success) return data;
    return Promise.reject(data);
  });
}

export const orderExchangeApi = (data: TNewOrder) =>
  fetchWithRefresh<TNewOrderResponse>(`${API_URL}/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `Bearer ${getCookie('accessToken')}`
    } as HeadersInit,
    body: JSON.stringify(data)
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: string) =>
  fetch(`${API_URL}/order/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${getCookie('accessToken')}`
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

export const patchOrderByNumberApi = (number: string, newStatus: TOrderStatus, executionRate: number) =>
  fetch(`${API_URL}/order/${number}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${getCookie('accessToken')}`
    },
    body: JSON.stringify({
      status: newStatus,
      executionRate: executionRate
    })
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => { return checkResponse<TAuthResponse>(res)})
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export type TLoginData = {
  email: string;
  password: string;
};

export type TTelegramLoginData = {
  telegramId: string;
  initData: string;
};

export const loginUserApi = (data: TLoginData) =>
  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const loginTelegramUserApi = (data: TTelegramLoginData) =>
  fetch(`${API_URL}/auth/tg_login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      // console.log("data succes" + data.success); 
      // console.log("data" + JSON.stringify(data)); 
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${API_URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${API_URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${API_URL}/auth/user`, {
    headers: {
      authorization: `Bearer ${getCookie('accessToken')}`
    } as HeadersInit
  });

export const updateUserApi = (user: TUser) =>{
  const { id, roles, ...updateData } = user;
  // console.log(`export const updateUserApi = (user: ${JSON.stringify(user)})`);
  
  return fetchWithRefresh<TUserResponse>(`${API_URL}/users/${user.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `Bearer ${getCookie('accessToken')}`
    } as HeadersInit,
    body: JSON.stringify(updateData)
  });
}

export const logoutApi = () =>
  fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));

type TAdminDataResponse = TServerResponse<{
  data: TAdminData;
}>;

export const patchAdminDataApi = (data: TAdminData) =>{
  return fetchWithRefresh<TAdminDataResponse>(`${API_URL}/order/admin-data`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `Bearer ${getCookie('accessToken')}`
    } as HeadersInit,
    body: JSON.stringify(data)
  }).then((data) => {
    // console.log("updateAdminDataApi", data);
    if (data?.success) return data;
    return Promise.reject(data);
  });;
}

export const getAdminDataApi = () =>{
  return fetchWithRefresh<TAdminDataResponse>(`${API_URL}/order/admin-data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `Bearer ${getCookie('accessToken')}`
    } as HeadersInit,
  }).then((data) => {
    // console.log("getAdminDataApi", data);
    if (data?.success) return data;
    // console.log("getAdminDataApi reject Promise");
    return Promise.reject(data);
  });;
}

export const downloadOrdersXLSX = async (filters: TOrdersFilter) => {
  try {
    const token = getCookie('accessToken');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 секунд таймаут
    console.log("fetch");
    const res = await fetch(`${API_URL}/xlsxexport`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(filters),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    console.log("after fetch");

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    // Проверяем тип ответа
    const contentType = res.headers.get('content-type');
    
    if (contentType?.includes('json')) {
      // Если пришел JSON (ошибка или метаданные)
      const json = await res.json();
      console.error('Server returned JSON instead of file:', json);
      throw new Error('Server returned unexpected response');
    }

    // Получаем blob
    const blob = await res.blob();
    console.log(blob);
    
    // Проверяем, что это действительно Excel файл
    if (blob.size === 0) {
      throw new Error('Received empty file');
    }

    // Получаем имя файла из заголовков или используем дефолтное
    const disposition = res.headers.get('content-disposition');
    let filename = `ordersP${filters.createDateFrom}${filters.createDateTo}.xlsx`;
    
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '');
      }
    }

    // Создаем и скачиваем файл
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
    
  } catch (error) {
    console.error('Error downloading XLSX:', error);
    throw error;
  }
};