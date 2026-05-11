from playwright.sync_api import sync_playwright

p = sync_playwright().start()
b = p.chromium.launch(headless=False)
page = b.new_page()
page.goto('https://vercel.com')
page.screenshot(path=r'C:\Users\MRT\.copaw\workspaces\default\vercel.png')
b.close()
p.stop()
print('OK')
