import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Introduce.css";

const Introduce = () => {
  const place = {
    name: "파리 에펠탑",
    image: `${process.env.PUBLIC_URL}/img/img1.png`,
    description: "파리는 로맨틱한 도시로 유명하며 에펠탑이 대표적인 명소입니다.",
    location: "프랑스, 파리",
    currency: "1,350",
    local_currency: "EUR",
    weather: {
      temperature: "15",
      description: "맑음 ☀️",
    },
    hashtags: ["파리", "에펠탑", "여행", "유럽"],
    reviews: [
      { user: "김철수", comment: "정말 멋진 곳이었어요!", rating: 5 },
      { user: "이영희", comment: "야경이 특히 아름다웠습니다.", rating: 4.5 },
    ],
  };

  const [newComment, setNewComment] = useState("");  // 새로운 댓글 상태
  const [reviews, setReviews] = useState(place.reviews);  // 댓글 리스트
  const [user, setUser] = useState(null);  // 로그인된 사용자 상태

  // 로그인된 사용자 확인 (예시로 localStorage에서 확인)
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);  // 로그인된 사용자 정보 설정
    }
  }, []);

  // 댓글 등록 함수 (로그인 상태에서만 등록)
  const handleCommentSubmit = () => {
    if (!user) {
      alert("로그인 후 댓글을 등록해주세요.");
      return;
    }

    if (newComment.trim()) {
      const commentData = {
        user_id: user.id,  // 로그인된 사용자의 ID
        content: newComment,
      };

      // 백엔드 API로 댓글 등록 요청
      axios
        .post("http://localhost:5000/comments", commentData)  // 댓글 등록 API 호출
        .then(() => {
          setNewComment("");  // 댓글 등록 후 내용 초기화
          setReviews((prevReviews) => [
            ...prevReviews,
            { user: user.name, comment: newComment },  // 새로운 댓글 UI에 추가
          ]);
        })
        .catch((error) => {
          console.error("댓글 등록 오류", error);
        });
    }
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="introduce-container">
          <h1>{place.name}</h1>
          <img src={place.image} alt={place.name} className="place-image" />
          <p>{place.description}</p>

          {/* 여행지 정보 및 UI */}
          <div className="review-section">
            <h3>여행 후기</h3>
            <ul>
              {reviews.map((review, index) => (
                <li key={index}>
                  <strong>{review.user}:</strong> {review.comment}
                </li>
              ))}
            </ul>

            {/* 댓글 입력 폼 */}
            <div className="review-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="후기를 입력하세요..."
              />
              <button onClick={handleCommentSubmit}>댓글 등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
