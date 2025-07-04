import { registerCamera, syncCamerasFrom } from '../../lib/cameras.ts'
import { generateLoader } from '../../lib/loader.ts'
import type { Model } from '../../lib/model.ts'
import { show3d } from '../../stores/settings.ts'
import { url } from '../../stores/url.ts'
import { getButton } from '../button/index.ts'

let status = document.querySelector<HTMLDivElement>('.minimodel_status')!
let canvas = document.querySelector<HTMLCanvasElement>('.minimodel_canvas')!

getButton('3d')?.addEventListener('click', () => {
    url.set('3d')
})

let load = generateLoader(
    status,
    () => import('../../lib/model.ts'),
    url.get() === '3d' ? 0 : 400
)

let model: Model | undefined

function checkRendering(): void {
    if (show3d.get() && url.get() !== '3d') {
        if (!model) {
            load(({ initCanvas }) => {
                model = initCanvas(canvas)
                registerCamera(model.camera, 'mini')
            })
        } else {
            model.start()
        }
    } else if (model?.started) {
        model.stop()
    }
}
show3d.subscribe(checkRendering)
url.subscribe(checkRendering)

url.listen(value => {
    if (value === '3d') syncCamerasFrom('mini')
})
