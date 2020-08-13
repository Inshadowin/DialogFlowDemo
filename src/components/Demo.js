import React, { useCallback } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

import dialogflow2 from '../services/Dialogflow';

const Demo = ({ addResponseMessageFunction, dialogflowService, ...props }) => {
    const onRes = useCallback(res => {
        addResponseMessageFunction(res.queryResult.fulfillmentText)
    }, [addResponseMessageFunction])

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
    addResponseMessageFunction: addResponseMessage
}

export default React.memo(Demo)