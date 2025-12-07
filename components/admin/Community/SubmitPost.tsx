import React, { useState ,useContext } from 'react';
import AdminAuthContext from "@/app/admin/context/AuthContext";

interface SubmitPostProps {
  communityId: string;
}

const SubmitPost: React.FC<SubmitPostProps> = ({ communityId }) => {
    const { authTokens } = useContext(AdminAuthContext) || {};;
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    video: '',
    file: '',
  });

  const [errors, setErrors] = useState({
    image: '',
    video: '',
    file: '',
  });

  const urlRegex = /^(https?:\/\/(?:www\.)?[\w\-]+(?:\.[\w\-]+)+(?:[\/\?#][^\s]*)?)$/i;
  const youtubeRegex = /^(https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]+(?:\?[^\s]*)?)$/i;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Validate URLs for the respective fields
    if (name === 'image') {
      if (value && !urlRegex.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: 'Invalid URL format' }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
      }
    }

    if (name === 'video') {
      if (value && !youtubeRegex.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: 'Invalid YouTube link format' }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
      }
    }

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure there are no validation errors before submitting
    if (Object.values(errors).some((error) => error)) {
      alert('Please fix the errors before submitting.');
      return;
    }

    const payload = {
      community: Number(communityId),
      title: formData.title,
      content: formData.content,
      image: formData.image || null,
      video: formData.video || null,
      file: formData.file || null,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/communities/posts/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Server Error Details:", errorDetails);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Post uploaded successfully:', result);
      alert('Post uploaded successfully!');
      setFormData({
        title: '',
        content: '',
        image: '',
        video: '',
        file: '',
      });
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('Failed to upload the post.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 px-8 py-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-extrabold text-start text-gray-800"> Submit a Post :</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter the title"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={5}
            placeholder="Write your content here..."
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Image Link</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter a link to the image"
              className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">YouTube Video</label>
            <input
              type="text"
              name="video"
              value={formData.video}
              onChange={handleChange}
              placeholder="Enter a link to the YouTube video"
              className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.video && <p className="text-red-500 text-sm">{errors.video}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};
export default SubmitPost;