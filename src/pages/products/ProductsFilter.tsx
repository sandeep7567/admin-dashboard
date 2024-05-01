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
import React from "react";

type UserFilterProps = {
  children: React.ReactNode;
};

const ProductsFilter = ({ children }: UserFilterProps) => {
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
              <Form.Item name="category">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select Category"
                >
                  <Select.Option value="pizza">Pizza</Select.Option>
                  <Select.Option value="beverages">Beverages</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="tenant">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select Restaurant"
                >
                  <Select.Option value="pizza">Pizza hub</Select.Option>
                  <Select.Option value="softy">Softy corn</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Space>
                <Switch defaultChecked onChange={() => {}} />
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
