export function* doFetch(path, method, reqBody, headers) {
  method = method || "GET";
  headers = headers || {
    Accept: "application/json"
  };

  const res = yield fetch(path, {
    method,
    headers,
    body: JSON.stringify(reqBody)
  });
  if (res.status === 404) {
    throw { response: res, body: "Requested api method is not found" };
  }
  const copy = res.clone();
  let body = null;
  try {
    body = yield res.json();
  } catch (e) {
    body = yield copy.text();
  }
  if (res.status >= 400) {
    throw { response: res, body };
  }
  return { response: res, body };
}
