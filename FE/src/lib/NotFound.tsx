import { TabsLayout } from "@/layouts";
import { Box } from "@radix-ui/themes";
import React from "react";
const NotFound: React.FC = () => {
  return (
    <TabsLayout>
      <Box className="flex flex-col items-center justify-center h-full text-center">
        <h1>NotFound</h1>
        <p>The page you are looking for does not exist.</p>
      </Box>
    </TabsLayout>
  );
};

export default NotFound;
