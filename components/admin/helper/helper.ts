import axios from "axios";

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const result: string[] = [];
  if (hours > 0) {
    result.push(`${hours}hr`);
  }
  if (minutes > 0 || hours > 0) {
    result.push(`${minutes}min`);
  }
  result.push(`${secs}sec`);

  return result.join(":");
}

export const deleteVideo = async (
  videoUrl: string,
  accessToken: string
): Promise<void> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}api/admin/delete/video/`,
      {
        urls: [{ url: videoUrl }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.failed_urls?.length > 0) {
      throw new Error(
        `Some videos could not be deleted: ${response.data.failed_urls.join(", ")}`
      );
    }
  } catch (error: any) {
    throw new Error(`Failed to delete videos: ${error.message}`);
  }
};

export const getImageUrl = async (cdnUrl: string) => {
  if (!cdnUrl) return;
  console.log("image view is running\n", cdnUrl);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}do/presigned-url/`,
      { key: cdnUrl }
    );
    console.log(response);
    return response.data.url;
  } catch (error) {
    console.error("Error fetching the presigned URL:", error);
  }
};

// Function to handle file upload
export const uploadFile = async (
  file: File
): Promise<{ cdnUrl: string; uploadUrl: string }> => {
  try {
    // Get the upload URL
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}do/get-upload-url/`,
      {
        params: {
          file_name: file.name,
          content_type: file.type,
        },
      }
    );

    const { upload_url: uploadUrl, cdn_url: cdnUrl } = data;

    // Upload the file
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
    });

    return { cdnUrl, uploadUrl };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getVideoDuration = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      resolve(formatTime(parseFloat(video.duration.toFixed(2))));
    };

    video.onerror = () => {
      reject(new Error("Failed to load video metadata"));
    };

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
  });
};
