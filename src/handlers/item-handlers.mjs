import { Table } from './Table.mjs';
import { controler } from './controler.mjs';

const itemTable = new Table();
const fn = (body) => { return { id: body.id, name: body.name }; };

export const itemHandler = async (event) => {
    return controler(itemTable, fn, event);
}
