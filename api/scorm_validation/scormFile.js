var axios = require("axios");
var jwt = require("jsonwebtoken");
require("custom-env").config();
const { getGcpSecret } = require("../common");

let jwtSecret;
const loadSecrets = async() => {
  jwtSecret = await getGcpSecret(process.env.GSECRET_SCORM_JWT_SECRET_TOKEN, process.env.JWT_SECRET_TOKEN);
}
loadSecrets();

const baseUrl = process.env.SCORM_PLAYER_BASE_URL;

async function validate(scorm, userDetails) {
  const accesscode = generateScormPlayerJWTToken(userDetails.email);
  const name = userDetails.firstname + " " + userDetails.lastname;
  const url =
    baseUrl +
    "api/v1/navTree?contentID=" +
    scorm.contentid +
    "&accesscode=" +
    accesscode +
    "&email=" +
    userDetails.email +
    "&name=" +
    name +
    "&userid=" +
    userDetails._id;
    try {
      const response = await axios.get(url);
      if (response.data != undefined && response.data.length >0) {
        return response.data
      } else {
        return []
      }
    } catch {
      return []
    }
  
}

function generateScormPlayerJWTToken(userEmail) {
  var payload = { email: userEmail };
  // HS256 secrets are typically 128-bit random strings, for example hex-encoded:
  // var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

  // encode
  let accessToken = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
  return accessToken;
}

module.exports = {
  validate,
};
