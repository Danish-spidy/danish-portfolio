"""Portfolio HD demo."""
import asyncio, shutil
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).parent / "docs"
OUT.mkdir(exist_ok=True)
TMP = OUT / "_vt"

async def main():
    if TMP.exists(): shutil.rmtree(TMP)
    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=True)
        ctx = await b.new_context(viewport={"width":1920,"height":1080}, record_video_dir=str(TMP), record_video_size={"width":1920,"height":1080})
        p = await ctx.new_page()
        await p.goto("http://127.0.0.1:8989", wait_until="networkidle")
        await p.wait_for_timeout(1500)
        await p.screenshot(path=str(OUT/"hero.png"))
        for _ in range(8):
            await p.mouse.wheel(0, 800)
            await p.wait_for_timeout(2800)
        await ctx.close()
        await b.close()
    for v in TMP.glob("*.webm"):
        shutil.move(str(v), str(OUT/"demo.webm")); break
    shutil.rmtree(TMP, ignore_errors=True)
    print("[done] portfolio")

if __name__ == "__main__":
    asyncio.run(main())
