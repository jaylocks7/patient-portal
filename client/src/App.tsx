import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout, Typography, Button, theme } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { PatientTable } from "./components/PatientTable";
import { PatientDetailModal } from "./components/PatientDetailModal";
import { AddPatientModal } from "./components/AddPatientModal";
import type { Patient } from "./types/patient";
import "antd/dist/reset.css";

const queryClient = new QueryClient();

function PatientPortal() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Layout.Header
        style={{
          background: colorBgContainer,
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Patient Portal
        </Typography.Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setAddOpen(true)}
        >
          Add Patient
        </Button>
      </Layout.Header>

      <Layout.Content style={{ padding: "24px" }}>
        <div
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            padding: 24,
          }}
        >
          <PatientTable onRowClick={setSelectedPatient} />
        </div>
      </Layout.Content>

      <PatientDetailModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
      <AddPatientModal open={addOpen} onClose={() => setAddOpen(false)} />
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PatientPortal />
    </QueryClientProvider>
  );
}
