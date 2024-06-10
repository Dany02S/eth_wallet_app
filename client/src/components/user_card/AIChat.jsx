import { useState } from "react";
import { getAIAnswer } from "../../services/fetching";

const AIChat = () => {
    const [question, setQuestion] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // useEffect(() => {

    // }, [])

    const sendMessage = async () => {
        setLoading(true);
        if (question === ""){
            setLoading(false);
            setError("Message cannot be empty");
            setTimeout(() => setError(""), 3000);
            return;
        } 
        try {
        const response = await getAIAnswer(question, history);
        setHistory(oldChat => [...oldChat, {
            role: "user",
            parts: [{text: question}]
        }, {
            role: "model",
            parts: [{text: response.message}]
        }])
        setQuestion("");

        setLoading(false);
        } catch (error) {
            setError(error.message);
        }
    }


    return (
        <div className="ai-chat-container">

            {history.length == 0 ?
            <div className="welcome-bar">
                <img src="gemini.png" alt="" />
                <h3>AI will answer your crypto questions</h3>
            </div> 
            : <div className="ai-chat">
                {history.map((chat, index) => (
                        <p key={index} className={chat.role === "model" ? "recieved-message" : "sent-message"}>{chat.parts[0].text}</p>
                ))}
                {loading && <img src="/gemini.png" className="loading-ai"  alt="loading" />}
            </div>}
            {error && <div className="form-error">{error}</div>}
            <div className="form-inputs">
                <input type="text" className="form-input" placeholder="Type a message..." value={question} onChange={(e) => setQuestion(e.target.value)} />
                <button className="form-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default AIChat;