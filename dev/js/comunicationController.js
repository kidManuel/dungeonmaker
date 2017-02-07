class ComunicationController {
    constructor() {
        this.topics = {};
    }
    registerListener(object, topic) {
        if (!this.topics[topic]) {
            this.topics[topic] = [object]
            devmode && console.log('creating new topic ')
        } else {
            this.topics[topic].push(object);
        }
    }
    broadcastTopic(topic, data) {
        let currentTopic = this.topics[topic];
        if (currentTopic) {
            currentTopic.iterate(function(object) {
                object['on' + topic.capitalize()] ?
                    object['on' + topic.capitalize()].call(object, data) :
                    devmode && console.log('object not ready for topic: ' + topic)
            })
        } else {
            devmode && console.log('no souch topic: ' + topic)
        }
    }
}
