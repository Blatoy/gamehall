import { ExtendedInstruction } from './instruction.js';
import Instructions from './instructions/index.js';

{
    const table = document.getElementById('instructions')!;
    const headline = document.getElementById('instructions-num')!;
    const empty = 'd3,e3,e4,f4,db,eb,dd,ec,ed,fc,fd'.split(/,/g);
    const total = Instructions.length;
    let good = 0;

    for (let row = -1; row < 16; row++) {
        const tr = document.createElement('tr');
        for (let col = -1; col < 16; col++) {
            let td: HTMLTableHeaderCellElement | HTMLTableDataCellElement;
            if (col === -1 || row === -1) {
                td = document.createElement('th');
                if (row >= 0) {
                    td.innerText = `${row.toString(16)}x`;
                } else if (col >= 0) {
                    td.innerText = `x${col.toString(16)}`;
                }
            } else {
                td = document.createElement('td');

                const isEmpty = empty.includes(`${row.toString(16)}${col.toString(16)}`);
                const instructions = Instructions.filter(i => i.code === col + 16 * row);
                const instruction = instructions[0];
                if (instructions.length > 1) {
                    td.innerText = '!OVERLAP!';
                    td.style.backgroundColor = '#FF0000';
                } else if (!instruction && !isEmpty) {
                    td.innerText = '!N/A!';
                    td.style.color = '#AA5555';
                } else if (instruction && isEmpty) {
                    td.style.backgroundColor = '#FF0000';
                    td.innerText = 'SHOULD BE EMPTY';
                } else if (instruction) {
                    if ('comment' in instruction && !!instruction.comment) {
                        td.title = instruction.comment;
                    }
                    td.innerText = instruction.name;
                    if ('execute' in instruction && instruction.execute.toString().includes('NotImplementedError')) {
                        td.style.backgroundColor = '#883333';
                    } else {
                        good++;
                    }
                }
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    headline.innerText = `${(good / total * 100).toFixed(1)}% (${good} of ${total})`;
}

{
    const table = document.getElementById('cb')!;
    const headline = document.getElementById('cb-num')!;
    const empty = ''.split(/,/g);
    const childInstructions = (Instructions.find(i => i.code === 0xCB) as ExtendedInstruction).extendedInstructions;
    const total = childInstructions.length;
    let good = 0;

    for (let row = -1; row < 16; row++) {
        const tr = document.createElement('tr');
        for (let col = -1; col < 16; col++) {
            let td: HTMLTableHeaderCellElement | HTMLTableDataCellElement;
            if (col === -1 || row === -1) {
                td = document.createElement('th');
                if (row >= 0) {
                    td.innerText = `${row.toString(16)}x`;
                } else if (col >= 0) {
                    td.innerText = `x${col.toString(16)}`;
                }
            } else {
                td = document.createElement('td');

                const isEmpty = empty.includes(`${row.toString(16)}${col.toString(16)}`);
                const instructions = childInstructions.filter(i => i.code === col + 16 * row);
                const instruction = instructions[0];
                if (instructions.length > 1) {
                    td.innerText = '!OVERLAP!';
                    td.style.backgroundColor = '#FF0000';
                } else if (!instruction && !isEmpty) {
                    td.innerText = '!N/A!';
                    td.style.color = '#AA5555';
                } else if (instruction && isEmpty) {
                    td.style.backgroundColor = '#FF0000';
                    td.innerText = 'SHOULD BE EMPTY';
                } else if (instruction) {
                    if ('comment' in instruction && !!instruction.comment) {
                        td.title = instruction.comment;
                    }
                    td.innerText = instruction.name;
                    if ('execute' in instruction && instruction.execute.toString().includes('NotImplementedError')) {
                        td.style.backgroundColor = '#883333';
                    } else {
                        good++;
                    }
                }
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    headline.innerText = `${(good / total * 100).toFixed(1)}% (${good} of ${total})`;
}
