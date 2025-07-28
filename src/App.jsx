import { useState } from 'react'
import './App.css'

// Dil seçenekleri
const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  fr: { name: 'Français', flag: '🇫🇷' },
  tr: { name: 'Türkçe', flag: '🇹🇷' }
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

// Dil bazlı karar ağaçları
const decisionTrees = {
  en: decisionTreeEN,
  es: decisionTreeES,
  it: decisionTreeIT,
  fr: decisionTreeFR,
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
