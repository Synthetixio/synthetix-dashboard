export default class Exception {
  constructor(data: JSON) {
    if (data.error) {
      Object.assign(this, data.error);
    } else {
      Object.assign(this, data.error);
    }
  }

  toString(): string {
    return this.message || this.code;
  }
}
