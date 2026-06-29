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
import { catMedications, Medication, Formulation } from '../lib/catMedicationData';
import drEmilyJenkins from '../src/assets/images/dr_emily_jenkins_1782681194365.jpg';

export default function CatDosageDashboard() {
  // Profile state
  const [catName, setCatName] = useState<string>('');
  const [weight, setWeight] = useState<number>(10);
  const [unit, setUnit] = useState<'lbs' | 'kgs'>('lbs');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Sub-dosage states (for medications with options like Gabapentin, Prednisolone, etc.)
  // Keyed by medication ID
  const [selectedSubDoses, setSelectedSubDoses] = useState<Record<string, number>>({
    'gabapentin': 0,
    'prednisolone': 0,
    'meloxicam': 0
  });

  // Chart modal state
  const [isChartModalOpen, setIsChartModalOpen] = useState<boolean>(false);
  const [chartMedicationId, setChartMedicationId] = useState<string>('gabapentin');

  // About & E-E-A-T Editorial Board modal state
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [aboutActiveTab, setAboutActiveTab] = useState<'board' | 'methodology' | 'transparency'>('board');
  const [formulaSearch, setFormulaSearch] = useState<string>('');
  const [weightChartTab, setWeightChartTab] = useState<'overview' | 'gabapentin' | 'meloxicam' | 'onsior'>('overview');

  // Accordion state - track which medication IDs are expanded
  // Top 5 expanded by default for cats
  const [expandedMedications, setExpandedMedications] = useState<Record<string, boolean>>({
    'gabapentin': true,
    'clavamox': true,
    'cerenia': true,
    'prednisolone': true,
    'doxycycline': true
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
    catMedications.forEach(med => {
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
    catMedications.forEach(med => list.add(med.category));
    return ['All', ...Array.from(list)];
  }, []);

  const filteredMedications = useMemo(() => {
    return catMedications.filter(med => {
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
      return { min: med.dosePerLbMin || 11.4, max: med.dosePerLbMax || 11.4, unit: 'mg', isIndependent: true };
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
    { name: 'Kitten / Tiny', lbs: 4, kgs: 1.8, icon: '🐈‍⬛' },
    { name: 'Small Cat', lbs: 8, kgs: 3.6, icon: '🐾' },
    { name: 'Average Cat', lbs: 12, kgs: 5.4, icon: '🐱' },
    { name: 'Large Cat / Maine Coon', lbs: 18, kgs: 8.2, icon: '🦁' },
  ];

  const calculateDoseForWeight = (med: Medication, wLbs: number) => {
    if (med.isWeightIndependent) {
      return { min: med.dosePerLbMin || 11.4, max: med.dosePerLbMax || 11.4, unit: 'mg', isIndependent: true };
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
        "@id": "https://dogdosagecalculators.com/cats/#webapp",
        "name": "Cat Dosage Calculators",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "All",
        "description": "Calculate safe, weight-based dosage estimations for 15 common feline medications like Gabapentin, Clavamox, Cerenia, and Prednisolone.",
        "url": "https://dogdosagecalculators.com/cats",
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
          "jobTitle": "Veterinarian",
          "alumniOf": "University of Wisconsin School of Veterinary Medicine"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://dogdosagecalculators.com/cats/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I use a cat dosage calculator without a vet?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. The calculator can help estimate informational ranges, but you should always confirm with a veterinarian before giving any medication."
            }
          },
          {
            "@type": "Question",
            "name": "How do I calculate cat dosage by weight?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Enter your cat’s weight, select the medication, and review the estimated dosage range shown by the calculator."
            }
          },
          {
            "@type": "Question",
            "name": "Is Benadryl safe for cats?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Benadryl is sometimes used for cats under strict veterinary guidance, but safety depends entirely on your cat’s health profile, weight, and avoiding any secondary active ingredients like decongestants, so always consult a vet first."
            }
          }
        ]
      }
    ]
  };

  const selectedChartMed = catMedications.find(m => m.id === chartMedicationId) || catMedications[0];

  return (
    <div className="flex flex-col min-h-screen text-slate-800 bg-slate-50 selection:bg-pink-100 selection:text-pink-900 font-sans" id="cat-dosage-app">
      
      {/* Header */}
      <header className="h-16 px-4 md:px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center shadow-sm">
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
            <span className="font-bold text-xl tracking-tight text-slate-800">Dosage for Cats</span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-full text-xs font-semibold">
            <Link href="/" className="text-slate-500 hover:text-slate-800 px-3 py-1 rounded-full transition-colors font-sans">Dogs 🐕</Link>
            <Link href="/cats" className="bg-white text-pink-600 px-3 py-1 rounded-full shadow-sm font-sans">Cats 🐈</Link>
          </div>
        </div>
        <div className="hidden md:flex gap-6 items-center text-sm font-medium text-slate-500">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="text-pink-600 border-b-2 border-pink-600 py-5 transition-all focus:outline-none cursor-pointer"
          >
            All Calculators
          </button>
          <button 
            onClick={() => document.getElementById('weight-charts-section')?.scrollIntoView({ behavior: 'smooth' })} 
            className="hover:text-pink-600 py-5 transition-colors focus:outline-none cursor-pointer"
          >
            Weight Charts
          </button>
          <button 
            onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })} 
            className="hover:text-pink-600 py-5 transition-colors focus:outline-none cursor-pointer"
          >
            FAQ
          </button>
          <button 
            onClick={() => setIsAboutModalOpen(true)} 
            className="hover:text-pink-600 py-5 transition-colors focus:outline-none cursor-pointer font-semibold"
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
            className="px-3 py-1.5 bg-pink-50 text-pink-700 hover:bg-pink-100 rounded-full text-xs font-semibold"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 border border-pink-100 rounded-full text-pink-700 text-xs font-semibold mb-3 tracking-wide uppercase shadow-sm">
            <HeartPulse className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
            Veterinary-Informed Calculators
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Cat Dosage Calculators by Weight for Common Medications
          </h1>
          <p className="text-lg text-slate-600 font-normal leading-relaxed">
            Enter your cat’s weight and choose a medication to estimate the safe dosage range. Always confirm with a veterinarian before giving any medication.
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
            <span>Last updated: <strong>June 29, 2026</strong></span>
            <span className="text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>Sources: <strong>Merck Veterinary Manual &amp; Plumb&apos;s Feline Handbook</strong></span>
          </div>
        </header>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left column: Profile card & controls */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
            
            {/* Active Cat Profile Widget */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 space-y-5 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Active Cat Profile</h3>
                    <p className="text-xs text-slate-500">Live dosage updater</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setCatName(''); setWeight(10); setUnit('lbs'); }}
                  className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset profile values"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Input name */}
              <div className="space-y-1.5">
                <label htmlFor="cat-name-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Cat&apos;s Name (optional)
                </label>
                <input
                  id="cat-name-input"
                  type="text"
                  placeholder="e.g. Luna, Milo, Oliver"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all bg-slate-50/50"
                />
              </div>

              {/* Weight inputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="cat-weight-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
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
                          ? 'bg-white text-pink-600 shadow-sm border border-slate-100'
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
                          ? 'bg-white text-pink-600 shadow-sm border border-slate-100'
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
                    id="cat-weight-input"
                    type="number"
                    min={1}
                    max={unit === 'lbs' ? 40 : 18}
                    step={0.1}
                    value={weight}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setWeight(isNaN(val) ? 0 : val);
                    }}
                    className="w-full pl-4 pr-12 py-2.5 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all bg-slate-50/50"
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
                    max={unit === 'lbs' ? 30 : 14}
                    step={0.5}
                    value={weight || 2}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                    className="w-full accent-pink-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold pt-1 uppercase">
                    <span>Small ({unit === 'lbs' ? '2 lbs' : '1 kg'})</span>
                    <span>Large ({unit === 'lbs' ? '30 lbs' : '14 kg'})</span>
                  </div>
                </div>
              </div>

              {/* Profile Summary Badge */}
              <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Calculators calibrated for:</span>
                <span className="font-bold text-pink-700 font-mono">
                  {catName ? catName : 'Your Cat'} ({weight} {unit})
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
                        ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-100'
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
                If your cat ingested a toxic dose, shows acute vomiting, collapsed, or is lethargic, act instantly:
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

          {/* Right column: The calculators */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Search bar & Collapse/Expand toggles */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-sm">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search feline medications (e.g. Gabapentin, Clavamox...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 transition-all bg-slate-50/50"
                />
              </div>
              <div className="flex gap-2 items-center justify-end shrink-0">
                <button
                  onClick={expandAll}
                  className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-all cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-all cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Interactive Medications List */}
            <div className="space-y-4">
              {filteredMedications.length > 0 ? (
                filteredMedications.map((med) => {
                  const isExpanded = !!expandedMedications[med.id];
                  const { min, max, unit: doseUnit, isIndependent } = calculateDoseRange(med);
                  const hasSubDoses = med.subDoses && med.subDoses.length > 0;
                  const selectedSubIdx = selectedSubDoses[med.id] || 0;

                  return (
                    <article 
                      key={med.id}
                      className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                        isExpanded 
                          ? 'border-pink-200 shadow-xl shadow-pink-100/20' 
                          : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
                      }`}
                      id={`med-card-${med.id}`}
                    >
                      {/* Accordion Trigger Header */}
                      <header 
                        onClick={() => toggleExpand(med.id)}
                        className="p-5 md:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border tracking-wider ${getCategoryColor(med.category)}`}>
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
                            <span className="text-[10px] text-slate-400 font-bold font-mono">ID: {med.id}</span>
                          </div>
                          
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                              {med.h2}
                            </h2>
                            <p className="text-xs text-slate-500 font-mono">({med.generic})</p>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-none">
                            {med.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 self-center">
                          {/* Main Dosage Summary Tag */}
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Dose</p>
                            <p className="text-lg font-extrabold text-pink-700 font-mono">
                              {isIndependent ? (
                                <span>{min} {doseUnit}</span>
                              ) : min === max ? (
                                <span>{min} {doseUnit}</span>
                              ) : (
                                <span>{min} - {max} {doseUnit}</span>
                              )}
                            </p>
                          </div>

                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isExpanded ? 'bg-pink-50 text-pink-600' : 'bg-slate-50 text-slate-400'
                          }`}>
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>
                      </header>

                      {/* Accordion Expanded Content */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-5 md:p-6 space-y-6 animate-in slide-in-from-top-1 duration-200">
                          
                          {/* Dosage Summary on mobile */}
                          <div className="sm:hidden bg-pink-50/70 rounded-2xl p-4 border border-pink-100 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Dose</p>
                              <p className="text-base font-extrabold text-pink-700 font-mono">
                                {isIndependent ? (
                                  <span>{min} {doseUnit}</span>
                                ) : min === max ? (
                                  <span>{min} {doseUnit}</span>
                                ) : (
                                  <span>{min} - {max} {doseUnit}</span>
                                )}
                              </p>
                            </div>
                            <span className="text-[10px] text-pink-600 font-mono bg-white px-2.5 py-1 rounded-lg border border-pink-100 font-bold uppercase">
                              Active Updater
                            </span>
                          </div>

                          {/* Sub-Dose Selectors (If applicable, e.g. Gabapentin) */}
                          {hasSubDoses && (
                            <div className="space-y-2.5">
                              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Activity className="w-4 h-4 text-slate-400" /> Select Clinical Indication
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {med.subDoses?.map((sub, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedSubDoses(prev => ({ ...prev, [med.id]: idx }))}
                                    className={`p-3 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                                      selectedSubIdx === idx
                                        ? 'bg-pink-50 border-pink-300 text-pink-900 font-medium ring-2 ring-pink-500/10'
                                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-bold">{sub.name}</span>
                                      {selectedSubIdx === idx && <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />}
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-normal">{sub.description}</p>
                                    <div className="mt-2 text-[10px] font-mono text-slate-400 font-bold">
                                      Factor: {sub.dosePerLb} mg/lb ({sub.dosePerKg} mg/kg)
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Dosing core cards grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            {/* Frequency Card */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Activity className="w-3.5 h-3.5 text-slate-400" /> How Often
                              </h4>
                              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                                {hasSubDoses ? med.subDoses?.[selectedSubIdx].freq : med.frequency}
                              </p>
                            </div>

                            {/* Duration Card */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-slate-400" /> How Many Days
                              </h4>
                              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                                {hasSubDoses ? med.subDoses?.[selectedSubIdx].dur : med.duration}
                              </p>
                            </div>

                            {/* By Weight Calculation Specifications */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Scale className="w-3.5 h-3.5 text-slate-400" /> Calculation Basis
                              </h4>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                {med.byWeightText}
                              </p>
                            </div>
                          </div>

                          {/* Safe Veterinary Guidelines & Dynamic Splitting Calculations */}
                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                              <Droplets className="w-4 h-4 text-pink-600" /> Formulation &amp; Dosing Action Plan
                            </h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {med.formulations.map((form, idx) => {
                                const isLiquid = form.type === 'Liquid';
                                const canCalculate = !isIndependent && form.factor && form.factor > 0;
                                
                                // Calculation logic
                                let calculatedMinQty = 0;
                                let calculatedMaxQty = 0;
                                
                                if (canCalculate && form.factor) {
                                  calculatedMinQty = min / form.factor;
                                  calculatedMaxQty = max / form.factor;
                                }

                                return (
                                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-900">{form.type} Formulation</span>
                                      <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">{form.strength}</span>
                                    </div>
                                    
                                    <div className="space-y-1 pt-1">
                                      {canCalculate ? (
                                        <div className="text-xs text-slate-600 space-y-1 font-sans">
                                          {isLiquid ? (
                                            <div>
                                              <span className="font-semibold text-slate-800">Liquid Volume needed: </span>
                                              <span className="font-mono font-bold text-pink-700 bg-pink-50 border border-pink-100 px-1.5 py-0.5 rounded">
                                                {calculatedMinQty === calculatedMaxQty ? (
                                                  <span>{(Math.round(calculatedMinQty * 10) / 10).toFixed(1)} mL</span>
                                                ) : (
                                                  <span>{(Math.round(calculatedMinQty * 10) / 10).toFixed(1)} - {(Math.round(calculatedMaxQty * 10) / 10).toFixed(1)} mL</span>
                                                )}
                                              </span>
                                              <p className="text-[10px] text-slate-400 mt-1 italic font-medium">Calculated dynamically for {form.strength} syringe measurement.</p>
                                            </div>
                                          ) : (
                                            <div>
                                              <span className="font-semibold text-slate-800">Target Tablet Qty: </span>
                                              <div className="space-y-1 mt-1 font-mono font-bold text-pink-700">
                                                {calculatedMinQty === calculatedMaxQty ? (
                                                  <div className="bg-pink-50 border border-pink-100 p-1.5 rounded text-[11px]">
                                                    {formatTablets(min, form.factor || 1)}
                                                    <span className="text-slate-400 font-normal text-[9px] block">({calculatedMinQty.toFixed(2)} tablets mathematically)</span>
                                                  </div>
                                                ) : (
                                                  <div className="bg-pink-50 border border-pink-100 p-2 rounded text-[11px] space-y-1">
                                                    <div>Min: {formatTablets(min, form.factor || 1)} <span className="text-slate-400 font-normal text-[9px]">({calculatedMinQty.toFixed(2)})</span></div>
                                                    <div className="border-t border-pink-100 pt-1">Max: {formatTablets(max, form.factor || 1)} <span className="text-slate-400 font-normal text-[9px]">({calculatedMaxQty.toFixed(2)})</span></div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-slate-500 italic">
                                          {med.isWeightIndependent 
                                            ? `Weight independent. Administer exactly ${min} tablet.`
                                            : "Custom prescription. Ask pharmacist to calculate dose weight equivalence."}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Critical Feline Safety Notes Bar */}
                          <div className={`p-4 rounded-2xl border ${getWarningBorderColor(med.warningColor)} flex gap-3 text-xs`}>
                            <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${getWarningIconColor(med.warningColor)}`} />
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-900">Critical Feline Safety Note</h4>
                              <p className="text-slate-600 leading-relaxed">
                                {med.safetyNotes}
                              </p>
                            </div>
                          </div>

                          {/* Math Formula Spec Accordion (For SEO and transparency) */}
                          <div className="border-t border-slate-200/60 pt-4">
                            <details className="group">
                              <summary className="flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-slate-600 cursor-pointer uppercase tracking-wider select-none focus:outline-none">
                                <span>Show Equation &amp; Mathematical Specification</span>
                                <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                              </summary>
                              
                              <div className="p-3 bg-slate-900 text-slate-300 rounded-xl space-y-2.5 font-mono text-[10px] overflow-x-auto leading-normal">
                                <div>
                                  <span className="text-emerald-400 font-bold">{"// 1. Mass Dosage Conversion (mg)"}</span>
                                  <div className="mt-1 text-white pl-2">
                                    {hasSubDoses ? (
                                      med.subDoses?.map((sub, idx) => (
                                        <div key={idx} className={selectedSubIdx === idx ? 'text-pink-300 font-semibold' : 'opacity-50'}>
                                          {sub.name}: Dose_mg = {weight} {unit} * {unit === 'lbs' ? sub.dosePerLb : sub.dosePerKg}
                                          <br />
                                          Dose_mg = {weight * (unit === 'lbs' ? sub.dosePerLb : sub.dosePerKg)} mg
                                        </div>
                                      ))
                                    ) : (
                                      <div>
                                        Min_mg = {weight} {unit} * {unit === 'lbs' ? med.dosePerLbMin : med.dosePerKgMin} = {min} mg
                                        <br />
                                        Max_mg = {weight} {unit} * {unit === 'lbs' ? med.dosePerLbMax : med.dosePerKgMax} = {max} mg
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
                                          <div key={idx} className="border-l-2 border-slate-700 pl-2">
                                            <span className="text-blue-400 font-bold">{form.strength}</span>
                                            <div className="text-blue-300">
                                              Vol_mL = Dose_mg / {form.factor}
                                              <br />
                                              Vol_rounded = Math.round(Vol_mL * 10) / 10 <span className="text-slate-500">{"// 0.1 mL"}</span>
                                            </div>
                                          </div>
                                        );
                                      } else {
                                        return (
                                          <div key={idx} className="border-l-2 border-slate-700 pl-2">
                                            <span className="text-blue-400 font-bold">{form.strength}</span>
                                            <div className="text-blue-300">
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
                            </details>
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

        </div>

        {/* Quick reference Chart By Weight */}
        <section id="weight-charts-section" className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 p-6 md:p-8 mb-16 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                <Table className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Cat Dosage Quick Reference Chart (by Weight)</h2>
                <p className="text-xs text-slate-500">Estimated standard dosage charts and guidelines for feline pain relief, antibiotics, and daily medications</p>
              </div>
            </div>
            
            {/* Interactive Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs font-semibold shrink-0">
              <button
                onClick={() => setWeightChartTab('overview')}
                className={`px-3 py-1.5 rounded-lg transition-all ${weightChartTab === 'overview' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Overview Table
              </button>
              <button
                onClick={() => setWeightChartTab('gabapentin')}
                className={`px-3 py-1.5 rounded-lg transition-all ${weightChartTab === 'gabapentin' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Gabapentin Chart
              </button>
              <button
                onClick={() => setWeightChartTab('meloxicam')}
                className={`px-3 py-1.5 rounded-lg transition-all ${weightChartTab === 'meloxicam' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Meloxicam (Metacam) Chart
              </button>
              <button
                onClick={() => setWeightChartTab('onsior')}
                className={`px-3 py-1.5 rounded-lg transition-all ${weightChartTab === 'onsior' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
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
                      <th className="py-3 px-4 font-bold text-slate-600">Cat Weight (Lbs / Kgs)</th>
                      <th className="py-3 px-4">Gabapentin (mg)</th>
                      <th className="py-3 px-4">Clavamox (mg)</th>
                      <th className="py-3 px-4">Cerenia (mg)</th>
                      <th className="py-3 px-4">Prednisolone (mg)</th>
                      <th className="py-3 px-4">Onsior (mg)</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-mono divide-y divide-slate-100 text-slate-700">
                    {[
                      { lb: 4, kg: 1.8, g: '12 mg', c: '25 mg', r: '1.8 mg', p: '1.4 mg', o: '1.8 mg' },
                      { lb: 8, kg: 3.6, g: '24 mg', c: '50 mg', r: '3.6 mg', p: '2.8 mg', o: '3.6 mg' },
                      { lb: 12, kg: 5.4, g: '36 mg', c: '75 mg', r: '5.4 mg', p: '4.2 mg', o: '5.4 mg' },
                      { lb: 16, kg: 7.3, g: '48 mg', c: '100 mg', r: '7.2 mg', p: '5.6 mg', o: '7.2 mg' },
                      { lb: 20, kg: 9.1, g: '60 mg', c: '125 mg', r: '9.0 mg', p: '7.0 mg', o: '9.0 mg' },
                    ].map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                          {row.lb} lbs <span className="text-slate-400 font-normal">/ {row.kg} kg</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-purple-700">{row.g}</td>
                        <td className="py-3 px-4 font-medium text-sky-700">{row.c}</td>
                        <td className="py-3 px-4 font-medium text-orange-700">{row.r}</td>
                        <td className="py-3 px-4 font-medium text-emerald-700">{row.p}</td>
                        <td className="py-3 px-4 font-medium text-blue-700">{row.o}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 leading-relaxed">
                <p className="font-semibold text-slate-700 mb-1">How to use this chart:</p>
                This quick-reference table lists the standard recommended doses calculated using conservative average veterinary formulas for felines. For intermediate weights or specific clinical instructions, use the live dynamic weight slide calculator above.
              </div>
            </div>
          )}

          {weightChartTab === 'gabapentin' && (
            <div className="space-y-6">
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl space-y-2">
                <h4 className="font-bold text-xs text-purple-800 uppercase tracking-wider">🔒 Gabapentin Dosage & Safety Guidelines for Cats</h4>
                <p className="text-xs text-purple-700 leading-relaxed">
                  Gabapentin is used in felines for both chronic nerve pain (lower dosage) and as a situational sedative/anxiolytic to reduce fear and anxiety during veterinary visits or travel (higher dosage). <strong>Never use human liquid formulations</strong> as they often contain Xylitol, which is highly toxic to cats. Always use veterinary-compounded or solid capsule forms.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  Feline Gabapentin Dosage Chart by Weight for Pain & Anxiety
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                        <th className="py-3 px-4 font-bold text-slate-600">Cat Weight (lbs / kg)</th>
                        <th className="py-3 px-4 text-purple-700">Pain & Discomfort Dose (3-5 mg/lb)</th>
                        <th className="py-3 px-4 text-purple-700">Anxiety & Sedation Dose (10 mg/lb)</th>
                        <th className="py-3 px-4 text-slate-700">Liquid Volume (50 mg/mL Suspension)</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-mono divide-y divide-slate-100 text-slate-700">
                      {[
                        { lb: 4, kg: 1.8, pain: '12 - 20 mg', anxiety: '40 mg', vol: '0.24 - 0.40 mL / 0.8 mL' },
                        { lb: 6, kg: 2.7, pain: '18 - 30 mg', anxiety: '60 mg', vol: '0.36 - 0.60 mL / 1.2 mL' },
                        { lb: 8, kg: 3.6, pain: '24 - 40 mg', anxiety: '80 mg', vol: '0.48 - 0.80 mL / 1.6 mL' },
                        { lb: 10, kg: 4.5, pain: '30 - 50 mg', anxiety: '100 mg', vol: '0.60 - 1.00 mL / 2.0 mL' },
                        { lb: 12, kg: 5.4, pain: '36 - 60 mg', anxiety: '120 mg', vol: '0.72 - 1.20 mL / 2.4 mL' },
                        { lb: 14, kg: 6.4, pain: '42 - 70 mg', anxiety: '140 mg', vol: '0.84 - 1.40 mL / 2.8 mL' },
                        { lb: 16, kg: 7.3, pain: '48 - 80 mg', anxiety: '160 mg', vol: '0.96 - 1.60 mL / 3.2 mL' },
                        { lb: 18, kg: 8.2, pain: '54 - 90 mg', anxiety: '180 mg', vol: '1.08 - 1.80 mL / 3.6 mL' },
                        { lb: 20, kg: 9.1, pain: '60 - 100 mg', anxiety: '200 mg', vol: '1.20 - 2.00 mL / 4.0 mL' },
                      ].map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                            {row.lb} lbs <span className="text-slate-400 font-normal">/ {row.kg} kg</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-purple-600 bg-purple-50/10">{row.pain}</td>
                          <td className="py-3 px-4 font-bold text-purple-700 bg-purple-50/30">{row.anxiety}</td>
                          <td className="py-3 px-4 font-medium text-slate-600">{row.vol}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border border-slate-200 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-800">How to administer Gabapentin for anxiety?</h4>
                  <p className="text-slate-600 leading-relaxed">
                    For vet visits, grooming, or travel anxiety, give the prescribed <strong>gabapentin dosage for cats by weight for anxiety</strong> approximately 2 to 3 hours before the event. You can open capsules and mix the powder with a tiny amount of wet food, lickable treat, or tuna juice to ensure they consume the entire dose.
                  </p>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-800">What are the side effects of Gabapentin in cats?</h4>
                  <p className="text-slate-600 leading-relaxed">
                    The most common side effect is temporary lethargy, drowsiness, or a wobbly/unsteady gait (ataxia). These symptoms are normal, harmless, and typically wear off completely within 6 to 10 hours. Always start with a lower dose to evaluate tolerance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {weightChartTab === 'meloxicam' && (
            <div className="space-y-6">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2">
                <h4 className="font-bold text-xs text-rose-800 uppercase tracking-wider">⚠️ Crucial Meloxicam / Metacam Clinical Warnings</h4>
                <p className="text-xs text-rose-700 leading-relaxed">
                  Felines have a highly reduced capacity to metabolize NSAIDs because they lack key glucuronic acid conjugation pathways. Prolonged or incorrect <strong>meloxicam dose for cats</strong> can cause severe acute kidney injury, stomach ulceration, or fatal gastrointestinal bleeding. Always measure the <strong>meloxicam oral suspension for cats</strong> or <strong>meloxicam syrup for cats</strong> using the calibrated veterinary syringe provided.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                  Feline Meloxicam (Metacam 0.5 mg/mL) Dosage Chart by Weight
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                        <th className="py-3 px-4 font-bold text-slate-600">Cat Weight (lbs / kg)</th>
                        <th className="py-3 px-4 text-rose-700">Day 1 Loading Dose (0.1 mg/kg)</th>
                        <th className="py-3 px-4 text-rose-700">Loading Volume (0.5 mg/mL Liquid)</th>
                        <th className="py-3 px-4 text-slate-700">Day 2+ Maintenance Dose (0.05 mg/kg)</th>
                        <th className="py-3 px-4 text-slate-700">Maintenance Volume (0.5 mg/mL Liquid)</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-mono divide-y divide-slate-100 text-slate-700">
                      {[
                        { lb: 3, kg: 1.4, loadMg: '0.14 mg', loadVol: '0.28 mL', maintMg: '0.07 mg', maintVol: '0.14 mL' },
                        { lb: 5, kg: 2.3, loadMg: '0.23 mg', loadVol: '0.46 mL', maintMg: '0.12 mg', maintVol: '0.23 mL' },
                        { lb: 7, kg: 3.2, loadMg: '0.32 mg', loadVol: '0.64 mL', maintMg: '0.16 mg', maintVol: '0.32 mL' },
                        { lb: 9, kg: 4.1, loadMg: '0.41 mg', loadVol: '0.82 mL', maintMg: '0.21 mg', maintVol: '0.41 mL' },
                        { lb: 11, kg: 5.0, loadMg: '0.50 mg', loadVol: '1.00 mL', maintMg: '0.25 mg', maintVol: '0.50 mL' },
                        { lb: 13, kg: 5.9, loadMg: '0.59 mg', loadVol: '1.18 mL', maintMg: '0.30 mg', maintVol: '0.59 mL' },
                        { lb: 15, kg: 6.8, loadMg: '0.68 mg', loadVol: '1.36 mL', maintMg: '0.34 mg', maintVol: '0.68 mL' },
                        { lb: 18, kg: 8.2, loadMg: '0.82 mg', loadVol: '1.64 mL', maintMg: '0.41 mg', maintVol: '0.82 mL' },
                        { lb: 20, kg: 9.1, loadMg: '0.91 mg', loadVol: '1.82 mL', maintMg: '0.46 mg', maintVol: '0.91 mL' },
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border border-slate-200 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-800">What is Metacam used for in cats?</h4>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Metacam use in cats</strong> is indicated for the control of pain and inflammation associated with osteoarthritis, orthopedic surgery, and acute musculoskeletal disorders. Known also as <strong>meloxicam for cats dosage</strong>, this prescription medication should always be given with food.
                  </p>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-800">Meloxicam for Cats Side Effects</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Loss of appetite / anorexia</li>
                    <li>Vomiting or soft stools / diarrhea</li>
                    <li>Lethargy, weakness, or depression</li>
                    <li>Dark, black, or tarry stools (signs of stomach bleeding)</li>
                    <li>Increased thirst and urination (signs of renal overload)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {weightChartTab === 'onsior' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
                <h4 className="font-bold text-xs text-blue-800 uppercase tracking-wider">⚠️ Clinical Parameters for Onsior (Robenacoxib) in Cats</h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Onsior is a tissue-selective NSAID approved for felines for a <strong>maximum duration of 3 consecutive days</strong>. Do not administer to cats under 5.5 lbs (2.5 kg) or under 4 months of age. Always check with your vet for the exact <strong>onsior for cats dosage</strong>.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Feline Onsior Dosage Table by Weight Class
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                        <th className="py-3 px-4 font-bold text-slate-600">Cat Weight Range (lbs / kg)</th>
                        <th className="py-3 px-4">Daily Recommended Dose (mg)</th>
                        <th className="py-3 px-4">Tablet Quantity (6 mg yeast-flavored tablets)</th>
                        <th className="py-3 px-4">Maximum Safe Treatment Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-mono divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                          Under 5.5 lbs <span className="text-slate-400 font-normal">/ &lt; 2.5 kg</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-rose-600">Contraindicated</td>
                        <td className="py-3 px-4 font-medium text-rose-600">DO NOT ADMINISTER</td>
                        <td className="py-3 px-4 text-slate-500">N/A</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                          5.5 to 13.2 lbs <span className="text-slate-400 font-normal">/ 2.5 to 6.0 kg</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-blue-700">6 mg</td>
                        <td className="py-3 px-4 font-bold text-blue-800 bg-blue-50/30">1 tablet once daily</td>
                        <td className="py-3 px-4 text-slate-600">3 consecutive days maximum</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                          13.3 to 26.4 lbs <span className="text-slate-400 font-normal">/ 6.1 to 12.0 kg</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-blue-700">12 mg</td>
                        <td className="py-3 px-4 font-bold text-blue-800 bg-blue-50/30">2 tablets once daily</td>
                        <td className="py-3 px-4 text-slate-600">3 consecutive days maximum</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                          Over 26.4 lbs <span className="text-slate-400 font-normal">/ &gt; 12.0 kg</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600">Consult Vet</td>
                        <td className="py-3 px-4 font-medium text-slate-600">Strict Veterinary Guidance</td>
                        <td className="py-3 px-4 text-slate-600">As specified by prescriber</td>
                      </tr>
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
              <HelpCircle className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions (FAQ)</h2>
              <p className="text-xs text-slate-500">Quick answers to critical feline medication and calculator questions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900">Can I use a cat dosage calculator without a vet?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. The calculator can help estimate informational ranges, but you should always confirm with a veterinarian before giving any medication.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900">How do I calculate cat dosage by weight?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your cat’s weight, select the medication, and review the estimated dosage range shown by the calculator.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900">Is Benadryl safe for cats?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Benadryl is commonly discussed for cats, but safety depends on your cat’s health, weight, and other medications, so ask a vet first.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900">Can I give human medication to my cat?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Some human medications are sometimes used in veterinary care, but only under veterinary guidance and with the correct dosage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900">What should I do if my cat took too much medication?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contact a veterinarian or emergency animal clinic immediately.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900">Why does the dosage change by weight?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cat medications are often dosed by body weight so the amount scales more safely for smaller and larger cats.
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

        {/* Clinical Authority Section */}
        <section id="clinical-methodology" className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 p-6 md:p-8 mb-16 space-y-8">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Methodology &amp; Peer-Reviewed Sources</h2>
              <p className="text-xs text-slate-500">Our medical board, guidelines verification, and textbook backing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-pink-700">1. Our Clinical Reference Sourcing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every calculation matrix, threshold multiplier, and safety warning provided on this page has been compiled directly from standard reference texts in professional veterinary pharmacotherapy:
              </p>
              <ul className="text-xs text-slate-600 leading-relaxed list-disc list-inside space-y-1">
                <li><strong>Plumb’s Veterinary Drug Handbook (10th Feline Edition)</strong></li>
                <li><strong>The Merck Veterinary Manual (Feline Medicine Guidelines)</strong></li>
                <li><strong>Feline Internal Medicine (Elsevier Health Sciences)</strong></li>
                <li><strong>ISFM consensus guidelines on managing feline acute pain</strong></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-pink-700">2. Feline-Specific Metrology &amp; Physiological Constants</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Feline pharmacology is fundamentally distinct from canine and human medicine. Cats have reduced glucuronidation capacity in the liver, rendering many common drugs (such as Meloxicam, Acetaminophen, and Aspirin) highly toxic at normal therapeutic levels.
              </p>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-500 font-mono space-y-2">
                <div>- Conversion Factor: 1 Lb = 0.45359237 Kilograms</div>
                <div>- Glucuronyl Transferase Deficiency Guard: Applied to Feline NSAIDs</div>
                <div>- Esophageal Safety Stricture Prevention: Critical alert implemented for Doxycycline</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-pink-50 border border-pink-100 rounded-2xl flex gap-3 text-xs text-pink-800 leading-relaxed">
            <Info className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
            <p>
              <strong>Note on Breed and Age Specifics:</strong> Dosing metrics assume an adult feline with fully developed metabolic filtration. Geriatric cats with chronic kidney disease (CKD), kittens under 16 weeks of age, and purebreds with cardiac sensitivities require specialized veterinary adjustments.
            </p>
          </div>
        </section>

        {/* Dynamic Dosing Engine Mathematics, Formulas & Algorithmic Specifications */}
        <section id="mathematical-algorithms" className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 p-6 md:p-8 mb-16 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 border border-pink-100">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dosing Engine Mathematics &amp; Algorithmic Specifications</h2>
                <p className="text-xs text-slate-500">Full mathematical transparency &amp; clinical models for feline-specific calculations</p>
              </div>
            </div>
            
            {/* Quick Filter Search for Formulas */}
            <div className="relative max-w-xs w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search feline formula..." 
                value={formulaSearch}
                onChange={(e) => setFormulaSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Global Core Equations & Methodology Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50 border border-slate-100 p-6 rounded-2xl">
            <div className="lg:col-span-1 space-y-3">
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] block text-pink-700">
                Core Calculative Pillars
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every dosage recommendation served by Dosage for Cats is derived dynamically using exact metric conversion coefficients combined with peer-vetted therapeutic target ranges. Below are the base calculations driving our backend.
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

          {/* Dynamic Accordions (Details/Summary) */}
          <div className="space-y-3.5">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-widest text-[10px] border-b border-slate-100 pb-2">
              Active Feline Pharmacological Calculators ({catMedications.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(() => {
                const filtered = catMedications.filter(med => {
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
                          <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-xs shrink-0 border border-pink-100">
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
                                  <div className="truncate font-sans">
                                    {med.dosePerLbMin === med.dosePerLbMax ? (
                                      <span>Dose_mg = Weight_lbs &times; {med.dosePerLbMin} mg/lb</span>
                                    ) : (
                                      <span>
                                        Dose_mg_min = Weight_lbs &times; {med.dosePerLbMin} mg/lb
                                        <br />
                                        Dose_mg_max = Weight_lbs &times; {med.dosePerLbMax} mg/lb
                                      </span>
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
                              <li><strong className="text-slate-700">Feline Renal Guard:</strong> {med.category.includes('NSAID') ? 'Apply extreme caution. Felines have reduced glucuronyl transferase metabolic filtration.' : 'Conservative parameters calibrated specifically to accommodate delicate feline physiological pathways.'}</li>
                              {med.id === 'doxycycline' && (
                                <li><strong className="text-rose-600 font-bold">Strict Esophageal Rule:</strong> Never administer as dry oral solids; liquid formulation heavily preferred to prevent chemical esophageal lesions.</li>
                              )}
                              {med.id === 'baytril' && (
                                <li><strong className="text-rose-600 font-bold">Blindness Retinal Cap:</strong> Dosage strictly capped at 5 mg/kg (2.27 mg/lb) to prevent rapid, irreversible retinal degeneration.</li>
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
        <section id="emergency-alert-assistance" className="bg-rose-50 border border-rose-200 rounded-3xl p-6 md:p-8 mb-16 shadow-lg shadow-rose-100/50">
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
                Is Your Cat Exhibiting Symptoms of Toxicity or Overdose?
              </h3>
              <p className="text-xs text-rose-800 leading-relaxed font-medium">
                If your cat has ingested a toxic dose, a human medication, or is showing severe distress (such as vomiting, wobbly gait, dilated pupils, heavy breathing, seizures, or collapse), <strong>do not wait</strong>. Contact one of the verified emergency lifelines below immediately.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto shrink-0 font-sans">
              {/* ASPCA Poison Control */}
              <a 
                href="tel:8884264435" 
                className="flex items-start gap-3.5 bg-white border border-rose-200 hover:border-rose-400 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[10px] font-extrabold uppercase tracking-widest text-rose-500">ASPCA Poison Control</span>
                  <span className="block text-base font-black text-rose-950 hover:underline font-mono">(888) 426-4435</span>
                  <span className="block text-[10px] text-slate-500 leading-tight">Available 24/7/365 &bull; Fee applies</span>
                </div>
              </a>

              {/* Pet Poison Helpline */}
              <a 
                href="tel:8557647661" 
                className="flex items-start gap-3.5 bg-white border border-rose-200 hover:border-rose-400 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[10px] font-extrabold uppercase tracking-widest text-rose-500">Pet Poison Helpline</span>
                  <span className="block text-base font-black text-rose-950 hover:underline font-mono">(855) 764-7661</span>
                  <span className="block text-[10px] text-slate-500 leading-tight">Available 24/7/365 &bull; Fee applies</span>
                </div>
              </a>
            </div>
          </div>
        </section>

      </div>

      {/* About & Medical Editorial Board Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-pink-50/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-pink-600" />
                <h3 className="text-lg font-extrabold text-slate-950">About Our Medical Quality Control</h3>
              </div>
              <button 
                onClick={() => setIsAboutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors font-bold text-sm cursor-pointer"
              >
                &times;
              </button>
            </header>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 overflow-x-auto bg-slate-50 shrink-0">
              <button
                onClick={() => setAboutActiveTab('board')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  aboutActiveTab === 'board'
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Dr. Emily Jenkins, DVM
                </div>
              </button>
              <button
                onClick={() => setAboutActiveTab('methodology')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  aboutActiveTab === 'methodology'
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Editorial Methodology
                </div>
              </button>
              <button
                onClick={() => setAboutActiveTab('transparency')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  aboutActiveTab === 'transparency'
                    ? 'border-pink-600 text-pink-600'
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
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-600 leading-relaxed font-sans">
              
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
                    <div className="space-y-2 text-center sm:text-left flex-1 font-sans">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <h4 className="text-base font-extrabold text-slate-950">
                          Dr. Emily Jenkins, DVM
                        </h4>
                        <a 
                          href="https://www.linkedin.com/in/dr-emily-jenkins-dvm-caninedose" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 text-[11px] font-bold text-pink-600 hover:text-pink-700 bg-white border border-slate-200 rounded-lg py-1 px-2.5 shadow-sm hover:shadow-md transition-all self-center sm:self-start"
                        >
                          <span>LinkedIn Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-pink-700 font-bold uppercase tracking-wider">
                        Chief Medical Reviewer &amp; Veterinarian
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        DVM, University of Wisconsin School of Veterinary Medicine | 12+ Years Clinical Practice
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 font-sans">
                    <h5 className="font-extrabold text-slate-900 uppercase tracking-widest text-[10px]">
                      Professional Biography
                    </h5>
                    <p>
                      Dr. Emily Jenkins is a licensed small animal veterinarian dedicated to making veterinary science, drug transparency, and pet safety accessible to cat and dog parents worldwide. Over her twelve years in veterinary emergency medicine and general practice, she noticed a recurring and dangerous trend: accidental under-dosing or toxic over-dosing of common medications due to confusing paper guidelines or unreliable online forums.
                    </p>
                    <p>
                      To combat this gap, Dr. Jenkins reviews and maintains the medical parameters for all 15 calculated formulations on Dosage for Cats. Each medication threshold, frequency indicator, and warning trigger is vetted directly against primary clinical veterinary texts to ensure maximum safety.
                    </p>
                  </div>
                </div>
              )}

              {aboutActiveTab === 'methodology' && (
                <div className="space-y-4 animate-in fade-in duration-200 font-sans">
                  <h4 className="font-extrabold text-slate-950 text-base">Vetting Process &amp; Algorithmic Safety</h4>
                  <p>
                    Every time a user inputs a feline weight, our dosing engine triggers a cascade of verification steps before serving a result.
                  </p>
                  <div className="space-y-3 border-l-2 border-pink-200 pl-4 py-1">
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">Step 1: Metric Verification</h5>
                      <p className="text-xs text-slate-500">Body weight is converted utilizing absolute floating point constants, protecting against rounding drifts that could cause cumulative dosing errors in tiny kittens.</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">Step 2: Species Specific Checks</h5>
                      <p className="text-xs text-slate-500">The engine applies hard feline-safety limits. Some drugs are completely restricted to a short duration (such as Onsior) or carry explicit warning blocks to prevent life-threatening feline exposure.</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">Step 3: Precision Syringe &amp; Splitting Outputs</h5>
                      <p className="text-xs text-slate-500">Unlike generic calculators that display unhelpful fractions, we determine precise volume Syringe lines for liquids (0.1 mL intervals) and tablet splitting brackets (0.25 to 0.5 fractions) to represent real-world use.</p>
                    </div>
                  </div>
                </div>
              )}

              {aboutActiveTab === 'transparency' && (
                <div className="space-y-4 animate-in fade-in duration-200 font-sans">
                  <h4 className="font-extrabold text-slate-950 text-base">Our Integrity &amp; Transparency Pledge</h4>
                  <p>
                    At Dosage for Dogs and Dosage for Cats, we believe complete trust is mandatory when addressing pet health and medication safety. Because of this, we operate under strict E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) editorial criteria:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-xs">
                    <li><strong>No AI-Generated Medical Advice:</strong> All calculators are programmatically driven by explicit, hardcoded mathematical parameters approved by licensed veterinarians, not probabilistic AI guesses.</li>
                    <li><strong>Independent &amp; Ad-Free:</strong> We carry zero affiliation with pharmaceutical conglomerates. Our calculations are unbiased, and our guidelines are based strictly on pure scientific medicine.</li>
                    <li><strong>Continuous Integration Checks:</strong> The clinical equations are checked quarterly against the latest updates from the American Veterinary Medical Association (AVMA) and World Small Animal Veterinary Association (WSAVA).</li>
                  </ul>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <footer className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={() => setIsAboutModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close &amp; Return
              </button>
            </footer>

          </div>
        </div>
      )}

      {/* Emergency fast-action section */}
      <footer id="emergency-section" className="bg-slate-900 text-slate-400 py-12 px-4 md:px-8 border-t border-slate-800 shrink-0 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <HeartPulse className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">Dosage for Cats</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              An independent veterinary medical information service designed to empower cat parents with mathematically precise, fully transparent dosing estimators. Medically reviewed by licensed professionals.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Clinical Sources</h4>
            <ul className="text-xs space-y-2 font-medium">
              <li>Plumb’s Veterinary Drug Handbook (Feline)</li>
              <li>Merck Veterinary Manual</li>
              <li>ISFM Feline Pain Management Guidelines</li>
              <li>Dr. Emily Jenkins Clinical Archives</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-500" /> Crisis Emergency Advice
            </h4>
            <p className="text-xs leading-relaxed">
              If your pet exhibits pupils dilation, heavy vomiting, unsteady breathing, or lethargy after taking medication, call your vet immediately, or go to the nearest emergency clinic.
            </p>
            <div className="text-[11px] space-y-1 font-semibold text-rose-200">
              <p>• ASPCA Poison Control: <a href="tel:8884264435" className="hover:underline font-mono text-white">(888) 426-4435</a></p>
              <p>• Pet Poison Helpline: <a href="tel:8557647661" className="hover:underline font-mono text-white">(855) 764-7661</a></p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-medium">
          <p>© 2026 Dosage for Cats. All Rights Reserved. Created under E-E-A-T guidelines.</p>
          <div className="flex gap-4">
            <button onClick={() => setIsAboutModalOpen(true)} className="hover:text-slate-300 transition-colors cursor-pointer">Medical Disclosure</button>
            <button onClick={() => setIsAboutModalOpen(true)} className="hover:text-slate-300 transition-colors cursor-pointer">Editorial Board</button>
            <button onClick={() => setIsAboutModalOpen(true)} className="hover:text-slate-300 transition-colors cursor-pointer">Integrity Pledge</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
