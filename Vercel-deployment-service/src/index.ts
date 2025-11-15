import {createClient} from 'redis'
import { copyFinalDist, downloadS3Folder } from './aws.js'
import { buildProject } from './utils.js'
const subcriber = createClient()
subcriber.connect()
const publisher = createClient()
publisher.connect()

async function main() {
    while(1){
        const response = await subcriber.brPop(
            'build-queue',
            0
        )
        //@ts-ignore
        const id= response.element
        await downloadS3Folder(`output/${id}`)
        console.log('downloaded')
        await buildProject(id)
        copyFinalDist(id)
        publisher.hSet('status',id,'deployed')
    }
}
main()