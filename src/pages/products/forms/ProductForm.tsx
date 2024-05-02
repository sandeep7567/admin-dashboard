import { PlusOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
} from "antd";
import { useState } from "react";
import { CURRENT_PAGE, PER_PAGE } from "../../../constants";
import { useFetchCategories } from "../../../hooks/category/useFetchCategories";
import { useFetchTenants } from "../../../hooks/tenant/useFetchTenants";
import { Category, QueryParams, Tenant } from "../../../types";
import Pricing from "./Pricing";
import Attributes from "./Attributes";

const ProductForm = () => {
  const [queryParams] = useState<QueryParams>({
    currentPage: CURRENT_PAGE,
    perPage: PER_PAGE,
  });

  const { categories } = useFetchCategories();
  const { tenants } = useFetchTenants(queryParams);

  const selecteCategory = Form.useWatch("categoryId");

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size={"large"}>
          <Card title={"Product info"}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Product name"
                  name={"name"}
                  rules={[
                    {
                      required: true,
                      message: "Product name must be provided",
                    },
                  ]}
                >
                  <Input placeholder="Enter your first name" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="categoryId"
                  label="Category"
                  rules={[
                    {
                      required: true,
                      message: "Category is required",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Role is required"
                  >
                    {categories.map((catgory: Category) => {
                      return (
                        <Select.Option
                          value={JSON.stringify(catgory)}
                          key={catgory._id}
                        >
                          {catgory.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name={"description"}
                  rules={[
                    {
                      required: true,
                      message: "Description must be provided",
                    },
                  ]}
                >
                  <Input.TextArea
                    maxLength={100}
                    rows={2}
                    placeholder="Enter your email"
                    size="large"
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={"Product image"} bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
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
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    // beforeUpload={beforeUpload}
                    // onChange={handleChange}
                    accept="image/*"
                  >
                    <Space direction="vertical">
                      <PlusOutlined />
                      <Typography.Text>Upload</Typography.Text>
                    </Space>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={"Tenant Info"}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="Restaurant"
                  name="tenantId"
                  rules={[
                    {
                      required: true,
                      message: "Restaurant is required",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select restaurant"
                  >
                    {!!tenants?.data.length &&
                      tenants?.data.map((tenant: Tenant) => {
                        return (
                          <Select.Option value={tenant.id} key={tenant.id}>
                            {tenant.name}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {selecteCategory && <Pricing selectedCategory={selecteCategory} />}
          {selecteCategory && <Attributes selectedCategory={selecteCategory} />}

          <Card title={"Others Properties"}>
            <Row gutter={24}>
              <Col span={24}>
                <Space>
                  <Form.Item name={"isPublish"}>
                    <Switch
                      defaultChecked={false}
                      onChange={() => {}}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    />
                  </Form.Item>
                  <Typography.Text
                    style={{ marginBottom: 25, display: "block" }}
                  >
                    Published
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForm;
