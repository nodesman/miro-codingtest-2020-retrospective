var EmailsInput = (function () {

    var emailValidationRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    function isValidEmail (possibleEmail) {
      return emailValidationRegex.test(possibleEmail)
    }

    function createElement (tagName, attributes) {
      var element = document.createElement(tagName)
      for (var attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute])
      }
      return element
    }

    var defaultOptions = {
      placeholder: 'add more people...'
    }

    function getDirectTextContent (element) {
      var text = ''

      element.childNodes.forEach(function (childNode) {
        if (childNode.nodeType === Node.TEXT_NODE) {
          text += childNode.textContent
        }
      })
      return text
    }


    function deleteAllDirectTextNodes (element) {
      element.childNodes.forEach(function (childNode) {
        if (childNode.nodeType === Node.TEXT_NODE) {
          childNode.parentElement.removeChild(childNode)
        }
      })
    }

    function _addTextContentAsAnItem (containerElement) {
      var content = getDirectTextContent(containerElement)
      this.addEmail(content)
      deleteAllDirectTextNodes(containerElement)
      var textNode = document.createTextNode('')
      containerElement.append(textNode)
    }

    function onKeyDown (event) {
      var RETURN_KEYCODE = 'Enter'
      var COMMA_KEYCODE = 'Comma'
      var BACKSPACE = 'Backspace'
      if (event.code === RETURN_KEYCODE || event.code === COMMA_KEYCODE) {
        event.preventDefault()
        _addTextContentAsAnItem.call(this, event.target)
        return;
      }

      if (event.code === BACKSPACE) {
        var currentSelection = getSelection()
        var lastTextNode = getLastTextNode(event.target)
        if (currentSelection.focusNode !== lastTextNode) {
          event.preventDefault()
          return
        }

        if (currentSelection.anchorOffset === 0) {
          event.preventDefault()
        }
      }

    }

    function onPaste (event) {
      event.preventDefault()
      var self = this
      var pasteContent = event.clipboardData.getData('text')
      var emails = pasteContent.split(',')
      emails.forEach(function (email) {
        self.addEmail(email)
      })
    }

    function deleteItem (node) {
      var correspondingItem = this._emails.find(function (item) {
        return item.node === node
      })
      var index = this._emails.indexOf(correspondingItem)

      this._emails.splice(index, 1)
      node.parentNode.removeChild(node)
    }

    function onClick (event) {

      if (event.target.classList.contains('delete-item')) {
        deleteItem.call(this, event.target.parentNode)
        return
      }
      var componentRoot = event.currentTarget
      var range = document.createRange()
      var sel = window.getSelection()
      var lastText = getLastTextNode(componentRoot)
      if (typeof lastText === 'undefined') {
        return
      }
      range.setStart(lastText, 0)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
      event.preventDefault()
    }

    function onLoseFocus (event) {
      _addTextContentAsAnItem.call(this, event.target)
    }

    //TODO: CHECK IF WE END UP NOT NEEDING TO SEND ANYTHING OTHER THAN CONTAINER IF SO CHANGE THE ARGS
    function bindEvents (elements) {
      var container = elements.container
      container.addEventListener('paste', onPaste.bind(this))
      container.addEventListener('keydown', onKeyDown.bind(this))
      container.addEventListener('focusout', onLoseFocus.bind(this))
      container.addEventListener('click', onClick.bind(this))

    }

    function createValidEmailNode (email) {
      var emailAddressElement = createElement('span', {
        'class': 'email-input-valid-email',
        'contentEditable': 'false'
      })
      emailAddressElement.innerText = email

      var deleteElement = createElement('span', {
        'class': 'delete-item'
      })
      deleteElement.innerText = 'x'
      emailAddressElement.append(deleteElement)
      return emailAddressElement
    }

    function createInvalidEmailNode (content) {
      var invalidEmailItem = createElement('span', {
        'class': 'email-input-invalid-email',
        'contentEditable': 'false'
      })
      invalidEmailItem.innerText = content
      var deleteElement = createElement('span', {
        'class': 'delete-item'
      })
      deleteElement.innerText = 'x'
      invalidEmailItem.append(deleteElement)
      return invalidEmailItem
    }

    function removeEmail () {

    }

    function EmailsInput (hostElement, providedOptions) {

      var options = Object.assign({}, defaultOptions, providedOptions)
      this.hostElement = hostElement
      this._emails = [] //list of email addresses
      this._hostElement = hostElement
      this._placeholderText = options.placeholder

      //TODO: rendering placeholder text
      this._changeListeners = []

      var elementAttributeProperty = 'x-emails-input'
      if (typeof hostElement[elementAttributeProperty] !== 'undefined') {
        throw Error('Attempting to instantiate another instance of emails input on a element with a emails input already instantiated.')
      }

      this._hostElement[elementAttributeProperty] = this
      var container = createElement('div', {
        'class': 'emails-input',
        'contentEditable': 'true'
      })
      this._hostElement.appendChild(container)
      this._componentRoot = container

      bindEvents.call(this, {
        container: container
      })
    }

    EmailsInput.prototype._notifyListeners = function () {
      var self = this
      this._changeListeners.forEach(function (listener) {
        var emailsListCurrent = self._emails.map(function (item) {
          return item.email;
        })
        listener(emailsListCurrent)
      })
    }

    EmailsInput.prototype.setEmails = function (emailsList) {
      if (!(emailsList instanceof Array)) {
        throw new Error('setEmails() given a non Array argument.')
      }
      for (var iter = 0; iter < emailsList.length; iter++) {
        this.addEmail(emailsList[iter]);
      }
      this._notifyListeners()
    }

    EmailsInput.prototype.getEmails = function () {
      var validItems = this._emails.filter(function (item) {
        return item.isValid === true
      })

      return validItems.map(function (item) {
        return item.email
      })
    }


    EmailsInput.prototype.getAllItems = function () {
      return this._emails.map(function (item) {
        console.log(item);
        return item.email
      })
    }

    function getLastTextNode (element) {
      var lastTextNode
      for (var iter = element.childNodes.length - 1; iter >= 0; iter--) {
        var currentNode = element.childNodes[iter]
        if (currentNode.nodeType === Node.TEXT_NODE) {
          lastTextNode = currentNode
          break
        }
      }
      return lastTextNode
    }

    function getFirstTextNode (element) {
      var _firstTextNode
      for (var iter = 0; iter < element.childNodes.length; iter++) {
        var currentNode = element.childNodes[iter]
        if (currentNode.nodeType === Node.TEXT_NODE) {
          _firstTextNode = currentNode
          break
        }
      }
      return _firstTextNode
    }

    EmailsInput.prototype.addEmail = function (email) {

      if (email.trim().length === 0) {
        return
      }

      var item = {
        email: email,
        node: null,
        isValid: false
      }
      var node = null
      if (isValidEmail(email)) {
        node = createValidEmailNode(email)
        item.email = email
        item.node = node
        item.isValid = true
      } else {
        node = createInvalidEmailNode(email)
        item.email = email
        item.node = node
        item.isValid = false
      }
      this._emails.push(item)

      //add the new email address before the current node where the cursor is
      var _componentRoot = this._componentRoot
      var lastTextNode = getLastTextNode(_componentRoot)
      this._componentRoot.insertBefore(node, lastTextNode)
      this._notifyListeners() //TODO: May be move it to a private method and make it not visible from the public interface
    }

    EmailsInput.prototype.addChangeListener = function (listener) {
      if (this._changeListeners.indexOf(listener) === -1) {
        this._changeListeners.push(listener)
      }
    }

    return EmailsInput
  }
)()
