import Axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'

export const request = async (options) => {
    const { method = 'get', body, path } = options;
    const url = `${BASE_URL}/${path}`;
    if (method === 'get') {
        const data = await Axios.get(url)
        return data;
    } else if (method === 'post') {
        const res = await Axios.post(url, body);
        return res;
    } else if (method === 'delete') {
        const res = await Axios.delete(url, body);
        return res;
    }
} 