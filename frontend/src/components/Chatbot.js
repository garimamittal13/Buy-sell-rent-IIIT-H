import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chatbot.css"; // Ensure you have appropriate styles

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false); // Toggle chat window
    const [message, setMessage] = useState(""); // User input
    const [conversation, setConversation] = useState([]); // Chat history
    const [loading, setLoading] = useState(false); // Show typing indicator
    const [error, setError] = useState(""); // Handle API errors
    const messagesEndRef = useRef(null);

    // Scroll chat to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        // Add user message to conversation
        const updatedConversation = [...conversation, { role: "user", content: message }];
        setConversation(updatedConversation);
        setLoading(true);
        setError(""); // Clear previous errors

        try {
            // Call backend API with full conversation history
            const response = await axios.post("http://localhost:8080/api/chat", { conversation: updatedConversation });
            const reply = response.data.reply;

            // Update conversation with Gemini's reply
            setConversation(prev => [...prev, { role: "assistant", content: reply }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setError("Failed to get a response. Try again.");
        } finally {
            setLoading(false);
        }

        // Clear input field
        setMessage("");
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSendMessage();
    };

    return (
        <div className="chatbot-container">
            {/* Chatbot Toggle Button */}
            <button className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
                💬
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Chatbot</h3>
                        <button onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="chat-messages">
                        {conversation.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}
                        {loading && <div className="message assistant">Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Show error message if API fails */}
                    {error && <div className="error-message">{error}</div>}

                    {/* Input Field */}
                    <div className="chat-input">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSendMessage} disabled={loading}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
