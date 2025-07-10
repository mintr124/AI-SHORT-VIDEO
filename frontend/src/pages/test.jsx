import { useEffect, useRef, useState } from "react";
export default function CEVideoEditor() {
  const container = useRef(null);
  const [cesdk, setCesdk] = useState(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!container.current || initialized.current) return;
    initialized.current = true;

    (async () => {
      const CreativeEditorSDK = (
        await import(
          "https://cdn.img.ly/packages/imgly/cesdk-js/1.54.0/index.js"
        )
      ).default;

      const instance = await CreativeEditorSDK.create(container.current, {
        license:
          "GeHRgb1L3_m55ajAm7nzMXTu7QoaDE_C16fEX6wfuFPl31wGXf9zRwJpXcc9y-D1",
        baseURL: "https://cdn.img.ly/packages/imgly/cesdk-js/1.54.0/assets",
        callbacks: { onUpload: "local" },
        theme: "dark",
      });

      await instance.addDefaultAssetSources();
      await instance.addDemoAssetSources({ sceneMode: "Video" });
      await instance.createVideoScene();
      await instance.engine.scene.createFromVideo(
        "http://localhost:5000/videos/text_video.mp4"
      );

      setCesdk(instance);
    })();
  }, []);

  const handleExport = async () => {
    if (!cesdk) return;

    try {
      const page = cesdk.engine.scene.getCurrentPage();

      const videoOptions = {
        mimeType: "video/mp4",
        onProgress: (renderedFrames, encodedFrames, totalFrames) => {
          console.log(
            "Rendered",
            renderedFrames,
            "frames and encoded",
            encodedFrames,
            "frames out of",
            totalFrames
          );
        },
        h264Profile: 77,
        h264Level: 52,
        videoBitrate: 0,
        audioBitrate: 0,
        timeOffset: 0,
        framerate: 10,
        targetWidth: 1280,
        targetHeight: 720,
      };

      const blob = await cesdk.engine.block.exportVideo(page, videoOptions);

      if (blob instanceof Blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "exported_video.mp4";
        a.click();
      } else {
        console.error("Export failed: No valid Blob returned");
      }
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="flex flex-row h-screen">
      <div className="flex-1" ref={container} />
      <div className="w-[20%] flex flex-col justify-start bg-[#fdfafa]">
        <button
          onClick={handleExport}
          disabled={!cesdk}
          className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 mt-10"
        >
          Export Video
        </button>
      </div>
    </div>
  );
}
