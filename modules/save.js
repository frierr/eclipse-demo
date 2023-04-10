export function savePlayerData(player) {
    const data_to_save = {
        hp: player.hp,
        position: player.position,
        possessions: {
            notes: player.possessions.notes,
            keys: player.possessions.keys,
            items: player.possessions.items,
            equipped: JSON.stringify(player.possessions.equipped),
            journal: player.possessions.journal
        }
    };
    const serial = JSON.stringify(data_to_save);
    localStorage.setItem("gamesave", serial);
}

export function saveEnvironments(environments) {
    const data_to_save = [];
    var temp;
    for (var i = 0; i < environments.length; i++) {
        const env = environments[i].env;
        const data_inner = {
            objects: env.objects,
            autotriggers: JSON.stringify(env.autotriggers),
            toggletriggers: JSON.stringify(env.toggletriggers),
            entities: env.entities,
            overlay: env.overlay
        }
        data_to_save.push(data_inner);
        if(env.toggletriggers.length > 0) {
            temp = env.toggletriggers[0].action;
        }
    }
    const serial = JSON.stringify(data_to_save);
    localStorage.setItem("envsave", serial);
}

export function loadPlayerData(player) {
    const loaded_data = JSON.parse(localStorage.getItem("gamesave"));
    player.hp = loaded_data.hp;
    player.position = loaded_data.position;
    player.possessions.notes = loaded_data.possessions.notes;
    player.possessions.keys = loaded_data.possessions.keys;
    player.possessions.items = loaded_data.possessions.items;
    player.possessions.journal = loaded_data.possessions.journal;
    if (loaded_data.possessions.equipped) {
        player.possessions.equipped = loaded_data.possessions.equipped;
    }
}

export function loadEnvironmentData(environments) {
    const loaded_data = JSON.parse(localStorage.getItem("envsave"));
    for (var i = 0; i < environments.length; i++) {
        const env = environments[i].env;
        env.objects = loaded_data[i].objects;
        env.overlay = loaded_data[i].overlay;
        env.autotriggers = deserialiseTriggers(loaded_data[i].autotriggers);
        env.toggletriggers = deserialiseTriggers(loaded_data[i].toggletriggers);
        //env.entities = deserialiseEntities(loaded_data[i].entities);
    }
}

function deserialiseEntities(loaded) {
    const result = [];
    /*loaded = JSON.parse(loaded);
    for (var i = 0; i < loaded.length; i++) {
        //parse enemy class?
    }*/
    return result;
}

function deserialiseTriggers(loaded) {
    const result = [];
    loaded = JSON.parse(loaded);
    for (var i = 0; i < loaded.length; i++) {
        const trigger = loaded[i];
        eval("trigger.action = " + trigger.action);
        result.push(trigger);
    }
    return result;
}

Function.prototype.toJSON = function() {
    return this.toString();
}