class ComunicationController {
    constructor() {
        this.topics = {};
    }

    registerListener(object, topic) {
        if (!this.topics[topic]) {
            this.topics[topic] = [object]
            devmode && console.log('creating new topic: ' + topic)
        } else {
            this.topics[topic].push(object);
        }
    }
    broadcastTopic(topic, data) {
        typeof topic !== 'string' && devError('not a valid event')
        let currentTopic = this.topics[topic];
        if (currentTopic) {
            currentTopic.iterate(function(object) {
                object['on' + topic.capitalize()] ?
                    object['on' + topic.capitalize()].call(object, data) :
                    devError('object not ready for topic: ' + topic)
            })
        } else {
            devError('no souch topic: ' + topic)
        }
    }
}
