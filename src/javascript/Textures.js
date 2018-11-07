import Metal_Weave_002_COLOR from '../assets/textures/Metal_Weave_002_SD/Metal_Weave_002_COLOR.jpg'
import Metal_Weave_002_DISP from '../assets/textures/Metal_Weave_002_SD/Metal_Weave_002_DISP.png'
import Metal_Weave_002_NORM from '../assets/textures/Metal_Weave_002_SD/Metal_Weave_002_NORM.jpg'
import Metal_Weave_002_OCC from '../assets/textures/Metal_Weave_002_SD/Metal_Weave_002_OCC.jpg'
import Metal_Weave_002_ROUGH from '../assets/textures/Metal_Weave_002_SD/Metal_Weave_002_ROUGH.jpg'

import Encrusted_Gems_002_COLOR from '../assets/textures/Encrusted_Gems_002_SD/Encrusted_Gems_002_COLOR.jpg'
import Encrusted_Gems_002_DISP from '../assets/textures/Encrusted_Gems_002_SD/Encrusted_Gems_002_DISP.png'
import Encrusted_Gems_002_MASK from '../assets/textures/Encrusted_Gems_002_SD/Encrusted_Gems_002_MASK_2.jpg'
import Encrusted_Gems_002_NORM from '../assets/textures/Encrusted_Gems_002_SD/Encrusted_Gems_002_NORM.jpg'
import Encrusted_Gems_002_OCC from '../assets/textures/Encrusted_Gems_002_SD/Encrusted_Gems_002_OCC.jpg'
import Encrusted_Gems_002_ROUGH from '../assets/textures/Encrusted_Gems_002_SD/Encrusted_Gems_002_ROUGH.jpg'

import Lava_005_COLOR from '../assets/textures/Lava_005_SD/Lava_005_COLOR.jpg'
import Lava_005_DISP from '../assets/textures/Lava_005_SD/Lava_005_DISP.png'
import Lava_005_MASK from '../assets/textures/Lava_005_SD/Lava_005_MASK.jpg'
import Lava_005_NORM from '../assets/textures/Lava_005_SD/Lava_005_NORM.jpg'
import Lava_005_OCC from '../assets/textures/Lava_005_SD/Lava_005_OCC.jpg'
import Lava_005_ROUGH from '../assets/textures/Lava_005_SD/Lava_005_ROUGH.jpg'

import Metal_Corrugated_006_ROUGH from '../assets/textures/Metal_Corrugated_006_SD/Metal_Corrugated_006_ROUGH.jpg'
import Metal_Corrugated_006_OCC from '../assets/textures/Metal_Corrugated_006_SD/Metal_Corrugated_006_OCC.jpg'
import Metal_Corrugated_006_NORM from '../assets/textures/Metal_Corrugated_006_SD/Metal_Corrugated_006_NORM.jpg'
import Metal_Corrugated_006_DISP from '../assets/textures/Metal_Corrugated_006_SD/Metal_Corrugated_006_DISP.png'
import Metal_Corrugated_006_COLOR from '../assets/textures/Metal_Corrugated_006_SD/Metal_Corrugated_006_COLOR.jpg'

import Grass_002_OCC from '../assets/textures/Grass_002/Grass_002_OCC.jpg'
import Grass_002_COLOR from '../assets/textures/Grass_002/Grass_002_COLOR.jpg'
import Grass_002_DISP from '../assets/textures/Grass_002/Grass_002_DISP.png'
import Grass_002_NRM from '../assets/textures/Grass_002/Grass_002_NRM.jpg'
import Grass_002_SPEC from '../assets/textures/Grass_002/Grass_002_SPEC.jpg'

import Rock_024_SDAmbientOcclusion from '../assets/textures/Rock_024_SD/Rock_024_ambientOcclusion.jpg'
import Rock_024_SDMap from '../assets/textures/Rock_024_SD/Rock_024_baseColor.jpg'
import Rock_024_SDHeight from '../assets/textures/Rock_024_SD/Rock_024_height.png'
import Rock_024_SDNormal from '../assets/textures/Rock_024_SD/Rock_024_normal.jpg'
import Rock_024_SDRoughness from '../assets/textures/Rock_024_SD/Rock_024_roughness.jpg'

export default
{
    Metal_Weave_002_SD:
    {
        type: 'textures',
        repeat:
        {
            x: 1,
            y: 8
        },
        emissiveColor: 0x000000,
        sources:
        {
            ambientOcclusion: Metal_Weave_002_OCC,
            map: Metal_Weave_002_COLOR,
            height: Metal_Weave_002_DISP,
            normal: Metal_Weave_002_NORM,
            roughness: Metal_Weave_002_ROUGH
        }
    },
    Encrusted_Gems_002_SD:
    {
        type: 'textures',
        repeat:
        {
            x: 1,
            y: 8
        },
        emissiveColor: 0x000033,
        sources:
        {
            ambientOcclusion: Encrusted_Gems_002_OCC,
            map: Encrusted_Gems_002_COLOR,
            height: Encrusted_Gems_002_DISP,
            normal: Encrusted_Gems_002_NORM,
            roughness: Encrusted_Gems_002_ROUGH,
            emissive: Encrusted_Gems_002_MASK
        }
    },
    Lava_005_SD:
    {
        type: 'textures',
        repeat:
        {
            x: 1,
            y: 8
        },
        emissiveColor: 0xff0000,
        sources:
        {
            ambientOcclusion: Lava_005_OCC,
            map: Lava_005_COLOR,
            height: Lava_005_DISP,
            normal: Lava_005_NORM,
            roughness: Lava_005_ROUGH,
            emissive: Lava_005_MASK
        }
    },
    Metal_Corrugated_006_SD:
    {
        type: 'textures',
        repeat:
        {
            x: 1,
            y: 8
        },
        sources:
        {
            ambientOcclusion: Metal_Corrugated_006_OCC,
            map: Metal_Corrugated_006_COLOR,
            height: Metal_Corrugated_006_DISP,
            normal: Metal_Corrugated_006_NORM,
            roughness: Metal_Corrugated_006_ROUGH
        }
    },
    Rock_024_SD:
    {
        type: 'textures',
        repeat:
        {
            x: 2,
            y: 12
        },
        sources:
        {
            ambientOcclusion: Rock_024_SDAmbientOcclusion,
            map: Rock_024_SDMap,
            height: Rock_024_SDHeight,
            normal: Rock_024_SDNormal,
            roughness: Rock_024_SDRoughness
        }
    },
    Grass_002:
    {
        type: 'textures',
        repeat:
        {
            x: 3,
            y: 36
        },
        sources:
        {
            ambientOcclusion: Grass_002_OCC,
            map: Grass_002_COLOR,
            height: Grass_002_DISP,
            normal: Grass_002_NRM,
            specular: Grass_002_SPEC
        }
    },
    Color:
    {
        type: 'colors'
    }
}
