var expect = chai.expect
describe('EmailsInput', function () {
  describe('Instantiation', function () {
    it('should not allow more than one instance on the same element', function () {

      var element = document.createElement('div')
      var firstInstance = new EmailsInput(element)

      function instantiateSecond () {
        var secondInstance = new EmailsInput(element)
      }

      expect(instantiateSecond).to.throw(Error)
    })
  });
  describe('Methods', function () {
    it('addEmail() should add an email to its list', function () {
      var element = document.createElement('div')
      var instance = new EmailsInput(element)
      var theEmail = 'myemail@mydomain.com'
      instance.addEmail(theEmail)
      var emailsList = instance._emails
      expect(emailsList).to.eql([theEmail])
    })

    it("getEmails() should get emails from its list", function () {
      var element = document.createElement('div')
      var instance = new EmailsInput(element)
      var emails = ["user@gmail.com", "user2@gmail.com", "user3@gmail.com"]
      instance._emails = emails
      var currentListOfEmails = instance.getEmails();
      expect(currentListOfEmails).to.eql(emails)
      expect(currentListOfEmails).to.not.equal(emails)
    })

    it("setEmails() should set emails to its list", function () {
      var element = document.createElement('div')
      var instance = new EmailsInput(element)
      var emails = ["user@gmail.com", "user2@gmail.com", "user3@gmail.com"]
      var currentListOfEmails = instance.setEmails(emails);
      expect(instance._emails).to.eql(emails)
      expect(instance._emails).to.not.equal(emails)
    })

    it("setEmails() should throw an error when given a non-array argument", function () {

      var element = document.createElement('div')
      var instance = new EmailsInput(element)

      expect(function () {
        instance.setEmails(null)
      }).to.throw(Error)
      expect(function () {
        instance.setEmails('user@gmail.com')
      }).to.throw(Error)
      expect(function () {
        instance.setEmails({0: 'user@gmail.com'})
      }).to.throw(Error)
    })
  })

  describe('Change Listener', function () {
    it("setEmails() should trigger change event", function () {
      var element = document.createElement('div')
      var instance = new EmailsInput(element)

      var notifiedNewValue;
      var callback = function (newValue) {
        notifiedNewValue = newValue;
      }

      var spiedCallback = chai.spy(callback)

      instance.addChangeListener(spiedCallback)
      var emailsList = ["user1@gmail.com", "user2@gmail.com"]
      instance.setEmails(emailsList)

      expect(spiedCallback).to.have.been.called();
      expect(notifiedNewValue).to.be.eql(emailsList)
      expect(notifiedNewValue).to.not.be.equal(emailsList)

    });

    it("addEmail() should trigger change event", function () {
      var element = document.createElement('div')
      var instance = new EmailsInput(element)
      var initialState = ["user1@gmail.com", "user2@gmail.com"]
      instance.setEmails(initialState)

      var notifiedNewValue;
      var callback = function (newValue) {
        notifiedNewValue = newValue;
      }

      var spiedCallback = chai.spy(callback)

      instance.addChangeListener(spiedCallback)
      instance.addEmail("user3@gmail.com")

      initialState.push("user3@gmail.com");

      expect(spiedCallback).to.have.been.called();
      expect(notifiedNewValue).to.be.eql(initialState)
      expect(notifiedNewValue).to.not.be.equal(initialState)
    });
  });
})
