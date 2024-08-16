import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          shipment_details: "Shipment Details",
          shipment_id: "Shipment ID",
          origin: "Origin",
          destination: "Destination",
          current_location: "Current Location",
          status: "Status",
          eta: "ETA",
          save_changes: "Save Changes",
          cancel: "Cancel",
          shipment_progress: "Shipment Progress",
          edit: "Edit",
          go_back_to_main_page: "Go Back to Main Page"
        }
      },
      hi: {
        translation: {
          shipment_details: "शिपमेंट विवरण",
          shipment_id: "शिपमेंट आईडी",
          origin: "मूल",
          destination: "गंतव्य",
          current_location: "वर्तमान स्थान",
          status: "स्थिति",
          eta: "अनुमानित समय",
          save_changes: "परिवर्तन सहेजें",
          cancel: "रद्द करें",
          shipment_progress: "शिपमेंट प्रगति",
          edit: "संपादित करें",
          go_back_to_main_page: "मुख्य पृष्ठ पर वापस जाएं"
        }
      }
    }
  });

export default i18n;
