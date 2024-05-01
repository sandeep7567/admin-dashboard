import {
  PlusOutlined,
  RightOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Modal,
  Space,
  Spin,
  Table,
  TableProps,
  Tag,
  theme,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import { FieldData, Product, QueryParams } from "../../types";
import ProductsFilter from "./ProductsFilter";
import { useFetchProducts } from "../../hooks/product/useFetchProducts";
import { CURRENT_PAGE, DEBOUNCE_TIMER, PER_PAGE, ROLES } from "../../constants";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./forms/ProductForm";

const columns: TableProps<Product>["columns"] = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: Product) => {
      return (
        <div>
          <Space>
            <Image width={60} src={record.image} preview={false} />
            <Typography.Text>{record.name}</Typography.Text>
          </Space>
        </div>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (_text: string, record: Product) => {
      return (
        <>
          {record.isPublish ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="red">unpublished</Tag>
          )}
        </>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_text: string) => {
      return (
        <Typography.Text>{format(_text, `dd/MM/yyyy HH:mm`)}</Typography.Text>
      );
    },
  },
];

const Products = () => {
  const { user } = useAuthStore((state) => state);

  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [queryParams, setQueryParams] = useState<QueryParams>({
    currentPage: CURRENT_PAGE,
    perPage: PER_PAGE,
    isPublish: true,
    tenantId: user?.role === ROLES.MANAGER ? user?.tenant?.id : undefined,
  });

  const { products, isFetching, error, isError } =
    useFetchProducts(queryParams);

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

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const onHandleSubmit = () => {
    console.log("submitting...");
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
            <Typography.Text type="danger">{error?.message}</Typography.Text>
          )}
        </Flex>

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <ProductsFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsDrawerOpen(true);
              }}
            >
              Add Product
            </Button>
          </ProductsFilter>
        </Form>

        <Table
          rowKey={"id"}
          columns={[
            ...columns,
            {
              title: "Action",
              dataIndex: "action",
              key: "action",

              render: () => {
                return (
                  <Space>
                    <Button type="link" onClick={() => {}}>
                      Edit
                    </Button>
                    <Button type="link" onClick={() => {}}>
                      Delete
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={products?.data}
          loading={false}
          pagination={{
            current: queryParams.currentPage,
            pageSize: queryParams.perPage,
            total: products?.total,
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
          open={false}
          destroyOnClose
          okText={"Delete"}
          onOk={() => {}}
          onCancel={() => {}}
        >
          <Flex justify="center">
            <Typography.Text>Are you sure?</Typography.Text>
          </Flex>
        </Modal>

        <Drawer
          title={"Add Product"}
          width={720}
          destroyOnClose
          open={isDrawerOpen}
          onClose={() => {
            form.resetFields();
            setIsDrawerOpen(false);
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
            <ProductForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;
