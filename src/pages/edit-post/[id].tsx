import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { marked } from 'marked';
import DragAndDropUpload from '../components/DragAndDrop';
import { useRouter } from 'next/router';
import useSWR from 'swr';


const fetcher = (url: any) => fetch(url).then((res) => res.json());

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
  const { id } = router.query;
  const [suggestions, setSuggestions] = useState([]);
  const textAreaRef = useRef(null);
  const { data: posts, error } = useSWR('/api/get-post', fetcher);

  useEffect(() => {
    const handleKeyUp = (event) => {
      try {
        const cursorPosition = event.target.selectionStart;
        const textBeforeCursor = markdown.substring(0, cursorPosition);
        // const lastWord = textBeforeCursor.split(" ").pop();
        const lastWord = textBeforeCursor.split(/\s+/).pop();

        console.log(cursorPosition + ' | ' + lastWord + ' | ' + lastWord.startsWith("*"))
        
  
        if (lastWord.startsWith("*")) {
          setSuggestions(["**", "****"]);
        } else if (lastWord.startsWith(">")) {
          setSuggestions([">****", ">**``````**"]);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        // console.error(error);
      }
    };
  
    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, [markdown]); // 'markdown'의 변경을 추적

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

  }, []); // 'markdown'의 변경을 추적


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
    try {
      const response = await fetch('/api/edit-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
      // 엔터 키 처리 로직
      // setValue('markdown', markdown + " <br>");
    } else if (event.key === 'Tab') {
      // 탭 키 처리 로직
      event.preventDefault(); // 기본 탭 키 동작 방지
      setValue('markdown', markdown + "\t"); // 현재 커서 위치에 탭 문자 추가
    }

    if (suggestions.length > 0 && event.key >= '1' && event.key <= '9') {
      console.log(suggestions)
      event.preventDefault(); // 기본 키보드 이벤트 방지
      const index = parseInt(event.key, 10) - 1;
      if (index < suggestions.length) {
        applySuggestion(suggestions[index]);
        setSuggestions([]);
      }
    }
  };
  
  const applySuggestion = (suggestion) => {
    // setContent(content + suggestion);
    setValue('markdown', markdown.substring(0, markdown.length - 1) + suggestion);
    
  };

  return (
    <div className="flex overflow-hidden h-screen "> 
      <div className="flex-1 h-screen w-1/2 border-r-2">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 h-screen overflow-hidden">
          <button type="submit" className="w-full h-12 p-8 flex justify-center items-center">포스트 생성</button>
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
          <textarea
            {...register('markdown')}
            className="w-full h-[calc(94vh-144px)] p-8"
            onKeyDown={handleKeyDown}
            // onChange={(e) => setContent(e.target.value)}
            // onKeyUp={handleKeyUp}
            
          />
          {suggestions.length > 0 && (
            <ul className="fixed top-0 right-0">
              {suggestions.map((suggestion, index) => (
                <li key={index} >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          
        </form>
        <DragAndDropUpload onImageUpload={handleImageUpload} />
      </div>
      <div className="flex-1 h-screen w-1/2">
        <div
          className="prose p-8 overflow-scroll h-full flex-rows justify-start"
          dangerouslySetInnerHTML={{ __html: marked.parse(markdown || '') }}
        />
        {/* <div>{marked.parse(markdown || '')}</div> */}
        
      </div>
    </div>
  );
}