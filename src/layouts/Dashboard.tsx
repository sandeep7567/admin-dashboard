import { useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { Layout, Menu, theme } from "antd";
import Icon from "@ant-design/icons";
import { useAuthStore } from "../store";
import Logo from "../components/icons/Logo";
import Home from "../components/icons/Home";
import UserIcon from "../components/icons/UserIcon";
import { FoodIcon } from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";

const { Sider, Header, Content, Footer } = Layout;
const items = [
  {
    key: "/",
    icon: <Icon component={Home} />,
    label: <NavLink to={"/"}>Home</NavLink>,
  },
  {
    key: "/users",
    icon: <Icon component={UserIcon} />,
    label: <NavLink to={"/users"}>Users</NavLink>,
  },
  {
    key: "/restaurants",
    icon: <Icon component={FoodIcon} />,
    label: <NavLink to={"/restaurants"}>Restaurants</NavLink>,
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

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { user } = useAuthStore();

  if (user === null) {
    return <Navigate to={"/auth/login"} replace />;
  }

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
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
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
