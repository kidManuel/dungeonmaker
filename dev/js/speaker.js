class Speaker {
    constructor(comunications) {
        this.comunications = comunications;
    }

    dispatchTopic(topic, data){
        this.comunications.broadcastTopic(topic, data)
    }

    registerFor(topic){
        this.comunications.registerListener(this, topic)
    }
}
