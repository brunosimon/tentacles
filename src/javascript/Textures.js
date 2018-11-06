import Grass_002AmbientOcclusion from '../assets/textures/Grass_002/Grass_002_OCC.jpg'
import Grass_002Map from '../assets/textures/Grass_002/Grass_002_COLOR.jpg'
import Grass_002Height from '../assets/textures/Grass_002/Grass_002_DISP.png'
import Grass_002Normal from '../assets/textures/Grass_002/Grass_002_NRM.jpg'
import Grass_002Emissive from '../assets/textures/Grass_002/Grass_002_SPEC.jpg'

import Rock_024_SDAmbientOcclusion from '../assets/textures/Rock_024_SD/Rock_024_ambientOcclusion.jpg'
import Rock_024_SDMap from '../assets/textures/Rock_024_SD/Rock_024_baseColor.jpg'
import Rock_024_SDHeight from '../assets/textures/Rock_024_SD/Rock_024_height.png'
import Rock_024_SDNormal from '../assets/textures/Rock_024_SD/Rock_024_normal.jpg'
import Rock_024_SDRoughness from '../assets/textures/Rock_024_SD/Rock_024_roughness.jpg'

export default
{
    Rock_024_SD:
    {
        ambientOcclusion: Rock_024_SDAmbientOcclusion,
        map: Rock_024_SDMap,
        height: Rock_024_SDHeight,
        normal: Rock_024_SDNormal,
        roughness: Rock_024_SDRoughness
    },
    Grass_002:
    {
        ambientOcclusion: Grass_002AmbientOcclusion,
        map: Grass_002Map,
        height: Grass_002Height,
        normal: Grass_002Normal,
        emissive: Grass_002Emissive
    },
    Color:
    {
        colors: true
    }
}
