var EmailsInput = (function () {

    var emailValidationRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    function isValidEmail (possibleEmail) {
      return emailValidationRegex.test(possibleEmail)
    }

    function createElement(tagName, attributes) {
      var element = document.createElement(tagName);
      for (var attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute])
      }
      return element;
    }
    var defaultOptions = {
      placeholder: "add more people..."
    }

    function EmailsInput (hostElement, providedOptions) {

      var options = Object.assign({}, defaultOptions, providedOptions);
      this.hostElement = hostElement
      this._emails = [] //list of email addresses
      this._hostElement = hostElement
      this._placeholderText = options.placeholder;

      this._changeListeners = []

      var elementAttributeProperty = 'x-emails-input'
      if (typeof hostElement[elementAttributeProperty] !== 'undefined') {
        throw Error('Attempting to instantiate another instance of emails input on a element with a emails input already instantiated.')
      }

      this._hostElement[elementAttributeProperty] = this
      var container = createElement("div", {
        'class': "emails-input",
        'contentEditable': "true"
      })

      this._hostElement.appendChild(container);

    }

    EmailsInput.prototype._notifyListeners = function () {
      var self = this
      this._changeListeners.forEach(function (listener) {
        var emailsListCurrent = self._emails.slice()
        listener(emailsListCurrent)
      })
    }

    EmailsInput.prototype.setEmails = function (emailsList) {
      if (!(emailsList instanceof Array)) {
        throw new Error('setEmails() given a non Array argument.')
      }
      this._emails = emailsList.slice()
      this._notifyListeners()
    }

    EmailsInput.prototype.getEmails = function () {
      return this._emails.slice()
    }

    EmailsInput.prototype.addEmail = function (email) {
      this._emails.push(email)
      this._notifyListeners()
    }

    EmailsInput.prototype.addChangeListener = function (listener) {
      if (this._changeListeners.indexOf(listener) === -1) {
        this._changeListeners.push(listener)
      }
    }

    return EmailsInput
  }
)()
