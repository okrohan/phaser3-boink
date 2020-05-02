import { ASSETS_NAMES } from "../../constants";

const {GROUND} = ASSETS_NAMES

export default {
    width: 5000,
    height: 768,
    time: 300,
    playerStart: {
        x: 50,
        y: 250
    },
    platforms: [
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
],
tiles: [
    {
        x: 0,
        x2: 1500,
        y: 50,
        key: GROUND.GROUND
    },
    {
        x: 1800,
        x2: 3000,
        y: 50,
        key: GROUND.GROUND
    },
],
thingsThatHurt: [
    {
        x: 1500,
        y: 300,
        key: GROUND.OOH_BOI,
    }
]
}