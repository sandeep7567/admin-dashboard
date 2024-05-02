import { useState } from "react";
import { Form, message, Space, Typography, Upload, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const UploadImage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file: File) => {
      // Validation logic
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        console.error("You can only upload JPG/PNG file!");
        messageApi.error("You can only upload JPG/PNG file!");
      }

      //todo:  size validation.
      setImageUrl(URL.createObjectURL(file));

      return false;
    },
  };
  return (
    <Form.Item
      label="Image"
      name={"image"}
      rules={[
        {
          required: true,
          message: "Please upload a product image",
        },
      ]}
    >
      <Upload
        name="image"
        listType="picture-card"
        accept="image/*"
        {...uploadConfig}
      >
        {contextHolder}
        {imageUrl ? (
          <img src={imageUrl} alt={"image"} width={"100%"} />
        ) : (
          <Space direction="vertical">
            <PlusOutlined />
            <Typography.Text>Upload</Typography.Text>
          </Space>
        )}
      </Upload>
    </Form.Item>
  );
};

export default UploadImage;
