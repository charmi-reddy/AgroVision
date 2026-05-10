import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Language = 'en' | 'hi' | 'te';

interface LanguageCtx {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
}

const STORAGE_KEY = 'agrovision_language';

const translations: Record<Exclude<Language, 'en'>, Record<string, string>> = {
  hi: {
    Overview: 'अवलोकन',
    'Real-time intelligence for your farm': 'आपके खेत के लिए रियल-टाइम जानकारी',
    'Weather Intelligence': 'मौसम जानकारी',
    'Hyperlocal forecasts powered by AI': 'AI आधारित स्थानीय मौसम पूर्वानुमान',
    'Crop Advisory': 'फसल सलाह',
    'Climate-resilient planting recommendations': 'जलवायु-अनुकूल फसल सुझाव',
    'Smart Irrigation': 'स्मार्ट सिंचाई',
    'Optimized watering schedules': 'बेहतर सिंचाई सुझाव',
    'Soil Diagnostics': 'मिट्टी जांच',
    'Deep nutrient & moisture analysis': 'पोषक तत्व और नमी विश्लेषण',
    'Nutrient Plan': 'पोषण योजना',
    'Precision fertilizer prescriptions': 'सटीक उर्वरक सुझाव',
    'Alerts & Insights': 'अलर्ट और जानकारी',
    'Real-time field notifications': 'खेत की रियल-टाइम सूचनाएं',
    Settings: 'सेटिंग्स',
    'Workspace preferences': 'कार्यस्थल प्राथमिकताएं',
    'Farm Details': 'खेत विवरण',
    'Manage your farm information and run analysis': 'खेत की जानकारी संभालें और विश्लेषण चलाएं',
    Workspace: 'कार्यस्थल',
    Insights: 'जानकारी',
    Weather: 'मौसम',
    Irrigation: 'सिंचाई',
    Alerts: 'अलर्ट',
    Logout: 'लॉगआउट',
    farms: 'खेत',
    farm: 'खेत',
    'Select Farm': 'खेत चुनें',
    'Search insights, fields...': 'जानकारी, खेत खोजें...',
    Language: 'भाषा',
    Hindi: 'हिंदी',
    Telugu: 'तेलुगु',
    English: 'English',
    AI: 'AI',
    'Smart System': 'स्मार्ट सिस्टम',
    'AI-powered irrigation from soil sensors + weather forecasts.': 'मिट्टी की नमी और मौसम के आधार पर AI सिंचाई सुझाव।',
    'No Analysis Data Available': 'विश्लेषण डेटा उपलब्ध नहीं',
    'Please go to Farm Details and run an analysis to get personalized irrigation recommendations.': 'व्यक्तिगत सिंचाई सुझाव पाने के लिए खेत विवरण पर जाकर विश्लेषण चलाएं।',
    'Go to Farm Details': 'खेत विवरण पर जाएं',
    'Optimized watering': 'बेहतर पानी सुझाव',
    Today: 'आज',
    Recommendations: 'सुझाव',
    Saved: 'बचत',
    'Irrigation Recommendations': 'सिंचाई सुझाव',
    'AI suggestions only. Nothing is scheduled until you choose Schedule.': 'ये केवल AI सुझाव हैं। जब तक आप शेड्यूल नहीं चुनते, कुछ भी शेड्यूल नहीं होगा।',
    Recommended: 'सुझाया गया',
    'Needs water': 'पानी चाहिए',
    Sufficient: 'पर्याप्त',
    Optional: 'वैकल्पिक',
    Moisture: 'नमी',
    Duration: 'अवधि',
    Water: 'पानी',
    Schedule: 'शेड्यूल करें',
    Scheduled: 'शेड्यूल किया गया',
    'Scheduled Irrigation': 'शेड्यूल की गई सिंचाई',
    scheduled: 'शेड्यूल',
    Unschedule: 'शेड्यूल हटाएं',
    'No irrigation recommendations yet.': 'अभी कोई सिंचाई सुझाव नहीं है।',
  },
  te: {
    Overview: 'అవలోకనం',
    'Real-time intelligence for your farm': 'మీ పొలం కోసం రియల్-టైమ్ సమాచారం',
    'Weather Intelligence': 'వాతావరణ సమాచారం',
    'Hyperlocal forecasts powered by AI': 'AI ఆధారిత స్థానిక వాతావరణ అంచనాలు',
    'Crop Advisory': 'పంట సలహా',
    'Climate-resilient planting recommendations': 'వాతావరణానికి తట్టుకునే పంట సూచనలు',
    'Smart Irrigation': 'స్మార్ట్ నీరుపారుదల',
    'Optimized watering schedules': 'మెరుగైన నీరుపారుదల సూచనలు',
    'Soil Diagnostics': 'మట్టి నిర్ధారణ',
    'Deep nutrient & moisture analysis': 'పోషకాలు మరియు తేమ విశ్లేషణ',
    'Nutrient Plan': 'పోషక ప్రణాళిక',
    'Precision fertilizer prescriptions': 'ఖచ్చితమైన ఎరువు సూచనలు',
    'Alerts & Insights': 'హెచ్చరికలు మరియు సమాచారం',
    'Real-time field notifications': 'పొలం రియల్-టైమ్ నోటిఫికేషన్లు',
    Settings: 'సెట్టింగ్స్',
    'Workspace preferences': 'వర్క్‌స్పేస్ ప్రాధాన్యతలు',
    'Farm Details': 'పొలం వివరాలు',
    'Manage your farm information and run analysis': 'పొలం సమాచారాన్ని నిర్వహించి విశ్లేషణ চালించండి',
    Workspace: 'వర్క్‌స్పేస్',
    Insights: 'సమాచారం',
    Weather: 'వాతావరణం',
    Irrigation: 'నీరుపారుదల',
    Alerts: 'హెచ్చరికలు',
    Logout: 'లాగ్ అవుట్',
    farms: 'పొలాలు',
    farm: 'పొలం',
    'Select Farm': 'పొలం ఎంచుకోండి',
    'Search insights, fields...': 'సమాచారం, పొలాలు వెతకండి...',
    Language: 'భాష',
    Hindi: 'హిందీ',
    Telugu: 'తెలుగు',
    English: 'English',
    AI: 'AI',
    'Smart System': 'స్మార్ట్ వ్యవస్థ',
    'AI-powered irrigation from soil sensors + weather forecasts.': 'మట్టి తేమ మరియు వాతావరణ ఆధారంగా AI నీరుపారుదల సూచనలు.',
    'No Analysis Data Available': 'విశ్లేషణ డేటా లేదు',
    'Please go to Farm Details and run an analysis to get personalized irrigation recommendations.': 'వ్యక్తిగత నీరుపారుదల సూచనల కోసం పొలం వివరాలకు వెళ్లి విశ్లేషణ చేయండి.',
    'Go to Farm Details': 'పొలం వివరాలకు వెళ్లండి',
    'Optimized watering': 'మెరుగైన నీటి సూచనలు',
    Today: 'ఈ రోజు',
    Recommendations: 'సూచనలు',
    Saved: 'ఆదా',
    'Irrigation Recommendations': 'నీరుపారుదల సూచనలు',
    'AI suggestions only. Nothing is scheduled until you choose Schedule.': 'ఇవి కేవలం AI సూచనలు. మీరు షెడ్యూల్ ఎంచుకునే వరకు ఏదీ షెడ్యూల్ కాదు.',
    Recommended: 'సూచించబడింది',
    'Needs water': 'నీరు అవసరం',
    Sufficient: 'సరిపోతుంది',
    Optional: 'ఐచ్ఛికం',
    Moisture: 'తేమ',
    Duration: 'వ్యవధి',
    Water: 'నీరు',
    Schedule: 'షెడ్యూల్',
    Scheduled: 'షెడ్యూల్ చేయబడింది',
    'Scheduled Irrigation': 'షెడ్యూల్ చేసిన నీరుపారుదల',
    scheduled: 'షెడ్యూల్',
    Unschedule: 'షెడ్యూల్ తొలగించండి',
    'No irrigation recommendations yet.': 'ఇంకా నీరుపారుదల సూచనలు లేవు.',
  },
};

const LanguageContext = createContext<LanguageCtx | undefined>(undefined);

const extraTranslations: typeof translations = {
  hi: {
    'Toggle theme': 'थीम बदलें',
    'AI Climate Advisory': 'एआई जलवायु सलाह',
    'AI · Climate Advisory': 'एआई · जलवायु सलाह',
    'Welcome': 'स्वागत है',
    'Sign in to continue': 'जारी रखने के लिए साइन इन करें',
    'Access your personalized AI farm dashboard.': 'अपना व्यक्तिगत एआई खेत डैशबोर्ड खोलें।',
    'See your farm': 'अपने खेत को देखें',
    'like never before.': 'पहले से बेहतर तरीके से।',
    'Email': 'ईमेल',
    'Password': 'पासवर्ड',
    'Remember me': 'मुझे याद रखें',
    'Forgot password?': 'पासवर्ड भूल गए?',
    'Sign In': 'साइन इन',
    'Signing in…': 'साइन इन हो रहा है…',
    'Create Account': 'खाता बनाएं',
    'Create your account in seconds. Your dashboard will stay empty until you add a farm from inside the app.': 'कुछ ही सेकंड में खाता बनाएं। ऐप में खेत जोड़ने तक आपका डैशबोर्ड खाली रहेगा।',
    'Get started': 'शुरू करें',
    'Farm setup happens later inside your dashboard.': 'खेत सेटअप बाद में डैशबोर्ड में होगा।',
    'Full Name': 'पूरा नाम',
    'Name': 'नाम',
    'Creating account…': 'खाता बनाया जा रहा है…',
    'Weather Intelligence': 'मौसम जानकारी',
    'Hyperlocal forecasts powered by AI.': 'एआई आधारित स्थानीय मौसम पूर्वानुमान।',
    'No Weather Data Available': 'मौसम डेटा उपलब्ध नहीं',
    'Please go to': 'कृपया जाएं',
    'and run an analysis to get weather forecasts for your location.': 'और अपने स्थान का मौसम पूर्वानुमान पाने के लिए विश्लेषण चलाएं।',
    '7-Day Forecast': '7 दिन का पूर्वानुमान',
    'AI-powered hyperlocal predictions': 'एआई आधारित स्थानीय अनुमान',
    '94% accuracy': '94% सटीकता',
    'Loading forecast...': 'पूर्वानुमान लोड हो रहा है...',
    'Hourly Temperature': 'घंटेवार तापमान',
    "Today's evolution": 'आज का बदलाव',
    'Rainfall Forecast': 'बारिश का पूर्वानुमान',
    'Precipitation outlook': 'वर्षा की संभावना',
    'No Soil Data Available': 'मिट्टी डेटा उपलब्ध नहीं',
    'Please go to Farm Details and run an analysis to get soil diagnostics for your farm.': 'अपने खेत की मिट्टी जांच पाने के लिए खेत विवरण पर जाकर विश्लेषण चलाएं।',
    'Deep soil intelligence': 'गहरी मिट्टी जानकारी',
    'Live sensor data · Updated in real-time': 'लाइव सेंसर डेटा · रियल-टाइम अपडेट',
    'Loading soil data...': 'मिट्टी डेटा लोड हो रहा है...',
    'Soil Profile': 'मिट्टी प्रोफाइल',
    'Current vs optimal': 'वर्तमान बनाम आदर्श',
    'Analyzed': 'विश्लेषित',
    'Trends': 'रुझान',
    '6-week monitoring': '6 सप्ताह निगरानी',
    'Improving': 'सुधार हो रहा है',
    'No Crop Recommendations Available': 'फसल सुझाव उपलब्ध नहीं',
    'Please go to Farm Details and run an analysis to get personalized crop recommendations.': 'व्यक्तिगत फसल सुझाव पाने के लिए खेत विवरण पर जाकर विश्लेषण चलाएं।',
    'Climate-resilient': 'जलवायु-अनुकूल',
    'crop selection': 'फसल चयन',
    'Water need': 'पानी की जरूरत',
    'AI Confidence': 'एआई भरोसा',
    'AI Analysis': 'एआई विश्लेषण',
    'Add to plan': 'योजना में जोड़ें',
    'Loading crop recommendations from AI...': 'एआई से फसल सुझाव लोड हो रहे हैं...',
    'No Alerts Available': 'अलर्ट उपलब्ध नहीं',
    'Please go to Farm Details and run an analysis to get real-time alerts and insights.': 'रियल-टाइम अलर्ट और जानकारी पाने के लिए खेत विवरण पर जाकर विश्लेषण चलाएं।',
    'alerts': 'अलर्ट',
    'need your attention': 'आपका ध्यान चाहिए',
    'AI alerts from weather, pest, soil & market analytics.': 'मौसम, कीट, मिट्टी और बाजार विश्लेषण से एआई अलर्ट।',
    'Unread': 'नहीं पढ़े',
    'Total': 'कुल',
    'Type': 'प्रकार',
    'Mark read': 'पढ़ा हुआ करें',
    'Details': 'विवरण',
    'No alerts': 'कोई अलर्ट नहीं',
    'All clear — your farm is in good shape': 'सब ठीक है — आपका खेत अच्छी स्थिति में है',
    'No Fertilizer Plan Available': 'उर्वरक योजना उपलब्ध नहीं',
    'Please go to Farm Details and run an analysis to get personalized fertilizer recommendations.': 'व्यक्तिगत उर्वरक सुझाव पाने के लिए खेत विवरण पर जाकर विश्लेषण चलाएं।',
    'Smart nutrient plans': 'स्मार्ट पोषण योजनाएं',
    'AI-calculated prescriptions from soil data.': 'मिट्टी डेटा से एआई द्वारा गणना किए गए सुझाव।',
    'Treatment Plan': 'उपचार योजना',
    'AI-prescribed applications': 'एआई सुझाए गए उपयोग',
    'Immediate': 'तुरंत',
    'Scheduled': 'योजनाबद्ध',
    'Applied': 'लागू किया',
    'Loading fertilizer recommendations...': 'उर्वरक सुझाव लोड हो रहे हैं...',
    'No active farm selected.': 'कोई सक्रिय खेत चयनित नहीं है।',
    'How to Get Farm Analysis': 'खेत विश्लेषण कैसे पाएं',
    'Basic Information': 'मूल जानकारी',
    'Crop': 'फसल',
    'Irrigation Amount (mm/season)': 'सिंचाई मात्रा (मिमी/सीजन)',
    'Irrigation Source': 'सिंचाई स्रोत',
    'Fertilizer Used': 'उपयोग किया गया उर्वरक',
    'Farm Name': 'खेत का नाम',
    'Location': 'स्थान',
    'Soil Type': 'मिट्टी का प्रकार',
    'Area (acres)': 'क्षेत्रफल (एकड़)',
    'Select soil type *': 'मिट्टी का प्रकार चुनें *',
    'Clay': 'चिकनी मिट्टी',
    'Sandy': 'रेतीली',
    'Loamy': 'दोमट',
    'Silt': 'गाद मिट्टी',
    'Peat': 'पीट',
    'Please fill in all required fields marked with * to enable analysis.': 'विश्लेषण के लिए * वाले सभी आवश्यक फ़ील्ड भरें।',
    'Save Changes': 'बदलाव सहेजें',
    'Run Analysis': 'विश्लेषण चलाएं',
    'Re-run Analysis': 'विश्लेषण फिर चलाएं',
    'Running Analysis...': 'विश्लेषण चल रहा है...',
    'Farm details saved successfully!': 'खेत विवरण सफलतापूर्वक सहेजा गया!',
    'Loading your farm data...': 'आपका खेत डेटा लोड हो रहा है...',
    'Ready for Analysis': 'विश्लेषण के लिए तैयार',
    'Your farm is set up. Run an analysis to get personalized insights.': 'आपका खेत सेट है। व्यक्तिगत जानकारी पाने के लिए विश्लेषण चलाएं।',
    'Run Your First Analysis': 'अपना पहला विश्लेषण चलाएं',
    'Health': 'स्वास्थ्य',
    'Forecast': 'पूर्वानुमान',
    '7-day temperature': '7 दिन का तापमान',
    'Top recommendation': 'मुख्य सुझाव',
    'Confidence': 'भरोसा',
    'Active Alerts': 'सक्रिय अलर्ट',
    'Appearance': 'दिखावट',
    'Choose your theme': 'अपनी थीम चुनें',
    'Profile': 'प्रोफाइल',
    'Your account information': 'आपकी खाता जानकारी',
    'My Farms': 'मेरे खेत',
    'New Farm': 'नया खेत',
    'Cancel': 'रद्द करें',
    'Add Farm': 'खेत जोड़ें',
    'Active': 'सक्रिय',
    'No farms yet': 'अभी कोई खेत नहीं',
    'Click "Add Farm" to get started': 'शुरू करने के लिए "खेत जोड़ें" क्लिक करें',
    'Notifications': 'सूचनाएं',
    'Manage alerts': 'अलर्ट संभालें',
    'AI & Data': 'एआई और डेटा',
    'ML preferences': 'एमएल प्राथमिकताएं',
    'Auto ML Updates': 'स्वचालित एमएल अपडेट',
    'Retrain with new data': 'नए डेटा से फिर प्रशिक्षण',
    'Data Sharing': 'डेटा साझा करना',
    'Anonymized community': 'गुमनाम समुदाय',
    'IoT Sync': 'आईओटी सिंक',
    'Sensor frequency': 'सेंसर आवृत्ति',
    'System': 'सिस्टम',
    'Save settings': 'सेटिंग्स सहेजें',
    'Search village, city, district...': 'गांव, शहर, जिला खोजें...',
    'Use my current location': 'मेरा वर्तमान स्थान उपयोग करें',
    'Latitude': 'अक्षांश',
    'Longitude': 'देशांतर',
    'Farm Location Map': 'खेत स्थान मानचित्र',
    'Quick:': 'त्वरित:',
  },
  te: {
    'Toggle theme': 'థీమ్ మార్చండి',
    'AI Climate Advisory': 'ఏఐ వాతావరణ సలహా',
    'AI · Climate Advisory': 'ఏఐ · వాతావరణ సలహా',
    'Welcome': 'స్వాగతం',
    'Sign in to continue': 'కొనసాగించడానికి సైన్ ఇన్ చేయండి',
    'Access your personalized AI farm dashboard.': 'మీ వ్యక్తిగత ఏఐ పొలం డ్యాష్‌బోర్డ్ తెరవండి.',
    'See your farm': 'మీ పొలాన్ని చూడండి',
    'like never before.': 'ఇంతకుముందెన్నడూ లేనంతగా.',
    'Email': 'ఇమెయిల్',
    'Password': 'పాస్‌వర్డ్',
    'Remember me': 'నన్ను గుర్తుంచుకోండి',
    'Forgot password?': 'పాస్‌వర్డ్ మర్చిపోయారా?',
    'Sign In': 'సైన్ ఇన్',
    'Signing in…': 'సైన్ ఇన్ అవుతోంది…',
    'Create Account': 'ఖాతా సృష్టించండి',
    'Create your account in seconds. Your dashboard will stay empty until you add a farm from inside the app.': 'కొన్ని సెకన్లలో ఖాతా సృష్టించండి. యాప్‌లో పొలం జోడించే వరకు డ్యాష్‌బోర్డ్ ఖాళీగా ఉంటుంది.',
    'Get started': 'ప్రారంభించండి',
    'Farm setup happens later inside your dashboard.': 'పొలం సెటప్ తర్వాత డ్యాష్‌బోర్డ్‌లో జరుగుతుంది.',
    'Full Name': 'పూర్తి పేరు',
    'Name': 'పేరు',
    'Creating account…': 'ఖాతా సృష్టిస్తోంది…',
    'Hyperlocal forecasts powered by AI.': 'ఏఐ ఆధారిత స్థానిక వాతావరణ అంచనాలు.',
    'No Weather Data Available': 'వాతావరణ డేటా లేదు',
    'Please go to': 'దయచేసి వెళ్లండి',
    'and run an analysis to get weather forecasts for your location.': 'మరియు మీ స్థానానికి వాతావరణ అంచనాలు పొందడానికి విశ్లేషణ చేయండి.',
    '7-Day Forecast': '7 రోజుల అంచనా',
    'AI-powered hyperlocal predictions': 'ఏఐ ఆధారిత స్థానిక అంచనాలు',
    '94% accuracy': '94% ఖచ్చితత్వం',
    'Loading forecast...': 'అంచనా లోడ్ అవుతోంది...',
    'Hourly Temperature': 'గంటల వారీ ఉష్ణోగ్రత',
    "Today's evolution": 'ఈరోజు మార్పు',
    'Rainfall Forecast': 'వర్షపు అంచనా',
    'Precipitation outlook': 'వర్షపాతం సూచన',
    'No Soil Data Available': 'మట్టి డేటా లేదు',
    'Please go to Farm Details and run an analysis to get soil diagnostics for your farm.': 'మీ పొలం మట్టి నిర్ధారణ కోసం పొలం వివరాలకు వెళ్లి విశ్లేషణ చేయండి.',
    'Deep soil intelligence': 'లోతైన మట్టి సమాచారం',
    'Live sensor data · Updated in real-time': 'లైవ్ సెన్సర్ డేటా · రియల్-టైమ్ నవీకరణ',
    'Loading soil data...': 'మట్టి డేటా లోడ్ అవుతోంది...',
    'Soil Profile': 'మట్టి ప్రొఫైల్',
    'Current vs optimal': 'ప్రస్తుత vs సరైనది',
    'Analyzed': 'విశ్లేషించబడింది',
    'Trends': 'ధోరణులు',
    '6-week monitoring': '6 వారాల పర్యవేక్షణ',
    'Improving': 'మెరుగవుతోంది',
    'No Crop Recommendations Available': 'పంట సూచనలు లేవు',
    'Please go to Farm Details and run an analysis to get personalized crop recommendations.': 'వ్యక్తిగత పంట సూచనల కోసం పొలం వివరాలకు వెళ్లి విశ్లేషణ చేయండి.',
    'Climate-resilient': 'వాతావరణానికి తట్టుకునే',
    'crop selection': 'పంట ఎంపిక',
    'Water need': 'నీటి అవసరం',
    'AI Confidence': 'ఏఐ నమ్మకం',
    'AI Analysis': 'ఏఐ విశ్లేషణ',
    'Add to plan': 'ప్రణాళికలో జోడించండి',
    'Loading crop recommendations from AI...': 'ఏఐ నుండి పంట సూచనలు లోడ్ అవుతున్నాయి...',
    'No Alerts Available': 'హెచ్చరికలు లేవు',
    'Please go to Farm Details and run an analysis to get real-time alerts and insights.': 'రియల్-టైమ్ హెచ్చరికలు మరియు సమాచారం కోసం పొలం వివరాలకు వెళ్లి విశ్లేషణ చేయండి.',
    'alerts': 'హెచ్చరికలు',
    'need your attention': 'మీ శ్రద్ధ అవసరం',
    'AI alerts from weather, pest, soil & market analytics.': 'వాతావరణం, పురుగు, మట్టి మరియు మార్కెట్ విశ్లేషణల నుండి ఏఐ హెచ్చరికలు.',
    'Unread': 'చదవని',
    'Total': 'మొత్తం',
    'Type': 'రకం',
    'Mark read': 'చదివినట్టు గుర్తించు',
    'Details': 'వివరాలు',
    'No alerts': 'హెచ్చరికలు లేవు',
    'All clear — your farm is in good shape': 'అన్నీ బాగున్నాయి — మీ పొలం మంచి స్థితిలో ఉంది',
    'No Fertilizer Plan Available': 'ఎరువు ప్రణాళిక లేదు',
    'Please go to Farm Details and run an analysis to get personalized fertilizer recommendations.': 'వ్యక్తిగత ఎరువు సూచనల కోసం పొలం వివరాలకు వెళ్లి విశ్లేషణ చేయండి.',
    'Smart nutrient plans': 'స్మార్ట్ పోషక ప్రణాళికలు',
    'AI-calculated prescriptions from soil data.': 'మట్టి డేటా నుండి ఏఐ లెక్కించిన సూచనలు.',
    'Treatment Plan': 'చికిత్స ప్రణాళిక',
    'AI-prescribed applications': 'ఏఐ సూచించిన వినియోగాలు',
    'Immediate': 'తక్షణం',
    'Scheduled': 'ప్రణాళికబద్ధం',
    'Applied': 'వర్తింపజేశారు',
    'Loading fertilizer recommendations...': 'ఎరువు సూచనలు లోడ్ అవుతున్నాయి...',
    'No active farm selected.': 'సక్రియ పొలం ఎంచుకోలేదు.',
    'How to Get Farm Analysis': 'పొలం విశ్లేషణ ఎలా పొందాలి',
    'Basic Information': 'ప్రాథమిక సమాచారం',
    'Crop': 'పంట',
    'Irrigation Amount (mm/season)': 'నీరుపారుదల పరిమాణం (మిమీ/సీజన్)',
    'Irrigation Source': 'నీరుపారుదల మూలం',
    'Fertilizer Used': 'వాడిన ఎరువు',
    'Farm Name': 'పొలం పేరు',
    'Location': 'స్థానం',
    'Soil Type': 'మట్టి రకం',
    'Area (acres)': 'విస్తీర్ణం (ఎకరాలు)',
    'Select soil type *': 'మట్టి రకం ఎంచుకోండి *',
    'Clay': 'బంకమట్టి',
    'Sandy': 'ఇసుక మట్టి',
    'Loamy': 'లోమీ',
    'Silt': 'సిల్ట్',
    'Peat': 'పీట్',
    'Please fill in all required fields marked with * to enable analysis.': 'విశ్లేషణ కోసం * ఉన్న అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి.',
    'Save Changes': 'మార్పులు సేవ్ చేయండి',
    'Run Analysis': 'విశ్లేషణ చేయండి',
    'Re-run Analysis': 'మళ్లీ విశ్లేషించండి',
    'Running Analysis...': 'విశ్లేషణ జరుగుతోంది...',
    'Farm details saved successfully!': 'పొలం వివరాలు విజయవంతంగా సేవ్ అయ్యాయి!',
    'Loading your farm data...': 'మీ పొలం డేటా లోడ్ అవుతోంది...',
    'Ready for Analysis': 'విశ్లేషణకు సిద్ధం',
    'Your farm is set up. Run an analysis to get personalized insights.': 'మీ పొలం సిద్ధంగా ఉంది. వ్యక్తిగత సమాచారం కోసం విశ్లేషణ చేయండి.',
    'Run Your First Analysis': 'మీ మొదటి విశ్లేషణ చేయండి',
    'Health': 'ఆరోగ్యం',
    'Forecast': 'అంచనా',
    '7-day temperature': '7 రోజుల ఉష్ణోగ్రత',
    'Top recommendation': 'ప్రధాన సూచన',
    'Confidence': 'నమ్మకం',
    'Active Alerts': 'సక్రియ హెచ్చరికలు',
    'Appearance': 'రూపం',
    'Choose your theme': 'మీ థీమ్ ఎంచుకోండి',
    'Profile': 'ప్రొఫైల్',
    'Your account information': 'మీ ఖాతా సమాచారం',
    'My Farms': 'నా పొలాలు',
    'New Farm': 'కొత్త పొలం',
    'Cancel': 'రద్దు',
    'Add Farm': 'పొలం జోడించండి',
    'Active': 'సక్రియం',
    'No farms yet': 'ఇంకా పొలాలు లేవు',
    'Click "Add Farm" to get started': 'ప్రారంభించడానికి "పొలం జోడించండి" క్లిక్ చేయండి',
    'Notifications': 'నోటిఫికేషన్లు',
    'Manage alerts': 'హెచ్చరికలు నిర్వహించండి',
    'AI & Data': 'ఏఐ మరియు డేటా',
    'ML preferences': 'ఎంఎల్ ప్రాధాన్యతలు',
    'Auto ML Updates': 'ఆటో ఎంఎల్ నవీకరణలు',
    'Retrain with new data': 'కొత్త డేటాతో మళ్లీ శిక్షణ',
    'Data Sharing': 'డేటా పంచుకోవడం',
    'Anonymized community': 'అనామక సముదాయం',
    'IoT Sync': 'ఐఓటి సింక్',
    'Sensor frequency': 'సెన్సర్ ఫ్రీక్వెన్సీ',
    'System': 'సిస్టమ్',
    'Save settings': 'సెట్టింగ్స్ సేవ్ చేయండి',
    'Search village, city, district...': 'గ్రామం, నగరం, జిల్లా వెతకండి...',
    'Use my current location': 'నా ప్రస్తుత స్థానాన్ని ఉపయోగించండి',
    'Latitude': 'అక్షాంశం',
    'Longitude': 'రేఖాంశం',
    'Farm Location Map': 'పొలం స్థాన మ్యాప్',
    'Quick:': 'త్వరగా:',
  },
};

Object.assign(translations.hi, extraTranslations.hi);
Object.assign(translations.te, extraTranslations.te);

const textNodeOriginals = new WeakMap<Text, string>();
const attrOriginals = new WeakMap<Element, Record<string, string>>();

const reverseTranslations = Object.values(translations).reduce<Record<string, string>>((acc, dict) => {
  Object.entries(dict).forEach(([english, translated]) => {
    acc[translated.replace(/\s+/g, ' ')] = english;
  });
  return acc;
}, {});

function getTextParts(text: string) {
  const leading = text.match(/^\s*/)?.[0] || '';
  const trailing = text.match(/\s*$/)?.[0] || '';
  const core = text.trim().replace(/\s+/g, ' ');
  return { leading, trailing, core };
}

function toEnglishSource(text: string) {
  const { leading, trailing, core } = getTextParts(text);
  const english = reverseTranslations[core];
  return english ? `${leading}${english}${trailing}` : text;
}

function translateText(text: string, language: Language) {
  if (language === 'en') return text;
  const dict = translations[language];
  const { leading, trailing, core } = getTextParts(text);
  return dict[core] ? `${leading}${dict[core]}${trailing}` : text;
}

function translatePage(language: Language) {
  const root = document.body;
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node = walker.nextNode() as Text | null;
  while (node) {
    if (!textNodeOriginals.has(node)) textNodeOriginals.set(node, toEnglishSource(node.textContent || ''));
    const translated = translateText(textNodeOriginals.get(node) || '', language);
    if (node.textContent !== translated) node.textContent = translated;
    node = walker.nextNode() as Text | null;
  }

  root.querySelectorAll('input, textarea, button, iframe, [title], [aria-label]').forEach(element => {
    const attrs = ['placeholder', 'title', 'aria-label'];
    const original = attrOriginals.get(element) || {};
    attrs.forEach(attr => {
      const value = element.getAttribute(attr);
      if (!value) return;
      if (!original[attr]) original[attr] = toEnglishSource(value);
      const translated = translateText(original[attr], language);
      if (element.getAttribute(attr) !== translated) element.setAttribute(attr, translated);
    });
    attrOriginals.set(element, original);
  });
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'hi' || stored === 'te' ? stored : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    const run = () => translatePage(language);
    run();
    const observer = new MutationObserver(() => window.requestAnimationFrame(run));
    if (document.body) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo<LanguageCtx>(() => ({
    language,
    setLanguage: setLanguageState,
    t: (text: string) => language === 'en' ? text : translations[language][text] || text,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
