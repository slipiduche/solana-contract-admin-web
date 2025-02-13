import { Card, Input, Form, Typography, Layout } from "antd";
import Button from "../../components/UI/Button";
import { useState, useTransition } from "react";
import { theme as appTheme } from "../../styles/theme";
import { useSettings } from "../../hooks/useSettings";
import { getTokenDetails } from "../../services/solana";
const { Title } = Typography;
const { Content } = Layout;

const Settings = () => {
  const [isPending, startTransition] = useTransition();
  const { settings, setSettings } = useSettings();
  const [isError, setIsError] = useState(false);

  const handleSubmit = (values: { contractId: string; token: string }) => {
    startTransition(async () => {
      setIsError(false);
      // Simulate a network request
      localStorage.setItem("programId", values.contractId);
      localStorage.setItem("tokenId", values.token);
      const tokenDetails = await getTokenDetails(values.token, "devnet");
      if (!tokenDetails) return setIsError(true);
      
      setSettings({
        contractId: values.contractId,
        tokenId: values.token,
        network: "devnet",
        isSettingsCompleted: true,
        tokenDetails: tokenDetails,
      });
    });
  };

  const AddSettings = () => {
    return (
      <Card>
        <Title
          level={2}
          style={{
            color: appTheme.palette.text.color,
          }}
        >
          Settings
        </Title>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="contractId"
            label="Contract Address"
            tooltip="Enter contract address for deposits"
            rules={[
              {
                required: true,
                message: "Please enter the contract address",
              },
            ]}
          >
            <Input
              placeholder="Enter contract address"
              value={settings?.contractId}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="token"
            label="Token Address"
            style={{ color: appTheme.palette.text.color }}
            tooltip="Enter token address for deposits"
            rules={[
              { required: true, message: "Please enter the token address" },
            ]}
          >
            <Input
              placeholder="Enter token address"
              style={{ width: "100%" }}
              value={settings?.tokenId}
            />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" block loading={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </Form.Item>
        </Form>
        {isError && <Typography.Text style={{ color: appTheme.palette.error.main }}>Error: Token not found</Typography.Text>}
      </Card>
    );
  };

  const Details = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Title style={{ color: appTheme.palette.text.color }} level={4}>
            Contract & Token Details
          </Title>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          width: "100%" 
        }}>
          {/* Primera columna */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Typography.Text>Contract Address:</Typography.Text>
              <Typography.Text style={{ fontSize: "16px" }}>
                {settings?.contractId}
              </Typography.Text>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Typography.Text>Token Address:</Typography.Text>
              <Typography.Text style={{ fontSize: "16px" }}>
                {settings?.tokenId}
              </Typography.Text>
            </div>

            {settings?.tokenDetails && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <Typography.Text>Decimals:</Typography.Text>
                  <Typography.Text style={{ fontSize: "16px" }}>
                    {settings.tokenDetails.decimals}
                  </Typography.Text>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <Typography.Text>Supply:</Typography.Text>
                  <Typography.Text style={{ fontSize: "16px" }}>
                    {settings.tokenDetails.supply}
                  </Typography.Text>
                </div>
              </>
            )}
          </div>

          {/* Segunda columna */}
          {settings?.tokenDetails && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <Typography.Text>Freeze Authority:</Typography.Text>
                <Typography.Text style={{ fontSize: "16px" }}>
                  {settings.tokenDetails.freezeAuthority || "None"}
                </Typography.Text>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <Typography.Text>Mint Authority:</Typography.Text>
                <Typography.Text style={{ fontSize: "16px" }}>
                  {settings.tokenDetails.mintAuthority || "None"}
                </Typography.Text>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={() => setSettings(null)}
          style={{ marginTop: 16 }}
        >
          Change Settings
        </Button>
      </>
    );
  };

  return (
    <Content style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div
        style={{
          display: "flex",
          gap: "24px",
          justifyContent: "center",
          padding: "24px",
          width: "100%"
        }}
      >
        <div style={{ width: "80%" }}>
          {settings?.contractId && settings?.tokenId ? (
            <Details />
          ) : (
            <AddSettings />
          )}
        </div>
      </div>
    </Content>
  );
};

export default Settings;
