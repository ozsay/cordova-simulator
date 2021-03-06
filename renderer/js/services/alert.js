/*jshint esnext: true */

let $mdToast;

let ipc;

export default class Alert {
  constructor(_$mdToast, _ipc) {
    $mdToast = _$mdToast;
    
    ipc = _ipc;

    ipc.on('alert-from-main', (type, title, message) => {
      switch (type) {
        case 'info':
          this.info(message);
          break;
        case 'warning':
          this.warning(message);
          break;
        case 'error':
          this.error(message);
          break;
        default:
      }
    });

    ipc.send('alerts-loaded');
  }

  error(message) {
    $mdToast.show($mdToast.simple().content(message).position('top right').capsule(true).hideDelay(false).action('ok'));
  }

  warning(message) {
    $mdToast.show($mdToast.simple().content(message).position('top right').capsule(true).hideDelay(3500));
  }

  info(message) {
    $mdToast.show($mdToast.simple().content(message).position('top right').capsule(true).hideDelay(2500));
  }
}

Alert.$inject = ['$mdToast', 'ipc'];
