import OBSStream from "@/components/OBSStream";
import TabsLayout from "@/layouts/TabsLayout";
import { Flex } from "@radix-ui/themes";
import React, { useState } from "react";

const OBSViewer: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleStreamReady = (mediaStream: MediaStream) => {
    console.log("Stream ready:", mediaStream);
    setStream(mediaStream);
  };

  const handleError = (errorMessage: string) => {
    console.error("OBS Stream error:", errorMessage);
    setError(errorMessage);
  };

  return (
    <TabsLayout>
      <Flex justify={"between"}>
        <h1 className="text-2xl font-bold mb-6 text-white">
          OBS Virtual Camera Viewer
        </h1>
      </Flex>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          <h2 className="font-bold">Error</h2>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="bg-[#242424] col-span-9 rounded-lg p-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <OBSStream
              onStreamReady={handleStreamReady}
              onError={handleError}
            />
          </div>
        </div>
        <div className="col-span-3 bg-[#242424] rounded-lg p-4 text-white">
          <h2 className="text-xl font-bold mb-4">OBS Virtual Camera</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-1">
                What is OBS Virtual Camera?
              </h3>
              <p className="text-sm text-gray-300">
                A feature that allows OBS Studio to act as a webcam for other
                applications.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-1">
                How to Use
              </h3>
              <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                <li>Start OBS Studio</li>
                <li>Click "Start Virtual Camera" in OBS</li>
                <li>Select OBS Camera in your application</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-1">
                Status
              </h3>
              <Flex align="center" gap="2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    stream ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span>{stream ? "Connected" : "Not Connected"}</span>
              </Flex>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                For more information, visit the{" "}
                <a
                  href="https://obsproject.com/kb/virtual-camera-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  OBS Virtual Camera Guide
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </TabsLayout>
  );
};

export default OBSViewer;
