import { TabsLayout } from "@/layouts";
import { User, http, useAuth, useExercise } from "@/lib";
import {
  Button,
  Dialog,
  Flex,
  Table,
  Text,
  TextField,
  Tooltip,
  Link,
} from "@radix-ui/themes";
import { CirclePlus, Sheet } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
interface Patients extends User {
  exercises: Exercises[];
  marks: string;
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
  const [filteredSets, setFilteredSets] = useState<
    Patients[] | Exercises[] | undefined
  >([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { search } = useExercise();
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
      console.log(formData);
      setLoading(true);
      const resp = await http.post(`/patients`, formData);
      if (resp.status === 201) {
        getPatients();
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
      if (user?.role == "Patient") {
        getExercises();
      } else if (user?.role == "Doctor") {
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
    { label: "Id", key: "patient_id" },
    { label: "Name", key: "patient_name" },
    { label: "Age", key: "age" },
    { label: "Address", key: "address" },
    { label: "Phone", key: "phone" },
    { label: "Name", key: "name" },
    { label: "Exercise", key: "type" },
    { label: "Marks", key: "marks" },
    { label: "Duration", key: "duration" },
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

  const filteringSets = () => {
    if (user?.role == "Patient") {
      setFilteredSets(
        exercises.filter((exercise) =>
          exercise.type.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else if (user?.role == "Doctor") {
      setFilteredSets(
        patients.filter((patient) =>
          patient.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  const handleExportCSV = () => {
    if (user?.role === "Patient") {
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
      const formattedPatients = patients.flatMap((patient) =>
        patient.exercises.map((exercise) => ({
          ...exercise,
          name: exercise.type.split("_")[0] || "",
          exercise: exercise.type.split("_")[1] || "",
          marks:
            `${exercise.score}/${
              exercise.type.split("_")[0] == "Kimore" ? 50 : 1
            }` || "",
          patient_id: patient.id,
          patient_name: patient.name,
          age: patient.age,
          address: patient.address,
          phone: patient.phone,
        }))
      );
      console.log(patients);
      console.log(formattedPatients);
      exportToCSV(formattedPatients, patientsHeaders);
    }
  };

  useEffect(() => {
    filteringSets();
  }, [search, patients, exercises]);

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
              {user?.role == "Doctor" && (
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="classic" size="2" color="iris">
                      <CirclePlus /> Add your Patients
                    </Button>
                  </Dialog.Trigger>

                  <Dialog.Content maxWidth="450px">
                    <form action={handleAddPatient} method="post">
                      <Dialog.Title>Add your patients</Dialog.Title>
                      <Dialog.Description size="2" mb="4">
                        Make changes to your profile.
                      </Dialog.Description>
                      <Flex direction="column" gap="3">
                        <label>
                          <Text as="div" size="2" mb="1" weight="bold">
                            UID
                          </Text>
                          <TextField.Root
                            name="id"
                            placeholder="Enter patient's given UID"
                          />
                        </label>
                        <label>
                          <Text as="div" size="2" mb="1" weight="bold">
                            Patient's Name
                          </Text>
                          <TextField.Root
                            name="name"
                            placeholder="Enter patient's full name"
                          />
                        </label>
                        <label>
                          <Text as="div" size="2" mb="1" weight="bold">
                            Age
                          </Text>
                          <TextField.Root
                            name="age"
                            placeholder="Enter patient's given age"
                          />
                        </label>
                        <label>
                          <Text as="div" size="2" mb="1" weight="bold">
                            Address
                          </Text>
                          <TextField.Root
                            name="address"
                            placeholder="Enter patient's given address"
                          />
                        </label>
                        <label>
                          <Text as="div" size="2" mb="1" weight="bold">
                            Phone Number
                          </Text>
                          <TextField.Root
                            name="phone"
                            placeholder="Enter patient's phone number"
                          />
                        </label>
                      </Flex>

                      <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                          <Button variant="soft" color="gray">
                            Cancel
                          </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                          <Button type="submit">Save</Button>
                        </Dialog.Close>
                      </Flex>
                    </form>
                  </Dialog.Content>
                </Dialog.Root>
              )}
            </Flex>
          </Flex>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                {user?.role == "Patient"
                  ? exerciseHeaders?.map((e, i) => (
                      <Table.ColumnHeaderCell tabIndex={i}>
                        {e?.label}
                      </Table.ColumnHeaderCell>
                    ))
                  : patientsHeaders
                      ?.filter(
                        (p) =>
                          p.key != "name" &&
                          p.key != "marks" &&
                          p.key != "duration"
                      )
                      ?.map((e, i) => (
                        <Table.ColumnHeaderCell tabIndex={i}>
                          {e?.label}
                        </Table.ColumnHeaderCell>
                      ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {user?.role == "Patient"
                ? !!filteredSets?.length &&
                  filteredSets.map((exercise) => {
                    const ex = exercise as Exercises;
                    return (
                      <Table.Row key={ex.id}>
                        <Table.RowHeaderCell>{ex.id}</Table.RowHeaderCell>
                        <Table.Cell>{ex.type.split("_")[0]}</Table.Cell>
                        <Table.Cell>{ex.type.split("_")[1]}</Table.Cell>
                        <Table.Cell>
                          {ex.score}/
                          {ex.type.split("_")[0] == "Kimore" ? 50 : 1}
                        </Table.Cell>
                        <Table.Cell>{`${Math.floor(ex.duration / 60)}:${
                          ex.duration % 60
                        }`}</Table.Cell>
                      </Table.Row>
                    );
                  })
                : !!filteredSets?.length &&
                  filteredSets.map((patient) => {
                    const pt = patient as Patients;
                    return (
                      <Table.Row key={pt.id}>
                        <Table.Cell>{pt.id}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Click to update patient's information">
                            <Link className="cursor-pointer hover:underline">
                              {pt.name}
                            </Link>
                          </Tooltip>
                        </Table.Cell>
                        <Table.Cell>{pt.age || "No information"}</Table.Cell>
                        <Table.Cell>
                          {pt.address || "No information"}
                        </Table.Cell>
                        <Table.Cell>{pt.phone || "No information"}</Table.Cell>
                        <Table.Cell>
                          <Dialog.Root>
                            <Tooltip content="Click to view patient's exercises">
                              <Dialog.Trigger>
                                <Link className="cursor-pointer hover:underline">
                                  View
                                </Link>
                              </Dialog.Trigger>
                            </Tooltip>

                            <Dialog.Content maxWidth="850px">
                              <Dialog.Title>Finished Exercises</Dialog.Title>
                              <Dialog.Description size="2" mb="4">
                                by {pt.name} #{pt.id}
                              </Dialog.Description>
                              <Table.Root variant="surface">
                                <Table.Header>
                                  <Table.Row>
                                    <Table.ColumnHeaderCell>
                                      Exercise Name
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                      Exercise Type
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                      Mark
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                      Duration
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                      Submitted At
                                    </Table.ColumnHeaderCell>
                                  </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                  {!!pt?.exercises?.length &&
                                    pt?.exercises.map((exercise, i) => (
                                      <Table.Row key={i}>
                                        <Table.RowHeaderCell>
                                          {exercise.type.split("_")[0]}
                                        </Table.RowHeaderCell>
                                        <Table.Cell>
                                          {exercise.type.split("_")[1]}
                                        </Table.Cell>
                                        <Table.Cell>
                                          {exercise.score}/
                                          {exercise?.type.split("_")[0] ==
                                          "Kimore"
                                            ? 50
                                            : 1}
                                        </Table.Cell>
                                        <Table.Cell>
                                          {exercise?.duration}
                                        </Table.Cell>
                                        <Table.Cell>
                                          {new Date(
                                            exercise?.submittedAt
                                          ).toUTCString()}
                                        </Table.Cell>
                                      </Table.Row>
                                    ))}
                                </Table.Body>
                              </Table.Root>
                              <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close>
                                  <Button variant="soft" color="gray">
                                    Close
                                  </Button>
                                </Dialog.Close>
                              </Flex>
                            </Dialog.Content>
                          </Dialog.Root>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
            </Table.Body>
          </Table.Root>
        </motion.div>
      </AnimatePresence>
    </TabsLayout>
  );
};

export default Statistics;
