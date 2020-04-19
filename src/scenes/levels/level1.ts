import { ASSETS_NAMES } from "../../constants";

const {GROUND} = ASSETS_NAMES
const HEIGHT = 768
const getY = (n: number) => HEIGHT - n
export default {
    width: 2000,
    height: 768,
    playerStart: {
        x: 50,
        y: getY(200)
    },
    sprites: [
        {
        x: 50,
        y: getY(50),
        key: GROUND.SMALL,
        scale: 0.2,
    },
        {
            x: 700,
            y: getY(100),
            key: GROUND.LARGE,
            scale: 0.2,
        },
        {
            x: 500,
            y: getY(300),
            key: GROUND.TINY,
            scale: 0.2,
        },
        {
            x: 1200,
            y: getY(500),
            key: GROUND.SMALL,
        
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