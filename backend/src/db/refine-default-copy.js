// Refresh only exact legacy defaults, preserving separately edited CMS content.
const replacements = new Map([
  ['Marine solutions · trusted partner', 'Caspian Motors Clinic · Dəniz mühəndisliyi'],
  ['Dənizdə etibarlı güc üçün peşəkar texniki həllər.', 'Dənizdə etibarlı güc. Arxasında təcrübə.'],
  ['Dəniz sənayesində etibarlı texniki tərəfdaşınız.', 'Mühəndislik təcrübəsi. Dənizə bağlılıq.'],
  ['Zəngin mühəndislik irsi və dərin texniki təcrübə.', 'Ağır sənayedən dəniz mühəndisliyinə.'],
  ['Gəminin hər sisteminə peşəkar qayğı.', 'Hər sistem üçün dəqiq texniki həll.'],
  ['Keyfiyyəti formalaşdıran dəyişməz prinsiplər.', 'İşimizin əsasını təşkil edən prinsiplər.'],
  ['Professional təmir və eksklüziv bərpa', 'Dəqiq təmir və bərpa'],
  ['Zamanın idarəolunması və sürət', 'Planlı iş, operativ servis'],
  ['Texniki problemləri sistemli həllə çeviririk.', 'Texniki imkanlarımız.'],
  ['Dəqiqliklə planlanan, nəticəyə fokuslanan xidmət.', 'Diaqnostikadan təhvilə.'],
  ['“Müştərilərimizin texniki ehtiyaclarını dərindən öyrənir, mühərrik nasazlıqlarını zərgər dəqiqliyi ilə bərpa edirik.”', '“Hər təmirə avadanlığı tanımaqla başlayır, işimizi sınaqla tamamlayırıq.”'],
  ['Bizimlə əlaqə saxlayın.', 'Texniki ehtiyacınızı birlikdə dəqiqləşdirək.'],
  ['Texniki Sorğu Göndərin', 'Texniki sorğu göndərin'],
  ['Texniki Sorğu Göndər', 'Texniki sorğu göndər']
]);

function refresh(value) {
  if (typeof value === 'string') return replacements.get(value) || value;
  if (Array.isArray(value)) return value.map(refresh);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, refresh(item)]));
  return value;
}

module.exports = function refineDefaultCopy(db) {
  db.exec('CREATE TABLE IF NOT EXISTS content_migrations (name TEXT PRIMARY KEY)');
  const name = '2026-09-refined-public-copy';
  db.transaction(() => {
    if (db.prepare('SELECT name FROM content_migrations WHERE name = ?').get(name)) return;
    for (const [table, column, key] of [['settings', 'value_json', 'key'], ['content_items', 'data_json', 'id']]) {
      const update = db.prepare(`UPDATE ${table} SET ${column} = ? WHERE ${key} = ?`);
      for (const row of db.prepare(`SELECT ${key}, ${column} FROM ${table}`).all()) {
        const original = JSON.parse(row[column]);
        const revised = refresh(original);
        if (JSON.stringify(original) !== JSON.stringify(revised)) update.run(JSON.stringify(revised), row[key]);
      }
    }
    db.prepare('INSERT INTO content_migrations (name) VALUES (?)').run(name);
  })();
};
