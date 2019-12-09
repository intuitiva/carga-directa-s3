// This function gives me a temp URL (signed) where I can put my uploaded files
var Buffer = require("buffer").Buffer;
var AWS = require("aws-sdk");
var cuid = require("cuid");

var s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: process.env.AWS_AZ_REGION,
  signatureVersion: 'v4'
});
const s3BucketName = process.env.AWS_S3_BUCKET;
const crossOrigin = process.env.NETLIFY_ACCESS_CONTROL_ALLOW_ORIGIN;


exports.handler = function (event, context, callback) {
  if (event.httpMethod === "OPTIONS") {
    callback(
      null,
      getSuccessPayload()
    );
    return;
  }
  try {
    var body = parseBody(event.body, event.isBase64Encoded);
    callback(null, getSignedUrl(body.clientFilename, body.mimeType, body.type, body.userEmail, body.userToken, body.entityId));
  } catch (error) {
    var response = getFailurePayload("Solicitud no procesada: " + error.message);
  }
  callback(null, response);
}

function parseBody(body, isBase64Encoded) {
  var normalizedBody = isBase64Encoded ? fromBase64(body) : body;
  return (JSON.parse(normalizedBody));
}

function fromBase64(encodedValue) {
  return (Buffer.from(encodedValue, "base64").toString("utf8"));
}

function getSuccessPayload() {
  return {
    statusCode: 200,
    headers: getHeaders(),
    body: JSON.stringify("OK")
  };
}

function getFailurePayload(errorTxt) {
  return {
    statusCode: 400,
    headers: getHeaders(),
    body: JSON.stringify({
      message: errorTxt
    })
  };
}

function getHeaders() {
  return {
    "Access-Control-Allow-Origin": crossOrigin,
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function getSignedUrl(fileName, mimeType, type, userEmail, userToken, entityId) {
  let date_ob = new Date();
  let year = date_ob.getFullYear();
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let day = ("0" + date_ob.getDate()).slice(-2);
  var resourceKey = type === "csv" ? `csv/${year.toString()}/${month.toString()}/${day.toString()}/${cuid()}/${fileName}` : `xml/${year.toString()}/${month.toString()}/${day.toString()}/${cuid()}/${fileName}`;
  return getUrl(resourceKey, mimeType, userEmail, userToken, entityId);
}

// Note: SignedUrl expiry is 5 min (5*60)
// We will force the mimeType to multipart/form-data
function getUrl(resourceKey, mimeType, userEmail, userToken, entityId) {
  const putParams = {
    Bucket: s3BucketName,
    Key: resourceKey,
    ContentType: "multipart/form-data",
    Expires: (5 * 60),
    Metadata: {
      "user": userEmail,
      "token": userToken,
      "entity": entityId
    }
  };

  console.log("putParams >>>", putParams);
  const putUrl = s3.getSignedUrl("putObject", putParams);
  console.log("putUrl >>>>", putUrl);
  console.log("headers >>>>>", getHeaders());
  return {
    statusCode: 200,
    headers: getHeaders(),
    body: JSON.stringify({
      putUrl: putUrl,
      resourceKey: decodeURIComponent(resourceKey)
    })
  };
}