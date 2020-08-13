import React from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

import dialogflow2 from '../services/Dialogflow';

const Demo = ({ ...props }) => {
    const onRes = res => {
        addResponseMessage(res.queryResult.fulfillmentText)
    }

    const handleNewUserMessage = (newMessage) => {
        handlePress(newMessage);
    };

    const handlePress = (newMessage) => {
        dialogflow2.requestQuery(newMessage, onRes, error => console.log(error));
    }

    return <Widget
        subtitle={''}
        title={'Quorum Support'}
        handleNewUserMessage={handleNewUserMessage}
    />
    // <button onClick={handlePress}>Send</button>
}

export default React.memo(Demo)