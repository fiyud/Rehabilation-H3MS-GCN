import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { TabsLayout } from "@/layouts";
import { User, http, useAuth, useExercise } from "@/lib";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

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

  useEffect(() => {
    return () => {
      if (user?.role == "Doctor") {
        getPatients();
      }
    };
  }, []);

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
    if (user?.role == "Doctor") {
      setFilteredSets(
        patients.filter((patient) =>
          patient.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  const handleExportCSV = () => {
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
  };

  useEffect(() => {
    filteringSets();
  }, [search, patients, exercises]);

  return (
    <TooltipProvider>
      <TabsLayout>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-semibold">Statistics</h1>
              <div className="flex *:cursor-pointer">
                <Button
                  onClick={handleExportCSV}
                  className="mr-4 bg-[#1d6f42] hover:bg-[#1d6f42e3] text-white"
                  disabled={loading}
                >
                  <Sheet /> Export CSV
                </Button>
                {user?.role == "Doctor" && (
                  <Dialog>
                    <DialogTrigger>
                      <Button color="iris">
                        <CirclePlus /> Add your Patients
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <form action={handleAddPatient} method="post">
                        <DialogHeader>
                          <DialogTitle>Add your patients</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <label>
                            <span className="text-sm font-semibold mb-1">
                              UID
                            </span>
                            <Input
                              name="id"
                              placeholder="Enter patient's given UID"
                            />
                          </label>
                          <label>
                            <span className="text-sm font-semibold mb-1">
                              Patient's Name
                            </span>
                            <Input
                              name="name"
                              placeholder="Enter patient's full name"
                            />
                          </label>
                          <label>
                            <span className="text-sm font-semibold mb-1">
                              Age
                            </span>
                            <Input
                              name="age"
                              placeholder="Enter patient's given age"
                            />
                          </label>
                          <label>
                            <span className="text-sm font-semibold mb-1">
                              Address
                            </span>
                            <Input
                              name="address"
                              placeholder="Enter patient's given address"
                            />
                          </label>
                          <label>
                            <span className="text-sm font-semibold mb-1">
                              Phone Number
                            </span>
                            <Input
                              name="phone"
                              placeholder="Enter patient's phone number"
                            />
                          </label>
                        </div>

                        <DialogFooter className="flex gap-4 mt-4 justify-end">
                          <DialogClose>
                            <Button color="gray">Cancel</Button>
                          </DialogClose>
                          <DialogClose>
                            <Button type="submit">Save</Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {patientsHeaders
                    ?.filter(
                      (p) =>
                        p.key != "name" &&
                        p.key != "marks" &&
                        p.key != "duration"
                    )
                    ?.map((e, i) => (
                      <TableHead tabIndex={i}>{e?.label}</TableHead>
                    ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {!!filteredSets?.length &&
                  filteredSets.map((patient) => {
                    const pt = patient as Patients;
                    return (
                      <TableRow key={pt.id}>
                        <TableCell>{pt.id}</TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger>
                              <a className="cursor-pointer hover:underline">
                                {pt.name}
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to update patient's information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{pt.age || "No information"}</TableCell>
                        <TableCell>{pt.address || "No information"}</TableCell>
                        <TableCell>{pt.phone || "No information"}</TableCell>
                        <TableCell>
                          <Dialog>
                            <Tooltip>
                              <TooltipTrigger>
                                {" "}
                                <DialogTrigger>
                                  <a className="cursor-pointer hover:underline">
                                    View
                                  </a>
                                </DialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click to view patient's exercises</p>
                              </TooltipContent>
                            </Tooltip>

                            <DialogContent>
                              <DialogTitle>Finished Exercises</DialogTitle>
                              <DialogDescription>
                                by {pt.name} #{pt.id}
                              </DialogDescription>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Exercise Name</TableHead>
                                    <TableHead>Exercise Type</TableHead>
                                    <TableHead>Mark</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Submitted At</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {!!pt?.exercises?.length &&
                                    pt?.exercises.map((exercise, i) => (
                                      <TableRow key={i}>
                                        <TableHead>
                                          {exercise.type.split("_")[0]}
                                        </TableHead>
                                        <TableCell>
                                          {exercise.type.split("_")[1]}
                                        </TableCell>
                                        <TableCell>
                                          {exercise.score}/
                                          {exercise?.type.split("_")[0] ==
                                          "Kimore"
                                            ? 50
                                            : 1}
                                        </TableCell>
                                        <TableCell>
                                          {exercise?.duration}
                                        </TableCell>
                                        <TableCell>
                                          {new Date(
                                            exercise?.submittedAt
                                          ).toUTCString()}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                              <DialogFooter className="flex justify-end mt-4">
                                <DialogClose>
                                  <Button color="gray">Close</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </motion.div>
        </AnimatePresence>
      </TabsLayout>
    </TooltipProvider>
  );
};

export default Statistics;
