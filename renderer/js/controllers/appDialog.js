/*jshint esnext: true */

import BasicDialog from './basicDialog';

export default class AppDialog extends BasicDialog {
  constructor($rootScope, $timeout, $mdDialog, fileDialog, app) {
    super($mdDialog, app === undefined, app !== undefined ? angular.copy(app) : {});

    this.$timeout = $timeout;
    this.$rootScope = $rootScope;

    this.fileDialog = fileDialog;

    console.log(fileDialog);

    this.dialogType = 'app';
    this.app = this.model;
  }

  fileDrop(files) {
    this.app.path = files[0].path;
  }

  openFileDialog() {
    this.fileDialog.showOpenDialog(null, {
      properties: ['openDirectory']
    }, (files) => {
      if (files) {
        this.$timeout(() => this.app.path = files[0], 0);
      }
    });
  }

  canDelete() {
    var canDelete = true;

    angular.forEach(this.$rootScope.configuration.simulator.runningDevices, (runningDevice) => {
      if (runningDevice.app.name === this.app.name) {
        canDelete = false;
      }
    });

    return canDelete;
  }
}

AppDialog.$inject = ['$rootScope', '$timeout', '$mdDialog', 'dialog', 'model'];
