import level from './level1'
import { invertYs } from '../../utils';

export const getLevel = () => {
    const cloned = JSON.parse(JSON.stringify(level))
    invertYs(cloned)
    return cloned
}
