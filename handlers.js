const dotenv = require("dotenv");
dotenv.config();
const request = require("request-promise");
const opencage = require("opencage-api-client");

const getIssPosition = async () => {
  const options = {
    method: "GET",
    uri: "http://api.open-notify.org/iss-now.json",
  };

  try {
    const res = await request(options);
    const issLocation = JSON.parse(res);
    const output = {
      lat: issLocation.iss_position.latitude,
      lng: issLocation.iss_position.longitude,
    };
    console.log(output);
    return output;
  } catch (error) {
    console.log("Error: ", error);
  }
};

function getAddressPosition(address) {
  const requestObj = {
    key: process.env.OPENCAGE_API_KEY,
    q: address,
  };

  return opencage
    .geocode(requestObj)
    .then((data) => {
      if (data.status.code == 200) {
        if (data.results.length > 0) {
          const place = data.results[0];
          return {
            lat: place.geometry.lat,
            lng: place.geometry.lng,
          };
        }
      } else {
        console.log("error", data.status.message);
      }
    })
    .catch((error) => console.log("Error:", error));
}

console.log("API KEY:", process.env.OPENCAGE_API_KEY);
console.log("Process env:", process.env);

getIssPosition()
  .then((res) => console.log(res))
  .then((res) => getAddressPosition(res))
  .then((res) => console.log(res));
