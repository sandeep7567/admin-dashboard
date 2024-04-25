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
import { createUser, deleteUser, getUsers, updateUser } from "../../http/api";
import { CreateUserData, FieldData, User } from "../../types";
import UsersFilter from "./UsersFilter";
import { useEffect, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import UserForm from "./forms/UserForm";
import { CURRENT_PAGE, DEBOUNCE_TIMER, PER_PAGE } from "../../constants";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";

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
  {
    title: "Restaurant",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: User) => {
      return <div>{record.tenant?.name}</div>;
    },
  },
];

const Users = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    currentPage: CURRENT_PAGE,
    perPage: PER_PAGE,
  });
  const [currentEditUser, setCurrentEditUser] = useState<null | User>(null);
  const [currentUserDeleteId, setCurrentUserDeleteId] = useState<null | string>(
    null
  );

  useEffect(() => {
    if (currentEditUser) {
      setIsDrawerOpen(true);
      form.setFieldsValue({
        ...currentEditUser,
        tenantId: currentEditUser.tenant?.id,
      });
    }
  }, [currentEditUser, form]);

  const {
    data: users,
    isError,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      const filterParams = Object.entries(queryParams).filter(
        ([, value]) => !!value
      );

      const queryString = new URLSearchParams(
        filterParams as unknown as Record<string, string>
      ).toString();

      return getUsers(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: userMutate } = useMutation({
    mutationKey: ["user"],

    mutationFn: async (data: CreateUserData) =>
      createUser(data).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  const { mutate: updateUserMutation } = useMutation({
    mutationKey: ["update-user"],

    mutationFn: async (data: CreateUserData) =>
      updateUser(data, currentEditUser!.id).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  const { mutate: deleteUserMutation } = useMutation({
    mutationKey: ["delete-user"],

    mutationFn: async (id: string) => deleteUser(id).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    const isEditMode = !!currentEditUser;

    if (isEditMode) {
      await updateUserMutation(form.getFieldsValue());
    } else {
      await userMutate(form.getFieldsValue());
    }

    form.resetFields();
    setCurrentEditUser(null);
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
    await deleteUserMutation(currentUserDeleteId!);

    setCurrentUserDeleteId(null);
  };

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }} size={"large"}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to={"/"}>Dashboard</Link> },
              { title: "Users" },
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
          <UsersFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsDrawerOpen(true);
                form.resetFields();
              }}
            >
              Add User
            </Button>
          </UsersFilter>
        </Form>

        <Table
          rowKey={"id"}
          columns={[
            ...columns,
            {
              title: "Action",
              dataIndex: "action",
              key: "action",

              render: (_text: string, record: User) => {
                return (
                  <Space>
                    <Button
                      style={{
                        padding: 0,
                        visibility: `${
                          record.id.toString() === user?.id.toString()
                            ? "hidden"
                            : "visible"
                        }`,
                      }}
                      type="link"
                      onClick={() => {
                        setCurrentEditUser(record);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      style={{
                        padding: 0,
                        visibility: `${
                          record.id.toString() === user?.id.toString()
                            ? "hidden"
                            : "visible"
                        }`,
                      }}
                      type="link"
                      onClick={() => {
                        setCurrentUserDeleteId(record.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={users?.data}
          loading={isFetching}
          pagination={{
            current: queryParams.currentPage,
            pageSize: queryParams.perPage,
            total: users?.total,
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
          open={!!currentUserDeleteId}
          destroyOnClose
          okText={"Delete"}
          onOk={onHandleDelete}
          onCancel={() => setCurrentUserDeleteId(null)}
        >
          <Flex justify="center">
            <Typography.Text>Are you sure?</Typography.Text>
          </Flex>
        </Modal>

        <Drawer
          title={"Create user"}
          width={720}
          destroyOnClose
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setCurrentEditUser(null);
          }}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setIsDrawerOpen(false);
                  setCurrentEditUser(null);
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
            <UserForm isEditMode={!!currentEditUser} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
