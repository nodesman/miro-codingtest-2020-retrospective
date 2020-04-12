var expect = chai.expect;
describe('EmailsInput', function() {
  describe('Instantiation', function() {
    it('should not allow more than one instance on the same element', function() {

      var element = document.createElement("div");
      var firstInstance = new EmailsInput(element);

      function instantiateSecond() {
        var secondInstance = new EmailsInput(element);
      }

      expect(instantiateSecond).to.throw(Error);

    });
  });
});
