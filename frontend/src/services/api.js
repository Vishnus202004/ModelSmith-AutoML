const API = "http://127.0.0.1:8000";

/* 🔼 UPLOAD */
export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API}/upload`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};

/* ⬇ DOWNLOAD MODEL */
export const downloadModel = async () => {
  const res = await fetch(`${API}/download-model`);
  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "final_model.pkl";
  a.click();
};

/* ⬇ DOWNLOAD PREPROCESSOR */
export const downloadPreprocessor = async () => {
  const res = await fetch(`${API}/download-preprocessor`);
  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "preprocessor.pkl";
  a.click();
};