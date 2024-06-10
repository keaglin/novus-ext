import { useEffect, useState } from 'react';

const App = () => {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    // Retrieve the analysis from chrome.storage
    chrome.storage.local.get('analysis', (result) => {
      if (result.analysis) {
        setAnalysis(result.analysis);
      }
    });
  }, []);

  const checkStorage = () => {
    chrome.storage.local.get('analysis', (result) => {
      console.log('Stored analysis:', result.analysis);
    });
  };

  return (
    <div>
      <h1>Analysis Result</h1>
      {analysis ? (
        <pre>{JSON.stringify(analysis, null, 2)}</pre>
      ) : (
        <p>No analysis data available.</p>
      )}
      <button onClick={checkStorage}>Check Storage</button>
    </div>
  );
};

export default App;
