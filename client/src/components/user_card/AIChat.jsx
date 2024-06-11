import { useState, useEffect, useRef } from "react";
import { getAIAnswer } from "../../services/fetching";

const AIChat = () => {
    const [question, setQuestion] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const chatContainerRef = useRef(null);

    useEffect(() => {
        
        const sendFirstMessage = async () => {
            try {
                const commanding = `
                    Hello Gemini! From now on your name is EthaAI made by ETH Wallet company you will answer all the questions about cryptocurrencies and blockchain.
                    If the questtion does not relate to cryptocurrencies, just answer: "I am sorry, I can only answer questions about cryptocurrencies."
                    If you do not know the answer to the question, just answer: "I am sorry, I do not know the answer to that question."
                    If the question is inappropriate, just answer: "I am sorry, I cannot answer that question."
                    
                    All of your answers should be plain text, no need for any formatting.
                    All of your answers should be maximum 130 characters long.
                    `
                const response = await getAIAnswer(commanding, history);
                setHistory([{
                    role: "user",
                    parts: [{text: commanding}]
                },{
                    role: "model",
                    parts: [{text: response.message}]
                }])
            } catch (error) {
                setError(error.message);
            }
        }
        sendFirstMessage();
    }, [])

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const sendMessage = async () => {
        setLoading(true);
        if (question === ""){
            setLoading(false);
            setError("Message cannot be empty");
            setTimeout(() => setError(""), 3000);
            return;
        } 
        const mess = question;
        setQuestion("");
        try {
            setHistory(oldChat => [...oldChat, {
                role: "user",
                parts: [{text: mess}]
            }])
            const response = await getAIAnswer(mess + " (answer in maximum 6 sentences, and only plain text, no formatting)", history.slice(0, history.length - 1));
            setHistory(oldChat => [...oldChat, {
                role: "model",
                parts: [{text: response.message}]
            }])
            setLoading(false);
        } catch (error) {
            setError(error.message);
        }
    }


    return (
        <div className="ai-chat-container">

            {history.length <= 2 && !loading ?
            <div className="welcome-bar">
                <img src="gemini.png" alt="" />
                <h3>AI will answer your crypto questions</h3>
            </div> 
            : <div className="ai-chat" ref={chatContainerRef}>
                {history.slice(2).map((chat, index) => (
                        <p key={index} className={chat.role === "model" ? "recieved-message" : "sent-message"}>{chat.parts[0].text}</p>
                ))}
                {loading && <img src="/gemini.png" className="loading-ai"  alt="loading" />}
            </div>}
            {error && <div className="form-error">{error}</div>}
            <div className="form-inputs">
                <input type="text" className="form-input" id="inputFiled" placeholder="Type your question..." value={question} onChange={(e) => setQuestion(e.target.value)} />
                <button className="form-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default AIChat;