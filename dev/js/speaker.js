class Speaker {
    constructor(comunications) {
        this.comunications = comunications;
    }

    dispatch(topic, data){
        this.comunications.broadcastTopic(topic, data)
    }

    listenTo(topic){
        this.comunications.registerListener(this, topic)
    }

    registerMethod(methodName, method) {
    	this.communications.registerMethodProvider(methodName, method)
    }

	request(methodName, extraData) {
		this.communications.provideMethod(methodName, extraData)
	}    
}
