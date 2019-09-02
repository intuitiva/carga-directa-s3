var async = require('async');
const fetch = require('node-fetch');

const apiUrl = "/.netlify/functions/SignedUrlFunction";

const successUploadMsg = "File upload Successful";
const failureUploadMsg = "File upload Failed";

export async function getCsvPutUrl(fileName, type, userEmail, userToken) {
    const payload = getPayload(fileName, type, "csv", userEmail, userToken);
    const response = await fetch(apiUrl, {
        "headers": { "content-type": "application/json" },
        "body": JSON.stringify(payload),
        "method": "POST",
        "mode": "cors"
    }).then(response => response.json()).catch(err => alert(failureUploadMsg));
    return response;
}

export async function getXmlPutUrl(fileName, type, userEmail, userToken) {
    const payload = getPayload(fileName, type, "xml", userEmail, userToken);
    const response = await fetch(apiUrl, {
        "headers": { "content-type": "application/json" },
        "body": JSON.stringify(payload),
        "method": "POST",
        "mode": "cors"
    }).then(response => response.json()).catch(err => alert(failureUploadMsg));
    return response;
}

export async function uploadFile(fileObj, signedUrl) {
    const response = await fetch(signedUrl.putUrl, {
        "headers": { "content-type": "multipart/form-data" },
        "body": fileObj,
        "method": "PUT"
    }).then(response => {
        if (response.status === 200) {
            alert(successUploadMsg);
        } else {
            alert(failureUploadMsg);
        }
        return response.json();
    }).catch(err => console.log(err));
    return response;
}

function getPayload(fileName, mimeType, fileType, userEmail, userToken) {
    return {
        "isBase64Encoded": false,
        "clientFilename": fileName,
        "mimeType": mimeType,
        "type": fileType,
        "userEmail": userEmail,
        "userToken": userToken
    };
}