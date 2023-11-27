import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { marked } from 'marked';
import DragAndDropUpload from './components/DragAndDrop';
import { useRouter } from 'next/router';


marked.setOptions({
    gfm: true,
    breaks: true,
    // 기타 필요한 옵션
  });

export default function PostEditor() {
  const { register, watch, setValue, handleSubmit } = useForm();
  const [imageVariants, setImageVariants] = useState("");
  let markdown = watch('markdown');
  const router = useRouter();

  const handleImageUpload = (variants: any) => {
    setImageVariants(variants);

    console.log(`데이터 받기 성공..! | ${variants}`)
    const imageMarkdown = `![image](${variants})\n`;

    setValue('markdown', markdown + imageMarkdown);
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('회원가입 실패');
      }

      // 회원가입 성공 처리
      const result = await response.json();
      console.log(result); // 또는 사용자에게 성공 메시지 표시
      router.push('/')
    } catch (error) {
      console.error('회원가입 중 에러 발생:', error);
      // 사용자에게 에러 메시지 표시
    }
  };

  return (
    <div className="flex overflow-hidden h-screen "> 
      <div className="flex-1 h-screen w-1/2 bg-yellow-100">
        <form onSubmit={handleSubmit(onSubmit)}>
          <button type="submit" className="w-full h-12 p-8 bg-purple-100 flex justify-center items-center">포스트 생성</button>
          <input 
            {...register('title')}
            placeholder='Title'
            className="w-full h-12 p-8 overflow-scroll bg-blue-100"
          />
          <input 
            {...register('type')}
            placeholder='Type'
            className="w-full h-12 p-8 overflow-scroll bg-orange-100"
          />
          <textarea
            {...register('markdown')}
            className="w-full h-screen p-8 overflow-scroll"
          />
          
        </form>
        <DragAndDropUpload onImageUpload={handleImageUpload} />
      </div>
      <div className="flex-1 h-screen w-1/2 bg-green-100">
        <div
          className="prose p-8 overflow-scroll h-full flex-rows justify-start"
          dangerouslySetInnerHTML={{ __html: marked.parse(markdown || '') }}
        />
        {/* <div>{marked.parse(markdown || '')}</div> */}
        
      </div>
    </div>
  );
}
