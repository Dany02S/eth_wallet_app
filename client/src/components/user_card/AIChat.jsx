
const AIChat = () => {
    return (
        <div className="ai-chat-container">

            <div className="ai-chat">
                <img className="loading-ai" src="gemini.png" alt="" />
                <p className="sent-message">Hello</p>
            </div>
            <div className="form-inputs">
                <input type="text" className="form-input" placeholder="Type a message..."></input>
                <button className="form-button">Send</button>
            </div>
        </div>
    )
}

export default AIChat;