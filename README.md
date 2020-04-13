Emails Input
===========

<img src="./demo/current.png">

A email input field without any dependencies. This input field supports:

1. Pasting a set of email addresses 
2. Interfacing with other components
3. Has events to notify listeners

USAGE
=====

In your page, create a host element:
```$html
<div class="emails-list-container"></div>
```

Instantiate an instance of the element using:

```$js
var element = document.querySelector(".emails-list-container");
var instance = EmailsInput(element, {
    placeholder: "Add more teammates ... "
});
``` 

API
===

In all the following examples `instance` represents an instance of the `EmailsInput` class. Such as in the statement below:

```$xslt
var instance = new EmailsInput(document.querySelector("#host"), {
    placeholder: "Add more ... "
});
```

### addEmail(strEmail)

Example:
```$xslt
instance.addEmail("user@gmail.com");
```

### getEmails()

Get all valid emails in the instance as a list of strings.

Example:
```$xslt
instance.getEmails() // returns ["test@gmail.com", "test2@gmail.com"]
```

Accepts a string as the first argument which is the email to be added to the emails input instance. 

### getAllItems()

Example:
```$xslt
instance.getAllItems(); // returns ["test@gmail.com", "test2@gmail.com", "abcd"]
```

This returns all the items - valid emails as well as invalid items as they are currently in the emails input instance.

### setEmails(arrEmails)

This method accepts an array of strings representing email address. It replaces all existing items - valid and invalid emails with the list of items given in `arrEmails`. Array elements will be rendered depending on if they are valid email addresses.

Example:

```$xslt
instance.setEmails(['test@gmail.com']);
```

### addChangeListener(listenerFunction)

This method allows you to register a function to be called with an EmailsInput instance when the items in it are changed either by user interaction or via API.

The function `listenerFunction` will be called with the first argument as the array of items in the instance.


Example:

```$xslt
function handler(listOfEmails) {
    console.log(listOfEmails);
}

var instance = new EmailsInstace(element);
instance.addEmail("test@gmail.com");
instance.addChangeListener(handler);
instance.addEmail("test2@gmail.com");

``` 

The above will output:

```$xslt
['test@gmail.com', 'test2@gmail.com'] 
```
