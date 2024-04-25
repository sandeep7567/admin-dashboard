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
  Modal,
  Space,
  Spin,
  Table,
  TableProps,
  theme,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import {
  createTenant,
  deleteTenant,
  getTenants,
  updateTenant,
} from "../../http/api";
import { CreateTenantData, FieldData, Tenant } from "../../types";

import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import TenantsFilter from "./TenantsFilter";
import TenantForm from "./forms/TenantForm";
import { CURRENT_PAGE, DEBOUNCE_TIMER, PER_PAGE } from "../../constants";
import { debounce } from "lodash";
import { AxiosError } from "axios";

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

  const [currentEditTenant, setCurrentEditTenant] = useState<null | Tenant>(
    null
  );
  const [currentTenantDeleteId, setCurrentTenantDeleteId] = useState<
    null | string
  >(null);

  const queryClient = useQueryClient();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    currentPage: CURRENT_PAGE,
    perPage: PER_PAGE,
  });

  useEffect(() => {
    if (currentEditTenant) {
      setIsDrawerOpen(true);
      form.setFieldsValue(currentEditTenant);
    }
  }, [currentEditTenant, form]);

  const {
    data: tenants,
    isError,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: async () => {
      const filterParams = Object.entries(queryParams).filter(
        ([, value]) => !!value
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

  const { mutate: updateTenantMutation } = useMutation({
    mutationKey: ["update-tenant"],

    mutationFn: async (data: CreateTenantData) =>
      updateTenant(data, currentEditTenant!.id).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });

  const { mutate: deleteTenantMutation } = useMutation({
    mutationKey: ["delete-tenant"],

    mutationFn: async (id: string | null) =>
      deleteTenant(id as string).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
    onError: async (err) => {
      if (err instanceof AxiosError) {
        err?.response?.status === 500 &&
          alert(
            "Cannot delete this tenant. Delete all associated users first." +
              err
          );
      } else {
        console.log("Please try again after some time", err);
      }
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    const isEditMode = !!currentEditTenant;

    if (isEditMode) {
      await updateTenantMutation(form.getFieldsValue());
    } else {
      await tenantMutate(form.getFieldsValue());
    }

    form.resetFields();
    setCurrentEditTenant(null);
    setIsDrawerOpen(false);
  };

  const debounceQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({
        ...prev,
        currentPage: CURRENT_PAGE,
        q: value,
      }));
    }, DEBOUNCE_TIMER);
  }, []);

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      debounceQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        currentPage: CURRENT_PAGE,
        ...changedFilterFields,
      }));
    }
  };

  const onHandleDelete = async () => {
    await deleteTenantMutation(currentTenantDeleteId);

    setCurrentTenantDeleteId(null);
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
          columns={[
            ...columns,
            {
              title: "Action",
              dataIndex: "action",
              key: "action",

              render: (_text: string, record: Tenant) => {
                return (
                  <Space>
                    <Button
                      style={{
                        padding: 0,
                      }}
                      type="link"
                      onClick={() => {
                        setCurrentEditTenant(record);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      style={{
                        padding: 0,
                      }}
                      type="link"
                      onClick={() => {
                        setCurrentTenantDeleteId(record.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Space>
                );
              },
            },
          ]}
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

        <Modal
          title={<Typography.Text>Delete Modal</Typography.Text>}
          open={!!currentTenantDeleteId}
          destroyOnClose
          okText={"Delete"}
          onOk={onHandleDelete}
          onCancel={() => setCurrentTenantDeleteId(null)}
        >
          <Flex justify="center">
            <Typography.Text>Are you sure?</Typography.Text>
          </Flex>
        </Modal>

        <Drawer
          title={"Create Restaurants"}
          width={720}
          destroyOnClose
          open={isDrawerOpen}
          onClose={() => {
            form.resetFields();
            setIsDrawerOpen(false);
            setCurrentEditTenant(null);
          }}
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
