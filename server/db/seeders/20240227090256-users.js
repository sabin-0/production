'use strict';

module.exports = {
  up: (models) => {
    return models.users
    .insertMany([
      
      {
        _id: "65dda705a7946887e0361a57",
        firstname: "john",
        lastname : "rambo",
        email: "jr@gmail.com",
        password: "$2a$12$LsCXerALVH1T1wAI1wfUI.7OjZIjdk1de7Q06WaSfErOGIUX5ChYu",
        phone: "9349157204",
        user_type: "65f28a92efa5fcf56cff2318"
      },
      {
        _id: "65f4216f7d6257c341faeab7",
        firstname: "john",
        lastname: "wick",
        email: "jw@gmail.com",
        password: "$2a$12$Dha7y4QrtIJhIA0ZtOS89eZeGe5aYe3Yq1PGksP4JlJXU3l2GNMve",
        phone: "45782938838",
        user_type: "65f28b1befa5fcf56cff2319"
      }
    ])
  },

  down: (models) => {
    return models.users
    .deleteMany({
      _id : {
        $in: [
          "65dda705a7946887e0361a57"
        ],
      },
    })
    .then((res)=>{
      console.log(res.deletedCount);
    })
  }
};
