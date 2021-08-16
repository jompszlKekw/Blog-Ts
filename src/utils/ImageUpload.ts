export const checkImage = (file: File) => {
  let err = "";
  if (!file) return (err = "File does not exist.");

  if (file.size > 1024 * 1024)
    // 1mb
    err = "The largest image size is 1mb";

  return err;
};

export const imageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "");
  formData.append("cloud_name", "");

  const res = await fetch(
    "",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return { public_id: data.public_id, url: data.secure_url };
};
