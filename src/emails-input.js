var __testPortal__ = {};
var EmailsInput = (function () {

    function isValidEmail () {

    }

    function EmailsInput (hostElement) {
      this.hostElement = hostElement
      var count = Math.floor(Math.random() * 10);
      this.emails = [] //list of email addresses
      this._hostElement = hostElement;

      for (var iter = 0; iter < count; iter++) {
        this.emails.push(1);
      }
    }

    EmailsInput.prototype.setEmails = function (emailsList) {
      if (!(emailsList instanceof Array)) {
        var actualType = typeof emailsList
        throw new Error('setEmails() should be given an array. ' + actualType + ' given.')
      }

      var cleanList = emailsList.filter(function (email) {
        return Util.isValidEmail(email)
      })
    }

    EmailsInput.prototype.getEmails = function () {
      return this.emails.slice()
    }

    EmailsInput.prototype.addEmail = function (email) {
      console.log(this.hostElement , " adding email");
    }

    __testPortal__.isValidEmail = isValidEmail;

    return EmailsInput
  }
)()
