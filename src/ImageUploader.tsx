import React, { useState, ChangeEvent } from "react";

import AWS from "aws-sdk";

const S3Uploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    setSelectedFile(file || null);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const s3 = new AWS.S3({
      accessKeyId: "AKIAWHM55CYORSZIS5VM",

      secretAccessKey: "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",

      region: "ap-southeast-2",
    });

    const uploadParams = {
      Bucket: "imagebucketimm",

      Key: selectedFile.name,

      Body: selectedFile,
    };

    s3.upload(
      uploadParams,

      (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
        if (err) {
          console.error("Error uploading file:", err);
        } else {
          console.log("File uploaded successfully. Location:", data.Location);
        }
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default S3Uploader;
