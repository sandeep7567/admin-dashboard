import { RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Space, Table, TableProps } from "antd";
import { Link } from "react-router-dom";
import { getTenants } from "../../http/api";
import { Tenant } from "../../types";

import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import TenantsFilter from "./TenantsFilter";

const columns: TableProps<Tenant>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const Tenants = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    data: tenants,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      return getTenants().then((res) => res.data);
    },
  });

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }} size={"large"}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: "Restaurants" },
          ]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}

        <TenantsFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(`${filterName}: ${filterValue}`);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Add Restaurant
          </Button>
        </TenantsFilter>

        <Table
          rowKey={"id"}
          columns={columns}
          dataSource={tenants}
          loading={isLoading}
        />

        <Drawer
          title={"Create Restaurants"}
          width={720}
          destroyOnClose
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          extra={
            <Space>
              <Button>Cancel</Button>
              <Button type="primary">Submit</Button>
            </Space>
          }
        >
          <p>Extrsa</p>
          <p>Extrsa</p>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
