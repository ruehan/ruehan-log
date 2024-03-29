import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import { marked } from 'marked';
import {motion, AnimatePresence} from 'framer-motion'
import { RiMenuFoldLine as MenuFoldIcon, RiMenuUnfoldLine as MenuUnFoldIcon } from "react-icons/ri";
import LoadingComponent from './components/Loader';
import { useForm } from 'react-hook-form';
import { itemVariants, typeVariants, variants } from '@/utils/motion';
import { generateToken, isUpdated, unix_timestamp } from '@/utils/utils';
import CustomAlertModal from './components/CustomAlertModal';
import Head from 'next/head';
import { requestUpdate, requestUpdateComment } from '@/utils/api';

const renderer = new marked.Renderer();
const originalImageRenderer = renderer.image;

renderer.image = function(href, title, text) {
  const html = originalImageRenderer.call(this, href, title, text);
  if(href != 'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/0539069c-3a8c-4327-2f11-e43a58e78800/public'){
    return html.replace('<img', '<img loading="lazy"');
  }else{
    return html
  }
};

marked.setOptions({renderer})

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: posts, error } = useSWR('/api/get-post');
  const { data: comments, error: cError } = useSWR('/api/get-comment');
  const [selectedType, setSelectedType] = useState('HANGYU');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showType, setShowType] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const containerRef = useRef<null | HTMLDivElement>(null);
  const { register, watch, setValue, handleSubmit, control } = useForm();
  let nickname = watch('nickname');

  const handleSharePost = useCallback(() => {
    setModalOpen(true)
  }, [])

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  
  const paginate = (newIndex: any) => {
    setCurrent(newIndex);
    localStorage.setItem('currentPostId', newIndex);
    setDirection(newIndex > current ? 1 : 0);
  }

  useEffect(() => {
    const {type, postId} = router.query;

    if(type && postId){
      localStorage.setItem('selectedType', type as string);
      localStorage.setItem('currentPostId', postId as string)
      setSelectedType(type as string);
      setCurrent(Number(postId));

      router.replace(router.pathname, undefined, {shallow: true});
    }else{
      const savedType = localStorage.getItem('selectedType');
      const savedPostId = localStorage.getItem('currentPostId')
      if (savedType && savedPostId){
        setSelectedType(savedType);
        setCurrent(Number(savedPostId));
      }
    }

  }, [router.query])

  useEffect(() => {
    console.log(session)
    if (status !== 'loading' && !session) {
    }
  }, [session, status, router]);

  useEffect(() => {
    const element = document.getElementById('container');
    if (element) {
      element.scrollTop = 0;
    }
  }, [current]);

  if(!posts){
    return <LoadingComponent />
  }
  if(!comments){
    return <LoadingComponent />
  }
  const types = new Set(posts.getPost.map((post: any) => post.type));
  const filteredPosts = posts.getPost.filter((post: any) => post.type == selectedType);
  const titles = filteredPosts.map((post: { title: any; }) => post.title); 
  
  const onClickType = (type: any) => {
    setSelectedType(type)
    setCurrent(0)
    localStorage.setItem('selectedType', type);
    localStorage.setItem('currentPostId', '0');
  }
  const toggleTypes = () => {
    setShowType(!showType);
  }; 

  const clickDelComment = async (e: any) => {
    await requestUpdateComment(e.target.id)
    mutate('/api/get-comment') 
  }

  const clickDelete = async (e: any) => {
    await requestUpdate(e.target.id) 
    setCurrent(0)
    mutate('/api/get-post')  
  }
  const clickEdit = async (e: any) => {
    router.push(`/edit-post/${e.target.id}`)
  }
  if(!filteredPosts){
    return <LoadingComponent />
  }
  const onSubmit = async (data: any) => {

    const token = generateToken();
    localStorage.setItem('commentToken', token)

    try {
      const newData = {
        ...data,
        postId: filteredPosts[current].id,
        token
      }
      if(nickname == "ruehan" && session){
        const response = await fetch('/api/create-comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        });
        if (!response.ok) {
          throw new Error('댓글 추가 실패');
        }
      }else if(nickname == "ruehan" && !session){
        alert("관리자만 사용 가능합니다..!")
      }else {
        const response = await fetch('/api/create-comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        });
        if (!response.ok) {
          throw new Error('댓글 추가 실패');
        }
      }
      setValue('nickname', '')
      setValue('comment', '')
      mutate('/api/get-comment')
    } catch (error) {
      console.error('댓글 추가 중 오류 발생:', error);
    }
  };

  return (
    <>
    <Head>
        <link rel="preload" href="https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/0539069c-3a8c-4327-2f11-e43a58e78800/public" as="image" />
    </Head>

    <button id={filteredPosts[current].id} onClick={() => router.push('/main')} className=" w-36 h-12 fixed left-4 bottom-4 bg-red-200 rounded-full text-white z-50 hidden lg:block">Virtual Room (BETA)</button>

    <form onSubmit={handleSubmit(onSubmit)} className="fixed right-0 bottom-0 flex-1 h-screen overflow-hidden hidden lg:block lg:w-1/6">       
          <div className="h-5/6 overflow-scroll">
            {comments.getComment && (
              comments.getComment.map((comment: any) => (
                comment.postId == filteredPosts[current].id ? (
                  <div key={comment.id} className="flex flex-col font-nanum p-2 m-2 border-2 border-blue-100 rounded-xl">
                    {(session || localStorage.getItem('commentToken') === comment.token) && ( // 관리자 또는 토큰이 일치하는 경우에만 삭제 버튼 표시
                      <div id={comment.id} className="text-red-600 w-4 h-4" onClick={clickDelComment}>X</div>
                    )}
                    <div className="flex justify-between">
                      <div className="text-lg">{comment.author == "ruehan" ? `👨‍💻 ${comment.author}` : comment.author}</div>
                      <div>[{unix_timestamp(comment.createdAt)}]</div>
                    </div>
                    <div className="text-2xl">{comment.content}</div>
                  </div>
                ) : null
              )))}
          </div>

          <div className="w-full h-1/6 flex flex-col justify-center items-center">
            <input 
              {...register('nickname')}
              placeholder='닉네임 입력..'
              className="w-full h-8 p-4 border-2 border-blue-100 rounded-xl m-2"
            />
            <input 
              {...register('comment')}
              placeholder='댓글 입력..'
              className="w-full h-8 p-4 border-2 border-blue-100 rounded-xl m-2"
            />
            <button type="submit" className="w-1/2 h-8 p-4 mt-2 flex justify-center items-center border-2 bg-blue-300 text-white rounded-xl">댓글 등록</button>
          </div>
    </form>
    <div className="flex flex-col items-center md:flex-row w-full justify-center overflow-hidden" style={{height: '90vh'}} >
      <CustomAlertModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} message={`https://ruehan.com/?type=${selectedType.replaceAll(" ", "%20")}&postId=${current}`} />
      <button onClick={toggleTypes} className="fixed top-5 left-5 text-4xl bg-gray-500 text-white rounded-full z-50">
        {showType ? <MenuFoldIcon /> : <MenuUnFoldIcon />}
      </button>
      
      {showType && (
        <div className="flex items-center justify-center bg-white absolute h-full top-0 left-0 z-40 scrollbar-hide w-full lg:w-1/6 lg:bg-inherit">
          <motion.div
          initial="hidden"
          animate="visible"
          variants={typeVariants}
          transition={{ duration: 1 }}
          className="flex flex-col">      
          {[...types].map((type: any) => (
            <motion.div 
              key={type} 
              className={`p-2 text-xs ${type === selectedType ? 'text-blue-500 font-bold' : 'text-gray-700'}`}
              onClick={() => onClickType(type)}
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.95}}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              >{type}
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
        initial="hidden"
        animate="visible"
        variants={typeVariants}
        transition={{ duration: 1 }}
        className="flex flex-col w-36 justify-center h-3/4 overflow-scroll text-xs">
        {titles.map((title: any, index: any) => (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.95}}
            key={title}
            className={`p-2 border-l-2 ${index === current ? 'text-blue-500 font-bold' : 'text-gray-700'}`}
            onClick={() => paginate(index)}
          >
            {
              <div className="flex items-center relative">
                <div className="z-10">{title}</div>
                <div className={`w-full absolute bottom-0 h-2 ${isUpdated(filteredPosts[index].updatedAt) && 'bg-red-200'}`}></div>                    
              </div>
            }
          </motion.div>
        ))}
      </motion.div>
        </div>
      )}  

      <div className="flex w-full lg:w-5/6 justify-center h-full overflow-hidden " >
                    {session && (    
                            <div className="fixed top-5 right-5 lg:sticky lg:right-0 flex flex-col w-12 h-80 justify-around items-center z-40 text-sm">      
                          <button onClick={() => router.push('/create-post')} className="fixed top-5 left-20 w-32 text-4xl bg-gray-500 text-white rounded-full z-50 font-nanum text-md">
                          포스트 생성
                        </button>                   
                        <div className="flex flex-col w-12 md:w-16 h-48 justify-around items-center rounded-2xl">
                          <button id={filteredPosts[current].id} onClick={() => signOut({redirect: false, callbackUrl: '/'})} className=" w-12 h-12 bg-red-200 rounded-full text-white text-xs">Signout</button>
                          <button id={filteredPosts[current].id} onClick={clickDelete} className=" w-12 h-12 bg-red-200 rounded-full text-white">X</button>
                          <button id={filteredPosts[current].id} onClick={clickEdit} className=" w-12 h-12 bg-red-200 rounded-full text-white">Edit</button>
                        </div>       
                        <div className="flex flex-col w-12 md:w-16 h-48 justify-around items-center rounded-2xl ">
                        <button onClick={handleSharePost} className="bg-blue-200 text-white rounded-full w-12 h-12">Share</button>
                        <button onClick={scrollToTop} className="bg-blue-200 text-white rounded-full w-12 h-12">Top</button>
                        <button onClick={scrollToBottom} className="bg-blue-200 text-white rounded-full w-12 h-12">Bottom</button>
                         </div>       
                         </div>            
                    )}
                    {!session && (
                            <div className="fixed top-5 right-5 lg:sticky lg:right-0 flex flex-col w-12 h-72 justify-around items-center z-40 text-sm">      
                            <div className="flex flex-col w-12 md:w-16 h-32 justify-around items-center rounded-2xl">
                                <button onClick={() => router.push("/login")} className=" w-12 h-12 bg-red-200 rounded-full text-white">SignIn</button>
                                {/* <button id={filteredPosts[current].id} onClick={() => router.push("/register")} className=" w-12 h-12 bg-red-200 rounded-full text-white text-xs">Register</button> */}
                              </div>
                              <div className="flex flex-col w-12 md:w-16 h-48 justify-around items-center rounded-2xl ">
                                <button onClick={handleSharePost} className="bg-blue-200 text-white rounded-full w-12 h-12">Share</button>
                                <button onClick={scrollToTop} className="bg-blue-200 text-white rounded-full w-12 h-12">Top</button>
                                <button onClick={scrollToBottom} className="bg-blue-200 text-white rounded-full w-12 h-12">Bottom</button>
                              </div>  
                            </div>
                    )}
                    
         
        <div id="container" ref={containerRef} className="relative overflow-scroll w-full lg:w-3/4 flex flex-col justify-between items-center bg-white shadow-lg rounded-lg m-5 text-gray-800">          
          <AnimatePresence initial={false}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                opacity: { duration: .25 }
              }}
              style={{position: 'absolute', width: '100%'}}>
                {
                  <div key={filteredPosts[current].id} className="relative" >
                    <div className="px-6 py-4 pb-8 flex-1 font-nanum" >
                      <div className="mb-4 mt-8">
                        <div>게시 일자 : {unix_timestamp(filteredPosts[current].createdAt)}</div>
                        <div>마지막 업데이트 : {unix_timestamp(filteredPosts[current].updatedAt)}</div>
                      </div>
                      <div className="font-bold text-xl mb-2 text-blue-300">{filteredPosts[current].title}</div>
                      <div
                        className="text-gray-700 text-base"
                        dangerouslySetInnerHTML={{ __html: marked.parse(filteredPosts[current].content || '') }}
                      />
                    </div>
                  </div>
                }
            </motion.div>
          </AnimatePresence>
          <div className="w-full flex justify-around items-center fixed bottom-0  md:fixed md:w-1/4 h-12 bg-orange-100 rounded-xl font-bold z-30">
            <button onClick={() => 
              paginate((current - 1 + filteredPosts.length) % filteredPosts.length)}>이전</button>
            {current + 1}
            <button onClick={() => paginate((current + 1) % filteredPosts.length)}>다음</button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
