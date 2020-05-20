import { message } from 'antd';
import { history } from './index'
message.config({
    maxCount: 1,
});
export const reqHeader = {
    'Accept': '*/*',
    mode: 'cors',
    'Content-Type': 'application/json',
};

export function authBeforeRes(response) {
    switch (response.status) {
        case 200:
            return response;
        case 302:
            message.info('登录超时, 请重新登录！');
            return 0;
        case 401:
            message.config({
                maxCount: 1
            });
            history.push('/login');
            return response;
        default:
            if (process.env.NODE_ENV !== 'production') {
                console.error('Request error: ', response.code, response.message)
            }
            return response
    }
}

export function authAfterRes(response) {
    switch (response.result_code) {
        case 1:
            return response;
        case 0: // 无权限，需要登录
            // Api.logout() // 这里需要重新登录处理
            return Promise.reject(response);
        default:
            if (response.message) {
                message.error(response.message, 5) // 异常消息默认显示5s
            }
            return response
    }
}
