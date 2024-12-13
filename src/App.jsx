import React from "react";
import MainTable from "./MainTable.jsx";
import useWindowSize from "./useWindowSize.js";
import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

function App() {
  const { height, width } = useWindowSize();
  return (
    <div
      style={{
        height,
        width,
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      <header style={{ width, height: 45 }}>
        <div
          style={{
            backgroundColor: "#333",
            padding: 10,
            textAlign: "center",
            flex: "0 0 auto",
            position: "relative",
          }}
        >
          <Typography.Text
            style={{
              color: "#fff",
            }}
          >
            The Frum Provider Network
          </Typography.Text>
          <Button
          size="small"
            style={{
              position: "absolute",
              right: "10px",
            }}
            icon={<PlusOutlined />}
            target="_blank"
            href={import.meta.env.VITE_APP_LINK_TO_NEW_PROVIDER_FORM}
          >
            New Provider
          </Button>
        </div>
      </header>
      <main style={{ width, height: height - 45, padding: 10 }}>
        <MainTable height={height - 45 - 20} width={width - 20} />
      </main>
    </div>
  );
}

export default App;
