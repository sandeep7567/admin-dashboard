import { Card, Col, Form, Radio, Row, Switch, Typography } from "antd";
import { useFetchCategory } from "../../../hooks/category/useFetchCategory";
import { Attribute } from "../../../types";

type PricingProps = {
  selectedCategory: string;
};

const Attributes = ({ selectedCategory }: PricingProps) => {
  const { category } = useFetchCategory(selectedCategory);

  if (!category) {
    return null;
  }

  return (
    <Card
      title={<Typography.Text>Attributes</Typography.Text>}
      bordered={false}
    >
      {category.attributes.map((attribute: Attribute) => {
        return (
          <div key={attribute.name}>
            {attribute.widgetType === "radio" ? (
              <Form.Item
                label={attribute.name}
                name={["attributes", attribute.name]}
                initialValue={attribute.defaultValue}
                rules={[
                  {
                    required: true,
                    message: "attribute is required",
                  },
                ]}
              >
                <Radio.Group>
                  {attribute.availableOptions.map((option) => {
                    return (
                      <Radio.Button key={option} value={option}>
                        {option}
                      </Radio.Button>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            ) : attribute.widgetType === "switch" ? (
              <Row gutter={[20, 20]}>
                <Col>
                  <Form.Item
                    name={["attributes", attribute.name]}
                    valuePropName="checked"
                    initialValue={attribute.defaultValue}
                    label={attribute.name}
                  >
                    <Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
          </div>
        );
      })}
    </Card>
  );
};

export default Attributes;
