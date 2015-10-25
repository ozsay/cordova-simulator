/*jshint esnext: true */

export default class BasicDialog {
  constructor($mdDialog, isNew, model) {
    this.$mdDialog = $mdDialog;
    this.isNew = isNew;
    this.model = model;
  }

  apply() {
    this.$mdDialog.hide({model: this.model, message: this.model.name + ' ' + this.dialogType + ' was ' + (this.isNew ? 'added' : 'changed')});
  }

  discard() {
    this.$mdDialog.cancel({message: 'No changes has been made'});
  }

  delete() {
    this.$mdDialog.hide({toDelete: true, model: this.model, message: this.model.name + ' ' + this.dialogType + ' was deleted'});
  }

  clone(copiedModel) {
    this.model = copiedModel;
    this.model.name = undefined;
    this.isNew = true;

    return this.model;
  }
}
