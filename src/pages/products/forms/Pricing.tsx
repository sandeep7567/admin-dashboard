import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import { useFetchCategory } from "../../../hooks/category/useFetchCategory";

type PricingProps = {
  selectedCategory: string;
};

const Pricing = ({ selectedCategory }: PricingProps) => {
  const { category } = useFetchCategory(selectedCategory);

  if (!category) return null;

  return (
    <Card
      title={<Typography.Text>Product price</Typography.Text>}
      bordered={false}
    >
      {Object.entries(category.priceConfiguration).map(
        ([configurationKey, configurationValue]) => {
          return (
            <div key={configurationKey}>
              <Space
                direction="vertical"
                size={"large"}
                style={{ width: "100%" }}
              >
                <Typography.Text>
                  {`${configurationKey} (${configurationValue.priceType})`}
                </Typography.Text>

                <Row gutter={[20, 20]}>
                  {configurationValue.availableOptions.map((option: string) => {
                    return (
                      <Col key={option} span={8}>
                        <Form.Item
                          label={option}
                          name={[
                            "priceConfiguration",
                            JSON.stringify({
                              configurationKey,
                              priceType: configurationValue.priceType,
                            }),
                            option,
                          ]}
                        >
                          <InputNumber addonAfter={"Rs"} />
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
              </Space>
            </div>
          );
        }
      )}
    </Card>
  );
};

export default Pricing;
