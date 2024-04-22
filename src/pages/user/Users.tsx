import { RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Space, Table, TableProps } from "antd";
import { Link } from "react-router-dom";
import { getUsers } from "../../http/api";
import { User } from "../../types";
import UsersFilter from "./UsersFilter";

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
        />

        <Table
          rowKey={"id"}
          columns={columns}
          dataSource={users}
          loading={isLoading}
        />
      </Space>
    </>
  );
};

export default Users;
