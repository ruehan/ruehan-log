import React from 'react';
import { useForm } from 'react-hook-form';
import { marked } from 'marked';


marked.setOptions({
    gfm: true,
    breaks: true,
    // 기타 필요한 옵션
  });

export default function PostEditor() {
  const { register, watch } = useForm();
  const markdown = watch('markdown');

  return (
    <div className="flex">
      <div className="flex-1">
        <form>
          <textarea
            {...register('markdown')}
            className="w-full h-screen p-8"
          />
        </form>
      </div>
      <div className="flex-1">
        <div
          className="prose p-8"
          dangerouslySetInnerHTML={{ __html: marked.parse(markdown || '') }}
        />
        {/* <div>{marked.parse(markdown || '')}</div> */}
        
      </div>
    </div>
  );
}
