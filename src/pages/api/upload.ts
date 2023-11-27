import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';


const prisma = new PrismaClient();

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/image',
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  }),
  limits: {fileSize: 100 * 1024 * 1024}  
})

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadMiddleware = upload.array('images');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {

    uploadMiddleware(req, res, async (err) => {
      if(err){
        return res.status(400).json({error: err.message})
      }


      const imagePaths = (req.files as Express.Multer.File[]).map((file) => file.path)

        const originFileName = imagePaths[0].replace('public/image/', '')

        const imageUrl = `${req.headers.origin}/image/${imagePaths[0].replace('public/image/', '')}`;

        console.log(imageUrl)

        try{
          const imageResponse = await fetch(imageUrl);
          if (!imageResponse.ok) throw new Error('Failed to fetch image.');

          const contentType: any = imageResponse.headers.get('content-type');

          if (contentType.startsWith('image/')) {
            // 이미지 파일 처리
            const buffer = await imageResponse.buffer();
            const formData = new FormData();
            formData.append('file', buffer, {
                contentType,
                filename: originFileName,
            });

            const cloudflareResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_URL}/images/v1`, {
              method: 'POST',
              headers: {
              'Authorization': `Bearer ${process.env.CLOUDFLARE_KEY}`,
              ...formData.getHeaders(),
              },
              body: formData,
          });

          // 처리 결과 반환
          const data = await cloudflareResponse.json();
          res.status(200).send(data.result);
        } else if (contentType.startsWith('video/')) {
          // 영상 파일 처리
          // Cloudflare Stream API를 사용하여 영상 업로드 로직을 여기에 구현합니다.
          const buffer = await imageResponse.buffer();
          const formData = new FormData();
          formData.append('file', buffer, {
            filename: originFileName,
            contentType: contentType,
          });

          const streamResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_URL}/stream`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.CLOUDFLARE_STREAM_KEY}`,
              ...formData.getHeaders(),
            },
            body: formData,
          });

          if (!streamResponse.ok) {
            const error = await streamResponse.text();
            console.error('Stream API Error:', error);
            throw new Error('Stream API request failed.');
          }

          const data = await streamResponse.json();
          res.status(200).send(data.result);
        }
        }catch(error){
          console.log(error);
          res.status(500).send('Server Error');
        }

        // try{
        //     const imageResponse = await fetch(imageUrl);
        //     if (!imageResponse.ok) throw new Error('Failed to fetch image.');

        //     const contentType: any = imageResponse.headers.get('content-type');
        //     if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'].includes(contentType)) {
        //         throw new Error('Unsupported image format');
        //     }

        //     const buffer = await imageResponse.buffer();

        //     const formData = new FormData();
        //     formData.append('file', buffer, {
        //         contentType,
        //         filename: originFileName, // 예: upload.jpg
        //     });

        //     // console.log(imageResponse)

        //     const cloudflareResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_URL}/images/v1`, {
        //         method: 'POST',
        //         headers: {
        //         'Authorization': `Bearer ${process.env.CLOUDFLARE_KEY}`,
        //         ...formData.getHeaders(),
        //         },
        //         body: formData,
        //     });

        //     const data = await cloudflareResponse.json();
            
        //     if(data) {
        //         console.log(`${data.result.filename} | ${data.result.id} | ${data.result.variants[0]}`)
        //         res.status(200).send(data.result)
        //       }
        // }catch(error){
        //     console.log(error)
        // }
    })
  } else{
    res.status(405).send('Method Not Allowed');
  }
}

// result: {
//     id: '9fe9163f-cd42-43f6-aa9e-4ddcee371300',
//     filename: 'IMG_9222.jpeg',
//     uploaded: '2023-11-17T15:05:23.955Z',
//     requireSignedURLs: false,
//     variants: [
//       'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/9fe9163f-cd42-43f6-aa9e-4ddcee371300/public'
//     ]
//   },