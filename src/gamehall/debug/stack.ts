import { CPU } from "../cpu.js";
import { DisplayType, getFormattedValue } from "./debug.js";


const MAX_STACK_LENGTH = 32;
const TABLE = document.getElementById("stack-table") as HTMLTableElement;

export function updateStack(cpu: CPU, displayType: DisplayType) {
    // TODO: Clear only non-header rows, then add this back to the HTML where it "belongs"
    TABLE.innerHTML = `<tr><th>Address</th><th>Value</th></tr>`;

    let sp = cpu.registers.sp.getUint();
    let maxValue = Math.min(0xFFFE, sp + 1 + MAX_STACK_LENGTH);

    // SP is at 0 when we start and shouldn't be there otherwise
    if (sp === 0) {
        return;
    }
    
    for (let i = sp + 1; i <= maxValue; i++) {
        const newRow = TABLE.insertRow();
        newRow.insertCell().innerText = '$' + getFormattedValue(i, DisplayType.Hex);
        newRow.insertCell().innerText = getFormattedValue(cpu.pointer8(i).getUint(), displayType);
    }
}
