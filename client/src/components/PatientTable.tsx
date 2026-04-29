import { Table, Tag, Typography, Alert } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { Patient, PatientStatus } from "../types/patient";
import { usePatients } from "../hooks/usePatients";

const STATUS_COLOR: Record<PatientStatus, string> = {
  Inquiry: "blue",
  Onboarding: "orange",
  Active: "green",
  Churned: "default",
};

const columns: ColumnsType<Patient> = [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "Middle Name",
    dataIndex: "middleName",
    key: "middleName",
    render: (v?: string) => v ?? "—",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
  },
  {
    title: "Date of Birth",
    dataIndex: "dateOfBirth",
    key: "dateOfBirth",
    render: (v: string) => dayjs(v).format("MM/DD/YYYY"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (v: PatientStatus) => <Tag color={STATUS_COLOR[v]}>{v}</Tag>,
  },
];

interface Props {
  onRowClick: (patient: Patient) => void;
}

export function PatientTable({ onRowClick }: Props) {
  const { data: patients, isLoading, isError } = usePatients();

  if (isError) {
    return (
      <Alert
        type="error"
        message="Failed to load patients. Make sure the server is running."
      />
    );
  }

  return (
    <>
      {patients?.length === 0 && !isLoading && (
        <Typography.Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
          No patients yet. Click "Add Patient" to get started.
        </Typography.Text>
      )}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={patients ?? []}
        loading={isLoading}
        pagination={{ pageSize: 20 }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          style: { cursor: "pointer" },
        })}
      />
    </>
  );
}
