import { Card, Col, Input, Row } from "antd";
import React from "react";

type TenantFilterProps = {
  onFilterChange: (filterName: string, filterValue: string) => void;
  children: React.ReactNode;
};

const TenantsFilter = ({ onFilterChange, children }: TenantFilterProps) => {
  return (
    <Card>
      <Row style={{ justifyContent: "space-between" }}>
        <Col span={16}>
          <Row gutter={[20, 20]}>
            <Col span={8}>
              <Input.Search
                placeholder="Search"
                allowClear
                onChange={(e) => onFilterChange("searchFilter", e.target.value)}
              />
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
