const API = "/api";

export const profileDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API}/profile`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};

export const uploadDataset = async (file, config = {}) => {
  const formData = new FormData();
  formData.append("file", file);
  
  if (config.target_column) {
      formData.append("target_column", config.target_column);
  }
  if (config.drop_columns) {
      formData.append("drop_columns", JSON.stringify(config.drop_columns));
  }
  if (config.impute_strategies) {
      formData.append("impute_strategies", JSON.stringify(config.impute_strategies));
  }

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

/* ⬇ DOWNLOAD MICROSERVICE API */
export const downloadMicroservice = async () => {
  const res = await fetch(`${API}/download-api`);
  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "microservice.zip";
  a.click();
};
