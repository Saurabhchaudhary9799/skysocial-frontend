export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "skysocial_upload");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};