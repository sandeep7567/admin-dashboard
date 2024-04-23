import { RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Space, Table, TableProps } from "antd";
import { Link } from "react-router-dom";
import { getTenants } from "../../http/api";
import { User } from "../../types";

import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import UsersFilter from "../user/UsersFilter";

const columns: TableProps<User>["columns"] = [
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
            { title: "Users" },
          ]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}

        <UsersFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(`${filterName}: ${filterValue}`);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Add User
          </Button>
        </UsersFilter>

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
