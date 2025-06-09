import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, DollarSign, Clock, Calendar, CreditCard } from 'lucide-react';

interface CreditAnalysisResultProps {
  analysisResult: string;
}

interface NegativeItem {
  title: string;
  details: Record<string, string>;
}

export const CreditAnalysisResult: React.FC<CreditAnalysisResultProps> = ({ analysisResult }) => {
  // Parse the analysis result to extract sections
  const parseAnalysisResult = () => {
    try {
      // Check if the analysis contains the expected format with ### headers
      if (analysisResult.includes('### Negative Items:')) {
        // Extract sections using ### as delimiters
        const sections = analysisResult.split('###').filter(section => section.trim().length > 0);
        
        // Parse negative items
        const negativeItemsSection = sections.find(section => section.trim().startsWith('Negative Items:'));
        const negativeItems = parseNegativeItems(negativeItemsSection || '');
        
        // Parse positive factors
        const factorsSection = sections.find(section => section.trim().startsWith('Factors Affecting Business Funding Eligibility:'));
        const positiveFactors = parseFactors(factorsSection || '', 'Positive Factors:');
        const negativeFactors = parseFactors(factorsSection || '', 'Negative Factors:');
        
        // Extract credit scores if available
        const scores = extractCreditScores(analysisResult);
        
        return {
          negativeItems,
          positiveFactors,
          negativeFactors,
          creditScores: scores,
          rawAnalysis: analysisResult
        };
      } else {
        // Fallback to the original parsing method for different formats
        const sections = analysisResult.split('**').filter(section => section.trim().length > 0);
        
        const negativeItems = extractSection(sections, 'Negative Items');
        const positiveFactors = extractSection(sections, 'Positive Factors');
        const negativeFactors = extractSection(sections, 'Negative Factors');
        
        return {
          negativeItems: negativeItems.map(item => ({ 
            title: item,
            details: {}
          })),
          positiveFactors,
          negativeFactors,
          creditScores: extractCreditScores(analysisResult),
          rawAnalysis: analysisResult
        };
      }
    } catch (error) {
      console.error('Error parsing analysis result:', error);
      return {
        negativeItems: [],
        positiveFactors: [],
        negativeFactors: [],
        creditScores: {},
        rawAnalysis: analysisResult
      };
    }
  };

  // Parse negative items from the section
  const parseNegativeItems = (section: string): NegativeItem[] => {
    const items: NegativeItem[] = [];
    
    // Remove the section header
    const content = section.replace('Negative Items:', '').trim();
    
    // Split by numbered items (1., 2., etc.)
    const itemRegex = /\d+\s*\.*\s*\*\*(.*?)\*\*([\s\S]*?)(?=\d+\s*\.*\s*\*\*|$)/g;
    let match;
    
    while ((match = itemRegex.exec(content)) !== null) {
      const title = match[1].trim();
      const detailsText = match[2].trim();
      
      // Parse details (- Key: Value format)
      const details: Record<string, string> = {};
      const detailLines = detailsText.split('\n').map(line => line.trim()).filter(line => line.startsWith('-'));
      
      detailLines.forEach(line => {
        const [key, value] = line.substring(1).split(':').map(part => part.trim());
        if (key && value) {
          details[key] = value;
        }
      });
      
      items.push({
        title,
        details
      });
    }
    
    return items;
  };

  // Parse factors from the section
  const parseFactors = (section: string, factorType: string): string[] => {
    if (!section.includes(factorType)) return [];
    
    const startIdx = section.indexOf(factorType) + factorType.length;
    let endIdx = section.length;
    
    // Find the end of this factor section (next section or end of string)
    const nextSectionMatch = section.substring(startIdx).match(/\*\*(.*?)\*\*/); 
    if (nextSectionMatch && nextSectionMatch.index) {
      endIdx = startIdx + nextSectionMatch.index;
    }
    
    const content = section.substring(startIdx, endIdx).trim();
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-'))
      .map(line => line.substring(1).trim());
  };

  // Helper function to extract a specific section from the analysis result (fallback method)
  const extractSection = (sections: string[], sectionName: string): string[] => {
    const sectionIndex = sections.findIndex(section => 
      section.trim().toLowerCase().startsWith(sectionName.toLowerCase() + ':')
    );
    
    if (sectionIndex === -1) return [];
    
    const content = sections[sectionIndex].split(':').slice(1).join(':').trim();
    const items = content.split('-').filter(item => item.trim().length > 0);
    
    return items.map(item => item.trim());
  };

  // Extract credit scores if available in the analysis
  const extractCreditScores = (text: string): Record<string, number> => {
    const scoreRegex = /(TransUnion|Equifax|Experian):\s*(\d+)/g;
    let match;
    const scores: Record<string, number> = {};
    
    while ((match = scoreRegex.exec(text)) !== null) {
      scores[match[1]] = parseInt(match[2], 10);
    }
    
    return scores;
  };

  // Function to render a score gauge
  const renderScoreGauge = (score: number) => {
    const scoreColor = 
      score < 580 ? 'bg-red-500' : 
      score < 670 ? 'bg-yellow-500' : 
      score < 740 ? 'bg-blue-500' : 'bg-green-500';
    
    const percentage = Math.min(Math.max((score - 300) / (850 - 300) * 100, 0), 100);
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-4 mb-1">
        <div 
          className={`h-4 rounded-full ${scoreColor}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  // Parse the analysis result
  const { negativeItems, positiveFactors, negativeFactors, creditScores, rawAnalysis } = parseAnalysisResult();

  return (
    <div className="space-y-8">
      {/* Credit Scores Section */}
      {Object.keys(creditScores).length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            <TrendingUp className="mr-2 text-blue-600" size={24} />
            Credit Scores
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(creditScores).map(([bureau, score]) => (
              <div key={bureau} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-700">{bureau}</h4>
                <div className="text-3xl font-bold my-2 text-blue-700">{score}</div>
                {renderScoreGauge(score)}
                <div className="text-xs text-gray-500 mt-1">
                  {score < 580 ? 'Poor' : 
                   score < 670 ? 'Fair' : 
                   score < 740 ? 'Good' : 'Excellent'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negative Items Section */}
      {negativeItems.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-red-100">
          <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-red-600" size={24} />
            Negative Items
          </h3>
          <div className="space-y-4">
            {negativeItems.map((item, index) => (
              <div key={index} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <div className="font-semibold text-red-800 mb-2">{item.title}</div>
                
                {Object.keys(item.details).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Object.entries(item.details).map(([key, value], i) => (
                      <div key={i} className="flex items-start">
                        <div className="mr-2">
                          {key.includes('Amount') || key.includes('Balance') ? (
                            <DollarSign size={16} className="text-gray-500" />
                          ) : key.includes('Date') ? (
                            <Calendar size={16} className="text-gray-500" />
                          ) : key.includes('Account') ? (
                            <CreditCard size={16} className="text-gray-500" />
                          ) : key.includes('Days') ? (
                            <Clock size={16} className="text-gray-500" />
                          ) : (
                            <span></span>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-600">{key}:</span>{' '}
                          <span className="text-gray-900">{String(value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Factors Affecting Business Funding Eligibility */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Positive Factors */}
        {positiveFactors.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-green-100">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
              <CheckCircle className="mr-2 text-green-600" size={24} />
              Positive Factors
            </h3>
            <ul className="space-y-2">
              {positiveFactors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="mr-2 text-green-500 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Negative Factors */}
        {negativeFactors.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-yellow-100">
            <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
              <AlertCircle className="mr-2 text-yellow-600" size={24} />
              Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {negativeFactors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <AlertCircle className="mr-2 text-yellow-500 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Raw Analysis */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <details className="text-sm">
          <summary className="text-blue-600 cursor-pointer font-medium">View Raw Analysis</summary>
          <pre className="mt-2 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-xs border border-gray-200 overflow-auto max-h-96">
            {rawAnalysis}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default CreditAnalysisResult;
