import axios from "axios";
import { useState, useEffect } from "react";

interface ImageViewerProps {
  cdnUrl: string;
}

const ImageViewer = ({ cdnUrl }: ImageViewerProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchPreSignedUrl = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}do/presigned-url/`,
          {
            key: cdnUrl,
          }
        );
        setImageUrl(response.data.url);
      } catch (error) {
        console.error("Error fetching the presigned URL:", error);
      }
    };

    if (cdnUrl) {
      fetchPreSignedUrl();
    }
  }, [cdnUrl]);

  return imageUrl;
};

export default ImageViewer;
