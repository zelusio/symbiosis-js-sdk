import { Zapping } from './zapping'

export class ZapToAave extends Zapping {
    public async exactIn() {
        throw new Error('Not implemented')
    }
}
