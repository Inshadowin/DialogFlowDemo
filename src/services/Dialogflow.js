import config from '../config/index';
import googleAuth from './googleAuth';
export const DEFAULT_BASE_URL = "https://cors-anywhere.herokuapp.com/https://dialogflow.googleapis.com/v2/projects/";

export const Dialogflow_V2 = class Dialogflow_V2 {

    onListeningStarted(callback) {
        this.onListeningStarted = callback;
    }

    onListeningCanceled(callback) {
        this.onListeningCanceled = callback;
    }

    onListeningFinished(callback) {
        this.onListeningFinished = callback;
    }

    setContexts(contexts) {
        var array = contexts;

        array.forEach((c, i, a) => {
            a[i] = this.normalizeContext(c);
        })

        this.contexts = array;
    }

    setPermanentContexts(contexts) {
        // set lifespan to 1 if it's not set
        contexts.forEach((c, i, a) => {
            a[i] = this.normalizeContext(c);

            if (!c.lifespanCount) {
                a[i] = { ...c, lifespanCount: 1 };
            }
        });

        this.permanentContexts = contexts;
    }

    normalizeContext(context) {
        // rename property lifespan to lifespanCount
        if (context.lifespan) {
            context.lifespanCount = context.lifespan;
            delete context.lifespan;
        }

        // add context name path: projects/<Project ID>/agent/sessions/<Session ID>/contexts/<Context ID>
        // https://dialogflow.com/docs/reference/api-v2/rest/v2beta1/projects.agent.sessions.contexts#Context
        if (!context.name.startsWith("projects/")) {
            context.name = "projects/" + this.projectId + "/agent/sessions/" + this.sessionId + "/contexts/" + context.name;
        }

        return context;
    }

    /*
    setEntities(entities) {
        this.entities = entities;
    }
    */

    onAudioLevel(callback) {

    }

    requestEvent = async (eventName, eventParameters, onResult, onError) => {

        const data = {
            "queryParams": {
                "contexts": this.mergeContexts(this.contexts, this.permanentContexts),
                "sessionEntityTypes": []
            },
            "queryInput": {
                "event": {
                    "name": eventName,
                    "parameters": eventParameters,
                    "languageCode": this.languageTag,
                },
            }
        }

        this.contexts = null;
        this.entities = null;

        fetch(DEFAULT_BASE_URL + this.projectId + "/agent/sessions/" + this.sessionId + ":detectIntent", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.accessToken,
                'charset': "utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(function (response) {
                var json = response.json().then(onResult)
            })
            .catch(onError);
    };


    requestQuery = async (query, onResult, onError) => {

        const data = {
            // "queryParams": {
            //     "contexts": this.mergeContexts(this.contexts, this.permanentContexts),
            //     "sessionEntityTypes": []
            // },
            "queryInput": {
                "text": {
                    "text": query,
                    "languageCode": this.languageTag,
                },
            }
        }

        this.contexts = null;
        this.entities = null;

        fetch(DEFAULT_BASE_URL + this.projectId + "/agent/sessions/" + this.sessionId + ":detectIntent", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + this.accessToken,
                'charset': "utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(function (response) {
                var json = response.json().then(onResult)
            })
            .catch(onError);
    };


    mergeContexts(context1, context2) {
        if (!context1) {
            return context2;
        } else if (!context2) {
            return context1;
        } else {
            return [...context1, ...context2];
        }
    }

    resetContexts(onResult, onError) {
        //TODO
    };

    /**
     * generates new random UUID
     * @returns {string}
     */
    guid() {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    }

    async generateAccessToken(clientEmail, privateKey) {
        let token;
        try {
            token = await googleAuth(clientEmail, privateKey, ['https://www.googleapis.com/auth/cloud-platform']);
        } catch (e) {
            console.error("react-native-dialogflow: Authentication Error: " + e);
            throw new Error("react-native-dialogflow: Authentication Error: " + e);
        } finally {
            return token;
        }
    }


    LANG_CHINESE_CHINA = "zh-CN";
    LANG_CHINESE_HONGKONG = "zh-HK";
    LANG_CHINESE_TAIWAN = "zh-TW";
    LANG_DUTCH = "nl";
    LANG_ENGLISH = "en";
    LANG_ENGLISH_GB = "en-GB";
    LANG_ENGLISH_US = "en-US";
    LANG_FRENCH = "fr";
    LANG_GERMAN = "de";
    LANG_ITALIAN = "it";
    LANG_JAPANESE = "ja";
    LANG_KOREAN = "ko";
    LANG_PORTUGUESE = "pt";
    LANG_PORTUGUESE_BRAZIL = "pt-BR";
    LANG_RUSSIAN = "ru";
    LANG_SPANISH = "es";
    LANG_UKRAINIAN = "uk";
}

var dialogflow2 = new Dialogflow_V2();

const Voice = {};
dialogflow2.setConfiguration = async function (clientEmail, privateKey, languageTag, projectId) {
    dialogflow2.accessToken = await dialogflow2.generateAccessToken(clientEmail, privateKey);
    dialogflow2.languageTag = languageTag;
    dialogflow2.projectId = projectId;
    dialogflow2.sessionId = dialogflow2.sessionId ? dialogflow2.sessionId : dialogflow2.guid();

    // set listeners
    Voice.onSpeechStart = (c) => {
        dialogflow2.speechResult = null;
        if (dialogflow2.onListeningStarted) {
            dialogflow2.onListeningStarted(c);
        }
    }

    Voice.onSpeechEnd = (c) => {

        if (dialogflow2.speechResult) {
            dialogflow2.requestQuery(dialogflow2.speechResult[0], dialogflow2.onResult, dialogflow2.onError);
        }

        if (dialogflow2.onListeningFinished) {
            dialogflow2.onListeningFinished(c);
        }
    }

    Voice.onSpeechVolumeChanged = (c) => {
        if (dialogflow2.onAudioLevel) {
            dialogflow2.onAudioLevel(c);
        }
    }

    Voice.onSpeechResults = (result) => {
        if (result.value) {
            dialogflow2.speechResult = result.value;
        }
    }
}

dialogflow2.startListening = function (onResult, onError) {
    dialogflow2.onResult = onResult;
    dialogflow2.onError = onError;

    Voice.start(dialogflow2.languageTag);
}

dialogflow2.finishListening = function () {
    Voice.stop();
}

dialogflow2.setConfiguration(...config);

export default dialogflow2;