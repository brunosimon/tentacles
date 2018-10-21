import Abstract_001AmbientOcclusion from '../assets/textures/Abstract_001/Abstract_001_OCC.jpg'
import Abstract_001Map from '../assets/textures/Abstract_001/Abstract_001_COLOR.jpg'
import Abstract_001Height from '../assets/textures/Abstract_001/Abstract_001_DISP.png'
import Abstract_001Normal from '../assets/textures/Abstract_001/Abstract_001_NRM.jpg'
import Abstract_001Emissive from '../assets/textures/Abstract_001/Abstract_001_SPEC.jpg'

import Alien_Muscle_001_SDAmbientOcclusion from '../assets/textures/Alien_Muscle_001_SD/Alien_Muscle_001_OCC.jpg'
import Alien_Muscle_001_SDMap from '../assets/textures/Alien_Muscle_001_SD/Alien_Muscle_001_COLOR.jpg'
import Alien_Muscle_001_SDHeight from '../assets/textures/Alien_Muscle_001_SD/Alien_Muscle_001_DISP.png'
import Alien_Muscle_001_SDNormal from '../assets/textures/Alien_Muscle_001_SD/Alien_Muscle_001_NORM.jpg'
import Alien_Muscle_001_SDEmissive from '../assets/textures/Alien_Muscle_001_SD/Alien_Muscle_001_SPEC.jpg'

import Crystal_001AmbientOcclusion from '../assets/textures/Crystal_001_SD/Crystal_001_OCC.jpg'
import Crystal_001_SDMap from '../assets/textures/Crystal_001_SD/Crystal_001_COLOR.jpg'
import Crystal_001_SDHeight from '../assets/textures/Crystal_001_SD/Crystal_001_DISP.png'
import Crystal_001_SDNormal from '../assets/textures/Crystal_001_SD/Crystal_001_NORM.jpg'
import Crystal_001_SDEmissive from '../assets/textures/Crystal_001_SD/Crystal_001_SPEC.jpg'

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

import Stylized_Bark_001_SDAmbientOcclusion from '../assets/textures/Stylized_Bark_001_SD/Stylized_Bark_001_OCC.jpg'
import Stylized_Bark_001_SDMap from '../assets/textures/Stylized_Bark_001_SD/Stylized_Bark_001_COLOR.jpg'
import Stylized_Bark_001_SDHeight from '../assets/textures/Stylized_Bark_001_SD/Stylized_Bark_001_DISP.png'
import Stylized_Bark_001_SDNormal from '../assets/textures/Stylized_Bark_001_SD/Stylized_Bark_001_NORM.jpg'
import Stylized_Bark_001_SDEmissive from '../assets/textures/Stylized_Bark_001_SD/Bark_001_SPEC.jpg'

import Stylized_Bark_002_SDAmbientOcclusion from '../assets/textures/Stylized_Bark_002_SD/Stylized_Bark_002_OCC.jpg'
import Stylized_Bark_002_SDMap from '../assets/textures/Stylized_Bark_002_SD/Stylized_Bark_002_COLOR.jpg'
import Stylized_Bark_002_SDHeight from '../assets/textures/Stylized_Bark_002_SD/Stylized_Bark_002_DISP.png'
import Stylized_Bark_002_SDNormal from '../assets/textures/Stylized_Bark_002_SD/Stylized_Bark_002_NORM.jpg'
import Stylized_Bark_002_SDRoughness from '../assets/textures/Stylized_Bark_002_SD/Stylized_Bark_002_ROUGH.jpg'

export default
{
    Abstract_001:
    {
        ambientOcclusion: Abstract_001AmbientOcclusion,
        map: Abstract_001Map,
        height: Abstract_001Height,
        normal: Abstract_001Normal,
        emissive: Abstract_001Emissive
    },
    Alien_Muscle_001_SD:
    {
        ambientOcclusion: Alien_Muscle_001_SDAmbientOcclusion,
        map: Alien_Muscle_001_SDMap,
        height: Alien_Muscle_001_SDHeight,
        normal: Alien_Muscle_001_SDNormal,
        emissive: Alien_Muscle_001_SDEmissive
    },
    Crystal_001_SD:
    {
        ambientOcclusion: Crystal_001AmbientOcclusion,
        map: Crystal_001_SDMap,
        height: Crystal_001_SDHeight,
        normal: Crystal_001_SDNormal,
        emissive: Crystal_001_SDEmissive
    },
    Grass_002:
    {
        ambientOcclusion: Grass_002AmbientOcclusion,
        map: Grass_002Map,
        height: Grass_002Height,
        normal: Grass_002Normal,
        emissive: Grass_002Emissive
    },
    Rock_024_SD:
    {
        ambientOcclusion: Rock_024_SDAmbientOcclusion,
        map: Rock_024_SDMap,
        height: Rock_024_SDHeight,
        normal: Rock_024_SDNormal,
        roughness: Rock_024_SDRoughness
    },
    Stylized_Bark_001_SD:
    {
        ambientOcclusion: Stylized_Bark_001_SDAmbientOcclusion,
        map: Stylized_Bark_001_SDMap,
        height: Stylized_Bark_001_SDHeight,
        normal: Stylized_Bark_001_SDNormal,
        emissive: Stylized_Bark_001_SDEmissive
    },
    Stylized_Bark_002_SD:
    {
        ambientOcclusion: Stylized_Bark_002_SDAmbientOcclusion,
        map: Stylized_Bark_002_SDMap,
        height: Stylized_Bark_002_SDHeight,
        normal: Stylized_Bark_002_SDNormal,
        roughness: Stylized_Bark_002_SDRoughness
    }
}
