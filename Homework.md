**Homework due September 29, 2016**

----

**Part 1**

In this part of the exercise, you will identify error codes and error messages that will be part of the response body of your API if there's a problem
in fulfilling a request. the response body will look as below

```
{
    "statusCode" : 201,
    "errorCode" : 1234,
    "errorMessage" : "Invalid resource name cars"
}

```

Identify all possible error codes for each of the resources and consolidate them into a single table as below. Some 
examples of possible errors are below.

1. Invalid resource name
2. Identifier not matching any resource instance
3. Invalid property name (given in POST)
4. Invalid value for a property (given in POST)

Present your submission in the form a document with the following table. 

| Error Code | Error Message                           | Relevant Resources | Parameters           |
| ---------- | --------------------------------------- | ------------------ | -------------------- |
| 1001       | Invalid resource name {0} given         | All resources      | `0 - Resource Name`  |
| 1002       | Given car does not exist                | `cars`             | None                 |
| 1003       | Missing request body                    | All resources      | None                 |
| 1004       | Invalid request format                  | All resources      | None                 |
| 1005       | Missing required property to create {0} | All resources      | `0 - Resource Name`  |
| 1006       | {0} should be unique                    | All resources      | `0 - parameter name` |
| 1007       | Invalid property value                  | All resources      | None                 |
| 1008       | Invalid property type {0}               | All resources      | `0- property type`   |

----

**Part 2**

In the second part of the homework, you will implement all the errors listed in the above table into your code.  
[This link](https://bitbucket.org/appcmusv/transportation-express-api) points to the code you can use to add your code.
Follow instructions in the README.md file to install this locally and add your code using your favorite editor.

Below are the fields you should add to the entities. 

_drivers_

- firstName
- lastName
- emailAddress
- password (Used for POST only)
- addressLine1
- addressLine2
- city
- state
- zip
- phoneNumber

_passengers_

- firstName
- lastName
- emailAddress
- password (Used for POST only)
- addressLine1
- addressLine2
- city
- state
- zip
- phoneNumber

_cars_

- driver (reference)
- make
- model
- license
- doorCount

_ride_

- passenger (reference)
- driver (reference)
- car (reference)
- rideType (ECONOMY, PREMIUM, EXECUTIVE)
- startPoint  (latitude/longitude combination)
- endPoint (latitude/longitude combination)
- requestTime
- pickupTime
- dropOffTime
- status (REQUESTED, AWAITING_DRIVER, DRIVE_ASSIGNED, IN_PROGRESS, ARRIVED, CLOSED )
- fare
- route (series of latitude/longitude values)

_paymentAccount_

- accountType
- accountNumber
- expirationDate (optional, for passenger accounts only)
- nameOnAccount
- bank (optional, for driver accounts only)






module.exports = {

    invalidResource: reportInvalidResource,
    invalidId: reportInvalidId,
    emptyBody: reportEmptyBody,
    invalidFormat: reportInvalidFormat,
    missingParam: reportMissingParam,
    duplicateEmail: reportDuplicateEmail,
    invalidPropertyValue: reportInvalidPropertyValue,
    typeError: reportTypeError
}



    carId: Number,
    license: String,
    driverId: Number,
    plateNumber: String,
    insuranceInfo: String,
    year: Number,
    make: String,
    model: String, 
    doorCount: Number