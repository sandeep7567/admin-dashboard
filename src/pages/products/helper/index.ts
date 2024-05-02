import { CreateProductData, ImageField } from "../../../types";

const makeFormData = (data: CreateProductData) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "priceConfiguration" || key === "attributes") {
      formData.append(key, JSON.stringify(value));
    } else if (key === "image") {
      formData.append(key, (value as ImageField).file);
    } else {
      formData.append(key, value as string);
    }
  });

  return formData;
};

export default makeFormData;
