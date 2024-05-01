import { Link } from "react-router-dom";
import { Breadcrumb, Button, Flex, Form, Space } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import ProductsFilter from "./ProductsFilter";

const Products = () => {
  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }} size={"large"}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to={"/"}>Dashboard</Link> },
              { title: "Users" },
            ]}
          />
        </Flex>

        <Form>
          <ProductsFilter>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
              Add Products
            </Button>
          </ProductsFilter>
        </Form>
      </Space>
    </>
  );
};

export default Products;
