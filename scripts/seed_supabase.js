const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const jsonPath = path.resolve(__dirname, '../../data/final_json/2026-03-23_step4_final.json');
  console.log('Reading JSON from:', jsonPath);
  const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  const articlesToSeed = rawData.slice(0, 2);
  
  for (const article of articlesToSeed) {
    const { card_cover, card_content } = article;
    const articleId = card_cover.image_id;
    console.log(`\nProcessing article: ${articleId}`);
    
    const imagesBasePath = path.resolve(__dirname, '../../');
    
    const processAndUploadImage = async (localRelPath) => {
       if (!localRelPath) return null;
       
       let fullPath = path.join(imagesBasePath, 'data', localRelPath);
       if (!fs.existsSync(fullPath)) {
         fullPath = path.join(imagesBasePath, localRelPath); // fallback
       }
       if (!fs.existsSync(fullPath)) {
         console.warn(`WARNING: Could not find image locally: ${localRelPath}`);
         return null;
       }
       
       console.log(`Compressing image (sharp): ${localRelPath}`);
       // Compress image to a heavily optimized mobile size
       const compressedBuffer = await sharp(fullPath)
         .resize({ width: 800, withoutEnlargement: true })
         .webp({ quality: 80 })
         .toBuffer();
         
       const fileName = path.basename(localRelPath).replace(/\.[^/.]+$/, "") + ".webp";
       const storagePath = `public/${fileName}`;
       
       const { data, error } = await supabase.storage
         .from('images')
         .upload(storagePath, compressedBuffer, {
            contentType: 'image/webp',
            upsert: true
         });
         
       if (error) {
         console.error("Upload error:", error);
         return null;
       }
       
       const publicUrl = supabase.storage.from('images').getPublicUrl(storagePath).data.publicUrl;
       console.log("Uploaded successfully:", publicUrl);
       return publicUrl;
    };
    
    const coverUrl = await processAndUploadImage(card_cover.local_image_path);
    if (coverUrl) card_cover.cloud_image_url = coverUrl;

    const figureUrl = await processAndUploadImage(card_content.local_image_path);
    if (figureUrl) card_content.cloud_image_url = figureUrl;
    
    console.log(`Inserting JSON into 'articles' table for ${articleId}`);
    const { data: dbData, error: dbError } = await supabase
      .from('articles')
      .upsert({
         id: articleId,
         card_cover: card_cover,
         card_content: card_content
      });
      
    if (dbError) {
       console.error(`Database insertion failed for ${articleId}:`, dbError);
    } else {
       console.log(`Successfully seeded ${articleId}!`);
    }
  }
}

seed().catch(console.error);
