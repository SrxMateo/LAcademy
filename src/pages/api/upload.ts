import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No se envió ninguna imagen' }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.split('.')[0]}.webp`;
    const uploadPath = path.resolve('public/uploads', fileName);

    // Compress and convert to WebP using sharp
    await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(uploadPath);

    return new Response(JSON.stringify({ 
      success: true, 
      url: `/uploads/${fileName}` 
    }), { status: 200 });

  } catch (error: any) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Error al procesar la imagen: ' + error.message }), { status: 500 });
  }
};
