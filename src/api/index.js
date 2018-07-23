import Exception from "../utilities/Exception";
import config from "config";

export default class API {
  static post(relativeUrl: string, body = null) {
    return new Promise((resolve, reject) => {
      let headers = API._getHeaders("POST");
      if (body) {
        headers.body = JSON.stringify(body);
      }

      fetch(`${config.API_BASE_URL}${relativeUrl}`, headers).then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          response.json().then(err => {
            reject(new Exception(err));
          });
        }
      });
    });
  }

  static get(relativeUrl: string) {
    return new Promise((resolve, reject) => {
      let headers = API._getHeaders("GET");

      fetch(`${config.API_BASE_URL}${relativeUrl}`, headers).then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          response.json().then(err => {
            reject(new Exception(err));
          });
        }
      });
    });
  }

  static _getHeaders(method) {
    return {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };
  }
}