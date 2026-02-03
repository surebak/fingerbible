/**
 * Sitemap 생성 스크립트
 * 실행: node scripts/generate-sitemap.js
 * 빌드 시 자동 실행됨 (vite.config.js에서 호출)
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://fingerbible.com';

const OLD_TESTAMENT = [
  { id: 'gen', chapters: 50 }, { id: 'exo', chapters: 40 }, { id: 'lev', chapters: 27 },
  { id: 'num', chapters: 36 }, { id: 'deut', chapters: 34 }, { id: 'jos', chapters: 24 },
  { id: 'jdg', chapters: 21 }, { id: 'rth', chapters: 4 }, { id: '1sam', chapters: 31 },
  { id: '2sam', chapters: 24 }, { id: '1kgs', chapters: 22 }, { id: '2kgs', chapters: 25 },
  { id: '1chr', chapters: 29 }, { id: '2chr', chapters: 36 }, { id: 'ezr', chapters: 10 },
  { id: 'neh', chapters: 13 }, { id: 'esth', chapters: 10 }, { id: 'job', chapters: 42 },
  { id: 'psm', chapters: 150 }, { id: 'prv', chapters: 31 }, { id: 'ecc', chapters: 12 },
  { id: 'song', chapters: 8 }, { id: 'isa', chapters: 66 }, { id: 'jer', chapters: 52 },
  { id: 'lam', chapters: 5 }, { id: 'ezk', chapters: 48 }, { id: 'dan', chapters: 12 },
  { id: 'hos', chapters: 14 }, { id: 'joel', chapters: 3 }, { id: 'amos', chapters: 9 },
  { id: 'obad', chapters: 1 }, { id: 'jon', chapters: 4 }, { id: 'mic', chapters: 7 },
  { id: 'nah', chapters: 3 }, { id: 'hab', chapters: 3 }, { id: 'zep', chapters: 3 },
  { id: 'hag', chapters: 2 }, { id: 'zec', chapters: 14 }, { id: 'mal', chapters: 4 },
];

const NEW_TESTAMENT = [
  { id: 'mat', chapters: 28 }, { id: 'mrk', chapters: 16 }, { id: 'luk', chapters: 24 },
  { id: 'john', chapters: 21 }, { id: 'acts', chapters: 28 }, { id: 'rom', chapters: 16 },
  { id: '1cor', chapters: 16 }, { id: '2cor', chapters: 13 }, { id: 'gal', chapters: 6 },
  { id: 'eph', chapters: 6 }, { id: 'phil', chapters: 4 }, { id: 'col', chapters: 4 },
  { id: '1the', chapters: 5 }, { id: '2the', chapters: 3 }, { id: '1tim', chapters: 6 },
  { id: '2tim', chapters: 4 }, { id: 'tit', chapters: 3 }, { id: 'phm', chapters: 1 },
  { id: 'heb', chapters: 13 }, { id: 'jas', chapters: 5 }, { id: '1pet', chapters: 5 },
  { id: '2pet', chapters: 3 }, { id: '1jn', chapters: 5 }, { id: '2jn', chapters: 1 },
  { id: '3jn', chapters: 1 }, { id: 'jud', chapters: 1 }, { id: 'rev', chapters: 22 },
];

const ALL_BOOKS = [...OLD_TESTAMENT, ...NEW_TESTAMENT];
const VERSIONS = ['rnksv', 'krv'];

// 인기 성경 구절 (높은 priority)
const POPULAR_BOOKS = ['gen', 'psm', 'prv', 'isa', 'mat', 'john', 'rom', 'rev'];

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  let urls = [];

  // 홈페이지
  urls.push({
    loc: BASE_URL,
    lastmod: today,
    changefreq: 'weekly',
    priority: '1.0',
  });

  // 모든 성경 페이지
  for (const version of VERSIONS) {
    for (const book of ALL_BOOKS) {
      for (let ch = 1; ch <= book.chapters; ch++) {
        const isPopular = POPULAR_BOOKS.includes(book.id) && ch <= 5;
        urls.push({
          loc: `${BASE_URL}/${version}/${book.id}/${ch}`,
          lastmod: today,
          changefreq: 'monthly',
          priority: isPopular ? '0.8' : '0.6',
        });
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const outputPath = resolve(__dirname, '../public/sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');
  console.log(`Sitemap generated: ${urls.length} URLs → ${outputPath}`);
}

generateSitemap();
