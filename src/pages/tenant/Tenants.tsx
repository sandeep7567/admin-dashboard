import { RightOutlined } from "@ant-design/icons";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Space,
  Table,
  TableProps,
  theme,
} from "antd";
import { Link } from "react-router-dom";
import { createTenant, getTenants } from "../../http/api";
import { CreateTenantData, Tenant } from "../../types";

import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import TenantsFilter from "./TenantsFilter";
import TenantForm from "./forms/TenantForm";

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
  const [form] = Form.useForm();
  const queryClient = new QueryClient();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

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

  const { mutate: tenantMutate } = useMutation({
    mutationKey: ["tenant"],

    mutationFn: async (data: CreateTenantData) =>
      createTenant(data).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();

    await tenantMutate(form.getFieldsValue());

    form.resetFields();
    setIsDrawerOpen(false);
  };

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
          styles={{ body: { backgroundColor: colorBgLayout } }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setIsDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
