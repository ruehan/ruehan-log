import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { marked } from 'marked';

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: posts, error } = useSWR('/api/get-post', fetcher);
  const [selectedType, setSelectedType] = useState('테스트');

  useEffect(() => {
    console.log(session)
    if (status !== 'loading' && !session) {
      // signIn();
    }
  }, [session, status, router]);

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  if(!posts){
    return <div>Loading...</div>
  }

  console.log(posts)

  const types = new Set(posts.getPost.map((post: any) => post.type));
  const filteredPosts = posts.getPost.filter((post: any) => post.type == selectedType);

  return (
    <>
      
    <div className="flex w-full ">
      <div className="flex flex-col w-36 bg-yellow-100 fixed basis-1">      
        {[...types].map((type: any) => (
          <div key={type} className="h-36 w-full bg-gray-100 mt-4" onClick={() => setSelectedType(type)}>{type}</div>
        ))}

      </div>
      <div className="flex flex-col items-center w-full justify-center">
      {filteredPosts.map((post: any) => (
        <div key={post.id} className=" rounded overflow-hidden shadow-md m-4 w-3/4">
        {/* <img className="w-full" src="/path-to-your-image.jpg" alt="Post Image"/> */}
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{post.title}</div>
          <div
            className="text-gray-700 text-base"
            dangerouslySetInnerHTML={{ __html: marked.parse(post.content || '') }}
          />
        </div>
      </div>
      ))}
      </div>
    </div>
    </>
  );
}
