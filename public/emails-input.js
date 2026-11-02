var EmailsInput = (function () {

    var emailValidationRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    function isValidEmail (possibleEmail) {
      return emailValidationRegex.test(possibleEmail);
    }

    function createElement (tagName, attributes) {
      var element = document.createElement(tagName);
      for (var attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
      }
      return element;
    }

    var defaultOptions = {
      placeholder: 'add more people...'
    };

    function getDirectTextContent (element) {
      var text = '';

      for (var iter = 0; iter < element.childNodes.length; iter++) {
        var childNode = element.childNodes[iter];
        if (childNode.nodeType === Node.TEXT_NODE) {
          text += childNode.textContent;
        }
      }
      return text;
    }


    function deleteAllDirectTextNodes (element) {
      for (var iter = 0; iter < element.childNodes.length; iter++) {
        var childNode = element.childNodes[iter];
        if (childNode.nodeType === Node.TEXT_NODE) {
          childNode.parentNode.removeChild(childNode);
        }
      }
    }

    function _addTextContentAsAnItem (containerElement) {
      var content = getDirectTextContent(containerElement);
      this.addEmail(content);
      deleteAllDirectTextNodes(containerElement);
      var textNode = document.createTextNode('');
      containerElement.appendChild(textNode);
    }

    function onKeyDown (event) {
      var RETURN_KEYCODE = 13;
      var COMMA_KEYCODE = 188;
      var BACKSPACE = 8;
      if (event.keyCode === RETURN_KEYCODE || event.keyCode === COMMA_KEYCODE) {
        event.preventDefault();
        _addTextContentAsAnItem.call(this, event.target);
        return;
      }

      if (event.keyCode === BACKSPACE) {
        var currentSelection = getSelection();
        var lastTextNode = getLastTextNode(event.target);
        if (currentSelection.focusNode !== lastTextNode) {
          event.preventDefault();
          return;
        }

        if (currentSelection.anchorOffset === 0) {
          event.preventDefault();
        }
      }

    }

    function onPaste (event) {
      event.preventDefault();
      var self = this,
        pasteContent;
      if (!!window.clipboardData) {
        pasteContent = window.clipboardData.getData('text');
      } else {
        pasteContent = event.clipboardData.getData('text');
      }
      var emails = pasteContent.split(',');
      emails.forEach(function (email) {
        self.addEmail(email);
      });
    }

    function deleteItem (node) {

      var correspondingItem;
      for (var iter = 0; iter < this._emails.length; iter++) {
        var current = this._emails[iter];
        if (current.node === node) {
          correspondingItem = current;
        }
      }

      var index = this._emails.indexOf(correspondingItem);

      this._emails.splice(index, 1);
      node.parentNode.removeChild(node);
    }

    function onClick (event) {

      if (event.target.classList.contains('delete-item')) {
        deleteItem.call(this, event.target.parentNode);
        return;
      }
      var componentRoot = event.currentTarget;
      var range = document.createRange();
      var sel = window.getSelection();
      var lastText = getLastTextNode(componentRoot);
      if (typeof lastText === 'undefined') {
        return;
      }
      range.setStart(lastText, 0);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      event.preventDefault();
    }

    function onLoseFocus (event) {
      var _componentRoot = event.target;
      _addTextContentAsAnItem.call(this, _componentRoot);
      this._placeholderElement = document.createTextNode(this._placeholderText);
      _componentRoot.appendChild(this._placeholderElement);
      _componentRoot.classList.remove('focus');
    }

    function bindEvents (elements) {
      var container = elements.container;
      container.addEventListener('paste', onPaste.bind(this));
      container.addEventListener('keydown', onKeyDown.bind(this));
      container.addEventListener('focusout', onLoseFocus.bind(this));
      container.addEventListener('focusin', onGainFocus.bind(this));
      container.addEventListener('click', onClick.bind(this));
    }

    function onGainFocus (event) {
      if (this._placeholderElement.parentNode !== null) {
        this._placeholderElement.parentNode.removeChild(this._placeholderElement);
      }
      event.target.classList.add('focus');
    }

    function createValidEmailNode (email) {
      var emailAddressElement = createElement('span', {
        'class': 'email-input-valid-email',
        'contentEditable': 'false'
      });
      emailAddressElement.innerText = email;

      var deleteElement = createElement('span', {
        'class': 'delete-item'
      });
      deleteElement.innerText = 'x';
      emailAddressElement.appendChild(deleteElement);
      return emailAddressElement;
    }

    function createInvalidEmailNode (content) {
      var invalidEmailItem = createElement('span', {
        'class': 'email-input-invalid-email',
        'contentEditable': 'false'
      });
      invalidEmailItem.innerText = content;
      var deleteElement = createElement('span', {
        'class': 'delete-item'
      });
      deleteElement.innerText = 'x';
      invalidEmailItem.appendChild(deleteElement);
      return invalidEmailItem;
    }


    function _notifyListeners () {
      var self = this;
      this._changeListeners.forEach(function (listener) {
        var emailsListCurrent = self._emails.map(function (item) {
          return item.email;
        });
        listener(emailsListCurrent);
      });
    }

    function getLastTextNode (element) {
      var lastTextNode;
      for (var iter = element.childNodes.length - 1; iter >= 0; iter--) {
        var currentNode = element.childNodes[iter];
        if (currentNode.nodeType === Node.TEXT_NODE) {
          lastTextNode = currentNode;
          break;
        }
      }
      return lastTextNode;
    }

    function EmailsInput (hostElement, providedOptions) {

      // var options = Object.assign({}, defaultOptions, providedOptions)
      var options = {};
      if (typeof providedOptions !== 'undefined') {
        options.placeholder = providedOptions.placeholder;
      } else {
        options.placeholder = defaultOptions.placeholder;
      }

      this.hostElement = hostElement;
      this._emails = []; //list of email addresses
      this._hostElement = hostElement;
      this._placeholderText = options.placeholder;
      this._placeholderElement = document.createTextNode(this._placeholderText);


      this._changeListeners = [];
      var elementAttributeProperty = 'x-emails-input';
      if (typeof hostElement[elementAttributeProperty] !== 'undefined') {
        throw Error('Attempting to instantiate another instance of emails input on a element with a emails input already instantiated.');

      }
      this._hostElement[elementAttributeProperty] = this;
      var container = createElement('div', {
        'class': 'emails-input',
        'contentEditable': 'true'
      });
      this._hostElement.appendChild(container);

      this._componentRoot = container;
      bindEvents.call(this, {
        container: container
      });
      this._componentRoot.appendChild(this._placeholderElement);
    }

    EmailsInput.prototype.setEmails = function (emailsList) {
      if (!(emailsList instanceof Array)) {
        throw new Error('setEmails() given a non Array argument.');
      }

      this._emails.forEach(function (item) {
        item.node.parentNode.removeChild(item.node);
      });

      deleteAllDirectTextNodes(this._componentRoot);

      for (var iter = 0; iter < emailsList.length; iter++) {
        this.addEmail(emailsList[iter]);
      }
      _notifyListeners.call(this);
    };

    EmailsInput.prototype.getEmails = function () {
      var validItems = this._emails.filter(function (item) {
        return item.isValid === true;
      });

      return validItems.map(function (item) {
        return item.email;
      });
    };

    EmailsInput.prototype.getAllItems = function () {
      return this._emails.map(function (item) {
        return item.email;
      });
    };

    EmailsInput.prototype.addEmail = function (email) {

      if (email.trim().length === 0) {
        return;
      }

      email = email.trim();

      var item = {
        email: email,
        node: null,
        isValid: false
      };
      var node = null;
      if (isValidEmail(email)) {
        node = createValidEmailNode(email);
        item.email = email;
        item.node = node;
        item.isValid = true;
      } else {
        node = createInvalidEmailNode(email);
        item.email = email;
        item.node = node;
        item.isValid = false;
      }
      this._emails.push(item);

      //add the new email address before the current node where the cursor is
      var _componentRoot = this._componentRoot;
      var lastTextNode = getLastTextNode(_componentRoot);
      this._componentRoot.insertBefore(node, lastTextNode);
      _notifyListeners.call(this);
    };

    EmailsInput.prototype.addChangeListener = function (listener) {
      if (this._changeListeners.indexOf(listener) === -1) {
        this._changeListeners.push(listener);
      }
    };

    return EmailsInput;
  }
)();
