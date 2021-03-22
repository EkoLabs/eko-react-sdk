/**
 * Keeps track of the player plugin initialized state and exposes a promise-based API
 * that allows others to wait until a plugin is initialized to perform some action.
 * This should be exposed as part of the EkoPlayerContext
 */
class PlayerPluginsService {
    constructor(player) {
        this._player = player;
        this._pluginInitedMap = {};
        this.onPluginInited = this.onPluginInited.bind(this);
        this.addEventListeners();
    }

    static init(player) {
        if (!this._instance) {
            this._instance = new PlayerPluginsService(player);
        }
        return this._instance;
    }

    onPluginInited(name, version) {
        // If the plugin doesn't exist in the map yet
        if (!this._pluginInitedMap[name]) {
            // Create a new, resolved promise for it, since this plugin has been initialized already
            this._pluginInitedMap[name] = Promise.resolve(name);
        }
    }

    pluginInited(name) {
        // Check if a promsie already exists for this plugin (i.e. it's already been initialized)
        // or create a new promise for this plugin
        let promise = this._pluginInitedMap[name] || new Promise((resolve, reject) => {
            // Listen to the plugin init event, and only resolve if the name matches the plugin name passed in
            this._player.on('plugininit', function checkPluginInit(pluginName, version) {
                if (pluginName === name) {
                    this._player.off('plugininit', checkPluginInit);
                    resolve(name);
                }
            }.bind(this));
        });
        // Update the map
        this._pluginInitedMap[name] = promise;
        return this._pluginInitedMap[name];
    }

    addEventListeners() {
        this._player.on('plugininit', this.onPluginInited);
    }

    removeEventListeners() {
        this._player.off('plugininit', this.onPluginInited);
    }

    dispose() {
        this.removeEventListeners();
    }


}

export default PlayerPluginsService;
