import { Table, Tag, Typography, Alert, type TableColumnsType } from "antd";
import dayjs from "dayjs";
import type { Patient, PatientStatus } from "../types/patient";
import { usePatients } from "../hooks/usePatients";

const STATUS_COLOR: Record<PatientStatus, string> = {
  Inquiry: "blue",
  Onboarding: "orange",
  Active: "green",
  Churned: "default",
};

interface Props {
  onRowClick: (patient: Patient) => void;
}

export function PatientTable({ onRowClick }: Props) {
  const { data: patients, isLoading, isError } = usePatients();

  const columns: TableColumnsType<Patient> = [
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
      sorter: (a, b) => a.dateOfBirth.localeCompare(b.dateOfBirth),
      sortDirections: ['ascend','descend']

    
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: PatientStatus) => <Tag color={STATUS_COLOR[v]}>{v}</Tag>,
    },
  ];

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
        showSorterTooltip={{ target: 'sorter-icon' }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          style: { cursor: "pointer" },
        })}
      />
    </>
  );
}
