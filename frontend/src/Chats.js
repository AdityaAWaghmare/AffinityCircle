// Chat.js
import React, { useState } from "react";
import chatData from "./chatData";

function Chat() {
  const [tab, setTab] = useState("chats");

  return (
    <div style={{
      maxWidth: 400,
      margin: "0 auto",
      minHeight: "100vh",
      background: "#fff",
      fontFamily: "Inter, Arial, sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ flex: 1 }}>
        {tab === "home" && (
          <div style={{ padding: 24 }}>
            <h2>Home</h2>
            <p>Welcome to Home!</p>
          </div>
        )}

        {tab === "chats" && (
          <div>
            <div style={{ padding: "24px 16px 8px 16px", fontWeight: 600, fontSize: 22 }}>Chats</div>
            <div style={{ padding: "0 16px 16px 16px", display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Looking for someone or something?"
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 18,
                  border: "1px solid #eee",
                  background: "#fafafa",
                  fontSize: 15,
                  outline: "none"
                }}
              />
              <span style={{ marginLeft: 10, fontSize: 20, color: "#bbb" }}>⚲</span>
            </div>
            <div>
              {chatData.map(chat => (
                <div key={chat.id} style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #f3f3f3",
                  background: "#fff",
                  cursor: "pointer"
                }}>
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      marginRight: 14,
                      objectFit: "cover",
                      border: "2px solid #f0f0f0"
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{chat.name}</div>
                    <div style={{ color: "#888", fontSize: 15, fontStyle: "italic" }}>{chat.message}</div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 50 }}>
                    <div style={{ color: "#b0b0b0", fontSize: 13 }}>{chat.time}</div>
                    {chat.unread > 0 && (
                      <div style={{
                        background: "#5C6EF8",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        marginTop: 4,
                        marginLeft: "auto"
                      }}>
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div>
            <div style={{ padding: 24, fontWeight: 600, fontSize: 22 }}>Settings</div>
            <div style={{ padding: "0 16px" }}>
              <p>Settings page (placeholder)</p>
              {/* You can add settings options here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
