import { TabsLayout } from "@/layouts";
import { Button, Dialog, Flex, Table, Text, TextField } from "@radix-ui/themes";
import { CirclePlus, Sheet } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { User, http } from "@/lib";
import React from "react";
interface Patients extends User {
  exercise: string;
  marks: number;
}
const Statistics: React.FC = () => {
  const [patients, setPatients] = useState<Patients[]>([]);
  const [loading, setLoading] = useState(false);
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
      const resp = await http.post(
        `/patients`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (resp.status === 200) {
        setPatients((prev) => [...prev, resp.data]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    return () => {
      getPatients();
    };
  }, []);
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
              <Button variant="classic" size="2" className="mr-4" color="teal">
                <Sheet /> Export CSV
              </Button>
              <Dialog.Root>
                <form action={handleAddPatient} method="post">
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

                    <Flex direction="column" gap="3">
                      <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                          Name
                        </Text>
                        <TextField.Root
                          defaultValue="Freja Johnsen"
                          placeholder="Enter your full name"
                        />
                      </label>
                      <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                          Email
                        </Text>
                        <TextField.Root
                          defaultValue="freja@example.com"
                          placeholder="Enter your email"
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
                        <Button>Save</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </form>
              </Dialog.Root>
            </Flex>
          </Flex>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>#Id</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Exercise</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Marks</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {!!patients?.length &&
                patients?.map((p) => (
                  <Table.Row>
                    <Table.RowHeaderCell>{p?.id}</Table.RowHeaderCell>
                    <Table.Cell>{p?.name}</Table.Cell>
                    <Table.Cell>{p?.exercise}</Table.Cell>
                    <Table.Cell>{p?.marks}</Table.Cell>
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
