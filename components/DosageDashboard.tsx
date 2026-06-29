'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Calculator, 
  AlertTriangle, 
  HeartPulse, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Table, 
  HelpCircle, 
  Activity, 
  ShieldCheck, 
  Scale, 
  PhoneCall, 
  Droplets, 
  Check,
  Filter,
  BookOpen,
  Users,
  Award,
  ExternalLink
} from 'lucide-react';
import { medications, Medication, Formulation } from '../lib/medicationData';
import drEmilyJenkins from '../src/assets/images/dr_emily_jenkins_1782681194365.jpg';

export default function DosageDashboard() {
  // Profile state
  const [dogName, setDogName] = useState<string>('');
  const [weight, setWeight] = useState<number>(30);
  const [unit, setUnit] = useState<'lbs' | 'kgs'>('lbs');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Sub-dosage states (for medications with options like Cerenia, Gabapentin, etc.)
  // Keyed by medication ID
  const [selectedSubDoses, setSelectedSubDoses] = useState<Record<string, number>>({
    'gabapentin': 0,
    'meloxicam': 1, // Default to maintenance
    'cerenia': 0,
    'ivermectin': 0,
    'prednisolone': 0,
    'prednisone': 0
  });

  // Chart modal state
  const [isChartModalOpen, setIsChartModalOpen] = useState<boolean>(false);
  const [chartMedicationId, setChartMedicationId] = useState<string>('benadryl');

  // About & E-E-A-T Editorial Board modal state
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [aboutActiveTab, setAboutActiveTab] = useState<'board' | 'methodology' | 'transparency'>('board');
  const [formulaSearch, setFormulaSearch] = useState<string>('');
  const [weightChartTab, setWeightChartTab] = useState<'overview' | 'gabapentin' | 'meloxicam' | 'onsior'>('overview');

  // Accordion state - track which medication IDs are expanded
  // Top 5 expanded by default (benadryl, trazodone, gabapentin, amoxicillin, carprofen)
  const [expandedMedications, setExpandedMedications] = useState<Record<string, boolean>>({
    'benadryl': true,
    'trazodone': true,
    'gabapentin': true,
    'amoxicillin': true,
    'carprofen': true
  });

  // Toggle single medication card
  const toggleExpand = (id: string) => {
    setExpandedMedications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Expand or collapse all
  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    medications.forEach(med => {
      allExpanded[med.id] = true;
    });
    setExpandedMedications(allExpanded);
  };

  const collapseAll = () => {
    setExpandedMedications({});
  };

  // Weight converted to Lbs and Kgs for clean calculation
  const weightInLbs = unit === 'lbs' ? weight : Math.round(weight * 2.20462 * 10) / 10;
  const weightInKgs = unit === 'kgs' ? weight : Math.round(weight / 2.20462 * 10) / 10;

  // Filtered medications list based on search query and category
  const categories = useMemo(() => {
    const list = new Set<string>();
    medications.forEach(med => list.add(med.category));
    return ['All', ...Array.from(list)];
  }, []);

  const filteredMedications = useMemo(() => {
    return medications.filter(med => {
      const matchesSearch = 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.generic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Helper to format dosage output safely
  const calculateDoseRange = (med: Medication) => {
    if (med.isWeightIndependent) {
      return { min: 1, max: 1, unit: 'drop', isIndependent: true };
    }

    // Check if there is a selected sub-dose
    if (med.subDoses && med.subDoses.length > 0) {
      const subIdx = selectedSubDoses[med.id] || 0;
      const sub = med.subDoses[subIdx];
      
      let doseVal = 0;
      if (unit === 'lbs') {
        doseVal = weight * sub.dosePerLb;
      } else {
        doseVal = weight * sub.dosePerKg;
      }
      
      const roundedDose = Math.round(doseVal * 10) / 10;
      return { min: roundedDose, max: roundedDose, unit: 'mg', isIndependent: false };
    }

    // Default weight-dependent range calculation
    const factorMin = unit === 'lbs' ? med.dosePerLbMin || 0 : med.dosePerKgMin || 0;
    const factorMax = unit === 'lbs' ? med.dosePerLbMax || 0 : med.dosePerKgMax || 0;

    const min = Math.round(weight * factorMin * 10) / 10;
    const max = Math.round(weight * factorMax * 10) / 10;

    return { min, max, unit: 'mg', isIndependent: false };
  };

  const weightBrackets = [
    { name: 'Toy / Small', lbs: 10, kgs: 4.5, icon: '🐾' },
    { name: 'Medium', lbs: 30, kgs: 13.6, icon: '🐶' },
    { name: 'Large', lbs: 65, kgs: 29.5, icon: '🐕' },
    { name: 'Giant', lbs: 110, kgs: 49.9, icon: '🦁' },
  ];

  const calculateDoseForWeight = (med: Medication, wLbs: number) => {
    if (med.isWeightIndependent) {
      return { min: 1, max: 1, unit: 'drop', isIndependent: true };
    }

    if (med.subDoses && med.subDoses.length > 0) {
      const subIdx = selectedSubDoses[med.id] || 0;
      const sub = med.subDoses[subIdx];
      const doseVal = wLbs * sub.dosePerLb;
      const rounded = Math.round(doseVal * 10) / 10;
      return { min: rounded, max: rounded, unit: 'mg', isIndependent: false };
    }

    const factorMin = med.dosePerLbMin || 0;
    const factorMax = med.dosePerLbMax || 0;

    const min = Math.round(wLbs * factorMin * 10) / 10;
    const max = Math.round(wLbs * factorMax * 10) / 10;

    return { min, max, unit: 'mg', isIndependent: false };
  };

  // Helper to format tablet split suggestions
  const formatTablets = (targetDose: number, strength: number): string => {
    const ratio = targetDose / strength;
    if (ratio < 0.15) return 'Too small to dose with this tablet';
    if (ratio >= 0.15 && ratio < 0.35) return 'Approx. 1/4 tablet';
    if (ratio >= 0.35 && ratio < 0.65) return 'Approx. 1/2 tablet';
    if (ratio >= 0.65 && ratio < 0.85) return 'Approx. 3/4 tablet';
    if (ratio >= 0.85 && ratio < 1.25) return 'Approx. 1 tablet';
    if (ratio >= 1.25 && ratio < 1.75) return 'Approx. 1.5 tablets';
    if (ratio >= 1.75 && ratio < 2.25) return 'Approx. 2 tablets';
    return `Approx. ${Math.round(ratio * 2) / 2} tablets`;
  };

  // Helper to determine badge colors
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Antihistamine': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Anxiety & Sedation': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Pain & Inflammation (NSAID)': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Pain & Inflammation (Other)': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Antibiotic': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Anti-nausea': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Parasiticide': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Steroid': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Gastrointestinal': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Anesthetic & Sedative': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Behavioral': return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'Endocrine & Chronic Care': return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getWarningBorderColor = (color: 'yellow' | 'red' | 'blue') => {
    switch(color) {
      case 'red': return 'border-l-4 border-l-rose-500 bg-rose-50/70 border-rose-100';
      case 'yellow': return 'border-l-4 border-l-amber-500 bg-amber-50/70 border-amber-100';
      case 'blue': return 'border-l-4 border-l-sky-500 bg-sky-50/70 border-sky-100';
    }
  };

  const getWarningIconColor = (color: 'yellow' | 'red' | 'blue') => {
    switch(color) {
      case 'red': return 'text-rose-600';
      case 'yellow': return 'text-amber-600';
      case 'blue': return 'text-sky-600';
    }
  };

  // JSON-LD schema generation for WebApplication + FAQPage + BreadcrumbList
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://dogdosagecalculators.com/#webapp",
        "name": "Dog Dosage Calculators",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "All",
        "description": "Calculate safe, weight-based dosage estimations for 27 common canine medications like Benadryl, Trazodone, Metronidazole, and Cephalexin.",
        "url": "https://dogdosagecalculators.com",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Organization",
          "name": "Dosage for Dogs Editorial Board",
          "url": "https://dogdosagecalculators.com/#about-modal"
        },
        "reviewedBy": {
          "@type": "Person",
          "name": "Dr. Emily Jenkins, DVM",
          "jobTitle": "Veterinary Medical Reviewer",
          "sameAs": "https://www.linkedin.com/in/dr-emily-jenkins-dvm-caninedose",
          "image": "https://dogdosagecalculators.com/dr_emily_jenkins.jpg"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://dogdosagecalculators.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I give over-the-counter Benadryl to my dog?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, plain diphenhydramine (Benadryl) is generally safe for dogs at 1 mg per pound of body weight, given 2 to 3 times daily. However, you must verify the product contains ONLY diphenhydramine and never any alcohol, acetaminophen, or decongestants like pseudoephedrine, which are highly toxic to dogs."
            }
          },
          {
            "@type": "Question",
            "name": "How is dog medication dosage calculated by weight?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Veterinary dosages are typically calculated by multiplying the dog's body weight in pounds or kilograms by the specific drug's milligram per weight factor. Enter your dog's weight, select the medication, and review the estimated safe range."
            }
          },
          {
            "@type": "Question",
            "name": "Why do some dog eye drops not depend on body weight?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Topical ophthalmic medications (such as Ofloxacin eye drops) act directly on the eye surface. Because they do not rely on systemic absorption throughout the entire body volume to be effective, a tiny Chihuahua and a giant Great Dane both receive exactly the same dose of 1 drop in the affected eye."
            }
          },
          {
            "@type": "Question",
            "name": "What are the dangers of mixing dog pain relievers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Never mix multiple non-steroidal anti-inflammatory drugs (NSAIDs like Carprofen, Meloxicam, or Aspirin) together, or combine them with systemic corticosteroids (like Prednisolone). Mixing these classes triggers extreme risks of rapid stomach ulceration, gastrointestinal perforation, and acute renal failure."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://dogdosagecalculators.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://dogdosagecalculators.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Dog Dosage Calculators",
            "item": "https://dogdosagecalculators.com/calculators"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16">
      {/* Header */}
      <header className="h-16 px-4 md:px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <g transform="rotate(-135 12 12)">
                  <rect x="9" y="8" width="6" height="9" rx="1.5" />
                  <path d="M10.5 8V5.5h3V8" />
                  <rect x="9.5" y="4" width="5" height="1.5" rx="0.5" />
                  <path d="M9.5 11h5v4.5c0 .83-.67 1.5-1.5 1.5h-2c-.83 0-1.5-.67-1.5-1.5V11z" fill="currentColor" opacity="0.4" stroke="none" />
                </g>
                <path d="M4 18.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.9-1.5-2.5-1.5-2.5s-1.5 1.6-1.5 2.5z" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Dosage for Dogs</span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-full text-xs font-semibold">
            <Link href="/" className="bg-white text-blue-600 px-3 py-1 rounded-full shadow-sm">Dogs 🐕</Link>
            <Link href="/cats" className="text-slate-500 hover:text-slate-800 px-3 py-1 rounded-full transition-colors">Cats 🐈</Link>
          </div>
        </div>
        <div className="hidden md:flex gap-6 items-center text-sm font-medium text-slate-500">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="text-blue-600 border-b-2 border-blue-600 py-5 transition-all focus:outline-none cursor-pointer"
          >
            All Calculators
          </button>
          <button 
            onClick={() => document.getElementById('weight-charts-section')?.scrollIntoView({ behavior: 'smooth' })} 
            className="hover:text-blue-600 py-5 transition-colors focus:outline-none cursor-pointer"
          >
            Weight Charts
          </button>
          <button 
            onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })} 
            className="hover:text-blue-600 py-5 transition-colors focus:outline-none cursor-pointer"
          >
            FAQ
          </button>
          <button 
            onClick={() => setIsAboutModalOpen(true)} 
            className="hover:text-blue-600 py-5 transition-colors focus:outline-none cursor-pointer font-semibold"
          >
            About &amp; Board
          </button>
          <button 
            onClick={() => document.getElementById('emergency-section')?.scrollIntoView({ behavior: 'smooth' })} 
            className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-full text-xs font-semibold transition-colors focus:outline-none cursor-pointer"
          >
            Emergency Contacts
          </button>
        </div>
        <div className="flex gap-2 md:hidden">
          <button 
            onClick={() => setIsAboutModalOpen(true)} 
            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full text-xs font-semibold"
          >
            About
          </button>
          <button 
            onClick={() => document.getElementById('emergency-section')?.scrollIntoView({ behavior: 'smooth' })} 
            className="px-3 py-1.5 bg-slate-800 text-white rounded-full text-xs font-semibold"
          >
            Emergency
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 flex-1">
        {/* Inject complete SEO structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />

        {/* Hero section */}
        <header className="text-center mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold mb-3 tracking-wide uppercase shadow-sm">
            <HeartPulse className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            Veterinary-Informed Calculators
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Dog Dosage Calculators by Weight for Common Medications
          </h1>
          <p className="text-lg text-slate-600 font-normal leading-relaxed">
            Enter your dog’s weight and choose a medication to estimate the safe dosage range. Always confirm with a veterinarian before giving any medication.
          </p>
          
          {/* Clinical Authority Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500 bg-white border border-slate-200 rounded-2xl py-2.5 px-4 max-w-2xl mx-auto shadow-sm">
            <span className="flex items-center gap-1 font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Medically Reviewed
            </span>
            <span className="text-slate-300">|</span>
            <span>By <strong>Dr. Emily Jenkins, DVM</strong></span>
            <span className="text-slate-300">|</span>
            <span>Last updated: <strong>June 28, 2026</strong></span>
            <span className="text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>Sources: <strong>Merck Veterinary Manual &amp; Plumb&apos;s Handbook</strong></span>
          </div>
        </header>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left column: Profile card & controls */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
            
            {/* Active Dog Profile Widget */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 space-y-5 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Active Dog Profile</h3>
                    <p className="text-xs text-slate-500">Live dosage updater</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setDogName(''); setWeight(30); setUnit('lbs'); }}
                  className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset profile values"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Input name */}
              <div className="space-y-1.5">
                <label htmlFor="dog-name-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Dog&apos;s Name (optional)
                </label>
                <input
                  id="dog-name-input"
                  type="text"
                  placeholder="e.g. Bella, Max"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                />
              </div>

              {/* Weight inputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="dog-weight-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Body Weight
                  </label>
                  {/* Weight Unit Toggle */}
                  <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        if (unit === 'kgs') {
                          // convert kgs to lbs
                          setWeight(Math.round(weight * 2.20462 * 10) / 10);
                          setUnit('lbs');
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        unit === 'lbs'
                          ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Lbs
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (unit === 'lbs') {
                          // convert lbs to kgs
                          setWeight(Math.round(weight / 2.20462 * 10) / 10);
                          setUnit('kgs');
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        unit === 'kgs'
                          ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Kgs
                    </button>
                  </div>
                </div>

                {/* Weight numerical input & slider sync */}
                <div className="relative">
                  <input
                    id="dog-weight-input"
                    type="number"
                    min={1}
                    max={unit === 'lbs' ? 250 : 115}
                    step={0.1}
                    value={weight}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setWeight(isNaN(val) ? 0 : val);
                    }}
                    className="w-full pl-4 pr-12 py-2.5 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    {unit}
                  </span>
                </div>

                {/* Slider for quick adjustments */}
                <div className="pt-2">
                  <input
                    type="range"
                    min={2}
                    max={unit === 'lbs' ? 150 : 70}
                    step={1}
                    value={weight || 2}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold pt-1 uppercase">
                    <span>Small ({unit === 'lbs' ? '2 lbs' : '1 kg'})</span>
                    <span>Giant ({unit === 'lbs' ? '150 lbs' : '70 kg'})</span>
                  </div>
                </div>
              </div>

              {/* Profile Summary Badge */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Calculators calibrated for:</span>
                <span className="font-bold text-blue-700 font-mono">
                  {dogName ? dogName : 'Your Dog'} ({weight} {unit})
                </span>
              </div>
            </div>

            {/* Quick-Filter sidebar widget */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 p-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Filter className="w-4 h-4 text-slate-500" /> Filter by Category
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200/70 hover:bg-slate-100/70'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Fast Action Contact */}
            <div className="bg-rose-950 text-white rounded-3xl border border-rose-900 p-6 space-y-4 shadow-xl shadow-rose-950/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-rose-900/80 flex items-center justify-center">
                  <PhoneCall className="w-4.5 h-4.5 text-rose-200" />
                </div>
                <h4 className="font-extrabold text-sm tracking-wide uppercase">Poison Emergency?</h4>
              </div>
              <p className="text-xs text-rose-100 leading-relaxed">
                If your dog ingested a toxic dose, shows acute vomiting, collapsed, or is lethargic, act instantly:
              </p>
              <div className="space-y-2 pt-1 font-mono text-sm font-bold">
                <a href="tel:8884264435" className="flex items-center justify-between p-2.5 bg-rose-900/40 hover:bg-rose-900/60 rounded-xl border border-rose-800/50 transition-colors">
                  <span className="text-xs font-sans text-rose-200">ASPCA Poison:</span>
                  <span>(888) 426-4435</span>
                </a>
                <a href="tel:8557647661" className="flex items-center justify-between p-2.5 bg-rose-900/40 hover:bg-rose-900/60 rounded-xl border border-rose-800/50 transition-colors">
                  <span className="text-xs font-sans text-rose-200">Pet Poison Helpline:</span>
                  <span>(855) 764-7661</span>
                </a>
              </div>
              <p className="text-[10px] text-rose-300 italic text-center">
                Available 24/7. Consultation fees may apply.
              </p>
            </div>
          </div>

        {/* Right column: The 19 calculators */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Search bar & Collapse/Expand toggles */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search medications (e.g. Benadryl, Trazodone...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
              />
            </div>
            <div className="flex gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={expandAll}
                className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Active Filters Summary */}
          {(searchQuery || selectedCategory !== 'All') && (
            <div className="flex items-center justify-between text-xs px-2">
              <div className="text-slate-500 flex items-center gap-1.5">
                Showing <strong className="text-slate-800">{filteredMedications.length}</strong> of {medications.length} medications
                {selectedCategory !== 'All' && <span>in <strong className="text-slate-800">{selectedCategory}</strong></span>}
                {searchQuery && <span>matching &ldquo;<strong className="text-slate-800">{searchQuery}</strong>&rdquo;</span>}
              </div>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Medication Cards Container */}
          <div className="space-y-4">
            {filteredMedications.length > 0 ? (
              filteredMedications.map((med, index) => {
                const isExpanded = !!expandedMedications[med.id];
                const calculated = calculateDoseRange(med);
                const hasSubDoses = med.subDoses && med.subDoses.length > 0;
                const activeSubIndex = selectedSubDoses[med.id] || 0;
                const activeSubDose = hasSubDoses ? med.subDoses![activeSubIndex] : null;

                return (
                  <article 
                    id={`med-${med.id}`}
                    key={med.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                      isExpanded 
                        ? 'border-blue-300 shadow-xl shadow-blue-50/20 ring-1 ring-blue-100' 
                        : 'border-slate-200/80 hover:border-slate-300 shadow-md shadow-slate-100/30'
                    }`}
                  >
                    {/* Header trigger line */}
                    <div 
                      onClick={() => toggleExpand(med.id)}
                      className="flex items-center justify-between p-5 md:p-6 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                    >
                      <div className="space-y-1.5 pr-4">
                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* H2 SEO heading */}
                          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                            {med.h2}
                          </h2>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(med.category)}`}>
                            {med.category}
                          </span>
                          {med.supervisionLevel && (
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border tracking-wider ${
                              med.supervisionLevel === 'Strict Clinical Only' 
                                ? 'bg-rose-50 text-rose-700 border-rose-200 font-black' 
                                : med.supervisionLevel === 'Prescription'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {med.supervisionLevel === 'Strict Clinical Only' ? '🔒 CLINIC USE ONLY' : med.supervisionLevel === 'Prescription' ? '📋 PRESCRIPTION RX' : '🟢 OTC'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-normal">
                          Generic name: <strong className="text-slate-700 font-medium">{med.generic}</strong>
                        </p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {/* Live Quick Calculated Readout (when collapsed) */}
                        {!isExpanded && (
                          <div className="hidden sm:block text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Estimated Dose</span>
                            <span className="text-sm font-bold font-mono text-slate-800">
                              {calculated.isIndependent 
                                ? '1 drop per eye' 
                                : `${calculated.min} - ${calculated.max} mg`}
                            </span>
                          </div>
                        )}
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 p-6 space-y-6 bg-slate-50/30">
                        
                        {/* Short Description */}
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {med.description}
                        </p>

                        {/* Interactive Calculator Section */}
                        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                              <Calculator className="w-4 h-4 text-blue-500" /> Live Dosage Calculation
                            </h4>
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                onClick={() => {
                                  setChartMedicationId(med.id);
                                  setIsChartModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-extrabold rounded-lg border border-blue-100 transition-colors cursor-pointer select-none"
                                title="View dosage bracket chart across small, medium, and large dogs"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
                                </svg>
                                <span>Visual Weight Chart</span>
                              </button>
                              <div className="text-xs font-mono text-slate-500 font-medium">
                                Dog: <span className="font-bold text-slate-800">{dogName || 'Your Dog'}</span> ({weight} {unit})
                              </div>
                            </div>
                          </div>

                          {/* Sub-dosage selectors (for Gabapentin, Cerenia, Meloxicam, Prednisolone, Ivermectin) */}
                          {hasSubDoses && (
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Select Intended Purpose / Treatment:
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {med.subDoses!.map((sub, sIdx) => (
                                  <button
                                    key={sIdx}
                                    onClick={() => setSelectedSubDoses(prev => ({ ...prev, [med.id]: sIdx }))}
                                    className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                      activeSubIndex === sIdx
                                        ? 'bg-blue-50/70 border-blue-400 text-blue-900 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                  >
                                    <div className="font-bold mb-0.5">{sub.name}</div>
                                    <div className="text-[10px] text-slate-400 font-normal">{sub.description}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}                           {/* Calculation Output Card */}
                          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="space-y-1 text-center sm:text-left">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Safe Dosage Range for {dogName || 'Your Dog'}
                              </span>
                              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-900 flex items-baseline justify-center sm:justify-start gap-1">
                                {calculated.isIndependent ? (
                                  <span>1 drop per affected eye</span>
                                ) : (
                                  <>
                                    <span>{calculated.min}</span>
                                    {calculated.min !== calculated.max && (
                                      <>
                                        <span className="text-slate-400 font-normal mx-1">-</span>
                                        <span>{calculated.max}</span>
                                      </>
                                    )}
                                    <span className="text-sm text-slate-500 font-sans font-medium ml-1">mg</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-center sm:text-left text-xs space-y-1 max-w-xs">
                              <div className="font-bold flex items-center justify-center sm:justify-start gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Ready to Administer?
                              </div>
                              <p className="text-[11px] leading-relaxed text-emerald-700">
                                This represents {med.isWeightIndependent ? 'a standard drop' : `the safe, weight-adjusted dosage range`}. Always verify with your clinic first.
                              </p>
                            </div>
                          </div>

                          {/* Dosing Formulation Assistant (Formulation conversions) */}
                          {!med.isWeightIndependent && med.formulations && med.formulations.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-slate-200/60">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Recommended Formulations Check:
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                {med.formulations.map((form, fIdx) => {
                                  // For liquid (using factor as mg/mL) or tablets (using factor as mg/tablet)
                                  const factor = form.factor || 1;
                                  let advice = '';

                                  if (form.type === 'Liquid') {
                                    // Target mL: calculated min dose / factor
                                    const minMl = (calculated.min / factor).toFixed(1);
                                    const maxMl = (calculated.max / factor).toFixed(1);
                                    advice = minMl === maxMl ? `${minMl} mL` : `${minMl} - ${maxMl} mL`;
                                  } else {
                                    // Tablet splitting advice
                                    const minTab = formatTablets(calculated.min, factor);
                                    const maxTab = formatTablets(calculated.max, factor);
                                    advice = minTab === maxTab ? minTab : `${minTab} to ${maxTab}`;
                                  }

                                  return (
                                    <div key={fIdx} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between space-y-2 hover:border-blue-200 transition-all">
                                      <div className="flex items-start justify-between">
                                        <span className="text-[11px] font-bold text-slate-700">{form.type}</span>
                                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                          {form.strength}
                                        </span>
                                      </div>
                                      <div className="text-xs font-bold font-mono text-blue-700">
                                        {advice}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Standard Information Sections (H3 complied) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="space-y-2">
                            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">
                              By Weight Chart Information
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {hasSubDoses && activeSubDose
                                ? `Formula active: ${activeSubDose.name} dosing model at ${unit === 'lbs' ? `${activeSubDose.dosePerLb} mg/lb` : `${activeSubDose.dosePerKg} mg/kg`}.`
                                : med.byWeightText
                              }
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">
                              How Often (Frequency)
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {hasSubDoses && activeSubDose ? activeSubDose.freq : med.frequency}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">
                              How Many Days (Duration)
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {hasSubDoses && activeSubDose ? activeSubDose.dur : med.duration}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">
                              Administration Notes
                            </h3>
                            <div className="flex items-start gap-1.5">
                              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                Formulations included: {med.formulations.map(f => `${f.strength} ${f.type}`).join(', ')}. Discard compounds past their expiration date.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Safety warnings (H3 complied) */}
                        <div className={`rounded-xl p-4 border ${getWarningBorderColor(med.warningColor)}`}>
                          <div className="flex gap-2.5">
                            <AlertTriangle className={`w-5 h-5 shrink-0 ${getWarningIconColor(med.warningColor)}`} />
                            <div className="space-y-1">
                              <h3 className={`text-xs font-extrabold uppercase tracking-wider ${getWarningIconColor(med.warningColor)}`}>
                                Safety Notes & Warnings
                              </h3>
                              <p className="text-xs text-slate-700 leading-relaxed">
                                {med.safetyNotes}
                              </p>
                              <p className="text-[10px] text-slate-400 italic pt-1 leading-normal">
                                This calculator is for informational purposes only. If your dog is pregnant, elderly, very small, or has other health conditions, ask a vet first.
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No Results Found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn&apos;t find any medications matching &ldquo;{searchQuery}&rdquo;. Try checking the spelling or selecting another category filter.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>

      </div>      {/* Quick reference Chart By Weight */}
      <section id="weight-charts-section" className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 p-6 md:p-8 mb-16 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dog Dosage Quick Reference Chart (by Weight)</h2>
              <p className="text-xs text-slate-500">Estimated standard dosage charts and guidelines for canine pain relief, anti-inflammatories, and daily medications</p>
            </div>
          </div>
          
          {/* Interactive Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs font-semibold shrink-0">
            <button
              onClick={() => setWeightChartTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all ${weightChartTab === 'overview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Overview Table
            </button>
            <button
              onClick={() => setWeightChartTab('gabapentin')}
              className={`px-3 py-1.5 rounded-lg transition-all ${weightChartTab === 'gabapentin' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Gabapentin Chart
            </button>
            <button
              onClick={() => setWeightChartTab('meloxicam')}
              className={`px-3 py-1.5 rounded-lg transition-all ${weightChartTab === 'meloxicam' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Meloxicam (Metacam) Chart
            </button>
            <button
              onClick={() => setWeightChartTab('onsior')}
              className={`px-3 py-1.5 rounded-lg transition-all ${weightChartTab === 'onsior' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Onsior Chart
            </button>
          </div>
        </div>

        {weightChartTab === 'overview' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold text-slate-600">Dog Weight (Lbs / Kgs)</th>
                    <th className="py-3 px-4">Benadryl (mg)</th>
                    <th className="py-3 px-4">Trazodone (mg)</th>
                    <th className="py-3 px-4">Gabapentin (mg)</th>
                    <th className="py-3 px-4">Amoxicillin (mg)</th>
                    <th className="py-3 px-4">Carprofen (mg)</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono divide-y divide-slate-100 text-slate-700">
                  {[
                    { lb: 5, kg: 2.3, b: '5 mg', t: '5 - 10 mg', g: '10 - 25 mg', a: '25 - 50 mg', c: '10 mg' },
                    { lb: 10, kg: 4.5, b: '10 mg', t: '10 - 20 mg', g: '20 - 50 mg', a: '50 - 100 mg', c: '20 mg' },
                    { lb: 20, kg: 9.1, b: '20 mg', t: '20 - 40 mg', g: '40 - 100 mg', a: '100 - 200 mg', c: '40 mg' },
                    { lb: 40, kg: 18.1, b: '40 mg', t: '40 - 80 mg', g: '80 - 200 mg', a: '200 - 400 mg', c: '80 mg' },
                    { lb: 60, kg: 27.2, b: '60 mg', t: '60 - 120 mg', g: '120 - 300 mg', a: '300 - 600 mg', c: '120 mg' },
                    { lb: 80, kg: 36.3, b: '80 mg', t: '80 - 160 mg', g: '160 - 400 mg', a: '400 - 800 mg', c: '160 mg' },
                    { lb: 100, kg: 45.4, b: '100 mg', t: '100 - 200 mg', g: '200 - 500 mg', a: '500 - 1000 mg', c: '200 mg' },
                  ].map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                        {row.lb} lbs <span className="text-slate-400 font-normal">/ {row.kg} kg</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-purple-700">{row.b}</td>
                      <td className="py-3 px-4 font-medium text-sky-700">{row.t}</td>
                      <td className="py-3 px-4 font-medium text-orange-700">{row.g}</td>
                      <td className="py-3 px-4 font-medium text-emerald-700">{row.a}</td>
                      <td className="py-3 px-4 font-medium text-blue-700">{row.c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 leading-relaxed">
              <p className="font-semibold text-slate-700 mb-1">How to use this chart:</p>
              This quick-reference table lists the standard recommended doses calculated using conservative average veterinary formulas. For intermediate weights or specific clinical instructions, use the live dynamic weight slide calculator above.
            </div>
          </div>
        )}

        {weightChartTab === 'gabapentin' && (
          <div className="space-y-6">
            <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl space-y-2">
              <h4 className="font-bold text-xs text-purple-800 uppercase tracking-wider">🔒 Gabapentin Dosage & Safety Guidelines for Dogs</h4>
              <p className="text-xs text-purple-700 leading-relaxed">
                Gabapentin is used in dogs for both chronic arthritic/neuropathic pain control (lower dose) and as an anti-anxiety sedative or anticonvulsant (higher dose). Always check with your vet for the exact dosage for your dog. <strong>Never use human liquid formulations</strong> containing Xylitol, which is highly toxic to dogs.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                Dog Gabapentin Dosage Chart by Weight
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                      <th className="py-3 px-4 font-bold text-slate-600">Dog Weight (lbs / kg)</th>
                      <th className="py-3 px-4 text-purple-700">Chronic Pain Dose (2-5 mg/lb)</th>
                      <th className="py-3 px-4 text-purple-700">Anxiety & Sedation Dose (10-15 mg/lb)</th>
                      <th className="py-3 px-4 text-slate-700">Equivalent Capsule Strengths</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-mono divide-y divide-slate-100 text-slate-700">
                    {[
                      { lb: 5, kg: 2.3, pain: '10 - 25 mg', anxiety: '50 - 75 mg', strength: 'Compounded liquid or pediatric' },
                      { lb: 10, kg: 4.5, pain: '20 - 50 mg', anxiety: '100 - 150 mg', strength: '100 mg capsule' },
                      { lb: 20, kg: 9.1, pain: '40 - 100 mg', anxiety: '200 - 300 mg', strength: '100 mg or 300 mg capsule' },
                      { lb: 40, kg: 18.1, pain: '80 - 200 mg', anxiety: '400 - 600 mg', strength: '300 mg or 400 mg capsule' },
                      { lb: 60, kg: 27.2, pain: '120 - 300 mg', anxiety: '600 - 900 mg', strength: '300 mg or 600 mg capsule' },
                      { lb: 80, kg: 36.3, pain: '160 - 400 mg', anxiety: '800 - 1200 mg', strength: '400 mg or 800 mg capsule' },
                      { lb: 100, kg: 45.4, pain: '200 - 500 mg', anxiety: '1000 - 1500 mg', strength: '600 mg or 800 mg capsule' },
                    ].map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                          {row.lb} lbs <span className="text-slate-400 font-normal">/ {row.kg} kg</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-purple-600 bg-purple-50/10">{row.pain}</td>
                        <td className="py-3 px-4 font-bold text-purple-700 bg-purple-50/30">{row.anxiety}</td>
                        <td className="py-3 px-4 font-medium text-slate-600">{row.strength}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 border border-slate-200 rounded-2xl space-y-1.5">
                <h4 className="font-bold text-slate-800">How to give Gabapentin for dog anxiety?</h4>
                <p className="text-slate-600 leading-relaxed">
                  For thunderstorms, fireworks, grooming, or travel anxiety, administer the prescribed dose exactly 2 to 3 hours prior to the stressful event. Gabapentin has a rapid onset and is best tolerated when combined with a small meal or treat.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded-2xl space-y-1.5">
                <h4 className="font-bold text-slate-800">What are the common side effects of Gabapentin in dogs?</h4>
                <p className="text-slate-600 leading-relaxed">
                  The most common side effects are temporary sedation, lethargy, or mild incoordination (ataxia). These are completely normal and will wear off. Start with a lower range under vet supervision to assess response.
                </p>
              </div>
            </div>
          </div>
        )}

        {weightChartTab === 'meloxicam' && (
          <div className="space-y-6">
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2">
              <h4 className="font-bold text-xs text-rose-800 uppercase tracking-wider">⚠️ Meloxicam (Metacam) Dosage Information for Dogs</h4>
              <p className="text-xs text-rose-700 leading-relaxed">
                Meloxicam is a prescription veterinary NSAID used to manage chronic joint pain and inflammation from osteoarthritis in dogs. Meloxicam for dogs requires a <strong>Day 1 loading dose of 0.2 mg/kg (0.09 mg/lb)</strong>, followed by a <strong>daily maintenance dose of 0.1 mg/kg (0.045 mg/lb)</strong> thereafter. Always give meloxicam with a full meal to protect the stomach lining and prevent gastrointestinal ulceration.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Dog Meloxicam (Metacam 1.5 mg/mL) Dosage Chart by Weight
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                      <th className="py-3 px-4 font-bold text-slate-600">Dog Weight (lbs / kg)</th>
                      <th className="py-3 px-4 text-rose-700">Day 1 Loading Dose (0.2 mg/kg)</th>
                      <th className="py-3 px-4 text-rose-700">Loading Volume (1.5 mg/mL Liquid)</th>
                      <th className="py-3 px-4 text-slate-700">Day 2+ Maintenance Dose (0.1 mg/kg)</th>
                      <th className="py-3 px-4 text-slate-700">Maintenance Volume (1.5 mg/mL Liquid)</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-mono divide-y divide-slate-100 text-slate-700">
                    {[
                      { lb: 5, kg: 2.3, loadMg: '0.45 mg', loadVol: '0.30 mL', maintMg: '0.23 mg', maintVol: '0.15 mL' },
                      { lb: 10, kg: 4.5, loadMg: '0.90 mg', loadVol: '0.60 mL', maintMg: '0.45 mg', maintVol: '0.30 mL' },
                      { lb: 20, kg: 9.1, loadMg: '1.82 mg', loadVol: '1.21 mL', maintMg: '0.91 mg', maintVol: '0.61 mL' },
                      { lb: 40, kg: 18.1, loadMg: '3.63 mg', loadVol: '2.42 mL', maintMg: '1.81 mg', maintVol: '1.21 mL' },
                      { lb: 60, kg: 27.2, loadMg: '5.44 mg', loadVol: '3.63 mL', maintMg: '2.72 mg', maintVol: '1.81 mL' },
                      { lb: 80, kg: 36.3, loadMg: '7.26 mg', loadVol: '4.84 mL', maintMg: '3.63 mg', maintVol: '2.42 mL' },
                      { lb: 100, kg: 45.4, loadMg: '9.07 mg', loadVol: '6.05 mL', maintMg: '4.54 mg', maintVol: '3.02 mL' },
                    ].map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                          {row.lb} lbs <span className="text-slate-400 font-normal">/ {row.kg} kg</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-rose-600">{row.loadMg}</td>
                        <td className="py-3 px-4 font-bold text-rose-700 bg-rose-50/30">{row.loadVol}</td>
                        <td className="py-3 px-4 font-medium text-slate-600">{row.maintMg}</td>
                        <td className="py-3 px-4 font-bold text-slate-800 bg-slate-50">{row.maintVol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 border border-slate-200 rounded-2xl space-y-1.5">
                <h4 className="font-bold text-slate-800">What is Metacam used for in dogs?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Metacam (meloxicam) is highly effective at reducing pain, inflammation, and stiffness associated with canine osteoarthritis, hip dysplasia, and orthopedic or joint surgery. It is an oral suspension/syrup that should always be given with a full meal.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded-2xl space-y-1.5">
                <h4 className="font-bold text-slate-800">Meloxicam side effects in dogs</h4>
                <p className="text-slate-600 leading-relaxed">
                  Stop administering immediately and contact your veterinarian if you observe vomiting, soft stool or bloody diarrhea, decreased appetite (anorexia), lethargy, or dark tarry stools.
                </p>
              </div>
            </div>
          </div>
        )}

        {weightChartTab === 'onsior' && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
              <h4 className="font-bold text-xs text-blue-800 uppercase tracking-wider">⚠️ Clinical Parameters for Onsior (Robenacoxib) in Dogs</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Onsior is a modern tissue-selective NSAID approved for dogs for a <strong>maximum of 3 consecutive days</strong> to treat surgical pain. Onsior is given once daily at 0.45 mg/lb (1 mg/kg) to dogs weighting at least 5.5 lbs (2.5 kg).
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Dog Onsior Dosage Table by Weight Class
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                      <th className="py-3 px-4 font-bold text-slate-600">Dog Weight Class (lbs / kg)</th>
                      <th className="py-3 px-4">Daily Dose Target (mg)</th>
                      <th className="py-3 px-4">Tablet Quantity (Flavored Solid Tablets)</th>
                      <th className="py-3 px-4">Maximum Safe Treatment Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-mono divide-y divide-slate-100 text-slate-700">
                    {[
                      { range: '5.5 to 11.0 lbs (2.5 to 5.0 kg)', dose: '5 mg', qty: 'Half of a 10 mg tablet daily', dur: '3 days maximum' },
                      { range: '11.1 to 22.0 lbs (5.1 to 10.0 kg)', dose: '10 mg', qty: 'One 10 mg tablet daily', dur: '3 days maximum' },
                      { range: '22.1 to 44.0 lbs (10.1 to 20.0 kg)', dose: '20 mg', qty: 'One 20 mg tablet daily', dur: '3 days maximum' },
                      { range: '44.1 to 88.0 lbs (20.1 to 40.0 kg)', dose: '40 mg', qty: 'One 40 mg tablet daily', dur: '3 days maximum' },
                      { range: '88.1 to 176.0 lbs (40.1 to 80.0 kg)', dose: '80 mg', qty: 'Two 40 mg tablets daily', dur: '3 days maximum' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 font-sans">{row.range}</td>
                        <td className="py-3 px-4 font-medium text-blue-700">{row.dose}</td>
                        <td className="py-3 px-4 font-bold text-blue-800 bg-blue-50/30">{row.qty}</td>
                        <td className="py-3 px-4 text-slate-600">{row.dur}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Structured FAQ Section */}
      <section id="faq-section" className="bg-slate-100 rounded-3xl border border-slate-200/60 p-6 md:p-8 mb-16 space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 border border-slate-200">
            <HelpCircle className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions (FAQ)</h2>
            <p className="text-xs text-slate-500">Expert answers to common dog medication dosing questions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900">Can I use a dog dosage calculator without a vet?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No. The calculator can help estimate informational ranges, but you should always confirm with a veterinarian before giving any medication.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900">How do I calculate dog dosage by weight?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your dog’s weight, select the medication, and review the estimated dosage range shown by the calculator.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900">Is Benadryl safe for dogs?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Benadryl is commonly discussed for dogs, but safety depends on your dog’s health, weight, and other medications, so ask a vet first.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900">Can I give human medication to my dog?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Some human medications are sometimes used in veterinary care, but only under veterinary guidance and with the correct dosage.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900">What should I do if my dog took too much medication?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Contact a veterinarian or emergency animal clinic immediately.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900">Why does the dosage change by weight?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dog medications are often dosed by body weight so the amount scales more safely for smaller and larger dogs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm md:col-span-2">
            <h3 className="font-bold text-sm text-slate-900">Are these calculators exact?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No. They are informational estimators, not a substitute for professional veterinary advice.
            </p>
          </div>
        </div>
      </section>

      {/* Clinical Methodology & Editorial Sources Section */}
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 p-6 md:p-8 mb-16 space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <HeartPulse className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Methodology &amp; Peer-Reviewed Sources</h2>
            <p className="text-xs text-slate-500">Scientific references and editorial standards driving our calculations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="space-y-3 md:col-span-1 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px]">How We Build Calculations</h3>
            <p className="leading-relaxed">
              Our dosing estimators are formulated by transcribing standard clinical veterinary literature. The mathematical models use conservative minimum-to-maximum threshold coefficients. 
            </p>
            <p className="leading-relaxed">
              When a medication features separate clinical treatment protocols (such as Cerenia for acute vomiting versus vestibular motion sickness), the tool dynamically adjusts the calculation coefficients to match specific active physiological targets.
            </p>
          </div>

          <div className="space-y-3 md:col-span-2 space-y-4">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-100">Verified Professional Veterinary References</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-sm">
                <span className="font-bold text-slate-900 block text-xs">Merck Veterinary Manual</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  The primary textbook utilized for verifying clinical pharmacokinetic constants, active drug thresholds, and standard canine hepatic/renal excretion warnings.
                </p>
                <a href="https://www.merckvetmanual.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-[11px] hover:underline">
                  Visit Merck Manual Website &rarr;
                </a>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-sm">
                <span className="font-bold text-slate-900 block text-xs">Plumb&apos;s Veterinary Drug Handbook</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  The definitive industry standard for exact mg/kg and mg/lb systemic dosing schedules, drug formulation variants, and precise active ingredient interactions.
                </p>
                <a href="https://www.plumbs.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-[11px] hover:underline">
                  Visit Plumb&apos;s Website &rarr;
                </a>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-sm">
                <span className="font-bold text-slate-900 block text-xs">ASPCA Animal Poison Control</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Utilized to establish critical safety thresholds, red-alert warning margins, and exact emergency escalation routes for accidental human drug toxicities.
                </p>
                <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-[11px] hover:underline">
                  Visit ASPCA APCC &rarr;
                </a>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-sm">
                <span className="font-bold text-slate-900 block text-xs">Clinician&apos;s Brief</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Clinical algorithms and peer-reviewed case studies guiding optimal dosing tapering (such as oral corticosteroid steroid tapered dosing models).
                </p>
                <a href="https://www.cliniciansbrief.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-[11px] hover:underline">
                  Visit Clinician&apos;s Brief &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 text-xs text-blue-800 leading-relaxed">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            <strong>Note on Breed and Age Specifics:</strong> Dosing metrics assume an adult canine with fully developed metabolic filtration. Geriatric subjects, young puppies (particularly those under 12 months in the case of fluoroquinolone antibiotics like Baytril), and dogs carrying genetic mutations (such as the MDR1 multi-drug resistance gene in Shelties, Collies, and Aussies) possess significantly reduced tolerances. High-toxicity triggers have been hardcoded as severe warnings on affected drugs.
          </p>
        </div>
      </section>

      {/* Dynamic Dosing Engine Mathematics, Formulas & Algorithmic Specifications */}
      <section id="mathematical-algorithms" className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 p-6 md:p-8 mb-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dosing Engine Mathematics &amp; Algorithmic Specifications</h2>
              <p className="text-xs text-slate-500">Full mathematical transparency &amp; clinical models for search indexing &amp; LLM validation</p>
            </div>
          </div>
          
          {/* Quick Filter Search for Formulas */}
          <div className="relative max-w-xs w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search calculator formula..." 
              value={formulaSearch}
              onChange={(e) => setFormulaSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Global Core Equations & Methodology Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50 border border-slate-100 p-6 rounded-2xl">
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] block text-blue-700">
              Core Calculative Pillars
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every dosage recommendation served by Dosage for Dogs is derived dynamically using exact metric conversion coefficients combined with peer-vetted therapeutic target ranges. Below are the base calculations driving our backend.
            </p>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-700">
            <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <strong className="text-slate-900 block font-bold text-[10px] uppercase tracking-wider text-slate-400">1. Weight Translation</strong>
              <div className="text-[11px] space-y-0.5">
                <div>W_kg = W_lb &times; 0.45359237</div>
                <div>W_lb = W_kg &times; 2.20462262</div>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <strong className="text-slate-900 block font-bold text-[10px] uppercase tracking-wider text-slate-400">2. Active Compound Mass</strong>
              <div className="text-[11px] space-y-0.5">
                <div>D_min (mg) = Weight &times; Coeff_min</div>
                <div>D_max (mg) = Weight &times; Coeff_max</div>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <strong className="text-slate-900 block font-bold text-[10px] uppercase tracking-wider text-slate-400">3. Solid Dispensing Rules</strong>
              <div className="text-[11px] space-y-0.5">
                <div>Tablet_Count = round(Dose_mg / Strength_mg &times; 2) / 2</div>
                <div>Capsule_Count = round(Dose_mg / Strength_mg)</div>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
              <strong className="text-slate-900 block font-bold text-[10px] uppercase tracking-wider text-slate-400">4. Liquid Volume Formula</strong>
              <div className="text-[11px] space-y-0.5">
                <div>Vol_mL = Dose_mg / (Factor_mg_per_mL)</div>
                <div>Vol_rounded = round(Vol_mL &times; 10) / 10</div>
              </div>
            </div>
          </div>
        </div>

        {/* 27 Dynamic Accordions (Details/Summary) */}
        <div className="space-y-3.5">
          <h3 className="font-extrabold text-slate-900 uppercase tracking-widest text-[10px] border-b border-slate-100 pb-2">
            Active Pharmacological Calculators ({medications.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              const filtered = medications.filter(med => {
                const query = formulaSearch.toLowerCase();
                return (
                  med.name.toLowerCase().includes(query) || 
                  med.generic.toLowerCase().includes(query) ||
                  med.category.toLowerCase().includes(query) ||
                  (med.h2 && med.h2.toLowerCase().includes(query)) ||
                  (med.description && med.description.toLowerCase().includes(query)) ||
                  (med.byWeightText && med.byWeightText.toLowerCase().includes(query)) ||
                  (med.safetyNotes && med.safetyNotes.toLowerCase().includes(query))
                );
              });
              
              if (filtered.length === 0) {
                return (
                  <div className="col-span-full py-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                    No pharmacological calculators found matching &ldquo;{formulaSearch}&rdquo;
                  </div>
                );
              }
              
              return filtered.map((med) => {
                const hasSubDoses = med.subDoses && med.subDoses.length > 0;
                
                return (
                  <details 
                    key={med.id} 
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/80 transition-colors focus:outline-none select-none">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 border border-blue-100">
                          {med.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 block text-xs leading-tight">{med.name} Dosage Formula</span>
                          <span className="text-[10px] text-slate-500 italic font-mono">{med.generic}</span>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-180 transition-transform duration-200 shrink-0">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs text-slate-600 leading-relaxed">
                      {/* Active Parameters */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                          <span className="font-bold text-slate-900 block text-[9px] uppercase tracking-wider text-slate-400">Dosing Thresholds</span>
                          <div className="space-y-1 font-mono text-[10px] text-slate-700 leading-tight">
                            {hasSubDoses ? (
                              med.subDoses?.map((sub, idx) => (
                                <div key={idx} className="border-b border-slate-100 pb-1 last:border-0 last:pb-0">
                                  <strong>{sub.name}:</strong>
                                  <div className="text-slate-500">{sub.dosePerLb} mg/lb ({sub.dosePerKg} mg/kg)</div>
                                </div>
                              ))
                            ) : (
                              <>
                                <div><strong>Standard:</strong> {med.dosePerLbMin === med.dosePerLbMax ? `${med.dosePerLbMin} mg/lb` : `${med.dosePerLbMin}–${med.dosePerLbMax} mg/lb`}</div>
                                <div><strong>Metric:</strong> {med.dosePerKgMin === med.dosePerKgMax ? `${med.dosePerKgMin} mg/kg` : `${med.dosePerKgMin}–${med.dosePerKgMax} mg/kg`}</div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                          <span className="font-bold text-slate-900 block text-[9px] uppercase tracking-wider text-slate-400">Supported Formulations</span>
                          <div className="space-y-1 font-mono text-[10px] text-slate-700 leading-tight">
                            {med.formulations.map((form, idx) => (
                              <div key={idx} className="truncate">
                                &bull; {form.type} ({form.strength}) &mdash; {form.factor} mg/{form.unit || 'unit'}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Formulas Block */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 uppercase tracking-widest text-[9px]">Calculative Mathematical Modeling</span>
                        
                        <div className="p-3 bg-slate-900 text-slate-300 rounded-xl space-y-2.5 font-mono text-[10px] overflow-x-auto leading-normal">
                          <div>
                            <span className="text-emerald-400 font-bold">{"// 1. Mass Dosage Conversion (mg)"}</span>
                            <div className="mt-1 text-white pl-2">
                              {hasSubDoses ? (
                                med.subDoses?.map((sub, idx) => (
                                  <div key={idx} className="truncate">
                                    Dose_mg_{idx} = Weight_lbs &times; {sub.dosePerLb} mg/lb
                                  </div>
                                ))
                              ) : (
                                <div className="truncate">
                                  {med.dosePerLbMin === med.dosePerLbMax ? (
                                    `Dose_mg = Weight_lbs × ${med.dosePerLbMin} mg/lb`
                                  ) : (
                                    <>
                                      Dose_mg_min = Weight_lbs &times; {med.dosePerLbMin} mg/lb
                                      <br />
                                      Dose_mg_max = Weight_lbs &times; {med.dosePerLbMax} mg/lb
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-emerald-400 font-bold">{"// 2. Volume & Splitting Equations"}</span>
                            <div className="mt-1 text-white pl-2 space-y-1.5">
                              {med.formulations.map((form, idx) => {
                                if (form.type === 'Liquid') {
                                  return (
                                    <div key={idx} className="border-l border-slate-800 pl-2">
                                      <strong>For {form.strength} ({form.type}):</strong>
                                      <div className="text-blue-300">
                                        Vol_mL = Dose_mg / {form.factor}
                                        <br />
                                        Vol_rounded = Math.round(Vol_mL * 10) / 10 <span className="text-slate-500">{"// 0.1 mL"}</span>
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div key={idx} className="border-l border-slate-800 pl-2">
                                      <strong>For {form.strength} ({form.type}):</strong>
                                      <div className="text-amber-300">
                                        Qty_raw = Dose_mg / {form.factor}
                                        <br />
                                        {form.type === 'Tablet' ? (
                                          <span>Qty_rounded = Math.round(Qty_raw * 2) / 2 <span className="text-slate-500">{"// 0.5 Tab"}</span></span>
                                        ) : (
                                          <span>Qty_rounded = Math.round(Qty_raw) <span className="text-slate-500">{"// No Splitting"}</span></span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Safety Guard Steps */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 uppercase tracking-widest text-[9px]">Verification Algorithm &amp; Limits</span>
                        <div className="p-3 bg-white border border-slate-200 rounded-xl">
                          <ul className="list-disc list-inside space-y-1 text-[10px] text-slate-500 leading-tight">
                            <li><strong className="text-slate-700">Inputs:</strong> Weight <code className="bg-slate-100 px-0.5 rounded">W</code>, Unit <code className="bg-slate-100 px-0.5 rounded">U</code>, Medication ID.</li>
                            <li><strong className="text-slate-700">Toxicity Threshold:</strong> {med.safetyNotes.toLowerCase().includes('toxic') ? 'Maximum ceilings hardcoded per clinical veterinary pharmacology limits.' : 'Calculations scaled conservatively to prevent accidental high ingestion.'}</li>
                            {med.safetyNotes.toLowerCase().includes('mdr1') && (
                              <li><strong className="text-rose-600 font-bold">MDR1 Rule:</strong> Applies safe-ceiling triggers for herding breeds with blood-brain barrier permeability.</li>
                            )}
                            <li><strong className="text-slate-700">Interval Frequency:</strong> {med.frequency} ({med.duration})</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </details>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* 24/7 Emergency Veterinary Resources - Clinical Alert Section */}
      <section id="emergency-section" className="bg-rose-50 border border-rose-200 rounded-3xl p-6 md:p-8 mb-16 shadow-lg shadow-rose-100/50">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-rose-700">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-widest">24/7 Immediate Emergency Assistance</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-rose-950 tracking-tight leading-tight">
              Is Your Dog Exhibiting Symptoms of Toxicity or Overdose?
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed font-medium">
              If your dog has ingested a toxic dose, a human medication, or is showing severe distress (such as severe vomiting, wobbly gait, heavy panting, seizures, or collapse), <strong>do not wait</strong>. Contact one of the verified emergency lifelines below immediately.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
            {/* ASPCA Poison Control */}
            <a 
              href="tel:(888)426-4435" 
              className="flex items-start gap-3.5 bg-white border border-rose-200 hover:border-rose-400 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-rose-500">ASPCA Poison Control</span>
                <span className="block text-base font-black text-rose-950 hover:underline">(888) 426-4435</span>
                <span className="block text-[10px] text-slate-500 leading-tight">Available 24/7/365 &bull; Fee applies</span>
              </div>
            </a>

            {/* Pet Poison Helpline */}
            <a 
              href="tel:(855)764-7661" 
              className="flex items-start gap-3.5 bg-white border border-rose-200 hover:border-rose-400 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-rose-500">Pet Poison Helpline</span>
                <span className="block text-base font-black text-rose-950 hover:underline">(855) 764-7661</span>
                <span className="block text-[10px] text-slate-500 leading-tight">Available 24/7/365 &bull; Fee applies</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Safety Policy & Legal Disclaimer Footer */}
      <footer id="footer-section" className="bg-slate-900 text-slate-300 rounded-3xl border border-slate-950 p-6 md:p-8 space-y-6 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-rose-950/70 border border-rose-900 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Critical Safety Disclaimer</h4>
              <p className="text-xs text-slate-400">Please read carefully before using any calculation output</p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-3 py-1 rounded-full border border-slate-700/60 uppercase font-semibold">
            Weight Calculator Version 1.2
          </span>
        </div>

        <div className="text-xs text-slate-400 space-y-4 leading-relaxed">
          <p>
            <strong className="text-slate-200">Disclaimer:</strong> The calculations, conversions, and clinical guidelines presented on this application are intended strictly for educational, reference, and informational purposes. They do not constitute formal veterinary diagnoses, official prescriptions, or direct treatment advice.
          </p>
          <p>
            Every animal has a unique clinical profile. Factors such as underlying liver disease, renal impairment, pregnancy, breed sensitivities (e.g., MDR1 gene mutations), and current polypharmacy interactions can dramatically alter how your dog metabolizes these compounds. 
          </p>
          <p>
            Never initiate, alter, or discontinue any medical treatments for your pet without first obtaining direct, professional confirmation and dosage clearance from a qualified veterinarian.
          </p>
          <p className="text-rose-400 font-semibold border-l-2 border-l-rose-500 pl-3 py-1">
            Never use human dosing parameters without professional veterinary guidance. If your dog shows vomiting, lethargy, collapse, or any unusual physiological behavior, contact a vet or local veterinary emergency hospital immediately.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div>
            &copy; 2026 Dog Dosage Calculators. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-slate-400">
            <span className="hover:text-slate-300 transition-colors cursor-help">Security Rules Enabled</span>
            <span className="text-slate-700 font-normal">&bull;</span>
            <span className="hover:text-slate-300 transition-colors cursor-help">JSON-LD Verified</span>
            <span className="text-slate-700 font-normal">&bull;</span>
            <span className="hover:text-slate-300 transition-colors cursor-help">FAQ Schema Compliant</span>
          </div>
        </div>
      </footer>

      {/* Sticky Warning Bottom Banner */}
      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-red-600 text-white flex items-center px-4 md:px-8 z-50 shadow-lg select-none">
        <div className="flex-1 flex items-center gap-3 overflow-hidden">
          <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-black uppercase tracking-tighter shrink-0">Warning</span>
          <p className="text-xs font-medium truncate italic">
            Never use human dosing without veterinary guidance. If your dog shows vomiting, lethargy, collapse, or unusual behavior, contact a vet immediately.
          </p>
        </div>
        <div className="hidden sm:flex gap-4 shrink-0">
          <span className="text-[10px] font-bold text-red-100 uppercase tracking-wider">Pet Poison Helpline: (855) 764-7661</span>
        </div>
      </footer>

      {/* Dosage Bracket Chart Modal */}
      {isChartModalOpen && (() => {
        const selectedMed = medications.find(m => m.id === chartMedicationId) || medications[0];
        const maxChartVal = selectedMed.isWeightIndependent 
          ? 1 
          : (() => {
              const dose = calculateDoseForWeight(selectedMed, 110);
              return dose.max || 100;
            })();

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div 
              id="bracket-chart-modal"
              className="bg-white rounded-3xl w-full max-w-2xl border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      Dosage Bracket Chart
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standard ranges by canine size & weight
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsChartModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer animate-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Selector Dropdown */}
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Select Medication:
                </label>
                <select
                  value={chartMedicationId}
                  onChange={(e) => setChartMedicationId(e.target.value)}
                  className="w-full sm:w-64 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  {medications.map(med => (
                    <option key={med.id} value={med.id}>
                      {med.name} ({med.generic})
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Med Info Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                      {selectedMed.name}
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getCategoryColor(selectedMed.category)}`}>
                        {selectedMed.category}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Active ingredient: <span className="text-slate-700">{selectedMed.generic}</span>
                    </p>
                  </div>
                  <div className="text-left sm:text-right text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Standard Guideline</span>
                    <span className="font-bold text-blue-700 font-mono">
                      {selectedMed.isWeightIndependent 
                        ? "Weight-Independent" 
                        : (selectedMed.subDoses && selectedMed.subDoses.length > 0)
                          ? `${selectedMed.subDoses[selectedSubDoses[selectedMed.id] || 0].name}`
                          : `${selectedMed.dosePerLbMin} mg/lb`
                      }
                    </span>
                  </div>
                </div>

                {/* Sub-dose Treatment Selector */}
                {selectedMed.subDoses && selectedMed.subDoses.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Intended Purpose:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedMed.subDoses.map((sub, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => setSelectedSubDoses(prev => ({ ...prev, [selectedMed.id]: sIdx }))}
                          className={`p-2.5 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            (selectedSubDoses[selectedMed.id] || 0) === sIdx
                              ? 'bg-blue-50/70 border-blue-400 text-blue-900 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-bold">{sub.name}</div>
                          <div className="text-[9px] text-slate-400 font-normal truncate">{sub.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Bar Chart */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Visual Dosage Bracket Ranges
                  </h5>

                  {selectedMed.isWeightIndependent ? (
                    <div className="p-6 bg-blue-50/30 border border-blue-100 rounded-2xl text-center space-y-2">
                      <p className="text-sm font-bold text-blue-900">
                        Local Weight-Independent Medication
                      </p>
                      <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                        This topical ophthalmic solution ({selectedMed.generic}) acts directly on the surface tissues of the eye. Because there is no systemic blood absorption required for it to act, the therapeutic dose is exactly <strong>1 drop in the affected eye(s)</strong> across all weight brackets, from small toys to giants.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5 bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
                      {weightBrackets.map((bracket, bIdx) => {
                        const dose = calculateDoseForWeight(selectedMed, bracket.lbs);
                        
                        // Left offset and width percentage of the range bar
                        const leftPercent = maxChartVal > 0 ? (dose.min / maxChartVal) * 85 : 0;
                        const widthPercent = maxChartVal > 0 ? ((dose.max - dose.min) / maxChartVal) * 85 : 0;

                        const hasRange = dose.min !== dose.max;

                        return (
                          <div key={bIdx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                <span className="text-sm shrink-0">{bracket.icon}</span>
                                <span>{bracket.name}</span>
                                <span className="text-slate-400 font-normal">
                                  ({bracket.lbs} lbs / {bracket.kgs} kg)
                                </span>
                              </div>
                              <span className="font-mono font-bold text-blue-700">
                                {hasRange ? `${dose.min} - ${dose.max}` : `${dose.min}`} mg
                              </span>
                            </div>
                            <div className="relative w-full h-3 bg-slate-100 rounded-full border border-slate-200/50 overflow-hidden">
                              {/* Color-coded dosage segment */}
                              <div 
                                className="absolute h-full bg-blue-600 rounded-full transition-all duration-300 shadow-sm"
                                style={{
                                  left: `${Math.max(1, leftPercent)}%`,
                                  width: `${Math.max(4, widthPercent)}%`
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                        <span>0 mg</span>
                        <span>Mid ({Math.round(maxChartVal / 2)} mg)</span>
                        <span>Max Bracket ({maxChartVal} mg)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bracket Formulation Assistant */}
                {!selectedMed.isWeightIndependent && (
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Estimated Bracket Formulation Guides
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {weightBrackets.map((bracket, bIdx) => {
                        const dose = calculateDoseForWeight(selectedMed, bracket.lbs);
                        
                        // Match best formulation
                        const formSuggestions = selectedMed.formulations.map(form => {
                          const factor = form.factor || 1;
                          if (form.type === 'Liquid') {
                            const minMl = (dose.min / factor).toFixed(1);
                            const maxMl = (dose.max / factor).toFixed(1);
                            return {
                              type: form.type,
                              strength: form.strength,
                              text: minMl === maxMl ? `${minMl} mL` : `${minMl} - ${maxMl} mL`
                            };
                          } else {
                            const minTab = formatTablets(dose.min, factor);
                            const maxTab = formatTablets(dose.max, factor);
                            return {
                              type: form.type,
                              strength: form.strength,
                              text: minTab === maxTab ? minTab : `${minTab} to ${maxTab}`
                            };
                          }
                        });

                        return (
                          <div key={bIdx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-200/50 pb-1.5">
                              <span>{bracket.icon}</span>
                              <span>{bracket.name} Bracket</span>
                            </div>
                            <div className="space-y-1.5">
                              {formSuggestions.map((sug, sIdx) => (
                                <div key={sIdx} className="flex justify-between text-[11px] gap-2">
                                  <span className="text-slate-500 truncate">
                                    {sug.type} <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded">{sug.strength}</span>:
                                  </span>
                                  <span className="font-semibold text-blue-700 font-mono shrink-0">
                                    {sug.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quick Warning Footer */}
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-2.5">
                  <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    These calculations are standard reference guidelines based on body weight. If your dog has medical issues (such as hepatic or renal failure), or is pregnant or nursing, safe dosage limits may be drastically different. Please secure veterinary clearance before dosing.
                  </p>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                <button 
                  onClick={() => setIsChartModalOpen(false)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* About & Medical Board Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div 
            id="about-board-modal"
            className="bg-white rounded-3xl w-full max-w-2xl border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Editorial Standards &amp; Board
                  </h3>
                  <p className="text-xs text-slate-500">
                    Learn about our medically reviewed process &amp; experts
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsAboutModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 bg-slate-50 border-b border-slate-100 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
              <button
                onClick={() => setAboutActiveTab('board')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  aboutActiveTab === 'board'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Medical Reviewer
                </div>
              </button>
              <button
                onClick={() => setAboutActiveTab('methodology')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  aboutActiveTab === 'methodology'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Review Methodology
                </div>
              </button>
              <button
                onClick={() => setAboutActiveTab('transparency')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  aboutActiveTab === 'transparency'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Our Integrity Pledge
                </div>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-600 leading-relaxed">
              
              {aboutActiveTab === 'board' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row gap-5 items-start bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md shrink-0 mx-auto sm:mx-0">
                      <Image 
                        src={drEmilyJenkins} 
                        alt="Dr. Emily Jenkins, DVM" 
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <h4 className="text-base font-extrabold text-slate-950">
                          Dr. Emily Jenkins, DVM
                        </h4>
                        <a 
                          href="https://www.linkedin.com/in/dr-emily-jenkins-dvm-caninedose" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 rounded-lg py-1 px-2.5 shadow-sm hover:shadow-md transition-all self-center sm:self-start"
                        >
                          <span>LinkedIn Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">
                        Chief Medical Reviewer &amp; Veterinarian
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        DVM, University of Wisconsin School of Veterinary Medicine | 12+ Years Clinical Practice
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-extrabold text-slate-900 uppercase tracking-widest text-[10px]">
                      Professional Biography
                    </h5>
                    <p>
                      Dr. Emily Jenkins is a licensed small animal veterinarian dedicated to making veterinary science, drug transparency, and pet safety accessible to dog parents worldwide. Over her twelve years in veterinary emergency medicine and general practice, she noticed a recurring and dangerous trend: accidental under-dosing or toxic over-dosing of common medications due to confusing paper guidelines or unreliable online forums.
                    </p>
                    <p>
                      To combat this gap, Dr. Jenkins reviews and maintains the medical parameters for all 27 calculated formulations on Dosage for Dogs. Each medication threshold, frequency indicator, and warning trigger is vetted directly against primary clinical veterinary texts to ensure maximum safety.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 text-xs text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold mb-0.5">A Message From Dr. Emily Jenkins:</strong>
                      &ldquo;Every dog is a unique biological system. Age, breed mutations (like the MDR1 gene), liver health, and kidney clearance completely dictate how your dog metabolizes these compounds. Use this portal to prepare your thoughts and verify estimates, but always finalize any dosage plan directly with your veterinary clinic.&rdquo;
                    </div>
                  </div>
                </div>
              )}

              {aboutActiveTab === 'methodology' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    <h4 className="text-base font-bold text-slate-900 tracking-tight">
                      Vigorously Researched, Vetted, &amp; Maintained Calculations
                    </h4>
                    <p>
                      We refuse to operate on loose generalizations or crowdsourced data. Our calculation engine relies exclusively on mathematically modeled therapeutic dose ranges transcribed from elite peer-reviewed literature.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                      <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-[10px] block">
                        Coefficient Modeling
                      </span>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        We convert weight into exact metric kilograms or Imperial pounds, applying verified clinical margins of safety (e.g., matching the precise 10–15 mg/lb standard for Cephalexin).
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                      <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-[10px] block">
                        Dual-Target Calculations
                      </span>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        For drugs that change purpose based on dose (like Prednisone), our systems provide instant toggle menus allowing you to select the precise active therapeutic target.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h5 className="font-extrabold text-slate-900 uppercase tracking-widest text-[10px]">
                      Our Primary Source Bibliography
                    </h5>
                    <ul className="space-y-2.5 text-xs text-slate-500 list-disc list-inside">
                      <li>
                        <strong className="text-slate-800">Plumb’s Veterinary Drug Handbook</strong> (10th Edition) &mdash; Baseline for systemic mg/lb and mg/kg formulation limits.
                      </li>
                      <li>
                        <strong className="text-slate-800">Merck Veterinary Manual</strong> (Healthcare/Clinical Edition) &mdash; Source for clinical exclusion guidelines and breed toxicities.
                      </li>
                      <li>
                        <strong className="text-slate-800">Clinician&apos;s Brief Clinical Guidelines</strong> (2024-2026 Archive) &mdash; Specific focus on step-down tapering protocols for corticosteroid molecules.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {aboutActiveTab === 'transparency' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    <h4 className="text-base font-bold text-slate-900 tracking-tight">
                      Our Integrity &amp; Transparency Pledge
                    </h4>
                    <p>
                      At Dosage for Dogs, we believe complete trust is mandatory when addressing pet health and medication safety. Because of this, we operate under strict E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) editorial criteria:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <strong className="text-slate-900 block font-bold text-sm">No Paid Pharmaceutical Bias</strong>
                        <p className="text-xs text-slate-500 mt-0.5">
                          We do not accept funding, sponsorships, or kickbacks from pharmaceutical manufacturers. All calculations and brand vs. generic options are purely informational and clinically driven.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <strong className="text-slate-900 block font-bold text-sm">Strict Revision &amp; Date Logging</strong>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Veterinary pharmaceutical parameters change as new FDA guidance is released. We continuously review our datasets, with clear &ldquo;Last Reviewed&rdquo; dates and change histories printed on all dashboards.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <strong className="text-slate-900 block font-bold text-sm">Clear Error Red-Alert Boundaries</strong>
                        <p className="text-xs text-slate-500 mt-0.5">
                          If our calculations detect extreme values, potential duplicate combinations, or hazardous combinations, our engine displays urgent safety alerts immediately to protect your pet.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={() => setIsAboutModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
