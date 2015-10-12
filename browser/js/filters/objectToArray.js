/*jshint esnext: true */

export default class ObjectToArrayFilter {
  static Factory() {
    return (object) => Object.keys(object).map((key) => object[key]);
  }
}
