import React, { useCallback, useState } from 'react';
import dialogflow2 from '../services/DemoService';

const Response = ({ onQuestion, question, response, loading }) => {
    if (loading) return <div className="support-spinner"><img src="Content/30_Quorum/images/loadingindicator.gif" width="18" height="18" alt="loading" /></div>

    if (!response) return null;

    return <React.Fragment>
        <div className="support-pane-query">You asked: "{question}"</div>

        <div className="support-pane-answer">"{response}"</div>

        <img src="Content/30_Quorum/images/mock.png" width="302" height="172" alt="mock image for demo purposes" className="support-image" />

        <div className="support-pane-source">Source: <a href="" className="weblink">Support Center</a> {">"} <a href="" className="weblink">Customizing the Dashboard</a></div>

        <div className="support-pane-feedback-msg">Did this answer your question?</div>

        <div className="support-pane-feedback-confirm hidden">Thank you for providing feedback. This will help improve the quality of answers in the future</div>

        <button className="support-pane-responses">Yes</button>
        <button onClick={onQuestion} className="support-pane-responses">No</button>
    </React.Fragment>
}

const demoResponseFilter = res => res.result.fulfillment.speech;
const demoErrorHandle = res => {
    if (!res || !res.result || !res.result.fulfillment) {
        console.error('Message not recieved', res);
        return true;
    }
}

const QuorumDemo = ({ errorHandleFunction, responseFilterFunction, dialogflowService, ...props }) => {
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");

    const onRes = useCallback(res => {
        if (errorHandleFunction && errorHandleFunction(res)) return;

        setResponse(responseFilterFunction(res))
        setLoading(false);
    }, [setResponse, setLoading, responseFilterFunction])

    const handleQuestion = useCallback(() => {
        setLoading(true);
        dialogflowService.requestQuery(question, onRes, error => console.log(error));
    }, [onRes, setLoading, dialogflowService, question])

    return (<div className="filters">
        <span id="support-search" className="q-form-control-wrapper">
            <label className="q-form-control-label classic k-textbox" htmlFor="autocomplete1">Ask a question</label>
            <input
                className="q-form-control-input"
                placeholder="Ask a Question"
                id="autocomplete1"

                value={question}
                onChange={e => setQuestion(e.target.value)}
            ></input>
            <button onClick={handleQuestion} className="support-search-button">
                <span className="sprite q-content_View">
                </span>
            </button>
        </span>
        {<Response loading={loading} onQuestion={handleQuestion} question={question} response={response} />}
    </div>)
}

QuorumDemo.defaultProps = {
    subtitle: '',
    title: 'Quorum Support',
    dialogflowService: dialogflow2,

    errorHandleFunction: demoErrorHandle,
    responseFilterFunction: demoResponseFilter,
}

export default QuorumDemo;