import { useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import Icon, { BellFilled } from "@ant-design/icons";
import { useAuthStore } from "../store";
import Logo from "../components/icons/Logo";
import Home from "../components/icons/Home";
import UserIcon from "../components/icons/UserIcon";
import { FoodIcon } from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";

const { Sider, Header, Content, Footer } = Layout;

const getMenuItems = (role: string) => {
  const baseItems = [
    {
      key: "/",
      icon: <Icon component={Home} />,
      label: <NavLink to={"/"}>Home</NavLink>,
    },
    {
      key: "/products",
      icon: <Icon component={BasketIcon} />,
      label: <NavLink to={"/products"}>Products</NavLink>,
    },
    {
      key: "/promos",
      icon: <Icon component={GiftIcon} />,
      label: <NavLink to={"/promos"}>Promos</NavLink>,
    },
  ];

  if (role === "admin") {
    const menus = [...baseItems];
    menus.splice(1, 0, {
      key: "/users",
      icon: <Icon component={UserIcon} />,
      label: <NavLink to={"/users"}>Users</NavLink>,
    });

    menus.splice(2, 0, {
      key: "/restaurants",
      icon: <Icon component={FoodIcon} />,
      label: <NavLink to={"/restaurants"}>Restaurants</NavLink>,
    });

    return menus;
  }

  return baseItems;
};

const Dashboard = () => {
  const { logout: logoutFromStore, user } = useAuthStore();

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      logoutFromStore();
      return;
    },
  });

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (user === null) {
    return <Navigate to={"/auth/login"} replace />;
  }

  const items = getMenuItems(user?.role);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <div className="demo-logo-vertical logo">
          <Logo />
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["/"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            background: colorBgContainer,
          }}
        >
          <Flex gap="middle" align="start" justify="space-between">
            <Badge
              text={
                user.role === "admin"
                  ? "You are a admin"
                  : `${user.tenant?.name}`
              }
              status="success"
            />
            <Space size={16}>
              <Badge dot>
                <BellFilled />
              </Badge>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "logout",
                      label: "Logout",
                      onClick: () => logoutMutate(),
                    },
                  ],
                }}
                placement="bottomRight"
              >
                <Avatar
                  style={{
                    backgroundColor: "#fde3cf",
                    color: "#f56a00",
                  }}
                >
                  U
                </Avatar>
              </Dropdown>
            </Space>
          </Flex>
        </Header>
        <Content style={{ margin: "24px" }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Food Orderning multi restorant Shop ©{new Date().getFullYear()}{" "}
          Created by Sandeep Thakur
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
