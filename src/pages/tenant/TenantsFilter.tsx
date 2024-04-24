import { Card, Col, Form, Input, Row } from "antd";
import React from "react";

type TenantFilterProps = {
  children: React.ReactNode;
};

const TenantsFilter = ({ children }: TenantFilterProps) => {
  return (
    <Card>
      <Row style={{ justifyContent: "space-between" }}>
        <Col span={16}>
          <Row gutter={[20, 20]}>
            <Col span={8}>
              <Form.Item name={"q"}>
                <Input.Search placeholder="Search" allowClear />
              </Form.Item>
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

export default TenantsFilter;
