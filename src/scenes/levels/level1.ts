import { ASSETS_NAMES } from "../../constants";

const {GROUND} = ASSETS_NAMES

export default {
    width: 5000,
    height: 768,
    playerStart: {
        x: 50,
        y: 250
    },
    sprites: [
        {
        x: 50,
        y: 50,
        key: GROUND.SMALL,
        scale: 0.2,
    },
        {
            x: 700,
            y: 100,
            key: GROUND.LARGE,
            scale: 0.2,
        },
        {
            x: 130,
            y: 400,
            key: GROUND.SMALL,
            scale: 0.2,
        },
        {
            x: 1200,
            y: 500,
            key: GROUND.SMALL,
        
        },
        {
            x: 900,
            y: 300,
            key: GROUND.TINY,
            scale: 0.2,
        },
        {
            x: 1200,
            y: 500,
            key: GROUND.OOH_BOI,
        },
        {
            x: 1500,
            y: 300,
            key: GROUND.OOH_BOI,
        }
]
}