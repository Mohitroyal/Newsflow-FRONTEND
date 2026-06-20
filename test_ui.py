import asyncio
from playwright.async_api import async_playwright

async def test_flow():
    print("Starting browser test...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("Navigating to http://localhost:3000/login ...")
        await page.goto("http://localhost:3000/login")
        
        # Wait for login form
        await page.wait_for_selector('input[type="email"]')
        
        # Fill credentials
        print("Filling credentials...")
        await page.fill('input[type="email"]', 'test@test.com')
        await page.fill('input[type="password"]', 'password123')
        
        # Click login
        print("Clicking submit...")
        await page.click('button[type="submit"]')
        
        # Wait for dashboard to load
        print("Waiting for dashboard...")
        try:
            await page.wait_for_url("**/dashboard", timeout=5000)
            print("Successfully logged in!")
        except Exception as e:
            print("Failed to login! URL is:", page.url)
            print(await page.content())
            await browser.close()
            return
        
        # Test Sign Out
        print("Clicking Sign Out...")
        try:
            await page.click('text="Sign Out"')
            # Wait for redirect to home or login
            await page.wait_for_url("http://localhost:3000/", timeout=5000)
            print("Successfully signed out and redirected to home!")
        except Exception as e:
            print("Failed to sign out! URL is:", page.url)
            print(e)
            
        await browser.close()
        print("Test completed.")

if __name__ == "__main__":
    asyncio.run(test_flow())
