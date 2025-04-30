import { useEffect, useState } from 'react';
import { AnalysisResponse } from './types';

const App = () => {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    // Retrieve the analysis from chrome.storage
    chrome.storage.local.get('analysis', (result) => {
      if (result.analysis) {
        setAnalysis(JSON.parse(result.analysis));
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
        <div>
          <h2>Sentiment Analysis</h2>
          <p>Sentiment Score: {analysis.sentimentAnalysis.sentimentScore}</p>
          <p>Suspicious Phrases: {analysis.sentimentAnalysis.suspiciousPhrases.join(', ') || 'None'}</p>
          <p>Indicators: {analysis.sentimentAnalysis.indicators.join(', ') || 'None'}</p>

          <h2>HTML Source Code Inspection</h2>
          <p>Suspicious Links: {analysis.htmlSourceCodeInspection.suspiciousLinks.join(', ') || 'None'}</p>
          <p>Suspicious Scripts: {analysis.htmlSourceCodeInspection.suspiciousScripts.join(', ') || 'None'}</p>
          <p>Scam Language: {analysis.htmlSourceCodeInspection.scamLanguage.join(', ') || 'None'}</p>

          <h2>Report and Recommendations</h2>
          <p>Summary: {analysis.reportAndRecommendations.summary}</p>
          <p>Recommendations: {analysis.reportAndRecommendations.recommendations}</p>
          <p>Resources:</p>
          <ul>
            <li><a href={analysis.reportAndRecommendations.resources.whereToReportScams} target="_blank" rel="noopener noreferrer">Where to Report Scams</a></li>
            <li><a href={analysis.reportAndRecommendations.resources.howToAvoidScams} target="_blank" rel="noopener noreferrer">How to Avoid Scams</a></li>
          </ul>
        </div>
      ) : (
        <p>No analysis data available.</p>
      )}
      <button onClick={checkStorage}>Check Storage</button>
    </div>
  );
};

export default App;
