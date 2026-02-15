export interface VerificationResult {
  score: number;
  matchedConcepts: string[];
  missingConcepts: string[];
  feedback: string;
}

export const verifyExplanation = (userInput: string, expectedConcepts: string[]): VerificationResult => {
  const inputLower = userInput.toLowerCase();
  const matchedConcepts = expectedConcepts.filter(concept => 
    inputLower.includes(concept.toLowerCase())
  );
  
  const missingConcepts = expectedConcepts.filter(concept => 
    !inputLower.includes(concept.toLowerCase())
  );
  
  const score = Math.round((matchedConcepts.length / expectedConcepts.length) * 100);
  
  let feedback = "";
  if (score === 100) {
    feedback = "Excellent! You covered all the key concepts.";
  } else if (score > 60) {
    feedback = "Good job, but you missed a few key nuances.";
  } else {
    feedback = "You might want to review the learning material. Some core concepts were missing.";
  }

  return {
    score,
    matchedConcepts,
    missingConcepts,
    feedback
  };
};
