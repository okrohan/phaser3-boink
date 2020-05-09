import { ASSETS_NAMES } from "../../constants";

const {GROUND} = ASSETS_NAMES

export default {
    width: 5000,
    height: 768,
    time: 250,
    minScore: 1,
    playerStart: {
        x: 50,
        y: 250
    },
    finish: {
        x: 1900,
        y: 600
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
enemies: [
    {
        x: 300,
        y: 300,
        key: ASSETS_NAMES.SHIBA,
    },
    {
        x: 1500,
        y: 300,
        key: ASSETS_NAMES.SPIKE,
    },
],
    collectables: [
        {
            x: 500,
            y: 500,
            key: ASSETS_NAMES.STAR
        },
        {
            x: 1300,
            y: 600,
            key: ASSETS_NAMES.STAR
        }
    ]
}