import { Card, Col, Form, Input, Row, Space } from "antd";

const TenantForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
          <Card title={"Basic info"}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name={"name"}
                  rules={[
                    {
                      required: true,
                      message: "Tenant Name must be provided",
                    },
                  ]}
                >
                  <Input placeholder="Enter your tenant name" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Address"
                  name={"address"}
                  rules={[
                    {
                      required: true,
                      message: "Tenant address must be provided",
                    },
                  ]}
                >
                  <Input placeholder="Enter your tenant address" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default TenantForm;
