export type Language = "en" | "hi" | "mr" | "ta" | "bn" | "kn" | "te" | "gu" | "ml" | "pa" | "ur";

export type TranslationKey =
  | "appName"
  | "heroSubtitle"
  | "liveMonitoring"
  | "logout"
  | "loading"
  | "systemCapacity"
  | "estimatedPanels"
  | "panels"
  | "currentOutput"
  | "todaysProduction"
  | "systemEfficiency"
  | "monthlyTotal"
  | "realTimePower"
  | "accumulatedEnergy"
  | "panelPerformance"
  | "totalEnergyMonth"
  | "weatherConditions"
  | "cloudCover"
  | "windSpeed"
  | "solarEfficiency"
  | "clearSky"
  | "partlyCloudy"
  | "foggy"
  | "rainy"
  | "snowy"
  | "stormy"
  | "locationRequired"
  | "enableLocation"
  | "costSavings"
  | "basedOnRates"
  | "thisMonthSavings"
  | "generated"
  | "dailyAverage"
  | "yearlyProjection"
  | "howMuchSaving"
  | "gridCost"
  | "solarCost"
  | "netSavings"
  | "envImpact"
  | "co2Offset"
  | "smartAlerts"
  | "noAlerts"
  | "generateAlerts"
  | "refreshAlerts"
  | "production"
  | "weather"
  | "performance"
  | "maintenance"
  | "optimization"
  | "panelOrientation"
  | "orientationDesc"
  | "directionAzimuth"
  | "tiltAngle"
  | "fromHorizontal"
  | "optimalSettings"
  | "directionSouth"
  | "tiltLatitude"
  | "efficiencyOptimal"
  | "solarPanel"
  | "directionIndicator"
  | "energyProduction"
  | "day"
  | "week"
  | "month"
  | "configureSystem"
  | "configureDesc"
  | "systemCapacityKw"
  | "systemTypeSmall"
  | "systemTypeMedium"
  | "systemTypeLarge"
  | "systemTypeCommercial"
  | "systemTypeIndustrial"
  | "dailyProductionAvg"
  | "saveConfiguration"
  | "saving"
  | "typicalRange"
  | "systemType"
  | "started"
  | "optimal"
  | "good"
  | "fair"
  | "poor"
  | "navDashboard"
  | "navReports"
  | "navConfigure"
  | "navIoT"
  | "navHelp"
  | "footerTagline"
  | "quickLinks"
  | "privacyPolicy"
  | "termsOfService"
  | "contactUs"
  | "allRightsReserved"
  | "environmentalImpact"
  | "co2SavedMonth"
  | "treesEquivalent"
  | "coalAvoided"
  | "co2Saved"
  | "language"
  | "theme"
  | "reportsSubtitle"
  | "configureSubtitle"
  | "userGuide"
  | "userGuideSubtitle"
  | "helpDashboardTitle"
  | "helpDashboardDesc"
  | "helpReportsTitle"
  | "helpReportsDesc"
  | "helpConfigureTitle"
  | "helpConfigureDesc"
  | "helpWeatherTitle"
  | "helpWeatherDesc"
  | "helpAlertsTitle"
  | "helpAlertsDesc"
  | "helpSavingsTitle"
  | "helpSavingsDesc"
  | "helpIoTTitle"
  | "helpIoTDesc"
  | "helpAutoOrientTitle"
  | "helpAutoOrientDesc"
  | "faqTitle"
  | "faq1Q"
  | "faq1A"
  | "faq2Q"
  | "faq2A"
  | "faq3Q"
  | "faq3A"
  | "faq4Q"
  | "faq4A"
  | "faq5Q"
  | "faq5A"
  | "faq6Q"
  | "faq6A"
  | "autoDetectOptimal"
  | "autoDetectDesc";

type Translations = Record<Language, Record<TranslationKey, string>>;

// --- English ---
const en: Record<TranslationKey, string> = {
  appName: "Sun Peek Insight",
  heroSubtitle: "Monitor your solar panel performance in real-time. Track energy production, weather conditions, and optimize your solar efficiency.",
  liveMonitoring: "Live Monitoring Active",
  logout: "Logout",
  loading: "Loading...",
  systemCapacity: "System Capacity",
  estimatedPanels: "Estimated Panels",
  panels: "panels",
  currentOutput: "Current Output",
  todaysProduction: "Today's Production",
  systemEfficiency: "System Efficiency",
  monthlyTotal: "Monthly Total",
  realTimePower: "Real-time power generation",
  accumulatedEnergy: "Accumulated energy today",
  panelPerformance: "Panel performance rating",
  totalEnergyMonth: "Total energy this month",
  weatherConditions: "Weather Conditions",
  cloudCover: "Cloud Cover",
  windSpeed: "Wind Speed",
  solarEfficiency: "Solar Efficiency",
  clearSky: "Clear Sky",
  partlyCloudy: "Partly Cloudy",
  foggy: "Foggy",
  rainy: "Rainy",
  snowy: "Snowy",
  stormy: "Stormy",
  locationRequired: "Location access is required to show weather data",
  enableLocation: "Enable Location",
  costSavings: "Cost Savings Calculator",
  basedOnRates: "Based on Mumbai electricity rates",
  thisMonthSavings: "This Month's Savings",
  generated: "generated",
  dailyAverage: "Daily Average",
  yearlyProjection: "Yearly Projection",
  howMuchSaving: "How much you're saving:",
  gridCost: "Grid electricity cost",
  solarCost: "Your solar cost",
  netSavings: "Net savings",
  envImpact: "Environmental Impact",
  co2Offset: "You've offset approximately",
  smartAlerts: "Smart Alerts",
  noAlerts: "No alerts at this time",
  generateAlerts: "Generate alerts",
  refreshAlerts: "Refresh alerts with latest weather data",
  production: "Production",
  weather: "Weather",
  performance: "Performance",
  maintenance: "Maintenance",
  optimization: "Optimization",
  panelOrientation: "Panel Orientation",
  orientationDesc: "Adjust the direction and angle of your solar panels for optimal energy production",
  directionAzimuth: "Direction (Azimuth)",
  tiltAngle: "Tilt Angle",
  fromHorizontal: "from horizontal",
  optimalSettings: "Optimal Settings for Your Location:",
  directionSouth: "Direction: 180° (South-facing)",
  tiltLatitude: "Tilt: matches your latitude",
  efficiencyOptimal: "Efficiency: ~100% at optimal settings",
  solarPanel: "Solar Panel",
  directionIndicator: "Direction Indicator",
  energyProduction: "Energy Production",
  day: "Day",
  week: "Week",
  month: "Month",
  configureSystem: "Configure Your Virtual Solar System",
  configureDesc: "Enter your virtual solar panel system capacity to get accurate production estimates and savings calculations.",
  systemCapacityKw: "System Capacity (kW)",
  systemTypeSmall: "Small",
  systemTypeMedium: "Medium",
  systemTypeLarge: "Large",
  systemTypeCommercial: "Commercial",
  systemTypeIndustrial: "Industrial",
  dailyProductionAvg: "Daily Production (avg):",
  saveConfiguration: "Save Configuration",
  saving: "Saving...",
  typicalRange: "Typical residential systems range from 3-10 kW. Commercial systems can be up to 100 kW.",
  systemType: "System Type:",
  started: "Started:",
  optimal: "Optimal",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
  navDashboard: "Dashboard",
  navReports: "Reports",
  navConfigure: "Virtual Panel",
  navIoT: "IoT Settings",
  navHelp: "Help",
  footerTagline: "Professional solar monitoring for smarter energy decisions. Track, optimize, and save with real-time insights.",
  quickLinks: "Quick Links",
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  contactUs: "Contact Us",
  allRightsReserved: "All rights reserved.",
  environmentalImpact: "Environmental Impact",
  co2SavedMonth: "CO₂ saved this month",
  treesEquivalent: "Trees equivalent",
  coalAvoided: "Coal avoided",
  co2Saved: "CO₂ Saved",
  language: "Language",
  theme: "Theme",
  reportsSubtitle: "View smart alerts, environmental impact, and cost savings analysis.",
  configureSubtitle: "Set up your virtual solar panel simulation, orientation, and configuration.",
  userGuide: "User Guide",
  userGuideSubtitle: "Learn how to use Sun Peek Insight to monitor and optimize your solar system.",
  helpDashboardTitle: "Dashboard",
  helpDashboardDesc: "The Dashboard shows real-time energy stats (simulated and actual IoT data if connected), performance charts, and weather data. When an IoT device is connected, cards show both simulated and actual values side by side.",
  helpReportsTitle: "Reports",
  helpReportsDesc: "Reports contain smart alerts, environmental impact metrics (CO₂ saved, trees equivalent), cost savings calculator, and a Real vs Simulated comparison chart.",
  helpConfigureTitle: "Virtual Panel",
  helpConfigureDesc: "Configure your virtual solar system capacity, panel orientation (azimuth and tilt), and view the 2D panel visualization. Use 'Auto-Detect Optimal' to set the best orientation based on your GPS location.",
  helpWeatherTitle: "Weather Data",
  helpWeatherDesc: "Weather data is fetched using your location. It shows temperature, cloud cover, wind speed, and estimated solar efficiency based on current conditions.",
  helpAlertsTitle: "Smart Alerts",
  helpAlertsDesc: "Smart alerts are generated daily based on weather conditions and your system performance. They include production tips, maintenance reminders, and optimization suggestions.",
  helpSavingsTitle: "Cost Savings",
  helpSavingsDesc: "The cost savings calculator estimates your monthly and yearly savings based on Mumbai electricity rates (₹8.50/kWh) and your system's energy production.",
  helpIoTTitle: "IoT Device Integration",
  helpIoTDesc: "Connect your real solar panel via an IoT gateway (Raspberry Pi, ESP32). The IoT Settings page shows connection status, live data feed, and the API endpoint. Alerts are sent automatically if actual output differs from simulated by more than 10%.",
  helpAutoOrientTitle: "Auto-Detect Orientation",
  helpAutoOrientDesc: "The system can automatically calculate the optimal panel direction and tilt angle based on your GPS location latitude. In the Northern Hemisphere panels face South (180°), and the tilt equals your latitude.",
  faqTitle: "Frequently Asked Questions",
  faq1Q: "How accurate are the energy production estimates?",
  faq1A: "Estimates are based on your system capacity, panel orientation, and real-time weather data. Actual production may vary by 5-15% depending on panel condition and local shading.",
  faq2Q: "How do I change my solar system size?",
  faq2A: "Go to the Virtual Panel tab and use the system capacity slider to adjust your panel size. Changes are saved automatically.",
  faq3Q: "Why does the app need my location?",
  faq3A: "Location is used to fetch local weather data and to calculate the optimal panel orientation (azimuth and tilt) for your latitude.",
  faq4Q: "How are cost savings calculated?",
  faq4A: "Savings are calculated by multiplying your estimated energy production (kWh) by the local electricity rate (₹8.50/kWh for Mumbai).",
  faq5Q: "How do I connect my real solar panel?",
  faq5A: "Go to IoT Settings and follow the connection guide. Your IoT gateway sends HTTP POST requests with power readings. The system compares actual vs simulated data and alerts you if there's a >10% difference.",
  faq6Q: "What happens when actual production differs from simulated?",
  faq6A: "If actual production differs by more than 10%, the system creates an immediate fault alert suggesting you check the panel direction, tilt angle, or potential obstructions. A detailed daily comparison report is sent at 7 PM.",
  autoDetectOptimal: "Auto-Detect Optimal",
  autoDetectDesc: "Automatically set the best panel orientation based on your GPS location.",
};

// --- Hindi ---
const hi: Record<TranslationKey, string> = {
  ...en,
  appName: "सन पीक इनसाइट",
  heroSubtitle: "अपने सोलर पैनल के प्रदर्शन की रीयल-टाइम निगरानी करें। ऊर्जा उत्पादन, मौसम की स्थिति ट्रैक करें और अपनी सोलर दक्षता बढ़ाएं।",
  liveMonitoring: "लाइव मॉनिटरिंग सक्रिय",
  logout: "लॉगआउट",
  loading: "लोड हो रहा है...",
  systemCapacity: "सिस्टम क्षमता",
  estimatedPanels: "अनुमानित पैनल",
  panels: "पैनल",
  currentOutput: "वर्तमान आउटपुट",
  todaysProduction: "आज का उत्पादन",
  systemEfficiency: "सिस्टम दक्षता",
  monthlyTotal: "मासिक कुल",
  realTimePower: "रीयल-टाइम बिजली उत्पादन",
  accumulatedEnergy: "आज की संचित ऊर्जा",
  panelPerformance: "पैनल प्रदर्शन रेटिंग",
  totalEnergyMonth: "इस महीने की कुल ऊर्जा",
  weatherConditions: "मौसम की स्थिति",
  cloudCover: "बादल आवरण",
  windSpeed: "हवा की गति",
  solarEfficiency: "सोलर दक्षता",
  clearSky: "साफ आसमान",
  partlyCloudy: "आंशिक बादल",
  foggy: "कोहरा",
  rainy: "बारिश",
  snowy: "बर्फबारी",
  stormy: "तूफानी",
  locationRequired: "मौसम डेटा दिखाने के लिए स्थान अनुमति आवश्यक है",
  enableLocation: "स्थान सक्षम करें",
  costSavings: "लागत बचत कैलकुलेटर",
  basedOnRates: "मुंबई बिजली दरों पर आधारित",
  thisMonthSavings: "इस महीने की बचत",
  generated: "उत्पादित",
  dailyAverage: "दैनिक औसत",
  yearlyProjection: "वार्षिक अनुमान",
  howMuchSaving: "आप कितना बचा रहे हैं:",
  gridCost: "ग्रिड बिजली लागत",
  solarCost: "आपकी सोलर लागत",
  netSavings: "शुद्ध बचत",
  envImpact: "पर्यावरणीय प्रभाव",
  co2Offset: "आपने लगभग ऑफसेट किया",
  smartAlerts: "स्मार्ट अलर्ट",
  noAlerts: "इस समय कोई अलर्ट नहीं",
  generateAlerts: "अलर्ट जनरेट करें",
  refreshAlerts: "नवीनतम मौसम डेटा के साथ अलर्ट रिफ्रेश करें",
  production: "उत्पादन",
  weather: "मौसम",
  performance: "प्रदर्शन",
  maintenance: "रखरखाव",
  optimization: "अनुकूलन",
  panelOrientation: "पैनल अभिविन्यास",
  orientationDesc: "इष्टतम ऊर्जा उत्पादन के लिए अपने सोलर पैनलों की दिशा और कोण समायोजित करें",
  directionAzimuth: "दिशा (अज़ीमथ)",
  tiltAngle: "झुकाव कोण",
  fromHorizontal: "क्षैतिज से",
  optimalSettings: "आपके स्थान के लिए इष्टतम सेटिंग्स:",
  directionSouth: "दिशा: 180° (दक्षिण-मुखी)",
  tiltLatitude: "झुकाव: आपके अक्षांश के अनुसार",
  efficiencyOptimal: "दक्षता: इष्टतम सेटिंग्स पर ~100%",
  solarPanel: "सोलर पैनल",
  directionIndicator: "दिशा संकेतक",
  energyProduction: "ऊर्जा उत्पादन",
  day: "दिन",
  week: "सप्ताह",
  month: "महीना",
  configureSystem: "अपना वर्चुअल सोलर सिस्टम कॉन्फ़िगर करें",
  configureDesc: "सटीक उत्पादन अनुमान और बचत गणना प्राप्त करने के लिए अपने सोलर पैनल सिस्टम की क्षमता दर्ज करें।",
  systemCapacityKw: "सिस्टम क्षमता (kW)",
  systemTypeSmall: "छोटा",
  systemTypeMedium: "मध्यम",
  systemTypeLarge: "बड़ा",
  systemTypeCommercial: "व्यावसायिक",
  systemTypeIndustrial: "औद्योगिक",
  dailyProductionAvg: "दैनिक उत्पादन (औसत):",
  saveConfiguration: "कॉन्फ़िगरेशन सहेजें",
  saving: "सहेज रहा है...",
  typicalRange: "सामान्य आवासीय सिस्टम 3-10 kW तक होते हैं। व्यावसायिक सिस्टम 100 kW तक हो सकते हैं।",
  systemType: "सिस्टम प्रकार:",
  started: "शुरू:",
  optimal: "इष्टतम",
  good: "अच्छा",
  fair: "ठीक",
  poor: "खराब",
  navDashboard: "डैशबोर्ड",
  navReports: "रिपोर्ट",
  navConfigure: "वर्चुअल पैनल",
  navIoT: "IoT सेटिंग्स",
  navHelp: "सहायता",
  footerTagline: "स्मार्ट ऊर्जा निर्णयों के लिए पेशेवर सोलर मॉनिटरिंग।",
  quickLinks: "त्वरित लिंक",
  privacyPolicy: "गोपनीयता नीति",
  termsOfService: "सेवा की शर्तें",
  contactUs: "संपर्क करें",
  allRightsReserved: "सर्वाधिकार सुरक्षित।",
  environmentalImpact: "पर्यावरणीय प्रभाव",
  co2SavedMonth: "इस महीने CO₂ बचत",
  treesEquivalent: "पेड़ों के बराबर",
  coalAvoided: "कोयला बचाया",
  co2Saved: "CO₂ बचत",
  language: "भाषा",
  theme: "थीम",
  reportsSubtitle: "स्मार्ट अलर्ट, पर्यावरणीय प्रभाव और लागत बचत विश्लेषण देखें।",
  configureSubtitle: "अपना वर्चुअल सोलर पैनल सिमुलेशन सेट करें।",
  userGuide: "उपयोगकर्ता गाइड",
  userGuideSubtitle: "Sun Peek Insight का उपयोग करना सीखें।",
  helpDashboardTitle: "डैशबोर्ड",
  helpDashboardDesc: "डैशबोर्ड रीयल-टाइम ऊर्जा आंकड़े और IoT डिवाइस डेटा (जुड़ा होने पर) दिखाता है।",
  helpReportsTitle: "रिपोर्ट",
  helpReportsDesc: "रिपोर्ट में स्मार्ट अलर्ट, पर्यावरणीय प्रभाव और वास्तविक बनाम सिमुलेटेड तुलना शामिल है।",
  helpConfigureTitle: "वर्चुअल पैनल",
  helpConfigureDesc: "वर्चुअल सोलर सिस्टम की क्षमता, पैनल ओरिएंटेशन कॉन्फ़िगर करें। ऑटो-डिटेक्ट का उपयोग करें।",
  helpWeatherTitle: "मौसम डेटा",
  helpWeatherDesc: "मौसम डेटा आपके स्थान से प्राप्त किया जाता है।",
  helpAlertsTitle: "स्मार्ट अलर्ट",
  helpAlertsDesc: "मौसम और सिस्टम प्रदर्शन के आधार पर दैनिक अलर्ट।",
  helpSavingsTitle: "लागत बचत",
  helpSavingsDesc: "मुंबई बिजली दरों के आधार पर बचत का अनुमान।",
  helpIoTTitle: "IoT डिवाइस इंटीग्रेशन",
  helpIoTDesc: "IoT गेटवे से अपने सोलर पैनल को कनेक्ट करें। 10% से अधिक अंतर पर स्वचालित अलर्ट।",
  helpAutoOrientTitle: "ऑटो-डिटेक्ट ओरिएंटेशन",
  helpAutoOrientDesc: "GPS स्थान के आधार पर इष्टतम पैनल दिशा और झुकाव स्वचालित रूप से सेट करें।",
  faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
  faq1Q: "ऊर्जा उत्पादन अनुमान कितने सटीक हैं?",
  faq1A: "अनुमान सिस्टम क्षमता, पैनल ओरिएंटेशन और मौसम डेटा पर आधारित हैं।",
  faq2Q: "मैं अपना सोलर सिस्टम साइज़ कैसे बदलूं?",
  faq2A: "वर्चुअल पैनल टैब पर जाएं और स्लाइडर का उपयोग करें।",
  faq3Q: "ऐप को मेरे स्थान की आवश्यकता क्यों है?",
  faq3A: "मौसम डेटा और इष्टतम पैनल ओरिएंटेशन के लिए।",
  faq4Q: "लागत बचत की गणना कैसे होती है?",
  faq4A: "ऊर्जा उत्पादन (kWh) × स्थानीय बिजली दर (₹8.50/kWh)।",
  faq5Q: "मैं अपना सोलर पैनल कैसे कनेक्ट करूं?",
  faq5A: "IoT सेटिंग्स में जाएं और कनेक्शन गाइड का पालन करें।",
  faq6Q: "वास्तविक उत्पादन सिमुलेटेड से भिन्न होने पर क्या होता है?",
  faq6A: "10% से अधिक अंतर पर तुरंत फॉल्ट अलर्ट भेजा जाता है।",
  autoDetectOptimal: "ऑटो-डिटेक्ट इष्टतम",
  autoDetectDesc: "GPS स्थान के आधार पर सर्वोत्तम पैनल ओरिएंटेशन सेट करें।",
};

// --- Marathi ---
const mr: Record<TranslationKey, string> = {
  ...en,
  appName: "सन पीक इनसाइट",
  heroSubtitle: "तुमच्या सोलर पॅनेलच्या कामगिरीवर रिअल-टाइम लक्ष ठेवा.",
  liveMonitoring: "लाइव मॉनिटरिंग सक्रिय",
  logout: "लॉगआउट",
  loading: "लोड होत आहे...",
  systemCapacity: "सिस्टम क्षमता",
  estimatedPanels: "अंदाजित पॅनेल",
  panels: "पॅनेल",
  currentOutput: "सध्याचे आउटपुट",
  todaysProduction: "आजचे उत्पादन",
  systemEfficiency: "सिस्टम कार्यक्षमता",
  monthlyTotal: "मासिक एकूण",
  realTimePower: "रिअल-टाइम वीज उत्पादन",
  accumulatedEnergy: "आजची एकूण ऊर्जा",
  panelPerformance: "पॅनेल कामगिरी रेटिंग",
  totalEnergyMonth: "या महिन्याची एकूण ऊर्जा",
  weatherConditions: "हवामान स्थिती",
  cloudCover: "ढगांचे आवरण",
  windSpeed: "वाऱ्याचा वेग",
  solarEfficiency: "सोलर कार्यक्षमता",
  clearSky: "स्वच्छ आकाश",
  partlyCloudy: "अंशतः ढगाळ",
  foggy: "धुके",
  rainy: "पाऊस",
  snowy: "बर्फवृष्टी",
  stormy: "वादळी",
  locationRequired: "हवामान डेटासाठी स्थान परवानगी आवश्यक",
  enableLocation: "स्थान सक्षम करा",
  costSavings: "खर्च बचत कॅल्क्युलेटर",
  basedOnRates: "मुंबई वीज दरांवर आधारित",
  thisMonthSavings: "या महिन्याची बचत",
  generated: "उत्पादित",
  dailyAverage: "दैनंदिन सरासरी",
  yearlyProjection: "वार्षिक अंदाज",
  howMuchSaving: "तुम्ही किती बचत करत आहात:",
  gridCost: "ग्रिड वीज खर्च",
  solarCost: "तुमचा सोलर खर्च",
  netSavings: "निव्वळ बचत",
  envImpact: "पर्यावरणीय प्रभाव",
  co2Offset: "तुम्ही अंदाजे ऑफसेट केले",
  smartAlerts: "स्मार्ट अलर्ट",
  noAlerts: "सध्या कोणतेही अलर्ट नाहीत",
  generateAlerts: "अलर्ट तयार करा",
  refreshAlerts: "नवीनतम हवामान डेटासह अलर्ट रिफ्रेश करा",
  production: "उत्पादन",
  weather: "हवामान",
  performance: "कामगिरी",
  maintenance: "देखभाल",
  optimization: "ऑप्टिमायझेशन",
  panelOrientation: "पॅनेल अभिमुखता",
  orientationDesc: "इष्टतम ऊर्जा उत्पादनासाठी पॅनेलची दिशा आणि कोन समायोजित करा",
  directionAzimuth: "दिशा (अझिमथ)",
  tiltAngle: "झुकाव कोन",
  fromHorizontal: "क्षैतिज पासून",
  optimalSettings: "तुमच्या स्थानासाठी इष्टतम सेटिंग्ज:",
  directionSouth: "दिशा: 180° (दक्षिणमुखी)",
  tiltLatitude: "झुकाव: तुमच्या अक्षांशानुसार",
  efficiencyOptimal: "कार्यक्षमता: इष्टतम सेटिंग्जवर ~100%",
  solarPanel: "सोलर पॅनेल",
  directionIndicator: "दिशा निर्देशक",
  energyProduction: "ऊर्जा उत्पादन",
  day: "दिवस",
  week: "आठवडा",
  month: "महिना",
  configureSystem: "तुमची वर्चुअल सोलर सिस्टम कॉन्फिगर करा",
  configureDesc: "सिस्टम क्षमता प्रविष्ट करा.",
  systemCapacityKw: "सिस्टम क्षमता (kW)",
  systemTypeSmall: "लहान",
  systemTypeMedium: "मध्यम",
  systemTypeLarge: "मोठे",
  systemTypeCommercial: "व्यावसायिक",
  systemTypeIndustrial: "औद्योगिक",
  dailyProductionAvg: "दैनंदिन उत्पादन (सरासरी):",
  saveConfiguration: "कॉन्फिगरेशन सेव्ह करा",
  saving: "सेव्ह होत आहे...",
  typicalRange: "सामान्य निवासी सिस्टम 3-10 kW असतात.",
  systemType: "सिस्टम प्रकार:",
  started: "सुरुवात:",
  optimal: "इष्टतम",
  good: "चांगले",
  fair: "ठीक",
  poor: "खराब",
  navDashboard: "डॅशबोर्ड",
  navReports: "अहवाल",
  navConfigure: "वर्चुअल पॅनेल",
  navIoT: "IoT सेटिंग्ज",
  navHelp: "मदत",
  footerTagline: "स्मार्ट ऊर्जा निर्णयांसाठी सोलर मॉनिटरिंग.",
  quickLinks: "द्रुत लिंक्स",
  privacyPolicy: "गोपनीयता धोरण",
  termsOfService: "सेवा अटी",
  contactUs: "संपर्क करा",
  allRightsReserved: "सर्व हक्क राखीव.",
  environmentalImpact: "पर्यावरणीय प्रभाव",
  co2SavedMonth: "या महिन्यात CO₂ बचत",
  treesEquivalent: "झाडांच्या बरोबरीचे",
  coalAvoided: "कोळसा टाळला",
  co2Saved: "CO₂ बचत",
  language: "भाषा",
  theme: "थीम",
  reportsSubtitle: "स्मार्ट अलर्ट आणि खर्च बचत विश्लेषण पहा.",
  configureSubtitle: "तुमचा वर्चुअल सोलर पॅनेल सिमुलेशन सेट करा.",
  userGuide: "वापरकर्ता मार्गदर्शिका",
  userGuideSubtitle: "Sun Peek Insight कसे वापरावे ते शिका.",
  helpDashboardTitle: "डॅशबोर्ड",
  helpDashboardDesc: "डॅशबोर्ड रिअल-टाइम ऊर्जा आकडेवारी आणि IoT डिवाइस डेटा दाखवतो.",
  helpReportsTitle: "अहवाल",
  helpReportsDesc: "अहवालांमध्ये स्मार्ट अलर्ट आणि वास्तविक बनाम सिमुलेटेड तुलना समाविष्ट आहे.",
  helpConfigureTitle: "वर्चुअल पॅनेल",
  helpConfigureDesc: "वर्चुअल सोलर सिस्टम कॉन्फिगर करा. ऑटो-डिटेक्ट वापरा.",
  helpWeatherTitle: "हवामान डेटा",
  helpWeatherDesc: "तुमच्या स्थानावरून हवामान डेटा मिळवला जातो.",
  helpAlertsTitle: "स्मार्ट अलर्ट",
  helpAlertsDesc: "हवामान आणि कामगिरीच्या आधारे दररोज अलर्ट.",
  helpSavingsTitle: "खर्च बचत",
  helpSavingsDesc: "मुंबई वीज दरांवर आधारित बचतीचा अंदाज.",
  helpIoTTitle: "IoT डिवाइस इंटिग्रेशन",
  helpIoTDesc: "IoT गेटवेद्वारे तुमचा सोलर पॅनेल कनेक्ट करा. 10% पेक्षा जास्त फरकावर स्वयंचलित अलर्ट.",
  helpAutoOrientTitle: "ऑटो-डिटेक्ट ओरिएंटेशन",
  helpAutoOrientDesc: "GPS स्थानावर आधारित इष्टतम पॅनेल दिशा आणि झुकाव सेट करा.",
  faqTitle: "वारंवार विचारले जाणारे प्रश्न",
  faq1Q: "ऊर्जा उत्पादन अंदाज किती अचूक आहेत?",
  faq1A: "अंदाज सिस्टम क्षमता आणि हवामान डेटावर आधारित आहेत.",
  faq2Q: "मी सोलर सिस्टम साइज कसा बदलू?",
  faq2A: "वर्चुअल पॅनेल टॅबवर जा आणि स्लायडर वापरा.",
  faq3Q: "ॲपला माझ्या स्थानाची गरज का आहे?",
  faq3A: "हवामान डेटा आणि इष्टतम पॅनेल ओरिएंटेशनसाठी.",
  faq4Q: "खर्च बचतीची गणना कशी होते?",
  faq4A: "ऊर्जा उत्पादन (kWh) × वीज दर (₹8.50/kWh).",
  faq5Q: "मी माझा सोलर पॅनेल कसा कनेक्ट करू?",
  faq5A: "IoT सेटिंग्जमध्ये जा आणि कनेक्शन गाइड पहा.",
  faq6Q: "वास्तविक उत्पादन सिमुलेटेड पेक्षा वेगळे असल्यास काय होते?",
  faq6A: "10% पेक्षा जास्त फरकावर तात्काळ फॉल्ट अलर्ट पाठवला जातो.",
  autoDetectOptimal: "ऑटो-डिटेक्ट इष्टतम",
  autoDetectDesc: "GPS स्थानावर आधारित सर्वोत्तम पॅनेल ओरिएंटेशन सेट करा.",
};

// --- Tamil ---
const ta: Record<TranslationKey, string> = {
  ...en,
  appName: "சன் பீக் இன்சைட்",
  heroSubtitle: "உங்கள் சோலார் பேனல் செயல்திறனை நிகழ்நேரத்தில் கண்காணிக்கவும்.",
  liveMonitoring: "நிகழ்நேர கண்காணிப்பு செயலில்",
  logout: "வெளியேறு",
  loading: "ஏற்றுகிறது...",
  systemCapacity: "அமைப்பு திறன்",
  estimatedPanels: "மதிப்பிடப்பட்ட பேனல்கள்",
  panels: "பேனல்கள்",
  currentOutput: "தற்போதைய வெளியீடு",
  todaysProduction: "இன்றைய உற்பத்தி",
  systemEfficiency: "அமைப்பு செயல்திறன்",
  monthlyTotal: "மாதாந்திர மொத்தம்",
  weatherConditions: "வானிலை நிலைகள்",
  cloudCover: "மேக மூட்டம்",
  windSpeed: "காற்று வேகம்",
  solarEfficiency: "சோலார் செயல்திறன்",
  clearSky: "தெளிவான வானம்",
  partlyCloudy: "ஓரளவு மேகமூட்டம்",
  foggy: "மூடுபனி",
  rainy: "மழை",
  snowy: "பனி",
  stormy: "புயல்",
  costSavings: "செலவு சேமிப்பு கால்குலேட்டர்",
  smartAlerts: "ஸ்மார்ட் எச்சரிக்கைகள்",
  navDashboard: "டாஷ்போர்டு",
  navReports: "அறிக்கைகள்",
  navConfigure: "மெய்நிகர் பேனல்",
  navIoT: "IoT அமைப்புகள்",
  navHelp: "உதவி",
  language: "மொழி",
  theme: "தீம்",
  day: "நாள்",
  week: "வாரம்",
  month: "மாதம்",
  optimal: "சிறந்த",
  good: "நல்ல",
  fair: "சரி",
  poor: "மோசமான",
  userGuide: "பயனர் வழிகாட்டி",
  faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
  autoDetectOptimal: "தானாக கண்டறி",
  autoDetectDesc: "GPS இருப்பிடத்தின் அடிப்படையில் சிறந்த பேனல் நோக்குநிலையை அமைக்கவும்.",
};

// --- Bengali ---
const bn: Record<TranslationKey, string> = {
  ...en,
  appName: "সান পিক ইনসাইট",
  heroSubtitle: "আপনার সোলার প্যানেলের কর্মক্ষমতা রিয়েল-টাইমে পর্যবেক্ষণ করুন।",
  liveMonitoring: "লাইভ মনিটরিং সক্রিয়",
  logout: "লগআউট",
  loading: "লোড হচ্ছে...",
  systemCapacity: "সিস্টেম ক্ষমতা",
  estimatedPanels: "আনুমানিক প্যানেল",
  panels: "প্যানেল",
  currentOutput: "বর্তমান আউটপুট",
  todaysProduction: "আজকের উৎপাদন",
  systemEfficiency: "সিস্টেম কার্যকারিতা",
  monthlyTotal: "মাসিক মোট",
  weatherConditions: "আবহাওয়ার অবস্থা",
  cloudCover: "মেঘের আবরণ",
  windSpeed: "বায়ু গতি",
  solarEfficiency: "সোলার কার্যকারিতা",
  clearSky: "পরিষ্কার আকাশ",
  partlyCloudy: "আংশিক মেঘলা",
  foggy: "কুয়াশাচ্ছন্ন",
  rainy: "বৃষ্টি",
  snowy: "তুষারপাত",
  stormy: "ঝড়",
  costSavings: "খরচ সঞ্চয় ক্যালকুলেটর",
  smartAlerts: "স্মার্ট সতর্কতা",
  navDashboard: "ড্যাশবোর্ড",
  navReports: "রিপোর্ট",
  navConfigure: "ভার্চুয়াল প্যানেল",
  navIoT: "IoT সেটিংস",
  navHelp: "সাহায্য",
  language: "ভাষা",
  theme: "থিম",
  day: "দিন",
  week: "সপ্তাহ",
  month: "মাস",
  optimal: "সর্বোত্তম",
  good: "ভালো",
  fair: "মোটামুটি",
  poor: "খারাপ",
  userGuide: "ব্যবহারকারী নির্দেশিকা",
  faqTitle: "প্রায়শই জিজ্ঞাসিত প্রশ্ন",
  autoDetectOptimal: "স্বয়ংক্রিয় সনাক্তকরণ",
  autoDetectDesc: "GPS অবস্থানের উপর ভিত্তি করে সেরা প্যানেল অভিযোজন সেট করুন।",
};

// --- Kannada ---
const kn: Record<TranslationKey, string> = {
  ...en,
  appName: "ಸನ್ ಪೀಕ್ ಇನ್ಸೈಟ್",
  heroSubtitle: "ನಿಮ್ಮ ಸೋಲಾರ್ ಪ್ಯಾನಲ್ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ರಿಯಲ್-ಟೈಮ್‌ನಲ್ಲಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",
  liveMonitoring: "ಲೈವ್ ಮಾನಿಟರಿಂಗ್ ಸಕ್ರಿಯ",
  logout: "ಲಾಗ್ಔಟ್",
  loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
  systemCapacity: "ಸಿಸ್ಟಮ್ ಸಾಮರ್ಥ್ಯ",
  estimatedPanels: "ಅಂದಾಜು ಪ್ಯಾನಲ್‌ಗಳು",
  panels: "ಪ್ಯಾನಲ್‌ಗಳು",
  currentOutput: "ಪ್ರಸ್ತುತ ಔಟ್‌ಪುಟ್",
  todaysProduction: "ಇಂದಿನ ಉತ್ಪಾದನೆ",
  systemEfficiency: "ಸಿಸ್ಟಮ್ ದಕ್ಷತೆ",
  monthlyTotal: "ಮಾಸಿಕ ಒಟ್ಟು",
  weatherConditions: "ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು",
  navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  navReports: "ವರದಿಗಳು",
  navConfigure: "ವರ್ಚುವಲ್ ಪ್ಯಾನಲ್",
  navIoT: "IoT ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
  navHelp: "ಸಹಾಯ",
  language: "ಭಾಷೆ",
  theme: "ಥೀಮ್",
  day: "ದಿನ",
  week: "ವಾರ",
  month: "ತಿಂಗಳು",
  optimal: "ಅತ್ಯುತ್ತಮ",
  good: "ಒಳ್ಳೆಯ",
  fair: "ಸರಿ",
  poor: "ಕಳಪೆ",
  userGuide: "ಬಳಕೆದಾರ ಮಾರ್ಗದರ್ಶಿ",
  faqTitle: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
  autoDetectOptimal: "ಸ್ವಯಂ ಪತ್ತೆ",
  autoDetectDesc: "GPS ಸ್ಥಳದ ಆಧಾರದ ಮೇಲೆ ಅತ್ಯುತ್ತಮ ಪ್ಯಾನಲ್ ದಿಕ್ಕನ್ನು ಹೊಂದಿಸಿ.",
};

// --- Telugu ---
const te: Record<TranslationKey, string> = {
  ...en,
  appName: "సన్ పీక్ ఇన్‌సైట్",
  heroSubtitle: "మీ సోలార్ ప్యానెల్ పనితీరును రియల్-టైమ్‌లో పర్యవేక్షించండి.",
  liveMonitoring: "లైవ్ మానిటరింగ్ యాక్టివ్",
  logout: "లాగ్అవుట్",
  loading: "లోడ్ అవుతోంది...",
  systemCapacity: "సిస్టమ్ సామర్థ్యం",
  navDashboard: "డాష్‌బోర్డ్",
  navReports: "రిపోర్ట్‌లు",
  navConfigure: "వర్చువల్ ప్యానెల్",
  navIoT: "IoT సెట్టింగ్‌లు",
  navHelp: "సహాయం",
  language: "భాష",
  theme: "థీమ్",
  day: "రోజు",
  week: "వారం",
  month: "నెల",
  optimal: "అత్యుత్తమ",
  good: "మంచి",
  fair: "సరే",
  poor: "తక్కువ",
  userGuide: "వినియోగదారు గైడ్",
  faqTitle: "తరచుగా అడిగే ప్రశ్నలు",
  autoDetectOptimal: "ఆటో-డిటెక్ట్",
  autoDetectDesc: "GPS ఆధారంగా అత్యుత్తమ ప్యానెల్ దిశను సెట్ చేయండి.",
};

// --- Gujarati ---
const gu: Record<TranslationKey, string> = {
  ...en,
  appName: "સન પીક ઇનસાઇટ",
  heroSubtitle: "તમારા સોલર પેનલની કામગીરી રીઅલ-ટાઇમમાં મોનિટર કરો.",
  liveMonitoring: "લાઇવ મોનિટરિંગ એક્ટિવ",
  logout: "લૉગઆઉટ",
  loading: "લોડ થઈ રહ્યું છે...",
  systemCapacity: "સિસ્ટમ ક્ષમતા",
  navDashboard: "ડેશબોર્ડ",
  navReports: "રિપોર્ટ્સ",
  navConfigure: "વર્ચુઅલ પેનલ",
  navIoT: "IoT સેટિંગ્સ",
  navHelp: "મદદ",
  language: "ભાષા",
  theme: "થીમ",
  day: "દિવસ",
  week: "અઠવાડિયું",
  month: "મહિનો",
  optimal: "શ્રેષ્ઠ",
  good: "સારું",
  fair: "ઠીક",
  poor: "નબળું",
  userGuide: "વપરાશકર્તા માર્ગદર્શિકા",
  faqTitle: "વારંવાર પૂછાતા પ્રશ્નો",
  autoDetectOptimal: "ઓટો-ડિટેક્ટ",
  autoDetectDesc: "GPS સ્થાનના આધારે શ્રેષ્ઠ પેનલ ઓરિએન્ટેશન સેટ કરો.",
};

// --- Malayalam ---
const ml: Record<TranslationKey, string> = {
  ...en,
  appName: "സൺ പീക്ക് ഇൻസൈറ്റ്",
  heroSubtitle: "നിങ്ങളുടെ സോളാർ പാനൽ പ്രകടനം തത്സമയം നിരീക്ഷിക്കുക.",
  liveMonitoring: "ലൈവ് മോണിറ്ററിംഗ് സജീവം",
  logout: "ലോഗൗട്ട്",
  loading: "ലോഡിംഗ്...",
  systemCapacity: "സിസ്റ്റം ശേഷി",
  navDashboard: "ഡാഷ്‌ബോർഡ്",
  navReports: "റിപ്പോർട്ടുകൾ",
  navConfigure: "വെർച്വൽ പാനൽ",
  navIoT: "IoT ക്രമീകരണങ്ങൾ",
  navHelp: "സഹായം",
  language: "ഭാഷ",
  theme: "തീം",
  day: "ദിവസം",
  week: "ആഴ്ച",
  month: "മാസം",
  optimal: "ഉത്തമം",
  good: "നല്ലത്",
  fair: "ശരി",
  poor: "മോശം",
  userGuide: "ഉപയോക്തൃ ഗൈഡ്",
  faqTitle: "പതിവ് ചോദ്യങ്ങൾ",
  autoDetectOptimal: "ഓട്ടോ-ഡിറ്റക്ട്",
  autoDetectDesc: "GPS ലൊക്കേഷൻ അടിസ്ഥാനമാക്കി മികച്ച പാനൽ ദിശ ക്രമീകരിക്കുക.",
};

// --- Punjabi ---
const pa: Record<TranslationKey, string> = {
  ...en,
  appName: "ਸਨ ਪੀਕ ਇਨਸਾਈਟ",
  heroSubtitle: "ਆਪਣੇ ਸੋਲਰ ਪੈਨਲ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਮਾਨੀਟਰ ਕਰੋ.",
  liveMonitoring: "ਲਾਈਵ ਮਾਨੀਟਰਿੰਗ ਐਕਟਿਵ",
  logout: "ਲੌਗਆਊਟ",
  loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
  systemCapacity: "ਸਿਸਟਮ ਸਮਰੱਥਾ",
  navDashboard: "ਡੈਸ਼ਬੋਰਡ",
  navReports: "ਰਿਪੋਰਟਾਂ",
  navConfigure: "ਵਰਚੁਅਲ ਪੈਨਲ",
  navIoT: "IoT ਸੈਟਿੰਗਾਂ",
  navHelp: "ਮਦਦ",
  language: "ਭਾਸ਼ਾ",
  theme: "ਥੀਮ",
  day: "ਦਿਨ",
  week: "ਹਫ਼ਤਾ",
  month: "ਮਹੀਨਾ",
  optimal: "ਸਰਬੋਤਮ",
  good: "ਚੰਗਾ",
  fair: "ਠੀਕ",
  poor: "ਮਾੜਾ",
  userGuide: "ਯੂਜ਼ਰ ਗਾਈਡ",
  faqTitle: "ਅਕਸਰ ਪੁੱਛੇ ਜਾਣ ਵਾਲੇ ਸਵਾਲ",
  autoDetectOptimal: "ਆਟੋ-ਡਿਟੈਕਟ",
  autoDetectDesc: "GPS ਸਥਾਨ ਦੇ ਅਧਾਰ ਤੇ ਸਰਬੋਤਮ ਪੈਨਲ ਦਿਸ਼ਾ ਸੈੱਟ ਕਰੋ.",
};

// --- Urdu ---
const ur: Record<TranslationKey, string> = {
  ...en,
  appName: "سن پیک انسائٹ",
  heroSubtitle: "اپنے سولر پینل کی کارکردگی ریئل ٹائم میں مانیٹر کریں۔",
  liveMonitoring: "لائیو مانیٹرنگ ایکٹو",
  logout: "لاگ آؤٹ",
  loading: "لوڈ ہو رہا ہے...",
  systemCapacity: "سسٹم صلاحیت",
  navDashboard: "ڈیش بورڈ",
  navReports: "رپورٹس",
  navConfigure: "ورچوئل پینل",
  navIoT: "IoT سیٹنگز",
  navHelp: "مدد",
  language: "زبان",
  theme: "تھیم",
  day: "دن",
  week: "ہفتہ",
  month: "مہینہ",
  optimal: "بہترین",
  good: "اچھا",
  fair: "ٹھیک",
  poor: "خراب",
  userGuide: "صارف گائیڈ",
  faqTitle: "اکثر پوچھے جانے والے سوالات",
  autoDetectOptimal: "آٹو ڈیٹیکٹ",
  autoDetectDesc: "GPS لوکیشن کی بنیاد پر بہترین پینل سمت سیٹ کریں۔",
};

export const translations: Translations = { en, hi, mr, ta, bn, kn, te, gu, ml, pa, ur };

export const languageLabels: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
  ta: "தமிழ்",
  bn: "বাংলা",
  kn: "ಕನ್ನಡ",
  te: "తెలుగు",
  gu: "ગુજરાતી",
  ml: "മലയാളം",
  pa: "ਪੰਜਾਬੀ",
  ur: "اردو",
};
