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

    console.log(`데이터 받기 성공..! | ${variants}`)
    const imageMarkdown = `![image](${variants})\n`;

    setValue('markdown', markdown + imageMarkdown);
  };

  return (
    <div className="flex overflow-hidden h-screen -m-6"> 
      <div className="flex-1 h-screen w-1/2 bg-yellow-100">
        <form>
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
