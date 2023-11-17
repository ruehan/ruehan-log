import React, { useCallback, useState } from 'react';

const DragAndDropUpload = () => {
  const [highlight, setHighlight] = useState(false);

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
      } catch (error) {
        console.error('업로드 중 에러 발생:', error);
      }
  };

  return (
    <div
      className={`drop-area ${highlight ? 'border-blue-300' : ''} w-full h-48 border-2 border-yellow-200 p-20 flex justify-center items-center`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <p>여기에 파일을 드래그 앤 드롭하거나 클릭하여 업로드하세요.</p>
    </div>
  );
};

export default DragAndDropUpload;
