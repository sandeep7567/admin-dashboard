import { RightOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  TableProps,
  theme,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import { createTenant, getTenants } from "../../http/api";
import { CreateTenantData, FieldData, Tenant } from "../../types";

import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import TenantsFilter from "./TenantsFilter";
import TenantForm from "./forms/TenantForm";
import { CURRENT_PAGE, PER_PAGE } from "../../constants";

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
  const [filterForm] = Form.useForm();

  const queryClient = useQueryClient();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    currentPage: CURRENT_PAGE,
    perPage: PER_PAGE,
  });

  const {
    data: tenants,
    isError,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: async () => {
      const filterParams = Object.entries(queryParams).filter(
        ([key, value]) => !!value
      );

      const queryString = new URLSearchParams(
        filterParams as unknown as Record<string, string>
      ).toString();

      return getTenants(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
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

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    console.log(changedFilterFields);

    setQueryParams((prev) => ({
      ...prev,
      ...changedFilterFields,
    }));
  };

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }} size={"large"}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to={"/"}>Dashboard</Link> },
              { title: "Restaurants" },
            ]}
          />
          {isFetching && (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <TenantsFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsDrawerOpen(true)}
            >
              Add Restaurant
            </Button>
          </TenantsFilter>
        </Form>

        <Table
          rowKey={"id"}
          columns={columns}
          dataSource={tenants?.data}
          loading={isFetching}
          pagination={{
            current: queryParams.currentPage,
            pageSize: queryParams.perPage,
            total: tenants?.total,
            onChange: (page) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
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
