import React, { useCallback, useState } from 'react';

const DragAndDropUpload = ({ onImageUpload  }) => {
  const [highlight, setHighlight] = useState(false);
  const [variants, setVariants] = useState("");

  const onDragOver = (e: any) => {
    e.preventDefault();
    setHighlight(true);
  };

  const onDragLeave = () => {
    setHighlight(false);
  };

  const onDrop = (e: any) => {
    e.preventDefault();
    setHighlight(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };
  
    const cloudflareUrl: any = process.env.CLOUDFLARE_URL;
    const cloudflareKey: any = process.env.CLOUDFLARE_KEY;

  const handleFiles = async (files: any) => {
    // 파일 처리 로직
    const formData = new FormData();
    formData.append('images', files[0]); // 여기서는 단일 파일만 처리

    try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
    
        if (!response.ok) {
          throw new Error('서버 오류 발생');
        }
    
        const data = await response.json();
        console.log('업로드 성공:', data);
        if(data){
          setVariants(data.variants[0]);
          onImageUpload(data.variants[0]);
        }
      } catch (error) {
        console.error('업로드 중 에러 발생:', error);
      }
  };

  return (
    <div
      className={`drop-area ${highlight ? 'border-blue-300' : ''} w-48 h-48 border-2 flex justify-center items-center absolute bottom-0 right-0 backdrop-blur-[calc(1px)]`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <p className="text-xs">파일을 드래그하여 업로드하세요.</p>
    </div>
  );
};

export default DragAndDropUpload;
