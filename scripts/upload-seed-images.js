const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'des50gqzc',
  api_key:    process.env.CLOUDINARY_API_KEY    || '583754567739653',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'rXLKWOSg_D5J3YSaXR5RHT1Z3e0'
});

const images = [
  { key: 'logo',        url: 'https://picsum.photos/seed/abhinalogo/240/80',       publicId: 'abhina/logo' },
  { key: 'hero',        url: 'https://picsum.photos/seed/abhina-hero/600/500',     publicId: 'abhina/hero' },
  { key: 'about',       url: 'https://picsum.photos/seed/abhina-about/600/400',    publicId: 'abhina/about' },
  { key: 'proj1',       url: 'https://picsum.photos/seed/abhina-proj-1/800/600',   publicId: 'abhina/proj-scholarships' },
  { key: 'proj2',       url: 'https://picsum.photos/seed/abhina-proj-2/800/600',   publicId: 'abhina/proj-education-awareness' },
  { key: 'proj3',       url: 'https://picsum.photos/seed/abhina-proj-3/800/600',   publicId: 'abhina/proj-medical-camp' },
  { key: 'proj4',       url: 'https://picsum.photos/seed/abhina-proj-4/800/600',   publicId: 'abhina/proj-tailoring-centre' },
  { key: 'proj5',       url: 'https://picsum.photos/seed/abhina-proj-5/800/600',   publicId: 'abhina/proj-computer-skills' },
  { key: 'proj6',       url: 'https://picsum.photos/seed/abhina-proj-6/800/600',   publicId: 'abhina/proj-supports-for-sports' },
  { key: 'evt1',        url: 'https://picsum.photos/seed/abhina-evt-1/800/600',    publicId: 'abhina/evt-world-env-day' },
  { key: 'evt2',        url: 'https://picsum.photos/seed/abhina-evt-2/800/600',    publicId: 'abhina/evt-ambedkar-jayanti' },
  { key: 'evt3',        url: 'https://picsum.photos/seed/abhina-evt-3/800/600',    publicId: 'abhina/evt-womens-day' },
  { key: 'test1',       url: 'https://picsum.photos/seed/abhina-t1/200/200',       publicId: 'abhina/testimonial-1' },
  { key: 'test2',       url: 'https://picsum.photos/seed/abhina-t2/200/200',       publicId: 'abhina/testimonial-2' },
  { key: 'test3',       url: 'https://picsum.photos/seed/abhina-t3/200/200',       publicId: 'abhina/testimonial-3' },
  { key: 'team1',       url: 'https://picsum.photos/seed/abhina-tm1/400/400',      publicId: 'abhina/team-founder' },
  { key: 'team2',       url: 'https://picsum.photos/seed/abhina-tm2/400/400',      publicId: 'abhina/team-programme-director' },
  { key: 'team3',       url: 'https://picsum.photos/seed/abhina-tm3/400/400',      publicId: 'abhina/team-volunteer-coordinator' },
  { key: 'team4',       url: 'https://picsum.photos/seed/abhina-tm4/400/400',      publicId: 'abhina/team-finance-lead' },
  { key: 'donor1',      url: 'https://picsum.photos/seed/muthoot/300/120',         publicId: 'abhina/donor-muthoot' },
  { key: 'donor2',      url: 'https://picsum.photos/seed/3shadz/300/120',          publicId: 'abhina/donor-3shadz' },
  { key: 'donor3',      url: 'https://picsum.photos/seed/creativ/300/120',         publicId: 'abhina/donor-creativ-sparks' },
  { key: 'story1',      url: 'https://picsum.photos/seed/abhina-is1/800/600',      publicId: 'abhina/story-second-chance' },
  { key: 'story2',      url: 'https://picsum.photos/seed/abhina-is2/800/600',      publicId: 'abhina/story-tailoring-hayathnagar' },
  { key: 'story3',      url: 'https://picsum.photos/seed/abhina-is3/800/600',      publicId: 'abhina/story-clean-water' },
];

async function uploadAll() {
  const results = {};
  let done = 0;

  for (const img of images) {
    process.stdout.write(`[${++done}/${images.length}] Uploading ${img.key} ...`);
    try {
      const res = await cloudinary.v2.uploader.upload(img.url, {
        public_id: img.publicId,
        overwrite: true,
        folder: undefined
      });
      results[img.key] = res.secure_url;
      console.log(` OK → ${res.secure_url}`);
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
      results[img.key] = img.url; // keep original on failure
    }
  }

  console.log('\n\n=== CLOUDINARY URLS MAP ===');
  console.log(JSON.stringify(results, null, 2));
  return results;
}

uploadAll().catch(console.error);
