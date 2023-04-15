export const locale = setLocale(navigator.language.substring(0, 2));

function setLocale(lang) {
    switch(lang) {
        case "uk":
            return "uk";
        default:
            return "en";
    }
}

export const journal_strings = {
    waking_up: {
        "en": "As I opened my eyes, I felt the pounding in my head and the soreness in my limbs. I looked around and realized I was in an unfamiliar bedroom, with no memory of how I got there. The room was dimly lit, with heavy curtains covering the windows. Everything felt surreal and hazy, like a dream. Panic set in as I struggled to remember who I was and how I ended up in this strange place.",
        "uk": "Відкривши очі, я відчула стукіт у голові та біль у кінцівках. Я озирнулася і зрозуміла, що перебуваю в незнайомій спальні, не пам’ятаючи, як я туди потрапила. Кімната була тьмяно освітлена, вікна закривали важкі штори. Усе здавалося сюрреалістичним і туманним, як сон. Почалася паніка, коли я намагалася згадати, ким я була і як опинилася в цьому дивному місці."
    },
    bedroom_exit: {
        "en": "With a trembling hand, I pushed open the door and took a deep breath, steeling myself for whatever lay beyond as I stepped into the unknown.",
        "uk": "Тремтячою рукою я штовхнула двері й глибоко вдихнула, намагаючись прийняти все, що було позаду, коли я ступила у невідоме."
    }
};

export const ui_strings = {
    death: {
        dead: {
            "en": "DEAD",
            "uk": "СМЕРТЬ"
        },
        general: {
            "en": "Too weak.",
            "uk": "Слабак"
        },
        accept: {
            "en": "ACCEPT",
            "uk": "ПРИЙНЯТИ"
        }
    },
    end: {
        end: {
            "en": "THE END",
            "uk": "КІНЕЦЬ"
        },
        message: {
            "en": "Thank you for playing!<br><br>You've reached the end of the demo.<br>",
            "uk": "Дякую за гру!<br><br>Ти досягнув кінця демо.<br>"
        },
        button: {
            "en": "RETURN",
            "uk": "ПОВЕРНУТИСЯ"
        }
    },
    main_menu: {
        play: {
            "en": "PLAY",
            "uk": "ГРАТИ"
        },
        loadgame: {
            "en": "LOAD SAVED",
            "uk": "ЗАВАНТАЖИТИ"
        },
        newgame: {
            "en": "START NEW",
            "uk": "НОВА ГРА"
        },
        controls: {
            "en": "CONTROLS",
            "uk": "КЕРУВАННЯ"
        },
        controls_text: {
            "en": "WASD - move around<br>Mouse - look around<br>LMB - hit<br>E - interact<br>TAB - open Inventory",
            "uk": "WASD - рухатись<br>Миша - озернутись<br>Ліва кнопка миші - удар<br>E - взаємодіяти<br>TAB - відкрити інвентар"
        },
        back: {
            "en": "BACK",
            "uk": "НАЗАД"
        },
        credits: {
            "en": "CREDITS",
            "uk": "ПОСИЛАННЯ"
        },
        credits_text: {
            "en": "Music by Sami Hiltunen, Oleg Kirilkov<br><br>Rain Ambient by JuliusH<br><br>SFX by Darkworld Audio, joseppujol<br><br>Sprites by Maranza",
            "uk": "Музика - Sami Hiltunen, Oleg Kirilkov<br><br>Фон дощу - JuliusH<br><br>Звукові еффекти - Darkworld Audio, joseppujol<br><br>Спрайти - Maranza"
        }
    },
    inventory: {
        journal: {
            "en": "Journal",
            "uk": "Журнал"
        },
        items: {
            "en": "Items",
            "uk": "Речі"
        },
        notes: {
            "en": "Notes",
            "uk": "Записки"
        },
        no_notes: {
            "en": "No notes",
            "uk": "Немає записок"
        },
        keys: {
            "en": "Keys",
            "uk": "Ключі"
        },
        no_keys: {
            "en": "No keys",
            "uk": "Немає ключів"
        },
        equip: {
            "en": "equip",
            "uk": "вдягти"
        },
        unequip: {
            "en": "unequip",
            "uk": "зняти"
        },
        use: {
            "en": "use",
            "uk": "вжити"
        }
    },
    condition: {
        condition: {
            "en": "Condition",
            "uk": "Стан"
        },
        fine: {
            "en": "FINE",
            "uk": "ДОБРЕ"
        },
        caution: {
            "en": "CAUTION",
            "uk": "ОБЕРЕЖНО"
        },
        hurt: {
            "en": "HURT",
            "uk": "ПОРАНЕНО"
        },
        near: {
            "en": "NEAR DEATH",
            "uk": "ПРИСМЕРТІ"
        }
    }
}

export const item_strings = {
    hook: {
        "en": "Rusty fishing hook",
        "uk": "Ржавий гачок"
    },
    fuse: {
        "en": "Fuse",
        "uk": "Запобіжник"
    },
    note_0: {
        "en": "Note from bedroom",
        "uk": "Записка зі спальні"
    },
    note_1: {
        "en": "Note from the door",
        "uk": "Записка з дверей"
    },
    key_0: {
        name: {
            "en": "Bloody key",
            "uk": "Кривавий ключ"
        },
        desc: {
            "en": "Unlocks the master bedroom door",
            "uk": "Відчиняє двері до спальні"
        }
    },
    uv: {
        "en": "UV Stick",
        "uk": "УФ-стік"
    },
    umbrella: {
        "en": "Umbrella",
        "uk": "Парасоля"
    },
    pills: {
        "en": "Pills",
        "uk": "Пігулки"
    },
    key_1: {
        name: {
            "en": "House key",
            "uk": "Ключ від дому"
        },
        desc: {
            "en": "Unlocks the front door",
            "uk": "Відчиняє вхідні двері"
        }
    }
}

export const environment_strings = {
    general: {
        no_space: {
            "en": "No space in inventory",
            "uk": "Немає місця в інвентарі"
        },
        yes: {
            "en": "Yes",
            "uk": "Так"
        },
        no: {
            "en": "No",
            "uk": "Ні"
        },
        remove_fuse: {
            "en": "Remove fuse from the box?",
            "uk": "Вийняти запобіжник з коробки?"
        },
        insert_fuse: {
            "en": "Insert fuse into the box?",
            "uk": "Вставити запобіжник в коробку?"
        },
        no_fuse: {
            "en": "No fuse in inventory",
            "uk": "Немає запобіжника в інвентарі"
        },
        not_powered: {
            "en": "It's not powered",
            "uk": "Немає живлення"
        },
        requires_fuse: {
            "en": "Requires a fuse to power. Insert fuse?",
            "uk": "Для живлення потрібен запобіжник. Вставити запобіжник?"
        },
        terminal: {
            use: {
                "en": "Use Terminal",
                "uk": "Використати термінал"
            },
            remove_fuse: {
                "en": "Remove fuse",
                "uk": "Вийняти запобіжник"
            }
        }
    },
    bedroom: {
        found_hook: {
            "en": "Found a rusty fishing hook. Might be useful.",
            "uk": "Знайдено ржавий гачок. Може знадобитися."
        },
        nothing_useful: {
            "en": "Nothing useful anymore...",
            "uk": "Нема нічого корисного..."
        },
        window: {
            "en": "It's dark and raining...",
            "uk": "Темно та йде дощ..."
        },
        locked_door: {
            "en": "The door is locked...",
            "uk": "Двері зачинено..."
        },
        unlocked_door: {
            "en": "Unlocked",
            "uk": "Відчинено"
        }
    },
    bathroom_0: {
        mirror: {
            "en": "Looks familiar...",
            "uk": "Виглядає знайомо..."
        },
        obtained_key: {
            "en": "Obtained a key.",
            "uk": "Отримано ключ."
        },
        cant_use: {
            "en": "Can't be used here",
            "uk": "Не можна застосувати"
        },
        nothing: {
            "en": "Nothing",
            "uk": "Нічого"
        },
        use_item: {
            "en": "Use item",
            "uk": "Використати річ"
        },
        which_item: {
            "en": "Which item to use?",
            "uk": "Яку річ використати?"
        },
        not_stick: {
            "en": "I'm not sticking my hand in that.",
            "uk": "Я не полізу туди голіруч."
        }
    },
    second_floor: {
        door: {
            "en": "Might be dangerous. Enter anyway?",
            "uk": "Може бути небезпечно. Все одно увійти?"
        },
        art: {
            "en": "Exquisite art...",
            "uk": "Вишукане мистецтво..."
        }
    },
    balcony: {
        paint: {
            "en": "A bunch of luminescent paint...",
            "uk": "Купа люмінесцентної фарби..."
        }
    },
    kids: {
        what: {
            "en": "What the fuck is this?..",
            "uk": "Що це за хуйня?.."
        },
        obtained_stick: {
            "en": "Obtained a light source",
            "uk": "Отримано джерело світла"
        },
        pick: {
            "en": "Pick up the light source?",
            "uk": "Підняти джерело світла?"
        }
    },
    bathroom_1: {
        tub: {
            "en": "Empty...",
            "uk": "Пусто..."
        }
    },
    first_floor: {
        locked: {
            "en": "Locked...",
            "uk": "Зачинено..."
        },
        cant_open: {
            "en": "Can't be opened...",
            "uk": "Неможливо відкрити..."
        },
        blocked: {
            "en": "Blocked from the other side...",
            "uk": "Заблоковано з іншого боку..."
        },
        obtained: {
            "en": "Obtained a weapon",
            "uk": "Отримано зброю"
        },
        umbrella_stand: {
            "en": "The umbrella seems sturdy enough to be used as a weapon. Take it?",
            "uk": "Парасоля здається достатньо міцною, щоб використати як зброю. Взяти?"
        }
    },
    saveroom: {
        office_door: {
            "en": "The lock is connected to the terminal...",
            "uk": "Замок під'єднано до терміналу..."
        },
        savegame: {
            "en": "Do you want to save your progress?",
            "uk": "Бажаєш зберегти свій прогрес?"
        },
        easel: {
            "en": "A portrait in a round frame...",
            "uk": "Портрет у круглій рамці..."
        }
    },
    kitchen: {
        door: {
            "en": "There's no light in the next room. Prepared to go inside?",
            "uk": "У наступній кімнаті немає світла. Готовий зайти усередину?"
        },
        fridge: {
            "en": "Empty...",
            "uk": "Пусто..."
        },
        obtained: {
            "en": "Obtained a healing item",
            "uk": "Отримано медицину"
        }
    },
    office: {
        nothing: {
            "en": "Nothing useful for me...",
            "uk": "Нічого корисного..."
        },
        desk: {
            "en": "Desk...",
            "uk": "Стіл..."
        }
    },
    living: {
        door_office: {
            "en": "No going back now",
            "uk": "Не час повертатися"
        },
        need_key: {
            "en": "Need a key to unlock",
            "uk": "Потрібен ключ"
        },
        take_key: {
            "en": "Take the key from the hand?",
            "uk": "Взяти ключ?"
        },
        not_time: {
            "en": "Now is not the time",
            "uk": "Зараз не час"
        }
    },
    end: {
        unlocked: {
            "en": "Unlocked",
            "uk": "Відчинено"
        },
        not_going_back: {
            "en": "Not going back",
            "uk": "Туди не повернусь"
        },
        leave: {
            "en": "The front door is unlocked now. I can finally leave the house.",
            "uk": "Вхідні двері зараз відчинено. Нарешті я можу вийти з дому."
        },
        go: {
            "en": "Go outside",
            "uk": "Вийти на вулицю"
        }
    }
}