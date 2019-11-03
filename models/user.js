//user model
var user = function(userID, FirstName, LastName, EmailAddress, Address1, Address2, City, State, ZipCode, Country){
  var userModel = {userID: userID, FirstName: FirstName, LastName: LastName, EmailAddress: EmailAddress, Address1: Address1, Address2: Address2, City: City, State: State, ZipCode: ZipCode, Country: Country};
  return userModel;
}

module.exports.user = user;
