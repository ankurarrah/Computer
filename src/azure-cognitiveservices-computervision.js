// ./src/azure-cognitiveservices-computervision.js

// Azure SDK client libraries
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

// List of sample images to use in demo
import RandomImageUrl from './DefaultImages';

// import {fs} from 'fs';

// Authentication requirements
const key = '35074228b393450690d5c9a4ac95c12b';
const endpoint = 'https://fhlcomputervison.cognitiveservices.azure.com/';

console.log(`key = ${key}`)
console.log(`endpoint = ${endpoint}`)

// Cognitive service features
const visualFeatures = [
    "Tags",

];

export const isConfigured = () => {
    const result = (key && endpoint && (key.length > 0) && (endpoint.length > 0)) ? true : false;
    console.log(`key = ${key}`)
    console.log(`endpoint = ${endpoint}`)
    console.log(`ComputerVision isConfigured = ${result}`)
    return result;
}

// Computer Vision detected Printed Text
const includesText = async (tags) => {
    return tags.filter((el) => {
        return el.name.toLowerCase() === "text";
    });
}
// Computer Vision detected Handwriting
const includesHandwriting = async (tags) => {
    return tags.filter((el) => {
        return el.name.toLowerCase() === "handwriting";
    });
}
// Wait for text detection to succeed
const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

// Analyze Image from URL
export const computerVision = async (url) => {

    // authenticate to Azure service
    const computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

    // get image URL - entered in form or random from Default Images
    const urlToAnalyze = url || RandomImageUrl();

    // analyze image
    const analysis = await computerVisionClient.recognizePrintedText(true, urlToAnalyze, { visualFeatures });
    analysis.text = await readTextFromURL(computerVisionClient, urlToAnalyze);
    return { "URL": urlToAnalyze, text: analysis.text };
}
// analyze text in image
const readTextFromURL = async (client, url) => {

    //let result1 = await client.read(url);
    
    var base64Img = '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';

    let result = await client.readInStream(_base64ToArrayBuffer(base64Img));

    let operationID = result.operationLocation.split('/').slice(-1)[0];

    // Wait for read recognition to complete
    // result.status is initially undefined, since it's the result of read
    const start = Date.now();
    console.log(`${start} -${result?.status} `);

    while (result.status !== "succeeded") {
        await wait(500);
        console.log(`${Date.now() - start} -${result?.status} `);
        result = await client.getReadResult(operationID);
    }

    // Return the first page of result. 
    // Replace[0] with the desired page if this is a multi-page file such as .pdf or.tiff.
    return result.analyzeResult.readResults[0].lines.map(line => line.text);

    // let result = await client.recognizePrintedTextInStream(false, _base64ToArrayBuffer(base64Img));
    // if (result._response && result._response.status == 200) {
    //     // return JSON.parse(result._response.bodyAsText).regions.map(t=>t.lines).flat().map(t=>t.words).flat().map(t=>t.text);
    //     return result.regions.map(t=>t.lines).flat().map(t=>t.words).flat().map(t=>t.text);
    // } else {
    //     //TODO: Handle erorr case
    //     return "";
    // }
    
}

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}