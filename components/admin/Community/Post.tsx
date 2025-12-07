'use client';
import React, { useState ,useContext} from 'react';
import Image from 'next/image';
import { FaEllipsisH, FaHeart, FaComment } from 'react-icons/fa';
import AdminAuthContext from "@/app/admin/context/AuthContext";

interface User {
  id: number;
  username: string;
  image: string;
}

interface Reply {
  id: number;
  title: string;
  content: string;
  likes: number;
  user: User;
}

interface Comment {
  id: number;
  title: string;
  content: string;
  likes: number;
  community_replies: Reply[];
  user: User;
}

interface PostProps {
  post: {
    id: number;
    title: string;
    content: string;
    likes: number;
    image: string | null;
    video: string | null;
    comments: Comment[];
    user: User;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
    const { authTokens } = useContext(AdminAuthContext) || {};;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [comments, setComments] = useState(post.comments);

  const handleLike = async () => {
    const newLikeStatus = !isLiked;
    const updatedLikes = newLikeStatus ? likes + 1 : likes - 1;

    setIsLiked(newLikeStatus);
    setLikes(updatedLikes);
  };

  const youtubeRegex = /^(https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]+(?:\?[^\s]*)?)$/i;

  const isValidHttpUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (error) {
      return false;
    }
  };

  const extractYouTubeEmbedUrl = (url: string) => {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'www.youtube.com' && parsedUrl.searchParams.has('v')) {
      return `https://www.youtube.com/embed/${parsedUrl.searchParams.get('v')}`;
    }
    if (parsedUrl.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${parsedUrl.pathname.slice(1)}`;
    }
    return null;
  };

  const handleCommentSubmit = async () => {
    if (newCommentContent.trim()) {
      const commentData = {
        title: "User's Comment",
        content: newCommentContent,
        post: post.id,
      };
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/communities/comments/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentData),
        });

        if (response.ok) {
          const newComment: Comment = {
            id: Date.now(),
            title: "User's Comment",
            content: newCommentContent,
            likes: 0,
            community_replies: [],
            user: {
              id: 2,
              username: 'User',
              image: 'https://via.placeholder.com/40',
            },
          };
          setComments([...comments, newComment]);
          setNewCommentContent('');
        } else {
          console.error('Failed to post comment:', await response.json());
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <div className="flex items-center mb-3">
        {post.user.image && isValidHttpUrl(post.user.image) ? (
          <Image
            src={post.user.image}
            alt={post.user.username}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : null}
        <div className="ml-3">
          <h3 className="font-semibold">{post.user.username}</h3>
        </div>
        <FaEllipsisH className="ml-auto text-gray-600 cursor-pointer" />
      </div>

      <h2 className="font-bold mb-2">{post.title}</h2>
      <p className="text-gray-800 mb-2">{post.content}</p>
      {post.video && youtubeRegex.test(post.video) ? (
        <iframe
          src={extractYouTubeEmbedUrl(post.video) || ''}
          width="500"
          height="300"
          className="rounded-lg w-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : post.image && isValidHttpUrl(post.image) ? (
        <Image
          src={post.image}
          alt="Post Image"
          width={500}
          height={300}
          className="rounded-lg w-full"
        />
      ) : (
''
      )}

      <div className="flex justify-around text-gray-600 text-sm py-2 border-t">
        <button className="flex items-center space-x-2" onClick={handleLike}>
          <FaHeart color={isLiked ? 'red' : 'gray'} />
          <span>Likes</span>
        </button>
        <button className="flex items-center space-x-2">
          <FaComment />
          <span>{comments.length} Comments</span>
        </button>
      </div>

      <div className="pt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4">
            <div className="flex items-start mb-2">
              {comment.user.image ? (
                <Image
                  src={comment.user.image}
                  alt={comment.user.username}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              ) : (
                <Image
                  src="https://via.placeholder.com/30"
                  alt={comment.user.username}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              )}
              <div className="ml-3">
                <h4 className="font-semibold">{comment.user.username}</h4>
                <p>{comment.content}</p>
              </div>
            </div>
          </div>
        ))}

        <textarea
          className="w-full p-2 border rounded-lg mb-2"
          placeholder="Add a comment..."
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
        />
        <button
          className="p-2 bg-blue-600 text-white rounded-lg"
          onClick={handleCommentSubmit}
        >
          Comment
        </button>
      </div>
    </div>
  );
};

export default Post;
