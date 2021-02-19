export class Screen {
    ctx: CanvasRenderingContext2D;

    private fps = 0;
    private lastFps = 0;

    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = this.canvas.getContext("2d")!;

        setInterval(() => {
            this.lastFps = this.fps;
            this.fps = 0;
        }, 1000);
    }

    renderFrame(frame: ImageData) {
        this.ctx.putImageData(frame, 0, 0);
        this.fps++;

        this.ctx.fillStyle = 'white';
        // this.ctx.fillText(this.lastFps.toString(), 10, 10);
    }
}
