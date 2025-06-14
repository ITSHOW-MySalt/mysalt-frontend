import React, { useState } from "react";
import "../styles/Archive.css";

function Archive() {
  const [activeTab, setActiveTab] = useState("ending"); // 'ending' or 'illustration'

  return (
    <div className="Archive-container">
      <header className="Archive-header">
        <button
          className={activeTab === "ending" ? "active" : ""}
          onClick={() => setActiveTab("ending")}
        >
          엔딩
        </button>
        <button
          className={activeTab === "illustration" ? "active" : ""}
          onClick={() => setActiveTab("illustration")}
        >
          삽화
        </button>
      </header>

      <main className="Archive-content">
        {activeTab === "ending" && (
          <div className="ending-tab">
            {/* 엔딩 이미지들 보여주기 */}
            <img src="/img/ending1.png" alt="엔딩 1" />
            {/* 이미지 추가 */}
          </div>
        )}
        {activeTab === "illustration" && (
          <div className="illustration-tab">
            {/* 삽화 이미지들 보여주기 */}
            <img src="/img/illustration1.png" alt="삽화 1" />
            {/* 이미지 추가 */}
          </div>
        )}
      </main>
    </div>
  );
}

export default Archive;