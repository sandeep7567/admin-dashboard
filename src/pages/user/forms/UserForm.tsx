import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { CURRENT_PAGE, PER_PAGE } from "../../../constants";
import { useFetchTenants } from "../../../hooks/tenant/useFetchTenants";
import { QueryParams, Tenant } from "../../../types";

interface UseFormProps {
  isEditMode: boolean;
}

const UserForm = ({ isEditMode }: UseFormProps) => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    currentPage: CURRENT_PAGE,
    perPage: PER_PAGE,
  });

  const { tenants, isSuccess } = useFetchTenants(queryParams);

  useEffect(() => {
    if (isSuccess && tenants?.total) {
      setQueryParams((prev) => ({ ...prev, perPage: tenants?.total }));
    }
  }, [isSuccess, tenants?.total]);

  const selectRole = Form.useWatch("role");

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

          {!isEditMode && (
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
          )}

          <Card title={"Roles"}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[
                    {
                      required: true,
                      message: "Role is required",
                    },
                  ]}
                >
                  <Select
                    id="selectBoxInUserForm"
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
              {selectRole === "manager" && (
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
              )}
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
