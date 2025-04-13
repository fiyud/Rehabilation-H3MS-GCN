import { TabsLayout } from "@/layouts";
import { Button, Dialog, Flex, Table, Text, TextField } from "@radix-ui/themes";
import { CirclePlus, Sheet } from "lucide-react";
import React from "react";
const Statistics: React.FC = () => {
  return (
    <TabsLayout>
      <Flex align={"center"} justify="between" className="my-4">
        <h1 className="font-semibold">Statistics</h1>
        <Flex className="*:cursor-pointer">
          <Button variant="classic" size="2" className="mr-4" color="teal">
            <Sheet /> Export CSV
          </Button>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="classic" size="2" color="iris">
                <CirclePlus /> Add your Patients
              </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
              <Dialog.Title>Edit profile</Dialog.Title>
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
          </Dialog.Root>
        </Flex>
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
            <Table.Cell>danilo@example.com</Table.Cell>
            <Table.Cell>Developer</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
            <Table.Cell>zahra@example.com</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.RowHeaderCell>Jasper Eriksson</Table.RowHeaderCell>
            <Table.Cell>jasper@example.com</Table.Cell>
            <Table.Cell>Developer</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </TabsLayout>
  );
};

export default Statistics;
