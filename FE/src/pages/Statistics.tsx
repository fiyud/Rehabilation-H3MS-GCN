import { TabsLayout } from "@/layouts";
import { User, http, useAuth } from "@/lib";
import { Button, Dialog, Flex, Table, Text, TextField } from "@radix-ui/themes";
import { CirclePlus, Sheet } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
interface Patients extends User {
  exercise: string;
  marks: number;
}
interface Exercises {
  id: number;
  patientId: number | null;
  type: string;
  score: number;
  duration: number;
  submittedAt: string;
}
type CSVHeader = { label: string; key: string };
type ExportToCSVOptions = {
  filename?: string;
  includeBOM?: boolean; // For Excel compatibility
};
const Statistics: React.FC = () => {
  const [patients, setPatients] = useState<Patients[]>([]);
  const [exercises, setExercises] = useState<Exercises[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const getPatients = async () => {
    try {
      setLoading(true);
      const resp = await http.get(`/patients`);
      if (resp.status === 200) {
        setPatients(resp.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddPatient = async (formData: FormData) => {
    try {
      setLoading(true);
      const resp = await http.post(`/patients`, formData);
      if (resp.status === 200) {
        setPatients((prev) => [...prev, resp.data]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const getExercises = async () => {
    try {
      setLoading(true);
      const resp = await http.get("/exercises");
      if (resp?.status === 200) {
        setExercises(resp.data);
        console.log("GET 200");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    return () => {
      if (user?.role == 1) {
        getExercises();
      } else {
        getPatients();
      }
    };
  }, []);
  const exerciseHeaders = [
    { label: "Id", key: "id" },
    { label: "Name", key: "name" },
    { label: "Exercise", key: "exercise" },
    { label: "Marks", key: "marks" },
    { label: "Duration", key: "duration" },
  ];
  const patientsHeaders = [
    { label: "Id", key: "id" },
    { label: "Name", key: "name" },
    { label: "Exercise", key: "exercise" },
    { label: "Marks", key: "marks" },
  ];

  const exportToCSV = (
    data: Record<string, any>[],
    headers: CSVHeader[],
    options: ExportToCSVOptions = {}
  ) => {
    const { filename = "export.csv", includeBOM = false } = options;

    const formatCell = (value: any): string => {
      if (value === null || value === undefined) return "";
      let cell = String(value);
      if (typeof value === "object") {
        try {
          cell = JSON.stringify(value);
        } catch {
          cell = "";
        }
      }
      return cell.includes(",") || cell.includes('"') || cell.includes("\n")
        ? `"${cell.replace(/"/g, '""')}"`
        : cell;
    };

    try {
      setLoading(true);

      const headerRow = headers.map((h) => h.label).join(",");
      const rows = data.map((item) =>
        headers.map((h) => formatCell(item[h.key])).join(",")
      );

      const csvBody = [headerRow, ...rows].join("\n");
      const finalCSV = includeBOM ? "\uFEFF" + csvBody : csvBody;

      const blob = new Blob([finalCSV], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("CSV Export Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (user?.role === 1) {
      const formattedExercises = exercises.map((exercise) => {
        const [name, exerciseType] = exercise.type.split("_");

        return {
          id: exercise.id,
          name: name || "",
          exercise: exerciseType || "",
          marks: `${exercise.score}/${name == "Kimore" ? 50 : 1}`,
          duration: `${Math.floor(exercise.duration / 60)}:${String(
            exercise.duration % 60
          ).padStart(2, "0")}`,
        };
      });

      exportToCSV(formattedExercises, exerciseHeaders);
    } else {
      exportToCSV(patients, patientsHeaders);
    }
  };

  return (
    <TabsLayout>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Flex align={"center"} justify="between" className="my-4">
            <h1 className="font-semibold">Statistics</h1>
            <Flex className="*:cursor-pointer">
              <Button
                variant="classic"
                size="2"
                onClick={handleExportCSV}
                className="mr-4"
                color="teal"
                loading={loading}
              >
                <Sheet /> Export CSV
              </Button>
              {user?.role == 2 && (
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="classic" size="2" color="iris">
                      <CirclePlus /> Add your Patients
                    </Button>
                  </Dialog.Trigger>

                  <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Add your patients</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                      Make changes to your profile.
                    </Dialog.Description>
                    <form action={handleAddPatient} method="post">
                      <Flex direction="column" gap="3">
                        <label>
                          <Text as="div" size="2" mb="1" weight="bold">
                            Patient's Name
                          </Text>
                          <TextField.Root placeholder="Enter patient's full name" />
                        </label>
                        <label>
                          <Text as="div" size="2" mb="1" weight="bold">
                            UID
                          </Text>
                          <TextField.Root placeholder="Enter patient's given UID" />
                        </label>
                      </Flex>
                    </form>

                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <Dialog.Close>
                        <Button>Save</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
              )}
            </Flex>
          </Flex>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>#Id</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Exercise</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Marks</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Duration</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {user?.role == 1
                ? !!exercises?.length &&
                  exercises.map((exercise) => (
                    <Table.Row key={exercise.id}>
                      <Table.RowHeaderCell>{exercise.id}</Table.RowHeaderCell>
                      <Table.Cell>{exercise.type.split("_")[0]}</Table.Cell>
                      <Table.Cell>{exercise.type.split("_")[1]}</Table.Cell>
                      <Table.Cell>
                        {exercise.score}/
                        {exercise?.type.split("_")[0] == "Kimore" ? 50 : 1}
                      </Table.Cell>
                      <Table.Cell>{`${Math.floor(exercise.duration / 60)}:${
                        exercise.duration % 60
                      }`}</Table.Cell>
                    </Table.Row>
                  ))
                : !!patients.length &&
                  patients.map((patient) => (
                    <Table.Row key={patient.id}>
                      <Table.Cell>{patient.id}</Table.Cell>
                      <Table.Cell>{patient.name}</Table.Cell>
                      <Table.Cell>{patient.exercise}</Table.Cell>
                      <Table.Cell>{patient.marks}</Table.Cell>
                    </Table.Row>
                  ))}
            </Table.Body>
          </Table.Root>
        </motion.div>
      </AnimatePresence>
    </TabsLayout>
  );
};

export default Statistics;
