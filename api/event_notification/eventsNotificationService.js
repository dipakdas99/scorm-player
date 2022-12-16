var axios = require("axios");
require("dotenv").config();

async function pushCompletedStatus(
  courseId,
  moduleId,
  userid
) {
  var data = JSON.stringify({
    userID: userid,
    moduleID: moduleId,
    completed: true,
  });

  var config = {
    method: "post",
    url: process.env.EVENT_NOTIFICATION_BASE_URL + "v1/moduleCompletion",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  console.log("event notification")
  await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports = {
  pushCompletedStatus,
};
