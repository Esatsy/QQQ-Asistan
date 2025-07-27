import { useState } from 'react'
import './App.css'

// Karar ağacı yapısı
const decisionTree = [
  {
    id: 1,
    question: 'Firmanız hangi bölgelerde faaliyet göstermektedir?',
    options: [
      { text: 'Sadece Türkiye', next: 2 },
      { text: 'Sadece AB ülkeleri', next: 3 },
      { text: 'Her iki bölgede', next: 3 },
    ],
  },
  {
    id: 2,
    question: 'Türkiye\'de faaliyet gösteriyorsunuz. Peki AB ülkelerine ürün, hizmet veya yazılım sunuyor musunuz?',
    options: [
      { text: 'Evet', next: 3 },
      { text: 'Hayır', result: 'Yalnızca Türkiye\'de faaliyet. Zorunlu: KVKK. Gönüllü: ISO 27001', roadmap: 7 },
    ],
  },
  {
    id: 3,
    question: 'AB vatandaşlarına ait kişisel veri işliyor musunuz (örneğin: kullanıcı bilgileri, müşteri verisi)?',
    options: [
      { text: 'Evet', result: 'GDPR kapsamındasınız', roadmap: 4 },
      { text: 'Hayır', next: 4 },
    ],
  },
  {
    id: 4,
    question: 'Herhangi bir dijital ürün geliştiriyor ya da satıyor musunuz (ör. yazılım, donanım, IoT cihazı)?',
    options: [
      { text: 'Evet', next: 5 },
      { text: 'Hayır', next: 7 },
    ],
  },
  {
    id: 5,
    question: 'Bu ürünü Avrupa’daki müşteri, bayi, dağıtıcı veya ortaklara sunuyor musunuz?',
    options: [
      { text: 'Evet', next: 6 },
      { text: 'Hayır', next: 7 },
    ],
  },
  {
    id: 6,
    question: 'Geliştirdiğiniz ürün aşağıdakilerden hangisine benziyor?',
    options: [
      { text: 'Genel yazılım veya düşük riskli cihaz (ör. muhasebe programı, IoT termostat)', result: 'CRA – Sınıf I', roadmap: 2 },
      { text: 'İşletim sistemi, ağ yönetimi, sanallaştırma vb.', result: 'CRA – Sınıf II', roadmap: 3 },
      { text: 'Kendi üretiminiz değil, başka ürünleri AB pazarına sokuyorsunuz', result: 'CRA – Dağıtıcı/Tedarikçi', roadmap: 5 },
    ],
  },
  {
    id: 7,
    question: 'Avrupa’daki kritik altyapı sektörlerinden birine hizmet veriyor musunuz? (enerji, sağlık, ulaşım, dijital hizmetler, bankacılık)',
    options: [
      { text: 'Evet', result: 'NIS2 kapsamındasınız', roadmap: 6 },
      { text: 'Hayır', next: 8 },
    ],
  },
  {
    id: 8,
    question: 'AB kamu kurumlarına veya onların taşeronlarına hizmet veriyor musunuz?',
    options: [
      { text: 'Evet', result: 'NIS2 kapsamındasınız', roadmap: 6 },
      { text: 'Hayır', next: 9 },
    ],
  },
  {
    id: 9,
    question: 'AB ülkelerinde şubeniz, iştirakiniz veya bağlı ortaklığınız var mı?',
    options: [
      { text: 'Evet', result: 'GDPR + NIS2 kapsamı olabilir', roadmap: 6 },
      { text: 'Hayır', result: 'Avrupa ile sınırlı temas – CRA ve GDPR kapsamında olmayabilirsiniz.', roadmap: null },
    ],
  },
];

// Yol haritaları
const roadmaps = {
  1: {
    title: 'CRA + GDPR + NIS2',
    content: [
      'CRA gereklilikleri: Güvenli yazılım geliştirme, teknik dosya, penetrasyon test',
      'GDPR: DPO atanması, veri işleme envanteri, ihlal bildirimi',
      'NIS2: Yönetim kurulu düzeyinde siber sorumluluk, yıllık denetim',
      'ISO/IEC 27001 altyapısı ile desteklenmeli',
      'Önerilen çerçeveler: COBIT (yönetişim), TOGAF (mimari), ITIL & IT4IT (hizmet yönetimi ve operasyonel modelleme)',
    ],
    relevantStandards: ['CRA', 'GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
  },
  2: {
    title: 'CRA Sınıf I',
    content: [
      'CRA teknik belgeleri hazırlanmalı',
      'Yazılım geliştirme süreci güvenli hale getirilmeli',
      'ENISA\'ya bildirim süreçleri kurulmalı',
      'ISO/IEC 27001 önerilir',
      'Önerilen çerçeveler: COBIT (yönetişim), TOGAF (mimari), ITIL & IT4IT (hizmet yönetimi ve operasyonel modelleme)',
    ],
    relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
  },
  3: {
    title: 'CRA Sınıf II',
    content: [
      'Derinlemesine teknik dokümantasyon ve penetrasyon testleri',
      'Siber olay müdahale planları',
      'Uygunluk ve sertifikasyon süreçleri',
      'ISO/IEC 27001 önerilir',
      'Önerilen çerçeveler: COBIT (yönetişim), TOGAF (mimari), ITIL & IT4IT (hizmet yönetimi ve operasyonel modelleme)',
    ],
    relevantStandards: ['CRA', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
  },
  4: {
    title: 'Yalnızca GDPR',
    content: [
      'Veri işleme envanteri, açık rıza mekanizmaları',
      'DPO atanması (gerekiyorsa)',
      'DPIA ve ihlal bildirimi prosedürleri',
      'ISO/IEC 27701 veya 27001 önerilir',
      'Önerilen çerçeveler: COBIT (yönetişim), TOGAF (mimari), ITIL & IT4IT (hizmet yönetimi ve operasyonel modelleme)',
    ],
    relevantStandards: ['GDPR', 'ISO 27001', 'DPO', 'DPIA', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
  },
  5: {
    title: 'CRA Distribütör / Tedarikçi',
    content: [
      'Uygunluk belgeleri talep edilmeli',
      'Ürünler değiştirilmeden pazara sunulmalı',
      'Güvenlik açıklarında hızlı bildirim ve geri çağırma sistemi kurulmalı',
      'ISO/IEC 27001 önerilir',
      'Önerilen çerçeveler: COBIT (yönetişim), TOGAF (mimari), ITIL & IT4IT (hizmet yönetimi ve operasyonel modelleme)',
    ],
    relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
  },
  6: {
    title: 'GDPR + NIS2',
    content: [
      'GDPR süreçleri + DPO + denetim kayıtları',
      'NIS2 gereği yönetim sorumluluğu tanımlanmalı',
      'ISO/IEC 27001 altyapısı kurulmalı',
      'Önerilen çerçeveler: COBIT (yönetişim), TOGAF (mimari), ITIL & IT4IT (hizmet yönetimi ve operasyonel modelleme)',
    ],
    relevantStandards: ['GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
  },
  7: {
    title: 'Sadece Türkiye / KVKK',
    content: [
      'Veri envanteri, açık rıza, aydınlatma yükümlülükleri',
      'Log yönetimi, şifreleme, antivirüs uygulamaları',
      'Farkındalık eğitimleri',
      'Önerilen çerçeveler: COBIT (yönetişim), TOGAF (mimari), ITIL & IT4IT (hizmet yönetimi ve operasyonel modelleme)',
    ],
    relevantStandards: ['KVKK', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
  },
};

// Akış şemaları verileri
const flowcharts = {
  'ISO 27001': {
    title: 'ISO 27001 Bilgi Güvenliği Yönetim Sistemi Akış Şeması',
    steps: [
      '1. Organizasyonel Bağlam ve İlgili Tarafların Belirlenmesi',
      '2. Bilgi Güvenliği Politikasının Oluşturulması',
      '3. Risk Değerlendirme ve Risk İşleme Planının Hazırlanması',
      '4. Bilgi Güvenliği Hedeflerinin Belirlenmesi',
      '5. Uygunluk Gereksinimlerinin Belirlenmesi',
      '6. Bilgi Güvenliği Kontrollerinin Seçimi ve Uygulanması',
      '7. Bilgi Güvenliği Dokümantasyonunun Hazırlanması',
      '8. İç Denetimlerin Yapılması',
      '9. Yönetim Gözden Geçirmesi',
      '10. Düzeltici Faaliyetlerin Uygulanması',
      '11. Sertifikasyon Denetimi ve Belgelendirme'
    ]
  },
  'CRA': {
    title: 'CRA (Cyber Resilience Act) Uyum Akış Şeması',
    steps: [
      '1. Ürün Kategorisinin Belirlenmesi (Sınıf I/II)',
      '2. Teknik Dosya Hazırlanması',
      '3. Güvenli Yazılım Geliştirme Süreçlerinin Kurulması',
      '4. Siber Güvenlik Risk Değerlendirmesi',
      '5. Güvenlik Açığı Bildirim Mekanizmalarının Kurulması',
      '6. Uygunluk Değerlendirmesi ve Sertifikasyon',
      '7. ENISA\'ya Bildirim Yapılması',
      '8. CE İşaretlemesi ve Piyasaya Arz',
      '9. Piyasa Gözetimi ve Denetimi',
      '10. Sürekli İyileştirme ve Güncelleme'
    ]
  },
  'NIS2': {
    title: 'NIS 2 Direktifi Uyum Akış Şeması',
    steps: [
      '1. Kritik Sektör Kategorisinin Belirlenmesi',
      '2. Ulusal Yetkili Makamların Belirlenmesi',
      '3. Yönetim Kurulu Düzeyinde Siber Sorumluluğun Tanımlanması',
      '4. Siber Güvenlik Risk Yönetimi Politikasının Oluşturulması',
      '5. İş Sürekliliği ve Kriz Yönetimi Planlarının Hazırlanması',
      '6. Siber Güvenlik Olay Müdahale Kapasitesinin Kurulması',
      '7. Tedarikçi Risk Yönetimi Süreçlerinin Oluşturulması',
      '8. Siber Güvenlik Raporlama Mekanizmalarının Kurulması',
      '9. Yıllık Siber Güvenlik Denetimlerinin Yapılması',
      '10. Ulusal Yetkili Makamlara Bildirim Yapılması'
    ]
  },
  'KVKK': {
    title: 'KVKK (Kişisel Verilerin Korunması Kanunu) Uyum Akış Şeması',
    steps: [
      '1. Kişisel Veri İşleme Envanterinin Hazırlanması',
      '2. Veri İşleme Amaçlarının ve Hukuki Dayanaklarının Belirlenmesi',
      '3. Açık Rıza Mekanizmalarının Kurulması',
      '4. Aydınlatma Yükümlülüklerinin Yerine Getirilmesi',
      '5. Veri Güvenliği Önlemlerinin Alınması',
      '6. Veri İşleyen ve Veri Sorumlusu Sözleşmelerinin Hazırlanması',
      '7. Kişisel Verilerin Silinmesi, Anonimleştirilmesi ve Saklanması',
      '8. Kişisel Veri İşleme Şartlarının Belirlenmesi',
      '9. Veri Koruma Kurulu\'na Bildirim Yapılması',
      '10. İç Denetim ve Uyum Kontrolü'
    ]
  },
  'DPO': {
    title: 'DPO (Data Protection Officer) Atama Akış Şeması',
    steps: [
      '1. DPO Atama Zorunluluğunun Değerlendirilmesi',
      '2. DPO Pozisyonunun Organizasyon Yapısında Tanımlanması',
      '3. DPO Adaylarının Belirlenmesi ve Değerlendirilmesi',
      '4. DPO\'nun Bağımsızlığının Sağlanması',
      '5. DPO\'nun Yetki ve Sorumluluklarının Tanımlanması',
      '6. DPO\'nun Gerekli Kaynaklara Erişiminin Sağlanması',
      '7. DPO\'nun Eğitim ve Gelişiminin Planlanması',
      '8. DPO\'nun İletişim Kanallarının Kurulması',
      '9. DPO\'nun Performans Değerlendirme Kriterlerinin Belirlenmesi',
      '10. DPO\'nun Sürekli İyileştirme ve Güncelleme Süreçlerinin Kurulması'
    ]
  },
  'DPIA': {
    title: 'DPIA (Data Protection Impact Assessment) Süreci Akış Şeması',
    steps: [
      '1. DPIA Gerekliliğinin Değerlendirilmesi',
      '2. DPIA Ekibinin Oluşturulması',
      '3. Veri İşleme Faaliyetinin Detaylı Açıklaması',
      '4. Veri İşleme Amaçlarının ve Hukuki Dayanaklarının Belirlenmesi',
      '5. Veri İşleme Faaliyetinin Orantılılığının Değerlendirilmesi',
      '6. Veri Sahiplerinin Haklarının Korunması',
      '7. Risk Değerlendirmesi ve Risk Azaltma Önlemlerinin Belirlenmesi',
      '8. İlgili Taraflarla İstişare Edilmesi',
      '9. DPIA Raporunun Hazırlanması ve Onaylanması',
      '10. DPIA Sonuçlarının Uygulanması ve İzlenmesi'
    ]
  },
  'TOGAF': {
    title: 'TOGAF Kurumsal Mimari Uyum Akış Şeması',
    steps: [
      '1. Ön Hazırlık Fazı (Preliminary Phase)',
      '2. Mimari Vizyon Fazı (Architecture Vision)',
      '3. İş Mimarisinin Geliştirilmesi (Business Architecture)',
      '4. Veri Mimarisinin Geliştirilmesi (Data Architecture)',
      '5. Uygulama Mimarisinin Geliştirilmesi (Application Architecture)',
      '6. Teknoloji Mimarisinin Geliştirilmesi (Technology Architecture)',
      '7. Geçiş Planlaması (Opportunities and Solutions)',
      '8. Uygulama Planlaması (Migration Planning)',
      '9. Uygulama Yönetimi (Implementation Governance)',
      '10. Mimari Değişiklik Yönetimi (Architecture Change Management)'
    ]
  },
  'COBIT': {
    title: 'COBIT 2019 Uyum Akış Şeması',
    steps: [
      '1. Farkındalık ve Eğitim (Awareness and Education)',
      '2. Mevcut Durum Analizi (Current State Assessment)',
      '3. Tanısal Değerlendirme (Diagnostic Assessment)',
      '4. Hedef Kabiliyet Belirleme (Target Capability Definition)',
      '5. Uygulama Planı Geliştirme (Implementation Planning)',
      '6. Uygulama ve İzleme (Implementation and Monitoring)',
      '7. Değerlendirme ve Ayarlama (Evaluation and Adjustment)',
      '8. Sürekli İyileştirme (Continuous Improvement)',
      '9. Performans Ölçümü (Performance Measurement)',
      '10. Olgunluk Seviyesi Değerlendirmesi (Maturity Level Assessment)'
    ]
  },
  'ITIL': {
    title: 'ITIL Kurumsal Mimari Uyum Akış Şeması',
    steps: [
      '1. Hizmet Stratejisi Oluşturma (Service Strategy)',
      '   → İş hedefleri ile BT hizmetlerinin hizalanması',
      '   → Hizmet portföyü yönetimi ve değer önerisinin tanımı',
      '   → Finansal yönetim, risk ve uygunluk stratejilerinin belirlenmesi',
      '2. Hizmet Tasarımı (Service Design)',
      '   → SLA, kapasite, kullanılabilirlik ve güvenlik planlaması',
      '   → Bilgi güvenliği kontrollerinin tasarıma entegrasyonu (ISO 27001 uyumu)',
      '   → GDPR gereklilikleri ve gizlilik etki analizlerinin entegrasyonu',
      '3. Hizmet Geçişi (Service Transition)',
      '   → Değişiklik yönetimi (Change Management) sürecinin kurulması',
      '   → Konfigürasyon yönetimi ve CMDB yapısının oluşturulması',
      '   → Test ve doğrulama süreçleri + uyum kayıtlarının tutulması',
      '4. Hizmet Operasyonu (Service Operation)',
      '   → Olay yönetimi, problem yönetimi, hizmet masası işlemleri',
      '   → Erişim ve güvenlik olaylarına müdahale süreçleri',
      '   → NIS2 kapsamında olay bildirimi ve izleme altyapısı',
      '5. Sürekli Hizmet İyileştirme (Continual Service Improvement)',
      '   → Hizmet kalitesi, SLA ve KPI performanslarının ölçümü',
      '   → Denetim bulguları ile iyileştirme planlarının oluşturulması',
      '   → Süreçlerin olgunluk seviyesine göre COBIT ile hizalanması'
    ]
  },
  'IT4IT': {
    title: 'IT4IT Kurumsal Mimari Uyum Akış Şeması',
    steps: [
      '1. Strateji ile Portföy Hizalaması (Strategy to Portfolio - S2P)',
      '   → İş stratejisi ile dijital ürün portföyünün hizalanması',
      '   → Talep yönetimi, yatırım portföyü oluşturulması',
      '   → BT bütçesi ve değer akış hedeflerinin belirlenmesi',
      '2. Gereksinimden Dağıtıma (Requirement to Deploy - R2D)',
      '   → Ürün gereksinimlerinin toplanması ve işlenmesi',
      '   → Yazılım geliştirme, test, entegrasyon ve dağıtım süreçlerinin modellenmesi',
      '   → Güvenli yazılım geliştirme (DevSecOps) ve otomasyonun uygulanması',
      '3. Talep ile Kullanıma Alma (Request to Fulfill - R2F)',
      '   → Hizmet katalog yönetimi ve sipariş süreçleri',
      '   → Erişim, yetkilendirme, varlık ve konfigürasyon yönetimi',
      '   → Self-service portal entegrasyonu ve kullanıcı deneyimi',
      '4. Algılama ile Kurtarma (Detect to Correct - D2C)',
      '   → Operasyonel olayların algılanması ve izlenmesi',
      '   → Kök neden analizi, problem yönetimi, olay müdahalesi',
      '   → İzlenebilirlik, loglama, SIEM entegrasyonları (NIS2 ile hizalı)',
      '5. Sürekli Değer Geri Bildirimi',
      '   → Değer zinciri üzerindeki performans göstergelerinin izlenmesi',
      '   → Süreç iyileştirmeleri için geribildirim mekanizmalarının kurulması',
      '   → COBIT kontrol hedeflerine teknik izleme desteği sağlanması'
    ]
  },
  'Denetim Kayıtları': {
    title: 'Denetim Kayıtları Yönetim Akış Şeması',
    steps: [
      '1. Kayıt Gereksinimlerinin Belirlenmesi',
      '   → Hangi sistemlerin ve işlemlerin kayıt altına alınacağı tanımlanır',
      '   → Uyulması gereken mevzuatlar: NIS2, GDPR, ISO/IEC 27001, KVKK',
      '   → Kritik olay türleri (kimlik doğrulama, erişim, silme, veri aktarımı vb.) belirlenir',
      '2. Kayıt Formatı ve İçeriğinin Standartlaştırılması',
      '   → Kayıt başlıkları: tarih/saat, kullanıcı, işlem türü, hedef kaynak',
      '   → Gerektiğinde özel metadata (IP, cihaz kimliği, işlem sonucu) eklenir',
      '   → Format: JSON, syslog, W3C standardı veya kuruma özel',
      '3. Toplama (Log Collection)',
      '   → Kayıtlar sistem düzeyinde (OS), uygulama düzeyinde (web, veri tabanı) ve ağ düzeyinde (firewall, proxy) toplanır',
      '   → Agent tabanlı ya da agentless yöntemlerle merkezi kayıt sistemine yönlendirilir',
      '   → Güvenli kanal üzerinden iletim (TLS, VPN, bastion) sağlanır',
      '4. Kayıtların Korunması ve Değiştirilemezlik',
      '   → WORM (Write Once Read Many) yapı kullanımı',
      '   → Hash\'leme ve dijital imza (ISO 27001 A.12.4.2 / NIS2 ile uyumlu)',
      '   → Erişim kontrolü (sadece yetkili denetçilere okuma hakkı)',
      '5. Saklama Süresi ve Lokasyonu',
      '   → GDPR/KVKK: sadece gerekli süre kadar saklanmalı',
      '   → ISO 27001: yasal zorunluluklar ve risk bazlı süreler',
      '   → Lokasyon: yerel (on-prem), bulut (ISO 27018 uyumlu) veya hibrit',
      '6. Kayıtların İzlenmesi ve Analizi',
      '   → SIEM entegrasyonu (Splunk, ELK, Sentinel vb.)',
      '   → Olay korelasyonu, anomali tespiti ve uyarı üretimi',
      '   → Sürekli izleme ve otomatik raporlama (SOAR ile desteklenebilir)',
      '7. Erişim ve Denetim Süreci',
      '   → Denetçiler için güvenli görüntüleme paneli',
      '   → Kayıt erişim talepleri, nedenleri ve erişim zamanı loglanır',
      '   → DPO veya bilgi güvenliği yöneticisi onayı aranabilir',
      '8. Kayıtların Arşivlenmesi veya İmhası',
      '   → Süresi dolan kayıtlar güvenli şekilde imha edilir (kriptografik silme, veri yok etme sertifikası)',
      '   → Arşivlenecek veriler için soğuk depolama veya sıkıştırma planlanır',
      '9. Entegrasyon Önerileri',
      '   → ITIL entegrasyonu: "Service Operation" aşamasına yerleştirilebilir',
      '   → COBIT entegrasyonu: DSS01, DSS06 ve MEA03 süreçleriyle doğrudan ilişkilidir',
      '   → ISO/IEC 27001 referansı: A.12.4 – Logging and monitoring, A.12.7 – Information systems audit considerations'
    ]
  }
};

function App() {
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [selectedFlowchart, setSelectedFlowchart] = useState(null);

  const current = decisionTree.find(q => q.id === step);

  const handleOption = (option) => {
    if (option.next) {
      setHistory([...history, { step, option: option.text }]);
      setStep(option.next);
    } else if (option.result) {
      setResult(option.result);
      setRoadmap(option.roadmap ? roadmaps[option.roadmap] : null);
      setHistory([...history, { step, option: option.text }]);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setHistory([]);
    setResult(null);
    setRoadmap(null);
    setSelectedFlowchart(null);
  };

  const handleFlowchartClick = (flowchartKey) => {
    setSelectedFlowchart(flowcharts[flowchartKey]);
  };

  const closeFlowchart = () => {
    setSelectedFlowchart(null);
  };

  return (
    <div className="container">
      <h1>CRA–GDPR–NIS2 Uyum Yol Haritası Asistanı</h1>
      {result ? (
        <div className="result">
          <h2>Sonuç</h2>
          <p>{result}</p>
          {roadmap && (
            <div className="roadmap">
              <h3>Yol Haritası & Standartlar</h3>
              <strong>{roadmap.title}</strong>
              <ul>
                {roadmap.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              
              <div className="flowchart-cards">
                <h4>İlgili Akış Şemaları</h4>
                <div className="cards-grid">
                  {Object.keys(flowcharts)
                    .filter(key => roadmap.relevantStandards.includes(key))
                    .map((key) => (
                      <div 
                        key={key} 
                        className="flowchart-card"
                        onClick={() => handleFlowchartClick(key)}
                      >
                        <h5>{key}</h5>
                        <p>{flowcharts[key].title}</p>
                        <span className="click-hint">Detayları görmek için tıklayın</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          <button onClick={handleRestart}>Baştan Başla</button>
        </div>
      ) : (
        <div className="question-box">
          <h2>{current.question}</h2>
          <div className="options">
            {current.options.map((option, idx) => (
              <button key={idx} onClick={() => handleOption(option)}>
                {option.text}
              </button>
            ))}
          </div>
          {history.length > 0 && (
            <button className="restart-btn" onClick={handleRestart}>
              Baştan Başla
            </button>
          )}
        </div>
      )}

      {/* Akış Şeması Modal */}
      {selectedFlowchart && (
        <div className="flowchart-modal-overlay" onClick={closeFlowchart}>
          <div className="flowchart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedFlowchart.title}</h2>
              <button className="close-btn" onClick={closeFlowchart}>×</button>
            </div>
            <div className="flowchart-content">
              <div className="flowchart-steps">
                {selectedFlowchart.steps.map((step, index) => (
                  <div key={index} className="flowchart-step">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
