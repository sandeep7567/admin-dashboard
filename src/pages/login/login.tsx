import { Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { LockFilled, UserOutlined, LockOutlined } from "@ant-design/icons";
import Logo from "../../components/icons/Logo";

const LoginPage = () => {
  return (
    <>
      {/* <h1>Sign in</h1>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button type="button">Login</button>
      <label htmlFor="remember-me">Remember me</label>
      <input type="checkbox" id="remember-me" />
      <a href="forgot-password">Forgot password</a> */}

      <Layout
        style={{
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Space direction="vertical" align="center" size={"large"}>
          <Layout.Content
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Logo />
          </Layout.Content>
          <Card
            title={
              <Space
                style={{
                  width: "100%",
                  fontSize: 16,
                  justifyContent: "center",
                }}
              >
                <LockFilled />
                Sign in
              </Space>
            }
            style={{ width: 300 }}
            bordered={false}
          >
            <Form initialValues={{ remember: true }}>
              <Form.Item
                name={"username"}
                id="username"
                rules={[
                  { required: true, message: "Enter your username" },
                  { type: "email", message: "email is not valid" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name={"password"}
                id="password"
                rules={[
                  { required: true, message: "Enter your password" },
                  { type: "regexp", message: "password is required" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>
              <Flex justify="space-between">
                <Form.Item
                  name={"remember"}
                  valuePropName="checked"
                  id="remember"
                >
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="" id="login-form-forgot">
                  Forgot password
                </a>
              </Flex>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
};

export default LoginPage;
