import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { marked } from 'marked';
import DragAndDropUpload from '../components/DragAndDrop';
import { useRouter } from 'next/router';

marked.setOptions({
    gfm: true,
    breaks: true,
  });

export default function PostEditor() {
  const { register, watch, setValue, handleSubmit, control } = useForm();
  const [imageVariants, setImageVariants] = useState("");
  let markdown = watch('markdown');
  const router = useRouter();
  const { id } = router.query;
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0); 
  const [isHandleKeyDown, setIsHandleKeyDown] = useState(true); 
  const [isPopUp, setIsPopUp] = useState(true)



  useEffect(() => {
    const handleKeyUp = (event: any) => {
      try {

        const cursorPosition = event.target.selectionStart;
        setCursorPosition(cursorPosition);
        const textBeforeCursor = markdown.substring(0, cursorPosition);
        // const lastWord = textBeforeCursor.split(" ").pop();
        const lastWord = textBeforeCursor.split(/\s+/).pop();

        if (lastWord.startsWith("*")) {
          setSuggestions(["**", "****"]);
          if(isHandleKeyDown === false){
            setIsPopUp(true)
            setIsHandleKeyDown(false)
          }        
        } else if (lastWord.startsWith(">")) {
          setSuggestions([">****", ">**``````**"]);
          if(isHandleKeyDown === false){
            setIsPopUp(true)
            setIsHandleKeyDown(false)
          }
        } else {
          setSuggestions([]);
        }
      } catch (error) {
      }
    };
  
    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, [markdown]);

  useEffect(() => {
    const requestUpdate = async (id: any) => {
        const response = await fetch('/api/get-post', {
          method: 'POST',
          body: JSON.stringify({ postId : id}),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        console.log(result)

        setValue('markdown', result.getPost[0].content);
        setValue('type', result.getPost[0].type);
        setValue('title', result.getPost[0].title);
      }
      requestUpdate(id) 

      console.log()

  }, []);

  const handleImageUpload = (variants: any) => {
    setImageVariants(variants);

    if(variants.includes('stream')){
      const imageMarkdown = `<iframe src="${variants}"></iframe><br>\n`;
      setValue('markdown', markdown + imageMarkdown);
    }else{
      const imageMarkdown = `![image](${variants})\n`;
      setValue('markdown', markdown + imageMarkdown);
    }
    console.log(`데이터 받기 성공..! | ${variants}`)
  };

  const onSubmit = async (data: any) => {

    const updatedData = {
        ...data,
        postId: id, 
    };

    try {
      const response = await fetch('/api/edit-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('회원가입 실패');
      }
      const result = await response.json();
      console.log(result); 
      router.push('/')
    } catch (error) {
      console.error('회원가입 중 에러 발생:', error);
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {

    } else if (event.key === 'Tab') {
      event.preventDefault();
      setValue('markdown', markdown + "\t"); 
    }

    if (suggestions.length > 0 && event.ctrlKey && event.key >= '1' && event.key <= '9') {
      console.log(suggestions)
      event.preventDefault();
      const index = parseInt(event.key, 10) - 1;
      if (index < suggestions.length) {
        applySuggestion(suggestions[index]);
        setSuggestions([]);
      }
    }
  };
  
  const applySuggestion = (suggestion: any) => {

    const textBeforeCursor = markdown.substring(0, cursorPosition);
    const textAfterCursor = markdown.substring(cursorPosition);
    setIsHandleKeyDown(true)
    setIsPopUp(false)
    setValue('markdown', textBeforeCursor + suggestion.substring(1, suggestion.length) + textAfterCursor);
    setSuggestions([]);
  };

  return (
    <div className="flex overflow-hidden h-screen "> 
      <button onClick={() => router.push('/')} className="w-16 h-8 bg-red-100 fixed top-4 left-4 rounded-xl">메인으로</button>

      <div className="flex-1 h-screen w-1/2 border-r-2">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 h-screen overflow-hidden">
          <button type="submit" className="w-full h-12 p-8 flex justify-center items-center">포스트 수정</button>
          <input 
            {...register('title')}
            placeholder='Title'
            className="w-full h-12 p-8 overflow-scroll"
          />
          <input 
            {...register('type')}
            placeholder='Type'
            className="w-full h-12 p-8 overflow-scroll"
          />
          <Controller
          control={control}
          name="markdown"
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full h-[calc(94vh-144px)] p-8 z-40"
              onKeyDown={handleKeyDown}
            />
          )}
        />
            <div className="fixed top-1/3 w-full flex justify-center items-center">
            {suggestions.length > 0 && isPopUp === true ?(
              <>       
                <ul className="w-48 bg-orange-200 z-40 rounded-3xl">
                  <li className="font-bold mt-4">Ctrl + 숫자로 자동완성</li>
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="m-4 font-bold">
                      {`${index + 1}. `}{suggestion}
                    </li>
                  ))}
                </ul>
              </>
            ): null}
            </div>

        </form>
        <DragAndDropUpload onImageUpload={handleImageUpload} />
      </div>
      <div className="flex-1 h-screen w-1/2 font-nanum">
        <div
          className="prose p-8 overflow-scroll h-full flex-rows justify-start"
          dangerouslySetInnerHTML={{ __html: marked.parse(markdown || '') }}
        />
        
      </div>
    </div>
  );
}
