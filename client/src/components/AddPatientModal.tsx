import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Alert,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";
import { useCreatePatient } from "../hooks/usePatients";
import { PATIENT_STATUSES } from "../types/patient";
import type { CreatePatientBody } from "../types/patient";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddPatientModal({ open, onClose }: Props) {
  const [form] = Form.useForm();
  const { mutateAsync, isPending } = useCreatePatient();
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleFinish(values: Record<string, unknown>) {
    setServerError(null);
    const dob = values.dateOfBirth as ReturnType<typeof dayjs>;
    const body: CreatePatientBody = {
      firstName: values.firstName as string,
      middleName: (values.middleName as string | undefined) || undefined,
      lastName: values.lastName as string,
      dateOfBirth: dob.format("YYYY-MM-DD"),
      status: values.status as CreatePatientBody["status"],
      address: {
        street: values.street as string,
        city: values.city as string,
        state: values.state as string,
        zipCode: values.zipCode as string,
      },
    };

    try {
      await mutateAsync(body);
      message.success("Patient successfully created");
      form.resetFields();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { errors?: { message: string }[] } } })
          ?.response?.data?.errors
          ?.map((e) => e.message)
          .join(", ") ?? "Failed to create patient. Please try again.";
      setServerError(msg);
      message.error("Failed to create patient, please try again");
    }
  }

  function handleCancel() {
    form.resetFields();
    setServerError(null);
    onClose();
  }

  return (
    <Modal
      title="Add Patient"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ marginTop: 16 }}
      >
        {serverError && (
          <Alert
            type="error"
            message={serverError}
            style={{ marginBottom: 16 }}
            closable
            onClose={() => setServerError(null)}
          />
        )}

        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Jane" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Middle Name" name="middleName">
              <Input placeholder="Marie" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(d) => d.isAfter(dayjs())}
                format="MM/DD/YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select placeholder="Select status">
                {PATIENT_STATUSES.map((s) => (
                  <Select.Option key={s} value={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Street"
          name="street"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="123 Main St, Apt 4B" />
        </Form.Item>

        <Row gutter={12}>
          <Col span={10}>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Springfield" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select placeholder="IL" showSearch>
                {US_STATES.map((s) => (
                  <Select.Option key={s} value={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Zip Code"
              name="zipCode"
              rules={[
                { required: true, message: "Required" },
                { pattern: /^\d{5}$/, message: "Must be 5 digits" },
              ]}
            >
              <Input placeholder="62701" maxLength={5} />
            </Form.Item>
          </Col>
        </Row>

        {/* Disabled-until-valid Create Patient button */}
        <Form.Item shouldUpdate noStyle>
          {({ getFieldsValue, getFieldsError }) => {
            const vals = getFieldsValue(true);
            const requiredFilled =
              vals.firstName &&
              vals.lastName &&
              vals.dateOfBirth &&
              vals.status &&
              vals.street &&
              vals.city &&
              vals.state &&
              vals.zipCode;
            const hasErrors = getFieldsError().some(
              ({ errors }) => errors.length > 0
            );
            return (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                  type="primary"
                  disabled={!requiredFilled || hasErrors}
                  loading={isPending}
                  onClick={() => form.submit()}
                >
                  Create Patient
                </Button>
              </div>
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
}
