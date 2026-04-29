import { Modal, Descriptions, Tag, Button, Popconfirm, message} from "antd";
import dayjs from "dayjs";
import type { Patient, PatientStatus } from "../types/patient";
import { useDeletePatient } from "../hooks/usePatients";

const STATUS_COLOR: Record<PatientStatus, string> = {
  Inquiry: "blue",
  Onboarding: "orange",
  Active: "green",
  Churned: "default",
};

interface Props {
  patient: Patient | null;
  onClose: () => void;
}

export function PatientDetailModal({ patient, onClose }: Props) {
  if (!patient) return null;

  const fullName = [patient.firstName, patient.middleName, patient.lastName]
    .filter(Boolean)
    .join(" ");

  const formattedAddress = `${patient.address.street}, ${patient.address.city}, ${patient.address.state} ${patient.address.zipCode}`;

  const deletePatient = useDeletePatient();

  const handleDelete = () => {
    deletePatient.mutate(patient.id, {
      onSuccess: () => {
        message.success("Patient successfully deleted")
        onClose();
      },
      onError: () => {
        message.error("Failed to delete patient, please try again")
      }
    })
  }
  return ( 
    <Modal
      title="Patient Details"
      open={!!patient}
      onCancel={onClose}
      width={600}
      footer={[       
        <Popconfirm
          key="delete"
          title="Delete this patient?"
          description="This cannot be undone."
          okText="Yes"                                                                                                                         
          cancelText="No"
          okButtonProps={{ danger: true }}                                                                                                     
          onConfirm={handleDelete}
        >                                                                                                                                      
          <Button danger loading={deletePatient.isPending}>
            Delete Patient                                                                                                                     
          </Button>   
        </Popconfirm>,                                                                                                                         
      ]}
    >
      <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
        <Descriptions.Item label="Full Name">{fullName}</Descriptions.Item>
        <Descriptions.Item label="Date of Birth">
          {dayjs(patient.dateOfBirth).format("MM/DD/YYYY")}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={STATUS_COLOR[patient.status]}>{patient.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Address">{formattedAddress}</Descriptions.Item>
        <Descriptions.Item label="Added">
          {dayjs(patient.createdAt).format("MM/DD/YYYY h:mm A")}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}
