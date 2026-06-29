export interface Formulation {
  type: 'Tablet' | 'Capsule' | 'Liquid' | 'Chewable' | 'Eye Drops' | 'Spot-On';
  strength: string;
  factor?: number; // mg per unit (tablet/capsule) or mg per mL (liquid)
  unit?: string; // 'tablet', 'capsule', 'mL', 'drop', 'pipette'
}

export interface Medication {
  id: string;
  name: string;
  generic: string;
  h2: string; // H2 heading for SEO compliance
  description: string;
  category: 'Antihistamine' | 'Anxiety & Sedation' | 'Pain & Inflammation (NSAID)' | 'Pain & Inflammation (Other)' | 'Antibiotic' | 'Anti-nausea' | 'Parasiticide' | 'Steroid' | 'Gastrointestinal' | 'Anesthetic & Sedative' | 'Behavioral' | 'Endocrine & Chronic Care';
  frequency: string; // How often H3
  duration: string; // How many days H3
  byWeightText: string; // By weight details H3
  safetyNotes: string; // Safety notes H3
  warningColor: 'yellow' | 'red' | 'blue';
  
  // SEO & Legal markers
  prescriptionRequired?: boolean;
  supervisionLevel?: 'OTC' | 'Prescription' | 'Strict Clinical Only';

  // Custom dosing structures
  isWeightIndependent?: boolean;
  dosePerLbMin?: number;
  dosePerLbMax?: number;
  dosePerKgMin?: number;
  dosePerKgMax?: number;
  
  // Custom categories or sub-options (e.g., motion sickness vs acute vomiting)
  subDoses?: {
    name: string;
    description: string;
    dosePerLb: number;
    dosePerKg: number;
    freq: string;
    dur: string;
  }[];
  
  formulations: Formulation[];
}

export const catMedications: Medication[] = [
  {
    id: 'gabapentin',
    name: 'Gabapentin',
    generic: 'Gabapentin',
    h2: 'Gabapentin Dosage for Cats',
    description: 'A highly effective nerve pain reliever, anticonvulsant, and situational anxiolytic widely used to calm cats before veterinary visits, travel, or handling.',
    category: 'Anxiety & Sedation',
    frequency: 'Given once (2–3 hours before veterinary/stress events) or every 8 to 12 hours for chronic pain control.',
    duration: 'Used as a single situational dose for stress, or long-term/chronic daily treatment for osteoarthritic or neuropathic discomfort.',
    byWeightText: 'Dosing ranges from a conservative 2 to 5 mg per pound (4.4 to 11 mg/kg) for pain control, up to a standardized sedative dose of approximately 10 mg per pound (22 mg/kg) for stress management.',
    safetyNotes: 'CRITICAL: Never use human liquid formulations containing Xylitol, which is highly toxic to pets. Expect temporary sedation, mild incoordination, or unsteady gait (ataxia), which typically resolves within a few hours.',
    warningColor: 'blue',
    subDoses: [
      {
        name: 'Situational Sedation & Travel Anxiety',
        description: 'Higher dose designed to reduce fear, aggression, and stress during vet visits.',
        dosePerLb: 10.0,
        dosePerKg: 22.0,
        freq: 'Give 2–3 hours before scheduled event',
        dur: 'Single situational dosing.'
      },
      {
        name: 'Chronic Pain & Discomfort Control',
        description: 'Lower maintenance dosing for neuralgias and feline osteoarthritis.',
        dosePerLb: 3.0,
        dosePerKg: 6.6,
        freq: 'Every 8 to 12 hours',
        dur: 'Continuous long-term therapy.'
      }
    ],
    formulations: [
      { type: 'Capsule', strength: '100 mg (Commonly opened/mixed)', factor: 100, unit: 'capsule' },
      { type: 'Liquid', strength: '50 mg / mL (Xylitol-Free Veterinary)', factor: 50, unit: 'mL' },
      { type: 'Tablet', strength: '50 mg (Compounded)', factor: 50, unit: 'tablet' }
    ]
  },
  {
    id: 'clavamox',
    name: 'Clavamox',
    generic: 'Amoxicillin / Clavulanate Potassium',
    h2: 'Clavamox Dosage for Cats',
    description: 'A broad-spectrum veterinary-prescribed antibiotic frequently used to treat feline skin infections, abscesses, wounds, and severe urinary tract infections.',
    category: 'Antibiotic',
    frequency: 'Administered strictly every 12 hours (twice daily).',
    duration: 'Typically given for 7 to 14 days; always complete the full course even if symptoms disappear early.',
    byWeightText: 'Standard clinical dosage is 6.25 mg per pound of body weight (13.75 mg/kg) twice daily.',
    safetyNotes: 'Common side effects include mild stomach upset, decreased appetite, vomiting, or diarrhea. Administering with a small meal can greatly reduce gastrointestinal irritation. Never use left-over or unprescribed antibiotics.',
    warningColor: 'yellow',
    dosePerLbMin: 6.25,
    dosePerLbMax: 6.25,
    dosePerKgMin: 13.75,
    dosePerKgMax: 13.75,
    formulations: [
      { type: 'Tablet', strength: '62.5 mg', factor: 62.5, unit: 'tablet' },
      { type: 'Tablet', strength: '125 mg', factor: 125, unit: 'tablet' },
      { type: 'Liquid', strength: '62.5 mg / mL', factor: 62.5, unit: 'mL' }
    ]
  },
  {
    id: 'cerenia',
    name: 'Cerenia',
    generic: 'Maropitant Citrate',
    h2: 'Cerenia Dosage for Cats',
    description: 'A powerful, highly effective neurokinin-1 (NK1) receptor antagonist used to treat acute vomiting and prevent motion sickness in felines.',
    category: 'Anti-nausea',
    frequency: 'Given once daily (every 24 hours).',
    duration: 'For acute vomiting, used daily for up to 5 consecutive days. For motion sickness prevention, give 2 hours before travel.',
    byWeightText: 'Clinical dosage is 0.45 mg per pound of body weight (1 mg/kg) administered once daily.',
    safetyNotes: 'Ensure your cat remains hydrated. Cerenia should not be used in cats with suspected gastrointestinal obstructions or severe liver failure. Safe for kittens 16 weeks of age or older.',
    warningColor: 'blue',
    dosePerLbMin: 0.45,
    dosePerLbMax: 0.45,
    dosePerKgMin: 1.0,
    dosePerKgMax: 1.0,
    formulations: [
      { type: 'Tablet', strength: '16 mg', factor: 16, unit: 'tablet' },
      { type: 'Tablet', strength: '24 mg', factor: 24, unit: 'tablet' },
      { type: 'Liquid', strength: '10 mg / mL (Injectable used orally)', factor: 10, unit: 'mL' }
    ]
  },
  {
    id: 'prednisolone',
    name: 'Prednisolone',
    generic: 'Prednisolone',
    h2: 'Prednisolone Dosage for Cats',
    description: 'An oral synthetic corticosteroid used to manage inflammation, severe immune-mediated disorders, asthma, and feline inflammatory bowel disease (IBD).',
    category: 'Steroid',
    frequency: 'Typically administered every 12 to 24 hours, often tapered down over time.',
    duration: 'Short-term for acute allergies (3 to 7 days) or chronic long-term management with step-down tapering schedules.',
    byWeightText: 'Anti-inflammatory dosing starts at 0.25 to 0.5 mg per pound (0.5 to 1.1 mg/kg) daily. Immunosuppressive dosing is significantly higher, ranging from 1 to 2 mg per pound (2.2 to 4.4 mg/kg) daily.',
    safetyNotes: 'CRITICAL DIFFERENCE: Felines do not convert prednisone into prednisolone efficiently in their livers. Therefore, Prednisolone MUST be used instead of Prednisone in cats. Can cause increased thirst, frequent urination, and elevated appetite. Monitor closely for signs of secondary infections.',
    warningColor: 'yellow',
    subDoses: [
      {
        name: 'Anti-inflammatory Dosage',
        description: 'Standard range used to control chronic asthma, skin allergies, or gut inflammation.',
        dosePerLb: 0.35,
        dosePerKg: 0.77,
        freq: 'Every 12 to 24 hours',
        dur: 'Varies; frequently tapered gradually.'
      },
      {
        name: 'Immunosuppressive Dosage',
        description: 'Aggressive dosing for auto-immune crises or certain oncological conditions.',
        dosePerLb: 1.5,
        dosePerKg: 3.3,
        freq: 'Every 12 hours',
        dur: 'Strictly monitored by a veterinarian.'
      }
    ],
    formulations: [
      { type: 'Tablet', strength: '5 mg', factor: 5, unit: 'tablet' },
      { type: 'Tablet', strength: '20 mg', factor: 20, unit: 'tablet' },
      { type: 'Liquid', strength: '15 mg / 5 mL (3 mg/mL)', factor: 3, unit: 'mL' }
    ]
  },
  {
    id: 'doxycycline',
    name: 'Doxycycline',
    generic: 'Doxycycline Monohydrate / Hyclate',
    h2: 'Doxycycline Dosage for Cats',
    description: 'A tetracycline antibiotic crucial for treating respiratory tract infections, chlamydia, mycoplasma, and tick-borne intracellular organisms in cats.',
    category: 'Antibiotic',
    frequency: 'Administered once daily (every 24 hours) or split every 12 hours.',
    duration: 'Typically given for 10 to 21 days depending on the underlying bacterial organism.',
    byWeightText: 'Standard feline dosage is 2.2 to 4.5 mg per pound of body weight (5 to 10 mg/kg) daily.',
    safetyNotes: 'CRITICAL ESOPHAGEAL WARNING: Dry doxycycline tablets or capsules can become trapped in a cat’s esophagus, causing severe chemical burns, ulceration, and permanent strictures. Liquid formulations are highly preferred. If tablets must be used, they must be followed immediately by at least 5-10 mL of water or a small amount of food.',
    warningColor: 'red',
    dosePerLbMin: 2.2,
    dosePerLbMax: 4.5,
    dosePerKgMin: 5.0,
    dosePerKgMax: 10.0,
    formulations: [
      { type: 'Liquid', strength: '10 mg / mL (Highly Recommended)', factor: 10, unit: 'mL' },
      { type: 'Tablet', strength: '100 mg (Must follow with water)', factor: 100, unit: 'tablet' },
      { type: 'Capsule', strength: '50 mg (Must follow with water)', factor: 50, unit: 'capsule' }
    ]
  },
  {
    id: 'benadryl',
    name: 'Benadryl',
    generic: 'Diphenhydramine',
    h2: 'Benadryl Dosage for Cats',
    description: 'An over-the-counter antihistamine used as a supportive therapy for acute environmental allergic flares, vaccine reactions, and insect stings in felines.',
    category: 'Antihistamine',
    frequency: 'Given every 8 to 12 hours as needed.',
    duration: 'Used temporarily for acute allergy flare-ups or insect stings.',
    byWeightText: 'Recommended dosing is exactly 1 mg per pound of body weight (2.2 mg/kg) administered up to three times daily.',
    safetyNotes: 'CRITICAL: Many OTC liquid Benadryl products contain toxic levels of alcohol or artificial sweeteners (like xylitol). Only administer dye-free, alcohol-free formulations (such as children’s liquid) or compounded veterinary liquids. May cause significant drowsiness, or conversely, paradoxical hyper-excitability in some felines.',
    warningColor: 'yellow',
    dosePerLbMin: 1.0,
    dosePerLbMax: 1.0,
    dosePerKgMin: 2.2,
    dosePerKgMax: 2.2,
    formulations: [
      { type: 'Tablet', strength: '12.5 mg (Childrens)', factor: 12.5, unit: 'tablet' },
      { type: 'Tablet', strength: '25 mg', factor: 25, unit: 'tablet' },
      { type: 'Liquid', strength: '12.5 mg / 5 mL (2.5 mg/mL)', factor: 2.5, unit: 'mL' }
    ]
  },
  {
    id: 'onsior',
    name: 'Onsior',
    generic: 'Robenacoxib',
    h2: 'Onsior Dosage for Cats',
    description: 'A modern, highly targeted, tissue-selective non-steroidal anti-inflammatory drug (NSAID) specifically FDA-approved for the control of post-operative pain and inflammation associated with orthopedic and soft tissue surgeries in cats.',
    category: 'Pain & Inflammation (NSAID)',
    frequency: 'Administered once daily (every 24 hours) at the exact same time.',
    duration: 'Strictly limited to a maximum duration of 3 consecutive days.',
    byWeightText: 'Standard clinical dosage is 0.45 mg per pound of body weight (1 mg/kg) once daily.',
    safetyNotes: 'CRITICAL SAFETY: Felines are highly sensitive to NSAID-induced toxicities. Never exceed 3 days of treatment. Never give concurrently with any other NSAIDs (such as Meloxicam or Aspirin) or systemic steroids. Ensure the cat has free access to fresh drinking water and is eating well before administration.',
    warningColor: 'red',
    dosePerLbMin: 0.45,
    dosePerLbMax: 0.45,
    dosePerKgMin: 1.0,
    dosePerKgMax: 1.0,
    formulations: [
      { type: 'Tablet', strength: '6 mg (Yeast-Flavored)', factor: 6, unit: 'tablet' }
    ]
  },
  {
    id: 'baytril',
    name: 'Baytril (Enrofloxacin)',
    generic: 'Enrofloxacin',
    h2: 'Baytril Dosage for Cats',
    description: 'A highly potent fluoroquinolone antibiotic reserved for severe, resistant bacterial infections such as deep dermal wounds, osteomyelitis, or complex urinary tract infections.',
    category: 'Antibiotic',
    frequency: 'Given once daily (every 24 hours).',
    duration: 'Typically given for 5 to 10 days; complete the entire course as prescribed.',
    byWeightText: 'Feline-safe dosage is strictly capped at 2.27 mg per pound of body weight (5 mg/kg) once daily.',
    safetyNotes: 'CRITICAL RETINAL TOXICITY WARNING: High doses of enrofloxacin (Baytril) in cats can cause irreversible retinal degeneration resulting in complete, sudden blindness. The daily dosage MUST NEVER exceed 5 mg/kg (2.27 mg/lb) under any circumstances. If pupillary dilation or vision changes occur, stop medication and consult your vet immediately.',
    warningColor: 'red',
    dosePerLbMin: 2.27,
    dosePerLbMax: 2.27,
    dosePerKgMin: 5.0,
    dosePerKgMax: 5.0,
    formulations: [
      { type: 'Tablet', strength: '22.7 mg (Taste-Masked)', factor: 22.7, unit: 'tablet' },
      { type: 'Tablet', strength: '68 mg', factor: 68, unit: 'tablet' },
      { type: 'Liquid', strength: '22.7 mg / mL', factor: 22.7, unit: 'mL' }
    ]
  },
  {
    id: 'metronidazole',
    name: 'Metronidazole',
    generic: 'Metronidazole',
    h2: 'Metronidazole Dosage for Cats',
    description: 'An antibiotic and antiprotozoal medication frequently prescribed to treat anaerobic bacterial infections and protozoal parasitic diarrhea (e.g., Giardia) in cats.',
    category: 'Gastrointestinal',
    frequency: 'Administered every 12 to 24 hours.',
    duration: 'Standard gastrointestinal course runs for 5 to 8 consecutive days.',
    byWeightText: 'Typical clinical dosage ranges from 4.5 to 11.3 mg per pound of body weight (10 to 25 mg/kg) daily.',
    safetyNotes: 'CRITICAL TASTE & NEUROLOGICAL WARNING: Metronidazole is extremely bitter; if a tablet is crushed or chewed, it causes immediate intense salivation, foaming at the mouth, and severe food aversion. Liquid suspensions are often custom-flavored. High dosages or long courses can trigger temporary, dangerous neurological toxicity (head tilt, rapid eye movements, tremors, rigidity, or seizures).',
    warningColor: 'red',
    dosePerLbMin: 4.5,
    dosePerLbMax: 11.3,
    dosePerKgMin: 10.0,
    dosePerKgMax: 25.0,
    formulations: [
      { type: 'Tablet', strength: '100 mg (Compounded)', factor: 100, unit: 'tablet' },
      { type: 'Liquid', strength: '50 mg / mL (Compounded Benzoate)', factor: 50, unit: 'mL' },
      { type: 'Capsule', strength: '25 mg (Compounded)', factor: 25, unit: 'capsule' }
    ]
  },
  {
    id: 'zyrtec',
    name: 'Zyrtec',
    generic: 'Cetirizine',
    h2: 'Zyrtec Dosage for Cats',
    description: 'A second-generation non-drowsy antihistamine commonly utilized to manage environmental allergies, feline herpesvirus-related sneezing, asthma, and severe allergic skin itching.',
    category: 'Antihistamine',
    frequency: 'Given once daily (every 24 hours).',
    duration: 'Can be given daily long-term during seasonal allergy flares or chronic asthma management.',
    byWeightText: 'Standard clinical dosage is typically 2.5 mg to 5 mg per cat daily, which translates to a safety factor of approximately 0.25 to 0.5 mg per pound (0.5 to 1.1 mg/kg).',
    safetyNotes: 'Ensure the product is generic Cetirizine ONLY. Never use Zyrtec-D products, which contain decongestants (such as pseudoephedrine) that are rapidly fatal to felines. Usually well-tolerated, but can cause mild sedation or transient salivation if a tablet is crushed.',
    warningColor: 'yellow',
    dosePerLbMin: 0.25,
    dosePerLbMax: 0.5,
    dosePerKgMin: 0.5,
    dosePerKgMax: 1.1,
    formulations: [
      { type: 'Tablet', strength: '5 mg (Half of a 10mg)', factor: 5, unit: 'tablet' },
      { type: 'Tablet', strength: '10 mg', factor: 10, unit: 'tablet' },
      { type: 'Liquid', strength: '1 mg / mL (Childrens Alcohol-Free)', factor: 1, unit: 'mL' }
    ]
  },
  {
    id: 'famotidine',
    name: 'Famotidine',
    generic: 'Famotidine',
    h2: 'Famotidine Dosage for Cats',
    description: 'An H2 receptor antagonist (antacid) used to reduce gastric acid production, treat feline uremic gastritis from chronic kidney disease, and manage reflux or esophageal inflammation.',
    category: 'Gastrointestinal',
    frequency: 'Given once daily or split every 12 hours.',
    duration: 'Varies; can be given for 5 to 7 days during acute stomach upset, or long-term for cats with chronic renal disease.',
    byWeightText: 'Clinical dosage is 0.23 to 0.45 mg per pound of body weight (0.5 to 1.0 mg/kg) daily.',
    safetyNotes: 'Ensure the product contains ONLY famotidine. Avoid multi-ingredient OTC stomach relievers. Use with caution in cats with moderate-to-severe kidney or liver disease, where the dose may need to be reduced.',
    warningColor: 'blue',
    dosePerLbMin: 0.23,
    dosePerLbMax: 0.45,
    dosePerKgMin: 0.5,
    dosePerKgMax: 1.0,
    formulations: [
      { type: 'Tablet', strength: '10 mg (Standard Pepcid AC)', factor: 10, unit: 'tablet' },
      { type: 'Tablet', strength: '5 mg (Compounded)', factor: 5, unit: 'tablet' },
      { type: 'Liquid', strength: '10 mg / mL (Compounded)', factor: 10, unit: 'mL' }
    ]
  },
  {
    id: 'fenbendazole',
    name: 'Fenbendazole (Panacur)',
    generic: 'Fenbendazole',
    h2: 'Fenbendazole Dosage for Cats',
    description: 'A broad-spectrum anthelmintic (parasiticide) highly effective at eliminating roundworms, hookworms, whipworms, and tapeworms, as well as managing Giardia infections in felines.',
    category: 'Parasiticide',
    frequency: 'Given once daily (every 24 hours).',
    duration: 'Administered for 3 consecutive days for intestinal worms, or 5 consecutive days for Giardia.',
    byWeightText: 'Standard clinical dose is exactly 22.7 mg per pound of body weight (50 mg/kg) once daily.',
    safetyNotes: 'Highly safe medication; side effects are extremely rare but can include mild loose stools or vomiting. It is crucial to administer the drug for the exact number of days prescribed to ensure a complete parasite kill cycle.',
    warningColor: 'blue',
    dosePerLbMin: 22.7,
    dosePerLbMax: 22.7,
    dosePerKgMin: 50.0,
    dosePerKgMax: 50.0,
    formulations: [
      { type: 'Liquid', strength: '100 mg / mL (10% Suspension)', factor: 100, unit: 'mL' },
      { type: 'Tablet', strength: '222 mg (Compounded)', factor: 222, unit: 'tablet' }
    ]
  },
  {
    id: 'cephalexin',
    name: 'Cephalexin',
    generic: 'Cephalexin',
    h2: 'Cephalexin Dosage for Cats',
    description: 'A first-generation cephalosporin antibiotic used primarily to treat deep bacterial skin infections (pyoderma), soft tissue infections, and secondary urinary tract infections.',
    category: 'Antibiotic',
    frequency: 'Given every 8 to 12 hours.',
    duration: 'Typically given for 7 to 14 days; should be continued for at least 7 days past clinical resolution of symptoms.',
    byWeightText: 'Recommended dosing is 10 to 15 mg per pound of body weight (22 to 33 mg/kg) every 8 to 12 hours.',
    safetyNotes: 'Do not use in cats with known hypersensitivity to penicillins or cephalosporins. Commonly causes mild vomiting, diarrhea, or temporary loss of appetite. Administration with food is highly recommended.',
    warningColor: 'yellow',
    dosePerLbMin: 10.0,
    dosePerLbMax: 15.0,
    dosePerKgMin: 22.0,
    dosePerKgMax: 33.0,
    formulations: [
      { type: 'Capsule', strength: '250 mg', factor: 250, unit: 'capsule' },
      { type: 'Liquid', strength: '50 mg / mL (Veterinary Suspension)', factor: 50, unit: 'mL' },
      { type: 'Tablet', strength: '100 mg (Compounded)', factor: 100, unit: 'tablet' }
    ]
  },
  {
    id: 'dramamine',
    name: 'Dramamine',
    generic: 'Dimenhydrinate',
    h2: 'Dramamine Dosage for Cats',
    description: 'An antihistamine used in veterinary medicine primarily to prevent motion sickness during travel and manage nausea or vestibular head tilt symptoms in felines.',
    category: 'Anti-nausea',
    frequency: 'Given once daily or split every 8 to 12 hours.',
    duration: 'Used temporarily on travel days; administer 30 to 60 minutes before scheduled departure.',
    byWeightText: 'Standard clinical starting dose is approximately 2.3 mg per pound of body weight (5 mg/kg) up to three times daily.',
    safetyNotes: 'Highly likely to cause mild to moderate drowsiness and lethargy. Ensure the product contains dimenhydrinate only. Never use combination cold or flu remedies.',
    warningColor: 'yellow',
    dosePerLbMin: 2.3,
    dosePerLbMax: 2.3,
    dosePerKgMin: 5.0,
    dosePerKgMax: 5.0,
    formulations: [
      { type: 'Tablet', strength: '50 mg (Standard)', factor: 50, unit: 'tablet' },
      { type: 'Liquid', strength: '12.5 mg / 4 mL (3.12 mg/mL Compounded)', factor: 3.12, unit: 'mL' }
    ]
  },
  {
    id: 'capstar',
    name: 'Capstar',
    generic: 'Nitenpyram',
    h2: 'Capstar Dosage for Cats',
    description: 'A rapid-acting, highly safe oral flea parasiticide that begins killing adult fleas on the cat’s body within 30 minutes of administration.',
    category: 'Parasiticide',
    frequency: 'Given once daily as needed if re-infestation occurs.',
    duration: 'Can be given on consecutive days or situationally as a single immediate-release treatment.',
    byWeightText: 'Dosed as a single 11.4 mg tablet for all cats weighing between 2 and 25 pounds (weight independent above the 2 lb threshold).',
    safetyNotes: 'Extremely high margin of safety. Safe for kittens over 4 weeks of age and weighing at least 2.0 lbs (0.9 kg). Felines may exhibit temporary intense scratching or twitching shortly after ingestion as fleas begin to die off rapidly.',
    warningColor: 'blue',
    isWeightIndependent: true,
    dosePerLbMin: 11.4,
    dosePerLbMax: 11.4,
    dosePerKgMin: 11.4,
    dosePerKgMax: 11.4,
    formulations: [
      { type: 'Tablet', strength: '11.4 mg', factor: 11.4, unit: 'tablet' }
    ]
  },
  {
    id: 'meloxicam',
    name: 'Meloxicam',
    generic: 'Meloxicam (Metacam / Loxicom)',
    h2: 'Meloxicam Dosage for Cats',
    description: 'A prescription non-steroidal anti-inflammatory drug (NSAID) used in cats for the management of acute pain and inflammation associated with musculoskeletal disorders, osteoarthritis, or surgery. Commonly known under the brand names Metacam or Loxicom, and available as an oral suspension or syrup.',
    category: 'Pain & Inflammation (NSAID)',
    frequency: 'Given once daily (every 24 hours) with food. It is crucial to administer it with a meal to reduce gastrointestinal irritation.',
    duration: 'Typically given as a single-day or short-term 3-to-5-day treatment for acute musculoskeletal pain, or long-term under strict veterinary monitoring for chronic feline osteoarthritis (common in Europe/UK, with black box warnings in the US).',
    byWeightText: 'Standard feline dosage is a loading dose of 0.045 mg per pound (0.1 mg/kg) on Day 1, followed by a maintenance dose of 0.023 mg per pound (0.05 mg/kg) once daily or every 48 hours.',
    safetyNotes: 'CRITICAL SIDE EFFECTS & SAFETY: Felines have a reduced capacity to metabolize NSAIDs due to a deficiency in glucuronyl transferase. Overdosing or prolonged usage can cause acute kidney injury, stomach ulceration, and gastrointestinal bleeding. Common side effects include vomiting, diarrhea, loss of appetite, lethargy, and dark tarry stools. NEVER administer meloxicam to a dehydrated cat, and NEVER combine with other NSAIDs (such as Onsior) or steroids (such as Prednisolone).',
    warningColor: 'red',
    subDoses: [
      {
        name: 'Day 1 Loading Dose (Acute Pain)',
        description: 'Initial dose to rapidly control acute inflammation and pain.',
        dosePerLb: 0.045,
        dosePerKg: 0.1,
        freq: 'Once on Day 1 only',
        dur: '1 day only'
      },
      {
        name: 'Day 2+ Maintenance Dose',
        description: 'Lower dose for ongoing pain management to minimize renal strain.',
        dosePerLb: 0.023,
        dosePerKg: 0.05,
        freq: 'Once daily (every 24 hours) or every 48 hours',
        dur: 'Under strict veterinary prescription'
      }
    ],
    formulations: [
      { type: 'Liquid', strength: '0.5 mg / mL (Metacam for Cats)', factor: 0.5, unit: 'mL' }
    ]
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    generic: 'Amoxicillin Trihydrate (Amoxil)',
    h2: 'Amoxicillin Dosage for Cats',
    description: 'An effective, broad-spectrum penicillin-class antibiotic widely prescribed for felines to treat bacterial infections of the respiratory tract, bladder, wounds, and soft tissues. Often referred directly as amoxicillin dosage for cats or dosage for cats amoxicillin.',
    category: 'Antibiotic',
    frequency: 'Administered once or twice daily (every 12 to 24 hours) as prescribed by your vet.',
    duration: 'Usually prescribed for 7 to 10 consecutive days; ensure the full treatment course is completed to prevent bacterial resistance.',
    byWeightText: 'The standard clinical amoxicillin dosage for cats is 5 to 10 mg per pound of body weight (11 to 22 mg/kg) given every 12 hours.',
    safetyNotes: 'Give amoxicillin with a small meal to reduce the chance of vomiting, diarrhea, or decreased appetite. Monitor for allergic reactions such as hives, facial swelling, or breathing difficulties. Never give human-marketed amoxicillin due to potential inactive ingredients or incorrect concentrations. Also referenced as dosage of amoxicillin for cats.',
    warningColor: 'blue',
    dosePerLbMin: 5.0,
    dosePerLbMax: 10.0,
    dosePerKgMin: 11.0,
    dosePerKgMax: 22.0,
    formulations: [
      { type: 'Liquid', strength: '50 mg / mL (Oral Suspension)', factor: 50, unit: 'mL' },
      { type: 'Tablet', strength: '50 mg', factor: 50, unit: 'tablet' },
      { type: 'Tablet', strength: '100 mg', factor: 100, unit: 'tablet' }
    ]
  },
  {
    id: 'pyrantel',
    name: 'Pyrantel Pamoate (Strongid / Nematocide)',
    generic: 'Pyrantel Pamoate (Nematocide)',
    h2: 'Pyrantel Pamoate Dosage for Cats',
    description: 'A highly safe, over-the-counter anthelmintic (dewormer) used to treat and control intestinal roundworms and hookworms in kittens and adult cats. Also known as Nematocide or Strongid, with precise pyrantel dosage for cats in ml depending on formulation strength. It is a reliable choice for nematocide dosage for cats.',
    category: 'Parasiticide',
    frequency: 'Typically administered as a single dose, then repeated in 2 to 4 weeks to kill newly hatched parasites.',
    duration: 'Give as a single dose per treatment cycle, or as directed by a vet for active infestations.',
    byWeightText: 'The standard clinical pyrantel dosage for cats is 2.27 to 4.54 mg per pound of body weight (5 to 10 mg/kg). For Nematocide or Strongid-T (50 mg/mL), this translates to approximately 0.045 to 0.09 mL per pound of body weight.',
    safetyNotes: 'Pyrantel has an extremely high safety margin. Side effects are very rare, but may include mild vomiting or transient loose stools if the cat has a heavy worm load. Safe for use in pregnant or lactating cats and kittens from 2 weeks of age. Always verify the strength of the liquid to calculate the exact pyrantel dosage for cats in ml. Also searched as dosage of pyrantel pamoate for cats.',
    warningColor: 'blue',
    dosePerLbMin: 2.27,
    dosePerLbMax: 4.54,
    dosePerKgMin: 5.0,
    dosePerKgMax: 10.0,
    formulations: [
      { type: 'Liquid', strength: '50 mg / mL (Strongid-T / Nematocide)', factor: 50, unit: 'mL' },
      { type: 'Liquid', strength: '4.54 mg / mL (OTC Cat Dewormer)', factor: 4.54, unit: 'mL' }
    ]
  },
  {
    id: 'ivermectin',
    name: 'Ivermectin',
    generic: 'Ivermectin (Ivomec / Heartgard)',
    h2: 'Ivermectin Dosage for Cats',
    description: 'A potent parasiticide used in felines for the prevention of heartworm disease (at low doses) and treatment of ear mites, scabies, mange, or other external/internal parasites (at higher off-label therapeutic doses). Often searched as ivermectin dosage for cats or dosage of ivermectin for cats.',
    category: 'Parasiticide',
    frequency: 'Administered once monthly for heartworm prevention, or once to twice weekly for active mite/mange infestations under strict veterinary supervision.',
    duration: 'Used monthly year-round for preventative care, or short-term (2-4 weeks) for active external parasitic treatment.',
    byWeightText: 'For monthly heartworm prevention, the clinical ivermectin for cats dose per kg is 24 mcg/kg (approx 10.9 mcg/lb). For therapeutic treatment of earmites or mange, the clinical dosage ranges from 200 to 400 mcg/kg (0.2 to 0.4 mg/kg), which is equivalent to 0.09 to 0.18 mg per pound of body weight.',
    safetyNotes: 'CRITICAL SAFETY: High doses of ivermectin can cause severe neurotoxicity in felines. Symptoms of toxicity include dilated pupils, depression, uncoordinated gait (ataxia), tremors, blindness, drooling, and coma. Never use cattle or horse strength formulations. Ensure exact weight-based measurements and always consult your vet before administrating any therapeutic ivermectin dosage for cats.',
    warningColor: 'red',
    subDoses: [
      {
        name: 'Monthly Heartworm Prevention (Low Dose)',
        description: 'Extremely low, safe preventative dose to kill heartworm larvae.',
        dosePerLb: 0.0109,
        dosePerKg: 0.024,
        freq: 'Once monthly (every 30 days)',
        dur: 'Monthly year-round'
      },
      {
        name: 'Active Parasite Treatment (High Dose)',
        description: 'Therapeutic dose for ear mites, scabies, and mange. Must be supervised by a vet.',
        dosePerLb: 0.136,
        dosePerKg: 0.3,
        freq: 'Once daily or weekly as directed by vet',
        dur: 'As prescribed'
      }
    ],
    formulations: [
      { type: 'Liquid', strength: '10 mg / mL (1% solution - highly diluted for use)', factor: 10, unit: 'mL' },
      { type: 'Chewable', strength: '55 mcg (Heartgard for Cats)', factor: 0.055, unit: 'chewable' }
    ]
  },
  {
    id: 'selamectin',
    name: 'Selamectin (Stronghold / Revolution)',
    generic: 'Selamectin',
    h2: 'Selamectin Dosage and Pipette Guide for Cats',
    description: 'A highly effective broad-spectrum spot-on (topical pipette) treatment for cats. It prevents and treats flea infestations, ear mites, heartworms, hookworms, and roundworms. Commonly searched as pipette flea treatment for cats, Stronghold for cats, or selamectin pipette dosage.',
    category: 'Parasiticide',
    frequency: 'Applied topically once every 30 days (monthly).',
    duration: 'Used monthly year-round or as prescribed for active ear mite infestations.',
    byWeightText: 'Standard clinical dose is 2.7 mg per pound of body weight (6 mg/kg) applied topically behind the neck.',
    safetyNotes: 'For external topical use only. Do not apply to wet hair or broken skin. Ensure the cat cannot lick the application site until dry. Common mild temporary reactions include localized hair loss or scaling at the application spot.',
    warningColor: 'blue',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    dosePerLbMin: 2.7,
    dosePerLbMax: 2.7,
    dosePerKgMin: 6.0,
    dosePerKgMax: 6.0,
    formulations: [
      { type: 'Spot-On', strength: '15 mg (Pink Pipette for Kittens)', factor: 15, unit: 'pipette' },
      { type: 'Spot-On', strength: '45 mg (Blue Pipette for Cats)', factor: 45, unit: 'pipette' }
    ]
  },
  {
    id: 'milbemycin_praziquantel',
    name: 'Milbemycin + Praziquantel (Milbemax / Alpramil)',
    generic: 'Milbemycin Oxime / Praziquantel',
    h2: 'Milbemycin and Praziquantel Dewormer Dosage for Cats',
    description: 'A premium broad-spectrum oral dewormer used to prevent heartworm and treat tapeworms, roundworms, hookworms, and whipworms in felines. Highly researched as Milbemax for cats or milbemycin praziquantel dewormer dosage for kittens.',
    category: 'Parasiticide',
    frequency: 'Administered as a single oral dose; repeat in 2 to 4 weeks if severe parasite infestation is present.',
    duration: 'Given as a single preventative treatment every 3 months, or as directed by your veterinarian for active worm loads.',
    byWeightText: 'Recommended minimum dosing targets: 0.9 mg/lb (2 mg/kg) of Milbemycin Oxime and 2.27 mg/lb (5 mg/kg) of Praziquantel.',
    safetyNotes: 'Extremely safe when dosed accurately. Do not administer to kittens under 6 weeks of age or weighing less than 1.1 lbs (0.5 kg). Safe for breeding, pregnant, and lactating queens.',
    warningColor: 'blue',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    dosePerLbMin: 0.9,
    dosePerLbMax: 0.9,
    dosePerKgMin: 2.0,
    dosePerKgMax: 2.0,
    formulations: [
      { type: 'Tablet', strength: '4 mg Milbemycin / 10 mg Praziquantel (Kitten)', factor: 4, unit: 'tablet' },
      { type: 'Tablet', strength: '16 mg Milbemycin / 40 mg Praziquantel (Adult Cat)', factor: 16, unit: 'tablet' }
    ]
  },
  {
    id: 'buprenorphine',
    name: 'Buprenorphine (Buprenex / Simbadol)',
    generic: 'Buprenorphine Hydrochloride',
    h2: 'Buprenorphine Opioid Pain Relief Dosage for Cats',
    description: 'A powerful injectable or transmucosal opioid analgesic used to treat moderate to severe post-operative or acute pain in cats. Widely researched as buprenorphine for cats, Simbadol dosage, or opioid pain relief in felines.',
    category: 'Pain & Inflammation (Other)',
    frequency: 'Usually given every 8 to 12 hours transmucosally (absorbed by the gums/cheeks), or once daily as a long-acting injection (Simbadol).',
    duration: 'Typically limited to 3 to 5 days post-surgery, or as prescribed for acute injuries.',
    byWeightText: 'Standard oral transmucosal (OTM) dose is 0.0045 to 0.009 mg per pound (0.01 to 0.02 mg/kg). Note: 10 mcg is equal to 0.01 mg.',
    safetyNotes: 'Class III controlled substance. Can cause mild sedation, dilated pupils (mydriasis), purring, or euphoria. Monitor respiratory rates. Oral transmucosal absorption is highly effective in cats because of their basic salivary pH; do not squirt into the throat to be swallowed.',
    warningColor: 'red',
    prescriptionRequired: true,
    supervisionLevel: 'Strict Clinical Only',
    dosePerLbMin: 0.0045,
    dosePerLbMax: 0.009,
    dosePerKgMin: 0.01,
    dosePerKgMax: 0.02,
    formulations: [
      { type: 'Liquid', strength: '0.3 mg / mL (Buprenex Liquid)', factor: 0.3, unit: 'mL' }
    ]
  },
  {
    id: 'butorphanol',
    name: 'Butorphanol (Torbugesic)',
    generic: 'Butorphanol Tartrate',
    h2: 'Butorphanol Dosage and Sedation for Cats',
    description: 'An opioid agonist-antagonist used as an analgesic, mild sedative, and cough suppressant (antitussive). It is frequently used in clinical pre-anesthetic protocols or short-term analgesia for felines. Often searched as Torbugesic for cats or butorphanol dosage in mL.',
    category: 'Pain & Inflammation (Other)',
    frequency: 'Administered every 4 to 6 hours due to its relatively short analgesic duration.',
    duration: 'Short-term use only (typically under 24 to 48 hours in hospitalized patients or situational pain control).',
    byWeightText: 'Standard oral or injectable dose is 0.045 to 0.09 mg per pound of body weight (0.1 to 0.2 mg/kg).',
    safetyNotes: 'May cause mild sedation, loss of coordination, or transient drop in body temperature. Always monitor respiratory rate. Avoid use in cats with liver, kidney, or heart failure unless carefully titrated.',
    warningColor: 'red',
    prescriptionRequired: true,
    supervisionLevel: 'Strict Clinical Only',
    dosePerLbMin: 0.045,
    dosePerLbMax: 0.09,
    dosePerKgMin: 0.1,
    dosePerKgMax: 0.2,
    formulations: [
      { type: 'Liquid', strength: '2 mg / mL (Veterinary Torbugesic Liquid)', factor: 2, unit: 'mL' },
      { type: 'Tablet', strength: '10 mg', factor: 10, unit: 'tablet' }
    ]
  },
  {
    id: 'alfaxalone',
    name: 'Alfaxalone (Alfaxan)',
    generic: 'Alfaxalone',
    h2: 'Alfaxalone (Alfaxan) Anesthetic Induction Dosage for Cats',
    description: 'An intravenous neuroactive steroid anesthetic used for the induction and maintenance of general anesthesia or deep procedural sedation. Highly researched as Alfaxan for cats, alfaxalone feline induction dosage, and clinical anesthesia guidelines.',
    category: 'Anesthetic & Sedative',
    frequency: 'Administered strictly as a single slow intravenous injection over 60 seconds by a veterinarian.',
    duration: 'Produces immediate surgical-grade anesthesia lasting approximately 10 to 15 minutes per single induction dose.',
    byWeightText: 'Standard intravenous induction dose in cats is 0.9 to 1.8 mg per pound of body weight (2.0 to 4.0 mg/kg) when used with pre-anesthetic sedatives.',
    safetyNotes: 'CRITICAL: For professional veterinary in-clinic use ONLY. Requires continuous oxygen supplementation, airway intubation readiness, and anesthetic monitoring. Can cause transient respiratory depression or apnea if injected too rapidly.',
    warningColor: 'red',
    prescriptionRequired: true,
    supervisionLevel: 'Strict Clinical Only',
    dosePerLbMin: 0.9,
    dosePerLbMax: 1.8,
    dosePerKgMin: 2.0,
    dosePerKgMax: 4.0,
    formulations: [
      { type: 'Liquid', strength: '10 mg / mL (Alfaxan Injectable)', factor: 10, unit: 'mL' }
    ]
  },
  {
    id: 'dexmedetomidine',
    name: 'Dexmedetomidine (Dexdomitor)',
    generic: 'Dexmedetomidine Hydrochloride',
    h2: 'Dexmedetomidine (Dexdomitor) Sedation & Reversal Guide for Cats',
    description: 'A highly potent alpha-2 adrenergic agonist used for profound procedural sedation, muscle relaxation, and pre-anesthetic analgesia. Its effects are fully reversible using Atipamezole (Antisedan). Commonly referenced as Dexdomitor for cats or sedation reversal in felines.',
    category: 'Anesthetic & Sedative',
    frequency: 'Administered as a single intramuscular (IM) or intravenous (IV) injection in a veterinary clinic.',
    duration: 'Sedation typically manifests within 10 to 15 minutes and lasts between 1 and 2 hours unless reversed earlier.',
    byWeightText: 'Clinical dosage is calculated using body surface area, but ranges between 18 and 36 mcg per pound (40 to 80 mcg/kg) depending on procedural requirements.',
    safetyNotes: 'CRITICAL: In-clinic professional use only. Causes temporary cardiorespiratory changes, including a marked decrease in heart rate (bradycardia), transient pale gums, and hypothermia. Always have Atipamezole (reversal agent) ready at a matching volumetric ratio.',
    warningColor: 'red',
    prescriptionRequired: true,
    supervisionLevel: 'Strict Clinical Only',
    dosePerLbMin: 0.018,
    dosePerLbMax: 0.036,
    dosePerKgMin: 0.04,
    dosePerKgMax: 0.08,
    formulations: [
      { type: 'Liquid', strength: '0.5 mg / mL (Dexdomitor 0.5)', factor: 0.5, unit: 'mL' }
    ]
  },
  {
    id: 'fluoxetine',
    name: 'Fluoxetine (Prozac / Reconcile)',
    generic: 'Fluoxetine Hydrochloride',
    h2: 'Fluoxetine Behavioral & Anxiety Dosage for Cats',
    description: 'An SSRI (selective serotonin reuptake inhibitor) prescribed to treat chronic behavioral disorders in felines, such as urine spraying/marking, feline hyperesthesia syndrome, compulsive overgrooming, and severe inter-cat aggression. Commonly searched as Prozac for cats or fluoxetine feline dosage.',
    category: 'Behavioral',
    frequency: 'Administered once daily (every 24 hours) at the exact same time.',
    duration: 'Requires at least 4 to 8 weeks of daily therapy to reach full behavioral therapeutic efficacy; typically used long-term.',
    byWeightText: 'Standard daily clinical dosage is 0.22 to 0.45 mg per pound of body weight (0.5 to 1.0 mg/kg) once daily.',
    safetyNotes: 'Do not discontinue therapy abruptly as this can trigger severe withdrawal or rebound anxiety. Common initial side effects include mild lethargy or decreased appetite during the first 1-2 weeks. Never administer in combination with MAO inhibitors (like selegiline) due to serotonin syndrome risks.',
    warningColor: 'yellow',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    dosePerLbMin: 0.22,
    dosePerLbMax: 0.45,
    dosePerKgMin: 0.5,
    dosePerKgMax: 1.0,
    formulations: [
      { type: 'Tablet', strength: '10 mg (Often split or compounded)', factor: 10, unit: 'tablet' },
      { type: 'Liquid', strength: '4 mg / mL (Compounded Oral Syrup)', factor: 4, unit: 'mL' }
    ]
  },
  {
    id: 'sucralfate',
    name: 'Sucralfate (Carafate)',
    generic: 'Sucralfate',
    h2: 'Sucralfate Gastroprotection and Ulcer Dosage for Cats',
    description: 'A mucosal protectant used to treat and prevent oral, esophageal, gastric, and duodenal ulcers in felines. It acts as an "acid-resistant bandage" over raw ulcerated tissues. Commonly searched as sucralfate dosage for cats or gastroprotector in felines.',
    category: 'Gastrointestinal',
    frequency: 'Administered every 8 to 12 hours (two to three times daily).',
    duration: 'Given for 5 to 10 days, or until clinical symptoms of gastrointestinal ulceration (such as black tarry stools or vomiting blood) resolve.',
    byWeightText: 'Typically dosed at 113 to 227 mg per cat (not calculated strictly by body weight, but rather a flat target of approx. 1/4 to 1/2 of a standard 500 mg tablet crushed and dissolved in warm water).',
    safetyNotes: 'Must be given on an empty stomach, at least 1 hour before a meal or 2 hours after. Crucially, because it binds other chemicals, you must administer sucralfate at least 2 hours apart from any other oral medications (especially antibiotics). Can cause mild constipation in rare cases.',
    warningColor: 'blue',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    isWeightIndependent: true,
    formulations: [
      { type: 'Tablet', strength: '500 mg (Crushed/slurried in warm water)', factor: 500, unit: 'tablet' }
    ]
  },
  {
    id: 'insulin',
    name: 'Insulin (Lantus / Prozinc)',
    generic: 'Insulin Glargine / Protamine Zinc',
    h2: 'Insulin Guidelines and Diabetic Management for Cats',
    description: 'A high-alert hormone injection used to manage blood glucose levels in feline diabetes mellitus. Standard veterinary insulins include Prozinc (U-40) and Lantus Glargine (U-100). Highly searched as diabetic cat insulin dose, Prozinc syringe guide, or feline insulin.',
    category: 'Endocrine & Chronic Care',
    frequency: 'Administered subcutaneously (under the skin) strictly every 12 hours (twice daily) immediately after a complete meal.',
    duration: 'Chronic lifelong therapy, requiring regular blood glucose curves and veterinary titration.',
    byWeightText: 'Dosing is NOT based on a simple linear weight formula. Typical starting dose is a conservative 0.5 to 1.0 Unit per cat twice daily, then carefully adjusted based on glucose readings.',
    safetyNotes: 'CRITICAL SAFETY: High risk of hypoglycemia (severe low blood sugar). If your cat displays weakness, wobbly walking, glassy eyes, seizures, or coma, rub maple syrup/honey on their gums immediately and contact an emergency vet. Always use U-40 syringes for U-40 insulin, and U-100 syringes for U-100 insulin. Never mix syringe types.',
    warningColor: 'red',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    isWeightIndependent: true,
    formulations: [
      { type: 'Liquid', strength: '100 Units / mL (U-100 Lantus)', factor: 100, unit: 'mL' },
      { type: 'Liquid', strength: '40 Units / mL (U-40 Prozinc)', factor: 40, unit: 'mL' }
    ]
  },
  {
    id: 'amlodipine',
    name: 'Amlodipine (Norvasc)',
    generic: 'Amlodipine Besylate',
    h2: 'Amlodipine Dosage for High Blood Pressure in Cats',
    description: 'A calcium channel blocker used as a first-line therapy to treat systemic hypertension (high blood pressure) in felines, which is often secondary to chronic kidney disease or hyperthyroidism. Highly researched as amlodipine for cats or blood pressure medication.',
    category: 'Endocrine & Chronic Care',
    frequency: 'Administered once daily (every 24 hours).',
    duration: 'Long-term daily treatment. Blood pressure must be monitored regularly by your veterinarian.',
    byWeightText: 'Standard feline dosage is a flat dose of 0.625 mg to 1.25 mg per cat once daily, regardless of precise weight, though higher doses may be targeted under vet guidance for heavy cats.',
    safetyNotes: 'Overdoses can cause hypotension (abnormally low blood pressure), resulting in lethargy, fainting, or weakness. Sudden discontinuation can cause spike in blood pressure leading to acute blindness (due to retinal detachment) or stroke. Give with or without food.',
    warningColor: 'yellow',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    isWeightIndependent: true,
    formulations: [
      { type: 'Tablet', strength: '1.25 mg (Feline Compounded)', factor: 1.25, unit: 'tablet' },
      { type: 'Tablet', strength: '2.5 mg', factor: 2.5, unit: 'tablet' }
    ]
  },
  {
    id: 'cyclosporine',
    name: 'Atopica (Cyclosporine)',
    generic: 'Cyclosporine',
    h2: 'Atopica (Cyclosporine) Dosage and Atopic Dermatitis Guide for Cats',
    description: 'An immunosuppressive medication used to treat severe feline atopic dermatitis and other chronic inflammatory or immune-mediated conditions in cats. Commonly searched as Atopica for cats, cyclosporine feline dosage, or cat itchy skin treatment.',
    category: 'Endocrine & Chronic Care',
    frequency: 'Administered once daily (every 24 hours) initially, then tapered to every other day or twice weekly once symptoms are controlled.',
    duration: 'Typically used daily for 4 to 6 weeks, then reduced to the lowest effective frequency for long-term maintenance.',
    byWeightText: 'Standard initial clinical dose is 3.2 mg per pound of body weight (7.0 mg/kg) once daily.',
    safetyNotes: 'Should be given either 2 hours before or after feeding to maximize oral absorption, although giving with a tiny amount of food is acceptable if vomiting occurs. Common side effects include mild transient gastrointestinal upset (vomiting or diarrhea) which often resolves after the first few days. Wash hands after use. Avoid use in cats with a history of malignant tumors or active systemic fungal infections.',
    warningColor: 'yellow',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    dosePerLbMin: 3.2,
    dosePerLbMax: 3.2,
    dosePerKgMin: 7.0,
    dosePerKgMax: 7.0,
    formulations: [
      { type: 'Liquid', strength: '100 mg / mL (Atopica Oral Solution)', factor: 100, unit: 'mL' }
    ]
  },
  {
    id: 'cbd_oil',
    name: 'CBD Oil (Cannabidiol)',
    generic: 'Cannabidiol',
    h2: 'CBD Oil Dosage and Calculator for Cats',
    description: 'A popular herbal supplement derived from hemp plants used as an adjunctive treatment for osteoarthritis, chronic neuropathic pain, situational anxiety, and seizure support in cats. Commonly searched as CBD oil for cats, feline cannabidiol dosage calculator, or organic hemp oil drops.',
    category: 'Pain & Inflammation (Other)',
    frequency: 'Administered every 12 to 24 hours (once or twice daily) depending on clinical response.',
    duration: 'May be given long-term for chronic conditions or situationally for acute stressors like travel or fireworks.',
    byWeightText: 'Standard starting dose is 0.1 to 0.2 mg per pound of body weight (0.2 to 0.5 mg/kg) twice daily. Can be titrated up to 0.5 to 1.0 mg per pound (1.0 to 2.2 mg/kg) twice daily for severe cases.',
    safetyNotes: 'CRITICAL: Always use a pet-safe CBD oil that is completely free of THC and Xylitol. THC is toxic to cats and can cause neurological distress (ataxia, glassy eyes, hyperesthesia). Common side effects of CBD include mild lethargy, increased appetite, or temporary soft stools. Start at the lowest dose and increase gradually over 1-2 weeks.',
    warningColor: 'blue',
    prescriptionRequired: false,
    supervisionLevel: 'OTC',
    dosePerLbMin: 0.1,
    dosePerLbMax: 0.5,
    dosePerKgMin: 0.2,
    dosePerKgMax: 1.1,
    formulations: [
      { type: 'Liquid', strength: '10 mg / mL (Regular Strength)', factor: 10, unit: 'mL' },
      { type: 'Liquid', strength: '25 mg / mL (Extra Strength)', factor: 25, unit: 'mL' }
    ]
  }
];
