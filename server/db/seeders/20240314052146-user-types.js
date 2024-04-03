'use strict';

module.exports = {
  up: (models) => {

    return models.user_types
     .insertMany([
      {
        _id: "65f28a92efa5fcf56cff2318",
        user_type: "admin"
      },
      {
        _id: "65f28b1befa5fcf56cff2319",
        user_type: "employee"
      },
     ])
     .then((res) => {
      console.log(res.insertedCount);
     });
  },

  down: (models) => {

    return models.user_types
    .deleteMany({
      _id: {
        $in: [
          "65f28a92efa5fcf56cff2318",
          "65f28b1befa5fcf56cff2319",
        ],
      },
    })
    .then((res) => {
      console.log(res.deletedCount);
    });
  },
};
