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
} from "antd";
import { useState } from "react";
import UploadImage from "../../../components/upload/UploadImage";
import { CURRENT_PAGE, PER_PAGE, ROLES } from "../../../constants";
import { useFetchCategories } from "../../../hooks/category/useFetchCategories";
import { useFetchTenants } from "../../../hooks/tenant/useFetchTenants";
import { useAuthStore } from "../../../store";
import { Category, QueryParams, Tenant } from "../../../types";
import Attributes from "./Attributes";
import Pricing from "./Pricing";

const ProductForm = () => {
  const { user } = useAuthStore((state) => state);
  const [queryParams] = useState<QueryParams>({
    currentPage: CURRENT_PAGE,
    perPage: PER_PAGE,
  });

  const selecteCategory = Form.useWatch("categoryId");
  const { categories } = useFetchCategories();
  const { tenants } = useFetchTenants(queryParams);

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
                    {categories?.map((catgory: Category) => {
                      return (
                        <Select.Option value={catgory._id} key={catgory._id}>
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
                <UploadImage />
              </Col>
            </Row>
          </Card>

          {user && user.role !== ROLES.MANAGER && (
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
                            <Select.Option
                              value={String(tenant.id)}
                              key={tenant.id}
                            >
                              {tenant.name}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

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
