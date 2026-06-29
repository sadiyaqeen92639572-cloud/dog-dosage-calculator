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

export const medications: Medication[] = [
  {
    id: 'benadryl',
    name: 'Benadryl',
    generic: 'Diphenhydramine',
    h2: 'Benadryl Dosage for Dogs',
    description: 'A common over-the-counter antihistamine used to relieve symptoms of environmental allergies, insect bites or stings, and mild situational travel anxiety in dogs.',
    category: 'Antihistamine',
    frequency: 'Typically given every 8 to 12 hours (2 to 3 times per day) as needed.',
    duration: 'Can be given situationally for acute allergic reactions or daily during seasonal allergy flare-ups, under veterinary guidance.',
    byWeightText: 'Dosed at 1 mg of active diphenhydramine per pound of body weight (equivalent to 2.2 mg per kilogram).',
    safetyNotes: 'CRITICAL: Ensure the product contains ONLY diphenhydramine. Never use Benadryl products that contain Acetaminophen (Tylenol), Decongestants (like Phenylephrine or Pseudoephedrine), or Alcohol, which are highly toxic to dogs. Liquid Benadryl for children (12.5 mg/5 mL) is preferred over adult liquids because children’s versions are usually alcohol-free.',
    warningColor: 'yellow',
    dosePerLbMin: 1.0,
    dosePerLbMax: 1.0,
    dosePerKgMin: 2.2,
    dosePerKgMax: 2.2,
    formulations: [
      { type: 'Tablet', strength: '25 mg', factor: 25, unit: 'tablet' },
      { type: 'Tablet', strength: '50 mg', factor: 50, unit: 'tablet' },
      { type: 'Liquid', strength: '12.5 mg / 5 mL (2.5 mg/mL)', factor: 2.5, unit: 'mL' }
    ]
  },
  {
    id: 'trazodone',
    name: 'Trazodone',
    generic: 'Trazodone Hydrochloride',
    h2: 'Trazodone Dosage for Dogs',
    description: 'An oral medication used to manage behavioral disorders, situational anxiety (such as noise phobias from thunderstorms or fireworks), travel, veterinary visits, or to promote strict rest after surgery.',
    category: 'Anxiety & Sedation',
    frequency: 'Given once daily or every 8 to 12 hours as needed for situational anxiety.',
    duration: 'Can be used as a short-term single dose for veterinary visits or daily for 10 to 14 days during post-operative orthopaedic recovery.',
    byWeightText: 'Starting dose is typically 1 to 2 mg per pound of body weight (2.2 to 4.4 mg/kg). Under strict veterinary supervision, this can be safely escalated up to 5 mg per pound (11 mg/kg) daily.',
    safetyNotes: 'Common side effects include mild sleepiness, unsteady gait (ataxia), or lip-licking. Do not combine with other serotonergic medications (like SSRIs or MAOIs) without a vet’s assessment due to the risk of serotonin syndrome.',
    warningColor: 'blue',
    dosePerLbMin: 1.0,
    dosePerLbMax: 2.0,
    dosePerKgMin: 2.2,
    dosePerKgMax: 4.4,
    formulations: [
      { type: 'Tablet', strength: '50 mg', factor: 50, unit: 'tablet' },
      { type: 'Tablet', strength: '100 mg', factor: 100, unit: 'tablet' },
      { type: 'Tablet', strength: '150 mg', factor: 150, unit: 'tablet' },
      { type: 'Tablet', strength: '300 mg', factor: 300, unit: 'tablet' }
    ]
  },
  {
    id: 'gabapentin',
    name: 'Gabapentin',
    generic: 'Gabapentin',
    h2: 'Gabapentin Dosage for Dogs',
    description: 'An anticonvulsant and nerve pain reliever frequently prescribed to treat chronic osteoarthritic pain, neuropathic discomfort, and situational fear/anxiety, or to control epileptic seizures.',
    category: 'Pain & Inflammation (Other)',
    frequency: 'Given every 8 to 12 hours (2 to 3 times daily) for pain or anxiety, or strictly every 8 hours for seizure management.',
    duration: 'Often given long-term (months to years) for chronic arthritis, or short-term (5 to 10 days) to help manage post-operative pain.',
    byWeightText: 'For pain or anxiety, the starting dose is 2 to 5 mg per pound (4.4 to 11 mg/kg). For seizure control, a higher dose of 5 to 10 mg per pound (11 to 22 mg/kg) is standard.',
    safetyNotes: 'CRITICAL: Many human liquid formulations of gabapentin contain Xylitol as a sweetener, which causes acute liver failure and hypoglycemia in dogs. Only use veterinary-approved or custom-compounded xylitol-free liquid. May cause temporary lethargy or coordination loss (drunken walk) which resolves with a dosage adjustment.',
    warningColor: 'yellow',
    subDoses: [
      {
        name: 'Pain & Anxiety management',
        description: 'Standard starting range for nerve discomfort, osteoarthritis, or vet visits.',
        dosePerLb: 3.5,
        dosePerKg: 7.7,
        freq: 'Every 8 to 12 hours',
        dur: 'Varies; can be chronic or short-term.'
      },
      {
        name: 'Seizure control',
        description: 'Higher therapeutic dose required to suppress epileptic electrical activity.',
        dosePerLb: 7.5,
        dosePerKg: 16.5,
        freq: 'Every 8 hours strictly',
        dur: 'Typically a lifelong daily prescription.'
      }
    ],
    formulations: [
      { type: 'Capsule', strength: '100 mg', factor: 100, unit: 'capsule' },
      { type: 'Capsule', strength: '300 mg', factor: 300, unit: 'capsule' },
      { type: 'Capsule', strength: '400 mg', factor: 400, unit: 'capsule' },
      { type: 'Liquid', strength: '50 mg / mL (Xylitol-free)', factor: 50, unit: 'mL' }
    ]
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    generic: 'Amoxicillin Trihydrate',
    h2: 'Amoxicillin Dosage for Dogs',
    description: 'A broad-spectrum penicillin-class antibiotic used to treat bacterial infections of the skin, respiratory tract, urinary tract, or soft tissues in dogs.',
    category: 'Antibiotic',
    frequency: 'Administered every 12 hours (twice daily).',
    duration: 'Must be given for a minimum of 7 to 14 days. Always complete the entire prescribed course even if your dog seems fully recovered.',
    byWeightText: 'Standard oral dose is 5 to 10 mg per pound of body weight (11 to 22 mg/kg).',
    safetyNotes: 'Give with a meal to minimize potential gastrointestinal side effects like nausea, vomiting, or diarrhea. Never give leftovers or human antibiotics to dogs without a vet determining the specific bacterial susceptibility.',
    warningColor: 'blue',
    dosePerLbMin: 5.0,
    dosePerLbMax: 10.0,
    dosePerKgMin: 11.0,
    dosePerKgMax: 22.0,
    formulations: [
      { type: 'Tablet', strength: '100 mg', factor: 100, unit: 'tablet' },
      { type: 'Tablet', strength: '150 mg', factor: 150, unit: 'tablet' },
      { type: 'Tablet', strength: '250 mg', factor: 250, unit: 'tablet' },
      { type: 'Tablet', strength: '500 mg', factor: 500, unit: 'tablet' },
      { type: 'Liquid', strength: '50 mg / mL suspension', factor: 50, unit: 'mL' }
    ]
  },
  {
    id: 'carprofen',
    name: 'Carprofen',
    generic: 'Carprofen (Rimadyl)',
    h2: 'Carprofen Dosage for Dogs',
    description: 'A non-steroidal anti-inflammatory drug (NSAID) formulated specifically for dogs to relieve joint pain, inflammation from osteoarthritis, and acute post-operative pain.',
    category: 'Pain & Inflammation (NSAID)',
    frequency: 'Administered once daily (every 24 hours) or split equally into two doses given every 12 hours.',
    duration: 'Short-term (3 to 7 days) for acute injury or surgical recovery; long-term for chronic arthritis.',
    byWeightText: 'Target dose is 2 mg per pound of body weight (4.4 mg/kg) daily.',
    safetyNotes: 'CRITICAL: Never administer carprofen alongside other NSAIDs (Aspirin, Meloxicam, Ibuprofen) or systemic corticosteroids (Prednisolone, Dexamethasone), as this creates a severe, potentially fatal risk of gastrointestinal ulceration or renal failure. If your dog exhibits vomiting, diarrhea, or dark/tarry stool, stop the medication immediately and consult a vet.',
    warningColor: 'red',
    dosePerLbMin: 2.0,
    dosePerLbMax: 2.0,
    dosePerKgMin: 4.4,
    dosePerKgMax: 4.4,
    formulations: [
      { type: 'Chewable', strength: '25 mg chewable', factor: 25, unit: 'tablet' },
      { type: 'Chewable', strength: '75 mg chewable', factor: 75, unit: 'tablet' },
      { type: 'Chewable', strength: '100 mg chewable', factor: 100, unit: 'tablet' }
    ]
  },
  {
    id: 'meloxicam',
    name: 'Meloxicam',
    generic: 'Meloxicam (Metacam)',
    h2: 'Meloxicam Dosage for Dogs',
    description: 'An FDA-approved prescription veterinary NSAID liquid used to manage chronic pain, swelling, and stiff joints related to arthritis or orthopedic surgeries in dogs.',
    category: 'Pain & Inflammation (NSAID)',
    frequency: 'Given once daily (every 24 hours) with food.',
    duration: 'Used chronic daily for osteoarthritis or short-term (3 to 5 days) for soft-tissue swelling.',
    byWeightText: 'Requires a loading dose of 0.09 mg/lb (0.2 mg/kg) on the first day, followed by a maintenance dose of 0.045 mg/lb (0.1 mg/kg) once daily thereafter.',
    safetyNotes: 'Always give meloxicam with a full meal to protect the stomach lining. Use the calibrated oral dosing syringe provided with the Metacam bottle, which matches the weight marks on the cylinder. Do not mix with other anti-inflammatories or steroids.',
    warningColor: 'red',
    subDoses: [
      {
        name: 'Day 1 Loading Dose',
        description: 'Initial higher dose to achieve active blood levels rapidly.',
        dosePerLb: 0.09,
        dosePerKg: 0.2,
        freq: 'Once (Day 1 only)',
        dur: '1 day only'
      },
      {
        name: 'Day 2+ Maintenance',
        description: 'Long-term safe therapeutic level.',
        dosePerLb: 0.045,
        dosePerKg: 0.1,
        freq: 'Once daily (every 24 hours)',
        dur: 'As long as prescribed'
      }
    ],
    formulations: [
      { type: 'Liquid', strength: '0.5 mg / mL (Small dogs)', factor: 0.5, unit: 'mL' },
      { type: 'Liquid', strength: '1.5 mg / mL (Large dogs)', factor: 1.5, unit: 'mL' }
    ]
  },
  {
    id: 'zyrtec',
    name: 'Zyrtec',
    generic: 'Cetirizine',
    h2: 'Zyrtec Dosage for Dogs',
    description: 'A second-generation non-drowsy over-the-counter antihistamine used to relieve itchiness, hives, hot spots, insect stings, and seasonal allergic reactions in dogs.',
    category: 'Antihistamine',
    frequency: 'Given once or twice daily (every 12 to 24 hours).',
    duration: 'Typically administered daily during allergy seasons or on an as-needed basis for acute bug bites.',
    byWeightText: 'Standard weight-based calculation is 0.5 mg per pound (1.0 mg/kg). For simplicity, vets often use weight brackets: Dogs under 15 lbs receive 2.5 mg; dogs 15 to 40 lbs receive 5 mg; dogs over 40 lbs receive 10 mg.',
    safetyNotes: 'WARNING: Check the packaging to ensure the product is plain Zyrtec and NOT Zyrtec-D. Zyrtec-D contains Pseudoephedrine, a decongestant that triggers life-threatening toxicity (rapid heart rate, tremors, hyperthermia) in dogs.',
    warningColor: 'yellow',
    dosePerLbMin: 0.5,
    dosePerLbMax: 0.5,
    dosePerKgMin: 1.0,
    dosePerKgMax: 1.0,
    formulations: [
      { type: 'Tablet', strength: '5 mg', factor: 5, unit: 'tablet' },
      { type: 'Tablet', strength: '10 mg', factor: 10, unit: 'tablet' }
    ]
  },
  {
    id: 'apoquel',
    name: 'Apoquel',
    generic: 'Oclacitinib',
    h2: 'Apoquel Dosage for Dogs',
    description: 'A fast-acting, targeted prescription medication that halts allergic itch and skin inflammation at the source by inhibiting JAK (Janus kinase) enzymes.',
    category: 'Pain & Inflammation (Other)',
    frequency: 'Administered twice daily (every 12 hours) for the first 14 days, then tapered to once daily (every 24 hours) as a maintenance dose.',
    duration: 'Can be used for short-term relief of acute allergic flare-ups, or long-term for dogs with severe chronic atopic dermatitis.',
    byWeightText: 'Dosed at 0.18 to 0.27 mg per pound of body weight (0.4 to 0.6 mg/kg).',
    safetyNotes: 'Apoquel must only be given to dogs at least 12 months of age. It modulates the immune system, so it should be used with caution in dogs with pre-existing serious infections or active cancers. Regularly schedule veterinary follow-ups for long-term use.',
    warningColor: 'blue',
    dosePerLbMin: 0.18,
    dosePerLbMax: 0.27,
    dosePerKgMin: 0.4,
    dosePerKgMax: 0.6,
    formulations: [
      { type: 'Tablet', strength: '3.6 mg', factor: 3.6, unit: 'tablet' },
      { type: 'Tablet', strength: '5.4 mg', factor: 5.4, unit: 'tablet' },
      { type: 'Tablet', strength: '16 mg', factor: 16, unit: 'tablet' }
    ]
  },
  {
    id: 'cerenia',
    name: 'Cerenia',
    generic: 'Maropitant Citrate',
    h2: 'Cerenia Dosage for Dogs',
    description: 'A highly effective prescription neurokinin-1 (NK1) receptor antagonist designed specifically for dogs to prevent or treat acute vomiting and motion sickness during travel.',
    category: 'Anti-nausea',
    frequency: 'Given once daily (every 24 hours).',
    duration: 'For acute vomiting, can be given for up to 5 consecutive days. For travel motion sickness, given once daily up to 2 consecutive days, at least 2 hours prior to driving.',
    byWeightText: 'For acute vomiting, the dose is 0.9 mg per pound (2 mg/kg). For motion sickness prevention, a higher dose of 3.6 mg per pound (8 mg/kg) is required.',
    safetyNotes: 'To prevent motion sickness, feed a small, light snack (such as a small slice of turkey or chicken breast) 2 hours before giving the tablet. Do not wrap the tablet tightly in high-fat treats (like thick cheese or peanut butter) as they delay absorption. Cerenia tablets have a strong scent; do not leave them where dogs can ingest multiple.',
    warningColor: 'blue',
    subDoses: [
      {
        name: 'Acute Vomiting Treatment',
        description: 'Lower dose designed to block central emetic triggers in the brain.',
        dosePerLb: 0.9,
        dosePerKg: 2.0,
        freq: 'Once daily (every 24 hours)',
        dur: 'Up to 5 consecutive days'
      },
      {
        name: 'Motion Sickness Prevention',
        description: 'Higher dose required to block vestibular pathway triggers during motion.',
        dosePerLb: 3.6,
        dosePerKg: 8.0,
        freq: 'Once daily (2 hours before travel)',
        dur: 'Up to 2 consecutive days'
      }
    ],
    formulations: [
      { type: 'Tablet', strength: '16 mg', factor: 16, unit: 'tablet' },
      { type: 'Tablet', strength: '24 mg', factor: 24, unit: 'tablet' },
      { type: 'Tablet', strength: '60 mg', factor: 60, unit: 'tablet' },
      { type: 'Tablet', strength: '160 mg', factor: 160, unit: 'tablet' }
    ]
  },
  {
    id: 'aspirin',
    name: 'Aspirin',
    generic: 'Acetylsalicylic Acid (Buffered)',
    h2: 'Aspirin Dosage for Dogs',
    description: 'An over-the-counter NSAID that was historically used to manage mild pain and joint inflammation in dogs, but has largely been replaced by safer veterinary-specific drugs.',
    category: 'Pain & Inflammation (NSAID)',
    frequency: 'Administered every 12 hours (twice daily) with food.',
    duration: 'Strictly limited to a maximum of 2 to 3 days. Prolonged use causes severe gastric erosion.',
    byWeightText: 'The standard safe dosage is 5 to 10 mg per pound of body weight (10 to 20 mg/kg).',
    safetyNotes: 'CRITICAL: Never give unbuffered aspirin, and never give aspirin to a dog who is on other steroids (like Prednisolone) or veterinary NSAIDs (like Carprofen or Meloxicam). High risk of bleeding, stomach ulcers, and kidney injury. Buffered aspirin must be administered alongside a generous meal.',
    warningColor: 'red',
    dosePerLbMin: 5.0,
    dosePerLbMax: 10.0,
    dosePerKgMin: 10.0,
    dosePerKgMax: 20.0,
    formulations: [
      { type: 'Tablet', strength: '81 mg (Baby aspirin)', factor: 81, unit: 'tablet' },
      { type: 'Tablet', strength: '325 mg (Regular aspirin)', factor: 325, unit: 'tablet' }
    ]
  },
  {
    id: 'tramadol',
    name: 'Tramadol',
    generic: 'Tramadol Hydrochloride',
    h2: 'Tramadol Dosage for Dogs',
    description: 'A prescription synthetic opioid-like analgesic used to manage moderate to severe acute pain, post-surgical pain, or chronic orthopedic pain in dogs.',
    category: 'Pain & Inflammation (Other)',
    frequency: 'Given every 8 to 12 hours (2 to 3 times daily) as prescribed.',
    duration: 'Used short-term for post-op healing (3 to 7 days) or chronically as a supplement to NSAIDs for end-stage arthritis.',
    byWeightText: 'Dosed at 0.45 to 1.8 mg per pound of body weight (1 to 4 mg/kg).',
    safetyNotes: 'May cause sedation, constipation, anxiety, or mild nausea. Do not abruptly stop tramadol after long-term chronic therapy; taper it down under veterinary direction to avoid mild withdrawal symptoms.',
    warningColor: 'blue',
    dosePerLbMin: 0.45,
    dosePerLbMax: 1.8,
    dosePerKgMin: 1.0,
    dosePerKgMax: 4.0,
    formulations: [
      { type: 'Tablet', strength: '50 mg', factor: 50, unit: 'tablet' }
    ]
  },
  {
    id: 'ivermectin',
    name: 'Ivermectin',
    generic: 'Ivermectin',
    h2: 'Ivermectin Dosage for Dogs',
    description: 'An antiparasitic medication used in extremely tiny doses as a monthly heartworm preventative, or in much larger doses to treat severe mite infections such as sarcoptic/demodectic mange.',
    category: 'Parasiticide',
    frequency: 'For heartworm prevention: Given once monthly (every 30 days). For mange treatment: Given once daily.',
    duration: 'Heartworm preventative is given year-round. Mange treatment typically lasts 4 to 8 weeks.',
    byWeightText: 'Heartworm prevention requires a tiny dose of 0.0027 mg per pound (0.006 mg/kg or 6 mcg/kg). Demodectic or Sarcoptic mange requires 0.14 to 0.27 mg per pound (0.3 to 0.6 mg/kg).',
    safetyNotes: 'CRITICAL WARNING: Many herding breeds (including Collies, Shetland Sheepdogs, Australian Shepherds, and Border Collies) possess the MDR1 (ABCB1) gene mutation. This mutation impairs their blood-brain barrier, allowing ivermectin to enter the brain and cause fatal neurological toxicity (tremors, blindness, coma). Always test herding breeds before giving ivermectin. Standard 1% liquid is extremely concentrated (10 mg/mL) and should never be measured at home for small dogs without veterinary dilution.',
    warningColor: 'red',
    subDoses: [
      {
        name: 'Heartworm Prevention',
        description: 'Micro-dose standard. Safely destroys immature heartworm larvae.',
        dosePerLb: 0.0027,
        dosePerKg: 0.006,
        freq: 'Once monthly (every 30 days)',
        dur: 'Monthly, year-round'
      },
      {
        name: 'Mange Treatment (Sarcoptic/Demodectic)',
        description: 'High-dose veterinary regimen. Requires strict monitoring.',
        dosePerLb: 0.2,
        dosePerKg: 0.44,
        freq: 'Once daily (every 24 hours)',
        dur: '4 to 8 weeks'
      }
    ],
    formulations: [
      { type: 'Liquid', strength: '1% solution (10 mg / mL)', factor: 10, unit: 'mL' }
    ]
  },
  {
    id: 'clavamox',
    name: 'Clavamox',
    generic: 'Amoxicillin / Clavulanic Acid',
    h2: 'Clavamox Dosage for Dogs',
    description: 'A potentiated penicillin antibiotic where clavulanate potassium overcomes bacterial beta-lactamase resistance, making it highly effective for skin, periodontal, and deep wound infections.',
    category: 'Antibiotic',
    frequency: 'Administered every 12 hours (twice daily).',
    duration: 'Typically prescribed for 7 to 14 days.',
    byWeightText: 'Standard oral dose is 6.25 mg of the combined ingredients per pound of body weight (13.75 mg/kg).',
    safetyNotes: 'Give with food to reduce tummy upset. If you are using the liquid suspension, keep it strictly refrigerated, shake well before use, and discard any unused portion after 10 days.',
    warningColor: 'blue',
    dosePerLbMin: 6.25,
    dosePerLbMax: 6.25,
    dosePerKgMin: 13.75,
    dosePerKgMax: 13.75,
    formulations: [
      { type: 'Tablet', strength: '62.5 mg', factor: 62.5, unit: 'tablet' },
      { type: 'Tablet', strength: '125 mg', factor: 125, unit: 'tablet' },
      { type: 'Tablet', strength: '250 mg', factor: 250, unit: 'tablet' },
      { type: 'Tablet', strength: '375 mg', factor: 375, unit: 'tablet' },
      { type: 'Liquid', strength: '62.5 mg / mL oral suspension', factor: 62.5, unit: 'mL' }
    ]
  },
  {
    id: 'acepromazine',
    name: 'Acepromazine',
    generic: 'Acepromazine Maleate',
    h2: 'Acepromazine Dosage for Dogs',
    description: 'A phenothiazine sedative and tranquilizer used as a pre-anesthetic or to sedate aggressive, fearful, or highly hyperactive dogs during stressful medical procedures.',
    category: 'Anxiety & Sedation',
    frequency: 'Administered every 6 to 8 hours as needed.',
    duration: 'Used as a short-term single-event sedative.',
    byWeightText: 'Oral dosage ranges from 0.25 to 1.0 mg per pound of body weight (0.55 to 2.2 mg/kg).',
    safetyNotes: 'Acepromazine causes vasodilation, leading to a drop in blood pressure (hypotension). Do not use in geriatric dogs, animals with liver disease, or dogs prone to seizures. Boxers are highly sensitive to acepromazine and can suffer sudden cardiovascular collapse; use with extreme veterinary discretion in this breed.',
    warningColor: 'yellow',
    dosePerLbMin: 0.25,
    dosePerLbMax: 1.0,
    dosePerKgMin: 0.55,
    dosePerKgMax: 2.2,
    formulations: [
      { type: 'Tablet', strength: '10 mg', factor: 10, unit: 'tablet' },
      { type: 'Tablet', strength: '25 mg', factor: 25, unit: 'tablet' }
    ]
  },
  {
    id: 'pepto-bismol',
    name: 'Pepto Bismol',
    generic: 'Bismuth Subsalicylate',
    h2: 'Pepto Bismol Dosage for Dogs',
    description: 'An over-the-counter stomach coating agent used temporarily to treat mild diarrhea, gas, or stomach upset in dogs.',
    category: 'Gastrointestinal',
    frequency: 'Given every 6 to 8 hours (3 to 4 times per day) as needed.',
    duration: 'Strictly limit to 2 days max. If diarrhea persists, seek veterinary attention to check for parasites or underlying infections.',
    byWeightText: 'Dosed at 0.5 to 1.0 mL of standard strength liquid per pound of body weight (equivalent to 1 to 2 mL per kilogram).',
    safetyNotes: 'CRITICAL: Never give Pepto Bismol to cats, as salicylates are highly toxic to them. Bismuth will react in the gut to turn your dog’s stool a deep black color. This is a normal reaction but can easily be confused with melena (internal bleeding). Consult your vet first if your dog has active bleeding disorders or is taking NSAIDs.',
    warningColor: 'yellow',
    dosePerLbMin: 0.5,
    dosePerLbMax: 1.0,
    dosePerKgMin: 1.0,
    dosePerKgMax: 2.0,
    formulations: [
      { type: 'Liquid', strength: 'Standard liquid (262 mg / 15 mL)', factor: 17.47, unit: 'mL' }
    ]
  },
  {
    id: 'imodium',
    name: 'Imodium',
    generic: 'Loperamide Hydrochloride',
    h2: 'Imodium Dosage for Dogs',
    description: 'An over-the-counter synthetic opioid derivative that slows intestinal motility to relieve acute, non-infectious diarrhea in dogs.',
    category: 'Gastrointestinal',
    frequency: 'Given every 8 to 12 hours (2 to 3 times daily) as needed.',
    duration: 'Limit to 1 to 2 days. Discontinue immediately once stool firms up or if your dog does not pass stool within 24 hours.',
    byWeightText: 'Dosed at 0.05 to 0.1 mg per pound of body weight (0.1 to 0.2 mg/kg).',
    safetyNotes: 'CRITICAL: Do NOT give to herding breeds (Collies, Aussies, Shelties) as they may carry the MDR1 gene mutation, making loperamide cross the blood-brain barrier and cause severe neurotoxicity (hypersalivation, ataxia, depression, coma). Never use if diarrhea is caused by an ingested toxin or bacteria, as slowing down the bowels will trap the dangerous organisms inside the GI tract.',
    warningColor: 'red',
    dosePerLbMin: 0.05,
    dosePerLbMax: 0.1,
    dosePerKgMin: 0.1,
    dosePerKgMax: 0.2,
    formulations: [
      { type: 'Capsule', strength: '2 mg capsule/tablet', factor: 2, unit: 'capsule' },
      { type: 'Liquid', strength: '0.2 mg / mL (Children’s liquid)', factor: 0.2, unit: 'mL' }
    ]
  },
  {
    id: 'prednisolone',
    name: 'Prednisolone',
    generic: 'Prednisolone',
    h2: 'Prednisolone Dosage for Dogs',
    description: 'A potent prescription synthetic corticosteroid (steroid) used to suppress overactive immune systems, treat inflammatory disorders, allergies, and certain cancers in dogs.',
    category: 'Steroid',
    frequency: 'Given once daily or divided into two doses every 12 hours.',
    duration: 'Highly variable. Long-term treatment requires a strict taper schedule; NEVER stop administering prednisolone suddenly as it can trigger a life-threatening Addisonian crisis.',
    byWeightText: 'Anti-inflammatory dose is 0.1 to 0.25 mg per pound (0.2 to 0.5 mg/kg). Immunosuppressive or anti-allergy dose is higher, ranging from 0.5 to 1.0 mg per pound (1.0 to 2.2 mg/kg).',
    safetyNotes: 'Corticosteroids trigger pronounced increases in drinking, urination, and hunger. Ensure your dog always has access to clean fresh water. Do not combine with any NSAIDs (Carprofen, Meloxicam, Aspirin) as this can cause fatal gastric perforation.',
    warningColor: 'red',
    subDoses: [
      {
        name: 'Anti-inflammatory Dosage',
        description: 'Lower dose to treat arthritis flare-ups, ear inflammation, or general swelling.',
        dosePerLb: 0.18,
        dosePerKg: 0.4,
        freq: 'Once daily (every 24 hours)',
        dur: 'As directed (must be tapered)'
      },
      {
        name: 'Immunosuppressive Dosage',
        description: 'Higher dose to manage autoimmune skin diseases, severe allergies, or hemolytic anemia.',
        dosePerLb: 0.75,
        dosePerKg: 1.65,
        freq: 'Once daily or split every 12 hours',
        dur: 'Varies; requires strict taper'
      }
    ],
    formulations: [
      { type: 'Tablet', strength: '5 mg', factor: 5, unit: 'tablet' },
      { type: 'Tablet', strength: '10 mg', factor: 10, unit: 'tablet' },
      { type: 'Tablet', strength: '20 mg', factor: 20, unit: 'tablet' }
    ]
  },
  {
    id: 'doxycycline',
    name: 'Doxycycline',
    generic: 'Doxycycline Hyclate / Monohydrate',
    h2: 'Doxycycline Dosage for Dogs',
    description: 'A tetracycline-class prescription antibiotic highly effective against intracellular pathogens, primarily used to treat tick-borne infections (Lyme, Ehrlichiosis, Anaplasmosis) and respiratory infections (kennel cough).',
    category: 'Antibiotic',
    frequency: 'Administered once daily (every 24 hours) or split into two doses given every 12 hours.',
    duration: 'For respiratory infections: 7 to 14 days. For tick-borne illnesses: A strict 28-day continuous course is required to fully eradicate the bacteria.',
    byWeightText: 'Oral dosage is 2.3 to 5 mg per pound of body weight (5 to 10 mg/kg).',
    safetyNotes: 'CRITICAL: Always administer doxycycline with a wet, moist meal, and follow with water. If a doxycycline pill gets stuck in the dog’s dry esophagus, it can cause severe tissue necrosis and life-threatening esophageal strictures. Never give dry pills.',
    warningColor: 'red',
    dosePerLbMin: 2.3,
    dosePerLbMax: 5.0,
    dosePerKgMin: 5.0,
    dosePerKgMax: 10.0,
    formulations: [
      { type: 'Tablet', strength: '50 mg', factor: 50, unit: 'tablet' },
      { type: 'Tablet', strength: '100 mg', factor: 100, unit: 'tablet' }
    ]
  },
  {
    id: 'ofloxacin-eye-drops',
    name: 'Ofloxacin Eye Drops',
    generic: 'Ofloxacin Ophthalmic Solution 0.3%',
    h2: 'Ofloxacin Eye Drops for Dogs',
    description: 'A potent fluoroquinolone ophthalmic antibiotic eye drop used to treat bacterial conjunctivitis, corneal ulcers, or other delicate eye infections in dogs.',
    category: 'Antibiotic',
    frequency: 'Administered as 1 drop in the affected eye(s) every 6 to 12 hours.',
    duration: 'Typically continued for 5 to 10 days depending on corneal healing evaluated by your vet.',
    byWeightText: 'WEIGHT-INDEPENDENT: Ophthalmic eye drops are administered topically to the eye surface and do NOT scale with the dog’s body weight. A tiny Chihuahua and a massive Great Dane both receive exactly 1 drop per eye.',
    safetyNotes: 'Do not allow the tip of the dropper to touch the dog’s eye, eyelashes, or skin to prevent bacterial contamination of the bottle. If corneal scratching is suspected, a vet must perform a fluorescein stain test before applying steroid drops; ofloxacin is steroid-free and safe for simple bacterial ulcers.',
    warningColor: 'blue',
    isWeightIndependent: true,
    formulations: [
      { type: 'Eye Drops', strength: '0.3% Ophthalmic Solution', factor: 1, unit: 'drop' }
    ]
  },
  {
    id: 'metronidazole',
    name: 'Metronidazole',
    generic: 'Metronidazole',
    h2: 'Metronidazole Dosage for Dogs',
    description: 'A prescription antibiotic and antiprotozoal agent used to treat colitis, inflammatory bowel disease, anaerobic bacterial infections, and intestinal parasites such as Giardia.',
    category: 'Antibiotic',
    frequency: 'Typically administered every 12 hours (twice daily) with food.',
    duration: 'Commonly prescribed for 5 to 10 days. Always complete the entire prescribed regimen.',
    byWeightText: 'Standard therapeutic dosing is 5 to 12 mg per pound of body weight (11 to 26 mg/kg) twice daily. For Giardia, higher veterinary-monitored doses up to 15 mg per pound once daily may be utilized.',
    safetyNotes: 'Prolonged or high-dose use can cause reversible neurological toxicity (characterized by rapid eye movements/nystagmus, head tilt, wobbly walking, or tremors). Stop treatment and contact your vet immediately if these symptoms appear. Metronidazole has an extremely bitter taste; do not crush tablets.',
    warningColor: 'red',
    dosePerLbMin: 5.0,
    dosePerLbMax: 12.0,
    dosePerKgMin: 11.0,
    dosePerKgMax: 26.4,
    formulations: [
      { type: 'Tablet', strength: '250 mg', factor: 250, unit: 'tablet' },
      { type: 'Tablet', strength: '500 mg', factor: 500, unit: 'tablet' },
      { type: 'Liquid', strength: '50 mg / mL suspension (compounded)', factor: 50, unit: 'mL' }
    ]
  },
  {
    id: 'cephalexin',
    name: 'Cephalexin',
    generic: 'Cephalexin Monohydrate',
    h2: 'Cephalexin Dosage for Dogs',
    description: 'A broad-spectrum cephalosporin antibiotic frequently prescribed to treat bacterial skin infections (pyoderma), urinary tract infections (UTIs), and bone or joint infections in dogs.',
    category: 'Antibiotic',
    frequency: 'Administered every 8 to 12 hours (typically twice daily).',
    duration: 'Standard courses are 7 to 14 days, but deep skin or bone infections may require continuous therapy for 21 to 28 days.',
    byWeightText: 'Oral dosing ranges from 10 to 15 mg per pound of body weight (22 to 33 mg/kg) per administration.',
    safetyNotes: 'Always give cephalexin with a small meal to prevent gastric upset, vomiting, or diarrhea. Watch for signs of penicillin/cephalosporin allergies such as skin rashes, facial swelling, or breathing difficulties.',
    warningColor: 'blue',
    dosePerLbMin: 10.0,
    dosePerLbMax: 15.0,
    dosePerKgMin: 22.0,
    dosePerKgMax: 33.0,
    formulations: [
      { type: 'Capsule', strength: '250 mg', factor: 250, unit: 'capsule' },
      { type: 'Capsule', strength: '500 mg', factor: 500, unit: 'capsule' },
      { type: 'Capsule', strength: '750 mg', factor: 750, unit: 'capsule' },
      { type: 'Liquid', strength: '50 mg / mL (250 mg / 5 mL)', factor: 50, unit: 'mL' }
    ]
  },
  {
    id: 'pepcid',
    name: 'Pepcid',
    generic: 'Famotidine',
    h2: 'Pepcid Dosage for Dogs',
    description: 'An over-the-counter H2-receptor antagonist used in dogs to reduce stomach acid production, treat gastric ulcers, and alleviate symptoms of acid reflux, gastritis, and stomach irritation.',
    category: 'Gastrointestinal',
    frequency: 'Given once or twice daily (every 12 to 24 hours).',
    duration: 'Used short-term for 3 to 10 days during acute vomiting recovery, or chronically for acid reflux under direct veterinary management.',
    byWeightText: 'Dosed at 0.25 to 0.5 mg per pound of body weight (0.5 to 1.0 mg/kg).',
    safetyNotes: 'CRITICAL: Ensure you use plain Pepcid AC (Famotidine) and NOT Pepcid Complete, which contains calcium carbonate and magnesium hydroxide that can interfere with absorption or contain other active ingredients. Best administered on an empty stomach 30 to 60 minutes before meals.',
    warningColor: 'yellow',
    dosePerLbMin: 0.25,
    dosePerLbMax: 0.5,
    dosePerKgMin: 0.5,
    dosePerKgMax: 1.0,
    formulations: [
      { type: 'Tablet', strength: '10 mg', factor: 10, unit: 'tablet' },
      { type: 'Tablet', strength: '20 mg', factor: 20, unit: 'tablet' }
    ]
  },
  {
    id: 'dramamine',
    name: 'Dramamine',
    generic: 'Dimenhydrinate',
    h2: 'Dramamine Dosage for Dogs',
    description: 'An over-the-counter antihistamine and anticholinergic medication used to prevent and alleviate motion sickness, travel-induced nausea, and dizziness in dogs.',
    category: 'Anti-nausea',
    frequency: 'Given once every 8 hours as needed, starting 30 to 60 minutes prior to travel.',
    duration: 'Administered on an as-needed basis strictly on travel days.',
    byWeightText: 'Standard oral dosage is 2 to 4 mg per pound of body weight (4.4 to 8.8 mg/kg).',
    safetyNotes: 'Often causes sleepiness, lethargy, or dry mouth. Ensure the product is plain Dramamine (Dimenhydrinate) and contains no active stimulants, caffeine, or pain relievers. Use with high caution in dogs with glaucoma, prostate enlargement, or urinary retention.',
    warningColor: 'yellow',
    dosePerLbMin: 2.0,
    dosePerLbMax: 4.0,
    dosePerKgMin: 4.4,
    dosePerKgMax: 8.8,
    formulations: [
      { type: 'Tablet', strength: '50 mg', factor: 50, unit: 'tablet' },
      { type: 'Liquid', strength: '12.5 mg / 5 mL (Children’s Dramamine)', factor: 2.5, unit: 'mL' }
    ]
  },
  {
    id: 'prednisone',
    name: 'Prednisone',
    generic: 'Prednisone',
    h2: 'Prednisone Dosage for Dogs',
    description: 'A prescription systemic corticosteroid used to reduce inflammation, manage severe allergies, treat respiratory conditions, and manage immune-mediated diseases in dogs.',
    category: 'Steroid',
    frequency: 'Administered once daily or divided into two doses given every 12 hours.',
    duration: 'Highly variable. Long-term use requires a gradual, scheduled tapering regimen. NEVER stop administering prednisone abruptly as it can cause an acute, life-threatening adrenal crisis.',
    byWeightText: 'Anti-inflammatory dose is 0.1 to 0.25 mg per pound (0.2 to 0.5 mg/kg). Immunosuppressive or anti-allergy dose is higher, ranging from 0.5 to 1.0 mg per pound (1.0 to 2.2 mg/kg).',
    safetyNotes: 'Prednisone is converted into prednisolone by the liver. Dogs with compromised liver function should receive Prednisolone directly instead. Expect side effects like extreme thirst (polydipsia), frequent urination (polyuria), and increased panting. Do not combine with any NSAIDs.',
    warningColor: 'red',
    subDoses: [
      {
        name: 'Anti-inflammatory dosage',
        description: 'Lower dose to treat arthritis flare-ups, swelling, or ear inflammation.',
        dosePerLb: 0.18,
        dosePerKg: 0.4,
        freq: 'Once daily (every 24 hours)',
        dur: 'As directed (must be tapered)'
      },
      {
        name: 'Immunosuppressive dosage',
        description: 'Higher dose to manage autoimmune skin diseases, severe allergic hives, or blood disorders.',
        dosePerLb: 0.75,
        dosePerKg: 1.65,
        freq: 'Once daily or split every 12 hours',
        dur: 'Varies; requires strict taper'
      }
    ],
    formulations: [
      { type: 'Tablet', strength: '5 mg', factor: 5, unit: 'tablet' },
      { type: 'Tablet', strength: '10 mg', factor: 10, unit: 'tablet' },
      { type: 'Tablet', strength: '20 mg', factor: 20, unit: 'tablet' },
      { type: 'Tablet', strength: '50 mg', factor: 50, unit: 'tablet' }
    ]
  },
  {
    id: 'dexamethasone',
    name: 'Dexamethasone',
    generic: 'Dexamethasone',
    h2: 'Dexamethasone Dosage for Dogs',
    description: 'An exceptionally potent, long-acting prescription glucocorticoid steroid used to treat acute anaphylactic shock, severe spinal trauma, brain swelling, and intense inflammatory flare-ups.',
    category: 'Steroid',
    frequency: 'Administered once daily (every 24 hours).',
    duration: 'Typically restricted to short-term, acute rescue therapy due to its extreme potency, often transitioning to prednisone or prednisolone.',
    byWeightText: 'Dosed at 0.025 to 0.05 mg per pound of body weight (0.05 to 0.1 mg/kg) daily. Dexamethasone is approximately 7.5 to 10 times more potent than prednisone.',
    safetyNotes: 'Highly potent steroid. Side effects like profound thirst, hunger, and urination are pronounced. Never administer alongside NSAIDs (Carprofen, Meloxicam, Aspirin) as it causes severe, life-threatening stomach ulcers and intestinal bleeding.',
    warningColor: 'red',
    dosePerLbMin: 0.025,
    dosePerLbMax: 0.05,
    dosePerKgMin: 0.05,
    dosePerKgMax: 0.1,
    formulations: [
      { type: 'Tablet', strength: '0.5 mg', factor: 0.5, unit: 'tablet' },
      { type: 'Tablet', strength: '0.75 mg', factor: 0.75, unit: 'tablet' },
      { type: 'Tablet', strength: '1.5 mg', factor: 1.5, unit: 'tablet' },
      { type: 'Tablet', strength: '4 mg', factor: 4, unit: 'tablet' }
    ]
  },
  {
    id: 'baytril',
    name: 'Baytril',
    generic: 'Enrofloxacin',
    h2: 'Baytril Dosage for Dogs',
    description: 'A high-potency fluoroquinolone prescription antibiotic used to treat severe, resistant infections of the skin, ear canals, urinary tract, respiratory system, and bone tissues.',
    category: 'Antibiotic',
    frequency: 'Administered once daily (every 24 hours).',
    duration: 'Typically prescribed for 7 to 14 days. Ensure the complete course is finished even if clinical signs resolve.',
    byWeightText: 'Standard oral dose ranges from 2.3 to 9.1 mg per pound of body weight (5 to 20 mg/kg) once daily.',
    safetyNotes: 'CRITICAL: Enrofloxacin can damage cartilage development in growing joints. Do not use in puppies under 12 months (or up to 18 months for giant breeds). May cause gastrointestinal distress, lethargy, or temporary loss of appetite.',
    warningColor: 'red',
    dosePerLbMin: 2.3,
    dosePerLbMax: 9.1,
    dosePerKgMin: 5.0,
    dosePerKgMax: 20.0,
    formulations: [
      { type: 'Tablet', strength: '22.7 mg', factor: 22.7, unit: 'tablet' },
      { type: 'Tablet', strength: '68 mg', factor: 68, unit: 'tablet' },
      { type: 'Tablet', strength: '136 mg', factor: 136, unit: 'tablet' }
    ]
  },
  {
    id: 'fenbendazole',
    name: 'Fenbendazole (Panacur)',
    generic: 'Fenbendazole',
    h2: 'Fenbendazole Dosage for Dogs',
    description: 'A highly safe, broad-spectrum anthelmintic (dewormer) used to eradicate common intestinal parasites including roundworms, hookworms, whipworms, certain tapeworms, and Giardia.',
    category: 'Parasiticide',
    frequency: 'Given once daily (every 24 hours) mixed thoroughly with food.',
    duration: 'Administered daily for 3 consecutive days for worms, or extended to 5 to 10 days for treating Giardia protozoal infections.',
    byWeightText: 'Dosed at 22.7 mg per pound of body weight (50 mg/kg) daily.',
    safetyNotes: 'Extremely high safety margin. Adverse reactions are exceptionally rare, but mild vomiting or diarrhea can occur in sensitive dogs. Always administer with a meal to improve absorption and ensure the dog consumes the entire dose.',
    warningColor: 'blue',
    dosePerLbMin: 22.7,
    dosePerLbMax: 22.7,
    dosePerKgMin: 50.0,
    dosePerKgMax: 50.0,
    formulations: [
      { type: 'Liquid', strength: '10% suspension (100 mg / mL)', factor: 100, unit: 'mL' },
      { type: 'Tablet', strength: '1 g granule packet (100 mg active)', factor: 100, unit: 'packet' },
      { type: 'Tablet', strength: '2 g granule packet (200 mg active)', factor: 200, unit: 'packet' },
      { type: 'Tablet', strength: '4 g granule packet (400 mg active)', factor: 400, unit: 'packet' }
    ]
  },
  {
    id: 'onsior',
    name: 'Onsior',
    generic: 'Robenacoxib',
    h2: 'Onsior Dosage for Dogs',
    description: 'A modern, fast-acting tissue-selective NSAID specifically designed for dogs to treat post-operative pain and inflammation associated with orthopedic or soft-tissue surgeries.',
    category: 'Pain & Inflammation (NSAID)',
    frequency: 'Administered once daily (every 24 hours) at the same time.',
    duration: 'Strictly limited to a maximum of 3 consecutive days or as prescribed by your vet.',
    byWeightText: 'Standard clinical dosage is 0.45 mg per pound of body weight (1 mg/kg) once daily.',
    safetyNotes: 'CRITICAL SAFETY: Never exceed 3 days of treatment unless explicitly instructed by your veterinarian. Never give concurrently with any other NSAIDs (such as Carprofen, Meloxicam, or Aspirin) or systemic steroids (such as Prednisone or Dexamethasone). Stop administration and contact a vet immediately if vomiting, diarrhea, lethargy, or loss of appetite occurs.',
    warningColor: 'red',
    dosePerLbMin: 0.45,
    dosePerLbMax: 0.45,
    dosePerKgMin: 1.0,
    dosePerKgMax: 1.0,
    formulations: [
      { type: 'Tablet', strength: '10 mg (Flavored)', factor: 10, unit: 'tablet' },
      { type: 'Tablet', strength: '20 mg (Flavored)', factor: 20, unit: 'tablet' },
      { type: 'Tablet', strength: '40 mg (Flavored)', factor: 40, unit: 'tablet' }
    ]
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole (Prilosec)',
    generic: 'Omeprazole',
    h2: 'Omeprazole Dosage and Acid Reducer for Dogs',
    description: 'A proton pump inhibitor used to treat and prevent gastric ulcers, acid reflux, and stomach inflammation (gastritis) in dogs. Commonly searched as omeprazole dog dosage, stomach protectant for dogs, or Prilosec for dogs.',
    category: 'Gastrointestinal',
    frequency: 'Administered once daily (every 24 hours).',
    duration: 'Typically given for 10 to 14 days, or long-term under strict veterinary guidance for chronic acid-related conditions.',
    byWeightText: 'Standard dosage is 0.25 to 0.45 mg per pound of body weight (0.5 to 1.0 mg/kg) once daily.',
    safetyNotes: 'Give on an empty stomach, ideally 30 to 60 minutes before the first meal of the day, to maximize efficacy. Safe for short-term use, but prolonged administration (over 4 weeks) should be closely monitored as it can alter calcium/magnesium absorption and gastric microflora. Do not stop treatment abruptly.',
    warningColor: 'blue',
    prescriptionRequired: false,
    supervisionLevel: 'OTC',
    dosePerLbMin: 0.25,
    dosePerLbMax: 0.45,
    dosePerKgMin: 0.5,
    dosePerKgMax: 1.0,
    formulations: [
      { type: 'Tablet', strength: '10 mg', factor: 10, unit: 'tablet' },
      { type: 'Tablet', strength: '20 mg', factor: 20, unit: 'tablet' }
    ]
  },
  {
    id: 'sucralfate',
    name: 'Sucralfate (Carafate)',
    generic: 'Sucralfate',
    h2: 'Sucralfate Gastric Bandage Dosage for Dogs',
    description: 'A mucosal protectant that forms an "acid-resistant chemical bandage" over gastric ulcers and esophageal erosions. Frequently searched as sucralfate dog dosage, Carafate for dogs, or ulcer medicine for dogs.',
    category: 'Gastrointestinal',
    frequency: 'Given every 8 to 12 hours (2 to 3 times per day).',
    duration: 'Typically given for 5 to 10 days or until symptoms of gastrointestinal bleeding or ulceration resolve.',
    byWeightText: 'Standard dosage for small dogs (under 40 lbs) is 500 mg flat; for large dogs (over 40 lbs) is 1,000 mg flat (1 g) per dose. It is generally weight-independent in broad categories.',
    safetyNotes: 'Must be administered on an empty stomach (at least 1 hour before a meal or 2 hours after). CRITICAL: Sucralfate binds other medications and prevents their absorption. Always administer other oral drugs at least 2 hours before or after giving sucralfate. Can cause mild temporary constipation.',
    warningColor: 'blue',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    isWeightIndependent: true,
    formulations: [
      { type: 'Tablet', strength: '500 mg', factor: 500, unit: 'tablet' },
      { type: 'Tablet', strength: '1000 mg (1 g)', factor: 1000, unit: 'tablet' }
    ]
  },
  {
    id: 'furosemide',
    name: 'Furosemide (Lasix / Salix)',
    generic: 'Furosemide',
    h2: 'Furosemide Diuretic Dosage and Administration for Dogs',
    description: 'A powerful loop diuretic used to treat congestive heart failure, pulmonary edema (fluid in the lungs), and other fluid retention disorders in dogs. Commonly searched as Lasix for dogs, furosemide dog dosage, or fluid pill for dogs.',
    category: 'Endocrine & Chronic Care',
    frequency: 'Given once, twice, or up to three times daily as prescribed.',
    duration: 'Typically a life-long chronic medication for dogs with congestive heart failure.',
    byWeightText: 'Standard oral maintenance dose is 0.45 to 0.9 mg per pound of body weight (1 to 2 mg/kg) every 12 hours.',
    safetyNotes: 'Furosemide causes increased urination and thirst. Always ensure your dog has unlimited, constant access to fresh water to prevent severe dehydration and electrolyte depletion. Monitor for signs of weakness, muscle cramping, or kidney strain. Regular blood work is essential.',
    warningColor: 'yellow',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    dosePerLbMin: 0.45,
    dosePerLbMax: 0.9,
    dosePerKgMin: 1.0,
    dosePerKgMax: 2.0,
    formulations: [
      { type: 'Tablet', strength: '12.5 mg', factor: 12.5, unit: 'tablet' },
      { type: 'Tablet', strength: '20 mg', factor: 20, unit: 'tablet' },
      { type: 'Tablet', strength: '40 mg', factor: 40, unit: 'tablet' },
      { type: 'Tablet', strength: '50 mg', factor: 50, unit: 'tablet' },
      { type: 'Liquid', strength: '10 mg / mL solution', factor: 10, unit: 'mL' }
    ]
  },
  {
    id: 'diazepam',
    name: 'Diazepam (Valium)',
    generic: 'Diazepam',
    h2: 'Diazepam (Valium) Anti-Anxiety and Seizure Dosage for Dogs',
    description: 'A fast-acting benzodiazepine sedative used to manage acute anxiety, noise phobias, active seizures (status epilepticus), and to stimulate appetite. Highly searched as Valium for dogs, diazepam dog dose, or canine seizure control.',
    category: 'Anxiety & Sedation',
    frequency: 'Given as a single dose for situational events, or every 8 to 12 hours under veterinary guidance.',
    duration: 'Typically limited to short-term or situational use because dogs can develop tolerance.',
    byWeightText: 'Oral dose ranges from 0.1 to 0.22 mg per pound of body weight (0.22 to 0.5 mg/kg) as needed for anxiety or sedation.',
    safetyNotes: 'Class IV controlled substance. Can cause sedation, unsteadiness, or paradoxically increased activity/aggression in some dogs. Avoid abrupt discontinuation if used for seizure management. Highly restricted and must be strictly monitored by a vet.',
    warningColor: 'red',
    prescriptionRequired: true,
    supervisionLevel: 'Strict Clinical Only',
    dosePerLbMin: 0.1,
    dosePerLbMax: 0.22,
    dosePerKgMin: 0.22,
    dosePerKgMax: 0.5,
    formulations: [
      { type: 'Tablet', strength: '2 mg', factor: 2, unit: 'tablet' },
      { type: 'Tablet', strength: '5 mg', factor: 5, unit: 'tablet' },
      { type: 'Tablet', strength: '10 mg', factor: 10, unit: 'tablet' }
    ]
  },
  {
    id: 'atipamezole',
    name: 'Atipamezole (Antisedan)',
    generic: 'Atipamezole Hydrochloride',
    h2: 'Atipamezole (Antisedan) Sedation Reversal Guide for Dogs',
    description: 'A highly selective alpha-2 adrenergic antagonist used exclusively in veterinary clinics to completely reverse the sedative, analgesic, and cardiovascular effects of Dexmedetomidine. Highly searched as Antisedan for dogs, atipamezole dose in mL, and clinical sedation reversal.',
    category: 'Anesthetic & Sedative',
    frequency: 'Administered strictly as a single intramuscular (IM) injection by a veterinarian.',
    duration: 'Reversal of profound sedation typically occurs within 5 to 10 minutes of intramuscular injection.',
    byWeightText: 'Dosed proportionally to the volume of Dexmedetomidine administered, but typically ranges from 113 to 227 mcg per pound of body weight (250 to 500 mcg/kg).',
    safetyNotes: 'CRITICAL: Professional, in-clinic veterinary use ONLY. Not for home administration. Can cause rapid arousal, transient excitement, or minor vomiting. Ensure the patient is in a quiet, safe environment during recovery to prevent startled reactions.',
    warningColor: 'red',
    prescriptionRequired: true,
    supervisionLevel: 'Strict Clinical Only',
    dosePerLbMin: 0.113,
    dosePerLbMax: 0.227,
    dosePerKgMin: 0.25,
    dosePerKgMax: 0.5,
    formulations: [
      { type: 'Liquid', strength: '5 mg / mL (Antisedan Injectable)', factor: 5, unit: 'mL' }
    ]
  },
  {
    id: 'clindamycin',
    name: 'Clindamycin (Antirobe)',
    generic: 'Clindamycin Hydrochloride',
    h2: 'Clindamycin Antibiotic Dosage and Dental Guide for Dogs',
    description: 'A lincosamide antibiotic highly effective against dental infections, bone infections (osteomyelitis), deep wounds, and abscesses in dogs. Commonly searched as Antirobe for dogs, clindamycin dog dosage, or dental antibiotic for canines.',
    category: 'Antibiotic',
    frequency: 'Administered once daily (every 24 hours) or divided every 12 hours.',
    duration: 'Typically given for 7 to 14 days; dental or bone infections can require up to 28 days of therapy. Complete the full course.',
    byWeightText: 'Standard clinical dosage is 2.5 to 5.0 mg per pound of body weight (5.5 to 11 mg/kg) every 12 hours.',
    safetyNotes: 'May cause gastrointestinal upset (soft stools, vomiting, diarrhea). It is highly recommended to give with food to minimize stomach upset. Liquid formulations have an extremely bitter taste; do not force if causing hypersalivation.',
    warningColor: 'blue',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    dosePerLbMin: 2.5,
    dosePerLbMax: 5.0,
    dosePerKgMin: 5.5,
    dosePerKgMax: 11.0,
    formulations: [
      { type: 'Capsule', strength: '25 mg', factor: 25, unit: 'capsule' },
      { type: 'Capsule', strength: '75 mg', factor: 75, unit: 'capsule' },
      { type: 'Capsule', strength: '150 mg', factor: 150, unit: 'capsule' },
      { type: 'Capsule', strength: '300 mg', factor: 300, unit: 'capsule' },
      { type: 'Liquid', strength: '25 mg / mL liquid', factor: 25, unit: 'mL' }
    ]
  },
  {
    id: 'fluconazole',
    name: 'Fluconazole (Diflucan)',
    generic: 'Fluconazole',
    h2: 'Fluconazole Antifungal Dosage for Dogs',
    description: 'A systemic triazole antifungal medication used to treat serious fungal infections such as valley fever (coccidioidomycosis), yeast infections (Malassezia), ringworm, and blastomycosis in dogs. Highly searched as fluconazole dog dosage, valley fever treatment, or Diflucan for dogs.',
    category: 'Antibiotic',
    frequency: 'Given once daily (every 24 hours) or divided twice daily.',
    duration: 'Fungal therapies are long-term; typically lasting from 2 months up to a year, or even life-long for some chronic valley fever patients.',
    byWeightText: 'Standard clinical dose is 2.27 to 4.54 mg per pound of body weight (5 to 10 mg/kg) once daily.',
    safetyNotes: 'Can cause decreased appetite, vomiting, or elevated liver enzymes. Periodic liver function blood work is essential during long-term therapy. Use with extreme caution in dogs with pre-existing liver or kidney dysfunction.',
    warningColor: 'yellow',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    dosePerLbMin: 2.27,
    dosePerLbMax: 4.54,
    dosePerKgMin: 5.0,
    dosePerKgMax: 10.0,
    formulations: [
      { type: 'Tablet', strength: '50 mg', factor: 50, unit: 'tablet' },
      { type: 'Tablet', strength: '100 mg', factor: 100, unit: 'tablet' },
      { type: 'Tablet', strength: '150 mg', factor: 150, unit: 'tablet' },
      { type: 'Tablet', strength: '200 mg', factor: 200, unit: 'tablet' }
    ]
  },
  {
    id: 'selamectin',
    name: 'Selamectin (Revolution)',
    generic: 'Selamectin',
    h2: 'Selamectin Topical Pipette Dosage and Guide for Dogs',
    description: 'A topical broad-spectrum parasiticide used monthly to control and prevent heartworm, fleas, ear mites, sarcoptic mange, and American dog ticks in dogs. Commonly searched as Revolution for dogs, selamectin pipette dosage, or monthly spot-on dewormer.',
    category: 'Parasiticide',
    frequency: 'Applied topically behind the neck once every 30 days (monthly).',
    duration: 'Recommended year-round for comprehensive flea, tick, and heartworm preventative coverage.',
    byWeightText: 'Dosed at a standard rate of 2.7 mg per pound of body weight (6.0 mg/kg) applied topically.',
    safetyNotes: 'External topical use only. Do not apply to wet or broken skin. Ensure the dog cannot lick the site until fully dry. Highly safe, but some dogs may experience temporary hair loss or mild skin irritation at the application site. Safe for Collies and other herding breeds.',
    warningColor: 'blue',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    dosePerLbMin: 2.7,
    dosePerLbMax: 2.7,
    dosePerKgMin: 6.0,
    dosePerKgMax: 6.0,
    formulations: [
      { type: 'Spot-On', strength: '15 mg (Kitten/Puppy Mauve)', factor: 15, unit: 'pipette' },
      { type: 'Spot-On', strength: '30 mg (Small Dog Purple)', factor: 30, unit: 'pipette' },
      { type: 'Spot-On', strength: '60 mg (Medium Dog Brown)', factor: 60, unit: 'pipette' },
      { type: 'Spot-On', strength: '120 mg (Large Dog Red)', factor: 120, unit: 'pipette' },
      { type: 'Spot-On', strength: '240 mg (Extra Large Dog Plum)', factor: 240, unit: 'pipette' }
    ]
  },
  {
    id: 'fluralaner',
    name: 'Fluralaner (Bravecto)',
    generic: 'Fluralaner',
    h2: 'Fluralaner (Bravecto) 12-Week Flea & Tick Chewable Dosage for Dogs',
    description: 'An advanced systemic ectoparasiticide that provides up to 12 consecutive weeks of protection against fleas and ticks in a single flavored chewable tablet. Highly searched as Bravecto for dogs, fluralaner chewable dosage, or 3-month flea pill.',
    category: 'Parasiticide',
    frequency: 'Administered orally once every 12 weeks (approx. 3 months).',
    duration: 'Used year-round for continuous protection against fleas, black-legged ticks, American dog ticks, and brown dog ticks.',
    byWeightText: 'Clinical dosage targets a minimum dose of 11.4 mg per pound of body weight (25 mg/kg) administered with food.',
    safetyNotes: 'Must be administered with or immediately after a meal to ensure proper systemic absorption. Use with caution in dogs with a history of seizures or neurological disorders. Do not use in puppies under 6 months of age or weighing less than 4.4 lbs (2.0 kg).',
    warningColor: 'yellow',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    dosePerLbMin: 11.4,
    dosePerLbMax: 11.4,
    dosePerKgMin: 25.0,
    dosePerKgMax: 25.0,
    formulations: [
      { type: 'Chewable', strength: '112.5 mg Chewable (Very Small Dog)', factor: 112.5, unit: 'chewable' },
      { type: 'Chewable', strength: '250 mg Chewable (Small Dog)', factor: 250, unit: 'chewable' },
      { type: 'Chewable', strength: '500 mg Chewable (Medium Dog)', factor: 500, unit: 'chewable' },
      { type: 'Chewable', strength: '1000 mg Chewable (Large Dog)', factor: 1000, unit: 'chewable' },
      { type: 'Chewable', strength: '1400 mg Chewable (Extra Large Dog)', factor: 1400, unit: 'chewable' }
    ]
  },
  {
    id: 'metoclopramide',
    name: 'Metoclopramide (Reglan)',
    generic: 'Metoclopramide Hydrochloride',
    h2: 'Metoclopramide Anti-Emetic & Gastrointestinal Motility Dosage for Dogs',
    description: 'A prokinetic agent and anti-nausea medication used to prevent vomiting, manage acid reflux, and stimulate gastric emptying in dogs with sluggish gut motility. Commonly searched as Reglan for dogs, metoclopramide dog dose, or acid reflux prokinetic.',
    category: 'Gastrointestinal',
    frequency: 'Administered every 6 to 8 hours (3 to 4 times per day) 30 minutes before feeding.',
    duration: 'Typically used short-term (3 to 5 days) for acute gastrointestinal disorders, or long-term for chronic gastric stasis.',
    byWeightText: 'Standard clinical dosage is 0.1 to 0.22 mg per pound of body weight (0.22 to 0.5 mg/kg) administered orally.',
    safetyNotes: 'CRITICAL: Never administer to a dog with a suspected gastrointestinal obstruction, foreign body, or stomach hemorrhage, as stimulating gut motility can cause fatal rupture. May cause mild sedation or paradoxical hyperactivity/restlessness (incoordination).',
    warningColor: 'red',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    dosePerLbMin: 0.1,
    dosePerLbMax: 0.22,
    dosePerKgMin: 0.22,
    dosePerKgMax: 0.5,
    formulations: [
      { type: 'Tablet', strength: '5 mg', factor: 5, unit: 'tablet' },
      { type: 'Tablet', strength: '10 mg', factor: 10, unit: 'tablet' },
      { type: 'Liquid', strength: '1 mg / mL syrup', factor: 1, unit: 'mL' }
    ]
  },
  {
    id: 'insulin',
    name: 'Insulin (Vetsulin / NPH)',
    generic: 'Porcine Insulin Zinc / Isophane Insulin',
    h2: 'Insulin Guidelines and Syringe Selection for Diabetic Dogs',
    description: 'An injectable pancreatic hormone replacement therapy used to treat canine diabetes mellitus by regulating blood glucose levels. Commonly searched as Vetsulin for dogs, NPH insulin dog dosage, or diabetic dog blood sugar guide.',
    category: 'Endocrine & Chronic Care',
    frequency: 'Administered subcutaneously (under the skin) strictly every 12 hours (twice daily) immediately after feeding.',
    duration: 'Lifelong daily therapy, requiring periodic blood glucose curves and dose adjustments by a veterinarian.',
    byWeightText: 'Dosing is highly individualized and NOT strictly linear by weight. Typical starting dose is a conservative 0.1 to 0.22 Units per pound (0.25 to 0.5 U/kg) twice daily, carefully adjusted.',
    safetyNotes: 'CRITICAL HIGH-ALERT MEDICATION: High risk of life-threatening hypoglycemia (severe low blood sugar). If your dog is weak, wobbly, glassy-eyed, or has seizures, rub Karo syrup/honey on their gums immediately and contact an emergency vet. Vetsulin requires U-40 syringes; human NPH requires U-100 syringes. Never mix syringe or needle types.',
    warningColor: 'red',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    isWeightIndependent: true,
    formulations: [
      { type: 'Liquid', strength: '40 Units / mL (U-40 Vetsulin)', factor: 40, unit: 'mL' },
      { type: 'Liquid', strength: '100 Units / mL (U-100 Humulin N)', factor: 100, unit: 'mL' }
    ]
  },
  {
    id: 'amlodipine',
    name: 'Amlodipine (Norvasc)',
    generic: 'Amlodipine Besylate',
    h2: 'Amlodipine Blood Pressure Dosage for Dogs',
    description: 'A calcium channel blocker used primarily to manage severe systemic hypertension (high blood pressure) or congestive heart failure in dogs. Often secondary to chronic kidney disease.',
    category: 'Endocrine & Chronic Care',
    frequency: 'Administered once daily (every 24 hours).',
    duration: 'Chronic lifelong treatment. Blood pressure must be monitored regularly by your veterinarian.',
    byWeightText: 'Standard canine dosage is 0.02 to 0.05 mg per pound of body weight (0.05 to 0.1 mg/kg) once daily, though can be titrated higher under strict guidance.',
    safetyNotes: 'Monitor for signs of abnormally low blood pressure (hypotension) such as profound lethargy, weakness, or fainting. Give with or without food. Do not stop administration suddenly as this can cause dangerous rebound hypertension.',
    warningColor: 'yellow',
    prescriptionRequired: true,
    supervisionLevel: 'Prescription',
    dosePerLbMin: 0.02,
    dosePerLbMax: 0.05,
    dosePerKgMin: 0.05,
    dosePerKgMax: 0.1,
    formulations: [
      { type: 'Tablet', strength: '1.25 mg (Veterinary Compounded)', factor: 1.25, unit: 'tablet' },
      { type: 'Tablet', strength: '2.5 mg', factor: 2.5, unit: 'tablet' },
      { type: 'Tablet', strength: '5 mg', factor: 5, unit: 'tablet' }
    ]
  }
];
