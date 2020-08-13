import React, { useCallback } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

import dialogflow2 from '../services/DemoService';

const defaultResponseFilter = res => res.queryResult.fulfillmentText;
const demoResponseFilter = res => res.result.fulfillment.speech;

const defaultErrorHandle = res => {
    if (!res || !res.queryResult) {
        console.error('Message not recieved', res);
        return true;
    }
}
const demoErrorHandle = res => {
    if (!res || !res.result || !res.result.fulfillment) {
        console.error('Message not recieved', res);
        return true;
    }
}

const Demo = ({ errorHandleFunction, addResponseMessageFunction, responseFilterFunction, dialogflowService, ...props }) => {
    const onRes = useCallback(res => {
        if (errorHandleFunction && errorHandleFunction(res)) return;

        addResponseMessageFunction(responseFilterFunction(res))
    }, [addResponseMessageFunction, responseFilterFunction])

    const handleNewUserMessage = useCallback(newMessage => {
        dialogflowService.requestQuery(newMessage, onRes, error => console.log(error));
    }, [onRes, dialogflowService])

    return <Widget
        handleNewUserMessage={handleNewUserMessage}

        {...props}
    />
}

Demo.defaultProps = {
    subtitle: '',
    title: 'Quorum Support',
    dialogflowService: dialogflow2,

    errorHandleFunction: demoErrorHandle,

    responseFilterFunction: demoResponseFilter,
    addResponseMessageFunction: addResponseMessage
}

export default React.memo(Demo)