module.exports = function(RED) {
    this.isRequesting = false;

    var handle_error = function(err, node) {
        node.log(err.body);
        node.status({ fill: "red", shape: "dot", text: err.message });
        node.error(err.message);
    };

    function HunterioExecuteNode(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        node.host = RED.nodes.getNode(config.host);
        const Hunter = require('hunterio');
        node.client = new Hunter(this.host.api_key);

        const requiredArgs = ['method', 'args'];
        node.on('input', function(msg) {
            console.log(node);
            node.status({ fill: "blue", shape: "dot", text: `Try ${msg.payload.resource}.${msg.payload.method}...` });

            var validation = requiredArgs.reduce((p, v) => {
                if (!msg.payload[v]) {
                    handle_error(new Error(`No msg.payload.${v} provided, cancel`), node);
                    return false;
                }
                return p;
            }, true);

            // validation
            if (!validation)
                return false;

            if (!node.client[msg.payload.method]) {
                return handle_error(new Error(`Method ${msg.payload.method} is invalid, check documentation, cancel`), node);
            }

            msg['_original'] = msg.payload;
            node.client[msg.payload.method](
                msg.payload.args,
                function(err, body) {
                    if (err) {
                        // handle error
                        handle_error(err, node);
                        msg.payload = false;
                        node.send(msg);
                    }
                    else {
                        // Will contain same body as the raw API call
                        node.status({ fill: "green", shape: "dot", text: `Success ${msg.payload.method} !` });
                        msg.payload = body;
                        node.send(msg);
                    }
                })
        });
    }
    RED.nodes.registerType("hunterio-execute", HunterioExecuteNode);
};
