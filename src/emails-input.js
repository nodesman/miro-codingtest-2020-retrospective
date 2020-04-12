var EmailsInput = (function () {

    function isValidEmail () {

    }

    function EmailsInput (hostElement) {
      this.hostElement = hostElement
      this._emails = [] //list of email addresses
      this._hostElement = hostElement;

      this._changeListeners = [];

      var elementAttributeProperty = 'x-emails-input'
      if (typeof hostElement[elementAttributeProperty] !== "undefined") {
        throw Error("Attempting to instantiate another instance of emails input on a element with a emails input already instantiated.");
      }

      this._hostElement[elementAttributeProperty] = this;

    }

    EmailsInput.prototype._notifyListeners = function () {
      var self = this;
      this._changeListeners.forEach(function (listener) {
        var emailsListCurrent = self._emails.slice()
        listener(emailsListCurrent);
      })
    }

    EmailsInput.prototype.setEmails = function (emailsList) {
      if (!(emailsList instanceof Array)) {
        throw new Error("setEmails() given a non Array argument.");
      }
      this._emails  = emailsList.slice();
      this._notifyListeners();
    }

    EmailsInput.prototype.getEmails = function () {
      return this._emails.slice()
    }

    EmailsInput.prototype.addEmail = function (email) {
      this._emails.push(email);
      this._notifyListeners();
    }

    EmailsInput.prototype.addChangeListener = function (listener) {
      if (this._changeListeners.indexOf(listener) === -1) {
        this._changeListeners.push(listener);
      }
    }

    return EmailsInput
  }
)()
