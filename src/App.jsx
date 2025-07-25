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
      'Önerilen ek standartlar: COBIT, TOGAF, CMMI',
    ],
  },
  2: {
    title: 'CRA Sınıf I',
    content: [
      'CRA teknik belgeleri hazırlanmalı',
      'Yazılım geliştirme süreci güvenli hale getirilmeli',
      'ENISA’ya bildirim süreçleri kurulmalı',
      'ISO/IEC 27001 önerilir',
      'Önerilen ek standartlar: CMMI (ML2+), ITIL',
    ],
  },
  3: {
    title: 'CRA Sınıf II',
    content: [
      'Derinlemesine teknik dokümantasyon ve penetrasyon testleri',
      'Siber olay müdahale planları',
      'Uygunluk ve sertifikasyon süreçleri',
      'ISO/IEC 27001 önerilir',
      'Önerilen ek standartlar: CMMI ML3+, COBIT',
    ],
  },
  4: {
    title: 'Yalnızca GDPR',
    content: [
      'Veri işleme envanteri, açık rıza mekanizmaları',
      'DPO atanması (gerekiyorsa)',
      'DPIA ve ihlal bildirimi prosedürleri',
      'ISO/IEC 27701 veya 27001 önerilir',
      'Önerilen ek çerçeve: TOGAF (veri akışı modellemesi)',
    ],
  },
  5: {
    title: 'CRA Distribütör / Tedarikçi',
    content: [
      'Uygunluk belgeleri talep edilmeli',
      'Ürünler değiştirilmeden pazara sunulmalı',
      'Güvenlik açıklarında hızlı bildirim ve geri çağırma sistemi kurulmalı',
      'ISO/IEC 27001 önerilir',
      'Ek çerçeve: ITIL (değişiklik & olay yönetimi)',
    ],
  },
  6: {
    title: 'GDPR + NIS2',
    content: [
      'GDPR süreçleri + DPO + denetim kayıtları',
      'NIS2 gereği yönetim sorumluluğu tanımlanmalı',
      'ISO/IEC 27001 altyapısı kurulmalı',
      'Önerilen çerçeveler: COBIT, TOGAF',
    ],
  },
  7: {
    title: 'Sadece Türkiye / KVKK',
    content: [
      'Veri envanteri, açık rıza, aydınlatma yükümlülükleri',
      'Log yönetimi, şifreleme, antivirüs uygulamaları',
      'Farkındalık eğitimleri',
      'Önerilen ek: ITIL (temel süreç olgunlaştırma)',
    ],
  },
};

function App() {
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [roadmap, setRoadmap] = useState(null);

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
    </div>
  );
}

export default App;
