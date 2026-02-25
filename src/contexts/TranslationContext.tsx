import React, { createContext, useContext, ReactNode } from 'react';
import { usePreferences } from './UserPreferencesContext';

type TranslationKey =
  | 'overview' | 'local_updates' | 'risk_forecast' | 'asean_status' | 'global_alerts'
  | 'survival_guide' | 'details' | 'home' | 'map' | 'contacts' | 'profile'
  | 'alerts' | 'sign_out' | 'your_location' | 'edit_location' | 'share_location'
  | 'current_status' | 'get_evacuation_guide' | 'unread_alerts' | 'active_zones'
  | 'shelters' | 'nearest_emergency' | 'language' | 'settings' | 'view_full_map'
  | 'active_disasters' | 'people_affected' | 'recent_events' | 'disaster_map'
  | 'related_news' | 'breaking' | 'stable' | 'caution' | 'critical'
  | 'near_evacuation' | 'caution_zone' | 'danger_zone' | 'go_back'
  | 'country_not_found' | 'save' | 'cancel' | 'search_location';

const translations: Record<string, Record<TranslationKey, string>> = {
  English: {
    overview: 'Overview', local_updates: 'Local Updates', risk_forecast: 'Risk Forecast',
    asean_status: 'ASEAN Status', global_alerts: 'Global Alerts', survival_guide: 'Quick Survival Guide',
    details: 'Details', home: 'Home', map: 'Map', contacts: 'Contacts', profile: 'Profile',
    alerts: 'Alerts', sign_out: 'Sign Out', your_location: 'Your Location',
    edit_location: 'Edit Location', share_location: 'Share Location',
    current_status: 'Your Current Status', get_evacuation_guide: 'Get Evacuation Guide',
    unread_alerts: 'Unread Alerts', active_zones: 'Active Zones', shelters: 'Shelters',
    nearest_emergency: 'Nearest Emergency', language: 'Language', settings: 'Settings',
    view_full_map: 'View Full Map', active_disasters: 'Active Disasters',
    people_affected: 'People Affected', recent_events: 'Recent Events',
    disaster_map: 'Disaster Map', related_news: 'Related News', breaking: 'BREAKING',
    stable: 'Stable', caution: 'Caution', critical: 'Critical',
    near_evacuation: 'Near Evacuation Point', caution_zone: 'Caution Zone',
    danger_zone: 'Danger Zone', go_back: 'Go Back', country_not_found: 'Country not found',
    save: 'Save', cancel: 'Cancel', search_location: 'Search location...',
  },
  'Bahasa Indonesia': {
    overview: 'Ringkasan', local_updates: 'Berita Lokal', risk_forecast: 'Prakiraan Risiko',
    asean_status: 'Status ASEAN', global_alerts: 'Peringatan Global', survival_guide: 'Panduan Darurat',
    details: 'Detail', home: 'Beranda', map: 'Peta', contacts: 'Kontak', profile: 'Profil',
    alerts: 'Peringatan', sign_out: 'Keluar', your_location: 'Lokasi Anda',
    edit_location: 'Ubah Lokasi', share_location: 'Bagikan Lokasi',
    current_status: 'Status Anda Saat Ini', get_evacuation_guide: 'Panduan Evakuasi',
    unread_alerts: 'Belum Dibaca', active_zones: 'Zona Aktif', shelters: 'Tempat Evakuasi',
    nearest_emergency: 'Darurat Terdekat', language: 'Bahasa', settings: 'Pengaturan',
    view_full_map: 'Lihat Peta Lengkap', active_disasters: 'Bencana Aktif',
    people_affected: 'Orang Terdampak', recent_events: 'Kejadian Terkini',
    disaster_map: 'Peta Bencana', related_news: 'Berita Terkait', breaking: 'TERKINI',
    stable: 'Aman', caution: 'Waspada', critical: 'Kritis',
    near_evacuation: 'Dekat Titik Evakuasi', caution_zone: 'Zona Waspada',
    danger_zone: 'Zona Bahaya', go_back: 'Kembali', country_not_found: 'Negara tidak ditemukan',
    save: 'Simpan', cancel: 'Batal', search_location: 'Cari lokasi...',
  },
  Filipino: {
    overview: 'Pangkalahatang-ideya', local_updates: 'Lokal na Balita', risk_forecast: 'Pagtataya ng Panganib',
    asean_status: 'Status ng ASEAN', global_alerts: 'Pandaigdigang Alerto', survival_guide: 'Gabay sa Kaligtasan',
    details: 'Detalye', home: 'Tahanan', map: 'Mapa', contacts: 'Kontak', profile: 'Profile',
    alerts: 'Mga Alerto', sign_out: 'Mag-sign out', your_location: 'Iyong Lokasyon',
    edit_location: 'I-edit ang Lokasyon', share_location: 'Ibahagi ang Lokasyon',
    current_status: 'Kasalukuyang Kalagayan', get_evacuation_guide: 'Gabay sa Paglikas',
    unread_alerts: 'Hindi pa Nabasa', active_zones: 'Aktibong Zona', shelters: 'Evacuation Center',
    nearest_emergency: 'Pinakamalapit na Emergency', language: 'Wika', settings: 'Settings',
    view_full_map: 'Tingnan ang Buong Mapa', active_disasters: 'Aktibong Kalamidad',
    people_affected: 'Apektadong Tao', recent_events: 'Kamakailang Pangyayari',
    disaster_map: 'Mapa ng Kalamidad', related_news: 'Kaugnay na Balita', breaking: 'BALITA',
    stable: 'Stable', caution: 'Babala', critical: 'Kritikal',
    near_evacuation: 'Malapit sa Evacuation', caution_zone: 'Zona ng Babala',
    danger_zone: 'Zona ng Panganib', go_back: 'Bumalik', country_not_found: 'Hindi nahanap ang bansa',
    save: 'I-save', cancel: 'Kanselahin', search_location: 'Maghanap ng lokasyon...',
  },
  'ภาษาไทย': {
    overview: 'ภาพรวม', local_updates: 'ข่าวท้องถิ่น', risk_forecast: 'การพยากรณ์ความเสี่ยง',
    asean_status: 'สถานะอาเซียน', global_alerts: 'การแจ้งเตือนทั่วโลก', survival_guide: 'คู่มือเอาตัวรอด',
    details: 'รายละเอียด', home: 'หน้าแรก', map: 'แผนที่', contacts: 'ผู้ติดต่อ', profile: 'โปรไฟล์',
    alerts: 'การแจ้งเตือน', sign_out: 'ออกจากระบบ', your_location: 'ตำแหน่งของคุณ',
    edit_location: 'แก้ไขตำแหน่ง', share_location: 'แชร์ตำแหน่ง',
    current_status: 'สถานะปัจจุบัน', get_evacuation_guide: 'คู่มืออพยพ',
    unread_alerts: 'ยังไม่ได้อ่าน', active_zones: 'โซนที่ใช้งาน', shelters: 'ที่พักพิง',
    nearest_emergency: 'ฉุกเฉินที่ใกล้ที่สุด', language: 'ภาษา', settings: 'การตั้งค่า',
    view_full_map: 'ดูแผนที่เต็ม', active_disasters: 'ภัยพิบัติที่ดำเนินอยู่',
    people_affected: 'ผู้ได้รับผลกระทบ', recent_events: 'เหตุการณ์ล่าสุด',
    disaster_map: 'แผนที่ภัยพิบัติ', related_news: 'ข่าวที่เกี่ยวข้อง', breaking: 'ด่วน',
    stable: 'ปลอดภัย', caution: 'ระวัง', critical: 'วิกฤต',
    near_evacuation: 'ใกล้จุดอพยพ', caution_zone: 'เขตเฝ้าระวัง',
    danger_zone: 'เขตอันตราย', go_back: 'กลับ', country_not_found: 'ไม่พบประเทศ',
    save: 'บันทึก', cancel: 'ยกเลิก', search_location: 'ค้นหาตำแหน่ง...',
  },
  'Tiếng Việt': {
    overview: 'Tổng quan', local_updates: 'Tin địa phương', risk_forecast: 'Dự báo rủi ro',
    asean_status: 'Tình trạng ASEAN', global_alerts: 'Cảnh báo toàn cầu', survival_guide: 'Hướng dẫn sinh tồn',
    details: 'Chi tiết', home: 'Trang chủ', map: 'Bản đồ', contacts: 'Liên hệ', profile: 'Hồ sơ',
    alerts: 'Cảnh báo', sign_out: 'Đăng xuất', your_location: 'Vị trí của bạn',
    edit_location: 'Sửa vị trí', share_location: 'Chia sẻ vị trí',
    current_status: 'Trạng thái hiện tại', get_evacuation_guide: 'Hướng dẫn sơ tán',
    unread_alerts: 'Chưa đọc', active_zones: 'Vùng hoạt động', shelters: 'Nơi trú ẩn',
    nearest_emergency: 'Khẩn cấp gần nhất', language: 'Ngôn ngữ', settings: 'Cài đặt',
    view_full_map: 'Xem bản đồ đầy đủ', active_disasters: 'Thiên tai đang diễn ra',
    people_affected: 'Người bị ảnh hưởng', recent_events: 'Sự kiện gần đây',
    disaster_map: 'Bản đồ thiên tai', related_news: 'Tin liên quan', breaking: 'NÓNG',
    stable: 'Ổn định', caution: 'Cảnh giác', critical: 'Nghiêm trọng',
    near_evacuation: 'Gần điểm sơ tán', caution_zone: 'Vùng cảnh báo',
    danger_zone: 'Vùng nguy hiểm', go_back: 'Quay lại', country_not_found: 'Không tìm thấy quốc gia',
    save: 'Lưu', cancel: 'Hủy', search_location: 'Tìm vị trí...',
  },
  'Bahasa Melayu': {
    overview: 'Gambaran', local_updates: 'Berita Tempatan', risk_forecast: 'Ramalan Risiko',
    asean_status: 'Status ASEAN', global_alerts: 'Amaran Global', survival_guide: 'Panduan Keselamatan',
    details: 'Butiran', home: 'Utama', map: 'Peta', contacts: 'Hubungi', profile: 'Profil',
    alerts: 'Amaran', sign_out: 'Log Keluar', your_location: 'Lokasi Anda',
    edit_location: 'Edit Lokasi', share_location: 'Kongsi Lokasi',
    current_status: 'Status Semasa', get_evacuation_guide: 'Panduan Pemindahan',
    unread_alerts: 'Belum Dibaca', active_zones: 'Zon Aktif', shelters: 'Tempat Perlindungan',
    nearest_emergency: 'Kecemasan Terdekat', language: 'Bahasa', settings: 'Tetapan',
    view_full_map: 'Lihat Peta Penuh', active_disasters: 'Bencana Aktif',
    people_affected: 'Orang Terjejas', recent_events: 'Peristiwa Terkini',
    disaster_map: 'Peta Bencana', related_news: 'Berita Berkaitan', breaking: 'TERKINI',
    stable: 'Stabil', caution: 'Berhati-hati', critical: 'Kritikal',
    near_evacuation: 'Dekat Pusat Pemindahan', caution_zone: 'Zon Amaran',
    danger_zone: 'Zon Bahaya', go_back: 'Kembali', country_not_found: 'Negara tidak dijumpai',
    save: 'Simpan', cancel: 'Batal', search_location: 'Cari lokasi...',
  },
};

// Map language setting names to translation keys
const languageMap: Record<string, string> = {
  'Indonesian': 'Bahasa Indonesia',
  'Filipino': 'Filipino',
  'Thai': 'ภาษาไทย',
  'Vietnamese': 'Tiếng Việt',
  'Malay': 'Bahasa Melayu',
  'English': 'English',
  'Burmese': 'English',
  'Khmer': 'English',
  'Lao': 'English',
};

interface TranslationContextType {
  t: (key: TranslationKey) => string;
  currentLanguage: string;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key) => key,
  currentLanguage: 'English',
});

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { preferences } = usePreferences();
  const langKey = languageMap[preferences.language] || 'English';
  const dict = translations[langKey] || translations['English'];

  const t = (key: TranslationKey): string => dict[key] || translations['English'][key] || key;

  return (
    <TranslationContext.Provider value={{ t, currentLanguage: langKey }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
