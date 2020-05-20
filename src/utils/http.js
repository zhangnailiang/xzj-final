import 'whatwg-fetch'
import { reqHeader, authBeforeRes } from './interceptor';
import ProgressBar from '../components/progressBar/index';
import { history } from './index'

class Http {
    get(url, params) {
        let options = { method: 'GET' }
        let req_url = params ? this.buildUrl(url, params) : url;
        return this.request(req_url, options)
    }

    post(url, data) {
        let options = { method: 'POST', headers: { "content-type": "application/json;charset=UTF-8" }, body: {} }


        if (data) options.body = JSON.stringify(data)
        return this.request(url, options)
    }

    delete(url, params) {
        let options = { method: 'DELETE' }
        let req_url = params ? this.buildUrl(url, params) : url;


        return this.request(req_url, options)
    }

    put(url, data) {
        let options = { method: 'PUT', body: {} }
        if (data) options.body = JSON.stringify(data)
        return this.request(url, options)
    }

    postForDownload(url, data) {
        let options = { method: 'POST', headers: { "content-type": "application/json;charset=UTF-8" }, body: {} }
        if (data) options.body = JSON.stringify(data)
        return this.requestForDownload(url, options)
    }
    requestForDownload(url, options) {
        options.headers = options.headers || reqHeader;
        options.credentials = 'same-origin'
        ProgressBar.show();
        let newUrl = "http://39.97.242.132:8080" + url;
        return fetch(newUrl, options)
            .then(authBeforeRes)
            .then(response => {
                ProgressBar.hide();
                return response.blob(); // 调用blob()处理response 普通的函数则使用的json()
            })
            .catch(err => {
                this.handleExcept(err);
            });
    }

    postForm(url, data, flag) {
        let options = { method: 'POST', headers: { "enctype": "multipart/form-data" }, body: {} }
        if (data) options.body = flag ? this.buildFormData(data) : new FormData(data);
        return this.request(url, options)
    }
    head(url) {
        let options = { method: 'Head' }
        return this.request(url, options)
    }
    buildUrl(url, params) {
        const ps = []
        if (params) {
            for (let p in params) {
                if (p) {
                    ps.push(p + '=' + encodeURIComponent(params[p]));
                }
            }
        }
        // console.log("final url", url + '?' + ps.join('&'))
        return url + '?' + ps.join('&');
    }


    buildFormData(params) {
        if (params) {
            const data = new FormData()
            for (let p in params) {
                if (p) {
                    data.append(p, params[p])
                }
            }
            return data;
        }
    }
    request(url, options) {
        options.headers = options.headers || reqHeader;
        options.credentials = 'same-origin';
        ProgressBar.show();
        let newUrl = "http://39.97.242.132:8080" + url;
        // console.log("url对比", url);
        // console.log("newUrl对比", newUrl);
        // console.log("options1", options)
        return fetch(newUrl, options)

            .then(authBeforeRes)
            .then(response => {
                // console.log("response", response);
                // console.log("response", options)
                return response.json()
            })
            .catch(err => {
                this.handleExcept(err);
            });
    }
    handleExcept(e) {
        const status = e.name;
        if (status === 401) {
            window.location.href = '/login';
            return;
        }
        if (status === 403) {
            history.push('/login');
            return;
        }
        if (status <= 504 && status >= 500) {
            history.push('/login');
            return;
        }
        if (status >= 404 && status < 422) {
            history.push('/login');
        }
    }
}
export default new Http()
