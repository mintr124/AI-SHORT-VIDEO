import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import "./Page.css";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  puddingIcon,
  downarrowIcon,
  homepageIcon,
  videoIcon,
  analyzeIcon,
  youtubeIcon,
  profileIcon,
  eyeIcon,
  plusIcon,
  trashIcon,
  downloadIcon,
  shareIcon,
  folderIcon,
  commentIcon,
  likeIcon,
  cancelIcon,
  picture,
} from "../assets/icons";
import {
  // dataForBackend,
  videoData,
  contentType,
  rangeLabels,
  tabs,
  COLORS,
  feature,
  clientId,
  mapFeature,
  imgUser,
} from "../data/constants";
import dataVideo from "../../../backend/app/db/workspace/video_data.json";

export default function Home() {
  // const youtubeStats = [
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2024-11-26T11:36:46Z",
  //     thumbnail: "https://i.ytimg.com/vi/fu7hulbGaSE/maxresdefault.jpg",
  //     title: "22120212-W07-Sqlite+Room",
  //     url: "https://www.youtube.com/watch?v=fu7hulbGaSE",
  //     views: "4",
  //   },
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2024-11-19T12:57:19Z",
  //     thumbnail: "https://i.ytimg.com/vi/9YEOyT5QEAs/maxresdefault.jpg",
  //     title: "22120212-W06-Realm+WebView.",
  //     url: "https://www.youtube.com/watch?v=9YEOyT5QEAs",
  //     views: "8",
  //   },
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2024-11-05T13:08:50Z",
  //     thumbnail: "https://i.ytimg.com/vi/ziywsduXBAg/maxresdefault.jpg",
  //     title: "22120212-W05-RecyclerView",
  //     url: "https://www.youtube.com/watch?v=ziywsduXBAg",
  //     views: "6",
  //   },
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2024-10-22T12:49:16Z",
  //     thumbnail: "https://i.ytimg.com/vi/L8Qr2rlplC8/maxresdefault.jpg",
  //     title: "22120212-W04-Listview",
  //     url: "https://www.youtube.com/watch?v=L8Qr2rlplC8",
  //     views: "3",
  //   },
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2024-10-05T08:33:41Z",
  //     thumbnail: "https://i.ytimg.com/vi/8JQP0qUuquQ/maxresdefault.jpg",
  //     title: "22120212-W03-Layout.",
  //     url: "https://www.youtube.com/watch?v=8JQP0qUuquQ",
  //     views: "22",
  //   },
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2024-10-01T11:35:58Z",
  //     thumbnail: "https://i.ytimg.com/vi/jSq6lNGsBHA/maxresdefault.jpg",
  //     title: "22120212-W02-ActivityNFragment",
  //     url: "https://www.youtube.com/watch?v=jSq6lNGsBHA",
  //     views: "34",
  //   },
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2024-10-01T11:31:30Z",
  //     thumbnail: "https://i.ytimg.com/vi/4PoSCXf2WYs/maxresdefault.jpg",
  //     title: "22120212-W02-LocalizationApp",
  //     url: "https://www.youtube.com/watch?v=4PoSCXf2WYs",
  //     views: "7",
  //   },
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2024-10-01T11:28:09Z",
  //     thumbnail: "https://i.ytimg.com/vi/JdPAoc57LCw/maxresdefault.jpg",
  //     title: "22120212-W02-CurrencyConverter",
  //     url: "https://www.youtube.com/watch?v=JdPAoc57LCw",
  //     views: "27",
  //   },
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2024-09-24T12:59:45Z",
  //     thumbnail: "https://i.ytimg.com/vi/FKyFwLYA5Yw/maxresdefault.jpg",
  //     title: "22120212-W01-Homework2",
  //     url: "https://www.youtube.com/watch?v=FKyFwLYA5Yw",
  //     views: "29",
  //   },
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2024-09-24T12:49:43Z",
  //     thumbnail: "https://i.ytimg.com/vi/LcXoZkCJKEs/maxresdefault.jpg",
  //     title: "22120212-W01-Homework1",
  //     url: "https://www.youtube.com/watch?v=LcXoZkCJKEs",
  //     views: "32",
  //   },
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2024-07-23T04:27:35Z",
  //     thumbnail: "https://i.ytimg.com/vi/s94bREwzUtE/maxresdefault.jpg",
  //     title: "23 tháng 7, 2024",
  //     url: "https://www.youtube.com/watch?v=s94bREwzUtE",
  //     views: "6",
  //   },
  //   {
  //     comments: "0",
  //     likes: "0",
  //     publishedAt: "2023-05-16T06:57:49Z",
  //     thumbnail: "https://i.ytimg.com/vi/3juyKpOVtDA/maxresdefault.jpg",
  //     title: "346513216 6432845253475274 4810593865337322834 n",
  //     url: "https://www.youtube.com/watch?v=3juyKpOVtDA",
  //     views: "11",
  //   },
  // ];
  const location = useLocation();
  const navigate = useNavigate();
  const { user, accessToken } = location.state || {};
  const [activeTab, setActiveTab] = useState("Workspace");
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [showPopupWorkspace, setShowPopupWorkspace] = useState(false);
  const [showPopupShare, setShowPopupShare] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(null);
  const [nameFolder, setNameFolder] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [youtubeStats, setYoutubeStats] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [totalYoutubeViews, setTotalYoutubeViews] = useState(0);
  const [totalYoutubeComments, setTotalYoutubeComments] = useState(0);
  const [totalYoutubeLikes, setTotalYoutubeLikes] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState(30);
  const [dataForAnalysis, setDataForAnalysis] = useState([]);
  const [dataForBackend, setDataForBackend] = useState([]);
  const [videoToShare, setVideoToShare] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [typeDrawing, setTypeDrawing] = useState(
    "Thống kê lượt xem theo thời gian"
  );
  const keys =
    dataForAnalysis.length > 0
      ? Object.keys(dataForAnalysis[0]).filter((k) => k !== "date")
      : [];
  const allWorkspaceVideos = dataVideo.workspace.flatMap(
    (folder) => folder.items
  );
  const stats = [
    {
      title: "Số người đăng ký",
      value: subscriberCount,
      suffix: "người",
      icon: profileIcon,
    },
    {
      title: "Tổng số video",
      value: youtubeStats.length,
      suffix: "video",
      icon: videoIcon,
    },
    {
      title: "Lượt xem",
      value: totalYoutubeViews,
      suffix: "lượt xem",
      icon: eyeIcon,
    },
    {
      title: "Bình luận",
      value: totalYoutubeComments,
      suffix: "bình luận",
      icon: commentIcon,
    },
    {
      title: "Yêu thích",
      value: totalYoutubeLikes,
      suffix: "yêu thích",
      icon: likeIcon,
    },
  ];
  const [forceRender, setForceRender] = useState(false);
  useEffect(() => {
    if (user?.picture) {
      setTimeout(() => {
        setForceRender((prev) => !prev);
      }, 500);
    }
  }, [user?.picture]);
  useEffect(() => {
    handleFetchYoutubeStats();
  }, []);
  useEffect(() => {
    if (accessToken) {
      console.log("Token nhận được:", accessToken);
    }
  }, []);
  useEffect(() => {
    const state = location.state;
    if (state?.showPopupShare && state?.videoToShare) {
      setVideoToShare(state.videoToShare);
      setShowPopupShare(true);
    }
  }, [location.state]);
  const CustomLegend = ({ payload }) => {
    return (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {payload.map((entry, index) => (
          <li
            key={`item-${index}`}
            style={{
              color: "black",
              marginBottom: 5,
              fontSize: "13px",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                backgroundColor: entry.color,
                marginRight: 8,
                borderRadius: "50%",
              }}
            ></span>
            {`${entry.payload.name}: ${entry.payload.value}`}
          </li>
        ))}
      </ul>
    );
  };
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "white",
            border: "1px solid #ccc",
            padding: "8px 12px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>{payload[0].name}</p>
          <p style={{ margin: 0 }}>Số lượng: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };
  const getTotals = (data) => {
    const workspaceTotal = (data.workspace || []).reduce(
      (acc, item) => acc + (item.items?.length || 0),
      0
    );
    let youtubeTotal = youtubeStats.length;
    return { workspaceTotal, youtubeTotal };
  };
  const { workspaceTotal, youtubeTotal } = getTotals(dataVideo);
  const data = [
    { name: "Tổng video", value: workspaceTotal + youtubeTotal },
    { name: "Video workspace", value: workspaceTotal },
    { name: "Video đã xuất bản", value: youtubeTotal },
  ];
  const getTopVideosForBackend = (youtubeStats, count) => {
    if (!Array.isArray(youtubeStats)) return [];
    const sorted = [...youtubeStats].sort(
      (a, b) => parseInt(b.views, 10) - parseInt(a.views, 10)
    );
    const topVideos = sorted.slice(0, Math.min(count, sorted.length));
    return topVideos.map((video) => ({
      name: video.title,
      views: parseInt(video.views, 10),
      created: video.publishedAt,
    }));
  };
  const top5Videos = [...youtubeStats]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  const sortedStats = [...youtubeStats].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    const isNumericField = ["views", "likes", "comments"].includes(
      sortConfig.key
    );

    const aParsed = isNumericField ? parseInt(aVal || 0) : aVal;
    const bParsed = isNumericField ? parseInt(bVal || 0) : bVal;

    if (isNumericField) {
      return sortConfig.direction === "asc"
        ? aParsed - bParsed
        : bParsed - aParsed;
    }

    return sortConfig.direction === "asc"
      ? aParsed.localeCompare(bParsed)
      : bParsed.localeCompare(aParsed);
  });
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const handleCreate = () => {
    if (!workspaceName.trim()) return alert("Tên không được để trống");

    const newWorkspace = {
      name: workspaceName,
      created: new Date().toLocaleDateString("vi-VN"),
      items: [],
    };

    fetch("http://localhost:5000/api/workspaces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWorkspace),
    })
      .then((res) => res.json())
      .then((data) => {
        setShowPopupWorkspace(false);
        setWorkspaceName("");
      })
      .catch((err) => {
        console.error("Lỗi khi thêm workspace:", err);
        alert("Thêm thất bại!");
      });
  };
  const handleFetchYoutubeStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/get_youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ handle: "tranminh7223" }), // Gửi handle YouTube
      });

      const data = await res.json();
      console.log("✅ Response từ API:", data);

      setYoutubeStats(data.videos);
      setSubscriberCount(data.subscriberCount);

      // // === Fake data ===
      // const data = youtubeStats;
      // console.log(data);
      // const totalViews = data.reduce(
      //   (sum, video) => sum + parseInt(video.views || 0),
      //   0
      // );
      // const totalComment = data.reduce(
      //   (sum, video) => sum + parseInt(video.comments || 0),
      //   0
      // );
      // const totalLike = data.reduce(
      //   (sum, video) => sum + parseInt(video.likes || 0),
      //   0
      // );
      // const dataForBack = getTopVideosForBackend(data, 3);
      // // === Fake data ===

      const totalViews = data.videos.reduce((sum, video) => {
        return sum + parseInt(video.views || 0);
      }, 0);
      const totalComment = data.videos.reduce((sum, video) => {
        return sum + parseInt(video.comments || 0);
      }, 0);
      const totalLike = data.videos.reduce((sum, video) => {
        return sum + parseInt(video.likes || 0);
      }, 0);
      setTotalYoutubeViews(totalViews);
      setTotalYoutubeComments(totalComment);
      setTotalYoutubeLikes(totalLike);
      const dataForBack = getTopVideosForBackend(data.videos, 3);
      setDataForBackend(dataForBack);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API YouTube:", err);
    }
  };
  const handleGetView = async (dataForBackend, count) => {
    try {
      const res = await fetch("http://localhost:5000/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: dataForBackend, count: count }),
      });

      const data = await res.json();
      console.log(data);
      setDataForAnalysis(data);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API YouTube:", err);
    }
  };
  const handleShareToYoutube = async () => {
    const missingFields = [];
    if (!accessToken) missingFields.push("accessToken");
    if (!videoToShare) missingFields.push("videoToShare");
    if (!title) missingFields.push("tiêu đề");
    if (!description) missingFields.push("mô tả");

    if (missingFields.length > 0) {
      alert("Thiếu thông tin: " + missingFields.join(", "));
      return;
    }

    const metadata = {
      snippet: { title, description },
      status: { privacyStatus: "public" },
    };

    try {
      const videoResponse = await fetch(
        `http://localhost:5000/videos/${videoToShare}.mp4`
      );
      if (!videoResponse.ok) throw new Error("Video fetch failed");

      const rawBlob = await videoResponse.blob();
      const videoBlob = new Blob([rawBlob], { type: "video/mp4" });

      const form = new FormData();
      form.append("metadata", JSON.stringify(metadata));
      form.append("video", videoBlob, "video.mp4");

      for (let [key, val] of form.entries()) {
        console.log(`${key}:`, val);
      }

      const res = await fetch("http://localhost:5000/api/upload-video", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      const result = await res.json();
      if (res.ok && result.success) {
        const confirmed = window.confirm(
          `✅ Đã upload thành công!\n\nBạn có muốn xem video trên YouTube không?`
        );
        if (confirmed) {
          window.open(result.youtube_url, "_blank");
        } else {
          navigate("/homepage", {
            state: { user },
          });
        }
      } else {
        console.error(result);
        alert(
          "❌ Upload lỗi: " +
            (result?.error?.message ||
              JSON.stringify(result.error) ||
              "Không rõ")
        );
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi upload");
    }
  };

  const loginWithYoutubeScope = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/youtube.upload",
    flow: "implicit", // hoặc bỏ flow nếu gặp lỗi
    onSuccess: (tokenResponse) => {
      localStorage.setItem("ytb_token", tokenResponse.access_token);
      alert("Đăng nhập YouTube thành công, bạn có thể chia sẻ video!");
    },
    onError: () => {
      alert("Không thể cấp quyền YouTube.");
    },
  });

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

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="homepage-container">
        <nav className="homepage-navbar">
          <div className="homepage-logo">
            <div className="homepage-logo-img">
              <img src={puddingIcon} className="image-icon-big" />
            </div>
            <div className="homepage-logo-text">min.ai</div>
          </div>

          <div className="homepage-feature">
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
                      selectedFeature: 1,
                    },
                  });
                }}
              >
                {opt}
              </a>
            ))}
            <div
              className="underline-page"
              style={{
                left: `${40.5 + selectedFeature * 7.9}%`,
              }}
            />
          </div>

          <div className="homepage-login-registry">
            {user && (
              <div className="homepage-user-profile">
                <img
                  key={forceRender}
                  src={picture || "https://i.pravatar.cc/96"}
                  alt="avatar"
                  className="avatar"
                />
                <span className="homepage-username">{user.name}</span>
                <img
                  src={downarrowIcon}
                  alt="More options"
                  className="homepage-option-btn"
                />
              </div>
            )}
          </div>
        </nav>
        {showAnalysis === false && (
          <div className="homepage-content">
            <div className="homepage-block">
              <div className="homepage-block-1">
                <div className="homepage-label">
                  <img
                    src={homepageIcon}
                    alt=""
                    className="image-icon-big homepage"
                  />
                  <div className="homepage-text">Trang chủ</div>
                </div>
                <div className="homepage-description">
                  Chúng tôi hỗ trợ bạn tạo ra những video ngắn phù hợp với xu
                  hướng. Chúng tôi là min.ai!
                </div>
                <div className="homepage-video">
                  <div className="homepage-video-label">
                    <div className="homepage-anal">Thống kê</div>
                  </div>
                  <div className="homepage-many-block">
                    <div className="many-block first">
                      <div className="block-des">
                        <div className="circle-icon-small first">
                          <img src={videoIcon} className="image-icon video" />
                        </div>
                        <div className="block-des-label-small">Tổng video</div>
                      </div>
                      <div className="des-label">Số lượng video đã tạo</div>
                      <div className="num-anal">
                        {workspaceTotal + youtubeTotal}
                      </div>
                    </div>
                    <div className="many-block second">
                      <div className="block-des">
                        <div className="circle-icon-small second">
                          <img src={videoIcon} className="image-icon video" />
                        </div>
                        <div className="block-des-label-small">
                          Video workspace
                        </div>
                      </div>
                      <div className="des-label">Số lượng video kho chờ</div>
                      <div className="num-anal">{workspaceTotal}</div>
                    </div>
                    <div className="many-block third">
                      <div className="block-des">
                        <div className="circle-icon-small third">
                          <img src={videoIcon} className="image-icon video" />
                        </div>
                        <div className="block-des-label-small">
                          Video đã xuất bản
                        </div>
                      </div>
                      <div className="des-label">
                        Số lượng video trên nền tảng online
                      </div>
                      <div className="num-anal">{youtubeTotal}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="homepage-block-2">
                <div className="homepage-block-2 first">
                  <div className="label-youtube">
                    <img src={youtubeIcon} alt="" className="image-icon-big" />
                    <div className="youtube-text">Kênh Youtube</div>
                    <img src={picture} alt="" className="homepage-avatar" />
                    <div className="channel-name">{user.name}</div>
                  </div>
                  <div className="des-youtube">
                    <div>
                      <div className="row-label-youtube">
                        <img src={videoIcon} alt="" className="image-icon" />
                        <div className="block-des-label-small">Số video</div>
                      </div>
                      <div className="des-label youtube">
                        Số video đã được xuất bản trên nền tảng này
                      </div>
                      <div className="num-anal-youtube">{youtubeTotal}</div>
                    </div>
                    <div>
                      <div className="row-label-youtube">
                        <img src={profileIcon} alt="" className="image-icon" />
                        <div className="block-des-label-small">
                          Số người đăng ký
                        </div>
                      </div>
                      <div className="des-label youtube">
                        Số người quan tâm kênh của bạn
                      </div>
                      <div className="num-anal-youtube">{subscriberCount}</div>
                    </div>
                    <div>
                      <div className="row-label-youtube">
                        <img src={eyeIcon} alt="" className="image-icon" />
                        <div className="block-des-label-small">Lượt xem</div>
                      </div>
                      <div className="des-label youtube">
                        Số lượt xem của các video Youtube
                      </div>
                      <div></div>
                      <div className="num-anal-youtube">
                        {totalYoutubeViews}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="homepage-block-2 second">
                  <div className="homepage-block-2-second first">
                    <ResponsiveContainer width="100%" height={100}>
                      <PieChart>
                        <Pie
                          data={data}
                          cx="40%" // Dịch về bên trái để có chỗ hiển thị label
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Legend
                          cx="100%" // Dịch về bên trái để có chỗ hiển thị label
                          cy="500%"
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          content={<CustomLegend />}
                        />
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div
                    className="homepage-block-2-second second"
                    onClick={() => {
                      setShowAnalysis(true);
                      handleGetView(dataForBackend, 30);
                    }}
                  >
                    <img
                      src={analyzeIcon}
                      alt=""
                      className="image-icon-medium"
                    />
                    <div className="analyze-text">Thống kê chi tiết</div>
                  </div>
                  <div className="homepage-block-2-second third">
                    <img src={plusIcon} alt="" className="image-icon-medium" />
                    <div
                      className="analyze-text"
                      onClick={() => setShowPopupWorkspace(true)}
                    >
                      Tạo Workspace
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="tab-container-page">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`tab-item ${activeTab === tab ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab(tab);
                      setSelectedFolderIndex(null);
                      setNameFolder("");
                      if (tab === "Video đã xuất bản") {
                        handleFetchYoutubeStats();
                      }
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: "#f7f7f8" }}>
              {activeTab == "Workspace" && (
                <div className="main-space">
                  <div className="homepage-text">Workspace: {nameFolder} </div>
                  <div className="homepage-description">
                    Quản lí video trong từng workspace của bạn
                  </div>
                  <div>
                    <div className="card-container">
                      {selectedFolderIndex === null ? (
                        <>
                          <div
                            className="card add-card"
                            onClick={() => setShowPopupWorkspace(true)}
                          >
                            <div className="plus-icon">+</div>
                            <p className="add-text">Thêm Workspace</p>
                          </div>

                          {/* ✅ Danh sách Workspace */}
                          {dataVideo.workspace.map((folder, index) => (
                            <div
                              className="card canvas-card"
                              key={index}
                              onClick={() => {
                                setSelectedFolderIndex(index);
                                setNameFolder(folder.name);
                              }}
                            >
                              <img
                                src={trashIcon}
                                className="image-icon trash"
                              />
                              <div className="canvas-info">
                                <div className="background-folder">
                                  <img
                                    src={folderIcon}
                                    className="image-icon-big big"
                                    alt="folder icon"
                                  />
                                </div>
                                <hr className="card-divider" />
                                <div>
                                  <div className="title">{folder.name}</div>
                                  <div className="description-folder">
                                    <div className="subtitle">
                                      Ngày tạo: {folder.created}
                                    </div>
                                    <div className="totalVideo">
                                      Số video: {folder.items.length}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        // ✅ Khi đã chọn folder, chỉ hiện video trong folder đó
                        dataVideo.workspace[selectedFolderIndex].items.map(
                          (video, i) => (
                            <div
                              className="card canvas-card"
                              key={video.id || `${selectedFolderIndex}-${i}`}
                            >
                              <div className="canvas-info video">
                                <div
                                  className="background-folder video"
                                  onClick={() => setShowControls(true)}
                                >
                                  <video
                                    preload="metadata"
                                    controls={hoveredVideoId === video.id}
                                    onMouseEnter={() =>
                                      setHoveredVideoId(video.id)
                                    }
                                    onMouseLeave={() => setHoveredVideoId(null)}
                                    style={{ cursor: "pointer" }}
                                    className="video-tab"
                                  >
                                    <source
                                      src={`http://localhost:5000/videos/${video.title}.mp4`}
                                      type="video/mp4"
                                    />
                                    Trình duyệt không hỗ trợ thẻ video.
                                  </video>
                                </div>
                                <div style={{ padding: "0px 10px" }}>
                                  <div className="title">{video.title}</div>
                                  <div className="description-folder">
                                    <div className="subtitle">
                                      Ngày tạo: {video.created}
                                    </div>
                                  </div>
                                  <div style={{ display: "flex" }}>
                                    <div className="subtitle share workspace">
                                      Sharer
                                    </div>
                                    <img
                                      src={shareIcon}
                                      className="image-icon-medium share"
                                      onClick={() => {
                                        setVideoToShare(video.title);
                                        setShowPopupShare(true);
                                      }}
                                    />
                                    <div className="subtitle download">
                                      Download
                                    </div>
                                    <img
                                      src={downloadIcon}
                                      className="image-icon-medium download"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {showPopupWorkspace && (
                <div className="popup-overlay">
                  <div className="popup-box">
                    <h4 style={{ fontWeight: "bold" }}>Thêm Workspace mới</h4>
                    <input
                      type="text"
                      placeholder="Nhập tên workspace"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                    />
                    <div>
                      <button
                        className="cancel-btn-workspace"
                        onClick={() => setShowPopupWorkspace(false)}
                      >
                        Hủy
                      </button>
                      <button
                        className="save-btn-workspace"
                        onClick={handleCreate}
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab == "Video từ Workspace" && (
                <div className="main-space">
                  <div className="homepage-text">Video từ Workspace</div>
                  <div
                    className="homepage-description"
                    style={{ marginBottom: "10px" }}
                  >
                    Các video được tạo nhưng chưa được xuất bản của bạn
                  </div>
                  <div>
                    <div className="card-container">
                      {dataVideo.workspace.map((folder, index) =>
                        folder.items.map((video, i) => (
                          <div
                            className="card canvas-card"
                            key={video.id || `${index}-${i}`}
                          >
                            <div className="canvas-info video">
                              <div
                                className="background-folder  video"
                                onClick={() => setShowControls(true)}
                              >
                                <video
                                  preload="metadata"
                                  controls={hoveredVideoId === video.id}
                                  onMouseEnter={() =>
                                    setHoveredVideoId(video.id)
                                  }
                                  onMouseLeave={() => setHoveredVideoId(null)}
                                  style={{ cursor: "pointer" }}
                                  className="video-tab"
                                >
                                  <source
                                    src={`http://localhost:5000/videos/${video.title}.mp4`}
                                    type="video/mp4"
                                  />
                                  Trình duyệt không hỗ trợ thẻ video.
                                </video>
                              </div>
                              <div style={{ padding: "0px 10px" }}>
                                <div className="title">{video.title}</div>
                                <div className="description-folder">
                                  <div className="subtitle">
                                    Ngày tạo: {video.created}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="subtitle share">Share</div>
                                  <img
                                    src={shareIcon}
                                    className="image-icon-medium share"
                                    onClick={() => {
                                      setShowPopupShare(true);
                                      setVideoToShare(video.title);
                                    }}
                                  />
                                  <div className="subtitle download">
                                    Download
                                  </div>
                                  <img
                                    src={downloadIcon}
                                    className="image-icon-medium download"
                                    onClick={() => downloadVideo(video.title)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab == "Video đã xuất bản" && (
                <div className="main-space">
                  <div className="homepage-text">Video đã xuất bản</div>
                  <div
                    className="homepage-description"
                    style={{ marginBottom: "10px" }}
                  >
                    Các video đã được xuất bản trên nền tảng Youtube
                  </div>
                  <div>
                    <div className="card-container">
                      {youtubeStats.length > 0 &&
                        youtubeStats.map((video, index) => (
                          <div
                            className="card canvas-card"
                            key={video.id || index}
                          >
                            <div className="canvas-info video">
                              <div
                                className="background-folder video"
                                onClick={() => setShowControls(true)}
                              >
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="video-tab"
                                  style={{ cursor: "pointer" }}
                                />
                              </div>
                              <div style={{ padding: "0px 10px" }}>
                                <div className="view-area">
                                  <div className="title">{video.title}</div>
                                  <div style={{ display: "flex" }}>
                                    <div className="subtitle view">
                                      Lượt xem:{" "}
                                    </div>
                                    <div className="title">{video.views}</div>
                                    <img src={eyeIcon} className="image-icon" />
                                  </div>
                                </div>
                                <div className="description-folder">
                                  <div className="subtitle">
                                    Ngày tạo: {video.publishedAt}
                                  </div>
                                  <img
                                    src={youtubeIcon}
                                    className="image-icon-big youtube"
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="subtitle share-1">
                                    Truy cập
                                  </div>
                                  <img
                                    src={shareIcon}
                                    className="image-icon-medium share"
                                    onClick={() =>
                                      window.open(video.url, "_blank")
                                    }
                                  />
                                  <div className="subtitle download">
                                    Download
                                  </div>
                                  <img
                                    src={downloadIcon}
                                    className="image-icon-medium download"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {showPopupShare && (
                <div className="ytb-popup-overlay">
                  <div className="ytb-popup">
                    <div className="ytb-popup-header">
                      <div className="ytb-share-text">Xem trước video</div>
                      <div className="ytb-share-info">
                        Kiểm tra video trước khi chia sẻ
                      </div>
                      <video
                        src={`http://localhost:5000/videos/${videoToShare}.mp4`}
                        controls
                        width="100%"
                      />
                    </div>

                    <div className="ytb-popup-body">
                      <img
                        src={cancelIcon}
                        className="image-icon-medium cancel"
                        onClick={(e) => setShowPopupShare(false)}
                      />
                      <div className="ytb-tabs">
                        <div className="ytb-tab ytb-active">
                          <img src={youtubeIcon} className="image-icon-big" />{" "}
                          YouTube
                        </div>
                        <div className="ytb-channel">
                          <img
                            src={picture}
                            alt="avatar"
                            className="ytb-avatar"
                          />
                          <div className="ytb-display-name">{user.name}</div>
                        </div>
                      </div>
                      <div className="ytb-insert-area">
                        <div className="ytb-form-section">
                          <div className="block-des-label-small">
                            Tiêu đề Video
                          </div>
                          <input
                            placeholder="Nhập tiêu đề video..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                          <div className="block-des-label-small">Mô tả</div>
                          <textarea
                            placeholder="Nhập mô tả video..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          ></textarea>

                          <button
                            className="ytb-share-button"
                            onClick={() => {
                              const token = localStorage.getItem("ytb_token");
                              if (!token) {
                                loginWithYoutubeScope();
                              } else {
                                handleShareToYoutube();
                              }
                            }}
                          >
                            Chia sẻ lên YouTube
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showAnalysis === true && (
          <div className="homepage-content">
            <div className="anal-dashboard-container">
              <h2 style={{ marginLeft: "0px" }}>
                <img src={youtubeIcon} className="image-icon-big" /> Thống kê
                chi tiết
              </h2>
              <div className="anal-card-grid">
                {stats.map((stat, index) => (
                  <div className="anal-stat-card" key={index}>
                    <div className="anal-stat-title">{stat.title}</div>
                    <div className="anal-stat-value">
                      {stat.icon && (
                        <span className="anal-stat-icon">
                          <img src={stat.icon} className="image-icon-medium" />
                        </span>
                      )}
                      <span
                        style={{ color: stat.color || "#333", fontWeight: 600 }}
                      >
                        {stat.value}
                        {stat.suffix && (
                          <span className="anal-suffix"> {stat.suffix}</span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dropdown-wrapper-page">
                <select
                  className="custom-dropdown homepage"
                  onChange={(e) => setTypeDrawing(e.target.value)}
                >
                  {contentType.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {typeDrawing == "Thống kê lượt xem theo thời gian" && (
                <div>
                  <div className="time-range-container">
                    {Object.entries(rangeLabels).map(([value, label]) => (
                      <button
                        key={value}
                        className={`range-button ${
                          selectedDateRange === Number(value) ? "active" : ""
                        }`}
                        onClick={() => {
                          setSelectedDateRange(Number(value));
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="anal-chart-wrapper">
                    <h3 className="anal-chart-title">
                      Thống kê lượt xem theo thời gian
                    </h3>
                    <div className="anal-chart-description">
                      Biểu đồ này giúp bạn hiểu rõ hơn về những gì bạn đăng
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={dataForAnalysis.slice(-selectedDateRange)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey={keys[0]}
                          stroke="#f35b8c"
                          strokeWidth={3}
                          name={keys[0]}
                        />
                        <Line
                          type="monotone"
                          dataKey={keys[1]}
                          stroke="#6fcf97"
                          strokeWidth={3}
                          name={keys[1]}
                        />
                        <Line
                          type="monotone"
                          dataKey={keys[2]}
                          stroke="#9b51e0"
                          strokeWidth={3}
                          name={keys[2]}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {typeDrawing != "Thống kê lượt xem theo thời gian" && (
                <div className="anal-chart-wrapper bar">
                  <h3 className="anal-chart-title">
                    Thống kê 5 video có lượt xem cao nhất
                  </h3>
                  <div className="anal-chart-description">
                    Xem lại thành quả mà bạn đạt được
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={top5Videos}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" barSize={100} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="anal-chart-wrapper bar">
                <h3 className="video-details-title">Chi tiết Video</h3>
                <p className="video-details-subtitle">
                  Nhấp vào tiêu đề để cột để sắp xếp
                </p>

                <table className="video-table">
                  <thead>
                    <tr>
                      <th className="video-header">Video</th>
                      <th
                        className="sortable-header"
                        onClick={() => handleSort("publishedAt")}
                      >
                        Ngày đăng{" "}
                        {sortConfig.key === "publishedAt"
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↑↓"}
                      </th>
                      <th
                        className="sortable-header"
                        onClick={() => handleSort("views")}
                      >
                        Lượt xem{" "}
                        {sortConfig.key === "views"
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↑↓"}
                      </th>
                      <th
                        className="sortable-header"
                        onClick={() => handleSort("likes")}
                      >
                        Lượt thích{" "}
                        {sortConfig.key === "likes"
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↑↓"}
                      </th>
                      <th
                        className="sortable-header"
                        onClick={() => handleSort("comments")}
                      >
                        Lượt bình luận{" "}
                        {sortConfig.key === "comments"
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↑↓"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStats.map((video, index) => (
                      <tr key={`${video.name}-${index}`}>
                        <td className="video-cell">
                          <div className="video-info">
                            <img
                              src={video.thumbnail}
                              alt="thumbnail"
                              className="video-thumbnail"
                            />
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="video-title"
                            >
                              {video.title}
                            </a>
                          </div>
                        </td>
                        <td>{video.publishedAt}</td>
                        <td>{video.views}</td>
                        <td>{video.likes}</td>
                        <td>{video.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
