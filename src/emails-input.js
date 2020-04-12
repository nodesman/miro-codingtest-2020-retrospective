var __testPortal__ = {};
var EmailsInput = (function () {

    function isValidEmail () {

    }

    function EmailsInput (hostElement) {
      this.hostElement = hostElement
      var count = Math.floor(Math.random() * 10);
      this.emails = [] //list of email addresses
      this._hostElement = hostElement;

      var elementAttributeProperty = 'x-emails-input'
      if (typeof hostElement[elementAttributeProperty] !== "undefined") {
        throw Error("Attempting to instantiate another instance of emails input on a element with a emails input already instantiated.");
      }

      this._hostElement[elementAttributeProperty] = this;

      for (var iter = 0; iter < count; iter++) {
        this.emails.push(1);
      }
    }

    EmailsInput.prototype.setEmails = function (emailsList) {

    }

    EmailsInput.prototype.getEmails = function () {
      return this.emails.slice()
    }

    EmailsInput.prototype.addEmail = function (email) {
    }

    return EmailsInput
  }
)()
