import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail } from 'lucide-react';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('about.project_vision_title')}</h2>
            <p className="text-gray-700 mb-4">
              {t('about.project_vision_desc_1')}
            </p>
            <p className="text-gray-700 mb-6">
              {t('about.project_vision_desc_2')}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('about.problems_title')}</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{t('about.problem_1')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{t('about.problem_2')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{t('about.problem_3')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{t('about.problem_4')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('about.solutions_title')}</h2>
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">{t('about.solution_1_title')}</h4>
                <p className="text-emerald-700 text-sm">
                  {t('about.solution_1_desc')}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">{t('about.solution_2_title')}</h4>
                <p className="text-blue-700 text-sm">
                  {t('about.solution_2_desc')}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">{t('about.solution_3_title')}</h4>
                <p className="text-purple-700 text-sm">
                  {t('about.solution_3_desc')}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">{t('about.solution_4_title')}</h4>
                <p className="text-orange-700 text-sm">
                  {t('about.solution_4_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t('contact.info_title')}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('about.contact_uni_title')}
              </h3>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900">{t('about.contact_uni_switchboard')}</h4>
                  <p>{t('common.tel')} (0216) 578 00 00 (pbx)</p>
                  <p>{t('common.fax')} (0216) 578 02 99</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">{t('about.contact_uni_address_title')}</h4>
                  <p>{t('about.contact_uni_address_line1')}</p>
                  <p>{t('about.contact_uni_address_line2')}</p>
                  <p>{t('about.contact_uni_address_line3')}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">{t('about.contact_transport_service')}</h4>
                  <p>{t('common.tel')} (0216) 578 01 34 - (0216) 578 01 35</p>
                  <p>{t('common.email_short')} istekservis@istek.org.tr</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">{t('about.contact_transport_options_title')}</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• {t('about.transport_option_1')}</li>
                  <li>• {t('about.transport_option_2')}</li>
                  <li>• {t('about.transport_option_3')}</li>
                  <li>• {t('about.transport_option_4')}</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('about.location_title')}</h3>
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                <iframe
                  src="https://maps.google.com/maps?q=40.922814360284555,29.31736328237939&hl=tr&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '0.5rem' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('about.location_iframe_title')}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
