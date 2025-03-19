// Database of common dog health issues and their descriptions
export const dogHealthIssues = {
  vomiting: {
    symptoms: "Vomiting can be accompanied by lethargy, diarrhea, and loss of appetite.",
    causes:
      "Common causes include eating something they shouldn't have, infections, parasites, or more serious conditions like pancreatitis or kidney disease.",
    treatment:
      "For occasional vomiting, withhold food for 12-24 hours but provide water. If vomiting persists for more than 24 hours, is accompanied by other symptoms, or contains blood, consult a veterinarian immediately.",
    prevention:
      "Prevent access to trash, toxic plants, and human foods that are harmful to dogs. Regular deworming and vaccinations can prevent some causes of vomiting.",
  },

  diarrhea: {
    symptoms:
      "Loose, watery stools, sometimes with mucus or blood. May be accompanied by straining, increased frequency, and accidents in the house.",
    causes:
      "Dietary indiscretion, sudden food changes, stress, parasites, bacterial or viral infections, or more serious conditions like inflammatory bowel disease.",
    treatment:
      "For mild cases, a 12-24 hour fast followed by a bland diet (boiled chicken and rice) can help. Ensure plenty of water to prevent dehydration. Persistent or severe diarrhea requires veterinary attention.",
    prevention:
      "Gradual food transitions, consistent diet, regular parasite control, and preventing access to garbage or spoiled food.",
  },

  limping: {
    symptoms:
      "Favoring one leg, reluctance to put weight on a limb, difficulty rising or lying down, yelping when moving.",
    causes:
      "Injuries like sprains or fractures, arthritis, hip or elbow dysplasia, torn ligaments, paw injuries, or infections.",
    treatment:
      "Rest is important for minor injuries. Apply ice for acute injuries. Persistent limping requires veterinary examination to determine the cause and appropriate treatment.",
    prevention:
      "Maintain healthy weight, provide joint supplements for at-risk breeds, avoid excessive exercise in growing puppies, and ensure safe play environments.",
  },

  itching: {
    symptoms: "Scratching, licking, chewing at skin, red or irritated skin, hair loss, skin infections.",
    causes:
      "Allergies (environmental, food, or flea), parasites (fleas, mites, ticks), dry skin, or bacterial/fungal infections.",
    treatment:
      "Depends on the cause. May include antiparasitic medications, antihistamines, special diets, medicated shampoos, or antibiotics for secondary infections.",
    prevention:
      "Regular flea and tick prevention, high-quality diet, regular bathing with appropriate shampoos, and identifying and avoiding allergens.",
  },

  coughing: {
    symptoms: "Persistent cough, which may be dry, hacking, or productive. May worsen with exercise or excitement.",
    causes: "Kennel cough, tracheal collapse, heart disease, respiratory infections, or foreign objects in the airway.",
    treatment:
      "Depends on the cause. May include rest, antibiotics, cough suppressants, or more intensive treatment for underlying conditions.",
    prevention:
      "Vaccination against kennel cough, avoiding exposure to sick dogs, using a harness instead of a collar for dogs with tracheal issues.",
  },
}

// Function to find the most relevant health issue based on keywords in the question
export function findRelevantHealthIssue(question: string): string | null {
  const lowerQuestion = question.toLowerCase()

  for (const [issue, info] of Object.entries(dogHealthIssues)) {
    if (lowerQuestion.includes(issue)) {
      return issue
    }
  }

  // Check for related terms
  if (/\b(throw up|throwing up|puking|nauseous|sick to stomach)\b/i.test(lowerQuestion)) {
    return "vomiting"
  }

  if (/\b(loose stool|bowel|poop|runny|soft stool)\b/i.test(lowerQuestion)) {
    return "diarrhea"
  }

  if (/\b(leg pain|can't walk|trouble walking|lame|hobbling)\b/i.test(lowerQuestion)) {
    return "limping"
  }

  if (/\b(scratch|scratching|skin|rash|allergy|allergies|flea|fleas)\b/i.test(lowerQuestion)) {
    return "itching"
  }

  if (/\b(hack|hacking|kennel cough|breathing|choking|gagging)\b/i.test(lowerQuestion)) {
    return "coughing"
  }

  return null
}

// Function to generate a response for a specific health issue
export function generateHealthResponse(issue: string): string {
  const healthInfo = dogHealthIssues[issue as keyof typeof dogHealthIssues]

  return `If your dog is experiencing ${issue}, here's what you should know:

Symptoms: ${healthInfo.symptoms}

Possible causes: ${healthInfo.causes}

Recommended care: ${healthInfo.treatment}

Prevention tips: ${healthInfo.prevention}

Remember, this is general advice. If your dog's condition is severe or persistent, please consult with a veterinarian as soon as possible.`
}

