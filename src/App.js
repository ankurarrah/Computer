// ./src/App.js

import React, { useState } from 'react';
import './App.css';
import { computerVision, isConfigured as ComputerVisionIsConfigured } from './azure-cognitiveservices-computervision';

function App() {

  const [fileSelected, setFileSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setFileSelected(e.target.value)
  }

  const onFileUrlEntered = (e) => {

    // hold UI
    setProcessing(true);
    setAnalysis(null);

    computerVision(fileSelected || null).then((item) => {
      // reset state/form
      setAnalysis(item);
      setFileSelected("");
      setProcessing(false);
    });

  };

  // Display JSON data in readable format
  const PrettyPrintJson = (data) => {
    return (<div>Text<pre>{JSON.stringify(data, null, 2)}</pre><br />Links<pre>{getLinks(data).join('\n')}</pre></div>);
  }

  const DisplayResults = () => {
    return (
      <div>
        <h2>Computer Vision Analysis</h2>
        <div><img src={analysis.URL} height="200" border="1" alt={(analysis.description && analysis.description.captions && analysis.description.captions[0].text ? analysis.description.captions[0].text : "can't find caption")} /></div>
        {PrettyPrintJson(analysis.text)}
      </div>
    )
  };

  const Analyze = () => {
    return (
      <div>
        <h1>Analyze image</h1>
        {!processing &&
          <div>
            <div>
              <label>URL</label>
              <input type="text" placeholder="Enter URL" size="50" onChange={handleChange}></input>
            </div>
            <button onClick={onFileUrlEntered}>Analyze</button>
          </div>
        }
        {processing && <div>Processing</div>}
        <hr />
        {analysis && DisplayResults()}
      </div>
    )
  }

  const CantAnalyze = () => {
    return (
      <div>Key and/or endpoint not configured in ./azure-cognitiveservices-computervision.js</div>
    )
  }

  function Render() {
    const ready = ComputerVisionIsConfigured();
    if (ready) {
      return <Analyze />;
    }
    return <CantAnalyze />;
  }

  // function getLinks(input) {
  //   // var expression = /(https?:\/\/)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~@:%]*)*(#[\w\-]*)?(\?[^\s]*)?/gi;
  //   var expression = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; 
  //   var regex = new RegExp(expression);
  //   var match = ''; var splitText = []; var startIndex = 0;

  //   var textToCheck = Array.isArray(input) ? input.join(' ') : input;
  //   while ((match = regex.exec(textToCheck)) != null) {

  //     // splitText.push({ text: textToCheck.substr(startIndex, (match.index - startIndex)), type: 'text' });

  //     var cleanedLink = textToCheck.substr(match.index, (match[0].length));
  //     //cleanedLink = cleanedLink.replace(/^https?:\/\//, '');
  //     splitText.push({ text: cleanedLink, type: 'link' });

  //     startIndex = match.index + (match[0].length);
  //   }
  //   // if (startIndex < textToCheck.length) 
  //   //   splitText.push({ text: textToCheck.substr(startIndex), type: 'text' });
  //   //console.log(splitText);
  //   //return splitText.map(t=>t.text).join('\n');
  //   return [... new Set(splitText.map(t=>t.text))];
  // }

  function getLinks(input) {
    var expressionDomains = /(https?:\/\/)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~@:%]*)*(#[\w\-]*)?(\?[^\s]*)?/gi;
    var expressionProtocol = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var expressionEmail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

    var l1 = getLinkByExpression(input, expressionDomains);
    var l2 = getLinkByExpression(input, expressionProtocol);
    var l3 = getLinkByExpression(input, expressionEmail);
    l1 = l1.filter(l => l2.filter(w => w.substr(l)).length == 0);
    return [... new Set(l1.concat(l2).concat(l3))];
  }

  function getLinkByExpression(input, expression) {
    var regex = new RegExp(expression);
    var match = ''; var splitText = []; var startIndex = 0;

    var textToCheck = Array.isArray(input) ? input.join(' ') : input;
    while ((match = regex.exec(textToCheck)) != null) {

      // splitText.push({ text: textToCheck.substr(startIndex, (match.index - startIndex)), type: 'text' });

      var cleanedLink = textToCheck.substr(match.index, (match[0].length));
      //cleanedLink = cleanedLink.replace(/^https?:\/\//, '');
      splitText.push({ text: cleanedLink, type: 'link' });

      startIndex = match.index + (match[0].length);
    }
    return splitText.map(t => t.text);
    // if (startIndex < textToCheck.length) 
    //   splitText.push({ text: textToCheck.substr(startIndex), type: 'text' });
    //console.log(splitText);
    //return splitText.map(t=>t.text).join('\n');
    // return [... new Set(splitText.map(t=>t.text))];
  }

  return (
    <div>
      {Render()}
    </div>

  );
}

export default App;
