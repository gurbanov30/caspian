const bcrypt = require('bcryptjs');
const db = require('../db');
const config = require('../config');

const settings = {
  site: {
    companyName: 'Caspian Motors Clinic',
    legalName: 'Caspian Motors Clinic MMC',
    tagline: 'Marine Solutions · MMC',
    logo: 'assets/logo.png',
    favicon: 'assets/favicon.png',
    description: 'Caspian Motors Clinic — gəmi mühərrikləri və dəniz texniki sistemləri üçün peşəkar təmir və servis xidmətləri.',
    canonicalUrl: 'https://www.caspianmc.com/',
    ogImage: 'assets/image4.png',
    instagram: 'https://instagram.com/caspianmotorsclinic',
    latitude: 40.38,
    longitude: 49.95
  },
  header: {
    nav: [
      { label: 'Haqqımızda', href: '#haqqimizda' },
      { label: 'Təcrübə & İrs', href: '#tarixce' },
      { label: 'Xidmətlər', href: '#xidmetler' },
      { label: 'İş prosesimiz', href: '#proses' },
      { label: 'Təhlükəsizlik', href: '#tehlukesizlik' },
      { label: 'Əlaqə', href: '#elaqe' }
    ],
    actionLabel: 'Texniki Sorğu'
  },
  hero: {
    eyebrow: 'Marine solutions · trusted partner',
    title: 'Dənizdə etibarlı güc üçün peşəkar texniki həllər.',
    emphasis: 'güc',
    description: 'Gəmi mühərrikləri, mexaniki sistemlər və dəniz avadanlıqları üzrə dəqiq diaqnostika, əsaslı təmir və operativ servis.',
    primaryLabel: 'Texniki Sorğu Göndərin',
    secondaryLabel: 'Xidmətlərimiz',
    secondaryHref: '#xidmetler',
    slides: ['assets/hero_bg.jpg', 'assets/hero_bg2.jpg', 'assets/hero_bg3.jpg']
  },
  about: {
    eyebrow: 'Şirkət profili',
    title: 'Dəniz sənayesində etibarlı texniki tərəfdaşınız.',
    paragraphs: [
      'Şirkətimizin əsası 2003-cü ildə mühərriklərin, mexaniki və elektron sistemlərin təmiri sahəsində peşəkar xidmət göstərmək məqsədilə qoyulub. İlk illərimizdən ağır sənaye texnikalarının, metro tunelqazma qurğularının, zirehli hərbi texnikaların və tank mühərriklərinin/transmissiyalarının təmiri kimi yüksək dəqiqlik tələb edən layihələrdə iştirak etmişik.',
      'İllər ərzində qazanılan zəngin mühəndislik təcrübəsini dəniz sənayesinə yönəldərək baş və köməkçi gəmi mühərrikləri, dizel-generatorlar, reduktorlar və Waterjet sistemləri üzrə etibarlı tərəfdaş mövqeyimizi möhkəmləndirmişik.'
    ],
    foundedYear: '2003',
    foundedText: 'ildən peşəkar mühəndislik və təmir təcrübəsi',
    image: 'assets/image4.png',
    imageAlt: 'Caspian Motors Clinic texniki heyəti gəmi yanında',
    ctaLabel: 'Texniki Sorğu Göndər',
    checklist: [
      'Baş və köməkçi dizel mühərriklərinin cari, orta və əsaslı təmiri',
      'Waterjet, reduktor, mufta və val xətlərinin servisi',
      'Elektron idarəetmə panelləri, sensorlar və hidravlik boru xətləri'
    ]
  },
  heritage: {
    eyebrow: '2003-dən bu günə',
    title: 'Zəngin mühəndislik irsi və dərin texniki təcrübə.',
    description: 'Şirkətimiz ağır sənaye və yüksək dəqiqlik tələb edən xüsusi mühəndislik layihələrindən dəniz sənayesinə uzanan zəngin inkişaf yolu keçmişdir.'
  },
  stats: {
    items: [
      { value: '20+', label: 'İl Mühəndislik Təcrübəsi' },
      { value: '100%', label: 'Orijinal və Sertifikatlı Hissələr' },
      { value: 'On-Board', label: 'Liman & Dənizdə Operativ Servis' },
      { value: '0 Qəza', label: 'HSE Təhlükəsizlik Prinsipi' }
    ]
  },
  servicesSection: {
    eyebrow: 'Xidmət istiqamətləri',
    title: 'Gəminin hər sisteminə peşəkar qayğı.'
  },
  principles: {
    eyebrow: 'Şirkət siyasəti',
    title: 'Keyfiyyəti formalaşdıran dəyişməz prinsiplər.',
    description: 'Rəhbərlikdən texniki heyətə qədər hər bir əməkdaş görülən işlərin yüksək keyfiyyətinə və xidmətlərin davamlı təkmilləşdirilməsinə görə fərdi məsuliyyət daşıyır.'
  },
  capabilities: {
    eyebrow: 'Kompleks imkanlar',
    title: 'Texniki problemləri sistemli həllə çeviririk.',
    description: 'Müasir diaqnostika vasitələri, düzgün ehtiyat hissələri və təcrübəli komanda ilə hər bir avadanlığın etibarlı işləməsi üçün çalışırıq.',
    ctaLabel: 'Texniki sorğu göndərin',
    image: 'assets/image6.png',
    imageAlt: 'Təmir üçün mühərrik aqreqatının qaldırılması'
  },
  safety: {
    eyebrow: 'HSE standartları',
    title: 'Təhlükəsizlik bizim üçün əsas prioritetdir.',
    highlight: 'əsas prioritetdir.',
    description: 'Təmir, montaj və servis işlərimiz beynəlxalq dənizçilik standartlarına, istehsalçı tələblərinə və qüvvədə olan təhlükəsizlik qaydalarına uyğun icra olunur.',
    cardTitle: '“Sıfır qəza” prinsipi',
    cardDescription: 'Hər layihə risklərin qiymətləndirilməsi ilə başlayır. Mütəxəssislərimiz təhlükəsiz iş metodları, müntəzəm təlim və fərdi mühafizə vasitələri ilə ən yüksək HSE standartlarına riayət edir.'
  },
  process: {
    eyebrow: 'İş prosesimiz',
    title: 'Dəqiqliklə planlanan, nəticəyə fokuslanan xidmət.',
    description: 'Nasazlığın ilkin qiymətləndirilməsindən təmir sonrası sınağa qədər şəffaf və idarə olunan proses.'
  },
  statement: {
    eyebrow: 'Şirkət siyasəti',
    quote: '“Müştərilərimizin texniki ehtiyaclarını dərindən öyrənir, mühərrik nasazlıqlarını zərgər dəqiqliyi ilə bərpa edirik.”',
    cite: 'Caspian Motors Clinic MMC',
    image: 'assets/image30.png',
    imageAlt: 'Klapanın təmir və bərpa işi'
  },
  contact: {
    eyebrow: 'Əlaqə',
    title: 'Bizimlə əlaqə saxlayın.',
    description: 'Texniki servis və dəniz həlləri ilə bağlı suallarınız üçün komandamızla birbaşa əlaqə yarada bilərsiniz.',
    ctaLabel: 'Texniki Sorğu Göndər'
  },
  footer: {
    description: 'Gəmi mühərrikləri və dəniz texniki sistemləri üzrə peşəkar təmir, bərpa və servis həlləri.',
    navigationTitle: 'Naviqasiya',
    copyright: 'Bütün hüquqlar qorunur.',
    closing: 'Marine solutions. Trusted partner.'
  },
  inquiry: {
    eyebrow: 'Onlayn Texniki Sorğu',
    title: 'Texniki xidmət və təmir sorğusu',
    description: 'Gəmi mühərriki, mexaniki və ya elektron sistemləriniz üçün mühəndislərimizə sorğu göndərin.',
    nameLabel: 'Adınız / Şirkətin Adı *',
    phoneLabel: 'Əlaqə Telefonu *',
    serviceLabel: 'Xidmət Sahəsi *',
    locationLabel: 'İcra Yeri',
    messageLabel: 'Sorğunun Təsviri və Nasazlıq Haqqında Qeyd',
    successTitle: 'Təşəkkür edirik! Sorğunuz qəbul olundu.',
    successDescription: 'Mühəndislərimiz təhlil edib ən qısa zamanda sizinlə əlaqə saxlayacaqlar.'
  }
};

const collections = {
  trust_items: [
    ['reliable-service', 0, { text: 'Etibarlı Xidmət' }],
    ['technical-excellence', 1, { text: 'Texniki Mükəmməllik' }],
    ['customer-satisfaction', 2, { text: 'Müştəri Məmnuniyyəti' }],
    ['engineering-experience', 3, { text: '20+ İl Mühəndislik Təcrübəsi' }],
    ['original-parts', 4, { text: 'Orijinal Ehtiyat Hissələri' }],
    ['onboard-service', 5, { text: 'On-Board Operativ Servis' }],
    ['waterjet', 6, { text: 'Waterjet & Transmissiya' }],
    ['zero-accident', 7, { text: 'HSE “Sıfır Qəza” Standartı' }],
    ['hydraulics-piping', 8, { text: 'Hidravlika & Boru Xətləri' }],
    ['electronics', 9, { text: 'Elektron & Sensor Diaqnostikası' }]
  ],
  heritage_items: [
    ['foundation', 0, { eyebrow: '2003 – Əsasının Qoyulması', title: 'Ağır Sənaye & Tunelqazma Qurğuları', description: 'Buldozerlər, ağır sənaye texnikası və metro tunelqazma qurğularının yüksək dəqiqlik tələb edən mühərriklərinin yığılması və sazlanması layihələri.' }],
    ['special-engineering', 1, { eyebrow: 'Hərbi & Xüsusi Mühəndislik', title: 'Zirehli Texnika & Tank Mühərrikləri', description: 'Zirehli hərbi texnikaların və tankların mühərrik, transmissiya və elektron idarəetmə sistemlərinin diaqnostikası, təmiri və istismara hazırlanması.' }],
    ['marine-industry', 2, { eyebrow: 'Bu gün – Dəniz Sənayesi', title: 'Gəmi Təmiri & Waterjet Sistemləri', description: 'Zəngin təcrübəmizi dəniz sənayesinə yönəldərək gəmi baş mühərrikləri, Waterjet, hidravlika və avtomatlaşdırma üzrə etibarlı tərəfdaş mövqeyi.' }]
  ],
  services: [
    ['engines', 0, { category: 'engine', kicker: '01 / Mühərriklər', title: 'Baş Mühərriklər & Dizel-Generatorlar', description: 'On-board və emalatxanada cari, orta və əsaslı təmir, sınaq və sazlama.', image: 'assets/image10.png', alt: 'Gəmi mühərriki' }],
    ['waterjet-transmission', 1, { category: 'waterjet', kicker: '02 / Waterjet & Transmissiya', title: 'Waterjet & Reduktor Sistemləri', description: 'Reduktor, val xətləri, Waterjet modernizasiyası və gücötürmə aqreqatlarının bərpası.', image: 'assets/image9.png', alt: 'Gəmi propulsiv sistemi' }],
    ['piping-valves', 2, { category: 'piping', kicker: '03 / Sistemlər & Klapanlar', title: 'Boru Xətləri & Klapanlar', description: 'Yanacaq, yağ, soyutma, ballast və çirkab su xətlərinin yenilənməsi.', image: 'assets/image20.png', alt: 'Boru xətləri və klapanlar' }],
    ['hydraulic-systems', 3, { category: 'hydraulics', kicker: '04 / Hidravlika', title: 'Hidravlik Sistemlər & Yüksək Təzyiq', description: 'Nasoslar, silindrlər, paylayıcı sistemlər və hidravlik yağ dəyişdirilməsi.', image: 'assets/image6.png', alt: 'Hidravlik sistemlər' }],
    ['fire-safety', 4, { category: 'co2', kicker: '05 / Təhlükəsizlik', title: 'CO₂ Yanğınsöndürmə & Quick Closing Valve', description: 'CO₂ balonları, boru xətləri və QCV mexanizmlərinin texniki baxışı.', image: 'assets/image4.png', alt: 'CO2 yanğınsöndürmə' }],
    ['automation-hvac', 5, { category: 'hvac', kicker: '06 / Otomasyon & HVAC', title: 'Elektron İdarəetmə & İqlimləndirmə', description: 'Sensor diaqnostikası, kompressorlar və freon sistemlərinin servisi.', image: 'assets/image30.png', alt: 'Elektron idarəetmə' }]
  ],
  principles: [
    ['precision', 0, { index: '01 / Dəqiqlik', title: 'Professional təmir və eksklüziv bərpa', description: 'Mexanizmlər və mühərrik detallarının təmiri böyük usta təcrübəsi ilə icra olunur, aqreqatlar vizual və funksional olaraq işlək vəziyyətə gətirilir.' }],
    ['reliability', 1, { index: '02 / Etibarlılıq', title: 'Yalnız orijinal ehtiyat hissələri', description: 'Dənizdə təhlükəsizliyi və mühərrikin ömrünü qorumaq üçün təmir zamanı sertifikatlı, istehsalçı tərəfindən təsdiqlənmiş hissələrdən istifadə edilir.' }],
    ['speed', 2, { index: '03 / Operativlik', title: 'Zamanın idarəolunması və sürət', description: 'Gəminin yersiz dayanmasının maliyyə itkisi yaratdığını bilirik; işlərimiz operativ, planlı və təhlükəsizlik qaydalarına tam uyğun təşkil olunur.' }]
  ],
  capabilities: [
    ['engine-overhaul', 0, { title: 'Mühərrik və aqreqatların əsaslı təmiri', description: 'Krank mili, silindr qolları, porşen, şatun, klapan mexanizmləri və digər əsas komponentlərin defektasiyası, təmiri və zəruri olduqda dəyişdirilməsi həyata keçirilir.' }],
    ['hydraulic-diagnostics', 1, { title: 'Hidravlik sistemlərin diaqnostikası', description: 'Yüksək təzyiqli nasoslar, silindrlər, paylayıcı sistemlər və boru xətləri yoxlanılır; nasazlıqlar və yağ sızmaları aradan qaldırılır, sistem sınaqdan keçirilir.' }],
    ['co2-systems', 2, { title: 'CO₂ yanğınsöndürmə sistemləri', description: 'CO₂ balonları, yüksək təzyiqli boru xətləri, paylayıcı sistemlər və Quick Closing Valve mexanizmləri texniki baxışdan keçirilir, sızdırmazlıq təmin edilir.' }],
    ['water-fuel-lines', 3, { title: 'Su, yanacaq və çirkab su xətləri', description: 'Korroziyaya uğramış və istismar müddətini başa vurmuş borular, flanşlar, klapanlar və digər komponentlər müasir, davamlı həllərlə yenilənir.' }],
    ['hvac-systems', 4, { title: 'İqlimləndirmə və kondisioner sistemləri', description: 'Kompressorlar və freon xətləri yoxlanılır, sistem təmizlənir, sızmalar aradan qaldırılır və lazımi həcmdə soyuducu qazla doldurulur.' }]
  ],
  process_steps: [
    ['diagnostics', 0, { number: '01', title: 'Diaqnostika', description: 'Avadanlığın texniki vəziyyəti ətraflı yoxlanılır, problem və ehtiyaclar müəyyən edilir.' }],
    ['work-plan', 1, { number: '02', title: 'İş planı', description: 'Təmir həcmi, ehtiyat hissələri və təhlükəsizlik tələbləri əsasında həll formalaşdırılır.' }],
    ['repair', 2, { number: '03', title: 'Təmir və bərpa', description: 'Peşəkar ustalar işləri planlı şəkildə icra edir, zəruri komponentlər yenilənir.' }],
    ['testing', 3, { number: '04', title: 'Sınaq və təhvil', description: 'Sazlama, funksional sınaq və keyfiyyət yoxlamasından sonra avadanlıq istismara verilir.' }]
  ],
  contact_items: [
    ['address', 0, { type: 'map', label: 'Ünvan', value: 'İnqilab İsmayılov 6, Xətai r-nu, Bakı' }],
    ['mobile', 1, { type: 'phone', label: 'Mobil Telefon', value: '+994 55 230 88 09', href: 'tel:+994552308809' }],
    ['landline', 2, { type: 'phone', label: 'Şəhər Telefonu', value: '+994 12 571 41 23', href: 'tel:+994125714123' }],
    ['whatsapp', 3, { type: 'whatsapp', label: 'WhatsApp', value: '+994 55 230 88 09', href: 'https://wa.me/994552308809' }],
    ['email', 4, { type: 'email', label: 'E-poçt', value: 'caspianmotorsclinic@gmail.com', href: 'mailto:caspianmotorsclinic@gmail.com' }],
    ['instagram', 5, { type: 'instagram', label: 'Instagram', value: '@caspianmotorsclinic', href: 'https://instagram.com/caspianmotorsclinic' }]
  ]
};

function seed() {
  const insertSetting = db.prepare(`INSERT OR IGNORE INTO settings (key, value_json) VALUES (?, ?)`);
  const insertItem = db.prepare(`INSERT OR IGNORE INTO content_items (collection, slug, position, data_json) VALUES (?, ?, ?, ?)`);

  const transaction = db.transaction(() => {
    Object.entries(settings).forEach(([key, value]) => insertSetting.run(key, JSON.stringify(value)));
    Object.entries(collections).forEach(([collection, items]) => {
      items.forEach(([slug, position, data]) => insertItem.run(collection, slug, position, JSON.stringify(data)));
    });
  });
  transaction();
  require('./refine-default-copy')(db);

  if (config.adminEmail && config.adminPassword) {
    const existing = db.prepare('SELECT id FROM admin_users WHERE email = ?').get(config.adminEmail);
    if (!existing) {
      const hash = bcrypt.hashSync(config.adminPassword, 12);
      db.prepare("INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, 'super_admin')").run(config.adminEmail, hash);
      console.log(`Created admin user: ${config.adminEmail}`);
    } else {
      db.prepare("UPDATE admin_users SET role = 'super_admin', is_active = 1 WHERE id = ?").run(existing.id);
    }
  }
}

module.exports = seed;
