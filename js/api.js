;(function () {
  axios.defaults.baseURL = "http://111.67.196.2:3000";
  axios.defaults.timeout = 3000;
  class NJHttp {
    static get (url="", data={}){
      return new Promise(function (resolve, reject) {
        axios.get(url, {
          params: data
        })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
      })
    }
    static post (url="", data={}){
      return new Promise(function (resolve, reject) {
        axios.post(url, {
          params: data
        })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
      })
    }
  }
  class HomeApis {
    static getHomeBanner () {
      return NJHttp.get('/banner', {type: 2})
    }
    static getHomeRecommend(){
      return NJHttp.get('/personalized', {offset: 0, limit:6})
    }
    static getHomeExclusive(){
      return NJHttp.get('/personalized/privatecontent')
    }
    static getHomeAlbum(){
      return NJHttp.get('/top/album', {offset:0, limit:6})
    }
    static getHomeMv(){
      return NJHttp.get('/personalized/mv')
    }
    static getHomeDj(){
      return NJHttp.get('/personalized/djprogram')
    }
  }

  window.NJHttp = NJHttp;
  window.HomeApis = HomeApis;
})();
