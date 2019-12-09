// HELPERS
const fetch = require('node-fetch');

const apiUrl = "/.netlify/functions/SignedUrlFunction";

const successUploadMsg = "El archivo se subio satisfactoriamente";
const failureUploadMsg = "El archivo no se subio, ver la consola para detalles del error";

export async function getCsvPutUrl(fileName, type, userEmail, userToken, entityId) {
    const payload = getPayload(fileName, type, "csv", userEmail, userToken, entityId);
    const response = await fetch(apiUrl, {
        "headers": { "content-type": "application/json" },
        "body": JSON.stringify(payload),
        "method": "POST",
        "mode": "cors"
    }).then(response => response.json()).catch(err => alert(failureUploadMsg));
    return response;
}

export async function getXmlPutUrl(fileName, type, userEmail, userToken, entityId) {
    const payload = getPayload(fileName, type, "xml", userEmail, userToken, entityId);
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
        "headers": { "Content-Type": "multipart/form-data" },
        "body": fileObj,
        "method": "PUT"
    }).then(response => {
        if (response.status === 200) {
            alert(successUploadMsg);
        } else {
            alert(failureUploadMsg);
            console.log("error response: ", response);
        }
        return response.json();
    }).catch(err => console.log("uploading error >>> ", err.message));
    return response;
}

function getPayload(fileName, mimeType, fileType, userEmail, userToken, entityId) {
    return {
        "isBase64Encoded": false,
        "clientFilename": fileName,
        "mimeType": mimeType,
        "type": fileType,
        "userEmail": userEmail,
        "userToken": userToken,
        "entityId": entityId
    };
}