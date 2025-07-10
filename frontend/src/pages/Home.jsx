import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./Home.css";
import dataVideo from "../../../backend/app/db/workspace/video_data.json";
import {
  puddingIcon,
  downarrowIcon,
  magicIcon,
  audioIcon,
  voiceIcon,
  youtubeIcon,
  googleIcon,
  aiIcon,
  rightarrowIcon,
  scriptsIcon,
  robotIcon,
  bulbIcon,
  reloadIcon,
  uploadIcon,
  regenerateIcon,
  imgTest,
  shareIcon,
  exportIcon,
  folderIcon,
  homepageIcon,
  downloadIcon,
} from "../assets/icons";
import {
  contentTypeImage,
  voiceType,
  apiMap,
  feature,
  fonts,
  quality,
  fps,
  typeFile,
  clientId,
  mapFeature,
  imgUser,
} from "../data/constants";
const iconMap = {
  YouTube: youtubeIcon,
  Google: googleIcon,
  AI: aiIcon,
};

export default function Home() {
  const location = useLocation();
  const { user, accessToken } = location.state || {};
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFeature, setSelectedFeature] = useState(1);
  const [progressStep2to3, setProgressStep2to3] = useState(0);
  const [doneCreate, setDoneCreate] = useState(false);
  const [selected, setSelected] = useState("ai");
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(50);
  const [showPlayer, setShowPlayer] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const [backgroundSrc, setBackgroundSrc] = useState("");
  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [script, setScript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [inputValue, setInputValue] = useState("");
  const typingTimeoutRef = useRef(null);
  const [typeSelected, setTypeSelected] = useState("YouTube");
  const endpoint = apiMap[typeSelected];
  const [isSplitView, setIsSplitView] = useState(false);
  const [typeDrawing, setTypeDrawing] = useState("Mặc định");
  const [generatedImages, setGeneratedImages] = useState(0);
  const totalImages = scripts.length;
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [isLoadingScripts, setIsLoadingScripts] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isSubtitles, setIsSubtitles] = useState(false);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [isRenderImage, setIsRenderImage] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [indexSuggestion, setIndexSuggestion] = useState(10);
  const [progessExport, setProgessExport] = useState(0);
  const [isExport, setIsExport] = useState(false);
  const [successExport, setSuccessExport] = useState(false);
  const [isCreateVideo, setIsCreateVideo] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [typeExport, setTypeExport] = useState(".mp4");
  const container = useRef(null);
  const [cesdk, setCesdk] = useState(null);
  const initialized = useRef(false);
  const [scriptsNewImage, setScriptsNewImage] = useState(
    scripts.map(() => ({ newImageContent: "" }))
  );
  const [settingSubtitle, setSettingSubtitle] = useState({
    fontFamily: "Arial",
    fontSize: 40,
    color: "#ffffff",
    shadow: false,
    shadowColor: "#ffffff",
  });
  const [infoExport, setInfoExport] = useState({
    name: "",
    workspace: dataVideo.workspace[0].name,
  });
  const BACKEND_URL = "http://127.0.0.1:5000/api";

  // useEffect(() => {
  //   fetchImages();
  // }, []);
  useEffect(() => {
    if (accessToken) {
      console.log("Token nhận được:", accessToken);
    }
  }, []);
  useEffect(() => {
    if (currentStep !== 3) return;
    if (!container.current || initialized.current) return;

    initialized.current = true;

    const timeout = setTimeout(async () => {
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
      await instance.engine.scene.createFromVideo(
        "http://localhost:5000/videos/text_video.mp4"
      );

      setCesdk(instance);
    }, 0);

    return () => clearTimeout(timeout);
  }, [currentStep]);
  useEffect(() => {
    if (!isCreateVideo || progressStep2to3 >= 100) return;

    const interval = setInterval(() => {
      setProgressStep2to3((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isCreateVideo, progressStep2to3]);
  const fetchImages = () => {
    fetch(`${BACKEND_URL}/get_images`)
      .then((res) => res.json())
      .then((data) => {
        setImageList(data.images);
      })
      .catch((err) => console.error("Lỗi lấy ảnh:", err));
  };
  const progressStep1to2 = Math.min(
    Math.round((generatedImages / totalImages) * 100),
    100
  );
  const handleNewImageContentChange = (index, value) => {
    setScriptsNewImage((prev) => {
      const updatedScripts = [...prev];
      if (!updatedScripts[index]) {
        updatedScripts[index] = {};
      }
      updatedScripts[index].newImageContent = value;
      return updatedScripts;
    });
  };
  const handleSubmitChangeImage = async (index) => {
    try {
      setIsRenderImage(true);
      const content = scriptsNewImage[index].newImageContent;
      console.log(content);
      const response = await fetch(`${BACKEND_URL}/regenerate_image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script: content,
          filename: `image_${index}.png`,
          type: typeDrawing,
        }),
      });
    } catch (error) {
      console.error("Lỗi gọi API:", error);
    } finally {
      setIsRenderImage(false);
      setTimestamp(Date.now());
      fetchImages();
    }
  };
  const getTrackStyle = (value, min, max) => {
    const percent = ((value - min) / (max - min)) * 100;
    return {
      "--track-bg": `linear-gradient(to right,rgb(94, 44, 143) ${percent}%, #89b5ea ${percent}%)`,
    };
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };
  const handleFile = (file) => {
    handleUpload(file);
    const isValid =
      file &&
      ["audio/mp3", "audio/mpeg", "audio/wav"].includes(file.type) &&
      file.size <= 50 * 1024 * 1024;
    if (!isValid) {
      alert("Vui lòng chọn file .mp3 hoặc .wav nhỏ hơn 50MB");
      return;
    }
    setFile(file);
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };
  const handleSplit = () => {
    if (!isSplitView) {
      const lines = script
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");
      setScripts(lines);
      setIsSplitView(true);
    } else {
      // Gộp đoạn
      const joined = scripts.join("\n");
      setScript(joined);
      setIsSplitView(false);
    }
  };
  const handleDelete = (indexToDelete) => {
    setScripts(scripts.filter((_, index) => index !== indexToDelete));
  };
  const handleEdit = (index, newText) => {
    const updated = [...scripts];
    updated[index] = newText;
    setScripts(updated);
  };
  const handleAddScript = () => {
    setScripts([...scripts, ""]);
  };
  const handleInputChange = (e) => {
    setIsLoadingSuggestion(true);
    const value = e.target.value;
    setInputValue(value);
    setPrompt(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleChange(value);
    }, 2000);
  };
  const handleChange = async (value, ep) => {
    try {
      ep = ep ?? "youtube";
      setIsLoadingSuggestion(true);
      const prompt =
        ep === "ai"
          ? `Hãy trả về duy nhất 6 dòng (không số thứ tự, mỗi dòng khoảng 5 từ) liên quan đến chủ đề: ${value}`
          : value;

      const response = await fetch(`${BACKEND_URL}/${ep}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      let suggestions = [];

      const data = await response.json();
      if (ep === "ai") {
        suggestions = data.results
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "");
      } else {
        suggestions = data.results;
      }

      setSuggestions(suggestions);
    } catch (error) {
      console.error("Lỗi gọi API:", error);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };
  const handleGenerate = async () => {
    try {
      setIsLoadingScripts(true);
      const enhancedPrompt =
        "Sử dụng Tiếng Việt, hãy viết một kịch bản truyện ngắn (khoảng 200 từ) với gợi ý: " +
        prompt +
        ". Kịch bản phải chia thành đúng 6 đoạn văn, không đánh số thứ tự, mỗi đoạn cách nhau bằng một dòng trống, không được đưa nội dung ngoài truyện, viết số bằng chữ số.";

      const response = await fetch(`${BACKEND_URL}/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: enhancedPrompt }),
      });

      const data = await response.json();
      setScript(data.results);

      const lines = data.results
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");
      setScripts(lines);
    } catch (error) {
      console.error("Lỗi gọi API:", error);
    } finally {
      setIsLoadingScripts(false);
    }
  };
  const handleUpload = (file) => {
    if (!file) {
      console.warn("Không tìm thấy file để upload.");
      return;
    }

    setFile(file);
    const url = URL.createObjectURL(file);
    setBackgroundSrc(url);

    const formData = new FormData();
    formData.append("file", file);

    fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Upload thành công:", data);
      })
      .catch((err) => {
        console.error("Lỗi khi upload:", err);
      });
  };
  const handleNextStep = async () => {
    try {
      setIsGenerating(true);
      setGeneratedImages(0);
      const response = await fetch(`${BACKEND_URL}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list: scripts,
          type: typeDrawing,
        }),
      });
      const result = await response.json();
      console.log("Response fron server:", result.status);

      const interval = setInterval(async () => {
        const res = await fetch(`${BACKEND_URL}/image_count`);
        const data = await res.json();
        setGeneratedImages(data.count);

        if (data.count >= totalImages) {
          clearInterval(interval);
          setIsGenerating(false);
          setCurrentStep(2);
        }
      }, 10000);
    } catch (error) {
      console.error("Lỗi gọi API:", error);
    }
  };
  const handleCreateVide0 = async () => {
    try {
      setIsCreateVideo(true);
      const response = await fetch(`http://127.0.0.1:5000/api/generate_video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scripts: [...scripts],
          filename: "text_video.mp4",
          settingSubtitle: settingSubtitle,
        }),
      });
    } catch (error) {
      console.error("Lỗi gọi API:", error);
    } finally {
      setCurrentStep(3);
    }
  };
  const handleUploadImage = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file, `image_${index}.png`);

    try {
      const res = await fetch(`${BACKEND_URL}/upload_image`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      console.log("Upload thành công:", result);

      // Reload ảnh mới
      setTimestamp(Date.now());
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
    } finally {
      fetchImages();
    }
  };
  const handleGenerateAudio = async () => {
    try {
      setIsLoadingAudio(true);
      console.log(scripts);

      const fullText = scripts.join(" ");
      console.log(fullText);

      const response = await fetch(`${BACKEND_URL}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: fullText,
          gender: "male",
          rate: `${speed - 1 >= 0 ? "+" : "-"}${Math.round(
            Math.abs((speed - 1) * 200)
          )}%`,
          volume: `${volume - 50 >= 0 ? "+" : "-"}${Math.round(
            Math.abs(volume - 50)
          )}%`,
          pitch: `${pitch - 1 >= 0 ? "+" : "-"}${Math.round(
            Math.abs((pitch - 1) * 100)
          )}Hz`,
        }),
      });

      const data = await response.json();
      console.log(data);
      console.log(data.url);

      if (data?.url) {
        setAudioSrc(data.url);
        setShowPlayer(true);
      }
    } catch (error) {
      console.error("Lỗi tạo audio:", error);
    } finally {
      setIsLoadingAudio(false);
    }
  };
  const handleUpVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };
  const handleChangeSubtitle = (key, value) => {
    setSettingSubtitle((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleExport = async () => {
    if (!cesdk) {
      console.log("Thua");
      return;
    }

    try {
      const page = cesdk.engine.scene.getCurrentPage();
      setIsExport(true);
      const videoOptions = {
        mimeType: "video/mp4",
        onProgress: (renderedFrames, encodedFrames, totalFrames) => {
          const percent = ((encodedFrames / totalFrames) * 100).toFixed(2);
          setProgessExport(percent);
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
        const formData = new FormData();
        formData.append("video", blob, infoExport.name);

        const response = await fetch("http://localhost:5000/api/export", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log("Upload result:", result);
        handleAddVideo();
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement("a");
        // a.href = url;
        // a.download = "exported_video.mp4";
        // a.click();
      } else {
        console.error("Export failed: No valid Blob returned");
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExport(false);
      setSuccessExport(true);
    }
  };
  const handleAddVideo = async () => {
    try {
      const newItem = {
        title: infoExport.name,
        created: new Date().toLocaleDateString("vi-VN"),
      };
      const response = await fetch(`${BACKEND_URL}/workspaces/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: newItem,
          workspace: infoExport.workspace,
        }),
      });
    } catch {
      console.log("Thêm item Thất bại!");
    }
  };
  const handleGoHome = () => {
    navigate("/homepage", {
      state: {
        user,
        showPopupShare: true,
        videoToShare: infoExport.name,
        accessToken: accessToken,
      },
    });
  };
  const downloadVideo = async (videoTitle) => {
    try {
      const response = await fetch(
        `http://localhost:5000/videos/${videoTitle}.mp4`
      );
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${videoTitle}.mp4`;
      document.body.appendChild(a); // cần thiết với Firefox
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // dọn dẹp URL sau khi xong
    } catch (err) {
      console.error("Lỗi khi tải video:", err);
      alert("Không thể tải video. Vui lòng thử lại.");
    }
  };
  const p = Math.min(Math.round((generatedImages / totalImages) * 100), 100);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="workspace-container">
        <nav className="workspace-navbar">
          <div className="workspace-logo">
            <div className="workspace-logo-img">
              <img
                src={puddingIcon}
                alt="Pudding..."
                className="image-icon-big"
                style={{ width: "40px", height: "40px" }}
              />
            </div>
            <div className="workspace-logo-text">min.ai</div>
          </div>

          <div className="workspace-feature">
            {feature.map((opt, index) => (
              <a
                key={index}
                className={`option ${
                  selectedFeature === index ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedFeature(index);
                  navigate(`${mapFeature[opt]}`, {
                    state: {
                      accessToken: accessToken,
                      user: {
                        name: user.name,
                        picture: user.picture,
                      },
                    },
                  });
                }}
              >
                {opt}
              </a>
            ))}
            <div
              className="underline"
              style={{
                left: `${40 + selectedFeature * 6.8}%`,
              }}
            />
          </div>

          <div className="workspace-login-registry">
            {user && (
              <div className="workspace-user-profile">
                <img src={imgUser} alt="avatar" className="workspace-avatar" />
                <span className="workspace-username">{user.name}</span>
                <img
                  src={downarrowIcon}
                  alt="More options"
                  className="workspace-option-btn"
                />
              </div>
            )}
          </div>
        </nav>

        <div className="workspace-main">
          {currentStep != 3 && (
            <div className="stepper">
              <div className={`step ${currentStep == 1 ? "active" : "done"}`}>
                <div className="circle">{currentStep > 1 ? "✓" : "1"}</div>
                <div className="label">Sinh kịch bản và giọng nói</div>
              </div>

              <div className="connector">
                <div
                  className={`connector-fill ${
                    isGenerating
                      ? "active"
                      : progressStep1to2 >= 100
                      ? "done"
                      : ""
                  }`}
                  style={{
                    width: `${progressStep1to2}%`,
                    background: "linear-gradient(90deg, #a1ada6, #42c5cf)",
                  }}
                ></div>
                {isGenerating && (
                  <div className="progress-container">
                    <div className="progress-label">
                      <div className="spinner" />
                      Đang khởi tạo tài nguyên:
                      <div
                        style={{
                          marginLeft: "5px",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                      >
                        {generatedImages}/{totalImages}
                      </div>
                    </div>
                  </div>
                )}
                {!isGenerating &&
                  generatedImages >= totalImages &&
                  generatedImages != 0 && (
                    <div className="progress-label complete">Hoàn thành</div>
                  )}
              </div>

              <div
                className={`step ${
                  currentStep == 2 ? "active" : currentStep > 2 ? "done" : ""
                }`}
              >
                <div className="circle">{currentStep > 2 ? "✓" : "2"}</div>
                <div className="label">Xử lý tạo video</div>
              </div>

              <div className="connector">
                <div
                  className={`connector-fill ${
                    progressStep2to3 < 100 ? "active" : "done"
                  }`}
                  style={{
                    width: `${progressStep2to3}%`,
                    background: "linear-gradient(90deg, #a1ada6, #42c5cf)",
                  }}
                ></div>
                {isCreateVideo && (
                  <div className="progress-container">
                    <div className="progress-label">
                      <div className="spinner" />
                      Đang khởi tạo tài nguyên:
                      <div
                        style={{
                          marginLeft: "5px",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                      >
                        {progressStep2to3}%
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`step ${
                  currentStep == 3 && progressStep2to3 == 100
                    ? "active"
                    : doneCreate
                    ? "done"
                    : ""
                }`}
              >
                <div className="circle">{doneCreate == 100 ? "✓" : "3"}</div>
                <div className="label">Điều chỉnh, phân loại</div>
              </div>
            </div>
          )}
          {currentStep == 1 && (
            <div>
              <div className="create-scripts-and-voices">
                <div className="create-scripts">
                  <div className="label-main">
                    <div className="label-main-label">Sinh kịch bản video</div>
                    <img className="label-main-img" src={scriptsIcon} alt="" />
                  </div>
                  <div className="description-main">
                    Nhập chủ đề hoặc chọn từ danh sách gợi ý để sinh kịch bản
                  </div>
                  <div className="label-small">Chủ đề kịch bản</div>
                  <div className="scripts-in">
                    <textarea
                      className="scripts-input"
                      onChange={(e) => setPrompt(e.target.value)}
                      onBlur={handleInputChange}
                      value={prompt}
                      placeholder="Nhập kịch bản để sinh chủ đề"
                    />
                    <button
                      className="create-scripts-btn"
                      onClick={handleGenerate}
                    >
                      <img
                        className="magicIcon"
                        src={magicIcon}
                        alt="Generate"
                      />
                      Tạo kịch bản
                    </button>
                  </div>
                  <div className="sug">
                    <div className="label-small">Gợi ý thông minh từ:</div>
                    <div className="tab-container">
                      {["YouTube", "Google", "AI"].map((label) => (
                        <button
                          key={label}
                          className={`tab-button ${
                            typeSelected === label ? "active" : ""
                          }`}
                          onClick={() => {
                            setTypeSelected(label);
                            const ep = label.toLowerCase();
                            handleChange(inputValue, ep);
                          }}
                        >
                          <img
                            src={iconMap[label]}
                            alt={`${label} icon`}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "7px",
                            }}
                          />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {isLoadingSuggestion && (
                    <div className="sug-area">
                      <img src={bulbIcon} alt="" className="bulb-icon" />
                      <div style={{ color: "white" }}>
                        Đang tìm kiếm gợi ý từ: {typeSelected}
                      </div>
                    </div>
                  )}

                  {!isLoadingSuggestion && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: "15px",
                      }}
                    >
                      {suggestions.map((item, index) => (
                        <div
                          className="suggested-div"
                          key={index}
                          onClick={() => setPrompt(item)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="label-small">Phong cách nội dung</div>
                  <div className="dropdown-wrapper">
                    <select
                      className="custom-dropdown"
                      onChange={(e) => setTypeDrawing(e.target.value)}
                    >
                      <option value="">Mặc định</option>
                      {contentTypeImage.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="label-small">Giới hạn từ kịch bản</div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      className="inputNumber first"
                      defaultValue={200}
                      readOnly
                    />
                    <div
                      style={{
                        marginLeft: "10px",
                        color: "gray",
                        fontSize: "15px",
                      }}
                    >
                      từ
                    </div>
                  </div>
                  <div className="label-small">Kịch bản được tạo</div>

                  {!isSplitView ? (
                    <>
                      <textarea
                        className="script-textarea"
                        value={script}
                        onChange={(e) => {
                          const value = e.target.value;
                          setScript(value);
                          console.log(script);
                        }}
                        rows={6}
                        style={{ width: "100%", height: "400px" }}
                      />
                      {isLoadingScripts && (
                        <div className="script-container">
                          <img src={robotIcon} alt="" className="robot-icon" />
                          <div className="des-scripts">
                            <div className="spinner" />
                            <div style={{ opacity: "0.6", color: "white" }}>
                              Đang khởi tạo kịch bản
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="script-list">
                        {scripts.map((script, index) => (
                          <div key={index} className="script-item">
                            <textarea
                              className="script-textarea"
                              value={script}
                              onChange={(e) => {
                                handleEdit(index, e.target.value);
                              }}
                              rows={1}
                            />
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(index)}
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                        <button
                          className="add-script-btn"
                          onClick={handleAddScript}
                        >
                          + Thêm đoạn mới
                        </button>
                      </div>
                    </>
                  )}
                  <button className="split-btn" onClick={handleSplit}>
                    {isSplitView ? "🔗 Gộp đoạn" : "✂️ Tách đoạn"}
                  </button>
                </div>
                <div className="create-voices">
                  <div className="label-main">
                    <div className="label-main-label">Cấu hình giọng nói</div>
                    <img className="label-main-img" src={audioIcon} alt="" />
                  </div>
                  <div className="description-main">
                    Lựa chọn và tùy chỉnh giọng nói cho video của bạn
                  </div>
                  <div className="voice-toggle-wrapper">
                    <div
                      className={`voice-tab ${
                        selected === "ai" ? "active" : ""
                      }`}
                      onClick={() => setSelected("ai")}
                    >
                      Giọng nói AI
                    </div>
                    <div
                      className={`voice-tab ${
                        selected === "human" ? "active" : ""
                      }`}
                      onClick={() => setSelected("human")}
                    >
                      Giọng người thật
                    </div>
                  </div>

                  {selected === "ai" && (
                    <div className="voice-content">
                      <div className="label-small">Giọng đọc</div>
                      <div className="dropdown-wrapper">
                        <select
                          className="custom-dropdown"
                          onChange={(e) =>
                            console.log("Gợi ý đã chọn:", e.target.value)
                          }
                        >
                          {voiceType.map((s, i) => (
                            <option key={i} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="slider-group">
                        <div className="slider-item">
                          <div className="label-small">
                            Tốc độ đọc{" "}
                            <span className="slider-value">
                              {speed.toFixed(2)}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.01"
                            value={speed}
                            onChange={(e) =>
                              setSpeed(parseFloat(e.target.value))
                            }
                            style={getTrackStyle(speed, 0.5, 2)}
                          />
                        </div>

                        <div className="slider-item">
                          <div className="label-small">
                            Âm điệu{" "}
                            <span className="slider-value">
                              {pitch.toFixed(2)}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.01"
                            value={pitch}
                            onChange={(e) =>
                              setPitch(parseFloat(e.target.value))
                            }
                            style={getTrackStyle(pitch, 0.5, 2)}
                          />
                        </div>

                        <div className="slider-item">
                          <div className="label-small">
                            Âm lượng{" "}
                            <span className="slider-value">{volume}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.5"
                            value={volume}
                            onChange={(e) =>
                              setVolume(parseInt(e.target.value))
                            }
                            style={getTrackStyle(volume, 0, 100)}
                          />
                        </div>
                      </div>

                      <div className="label-small">Thông tin âm thanh</div>
                      {!showPlayer && (
                        <div
                          className="voice-area"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignContent: "center",
                          }}
                        >
                          <div style={{ color: "white", fontSize: "0.95rem" }}>
                            Hiện tại chưa có âm thanh chưa được tạo cho video
                            của bạn, vui lòng nhấn nút "Tạo âm thanh" để xuất
                            bản.
                          </div>
                          {!isLoadingAudio && (
                            <button
                              className="create-voice-btn shit"
                              onClick={handleGenerateAudio}
                            >
                              <img
                                src={voiceIcon}
                                alt=""
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  filter: "brightness(0) invert(1)",
                                }}
                              />
                              Tạo âm thanh
                            </button>
                          )}
                          {isLoadingAudio && (
                            <button className="create-voice-btn loading">
                              <div className="spinner" />
                              Đang khởi tạo tài nguyên âm thanh
                            </button>
                          )}
                        </div>
                      )}

                      {showPlayer && (
                        <div
                          className="voice-area"
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.95rem",
                              marginBottom: "5px",
                            }}
                          >
                            Bạn có thể nghe thử âm thanh được tạo từ kịch bản đã
                            phê duyệt
                          </div>
                          <div className="info-of-audio">
                            <div className="block-of-item-audio">
                              <div className="item-audio-1">Số lượng từ: </div>
                              <div className="item-audio-2">230</div>
                            </div>
                            <div className="block-of-item-audio">
                              <div className="item-audio-1">Giọng đọc: </div>
                              <div className="item-audio-2">Nam</div>
                            </div>
                          </div>
                          <audio
                            controls
                            src={audioSrc}
                            style={{
                              width: "100%",
                            }}
                          />
                          <div className="audio-option">
                            <button
                              className="create-voice-btn"
                              onClick={handleGenerateAudio}
                            >
                              <img
                                src={reloadIcon}
                                alt=""
                                className="reload-icon"
                              />
                              Khởi tạo lại
                            </button>
                          </div>
                        </div>
                      )}

                      {/* {!file && (
                      <div
                        className="upload-background-audio"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current.click()}
                      >
                        <div className="upload-icon">⬆</div>
                        <div className="upload-text">
                          Nhấp để tải lên hoặc kéo và thả file <b>.mp3</b>,{" "}
                          <b>.wav</b>
                        </div>
                        <div className="upload-subtext">
                          Kích thước tối đa: 50MB
                        </div>

                        <input
                          ref={inputRef}
                          type="file"
                          accept=".mp3, .wav"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </div>
                    )}
                    {file && (
                      <>
                        <div className="background-audio-area">
                          <audio
                            controls
                            src={backgroundSrc}
                            style={{
                              width: "95%",
                              marginLeft: "20px",
                              marginBottom: "10px",
                            }}
                          />
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: "14px",
                              color: "#444",
                            }}
                          >
                            🎵 Đã chọn: <b>{file.name}</b>
                          </div>
                        </div>
                      </>
                    )} */}
                    </div>
                  )}
                  {selected === "human" && (
                    <div className="voice-content">
                      <div className="label-small">Tải lên file giọng đọc</div>
                      <div
                        className="upload-container"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current.click()}
                      >
                        <div className="upload-icon">⬆</div>
                        <div className="upload-text">
                          Nhấp để tải lên hoặc kéo và thả file <b>.mp3</b>,{" "}
                          <b>.wav</b>
                        </div>
                        <div className="upload-subtext">
                          Kích thước tối đa: 50MB
                        </div>
                        <input
                          ref={inputRef}
                          type="file"
                          accept=".mp3, .wav"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                        {file && (
                          <div className="upload-result">
                            ✅ Đã chọn: <b>{file.name}</b>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="next-step">
                {!isGenerating && (
                  <button className="next-step-btn" onClick={handleNextStep}>
                    <img
                      src={rightarrowIcon}
                      alt=""
                      style={{ width: "15px", height: "15px" }}
                    />
                    Tiếp tục
                  </button>
                )}
                {isGenerating && (
                  <button
                    className="next-step-btn loading"
                    onClick={handleNextStep}
                  >
                    <div className="spinner" />
                    Đang khởi tạo tài nguyên
                  </button>
                )}
              </div>
            </div>
          )}
          {currentStep == 2 && (
            <>
              <div className="resource-video">
                <div style={{ display: "flex" }}>
                  <div className="label-main-label">Tùy chỉnh phụ đề</div>
                  <label className="tick-switch">
                    <input
                      type="checkbox"
                      checked={isSubtitles}
                      onChange={(e) => setIsSubtitles(e.target.checked)}
                    />
                    <span className="tick-slider" />
                  </label>
                </div>
                <div style={{ opacity: "0.6", color: "white" }}>
                  Cấu hình cách mà phụ đề hiển thị trong video
                </div>
                {isSubtitles && (
                  <>
                    <div className="font-and-size">
                      <div>
                        <div className="label-small">Font chữ</div>
                        <div className="dropdown-wrapper">
                          <select
                            className="custom-dropdown font"
                            value={settingSubtitle.fontFamily}
                            onChange={(e) =>
                              handleChangeSubtitle("fontFamily", e.target.value)
                            }
                          >
                            {fonts.map((s, i) => (
                              <option key={i} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="label-small">Cỡ chữ</div>
                        <div className="dropdown-wrapper">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={settingSubtitle.fontSize}
                            onChange={(e) =>
                              handleChangeSubtitle(
                                "fontSize",
                                parseInt(e.target.value)
                              )
                            }
                            className="inputNumber font"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="label-small">Màu chữ</div>
                        <div style={{ display: "flex" }}>
                          <input
                            type="color"
                            className="color-lines"
                            value={settingSubtitle.color}
                            onChange={(e) =>
                              handleChangeSubtitle("color", e.target.value)
                            }
                          />
                          <div className="inputNumber color">
                            {settingSubtitle.color.toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div style={{ display: "flex" }}>
                            <div className="label-small shadow">Đổ bóng</div>
                            <label className="tick-switch">
                              <input
                                type="checkbox"
                                checked={settingSubtitle.stroke}
                                onChange={(e) =>
                                  handleChangeSubtitle(
                                    "shadow",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="tick-slider" />
                            </label>
                          </div>
                          {settingSubtitle.shadow && (
                            <div style={{ display: "flex" }}>
                              <input
                                type="color"
                                className="color-lines"
                                value={settingSubtitle.shadowColor}
                                onChange={(e) =>
                                  handleChangeSubtitle(
                                    "shadowColor",
                                    e.target.value
                                  )
                                }
                              />
                              <div className="inputNumber color">
                                {settingSubtitle.shadowColor.toUpperCase()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className="model-subtitle"
                        style={{
                          fontFamily: settingSubtitle.fontFamily,
                          fontSize: `${settingSubtitle.fontSize}px`,
                          color: settingSubtitle.color,
                          textShadow: settingSubtitle.shadow
                            ? `2px 2px 4px ${settingSubtitle.shadowColor}` // bạn có thể tùy chỉnh
                            : "none",
                        }}
                      >
                        Đây là bản xem trước phụ đề
                      </div>
                    </div>
                  </>
                )}

                {!isSubtitles && (
                  <div style={{ color: "white", marginTop: "10px" }}>
                    Bạn lựa chọn không hiển thị phụ đề trong video của mình
                  </div>
                )}
              </div>
              <div className="resource-video">
                <div className="label-main-label">
                  Danh sách tài nguyên hình ảnh
                </div>
                <div style={{ opacity: "0.6", color: "white" }}>
                  Chỉnh sửa nội dung hình ảnh cho từng đoạn tài nguyên
                </div>
                {scripts.map((script, index) => (
                  <div key={index} style={{ marginBottom: "40px" }}>
                    <div className="label-small" style={{ marginLeft: "70px" }}>
                      Tài nguyên {index + 1}
                    </div>

                    <div className="block-of-resource">
                      <div className="block-of-resource-small">
                        <div className="img-resource">
                          <img
                            src={`http://127.0.0.1:5000/image/image_${index}.png?t=${timestamp}`}
                            alt=""
                            className={`img-detail ${index}`}
                          />
                        </div>

                        <div className="script-resource">
                          <div>
                            <div className="label-small">Nội dung</div>
                            <textarea
                              className="script-detail"
                              defaultValue={script}
                            />

                            {isChangingImage && index == indexSuggestion && (
                              <div>
                                <div className="label-small">
                                  Nội dung ảnh thay đổi
                                </div>
                                <textarea
                                  className="script-for-new-img"
                                  value={script.newImageContent}
                                  onChange={(e) =>
                                    handleNewImageContentChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>

                          <div className="img-resource-btn">
                            <input
                              type="file"
                              accept="image/*"
                              id={`upload-${index}`}
                              style={{ display: "none" }}
                              onChange={(e) => handleUploadImage(e, index)}
                            />

                            <button
                              className="btn-for-img"
                              onClick={() =>
                                document
                                  .getElementById(`upload-${index}`)
                                  .click()
                              }
                            >
                              <img
                                src={uploadIcon}
                                className="btn-for-img-res"
                              />
                            </button>
                            <button
                              className="btn-for-img"
                              onClick={() => {
                                setIsChangingImage(true);
                                setIndexSuggestion(index);
                              }}
                            >
                              <img
                                src={regenerateIcon}
                                className="btn-for-img-res"
                              />
                            </button>

                            {isChangingImage && index == indexSuggestion && (
                              <>
                                {!isRenderImage && (
                                  <button
                                    className="submit-change-img"
                                    onClick={() =>
                                      handleSubmitChangeImage(index)
                                    }
                                  >
                                    Thay đổi
                                  </button>
                                )}
                                {isRenderImage && (
                                  <button
                                    className="submit-change-img"
                                    onClick={() =>
                                      handleSubmitChangeImage(index)
                                    }
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div className="spinner" />
                                    Đang tạo tài nguyên
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!isCreateVideo && (
                  <button
                    className="create-voice-btn"
                    style={{
                      marginLeft: "1550px",
                    }}
                    onClick={handleCreateVide0}
                  >
                    <img src={scriptsIcon} className="image-icon export" />
                    <div style={{ marginLeft: "10px" }}>Khởi tạo video</div>
                  </button>
                )}
                {isCreateVideo && (
                  <button
                    className="create-voice-btn loading"
                    style={{
                      marginLeft: "1400px",
                    }}
                  >
                    <div className="spinner" />
                    <div>Đang khởi tạo tài nguyên video</div>
                  </button>
                )}
              </div>
            </>
          )}
          {currentStep == 3 && (
            <div>
              <div className="editor-workspace">
                <div
                  className="imgly"
                  ref={container}
                  style={{ height: "1117px" }}
                />
                <div className="handle-export">
                  {/* <button onClick={handleExport} disabled={!cesdk} className="">
                  Export Video
                </button> */}
                  <div className="label-small">Cấu hình lưu trữ</div>
                  <div className="saving-setting">
                    <div className="label-small export">Tên video</div>
                    <div className="dropdown-wrapper file-name">
                      <input
                        type="text"
                        className="inputNumber folder"
                        placeholder="Nhập tên file"
                        value={infoExport["name"]}
                        onChange={(e) =>
                          setInfoExport({ ...infoExport, name: e.target.value })
                        }
                      />
                      <div
                        style={{
                          marginLeft: "10px",
                          color: "gray",
                          fontSize: "15px",
                        }}
                      >
                        {typeExport}
                      </div>
                    </div>
                    <div className="label-small export">Workspace lưu trữ</div>
                    <div className="dropdown-wrapper folder">
                      <select
                        className="custom-dropdown"
                        value={infoExport.workspace}
                        onChange={(e) =>
                          setInfoExport({
                            ...infoExport,
                            workspace: e.target.value,
                          })
                        }
                      >
                        {dataVideo.workspace.map((s, i) => (
                          <option key={i} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="label-small">Cấu hình xuất video</div>
                  <div className="saving-setting">
                    <div className="label-small export">Chất lượng video</div>
                    <div className="dropdown-wrapper folder">
                      <select className="custom-dropdown">
                        {quality.map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="label-small export">Định dạng</div>
                    <div className="dropdown-wrapper folder">
                      <select
                        className="custom-dropdown"
                        onChange={(e) => setTypeExport(e.target.value)}
                      >
                        {typeFile.map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="label-small export">FPS</div>
                    <div className="dropdown-wrapper folder">
                      <select className="custom-dropdown">
                        {fps.map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {!isExport && (
                    <button className="export-video-btn" onClick={handleExport}>
                      <img src={exportIcon} className="image-icon export" />
                      Xuất bản video
                    </button>
                  )}
                  {isExport && (
                    <>
                      <button
                        className="export-video-btn"
                        onClick={handleExport}
                      >
                        <div className="spinner" />
                        {progessExport}%
                      </button>
                      <div className="description-export">
                        Sau khi xuất bản video, bạn sẽ có quyền chia sẻ video
                        này trên nền tảng Youtube, chúng tôi sẽ thông báo cho
                        bạn ngay sau khi việc xuất bản thành công!
                      </div>
                    </>
                  )}
                </div>
              </div>
              {successExport && (
                <div className="popup-overlay">
                  <div className="popup-content">
                    <h3 className="label-main-label">
                      Xuất bản video thành công!
                    </h3>
                    <p>Bạn muốn làm gì tiếp theo?</p>
                    <div className="popup-buttons">
                      <div className="saving-setting btn">
                        <button onClick={handleGoHome}>
                          <img
                            src={homepageIcon}
                            className="image-icon-medium mystery"
                          />{" "}
                          <div>Về trang chủ</div>
                        </button>
                      </div>
                      <div className="saving-setting btn">
                        <button onClick={() => downloadVideo(infoExport.name)}>
                          <img
                            src={downloadIcon}
                            className="image-icon-medium mystery"
                          />{" "}
                          Tải xuống
                        </button>
                      </div>
                      <div className="saving-setting btn">
                        <button onClick={handleGoHome}>
                          <img
                            src={shareIcon}
                            className="image-icon-medium mystery"
                          />{" "}
                          Chia sẻ Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
