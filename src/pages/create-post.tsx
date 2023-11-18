import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { marked } from 'marked';
import DragAndDropUpload from './components/DragAndDrop';


marked.setOptions({
    gfm: true,
    breaks: true,
    // 기타 필요한 옵션
  });

export default function PostEditor() {
  const { register, watch, setValue } = useForm();
  const [imageVariants, setImageVariants] = useState("");
  let markdown = watch('markdown');

  const handleImageUpload = (variants: any) => {
    setImageVariants(variants);
    // 여기서 imageVariants 상태를 다룰 수 있습니다.
    // markdown = `${markdown} <img src='${variants}'></img>`
    console.log(`데이터 받기 성공..! | ${variants}`)
    const imageMarkdown = `![image](${variants})\n`;

    // 현재 마크다운 텍스트에 이미지 마크다운 추가
    setValue('markdown', markdown + imageMarkdown);
  };

  return (
    <div className="flex overflow-hidden h-screen -m-6">
      <div className="flex-1 h-screen">
        <form>
          <textarea
            {...register('markdown')}
            className="w-full h-screen p-8 overflow-scroll"
          />
        </form>
        <DragAndDropUpload onImageUpload={handleImageUpload} />
      </div>
      <div className="flex-1 h-screen">
        <div
          className="prose p-8 overflow-scroll h-full flex-rows justify-start"
          dangerouslySetInnerHTML={{ __html: marked.parse(markdown || '') }}
        />
        {/* <div>{marked.parse(markdown || '')}</div> */}
        
      </div>
    </div>
  );
}
