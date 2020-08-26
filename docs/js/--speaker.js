class Speaker {
    //deprecated
    constructor(communications) {
        this.communications = communications;
    }

    dispatch(topic, data){
        this.communications.broadcastTopic(topic, data)
    }

    listenTo(topic){
        this.communications.registerListener(this, topic)
    }

    registerMethod(methodName, method) {
    	this.communications.registerMethodProvider(methodName, method)
    }

	request(methodName, extraData) {
		this.communications.provideMethod(methodName, extraData)
	}    
}
