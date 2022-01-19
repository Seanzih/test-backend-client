import { request } from '../utils/api.utils';
const USERKEY = 'userkey';

export const setUserkey = () => {
    if(isUserkeyExists()) return;
    getRequestParams();
}

export const isUserkeyExists = () => {
    if (window !== undefined) {
        return localStorage.getItem(USERKEY) && true;
    }
}

export const getUserKey = () => {
    if (window !== undefined) {
        if(isUserkeyExists()) {
            return localStorage.getItem('userkey')
        }
        return null;
    }
}

const getRequestParams = async () => {
    const requestOptions = {
    method: 'get',
    path: 'user/generateUserKey'
  };
    const res = await request(requestOptions)
    const userKey = res.data.userkey;
    localStorage.setItem(USERKEY, userKey);
}
