import http from '../utils/http';

import Swagger from './swagger.ts';

const { keys } = Object;
function mapUrlObjToFuncObj(urlObj) {
    const API = {};
    keys(urlObj).forEach((key) => {
        console.log(key);
        const item = urlObj[key];
        // console.log("url", item);
        API[key] = async function (params) {
            return await http[item.method](item.url, params)
        }
    });
    return API;
}


export const API = mapUrlObjToFuncObj(Object.assign({}, Swagger));
