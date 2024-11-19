// components/UploadImage.js
"use client";
import { useState } from "react";
import { uploadImage } from "../../../firebase/uploadImage";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setUrl(imageUrl);
      alert("Upload successful");
    } catch (error) {
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {url && <img src={url} alt="Uploaded Image" />}
    </div>
  );
};

export default UploadImage;
