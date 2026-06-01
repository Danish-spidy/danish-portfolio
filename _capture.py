"""Portfolio HD capture — fresh hero + project-scene screenshots + demo video."""
import asyncio, shutil
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).parent / "docs"
OUT.mkdir(exist_ok=True)
TMP = OUT / "_vt"
URL = "http://127.0.0.1:8989"

async def main():
    if TMP.exists(): shutil.rmtree(TMP)
    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=True)
        ctx = await b.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=2,
            record_video_dir=str(TMP),
            record_video_size={"width": 1920, "height": 1080},
        )
        p = await ctx.new_page()
        await p.goto(URL, wait_until="networkidle")
        await p.wait_for_timeout(2000)

        # 1) Hero — the first impression
        await p.screenshot(path=str(OUT / "hero.png"))

        # 2) Scroll through and grab two clean project scenes
        shots = {2: "scene-flagship.png", 6: "scene-project.png"}
        for i in range(1, 9):
            await p.mouse.wheel(0, 900)
            await p.wait_for_timeout(2600)
            if i in shots:
                await p.screenshot(path=str(OUT / shots[i]))

        await ctx.close()
        await b.close()

    for v in TMP.glob("*.webm"):
        shutil.move(str(v), str(OUT / "demo.webm")); break
    shutil.rmtree(TMP, ignore_errors=True)
    print("[done] portfolio capture — hero + 2 scenes + demo.webm")

if __name__ == "__main__":
    asyncio.run(main())
