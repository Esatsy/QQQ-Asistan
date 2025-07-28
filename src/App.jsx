import { useState } from 'react'
import './App.css'

// Dil seçenekleri
const languages = {
  en: { name: 'English', flag: '\u{1F1FA}\u{1F1F8}', code: 'EN' },
  es: { name: 'Español', flag: '\u{1F1EA}\u{1F1F8}', code: 'ES' },
  it: { name: 'Italiano', flag: '\u{1F1EE}\u{1F1F9}', code: 'IT' },
  fr: { name: 'Français', flag: '\u{1F1EB}\u{1F1F7}', code: 'FR' },
  de: { name: 'Deutsch', flag: '\u{1F1E9}\u{1F1EA}', code: 'DE' },
  tr: { name: 'Türkçe', flag: '\u{1F1F9}\u{1F1F7}', code: 'TR' }
};

// Çeviriler
const translations = {
  en: {
    title: 'CRA–GDPR–NIS2 Compliance Roadmap Assistant',
    startButton: 'Start Assessment',
    languageSelect: 'Select Language',
    result: 'Result',
    roadmap: 'Roadmap & Standards',
    restart: 'Start Over',
    clickHint: 'Click to view details'
  },
  es: {
    title: 'Asistente de Hoja de Ruta de Cumplimiento CRA–GDPR–NIS2',
    startButton: 'Comenzar Evaluación',
    languageSelect: 'Seleccionar Idioma',
    result: 'Resultado',
    roadmap: 'Hoja de Ruta y Estándares',
    restart: 'Comenzar de Nuevo',
    clickHint: 'Haga clic para ver detalles'
  },
  it: {
    title: 'Assistente per la Roadmap di Conformità CRA–GDPR–NIS2',
    startButton: 'Inizia Valutazione',
    languageSelect: 'Seleziona Lingua',
    result: 'Risultato',
    roadmap: 'Roadmap e Standard',
    restart: 'Ricomincia',
    clickHint: 'Clicca per vedere i dettagli'
  },
  fr: {
    title: 'Assistant de Feuille de Route de Conformité CRA–GDPR–NIS2',
    startButton: 'Commencer l\'Évaluation',
    languageSelect: 'Sélectionner la Langue',
    result: 'Résultat',
    roadmap: 'Feuille de Route et Standards',
    restart: 'Recommencer',
    clickHint: 'Cliquez pour voir les détails'
  },
  de: {
    title: 'CRA–GDPR–NIS2 Konformitätspfad-Assistent',
    startButton: 'Bewertung starten',
    languageSelect: 'Sprache auswählen',
    result: 'Ergebnis',
    roadmap: 'Roadmap & Standards',
    restart: 'Von vorne beginnen',
    clickHint: 'Klicken Sie für Details'
  },
  tr: {
    title: 'CRA–GDPR–NIS2 Uyum Yol Haritası Asistanı',
    startButton: 'Değerlendirmeyi Başlat',
    languageSelect: 'Dil Seçin',
    result: 'Sonuç',
    roadmap: 'Yol Haritası & Standartlar',
    restart: 'Baştan Başla',
    clickHint: 'Detayları görmek için tıklayın'
  }
};

// İngilizce karar ağacı
const decisionTreeEN = [
  {
    id: 1,
    question: 'Do you operate in the European Union?',
    options: [
      { text: 'No', result: 'No operations in the EU. This assessment is not relevant for your organization.' },
      { text: 'Yes', next: 2 },
    ],
  },
  {
    id: 2,
    question: 'Do you process personal data of EU citizens? (e.g. user data, customer data, employee data)',
    options: [
      { text: 'Yes', result: 'You are subject to the GDPR (mandatory)', roadmap: 4 },
      { text: 'No', next: 3 },
    ],
  },
  {
    id: 3,
    question: 'Do you develop or distribute digital products? (e.g. software, hardware, IoT devices)',
    options: [
      { text: 'Yes', next: 4 },
      { text: 'No', next: 6 },
    ],
  },
  {
    id: 4,
    question: 'Do you offer this product to customers, resellers, distributors, or business partners in the EU?',
    options: [
      { text: 'Yes', next: 5 },
      { text: 'No', next: 6 },
    ],
  },
  {
    id: 5,
    question: 'Which category best describes your product?',
    options: [
      { text: 'General software / low-risk device (e.g. accounting software, IoT thermostat)', result: 'CRA – Class I', roadmap: 2 },
      { text: 'Critical software infrastructure (e.g. operating system, network management, virtualization)', result: 'CRA – Class II', roadmap: 3 },
      { text: 'You market third-party products in the EU', result: 'CRA – Distributor/Supplier', roadmap: 5 },
    ],
  },
  {
    id: 6,
    question: 'Do you provide services to critical infrastructure sectors in the EU? (e.g. energy, healthcare, transport, banking, digital services)',
    options: [
      { text: 'Yes', result: 'You are subject to the NIS2 Directive (mandatory)', roadmap: 6 },
      { text: 'No', next: 7 },
    ],
  },
  {
    id: 7,
    question: 'Do you provide services to EU public authorities or their contractors?',
    options: [
      { text: 'Yes', result: 'You are subject to the NIS2 Directive (mandatory)', roadmap: 6 },
      { text: 'No', next: 8 },
    ],
  },
  {
    id: 8,
    question: 'Do you have branches, subsidiaries, or affiliated entities in the EU?',
    options: [
      { text: 'Yes', result: 'GDPR and/or NIS2 may apply (potential mandatory compliance)', roadmap: 6 },
      { text: 'No', result: 'Limited EU exposure – You may not be directly subject, but voluntary adoption of ISO/IEC 27001 or other best practices is recommended.' },
    ],
  },
];

// İspanyolca karar ağacı
const decisionTreeES = [
  {
    id: 1,
    question: '¿Opera en la Unión Europea?',
    options: [
      { text: 'No', result: 'Sin operaciones en la UE. Esta evaluación no es relevante para su organización.' },
      { text: 'Sí', next: 2 },
    ],
  },
  {
    id: 2,
    question: '¿Procesa datos personales de ciudadanos de la UE? (p. ej. datos de usuarios, clientes o empleados)',
    options: [
      { text: 'Sí', result: 'Está sujeto al RGPD (obligatorio)', roadmap: 4 },
      { text: 'No', next: 3 },
    ],
  },
  {
    id: 3,
    question: '¿Desarrolla o distribuye productos digitales? (p. ej. software, hardware, dispositivos IoT)',
    options: [
      { text: 'Sí', next: 4 },
      { text: 'No', next: 6 },
    ],
  },
  {
    id: 4,
    question: '¿Ofrece este producto a clientes, distribuidores o socios comerciales en la UE?',
    options: [
      { text: 'Sí', next: 5 },
      { text: 'No', next: 6 },
    ],
  },
  {
    id: 5,
    question: '¿Qué categoría describe mejor su producto?',
    options: [
      { text: 'Software general / dispositivo de bajo riesgo (p. ej. software contable, termostato IoT)', result: 'CRA – Clase I', roadmap: 2 },
      { text: 'Infraestructura crítica de software (p. ej. sistema operativo, gestión de redes, virtualización)', result: 'CRA – Clase II', roadmap: 3 },
      { text: 'Comercializa productos de terceros en la UE', result: 'CRA – Distribuidor/Proveedor', roadmap: 5 },
    ],
  },
  {
    id: 6,
    question: '¿Presta servicios a sectores de infraestructuras críticas en la UE? (p. ej. energía, salud, transporte, banca, servicios digitales)',
    options: [
      { text: 'Sí', result: 'Está sujeto a la Directiva NIS2 (obligatorio)', roadmap: 6 },
      { text: 'No', next: 7 },
    ],
  },
  {
    id: 7,
    question: '¿Presta servicios a autoridades públicas de la UE o a sus subcontratistas?',
    options: [
      { text: 'Sí', result: 'Está sujeto a la Directiva NIS2 (obligatorio)', roadmap: 6 },
      { text: 'No', next: 8 },
    ],
  },
  {
    id: 8,
    question: '¿Tiene sucursales, filiales o empresas asociadas en la UE?',
    options: [
      { text: 'Sí', result: 'El RGPD y/o la NIS2 pueden ser aplicables (posible obligación)', roadmap: 6 },
      { text: 'No', result: 'Exposición limitada a la UE – es posible que no esté directamente sujeto, pero se recomienda aplicar voluntariamente ISO/IEC 27001 u otras buenas prácticas.' },
    ],
  },
];

// İtalyanca karar ağacı
const decisionTreeIT = [
  {
    id: 1,
    question: 'Opera nell\'Unione Europea?',
    options: [
      { text: 'No', result: 'Nessuna attività nell\'UE. Questa valutazione non è rilevante per la tua organizzazione.' },
      { text: 'Sì', next: 2 },
    ],
  },
  {
    id: 2,
    question: 'Tratti dati personali di cittadini dell\'UE? (es. dati di utenti, clienti, dipendenti)',
    options: [
      { text: 'Sì', result: 'Sei soggetto al GDPR (obbligatorio)', roadmap: 4 },
      { text: 'No', next: 3 },
    ],
  },
  {
    id: 3,
    question: 'Sviluppi o distribuisci prodotti digitali? (es. software, hardware, dispositivi IoT)',
    options: [
      { text: 'Sì', next: 4 },
      { text: 'No', next: 6 },
    ],
  },
  {
    id: 4,
    question: 'Offri questo prodotto a clienti, rivenditori, distributori o partner commerciali nell\'UE?',
    options: [
      { text: 'Sì', next: 5 },
      { text: 'No', next: 6 },
    ],
  },
  {
    id: 5,
    question: 'A quale categoria appartiene maggiormente il tuo prodotto?',
    options: [
      { text: 'Software generico / dispositivo a basso rischio (es. software contabile, termostato IoT)', result: 'CRA – Classe I', roadmap: 2 },
      { text: 'Infrastruttura software critica (es. sistema operativo, gestione della rete, virtualizzazione)', result: 'CRA – Classe II', roadmap: 3 },
      { text: 'Distribuisci prodotti di terze parti nel mercato UE', result: 'CRA – Distributore/Fornitore', roadmap: 5 },
    ],
  },
  {
    id: 6,
    question: 'Fornisci servizi a settori di infrastrutture critiche nell\'UE? (es. energia, sanità, trasporti, banche, servizi digitali)',
    options: [
      { text: 'Sì', result: 'Sei soggetto alla Direttiva NIS2 (obbligatorio)', roadmap: 6 },
      { text: 'No', next: 7 },
    ],
  },
  {
    id: 7,
    question: 'Fornisci servizi a enti pubblici dell\'UE o ai loro appaltatori?',
    options: [
      { text: 'Sì', result: 'Sei soggetto alla Direttiva NIS2 (obbligatorio)', roadmap: 6 },
      { text: 'No', next: 8 },
    ],
  },
  {
    id: 8,
    question: 'Hai filiali, sussidiarie o entità affiliate nell\'UE?',
    options: [
      { text: 'Sì', result: 'Il GDPR e/o la NIS2 possono essere applicabili (obbligo potenziale)', roadmap: 6 },
      { text: 'No', result: 'Esposizione limitata all\'UE – Potresti non essere soggetto direttamente, ma è consigliata l\'adozione volontaria della ISO/IEC 27001 o di altre buone pratiche.' },
    ],
  },
];

// Fransızca karar ağacı
const decisionTreeFR = [
  {
    id: 1,
    question: 'Opérez-vous dans l\'Union européenne ?',
    options: [
      { text: 'Non', result: 'Aucune activité dans l\'UE. Cette évaluation ne vous concerne pas.' },
      { text: 'Oui', next: 2 },
    ],
  },
  {
    id: 2,
    question: 'Traitez-vous des données personnelles de citoyens de l\'UE ? (par ex. données des utilisateurs, clients, employés)',
    options: [
      { text: 'Oui', result: 'Vous êtes soumis au RGPD (obligatoire)', roadmap: 4 },
      { text: 'Non', next: 3 },
    ],
  },
  {
    id: 3,
    question: 'Développez-vous ou distribuez-vous des produits numériques ? (par ex. logiciels, matériels, dispositifs IoT)',
    options: [
      { text: 'Oui', next: 4 },
      { text: 'Non', next: 6 },
    ],
  },
  {
    id: 4,
    question: 'Proposez-vous ce produit à des clients, revendeurs, distributeurs ou partenaires commerciaux dans l\'UE ?',
    options: [
      { text: 'Oui', next: 5 },
      { text: 'Non', next: 6 },
    ],
  },
  {
    id: 5,
    question: 'Quelle catégorie correspond le mieux à votre produit ?',
    options: [
      { text: 'Logiciel général / dispositif à faible risque (ex. logiciel de comptabilité, thermostat IoT)', result: 'CRA – Classe I', roadmap: 2 },
      { text: 'Infrastructure logicielle critique (ex. système d\'exploitation, gestion de réseau, virtualisation)', result: 'CRA – Classe II', roadmap: 3 },
      { text: 'Vous distribuez des produits tiers dans l\'UE', result: 'CRA – Distributeur/Fournisseur', roadmap: 5 },
    ],
  },
  {
    id: 6,
    question: 'Fournissez-vous des services à des secteurs d\'infrastructure critique dans l\'UE ? (par ex. énergie, santé, transports, banque, services numériques)',
    options: [
      { text: 'Oui', result: 'Vous êtes soumis à la directive NIS2 (obligatoire)', roadmap: 6 },
      { text: 'Non', next: 7 },
    ],
  },
  {
    id: 7,
    question: 'Fournissez-vous des services à des autorités publiques de l\'UE ou à leurs sous-traitants ?',
    options: [
      { text: 'Oui', result: 'Vous êtes soumis à la directive NIS2 (obligatoire)', roadmap: 6 },
      { text: 'Non', next: 8 },
    ],
  },
  {
    id: 8,
    question: 'Avez-vous des succursales, filiales ou entités affiliées dans l\'UE ?',
    options: [
      { text: 'Oui', result: 'Le RGPD et/ou la directive NIS2 peuvent s\'appliquer (obligation possible)', roadmap: 6 },
      { text: 'Non', result: 'Exposition limitée à l\'UE – Vous n\'êtes peut-être pas directement concerné, mais l\'adoption volontaire de l\'ISO/IEC 27001 ou d\'autres bonnes pratiques est recommandée.' },
    ],
  },
];

// Türkçe karar ağacı (mevcut)
const decisionTreeTR = [
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
    question: 'Bu ürünü Avrupa\'daki müşteri, bayi, dağıtıcı veya ortaklara sunuyor musunuz?',
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
    question: 'Avrupa\'daki kritik altyapı sektörlerinden birine hizmet veriyor musunuz? (enerji, sağlık, ulaşım, dijital hizmetler, bankacılık)',
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

// Almanca karar ağacı
const decisionTreeDE = [
  {
    id: 1,
    question: 'TÄTIGKEITEN IN DER EUROPÄISCHEN UNION?',
    options: [
      { text: 'Nein', result: 'Keine Tätigkeit in der EU. Diese Bewertung ist nicht relevant für Sie.' },
      { text: 'Ja', next: 2 },
    ],
  },
  {
    id: 2,
    question: 'Verarbeiten Sie personenbezogene Daten von EU-Bürgern? (z. B. Benutzerdaten, Kundendaten, Mitarbeiterdaten)',
    options: [
      { text: 'Ja', result: 'Sie unterliegen der DSGVO (Pflicht)', roadmap: 4 },
      { text: 'Nein', next: 3 },
    ],
  },
  {
    id: 3,
    question: 'Entwickeln oder vertreiben Sie digitale Produkte? (z. B. Software, Hardware, IoT-Geräte)',
    options: [
      { text: 'Ja', next: 4 },
      { text: 'Nein', next: 6 },
    ],
  },
  {
    id: 4,
    question: 'Bieten Sie dieses Produkt Kunden, Händlern, Vertriebspartnern oder Geschäftspartnern in der EU an?',
    options: [
      { text: 'Ja', next: 5 },
      { text: 'Nein', next: 6 },
    ],
  },
  {
    id: 5,
    question: 'Welcher Kategorie entspricht Ihr Produkt am ehesten?',
    options: [
      { text: 'Allgemeine Software / geringes Risiko (z. B. Buchhaltungssoftware, IoT-Thermostat)', result: 'CRA – Klasse I', roadmap: 2 },
      { text: 'Kritische Software-Infrastruktur (z. B. Betriebssysteme, Netzwerkmanagement, Virtualisierung)', result: 'CRA – Klasse II', roadmap: 3 },
      { text: 'Sie vertreiben fremde Produkte in der EU', result: 'CRA – Vertreiber/Zulieferer', roadmap: 5 },
    ],
  },
  {
    id: 6,
    question: 'Erbringen Sie Dienstleistungen für kritische Infrastruktursektoren in der EU? (z. B. Energie, Gesundheit, Verkehr, Bankwesen, digitale Dienste)',
    options: [
      { text: 'Ja', result: 'Sie unterliegen der NIS2-Richtlinie (Pflicht)', roadmap: 6 },
      { text: 'Nein', next: 7 },
    ],
  },
  {
    id: 7,
    question: 'Erbringen Sie Dienstleistungen für EU-Behörden oder deren Subunternehmer?',
    options: [
      { text: 'Ja', result: 'Sie unterliegen der NIS2-Richtlinie (Pflicht)', roadmap: 6 },
      { text: 'Nein', next: 8 },
    ],
  },
  {
    id: 8,
    question: 'Haben Sie Niederlassungen, Tochtergesellschaften oder verbundene Unternehmen in der EU?',
    options: [
      { text: 'Ja', result: 'DSGVO und/oder NIS2 könnten anwendbar sein (Pflicht möglich)', roadmap: 6 },
      { text: 'Nein', result: 'Begrenzter EU-Bezug – Möglicherweise nicht direkt betroffen, aber freiwillige Umsetzung von ISO/IEC 27001, COBIT, TOGAF, ITIL oder IT4IT empfohlen.' },
    ],
  },
];

// Dil bazlı karar ağaçları
const decisionTrees = {
  en: decisionTreeEN,
  es: decisionTreeES,
  it: decisionTreeIT,
  fr: decisionTreeFR,
  de: decisionTreeDE,
  tr: decisionTreeTR
};

// Yol haritaları - Çok dilli
const roadmaps = {
  en: {
    1: {
      title: 'CRA + GDPR + NIS2',
      content: [
        'CRA requirements: Secure software development, technical file, penetration testing',
        'GDPR: DPO appointment, data processing inventory, breach notification',
        'NIS2: Board-level cybersecurity responsibility, annual audit',
        'ISO/IEC 27001 infrastructure should be supported',
        'Recommended frameworks: COBIT (governance), TOGAF (architecture), ITIL & IT4IT (service management and operational modeling)',
      ],
      relevantStandards: ['CRA', 'GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
    },
    2: {
      title: 'CRA Class I',
      content: [
        'CRA technical documents must be prepared',
        'Software development process must be secured',
        'ENISA notification processes must be established',
        'ISO/IEC 27001 recommended',
        'Recommended frameworks: COBIT (governance), TOGAF (architecture), ITIL & IT4IT (service management and operational modeling)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    3: {
      title: 'CRA Class II',
      content: [
        'In-depth technical documentation and penetration tests',
        'Cybersecurity incident response plans',
        'Compliance and certification processes',
        'ISO/IEC 27001 recommended',
        'Recommended frameworks: COBIT (governance), TOGAF (architecture), ITIL & IT4IT (service management and operational modeling)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    4: {
      title: 'GDPR Only',
      content: [
        'Data processing inventory, explicit consent mechanisms',
        'DPO appointment (if required)',
        'DPIA and breach notification procedures',
        'ISO/IEC 27701 or 27001 recommended',
        'Recommended frameworks: COBIT (governance), TOGAF (architecture), ITIL & IT4IT (service management and operational modeling)',
      ],
      relevantStandards: ['GDPR', 'ISO 27001', 'DPO', 'DPIA', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    5: {
      title: 'CRA Distributor / Supplier',
      content: [
        'Compliance certificates must be requested',
        'Products must be marketed unchanged',
        'Rapid notification and recall system for security vulnerabilities',
        'ISO/IEC 27001 recommended',
        'Recommended frameworks: COBIT (governance), TOGAF (architecture), ITIL & IT4IT (service management and operational modeling)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    6: {
      title: 'GDPR + NIS2',
      content: [
        'GDPR processes + DPO + audit records',
        'NIS2 management responsibility must be defined',
        'ISO/IEC 27001 infrastructure must be established',
        'Recommended frameworks: COBIT (governance), TOGAF (architecture), ITIL & IT4IT (service management and operational modeling)',
      ],
      relevantStandards: ['GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
    },
    7: {
      title: 'Turkey Only / KVKK',
      content: [
        'Data inventory, explicit consent, disclosure obligations',
        'Log management, encryption, antivirus applications',
        'Awareness training',
        'Recommended frameworks: COBIT (governance), TOGAF (architecture), ITIL & IT4IT (service management and operational modeling)',
      ],
      relevantStandards: ['KVKK', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    }
  },
  es: {
    1: {
      title: 'CRA + RGPD + NIS2',
      content: [
        'Requisitos CRA : Desarrollo seguro de software, archivo técnico, pruebas de penetración',
        'RGPD : Nombramiento de DPO, inventario de procesamiento de datos, notificación de brechas',
        'NIS2 : Responsabilidad de ciberseguridad a nivel de junta, auditoría anual',
        'La infraestructura ISO/IEC 27001 debe ser respaldada',
        'Marcos recomendados: COBIT (gobernanza), TOGAF (arquitectura), ITIL & IT4IT (gestión de servicios y modelado operacional)',
      ],
      relevantStandards: ['CRA', 'GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
    },
    2: {
      title: 'CRA Clase I',
      content: [
        'Los documentos técnicos CRA deben prepararse',
        'El proceso de desarrollo de software debe asegurarse',
        'Los procesos de notificación ENISA deben establecerse',
        'ISO/IEC 27001 recomendado',
        'Marcos recomendados: COBIT (gobernanza), TOGAF (arquitectura), ITIL & IT4IT (gestión de servicios y modelado operacional)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    3: {
      title: 'CRA Clase II',
      content: [
        'Documentación técnica en profundidad y pruebas de penetración',
        'Planes de respuesta a incidentes de ciberseguridad',
        'Procesos de cumplimiento y certificación',
        'ISO/IEC 27001 recomendado',
        'Marcos recomendados: COBIT (gobernanza), TOGAF (arquitectura), ITIL & IT4IT (gestión de servicios y modelado operacional)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    4: {
      title: 'Solo RGPD',
      content: [
        'Inventario de procesamiento de datos, mecanismos de consentimiento explícito',
        'Nombramiento de DPO (si es requerido)',
        'Procedimientos DPIA y notificación de brechas',
        'ISO/IEC 27701 o 27001 recomendado',
        'Marcos recomendados: COBIT (gobernanza), TOGAF (arquitectura), ITIL & IT4IT (gestión de servicios y modelado operacional)',
      ],
      relevantStandards: ['GDPR', 'ISO 27001', 'DPO', 'DPIA', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    5: {
      title: 'CRA Distribuidor / Proveedor',
      content: [
        'Los certificados de cumplimiento deben solicitarse',
        'Los productos deben comercializarse sin cambios',
        'Sistema de notificación y retirada rápida para vulnerabilidades de seguridad',
        'ISO/IEC 27001 recomendado',
        'Marcos recomendados: COBIT (gobernanza), TOGAF (arquitectura), ITIL & IT4IT (gestión de servicios y modelado operacional)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    6: {
      title: 'RGPD + NIS2',
      content: [
        'Procesos RGPD + DPO + registros de auditoría',
        'La responsabilidad de gestión NIS2 debe definirse',
        'La infraestructura ISO/IEC 27001 debe establecerse',
        'Marcos recomendados: COBIT (gobernanza), TOGAF (arquitectura), ITIL & IT4IT (gestión de servicios y modelado operacional)',
      ],
      relevantStandards: ['GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
    },
    7: {
      title: 'Solo Turquía / KVKK',
      content: [
        'Inventario de datos, consentimiento explícito, obligaciones de divulgación',
        'Gestión de logs, encriptación, aplicaciones antivirus',
        'Capacitación de concientización',
        'Marcos recomendados: COBIT (gobernanza), TOGAF (arquitectura), ITIL & IT4IT (gestión de servicios y modelado operacional)',
      ],
      relevantStandards: ['KVKK', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    }
  },
  it: {
    1: {
      title: 'CRA + GDPR + NIS2',
      content: [
        'Requisiti CRA: Sviluppo software sicuro, file tecnico, test di penetrazione',
        'GDPR: Nomina DPO, inventario elaborazione dati, notifica violazioni',
        'NIS2: Responsabilità cybersecurity a livello consiglio, audit annuale',
        'L\'infrastruttura ISO/IEC 27001 deve essere supportata',
        'Framework raccomandati: COBIT (governance), TOGAF (architettura), ITIL & IT4IT (gestione servizi e modellazione operativa)',
      ],
      relevantStandards: ['CRA', 'GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
    },
    2: {
      title: 'CRA Classe I',
      content: [
        'I documenti tecnici CRA devono essere preparati',
        'Il processo di sviluppo software deve essere sicurizzato',
        'I processi di notifica ENISA devono essere stabiliti',
        'ISO/IEC 27001 raccomandato',
        'Framework raccomandati: COBIT (governance), TOGAF (architettura), ITIL & IT4IT (gestione servizi e modellazione operativa)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    3: {
      title: 'CRA Classe II',
      content: [
        'Documentazione tecnica approfondita e test di penetrazione',
        'Piani di risposta agli incidenti di cybersecurity',
        'Processi di conformità e certificazione',
        'ISO/IEC 27001 raccomandato',
        'Framework raccomandati: COBIT (governance), TOGAF (architettura), ITIL & IT4IT (gestione servizi e modellazione operativa)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    4: {
      title: 'Solo GDPR',
      content: [
        'Inventario elaborazione dati, meccanismi consenso esplicito',
        'Nomina DPO (se richiesto)',
        'Procedure DPIA e notifica violazioni',
        'ISO/IEC 27701 o 27001 raccomandato',
        'Framework raccomandati: COBIT (governance), TOGAF (architettura), ITIL & IT4IT (gestione servizi e modellazione operativa)',
      ],
      relevantStandards: ['GDPR', 'ISO 27001', 'DPO', 'DPIA', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    5: {
      title: 'CRA Distributore / Fornitore',
      content: [
        'I certificati di conformità devono essere richiesti',
        'I prodotti devono essere commercializzati senza modifiche',
        'Sistema di notifica e richiamo rapido per vulnerabilità di sicurezza',
        'ISO/IEC 27001 raccomandato',
        'Framework raccomandati: COBIT (governance), TOGAF (architettura), ITIL & IT4IT (gestione servizi e modellazione operativa)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    6: {
      title: 'GDPR + NIS2',
      content: [
        'Processi GDPR + DPO + registri di audit',
        'La responsabilità di gestione NIS2 deve essere definita',
        'L\'infrastruttura ISO/IEC 27001 deve essere stabilita',
        'Framework raccomandati: COBIT (governance), TOGAF (architettura), ITIL & IT4IT (gestione servizi e modellazione operativa)',
      ],
      relevantStandards: ['GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
    },
    7: {
      title: 'Solo Turchia / KVKK',
      content: [
        'Inventario dati, consenso esplicito, obblighi di divulgazione',
        'Gestione log, crittografia, applicazioni antivirus',
        'Formazione di sensibilizzazione',
        'Framework raccomandati: COBIT (governance), TOGAF (architettura), ITIL & IT4IT (gestione servizi e modellazione operativa)',
      ],
      relevantStandards: ['KVKK', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    }
  },
  de: {
    1: {
      title: 'CRA + DSGVO + NIS2',
      content: [
        'CRA-Anforderungen: Sichere Softwareentwicklung, technische Datei, Penetrationstests',
        'DSGVO: DPO-Bestellung, Datenverarbeitungsinventar, Verletzungsmeldung',
        'NIS2: Cybersicherheitsverantwortung auf Vorstandsebene, jährliche Prüfung',
        'ISO/IEC 27001-Infrastruktur sollte unterstützt werden',
        'Empfohlene Rahmenwerke: COBIT (Governance), TOGAF (Architektur), ITIL & IT4IT (Service Management und operatives Modellieren)',
      ],
      relevantStandards: ['CRA', 'GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
    },
    2: {
      title: 'CRA Klasse I',
      content: [
        'CRA-technische Dokumente müssen vorbereitet werden',
        'Softwareentwicklungsprozess muss gesichert werden',
        'ENISA-Benachrichtigungsprozesse müssen eingerichtet werden',
        'ISO/IEC 27001 empfohlen',
        'Empfohlene Rahmenwerke: COBIT (Governance), TOGAF (Architektur), ITIL & IT4IT (Service Management und operatives Modellieren)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    3: {
      title: 'CRA Klasse II',
      content: [
        'Umfassende technische Dokumentation und Penetrationstests',
        'Cybersicherheitsvorfallreaktionspläne',
        'Compliance- und Zertifizierungsprozesse',
        'ISO/IEC 27001 empfohlen',
        'Empfohlene Rahmenwerke: COBIT (Governance), TOGAF (Architektur), ITIL & IT4IT (Service Management und operatives Modellieren)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    4: {
      title: 'Nur DSGVO',
      content: [
        'Datenverarbeitungsinventar, explizite Einwilligungsmechanismen',
        'DPO-Bestellung (falls erforderlich)',
        'DPIA- und Verletzungsmeldungsverfahren',
        'ISO/IEC 27701 oder 27001 empfohlen',
        'Empfohlene Rahmenwerke: COBIT (Governance), TOGAF (Architektur), ITIL & IT4IT (Service Management und operatives Modellieren)',
      ],
      relevantStandards: ['GDPR', 'ISO 27001', 'DPO', 'DPIA', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    5: {
      title: 'CRA Vertreiber / Zulieferer',
      content: [
        'Compliance-Zertifikate müssen angefordert werden',
        'Produkte müssen unverändert vermarktet werden',
        'Schnelles Benachrichtigungs- und Rückrufsystem für Sicherheitslücken',
        'ISO/IEC 27001 empfohlen',
        'Empfohlene Rahmenwerke: COBIT (Governance), TOGAF (Architektur), ITIL & IT4IT (Service Management und operatives Modellieren)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    6: {
      title: 'DSGVO + NIS2',
      content: [
        'DSGVO-Prozesse + DPO + Prüfungsaufzeichnungen',
        'NIS2-Managementverantwortung muss definiert werden',
        'ISO/IEC 27001-Infrastruktur muss eingerichtet werden',
        'Empfohlene Rahmenwerke: COBIT (Governance), TOGAF (Architektur), ITIL & IT4IT (Service Management und operatives Modellieren)',
      ],
      relevantStandards: ['GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
    },
    7: {
      title: 'Nur Deutschland / KVKK',
      content: [
        'Dateninventar, explizite Einwilligung, Offenlegungspflichten',
        'Log-Management, Verschlüsselung, Antivirus-Anwendungen',
        'Bewusstseinsschulungen',
        'Empfohlene Rahmenwerke: COBIT (Governance), TOGAF (Architektur), ITIL & IT4IT (Service Management und operatives Modellieren)',
      ],
      relevantStandards: ['KVKK', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    }
  },
  fr: {
    1: {
      title: 'CRA + RGPD + NIS2',
      content: [
        'Exigences CRA : Développement logiciel sécurisé, fichier technique, tests de pénétration',
        'RGPD : Nomination DPO, inventaire du traitement des données, notification des violations',
        'NIS2 : Responsabilité cybersécurité au niveau conseil, audit annuel',
        'L\'infrastructure ISO/IEC 27001 doit être soutenue',
        'Cadres recommandés : COBIT (gouvernance), TOGAF (architecture), ITIL & IT4IT (gestion des services et modélisation opérationnelle)',
      ],
      relevantStandards: ['CRA', 'GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
    },
    2: {
      title: 'CRA Classe I',
      content: [
        'Les documents techniques CRA doivent être préparés',
        'Le processus de développement logiciel doit être sécurisé',
        'Les processus de notification ENISA doivent être établis',
        'ISO/IEC 27001 recommandé',
        'Cadres recommandés : COBIT (gouvernance), TOGAF (architecture), ITIL & IT4IT (gestion des services et modélisation opérationnelle)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    3: {
      title: 'CRA Classe II',
      content: [
        'Documentation technique approfondie et tests de pénétration',
        'Plans de réponse aux incidents de cybersécurité',
        'Processus de conformité et certification',
        'ISO/IEC 27001 recommandé',
        'Cadres recommandés : COBIT (gouvernance), TOGAF (architecture), ITIL & IT4IT (gestion des services et modélisation opérationnelle)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    4: {
      title: 'RGPD Seulement',
      content: [
        'Inventaire du traitement des données, mécanismes de consentement explicite',
        'Nomination DPO (si requis)',
        'Procédures DPIA et notification des violations',
        'ISO/IEC 27701 ou 27001 recommandé',
        'Cadres recommandés : COBIT (gouvernance), TOGAF (architecture), ITIL & IT4IT (gestion des services et modélisation opérationnelle)',
      ],
      relevantStandards: ['GDPR', 'ISO 27001', 'DPO', 'DPIA', 'TOGAF', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    5: {
      title: 'CRA Distributeur / Fournisseur',
      content: [
        'Les certificats de conformité doivent être demandés',
        'Les produits doivent être commercialisés sans modification',
        'Système de notification et rappel rapide pour les vulnérabilités de sécurité',
        'ISO/IEC 27001 recommandé',
        'Cadres recommandés : COBIT (gouvernance), TOGAF (architecture), ITIL & IT4IT (gestion des services et modélisation opérationnelle)',
      ],
      relevantStandards: ['CRA', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    },
    6: {
      title: 'RGPD + NIS2',
      content: [
        'Processus RGPD + DPO + registres d\'audit',
        'La responsabilité de gestion NIS2 doit être définie',
        'L\'infrastructure ISO/IEC 27001 doit être établie',
        'Cadres recommandés : COBIT (gouvernance), TOGAF (architecture), ITIL & IT4IT (gestion des services et modélisation opérationnelle)',
      ],
      relevantStandards: ['GDPR', 'NIS2', 'ISO 27001', 'COBIT', 'TOGAF', 'ITIL', 'IT4IT', 'DPO', 'DPIA', 'Denetim Kayıtları']
    },
    7: {
      title: 'Turquie Seulement / KVKK',
      content: [
        'Inventaire des données, consentement explicite, obligations de divulgation',
        'Gestion des logs, chiffrement, applications antivirus',
        'Formation de sensibilisation',
        'Cadres recommandés : COBIT (gouvernance), TOGAF (architecture), ITIL & IT4IT (gestion des services et modélisation opérationnelle)',
      ],
      relevantStandards: ['KVKK', 'ISO 27001', 'ITIL', 'IT4IT', 'Denetim Kayıtları']
    }
  },
  tr: {
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
    }
  }
};

// Akış şemaları verileri - Çok dilli
const flowcharts = {
  'ISO 27001': {
    en: {
      title: 'ISO 27001 Information Security Management System Flowchart',
      steps: [
        '1. Organizational Context and Interested Parties Identification',
        '2. Information Security Policy Creation',
        '3. Risk Assessment and Risk Treatment Plan Preparation',
        '4. Information Security Objectives Definition',
        '5. Compliance Requirements Identification',
        '6. Information Security Controls Selection and Implementation',
        '7. Information Security Documentation Preparation',
        '8. Internal Audits Conduct',
        '9. Management Review',
        '10. Corrective Actions Implementation',
        '11. Certification Audit and Certification'
      ]
    },
    es: {
      title: 'Diagrama de Flujo del Sistema de Gestión de Seguridad de la Información ISO 27001',
      steps: [
        '1. Identificación del Contexto Organizacional y Partes Interesadas',
        '2. Creación de la Política de Seguridad de la Información',
        '3. Evaluación de Riesgos y Preparación del Plan de Tratamiento de Riesgos',
        '4. Definición de Objetivos de Seguridad de la Información',
        '5. Identificación de Requisitos de Cumplimiento',
        '6. Selección e Implementación de Controles de Seguridad de la Información',
        '7. Preparación de la Documentación de Seguridad de la Información',
        '8. Realización de Auditorías Internas',
        '9. Revisión de la Dirección',
        '10. Implementación de Acciones Correctivas',
        '11. Auditoría de Certificación y Certificación'
      ]
    },
    it: {
      title: 'Diagramma di Flusso del Sistema di Gestione della Sicurezza delle Informazioni ISO 27001',
      steps: [
        '1. Identificazione del Contesto Organizzativo e delle Parti Interessate',
        '2. Creazione della Politica di Sicurezza delle Informazioni',
        '3. Valutazione dei Rischi e Preparazione del Piano di Trattamento dei Rischi',
        '4. Definizione degli Obiettivi di Sicurezza delle Informazioni',
        '5. Identificazione dei Requisiti di Conformità',
        '6. Selezione e Implementazione dei Controlli di Sicurezza delle Informazioni',
        '7. Preparazione della Documentazione di Sicurezza delle Informazioni',
        '8. Condotta delle Auditorie Interne',
        '9. Revisione della Direzione',
        '10. Implementazione delle Azioni Correttive',
        '11. Auditoria di Certificazione e Certificazione'
      ]
    },
    fr: {
      title: 'Diagramme de Flux du Système de Gestion de la Sécurité de l\'Information ISO 27001',
      steps: [
        '1. Identification du Contexte Organisationnel et des Parties Intéressées',
        '2. Création de la Politique de Sécurité de l\'Information',
        '3. Évaluation des Risques et Préparation du Plan de Traitement des Risques',
        '4. Définition des Objectifs de Sécurité de l\'Information',
        '5. Identification des Exigences de Conformité',
        '6. Sélection et Mise en Œuvre des Contrôles de Sécurité de l\'Information',
        '7. Préparation de la Documentation de Sécurité de l\'Information',
        '8. Réalisation des Audits Internes',
        '9. Revue de Direction',
        '10. Mise en Œuvre des Actions Correctives',
        '11. Audit de Certification et Certification'
      ]
    },
    tr: {
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
    }
  },
  'CRA': {
    en: {
      title: 'CRA (Cyber Resilience Act) Compliance Flowchart',
      steps: [
        '1. Product Category Determination (Class I/II)',
        '2. Technical File Preparation',
        '3. Secure Software Development Process Establishment',
        '4. Cybersecurity Risk Assessment',
        '5. Security Vulnerability Notification Mechanisms Establishment',
        '6. Compliance Assessment and Certification',
        '7. ENISA Notification',
        '8. CE Marking and Market Release',
        '9. Market Surveillance and Monitoring',
        '10. Continuous Improvement and Updates'
      ]
    },
    es: {
      title: 'Diagrama de Flujo de Cumplimiento CRA (Reglamento de Resiliencia Cibernética)',
      steps: [
        '1. Determinación de la Categoría del Producto (Clase I/II)',
        '2. Preparación del Archivo Técnico',
        '3. Establecimiento del Proceso de Desarrollo de Software Seguro',
        '4. Evaluación de Riesgos de Ciberseguridad',
        '5. Establecimiento de Mecanismos de Notificación de Vulnerabilidades de Seguridad',
        '6. Evaluación de Cumplimiento y Certificación',
        '7. Notificación a ENISA',
        '8. Marcado CE y Liberación al Mercado',
        '9. Vigilancia y Monitoreo del Mercado',
        '10. Mejora Continua y Actualizaciones'
      ]
    },
    it: {
      title: 'Diagramma di Flusso di Conformità CRA (Cyber Resilience Act)',
      steps: [
        '1. Determinazione della Categoria del Prodotto (Classe I/II)',
        '2. Preparazione del File Tecnico',
        '3. Stabilimento del Processo di Sviluppo Software Sicuro',
        '4. Valutazione dei Rischi di Cybersecurity',
        '5. Stabilimento dei Meccanismi di Notifica delle Vulnerabilità di Sicurezza',
        '6. Valutazione di Conformità e Certificazione',
        '7. Notifica a ENISA',
        '8. Marcatura CE e Rilascio sul Mercato',
        '9. Sorveglianza e Monitoraggio del Mercato',
        '10. Miglioramento Continuo e Aggiornamenti'
      ]
    },
    fr: {
      title: 'Diagramme de Flux de Conformité CRA (Règlement sur la Résilience Cybernétique)',
      steps: [
        '1. Détermination de la Catégorie du Produit (Classe I/II)',
        '2. Préparation du Dossier Technique',
        '3. Établissement du Processus de Développement Logiciel Sécurisé',
        '4. Évaluation des Risques de Cybersécurité',
        '5. Établissement des Mécanismes de Notification des Vulnérabilités de Sécurité',
        '6. Évaluation de Conformité et Certification',
        '7. Notification à l\'ENISA',
        '8. Marquage CE et Mise sur le Marché',
        '9. Surveillance et Contrôle du Marché',
        '10. Amélioration Continue et Mises à Jour'
      ]
    },
    tr: {
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
    }
  },
  'NIS2': {
    en: {
      title: 'NIS 2 Directive Compliance Flowchart',
      steps: [
        '1. Critical Sector Category Determination',
        '2. National Competent Authorities Identification',
        '3. Board-Level Cybersecurity Responsibility Definition',
        '4. Cybersecurity Risk Management Policy Creation',
        '5. Business Continuity and Crisis Management Plans Preparation',
        '6. Cybersecurity Incident Response Capacity Establishment',
        '7. Supplier Risk Management Processes Creation',
        '8. Cybersecurity Reporting Mechanisms Establishment',
        '9. Annual Cybersecurity Audits Conduct',
        '10. Notification to National Competent Authorities'
      ]
    },
    es: {
      title: 'Diagrama de Flujo de Cumplimiento de la Directiva NIS2',
      steps: [
        '1. Determinación de la Categoría del Sector Crítico',
        '2. Identificación de las Autoridades Nacionales Competentes',
        '3. Definición de la Responsabilidad de Ciberseguridad a Nivel de Junta',
        '4. Creación de la Política de Gestión de Riesgos de Ciberseguridad',
        '5. Preparación de Planes de Continuidad del Negocio y Gestión de Crisis',
        '6. Establecimiento de la Capacidad de Respuesta a Incidentes de Ciberseguridad',
        '7. Creación de Procesos de Gestión de Riesgos de Proveedores',
        '8. Establecimiento de Mecanismos de Informes de Ciberseguridad',
        '9. Realización de Auditorías Anuales de Ciberseguridad',
        '10. Notificación a las Autoridades Nacionales Competentes'
      ]
    },
    it: {
      title: 'Diagramma di Flusso di Conformità alla Direttiva NIS2',
      steps: [
        '1. Determinazione della Categoria del Settore Critico',
        '2. Identificazione delle Autorità Nazionali Competenti',
        '3. Definizione della Responsabilità di Cybersecurity a Livello di Consiglio',
        '4. Creazione della Politica di Gestione dei Rischi di Cybersecurity',
        '5. Preparazione di Piani di Continuità Operativa e Gestione delle Crisi',
        '6. Stabilimento della Capacità di Risposta agli Incidenti di Cybersecurity',
        '7. Creazione di Processi di Gestione dei Rischi dei Fornitori',
        '8. Stabilimento di Meccanismi di Reporting di Cybersecurity',
        '9. Condotta di Auditorie Annuali di Cybersecurity',
        '10. Notifica alle Autorità Nazionali Competenti'
      ]
    },
    fr: {
      title: 'Diagramme de Flux de Conformité à la Directive NIS2',
      steps: [
        '1. Détermination de la Catégorie du Secteur Critique',
        '2. Identification des Autorités Nationales Compétentes',
        '3. Définition de la Responsabilité Cybersécurité au Niveau du Conseil',
        '4. Création de la Politique de Gestion des Risques de Cybersécurité',
        '5. Préparation des Plans de Continuité d\'Activité et de Gestion de Crise',
        '6. Établissement de la Capacité de Réponse aux Incidents de Cybersécurité',
        '7. Création des Processus de Gestion des Risques Fournisseurs',
        '8. Établissement des Mécanismes de Reporting de Cybersécurité',
        '9. Réalisation des Audits Annuels de Cybersécurité',
        '10. Notification aux Autorités Nationales Compétentes'
      ]
    },
    de: {
      title: 'NIS2-Richtlinie Konformitäts-Flussdiagramm',
      steps: [
        '1. Bestimmung der kritischen Sektorkategorie',
        '2. Identifizierung der nationalen zuständigen Behörden',
        '3. Definition der Cybersicherheitsverantwortung auf Vorstandsebene',
        '4. Erstellung der Cybersicherheits-Risikomanagement-Politik',
        '5. Vorbereitung von Geschäftskontinuitäts- und Krisenmanagementplänen',
        '6. Einrichtung der Cybersicherheitsvorfallreaktionskapazität',
        '7. Erstellung von Lieferantenrisikomanagementprozessen',
        '8. Einrichtung von Cybersicherheitsberichterstattungsmechanismen',
        '9. Durchführung jährlicher Cybersicherheitsprüfungen',
        '10. Benachrichtigung der nationalen zuständigen Behörden'
      ]
    },
    tr: {
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
    }
  },
  'KVKK': {
    en: {
      title: 'KVKK (Personal Data Protection Law) Compliance Flowchart',
      steps: [
        '1. Personal Data Processing Inventory Preparation',
        '2. Data Processing Purposes and Legal Basis Determination',
        '3. Explicit Consent Mechanisms Establishment',
        '4. Disclosure Obligations Fulfillment',
        '5. Data Security Measures Implementation',
        '6. Data Processor and Data Controller Agreements Preparation',
        '7. Personal Data Deletion, Anonymization and Storage',
        '8. Personal Data Processing Conditions Determination',
        '9. Notification to Data Protection Board',
        '10. Internal Audit and Compliance Control'
      ]
    },
    es: {
      title: 'Diagrama de Flujo de Cumplimiento KVKK (Ley de Protección de Datos Personales)',
      steps: [
        '1. Preparación del Inventario de Procesamiento de Datos Personales',
        '2. Determinación de Propósitos de Procesamiento de Datos y Base Legal',
        '3. Establecimiento de Mecanismos de Consentimiento Explícito',
        '4. Cumplimiento de Obligaciones de Divulgación',
        '5. Implementación de Medidas de Seguridad de Datos',
        '6. Preparación de Acuerdos de Procesador de Datos y Controlador de Datos',
        '7. Eliminación, Anonimización y Almacenamiento de Datos Personales',
        '8. Determinación de Condiciones de Procesamiento de Datos Personales',
        '9. Notificación a la Junta de Protección de Datos',
        '10. Auditoría Interna y Control de Cumplimiento'
      ]
    },
    it: {
      title: 'Diagramma di Flusso di Conformità KVKK (Legge sulla Protezione dei Dati Personali)',
      steps: [
        '1. Preparazione dell\'Inventario di Elaborazione dei Dati Personali',
        '2. Determinazione delle Finalità di Elaborazione dei Dati e Base Legale',
        '3. Stabilimento dei Meccanismi di Consenso Esplicito',
        '4. Adempimento degli Obblighi di Divulgazione',
        '5. Implementazione delle Misure di Sicurezza dei Dati',
        '6. Preparazione degli Accordi di Elaboratore di Dati e Controllore di Dati',
        '7. Eliminazione, Anonimizzazione e Archiviazione dei Dati Personali',
        '8. Determinazione delle Condizioni di Elaborazione dei Dati Personali',
        '9. Notifica al Consiglio di Protezione dei Dati',
        '10. Auditoria Interna e Controllo di Conformità'
      ]
    },
    fr: {
      title: 'Diagramme de Flux de Conformité KVKK (Loi sur la Protection des Données Personnelles)',
      steps: [
        '1. Préparation de l\'Inventaire du Traitement des Données Personnelles',
        '2. Détermination des Finalités du Traitement des Données et Base Légale',
        '3. Établissement des Mécanismes de Consentement Explicite',
        '4. Accomplissement des Obligations de Divulgation',
        '5. Mise en Œuvre des Mesures de Sécurité des Données',
        '6. Préparation des Accords de Traiteur de Données et Contrôleur de Données',
        '7. Suppression, Anonymisation et Stockage des Données Personnelles',
        '8. Détermination des Conditions de Traitement des Données Personnelles',
        '9. Notification au Conseil de Protection des Données',
        '10. Audit Interne et Contrôle de Conformité'
      ]
    },
    de: {
      title: 'KVKK (Datenschutzgesetz) Konformitäts-Flussdiagramm',
      steps: [
        '1. Vorbereitung des Inventars der Verarbeitung personenbezogener Daten',
        '2. Bestimmung der Zwecke der Datenverarbeitung und Rechtsgrundlage',
        '3. Einrichtung von Mechanismen für ausdrückliche Einwilligung',
        '4. Erfüllung der Offenlegungspflichten',
        '5. Umsetzung von Datensicherheitsmaßnahmen',
        '6. Vorbereitung von Vereinbarungen für Datenverarbeiter und Datenverantwortliche',
        '7. Löschung, Anonymisierung und Speicherung personenbezogener Daten',
        '8. Bestimmung der Bedingungen für die Verarbeitung personenbezogener Daten',
        '9. Benachrichtigung an den Datenschutzrat',
        '10. Interne Prüfung und Compliance-Kontrolle'
      ]
    },
    tr: {
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
    }
  },
  'DPO': {
    en: {
      title: 'DPO (Data Protection Officer) Appointment Flowchart',
      steps: [
        '1. DPO Appointment Requirement Assessment',
        '2. DPO Position Definition in Organizational Structure',
        '3. DPO Candidates Identification and Evaluation',
        '4. DPO Independence Assurance',
        '5. DPO Authority and Responsibilities Definition',
        '6. DPO Access to Required Resources Provision',
        '7. DPO Training and Development Planning',
        '8. DPO Communication Channels Establishment',
        '9. DPO Performance Evaluation Criteria Definition',
        '10. DPO Continuous Improvement and Update Processes Establishment'
      ]
    },
    es: {
      title: 'Diagrama de Flujo de Nombramiento DPO (Oficial de Protección de Datos)',
      steps: [
        '1. Evaluación del Requisito de Nombramiento DPO',
        '2. Definición de la Posición DPO en la Estructura Organizacional',
        '3. Identificación y Evaluación de Candidatos DPO',
        '4. Garantía de Independencia del DPO',
        '5. Definición de Autoridad y Responsabilidades del DPO',
        '6. Provisión de Acceso del DPO a Recursos Requeridos',
        '7. Planificación de Capacitación y Desarrollo del DPO',
        '8. Establecimiento de Canales de Comunicación del DPO',
        '9. Definición de Criterios de Evaluación de Desempeño del DPO',
        '10. Establecimiento de Procesos de Mejora Continua y Actualización del DPO'
      ]
    },
    it: {
      title: 'Diagramma di Flusso di Nomina DPO (Responsabile della Protezione dei Dati)',
      steps: [
        '1. Valutazione del Requisito di Nomina DPO',
        '2. Definizione della Posizione DPO nella Struttura Organizzativa',
        '3. Identificazione e Valutazione dei Candidati DPO',
        '4. Garanzia dell\'Indipendenza del DPO',
        '5. Definizione dell\'Autorità e delle Responsabilità del DPO',
        '6. Fornitura dell\'Accesso del DPO alle Risorse Richieste',
        '7. Pianificazione della Formazione e Sviluppo del DPO',
        '8. Stabilimento dei Canali di Comunicazione del DPO',
        '9. Definizione dei Criteri di Valutazione delle Prestazioni del DPO',
        '10. Stabilimento dei Processi di Miglioramento Continuo e Aggiornamento del DPO'
      ]
    },
    fr: {
      title: 'Diagramme de Flux de Nomination DPO (Délégué à la Protection des Données)',
      steps: [
        '1. Évaluation de l\'Exigence de Nomination DPO',
        '2. Définition du Poste DPO dans la Structure Organisationnelle',
        '3. Identification et Évaluation des Candidats DPO',
        '4. Assurance de l\'Indépendance du DPO',
        '5. Définition de l\'Autorité et des Responsabilités du DPO',
        '6. Fourniture de l\'Accès du DPO aux Ressources Requises',
        '7. Planification de la Formation et du Développement du DPO',
        '8. Établissement des Canaux de Communication du DPO',
        '9. Définition des Critères d\'Évaluation des Performances du DPO',
        '10. Établissement des Processus d\'Amélioration Continue et de Mise à Jour du DPO'
      ]
    },
    de: {
      title: 'DPO (Datenschutzbeauftragter) Ernennungs-Flussdiagramm',
      steps: [
        '1. Bewertung der DPO-Ernennungsanforderung',
        '2. Definition der DPO-Position in der Organisationsstruktur',
        '3. Identifizierung und Bewertung von DPO-Kandidaten',
        '4. Sicherstellung der Unabhängigkeit des DPO',
        '5. Definition der Befugnisse und Verantwortlichkeiten des DPO',
        '6. Bereitstellung des DPO-Zugangs zu erforderlichen Ressourcen',
        '7. Planung der DPO-Schulung und -Entwicklung',
        '8. Einrichtung der DPO-Kommunikationskanäle',
        '9. Definition der DPO-Leistungsbewertungskriterien',
        '10. Einrichtung von DPO-Kontinuierliche-Verbesserungs- und Aktualisierungsprozessen'
      ]
    },
    tr: {
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
    }
  },
  'DPIA': {
    en: {
      title: 'DPIA (Data Protection Impact Assessment) Process Flowchart',
      steps: [
        '1. DPIA Requirement Assessment',
        '2. DPIA Team Formation',
        '3. Detailed Description of Data Processing Activity',
        '4. Data Processing Purposes and Legal Basis Determination',
        '5. Data Processing Activity Proportionality Assessment',
        '6. Data Subject Rights Protection',
        '7. Risk Assessment and Risk Mitigation Measures Determination',
        '8. Consultation with Relevant Parties',
        '9. DPIA Report Preparation and Approval',
        '10. DPIA Results Implementation and Monitoring'
      ]
    },
    es: {
      title: 'Diagrama de Flujo del Proceso DPIA (Evaluación de Impacto en la Protección de Datos)',
      steps: [
        '1. Evaluación del Requisito DPIA',
        '2. Formación del Equipo DPIA',
        '3. Descripción Detallada de la Actividad de Procesamiento de Datos',
        '4. Determinación de Propósitos de Procesamiento de Datos y Base Legal',
        '5. Evaluación de Proporcionalidad de la Actividad de Procesamiento de Datos',
        '6. Protección de los Derechos de los Titulares de Datos',
        '7. Evaluación de Riesgos y Determinación de Medidas de Mitigación de Riesgos',
        '8. Consulta con Partes Relevantes',
        '9. Preparación y Aprobación del Informe DPIA',
        '10. Implementación y Monitoreo de Resultados DPIA'
      ]
    },
    it: {
      title: 'Diagramma di Flusso del Processo DPIA (Valutazione d\'Impatto sulla Protezione dei Dati)',
      steps: [
        '1. Valutazione del Requisito DPIA',
        '2. Formazione del Team DPIA',
        '3. Descrizione Dettagliata dell\'Attività di Elaborazione dei Dati',
        '4. Determinazione delle Finalità di Elaborazione dei Dati e Base Legale',
        '5. Valutazione della Proporzionalità dell\'Attività di Elaborazione dei Dati',
        '6. Protezione dei Diritti degli Interessati',
        '7. Valutazione dei Rischi e Determinazione delle Misure di Mitigazione dei Rischi',
        '8. Consultazione con Parti Rilevanti',
        '9. Preparazione e Approvazione del Rapporto DPIA',
        '10. Implementazione e Monitoraggio dei Risultati DPIA'
      ]
    },
    fr: {
      title: 'Diagramme de Flux du Processus DPIA (Analyse d\'Impact sur la Protection des Données)',
      steps: [
        '1. Évaluation de l\'Exigence DPIA',
        '2. Formation de l\'Équipe DPIA',
        '3. Description Détaillée de l\'Activité de Traitement des Données',
        '4. Détermination des Finalités du Traitement des Données et Base Légale',
        '5. Évaluation de la Proportionnalité de l\'Activité de Traitement des Données',
        '6. Protection des Droits des Personnes Concernées',
        '7. Évaluation des Risques et Détermination des Mesures d\'Atténuation des Risques',
        '8. Consultation avec les Parties Concernées',
        '9. Préparation et Approbation du Rapport DPIA',
        '10. Mise en Œuvre et Suivi des Résultats DPIA'
      ]
    },
    de: {
      title: 'DPIA (Datenschutz-Folgenabschätzung) Prozess-Flussdiagramm',
      steps: [
        '1. Bewertung der DPIA-Anforderung',
        '2. Bildung des DPIA-Teams',
        '3. Detaillierte Beschreibung der Datenverarbeitungsaktivität',
        '4. Bestimmung der Zwecke der Datenverarbeitung und Rechtsgrundlage',
        '5. Bewertung der Verhältnismäßigkeit der Datenverarbeitungsaktivität',
        '6. Schutz der Rechte der betroffenen Personen',
        '7. Risikobewertung und Bestimmung von Risikominderungsmaßnahmen',
        '8. Konsultation mit relevanten Parteien',
        '9. Vorbereitung und Genehmigung des DPIA-Berichts',
        '10. Umsetzung und Überwachung der DPIA-Ergebnisse'
      ]
    },
    tr: {
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
    }
  },
  'TOGAF': {
    en: {
      title: 'TOGAF Enterprise Architecture Compliance Flowchart',
      steps: [
        '1. Preliminary Phase',
        '2. Architecture Vision Phase',
        '3. Business Architecture Development',
        '4. Data Architecture Development',
        '5. Application Architecture Development',
        '6. Technology Architecture Development',
        '7. Opportunities and Solutions Planning',
        '8. Migration Planning',
        '9. Implementation Governance',
        '10. Architecture Change Management'
      ]
    },
    es: {
      title: 'Diagrama de Flujo de Cumplimiento de Arquitectura Empresarial TOGAF',
      steps: [
        '1. Fase Preliminar',
        '2. Fase de Visión de Arquitectura',
        '3. Desarrollo de Arquitectura de Negocios',
        '4. Desarrollo de Arquitectura de Datos',
        '5. Desarrollo de Arquitectura de Aplicaciones',
        '6. Desarrollo de Arquitectura de Tecnología',
        '7. Planificación de Oportunidades y Soluciones',
        '8. Planificación de Migración',
        '9. Gobernanza de Implementación',
        '10. Gestión de Cambios de Arquitectura'
      ]
    },
    it: {
      title: 'Diagramma di Flusso di Conformità dell\'Architettura Aziendale TOGAF',
      steps: [
        '1. Fase Preliminare',
        '2. Fase di Visione dell\'Architettura',
        '3. Sviluppo dell\'Architettura di Business',
        '4. Sviluppo dell\'Architettura dei Dati',
        '5. Sviluppo dell\'Architettura delle Applicazioni',
        '6. Sviluppo dell\'Architettura Tecnologica',
        '7. Pianificazione delle Opportunità e Soluzioni',
        '8. Pianificazione della Migrazione',
        '9. Governance dell\'Implementazione',
        '10. Gestione dei Cambiamenti dell\'Architettura'
      ]
    },
    fr: {
      title: 'Diagramme de Flux de Conformité de l\'Architecture d\'Entreprise TOGAF',
      steps: [
        '1. Phase Préliminaire',
        '2. Phase de Vision d\'Architecture',
        '3. Développement de l\'Architecture Métier',
        '4. Développement de l\'Architecture de Données',
        '5. Développement de l\'Architecture Applicative',
        '6. Développement de l\'Architecture Technologique',
        '7. Planification des Opportunités et Solutions',
        '8. Planification de Migration',
        '9. Gouvernance d\'Implémentation',
        '10. Gestion des Changements d\'Architecture'
      ]
    },
    de: {
      title: 'TOGAF Unternehmensarchitektur-Konformitäts-Flussdiagramm',
      steps: [
        '1. Vorbereitungsphase',
        '2. Architektur-Visionsphase',
        '3. Geschäftsarchitektur-Entwicklung',
        '4. Datenarchitektur-Entwicklung',
        '5. Anwendungsarchitektur-Entwicklung',
        '6. Technologiearchitektur-Entwicklung',
        '7. Planung von Chancen und Lösungen',
        '8. Migrationsplanung',
        '9. Implementierungs-Governance',
        '10. Architektur-Änderungsmanagement'
      ]
    },
    tr: {
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
    }
  },
  'COBIT': {
    en: {
      title: 'COBIT 2019 Compliance Flowchart',
      steps: [
        '1. Awareness and Education',
        '2. Current State Assessment',
        '3. Diagnostic Assessment',
        '4. Target Capability Definition',
        '5. Implementation Planning',
        '6. Implementation and Monitoring',
        '7. Evaluation and Adjustment',
        '8. Continuous Improvement',
        '9. Performance Measurement',
        '10. Maturity Level Assessment'
      ]
    },
    es: {
      title: 'Diagrama de Flujo de Cumplimiento COBIT 2019',
      steps: [
        '1. Concienciación y Educación',
        '2. Evaluación del Estado Actual',
        '3. Evaluación Diagnóstica',
        '4. Definición de Capacidad Objetivo',
        '5. Planificación de Implementación',
        '6. Implementación y Monitoreo',
        '7. Evaluación y Ajuste',
        '8. Mejora Continua',
        '9. Medición de Rendimiento',
        '10. Evaluación del Nivel de Madurez'
      ]
    },
    it: {
      title: 'Diagramma di Flusso di Conformità COBIT 2019',
      steps: [
        '1. Consapevolezza e Formazione',
        '2. Valutazione dello Stato Attuale',
        '3. Valutazione Diagnostica',
        '4. Definizione della Capacità Obiettivo',
        '5. Pianificazione dell\'Implementazione',
        '6. Implementazione e Monitoraggio',
        '7. Valutazione e Aggiustamento',
        '8. Miglioramento Continuo',
        '9. Misurazione delle Prestazioni',
        '10. Valutazione del Livello di Maturità'
      ]
    },
    fr: {
      title: 'Diagramme de Flux de Conformité COBIT 2019',
      steps: [
        '1. Sensibilisation et Formation',
        '2. Évaluation de l\'État Actuel',
        '3. Évaluation Diagnostique',
        '4. Définition de la Capacité Cible',
        '5. Planification de l\'Implémentation',
        '6. Implémentation et Surveillance',
        '7. Évaluation et Ajustement',
        '8. Amélioration Continue',
        '9. Mesure des Performances',
        '10. Évaluation du Niveau de Maturité'
      ]
    },
    de: {
      title: 'COBIT 2019 Konformitäts-Flussdiagramm',
      steps: [
        '1. Bewusstsein und Schulung',
        '2. Bewertung des aktuellen Zustands',
        '3. Diagnosebewertung',
        '4. Definition der Zielkapazität',
        '5. Implementierungsplanung',
        '6. Implementierung und Überwachung',
        '7. Bewertung und Anpassung',
        '8. Kontinuierliche Verbesserung',
        '9. Leistungsmessung',
        '10. Bewertung des Reifegrads'
      ]
    },
    tr: {
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
    }
  },
  'ITIL': {
    en: {
      title: 'ITIL Enterprise Architecture Compliance Flowchart',
      steps: [
        '1. Service Strategy Creation',
        '   → Alignment of business objectives with IT services',
        '   → Service portfolio management and value proposition definition',
        '   → Financial management, risk and compliance strategy determination',
        '2. Service Design',
        '   → SLA, capacity, availability and security planning',
        '   → Integration of information security controls into design (ISO 27001 compliance)',
        '   → Integration of GDPR requirements and privacy impact assessments',
        '3. Service Transition',
        '   → Establishment of change management process',
        '   → Configuration management and CMDB structure creation',
        '   → Test and validation processes + compliance record keeping',
        '4. Service Operation',
        '   → Incident management, problem management, service desk operations',
        '   → Access and security incident response processes',
        '   → Incident reporting and monitoring infrastructure under NIS2 scope',
        '5. Continual Service Improvement',
        '   → Measurement of service quality, SLA and KPI performance',
        '   → Creation of improvement plans based on audit findings',
        '   → Alignment of processes with COBIT based on maturity level'
      ]
    },
    es: {
      title: 'Diagrama de Flujo de Cumplimiento de Arquitectura Empresarial ITIL',
      steps: [
        '1. Creación de Estrategia de Servicios',
        '   → Alineación de objetivos empresariales con servicios de TI',
        '   → Gestión de portafolio de servicios y definición de propuesta de valor',
        '   → Determinación de gestión financiera, riesgo y estrategia de cumplimiento',
        '2. Diseño de Servicios',
        '   → Planificación de SLA, capacidad, disponibilidad y seguridad',
        '   → Integración de controles de seguridad de la información en el diseño (cumplimiento ISO 27001)',
        '   → Integración de requisitos GDPR y evaluaciones de impacto en la privacidad',
        '3. Transición de Servicios',
        '   → Establecimiento del proceso de gestión de cambios',
        '   → Creación de gestión de configuración y estructura CMDB',
        '   → Procesos de prueba y validación + mantenimiento de registros de cumplimiento',
        '4. Operación de Servicios',
        '   → Gestión de incidentes, gestión de problemas, operaciones de mesa de servicio',
        '   → Procesos de respuesta a incidentes de acceso y seguridad',
        '   → Infraestructura de reporte y monitoreo de incidentes bajo alcance NIS2',
        '5. Mejora Continua de Servicios',
        '   → Medición de calidad de servicios, rendimiento de SLA y KPI',
        '   → Creación de planes de mejora basados en hallazgos de auditoría',
        '   → Alineación de procesos con COBIT basado en nivel de madurez'
      ]
    },
    it: {
      title: 'Diagramma di Flusso di Conformità dell\'Architettura Aziendale ITIL',
      steps: [
        '1. Creazione della Strategia dei Servizi',
        '   → Allineamento degli obiettivi aziendali con i servizi IT',
        '   → Gestione del portafoglio servizi e definizione della proposta di valore',
        '   → Determinazione della gestione finanziaria, rischio e strategia di conformità',
        '2. Progettazione dei Servizi',
        '   → Pianificazione di SLA, capacità, disponibilità e sicurezza',
        '   → Integrazione dei controlli di sicurezza delle informazioni nel design (conformità ISO 27001)',
        '   → Integrazione dei requisiti GDPR e valutazioni d\'impatto sulla privacy',
        '3. Transizione dei Servizi',
        '   → Stabilimento del processo di gestione dei cambiamenti',
        '   → Creazione della gestione della configurazione e struttura CMDB',
        '   → Processi di test e validazione + mantenimento dei record di conformità',
        '4. Operazione dei Servizi',
        '   → Gestione degli incidenti, gestione dei problemi, operazioni del service desk',
        '   → Processi di risposta agli incidenti di accesso e sicurezza',
        '   → Infrastruttura di reporting e monitoraggio degli incidenti nell\'ambito NIS2',
        '5. Miglioramento Continuo dei Servizi',
        '   → Misurazione della qualità dei servizi, prestazioni SLA e KPI',
        '   → Creazione di piani di miglioramento basati sui risultati dell\'audit',
        '   → Allineamento dei processi con COBIT basato sul livello di maturità'
      ]
    },
    fr: {
      title: 'Diagramme de Flux de Conformité de l\'Architecture d\'Entreprise ITIL',
      steps: [
        '1. Création de la Stratégie de Services',
        '   → Alignement des objectifs métier avec les services informatiques',
        '   → Gestion du portefeuille de services et définition de la proposition de valeur',
        '   → Détermination de la gestion financière, des risques et de la stratégie de conformité',
        '2. Conception de Services',
        '   → Planification des SLA, capacité, disponibilité et sécurité',
        '   → Intégration des contrôles de sécurité de l\'information dans la conception (conformité ISO 27001)',
        '   → Intégration des exigences RGPD et des évaluations d\'impact sur la vie privée',
        '3. Transition de Services',
        '   → Établissement du processus de gestion des changements',
        '   → Création de la gestion de configuration et structure CMDB',
        '   → Processus de test et validation + tenue des registres de conformité',
        '4. Exploitation de Services',
        '   → Gestion des incidents, gestion des problèmes, opérations du service desk',
        '   → Processus de réponse aux incidents d\'accès et de sécurité',
        '   → Infrastructure de signalement et surveillance des incidents dans le cadre NIS2',
        '5. Amélioration Continue des Services',
        '   → Mesure de la qualité des services, performances SLA et KPI',
        '   → Création de plans d\'amélioration basés sur les résultats d\'audit',
        '   → Alignement des processus avec COBIT basé sur le niveau de maturité'
      ]
    },
    de: {
      title: 'ITIL Unternehmensarchitektur-Konformitäts-Flussdiagramm',
      steps: [
        '1. Service-Strategie-Erstellung',
        '   → Ausrichtung der Geschäftsziele mit IT-Services',
        '   → Service-Portfolio-Management und Wertversprechen-Definition',
        '   → Bestimmung des Finanzmanagements, Risiko- und Compliance-Strategie',
        '2. Service-Design',
        '   → SLA-, Kapazitäts-, Verfügbarkeits- und Sicherheitsplanung',
        '   → Integration von Informationssicherheitskontrollen in das Design (ISO 27001-Compliance)',
        '   → Integration von DSGVO-Anforderungen und Datenschutz-Folgenabschätzungen',
        '3. Service-Transition',
        '   → Einrichtung des Change-Management-Prozesses',
        '   → Konfigurationsmanagement und CMDB-Struktur-Erstellung',
        '   → Test- und Validierungsprozesse + Compliance-Aufzeichnung',
        '4. Service-Betrieb',
        '   → Incident-Management, Problem-Management, Service-Desk-Betrieb',
        '   → Zugriffs- und Sicherheitsvorfall-Reaktionsprozesse',
        '   → Vorfall-Meldungs- und Überwachungsinfrastruktur im NIS2-Bereich',
        '5. Kontinuierliche Service-Verbesserung',
        '   → Messung der Servicequalität, SLA- und KPI-Leistung',
        '   → Erstellung von Verbesserungsplänen basierend auf Audit-Ergebnissen',
        '   → Ausrichtung der Prozesse mit COBIT basierend auf Reifegrad'
      ]
    },
    tr: {
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
    }
  },
  'IT4IT': {
    en: {
      title: 'IT4IT Enterprise Architecture Compliance Flowchart',
      steps: [
        '1. Strategy to Portfolio Alignment (S2P)',
        '   → Alignment of business strategy with digital product portfolio',
        '   → Demand management, investment portfolio creation',
        '   → IT budget and value stream goal determination',
        '2. Requirement to Deploy (R2D)',
        '   → Collection and processing of product requirements',
        '   → Modeling of software development, testing, integration and deployment processes',
        '   → Implementation of secure software development (DevSecOps) and automation',
        '3. Request to Fulfill (R2F)',
        '   → Service catalog management and ordering processes',
        '   → Access, authorization, asset and configuration management',
        '   → Self-service portal integration and user experience',
        '4. Detect to Correct (D2C)',
        '   → Detection and monitoring of operational events',
        '   → Root cause analysis, problem management, incident response',
        '   → Traceability, logging, SIEM integrations (aligned with NIS2)',
        '5. Continuous Value Feedback',
        '   → Monitoring of performance indicators across the value chain',
        '   → Establishment of feedback mechanisms for process improvements',
        '   → Provision of technical monitoring support for COBIT control objectives'
      ]
    },
    es: {
      title: 'Diagrama de Flujo de Cumplimiento de Arquitectura Empresarial IT4IT',
      steps: [
        '1. Alineación de Estrategia a Portafolio (S2P)',
        '   → Alineación de la estrategia empresarial con el portafolio de productos digitales',
        '   → Gestión de demanda, creación de portafolio de inversión',
        '   → Determinación del presupuesto de TI y objetivos de flujo de valor',
        '2. Requisito a Despliegue (R2D)',
        '   → Recopilación y procesamiento de requisitos del producto',
        '   → Modelado de procesos de desarrollo de software, pruebas, integración y despliegue',
        '   → Implementación de desarrollo seguro de software (DevSecOps) y automatización',
        '3. Solicitud a Cumplimiento (R2F)',
        '   → Gestión de catálogo de servicios y procesos de pedidos',
        '   → Gestión de acceso, autorización, activos y configuración',
        '   → Integración de portal de autoservicio y experiencia del usuario',
        '4. Detectar a Corregir (D2C)',
        '   → Detección y monitoreo de eventos operacionales',
        '   → Análisis de causa raíz, gestión de problemas, respuesta a incidentes',
        '   → Trazabilidad, registro, integraciones SIEM (alineado con NIS2)',
        '5. Retroalimentación Continua de Valor',
        '   → Monitoreo de indicadores de rendimiento en toda la cadena de valor',
        '   → Establecimiento de mecanismos de retroalimentación para mejoras de procesos',
        '   → Provisión de soporte de monitoreo técnico para objetivos de control COBIT'
      ]
    },
    it: {
      title: 'Diagramma di Flusso di Conformità dell\'Architettura Aziendale IT4IT',
      steps: [
        '1. Allineamento da Strategia a Portafoglio (S2P)',
        '   → Allineamento della strategia aziendale con il portafoglio di prodotti digitali',
        '   → Gestione della domanda, creazione del portafoglio di investimenti',
        '   → Determinazione del budget IT e obiettivi del flusso di valore',
        '2. Requisito a Distribuzione (R2D)',
        '   → Raccolta e elaborazione dei requisiti del prodotto',
        '   → Modellazione dei processi di sviluppo software, test, integrazione e distribuzione',
        '   → Implementazione dello sviluppo software sicuro (DevSecOps) e automazione',
        '3. Richiesta a Soddisfazione (R2F)',
        '   → Gestione del catalogo servizi e processi di ordinazione',
        '   → Gestione dell\'accesso, autorizzazione, asset e configurazione',
        '   → Integrazione del portale self-service e esperienza utente',
        '4. Rilevamento a Correzione (D2C)',
        '   → Rilevamento e monitoraggio degli eventi operativi',
        '   → Analisi della causa principale, gestione dei problemi, risposta agli incidenti',
        '   → Tracciabilità, logging, integrazioni SIEM (allineato con NIS2)',
        '5. Feedback Continuo di Valore',
        '   → Monitoraggio degli indicatori di prestazione lungo la catena del valore',
        '   → Stabilimento di meccanismi di feedback per i miglioramenti dei processi',
        '   → Fornitura di supporto di monitoraggio tecnico per gli obiettivi di controllo COBIT'
      ]
    },
    fr: {
      title: 'Diagramme de Flux de Conformité de l\'Architecture d\'Entreprise IT4IT',
      steps: [
        '1. Alignement Stratégie vers Portefeuille (S2P)',
        '   → Alignement de la stratégie métier avec le portefeuille de produits numériques',
        '   → Gestion de la demande, création du portefeuille d\'investissement',
        '   → Détermination du budget informatique et des objectifs de flux de valeur',
        '2. Besoin vers Déploiement (R2D)',
        '   → Collecte et traitement des exigences produit',
        '   → Modélisation des processus de développement logiciel, test, intégration et déploiement',
        '   → Mise en œuvre du développement logiciel sécurisé (DevSecOps) et automatisation',
        '3. Demande vers Exécution (R2F)',
        '   → Gestion du catalogue de services et processus de commande',
        '   → Gestion de l\'accès, autorisation, actifs et configuration',
        '   → Intégration du portail libre-service et expérience utilisateur',
        '4. Détection vers Correction (D2C)',
        '   → Détection et surveillance des événements opérationnels',
        '   → Analyse de cause racine, gestion des problèmes, réponse aux incidents',
        '   → Traçabilité, journalisation, intégrations SIEM (aligné avec NIS2)',
        '5. Retour de Valeur Continu',
        '   → Surveillance des indicateurs de performance à travers la chaîne de valeur',
        '   → Établissement de mécanismes de retour pour les améliorations de processus',
        '   → Fourniture de support de surveillance technique pour les objectifs de contrôle COBIT'
      ]
    },
    de: {
      title: 'IT4IT Unternehmensarchitektur-Konformitäts-Flussdiagramm',
      steps: [
        '1. Strategie-zu-Portfolio-Ausrichtung (S2P)',
        '   → Ausrichtung der Geschäftsstrategie mit dem digitalen Produktportfolio',
        '   → Nachfragemanagement, Investitionsportfolio-Erstellung',
        '   → IT-Budget- und Wertstromziel-Bestimmung',
        '2. Anforderung-zu-Deployment (R2D)',
        '   → Sammlung und Verarbeitung von Produktanforderungen',
        '   → Modellierung von Softwareentwicklungs-, Test-, Integrations- und Deployment-Prozessen',
        '   → Implementierung sicherer Softwareentwicklung (DevSecOps) und Automatisierung',
        '3. Anfrage-zu-Erfüllung (R2F)',
        '   → Service-Katalog-Management und Bestellprozesse',
        '   → Zugriffs-, Autorisierungs-, Asset- und Konfigurationsmanagement',
        '   → Self-Service-Portal-Integration und Benutzererfahrung',
        '4. Erkennung-zu-Korrektur (D2C)',
        '   → Erkennung und Überwachung operativer Ereignisse',
        '   → Root-Cause-Analyse, Problem-Management, Incident-Response',
        '   → Rückverfolgbarkeit, Protokollierung, SIEM-Integrationen (ausgerichtet auf NIS2)',
        '5. Kontinuierliches Wert-Feedback',
        '   → Überwachung von Leistungsindikatoren entlang der Wertschöpfungskette',
        '   → Einrichtung von Feedback-Mechanismen für Prozessverbesserungen',
        '   → Bereitstellung technischer Überwachungsunterstützung für COBIT-Kontrollziele'
      ]
    },
    tr: {
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
    }
  },
  'Denetim Kayıtları': {
    en: {
      title: 'Audit Records Management Flowchart',
      steps: [
        '1. Determination of Logging Requirements',
        '   → Definition of which systems and processes will be logged',
        '   → Applicable regulations: NIS2, GDPR, ISO/IEC 27001, KVKK',
        '   → Critical event types (authentication, access, deletion, data transfer, etc.) are determined',
        '2. Standardization of Log Format and Content',
        '   → Log headers: date/time, user, transaction type, target resource',
        '   → Special metadata (IP, device ID, transaction result) added when needed',
        '   → Format: JSON, syslog, W3C standard or organization-specific',
        '3. Collection (Log Collection)',
        '   → Logs are collected at system level (OS), application level (web, database) and network level (firewall, proxy)',
        '   → Directed to central logging system via agent-based or agentless methods',
        '   → Secure transmission channel (TLS, VPN, bastion) is provided',
        '4. Protection and Immutability of Logs',
        '   → Use of WORM (Write Once Read Many) structure',
        '   → Hashing and digital signature (ISO 27001 A.12.4.2 / NIS2 compliant)',
        '   → Access control (read-only access for authorized auditors)',
        '5. Retention Period and Location',
        '   → GDPR/KVKK: should only be stored for the necessary period',
        '   → ISO 27001: legal requirements and risk-based periods',
        '   → Location: local (on-prem), cloud (ISO 27018 compliant) or hybrid',
        '6. Monitoring and Analysis of Logs',
        '   → SIEM integration (Splunk, ELK, Sentinel, etc.)',
        '   → Event correlation, anomaly detection and alert generation',
        '   → Continuous monitoring and automatic reporting (can be supported by SOAR)',
        '7. Access and Audit Process',
        '   → Secure viewing panel for auditors',
        '   → Log access requests, reasons and access time are logged',
        '   → DPO or information security manager approval may be required',
        '8. Archiving or Destruction of Logs',
        '   → Expired logs are securely destroyed (cryptographic deletion, data destruction certificate)',
        '   → Cold storage or compression is planned for data to be archived',
        '9. Integration Recommendations',
        '   → ITIL integration: can be placed in "Service Operation" phase',
        '   → COBIT integration: directly related to DSS01, DSS06 and MEA03 processes',
        '   → ISO/IEC 27001 reference: A.12.4 – Logging and monitoring, A.12.7 – Information systems audit considerations'
      ]
    },
    es: {
      title: 'Diagrama de Flujo de Gestión de Registros de Auditoría',
      steps: [
        '1. Determinación de Requisitos de Registro',
        '   → Definición de qué sistemas y procesos serán registrados',
        '   → Regulaciones aplicables: NIS2, GDPR, ISO/IEC 27001, KVKK',
        '   → Se determinan tipos de eventos críticos (autenticación, acceso, eliminación, transferencia de datos, etc.)',
        '2. Estandarización del Formato y Contenido de Registro',
        '   → Encabezados de registro: fecha/hora, usuario, tipo de transacción, recurso objetivo',
        '   → Metadatos especiales (IP, ID del dispositivo, resultado de la transacción) agregados cuando sea necesario',
        '   → Formato: JSON, syslog, estándar W3C o específico de la organización',
        '3. Recolección (Recolección de Logs)',
        '   → Los logs se recopilan a nivel de sistema (OS), nivel de aplicación (web, base de datos) y nivel de red (firewall, proxy)',
        '   → Dirigidos al sistema de registro centralizado vía métodos basados en agentes o sin agentes',
        '   → Se proporciona canal de transmisión seguro (TLS, VPN, bastión)',
        '4. Protección e Inmutabilidad de los Registros',
        '   → Uso de estructura WORM (Write Once Read Many)',
        '   → Hash y firma digital (ISO 27001 A.12.4.2 / compatible con NIS2)',
        '   → Control de acceso (acceso de solo lectura para auditores autorizados)',
        '5. Período de Retención y Ubicación',
        '   → GDPR/KVKK: solo debe almacenarse por el período necesario',
        '   → ISO 27001: requisitos legales y períodos basados en riesgo',
        '   → Ubicación: local (on-prem), nube (compatible con ISO 27018) o híbrido',
        '6. Monitoreo y Análisis de Registros',
        '   → Integración SIEM (Splunk, ELK, Sentinel, etc.)',
        '   → Correlación de eventos, detección de anomalías y generación de alertas',
        '   → Monitoreo continuo y reportes automáticos (puede ser soportado por SOAR)',
        '7. Proceso de Acceso y Auditoría',
        '   → Panel de visualización seguro para auditores',
        '   → Se registran las solicitudes de acceso a registros, razones y tiempo de acceso',
        '   → Puede requerirse aprobación del DPO o gerente de seguridad de la información',
        '8. Archivado o Destrucción de Registros',
        '   → Los registros expirados se destruyen de forma segura (eliminación criptográfica, certificado de destrucción de datos)',
        '   → Se planifica almacenamiento en frío o compresión para datos a archivar',
        '9. Recomendaciones de Integración',
        '   → Integración ITIL: puede colocarse en la fase "Service Operation"',
        '   → Integración COBIT: directamente relacionado con procesos DSS01, DSS06 y MEA03',
        '   → Referencia ISO/IEC 27001: A.12.4 – Logging and monitoring, A.12.7 – Information systems audit considerations'
      ]
    },
    it: {
      title: 'Diagramma di Flusso di Gestione dei Registri di Audit',
      steps: [
        '1. Determinazione dei Requisiti di Registrazione',
        '   → Definizione di quali sistemi e processi saranno registrati',
        '   → Regolamenti applicabili: NIS2, GDPR, ISO/IEC 27001, KVKK',
        '   → Si determinano i tipi di eventi critici (autenticazione, accesso, eliminazione, trasferimento dati, ecc.)',
        '2. Standardizzazione del Formato e Contenuto del Registro',
        '   → Intestazioni del registro: data/ora, utente, tipo di transazione, risorsa target',
        '   → Metadati speciali (IP, ID dispositivo, risultato transazione) aggiunti quando necessario',
        '   → Formato: JSON, syslog, standard W3C o specifico dell\'organizzazione',
        '3. Raccolta (Raccolta Log)',
        '   → I log vengono raccolti a livello di sistema (OS), livello applicazione (web, database) e livello rete (firewall, proxy)',
        '   → Diretti al sistema di logging centralizzato tramite metodi basati su agent o agentless',
        '   → Viene fornito canale di trasmissione sicuro (TLS, VPN, bastion)',
        '4. Protezione e Immutabilità dei Registri',
        '   → Uso della struttura WORM (Write Once Read Many)',
        '   → Hashing e firma digitale (ISO 27001 A.12.4.2 / conforme NIS2)',
        '   → Controllo dell\'accesso (accesso di sola lettura per auditor autorizzati)',
        '5. Periodo di Conservazione e Posizione',
        '   → GDPR/KVKK: dovrebbe essere conservato solo per il periodo necessario',
        '   → ISO 27001: requisiti legali e periodi basati sul rischio',
        '   → Posizione: locale (on-prem), cloud (conforme ISO 27018) o ibrido',
        '6. Monitoraggio e Analisi dei Registri',
        '   → Integrazione SIEM (Splunk, ELK, Sentinel, ecc.)',
        '   → Correlazione eventi, rilevamento anomalie e generazione allarmi',
        '   → Monitoraggio continuo e reporting automatico (può essere supportato da SOAR)',
        '7. Processo di Accesso e Audit',
        '   → Pannello di visualizzazione sicuro per auditor',
        '   → Richieste di accesso ai registri, motivi e tempo di accesso sono registrati',
        '   → Può essere richiesta approvazione del DPO o manager sicurezza informazione',
        '8. Archiviazione o Distruzione dei Registri',
        '   → I registri scaduti vengono distrutti in modo sicuro (cancellazione crittografica, certificato distruzione dati)',
        '   → È pianificato storage a freddo o compressione per dati da archiviare',
        '9. Raccomandazioni di Integrazione',
        '   → Integrazione ITIL: può essere posizionata nella fase "Service Operation"',
        '   → Integrazione COBIT: direttamente correlata ai processi DSS01, DSS06 e MEA03',
        '   → Riferimento ISO/IEC 27001: A.12.4 – Logging and monitoring, A.12.7 – Information systems audit considerations'
      ]
    },
    fr: {
      title: 'Diagramme de Flux de Gestion des Registres d\'Audit',
      steps: [
        '1. Détermination des Exigences de Journalisation',
        '   → Définition des systèmes et processus qui seront enregistrés',
        '   → Réglementations applicables: NIS2, RGPD, ISO/IEC 27001, KVKK',
        '   → Les types d\'événements critiques (authentification, accès, suppression, transfert de données, etc.) sont déterminés',
        '2. Standardisation du Format et du Contenu des Registres',
        '   → En-têtes de registre: date/heure, utilisateur, type de transaction, ressource cible',
        '   → Métadonnées spéciales (IP, ID appareil, résultat transaction) ajoutées si nécessaire',
        '   → Format: JSON, syslog, standard W3C ou spécifique à l\'organisation',
        '3. Collecte (Collecte de Logs)',
        '   → Les logs sont collectés au niveau système (OS), niveau application (web, base de données) et niveau réseau (pare-feu, proxy)',
        '   → Dirigés vers le système de journalisation centralisé via des méthodes basées sur agent ou sans agent',
        '   → Canal de transmission sécurisé (TLS, VPN, bastion) fourni',
        '4. Protection et Immutabilité des Registres',
        '   → Utilisation de la structure WORM (Write Once Read Many)',
        '   → Hachage et signature numérique (ISO 27001 A.12.4.2 / conforme NIS2)',
        '   → Contrôle d\'accès (accès en lecture seule pour les auditeurs autorisés)',
        '5. Période de Conservation et Emplacement',
        '   → RGPD/KVKK: ne doit être conservé que pour la période nécessaire',
        '   → ISO 27001: exigences légales et périodes basées sur les risques',
        '   → Emplacement: local (on-prem), cloud (conforme ISO 27018) ou hybride',
        '6. Surveillance et Analyse des Registres',
        '   → Intégration SIEM (Splunk, ELK, Sentinel, etc.)',
        '   → Corrélation d\'événements, détection d\'anomalies et génération d\'alertes',
        '   → Surveillance continue et rapports automatiques (peut être supporté par SOAR)',
        '7. Processus d\'Accès et d\'Audit',
        '   → Panneau de visualisation sécurisé pour les auditeurs',
        '   → Demandes d\'accès aux registres, raisons et heure d\'accès sont enregistrées',
        '   → Approbation du DPO ou du responsable sécurité informatique peut être requise',
        '8. Archivage ou Destruction des Registres',
        '   → Les registres expirés sont détruits de manière sécurisée (suppression cryptographique, certificat de destruction de données)',
        '   → Stockage à froid ou compression planifié pour les données à archiver',
        '9. Recommandations d\'Intégration',
        '   → Intégration ITIL: peut être placée dans la phase "Service Operation"',
        '   → Intégration COBIT: directement liée aux processus DSS01, DSS06 et MEA03',
        '   → Référence ISO/IEC 27001: A.12.4 – Logging and monitoring, A.12.7 – Information systems audit considerations'
      ]
    },
    de: {
      title: 'Audit-Aufzeichnungen-Management-Flussdiagramm',
      steps: [
        '1. Bestimmung der Protokollierungsanforderungen',
        '   → Definition, welche Systeme und Prozesse protokolliert werden',
        '   → Anwendbare Vorschriften: NIS2, DSGVO, ISO/IEC 27001, KVKK',
        '   → Kritische Ereignistypen (Authentifizierung, Zugriff, Löschung, Datenübertragung usw.) werden bestimmt',
        '2. Standardisierung des Protokollformats und -inhalts',
        '   → Protokoll-Header: Datum/Uhrzeit, Benutzer, Transaktionstyp, Zielressource',
        '   → Spezielle Metadaten (IP, Geräte-ID, Transaktionsergebnis) bei Bedarf hinzugefügt',
        '   → Format: JSON, syslog, W3C-Standard oder organisationsspezifisch',
        '3. Sammlung (Log-Sammlung)',
        '   → Logs werden auf Systemebene (OS), Anwendungsebene (Web, Datenbank) und Netzwerkebene (Firewall, Proxy) gesammelt',
        '   → Über agentenbasierte oder agentenlose Methoden zum zentralen Protokollierungssystem geleitet',
        '   → Sicherer Übertragungskanal (TLS, VPN, Bastion) wird bereitgestellt',
        '4. Schutz und Unveränderlichkeit der Protokolle',
        '   → Verwendung der WORM-Struktur (Write Once Read Many)',
        '   → Hashing und digitale Signatur (ISO 27001 A.12.4.2 / NIS2-konform)',
        '   → Zugriffskontrolle (nur Lesezugriff für autorisierte Prüfer)',
        '5. Aufbewahrungszeitraum und Standort',
        '   → DSGVO/KVKK: sollte nur für den notwendigen Zeitraum gespeichert werden',
        '   → ISO 27001: rechtliche Anforderungen und risikobasierte Zeiträume',
        '   → Standort: lokal (on-prem), Cloud (ISO 27018-konform) oder hybrid',
        '6. Überwachung und Analyse der Protokolle',
        '   → SIEM-Integration (Splunk, ELK, Sentinel usw.)',
        '   → Ereigniskorrelation, Anomalieerkennung und Alarmgenerierung',
        '   → Kontinuierliche Überwachung und automatische Berichterstattung (kann durch SOAR unterstützt werden)',
        '7. Zugriffs- und Audit-Prozess',
        '   → Sicheres Anzeigepanel für Prüfer',
        '   → Protokollzugriffsanfragen, Gründe und Zugriffszeit werden protokolliert',
        '   → Genehmigung des DPO oder Informationssicherheitsmanagers kann erforderlich sein',
        '8. Archivierung oder Vernichtung der Protokolle',
        '   → Abgelaufene Protokolle werden sicher vernichtet (kryptografische Löschung, Datenvernichtungszertifikat)',
        '   → Kaltlagerung oder Komprimierung für zu archivierende Daten geplant',
        '9. Integrationsempfehlungen',
        '   → ITIL-Integration: kann in der "Service Operation"-Phase platziert werden',
        '   → COBIT-Integration: direkt mit DSS01-, DSS06- und MEA03-Prozessen verbunden',
        '   → ISO/IEC 27001-Referenz: A.12.4 – Logging and monitoring, A.12.7 – Information systems audit considerations'
      ]
    },
    tr: {
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
  }
};

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [selectedFlowchart, setSelectedFlowchart] = useState(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);

  const current = decisionTrees[selectedLanguage].find(q => q.id === step);
  const t = translations[selectedLanguage];

  const handleOption = (option) => {
    if (option.next) {
      setHistory([...history, { step, option: option.text }]);
      setStep(option.next);
    } else if (option.result) {
      setResult(option.result);
      setRoadmap(option.roadmap ? roadmaps[selectedLanguage][option.roadmap] : null);
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
    setSelectedFlowchart(flowcharts[flowchartKey][selectedLanguage]);
  };

  const closeFlowchart = () => {
    setSelectedFlowchart(null);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setShowLanguageSelector(false);
    handleRestart();
  };

  const handleStartAssessment = () => {
    setShowLanguageSelector(false);
  };

  // Dil seçimi ekranı
  if (showLanguageSelector) {
  return (
    <div className="container">
        <h1>{t.title}</h1>
        <div className="language-selector">
          <h2>{t.languageSelect}</h2>
          <div className="language-grid">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                className={`language-btn ${selectedLanguage === code ? 'selected' : ''}`}
                onClick={() => handleLanguageChange(code)}
              >
                <span className="flag">{lang.flag}</span>
                <span className="code">({lang.code})</span>
                <span className="name">{lang.name}</span>
              </button>
            ))}
          </div>
          <button className="start-btn" onClick={handleStartAssessment}>
            {t.startButton}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>{t.title}</h1>
        <div className="language-switcher">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              className={`lang-switch-btn ${selectedLanguage === code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(code)}
            >
              {lang.flag}
            </button>
          ))}
        </div>
      </div>
      
      {result ? (
        <div className="result">
          <h2>{t.result}</h2>
          <p>{result}</p>
          {roadmap && (
            <div className="roadmap">
              <h3>{t.roadmap}</h3>
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
                        <span className="click-hint">{t.clickHint}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          <button onClick={handleRestart}>{t.restart}</button>
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
              {t.restart}
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
