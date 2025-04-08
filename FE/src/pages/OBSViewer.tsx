import React, { useState } from "react";
import OBSStream from "@/components/OBSStream";
import TabsLayout from "@/layouts/TabsLayout";
import { Blockquote, Code } from "@radix-ui/themes";

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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-white">
          OBS Virtual Camera Viewer
        </h1>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            <h2 className="font-bold">Error</h2>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-[#242424] rounded-lg p-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <OBSStream
                onStreamReady={handleStreamReady}
                onError={handleError}
              />
            </div>
            <Blockquote className="mt-4">
              <h3 className="text-lg font-medium mb-2 text-gray-300">
                Instructions:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>
                  Make sure you have{" "}
                  <a href="https://obsproject.com/" target="_blank">
                    OBS Studio
                  </a>{" "}
                  installed
                </li>
                <li>
                  Use the{" "}
                  <a
                    href="https://obsproject.com/forum/resources/obs-kinect-with-faux-green-screen.897/"
                    target="_blank"
                  >
                    Kinectv2 for OBS
                  </a>{" "}
                  plugin <span>or</span> follow this{" "}
                  <a
                    href="https://www.youtube.com/watch?v=iEtKBZ2crUE"
                    target="_blank"
                  >
                    instruction
                  </a>
                  .
                </li>
                <li>
                  Start the Virtual Camera in OBS (
                  <Code className="text-[#ccc]">Tools</Code> &gt;{" "}
                  <Code className="text-[#ccc]">StartVirtual Camera</Code>)
                </li>
                <li>Click the "Connect to OBS" button above</li>
                <li>
                  If you see any errors, check the console (F12) for more
                  details
                </li>
              </ol>
            </Blockquote>
          </div>
        </div>
      </div>
    </TabsLayout>
  );
};

export default OBSViewer;
