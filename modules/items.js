import { item_strings, locale } from "./localisation.js"

export const item_collection = {
    hook: {
        name: "hook",
        fullName: item_strings.hook[locale],
        quantity: 1,
        img: "./misc/items/hook.png"
    },
    note_0: {
        name: "bedroom_note",
        fullName: item_strings.note_0[locale],
        icon: undefined,
        text: undefined,
        img: "./misc/notes/bedroom_note.png"
    },
    fuse: {
        name: "fuse",
        fullName: item_strings.fuse[locale],
        text: "Protect against excessive current",
        quantity: 1,
        img: "./misc/items/fuse.png"
    },
    key_0: {
        name: "bedroom_key",
        fullName: item_strings.key_0.name[locale],
        text: item_strings.key_0.desc[locale],
        quantity: 1,
        img: undefined
    },
    note_1: {
        name: "door_note",
        fullName: item_strings.note_1[locale],
        icon: undefined,
        text: undefined,
        img: "./misc/notes/door_note.png"
    },
    uv: {
        name: "uv",
        fullName: item_strings.uv[locale],
        text: "Emmits ultraviolet light",
        quantity: 1,
        img: "./misc/items/uv.png",
        equippable: true
    },
    umbrella: {
        name: "umbrella",
        fullName: item_strings.umbrella[locale],
        text: "Can be used to as a weapon",
        quantity: 1,
        img: "./misc/items/umbrella.png",
        equippable: true
    },
    pills: {
        name: "pills",
        fullName: item_strings.pills[locale],
        text: "Restore your health",
        quantity: 1,
        img: "./misc/items/pills.png",
        heal: 40
    },
    key_1: {
        name: "house_key",
        fullName: item_strings.key_1.name[locale],
        text: item_strings.key_1.desc[locale],
        quantity: 1,
        img: undefined
    }
}