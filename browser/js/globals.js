/*jshint esnext: true */

const SUPPORTED_PLATFORMS = {
  ios: {
    display: 'iOS',
    cordovaName: 'ios'
  },
  android: {
    display: 'Android',
    cordovaName: 'android'
  },
  wp8: {
    display: 'Windows Phone 8',
    cordovaName: 'wp8'
  }
};
const FEATURES = [
  'Front Camera', 'Rear Camera', 'WIFI', '3G', '4G', '2G'
];
const UUID_PATTERN = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

export {
  SUPPORTED_PLATFORMS,
  FEATURES,
  UUID_PATTERN
};
