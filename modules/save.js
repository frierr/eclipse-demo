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
    /*
    WHAT TO SAVE:
    object images, zIndex
    trigger states
    entity - lightsource - style
    entity - enemy - active/dead
    environment overlay
    */
    const data_to_save = [];
    for (var i = 0; i < environments.length; i++) {
        const env_data = {
            object_data: [],
            auto_trigger_data: [],
            toggle_trigger_data: [],
            entity_data: [],
            overlay: environments[i].env.overlay
        }
        //object data
        for (var j = 0; j < environments[i].env.objects.length; j++) {
            env_data.object_data.push({image: environments[i].env.objects[j].image, zIndex: environments[i].env.objects[j].zIndex});
        }
        //autotrigger states
        for (var j = 0; j < environments[i].env.autotriggers.length; j++) {
            env_data.auto_trigger_data.push(environments[i].env.autotriggers[j].state);
        }
        //toggletrigger states
        for (var j = 0; j < environments[i].env.toggletriggers.length; j++) {
            env_data.toggle_trigger_data.push(environments[i].env.toggletriggers[j].state);
        }
        //entity data
        for (var j = 0; j < environments[i].env.entities.length; j++) {
            if (environments[i].env.entities[j].type == "lightsource") {
                env_data.entity_data.push({type: "lightsource", style: environments[i].env.entities[j].style});
            } else if (environments[i].env.entities[j].type == "enemy") {
                env_data.entity_data.push({type: "enemy", active: environments[i].env.entities[j].enemy.active, hp: environments[i].env.entities[j].enemy.hp});
            } else {
                env_data.entity_data.push({type: "other"});
            }
        }
        data_to_save.push(env_data);
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
        const env_data = loaded_data[i];
        const env = environments[i].env;
        env.overlay = env_data.overlay;
        //load object data
        for (var j = 0; j < env.objects.length; j++) {
            env.objects[j].image = env_data.object_data[j].image;
            env.objects[j].zIndex = env_data.object_data[j].zIndex;
        }
        //load autotriggers states
        for (var j = 0; j < env.autotriggers.length; j++) {
            env.autotriggers[j].state = env_data.auto_trigger_data[j];
        }
        //load toggletriggers states
        for (var j = 0; j < env.toggletriggers.length; j++) {
            env.toggletriggers[j].state = env_data.toggle_trigger_data[j];
        }
        //load entity data
        for (var j = 0; j < env.entities.length; j++) {
            if (env.entities[j].type == "lightsource") {
                env.entities[j].style = env_data.entity_data[j].style;
            } else if (env.entities[j].type == "enemy") {
                env.entities[j].enemy.active = env_data.entity_data[j].active;
                if(env_data.entity_data[j].hp <= 0) {
                    env.entities[j].enemy.sprite.img.src = "";
                } else {
                    env.entities[j].enemy.hp = env_data.entity_data[j].hp;
                }
            }
        }
        //reload new data
        env.removeObjects();
        env.setUpObjects();
    }
}