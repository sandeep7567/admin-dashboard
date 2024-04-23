import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import { Tenant } from "../../../types";

const UserForm = () => {
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      return getTenants().then((res) => res.data);
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size={"large"}>
          <Card title={"Basic info"}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name={"firstName"}
                  rules={[
                    {
                      required: true,
                      message: "First name must be provided",
                    },
                  ]}
                >
                  <Input placeholder="Enter your first name" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name={"lastName"}
                  rules={[
                    {
                      required: true,
                      message: "Last name must be provided",
                    },
                  ]}
                >
                  <Input placeholder="Enter your last name" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name={"email"}
                  rules={[
                    {
                      required: true,
                      message: "Emil must be provided",
                    },
                    {
                      type: "email",
                      message: "please provide correct email address",
                    },
                  ]}
                >
                  <Input placeholder="Enter your email" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={"Security info"}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Password"
                  name={"password"}
                  rules={[
                    {
                      required: true,
                      message: "Password must be provided",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter your password"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={"Roles"}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[
                    {
                      required: true,
                      message: "Select Role",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Role is required"
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
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
                    {tenants.map((tenant: Tenant) => {
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
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
