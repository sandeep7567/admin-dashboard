import { RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Space, Table, TableProps } from "antd";
import { Link } from "react-router-dom";
import { getUsers } from "../../http/api";
import { User } from "../../types";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

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
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
];

const Users = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    data: users,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return getUsers().then((res) => res.data);
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
          dataSource={users}
          loading={isLoading}
        />

        <Drawer
          title={"Create user"}
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

export default Users;
