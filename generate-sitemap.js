// Sitemap 생성 스크립트
// 모든 성경 책과 장을 sitemap.xml에 추가

const fs = require('fs');
const path = require('path');

// 성경 책 정보 (책 코드, 한글명, 총 장수)
const books = [
  // 구약
  { code: 'gen', name: '창세기', chapters: 50 },
  { code: 'exo', name: '출애굽기', chapters: 40 },
  { code: 'lev', name: '레위기', chapters: 27 },
  { code: 'num', name: '민수기', chapters: 36 },
  { code: 'deut', name: '신명기', chapters: 34 },
  { code: 'jos', name: '여호수아', chapters: 24 },
  { code: 'jdg', name: '사사기', chapters: 21 },
  { code: 'rth', name: '룻기', chapters: 4 },
  { code: '1sam', name: '사무엘상', chapters: 31 },
  { code: '2sam', name: '사무엘하', chapters: 24 },
  { code: '1kgs', name: '열왕기상', chapters: 22 },
  { code: '2kgs', name: '열왕기하', chapters: 25 },
  { code: '1chr', name: '역대상', chapters: 29 },
  { code: '2chr', name: '역대하', chapters: 36 },
  { code: 'ezr', name: '에스라', chapters: 10 },
  { code: 'neh', name: '느헤미야', chapters: 13 },
  { code: 'esth', name: '에스더', chapters: 10 },
  { code: 'job', name: '욥기', chapters: 42 },
  { code: 'psm', name: '시편', chapters: 150 },
  { code: 'prv', name: '잠언', chapters: 31 },
  { code: 'ecc', name: '전도서', chapters: 12 },
  { code: 'song', name: '아가', chapters: 8 },
  { code: 'isa', name: '이사야', chapters: 66 },
  { code: 'jer', name: '예레미야', chapters: 52 },
  { code: 'lam', name: '예레미야 애가', chapters: 5 },
  { code: 'ezk', name: '에스겔', chapters: 48 },
  { code: 'dan', name: '다니엘', chapters: 12 },
  { code: 'hos', name: '호세아', chapters: 14 },
  { code: 'joel', name: '요엘', chapters: 3 },
  { code: 'amos', name: '아모스', chapters: 9 },
  { code: 'obad', name: '오바댜', chapters: 1 },
  { code: 'jon', name: '요나', chapters: 4 },
  { code: 'mic', name: '미가', chapters: 7 },
  { code: 'nah', name: '나훔', chapters: 3 },
  { code: 'hab', name: '하박국', chapters: 3 },
  { code: 'zep', name: '스바냐', chapters: 3 },
  { code: 'hag', name: '학개', chapters: 2 },
  { code: 'zec', name: '스가랴', chapters: 14 },
  { code: 'mal', name: '말라기', chapters: 4 },
  // 신약
  { code: 'mat', name: '마태복음', chapters: 28 },
  { code: 'mrk', name: '마가복음', chapters: 16 },
  { code: 'luk', name: '누가복음', chapters: 24 },
  { code: 'john', name: '요한복음', chapters: 21 },
  { code: 'acts', name: '사도행전', chapters: 28 },
  { code: 'rom', name: '로마서', chapters: 16 },
  { code: '1cor', name: '고린도전서', chapters: 16 },
  { code: '2cor', name: '고린도후서', chapters: 13 },
  { code: 'gal', name: '갈라디아서', chapters: 6 },
  { code: 'eph', name: '에베소서', chapters: 6 },
  { code: 'phil', name: '빌립보서', chapters: 4 },
  { code: 'col', name: '골로새서', chapters: 4 },
  { code: '1the', name: '데살로니가전서', chapters: 5 },
  { code: '2the', name: '데살로니가후서', chapters: 3 },
  { code: '1tim', name: '디모데전서', chapters: 6 },
  { code: '2tim', name: '디모데후서', chapters: 4 },
  { code: 'tit', name: '디도서', chapters: 3 },
  { code: 'phm', name: '빌레몬서', chapters: 1 },
  { code: 'heb', name: '히브리서', chapters: 13 },
  { code: 'jas', name: '야고보서', chapters: 5 },
  { code: '1pet', name: '베드로전서', chapters: 5 },
  { code: '2pet', name: '베드로후서', chapters: 3 },
  { code: '1jn', name: '요한일서', chapters: 5 },
  { code: '2jn', name: '요한이서', chapters: 1 },
  { code: '3jn', name: '요한삼서', chapters: 1 },
  { code: 'jud', name: '유다서', chapters: 1 },
  { code: 'rev', name: '요한계시록', chapters: 22 }
];

// 우선순위 설정 (자주 읽히는 구절)
const highPriority = [
  'gen/1', 'gen/3', 'exo/20', 'psm/1', 'psm/23', 'psm/51', 'psm/91', 'psm/139',
  'isa/53', 'jer/29', 'mat/5', 'mat/6', 'mat/28', 'john/1', 'john/3', 'john/14',
  'acts/2', 'rom/3', 'rom/8', 'rom/12', '1cor/13', '1cor/15', 'gal/5', 
  'eph/2', 'eph/6', 'phil/2', 'phil/4', 'heb/11', 'jas/2', '1jn/4', 'rev/21'
];

function generateSitemap() {
  const baseUrl = 'https://fingerbible.com';
  const today = new Date().toISOString().split('T')[0];
  const versions = ['rnksv', 'krv'];
  const versionNames = { rnksv: '새번역', krv: '개역개정' };
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  
  // 홈페이지
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n';
  
  // 모든 성경 구절 (버전별로)
  let totalUrls = 1; // 홈페이지
  let urlsByVersion = { rnksv: 0, krv: 0 };
  
  versions.forEach(version => {
    books.forEach(book => {
      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        const url = `${version}/${book.code}/${chapter}`;
        const isHighPriority = highPriority.includes(`${book.code}/${chapter}`);
        const priority = isHighPriority ? '0.8' : '0.6';
        const changefreq = isHighPriority ? 'monthly' : 'yearly';
        
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/${url}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${changefreq}</changefreq>\n`;
        xml += `    <priority>${priority}</priority>\n`;
        xml += '  </url>\n';
        
        totalUrls++;
        urlsByVersion[version]++;
      }
    });
  });
  
  xml += '</urlset>';
  
  // sitemap.xml 저장
  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  
  console.log('\n✅ Sitemap generated successfully!');
  console.log(`📄 File: ${sitemapPath}`);
  console.log(`🔗 Total URLs: ${totalUrls.toLocaleString()}`);
  console.log(`📊 Breakdown:`);
  console.log(`   - Homepage: 1`);
  
  versions.forEach(version => {
    console.log(`   - ${versionNames[version]}: ${urlsByVersion[version].toLocaleString()} URLs`);
  });
  
  console.log(`\n📖 Books per version: ${books.length} books`);
  console.log(`📄 Total chapters: ${books.reduce((sum, book) => sum + book.chapters, 0)}`);
  
  console.log(`\n💡 Submit to Google Search Console:`);
  console.log(`   https://search.google.com/search-console`);
  console.log(`\n🌐 Sitemap URL:`);
  console.log(`   ${baseUrl}/sitemap.xml\n`);
}

// 실행
generateSitemap();

