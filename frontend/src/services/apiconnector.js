// jb bhi koi bhi button pe click hoga to wo services pe aayega servces api call karegi jisse backend me controller pr land karega aur wha se koi function call karega

import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};

