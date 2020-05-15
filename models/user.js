//user model
var user = function(userID, password, FirstName, LastName, EmailAddress, Address1, Address2, City, State, ZipCode, Country, Image){
  var userModel = {userID: userID, password: {salt: password.salt, hash: password.passwordHash}, FirstName: FirstName, LastName: LastName, EmailAddress: EmailAddress, Address1: Address1, Address2: Address2, City: City, State: State, ZipCode: ZipCode, Country: Country, Image: Image};
  return userModel;
}

module.exports.user = user;
