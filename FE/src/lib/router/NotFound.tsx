import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";


const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <AlertTriangle className="w-16 h-16 mb-4" />
        <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
        <p className="text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
        <Button
          size="lg"
          variant="default"
          className="hover:shadow-2xl duration-200 my-4 transition-all"
          onClick={() => navigate("/")}
        >
          Go Back Home
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
