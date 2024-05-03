import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
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
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { CURRENT_PAGE, DEBOUNCE_TIMER, PER_PAGE, ROLES } from "../../constants";
import { useCreateUser } from "../../hooks/user/useCreateUser";
import { useDeleteUser } from "../../hooks/user/useDeleteUser";
import { useFetchUsers } from "../../hooks/user/useFetchUsers";
import { useUpdateUser } from "../../hooks/user/useUpdateUser";
import { useAuthStore } from "../../store";
import { FieldData, User } from "../../types";
import UserForm from "./forms/UserForm";
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

  const { user } = useAuthStore((state) => state);

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

  const { users, error, isError, isFetching } = useFetchUsers(queryParams);
  const { userMutate } = useCreateUser();
  const { updateUserMutation } = useUpdateUser(currentEditUser?.id);
  const { deleteUserMutation } = useDeleteUser();

  useEffect(() => {
    if (currentEditUser) {
      setIsDrawerOpen(true);
      form.setFieldsValue({
        ...currentEditUser,
        tenantId: currentEditUser.tenant?.id,
      });
    }
  }, [currentEditUser, form]);

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
    await deleteUserMutation(currentUserDeleteId);

    setCurrentUserDeleteId(null);
  };

  if (user?.role !== ROLES.ADMIN) {
    return <Navigate to={"/"} replace />;
  }

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
            <Typography.Text type="danger">{error?.message}</Typography.Text>
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
          title={currentEditUser ? "Edit User" : "Add User"}
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
