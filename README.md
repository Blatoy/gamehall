## TODO
- Read bootrom + cartridge 
- Implement instructions
    - System to convert separate instruction files into one big array for fast access
    - Unit tests
    - Coding
- Make the CPU alive
- Rendering (UI + Screen)

## Blog post
- Binch :)
- Fake todo

```
/*
describe('XOR opcodes', function() {
    describe('XOR a,a', function(mockCPU: MockCPU) {
        mockCPU.initRegisters({ a: 2, b: 8 });
        mockCPU.setStack([0x20, 0x20]); // set SP at the top
        mockCPU.executeInstruction('XOR a,a' | 0xAF);
        it("should work:)", () => {
            mockCPU.expectRegisters({ a: 10, f: { z: 0, n: 0, h: 0, c: 0 } }); // unspecified expected as unchanged
            mockCPU.expectStack([0x20, 0x20]);
        });
    });
});
*/
```