import {
  Button,
  ScrollArea,
  SegmentedControl,
  Select,
  Separator,
  Slider,
  Switch,
} from "@radix-ui/themes";
import {
  ArrowDownUp,
  Blend,
  CirclePlay,
  CircleStop,
  Contrast,
  Droplets,
  Mic,
  MicOff,
  Moon,
  Power,
  PowerOff,
  Rotate3D,
  Scaling,
  Sun,
  Video,
  VideoOff,
} from "lucide-react";
import React, { useState } from "react";

interface VideoSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
}

interface CamControlProps {
  isPlaying: boolean;
  togglePlay: () => void;
  selectedCamera: string;
  handleCameraChange: (deviceId: string) => void;
  cameras: MediaDeviceInfo[];
  isMuted: boolean;
  toggleMute: () => void;
  isVideoEnabled: boolean;
  toggleVideo: () => void;
  videoSettings: VideoSettings;
  updateVideoSetting: (setting: keyof VideoSettings, value: number) => void;
  controls: boolean;
  setControls: (controls: boolean) => void;
}

const CamControl: React.FC<CamControlProps> = ({
  isPlaying,
  togglePlay,
  selectedCamera,
  handleCameraChange,
  cameras,
  isMuted,
  toggleMute,
  isVideoEnabled,
  toggleVideo,
  videoSettings,
  updateVideoSetting,
  controls,
  setControls,
}: CamControlProps) => {
  const [activeTab, setActiveTab] = useState("camera");
  return (
    <div className="col-span-3 bg-[#101010] h-full rounded-lg p-4 flex flex-col gap-6 overflow-y-auto">
      <SegmentedControl.Root
        defaultValue="camera"
        className="dark "
        onValueChange={setActiveTab}
      >
        <SegmentedControl.Item className="cursor-pointer" value="camera">
          Infos
        </SegmentedControl.Item>
        <SegmentedControl.Item className="cursor-pointer" value="settings">
          Settings
        </SegmentedControl.Item>
      </SegmentedControl.Root>
      <ScrollArea type="scroll" scrollbars="vertical">
        {activeTab === "camera" ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-medium">Camera Controls</h3>
              <Button
                variant="soft"
                color={isPlaying ? "red" : "green"}
                onClick={togglePlay}
                className="w-full cursor-pointer"
              >
                {isPlaying ? (
                  <CircleStop size={20} />
                ) : (
                  <CirclePlay size={20} />
                )}
                {isPlaying ? "Stop" : "Start"}
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-medium">Camera Selection</h3>
              <Select.Root
                value={selectedCamera}
                onValueChange={handleCameraChange}
              >
                <Select.Trigger className="w-full dark" />
                <Select.Content className="dark">
                  {cameras.map((camera) => (
                    <Select.Item
                      key={camera?.deviceId}
                      value={camera?.deviceId || "1"}
                    >
                      {camera?.label ||
                        `Camera ${cameras?.indexOf(camera) + 1}`}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-medium">Audio & Video</h3>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  {isMuted ? (
                    <MicOff size={20} className="text-red-500" />
                  ) : (
                    <Mic size={20} className="text-green-500" />
                  )}
                  <span className="text-white text-sm">Microphone</span>
                </div>
                <Switch
                  className="cursor-pointer dark"
                  checked={!isMuted}
                  onCheckedChange={toggleMute}
                />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  {isVideoEnabled ? (
                    <Video size={20} className="text-green-500" />
                  ) : (
                    <VideoOff size={20} className="text-red-500" />
                  )}
                  <span className="text-white text-sm">Camera</span>
                </div>
                <Switch
                  className="cursor-pointer dark"
                  checked={isVideoEnabled}
                  onCheckedChange={toggleVideo}
                />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  {controls ? (
                    <Power size={20} className="text-green-500" />
                  ) : (
                    <PowerOff size={20} className="text-red-500" />
                  )}
                  <span className="text-white text-sm">Controls</span>
                </div>
                <Switch
                  className="cursor-pointer dark"
                  checked={controls}
                  onCheckedChange={setControls}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-medium">Video Adjustments</h3>
            <div className="flex flex-col gap-4 p-2 rounded-lg ">
              <div className="flex items-center gap-2">
                <Sun size={20} className="text-yellow-500" />
                <span className="text-white text-sm">Brightness</span>
              </div>
              <Slider
                size={"1"}
                value={[videoSettings.brightness]}
                onValueChange={([value]) =>
                  updateVideoSetting("brightness", value)
                }
                min={0}
                max={200}
                step={1}
                className="w-full dark"
              />
            </div>
            <Separator className="dark w-full my-0" />
            <div className="flex flex-col gap-4 p-2 rounded-lg ">
              <div className="flex items-center gap-2">
                <Contrast size={20} className="text-blue-500" />
                <span className="text-white text-sm">Contrast</span>
              </div>
              <Slider
                size={"1"}
                value={[videoSettings.contrast]}
                onValueChange={([value]) =>
                  updateVideoSetting("contrast", value)
                }
                min={0}
                max={200}
                step={1}
                className="w-full dark"
              />
            </div>
            <Separator className="dark w-full my-0" />
            <div className="flex flex-col gap-4 p-2 rounded-lg ">
              <div className="flex items-center gap-2">
                <Droplets size={20} className="text-cyan-500" />
                <span className="text-white text-sm">Saturation</span>
              </div>
              <Slider
                size={"1"}
                value={[videoSettings.saturation]}
                onValueChange={([value]) =>
                  updateVideoSetting("saturation", value)
                }
                min={0}
                max={200}
                step={1}
                className="w-full dark"
              />
            </div>
            <Separator className="dark w-full my-0" />
            <div className="flex flex-col gap-4 p-2 rounded-lg ">
              <div className="flex items-center gap-2">
                <Moon size={20} className="text-purple-500" />
                <span className="text-white text-sm">Blur</span>
              </div>
              <Slider
                size={"1"}
                value={[videoSettings.blur]}
                onValueChange={([value]) => updateVideoSetting("blur", value)}
                min={0}
                max={10}
                step={0.1}
                className="w-full dark"
              />
            </div>
            <Separator className="dark w-full my-0" />
            <div className="flex flex-col gap-4 p-2 rounded-lg ">
              <div className="flex items-center gap-2">
                <Scaling size={20} className="text-gray-500" />
                <span className="text-white text-sm">Grayscale</span>
              </div>
              <Slider
                size={"1"}
                value={[videoSettings.grayscale]}
                onValueChange={([value]) =>
                  updateVideoSetting("grayscale", value)
                }
                min={0}
                max={100}
                step={1}
                className="w-full dark"
              />
            </div>
            <Separator className="dark w-full my-0" />
            <div className="flex flex-col gap-4 p-2 rounded-lg ">
              <div className="flex items-center gap-2">
                <Rotate3D size={20} className="text-green-500" />
                <span className="text-white text-sm">Hue Rotate</span>
              </div>
              <Slider
                size={"1"}
                value={[videoSettings.hueRotate]}
                onValueChange={([value]) =>
                  updateVideoSetting("hueRotate", value)
                }
                min={0}
                max={360}
                step={1}
                className="w-full dark"
              />
            </div>
            <Separator className="dark w-full my-0" />
            <div className="flex flex-col gap-4 p-2 rounded-lg ">
              <div className="flex items-center gap-2">
                <ArrowDownUp size={20} className="text-yellow-500" />
                <span className="text-white text-sm">Invert</span>
              </div>
              <Slider
                size={"1"}
                value={[videoSettings.invert]}
                onValueChange={([value]) => updateVideoSetting("invert", value)}
                min={0}
                max={100}
                step={1}
                className="w-full dark"
              />
            </div>
            <Separator className="dark w-full my-0" />
            <div className="flex flex-col gap-4 p-2 rounded-lg ">
              <div className="flex items-center gap-2">
                <Blend size={20} className="text-gray-500" />
                <span className="text-white text-sm">Opacity</span>
              </div>
              <Slider
                size={"1"}
                value={[videoSettings.opacity]}
                onValueChange={([value]) =>
                  updateVideoSetting("opacity", value)
                }
                min={0}
                max={100}
                step={1}
                className="w-full dark"
              />
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CamControl;
