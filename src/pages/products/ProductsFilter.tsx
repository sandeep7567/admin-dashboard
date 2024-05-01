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
import React, { useEffect, useState } from "react";
import { useFetchTenants } from "../../hooks/tenant/useFetchTenants";
import { CURRENT_PAGE, PER_PAGE } from "../../constants";
import { Category, QueryParams, Tenant } from "../../types";
import { useFetchCategories } from "../../hooks/category/useFetchCategories";

type UserFilterProps = {
  children: React.ReactNode;
};

const ProductsFilter = ({ children }: UserFilterProps) => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    currentPage: CURRENT_PAGE,
    perPage: PER_PAGE,
  });

  const { tenants, isSuccess } = useFetchTenants(queryParams);
  const { categories } = useFetchCategories();

  useEffect(() => {
    if (isSuccess && tenants?.total) {
      setQueryParams((prev) => ({ ...prev, perPage: tenants?.total }));
    }
  }, [isSuccess, tenants?.total]);

  return (
    <Card styles={{ body: { paddingBottom: 0 } }}>
      <Row style={{ justifyContent: "space-between" }}>
        <Col span={16}>
          <Row gutter={[20, 20]}>
            <Col span={6}>
              <Form.Item name={"q"}>
                <Input.Search placeholder="Search" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="categoryId">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select Category"
                >
                  {categories?.map((category: Category) => {
                    return (
                      <Select.Option key={category._id} value={category._id}>
                        {category.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="tenantId">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select Restaurant"
                >
                  {tenants?.data.map((tenant: Tenant) => {
                    return (
                      <Select.Option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Space>
                <Form.Item name={"isPublish"}>
                  <Switch defaultChecked onChange={() => {}} />
                </Form.Item>
                <Typography.Text>Show only published</Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductsFilter;
