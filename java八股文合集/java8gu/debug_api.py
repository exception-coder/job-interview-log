from playwright.sync_api import sync_playwright
import json
from pathlib import Path

USER_DATA_DIR = Path.home() / 'Library' / 'Caches' / 'playwright-yuque-profile'
DOC_ID = 'pg23qhb7rgnuamd1'

with sync_playwright() as p:
    context = p.chromium.launch_persistent_context(str(USER_DATA_DIR), headless=False)
    page = context.new_page()

    print('Opening yuque login page...')
    page.goto('https://www.yuque.com/login', wait_until='domcontentloaded', timeout=30000)

    # Check if already logged in (redirected away from login)
    if 'login' not in page.url:
        print(f'Already logged in! URL: {page.url}')
    else:
        print('*** 请在浏览器中完成登录，登录成功后脚本将自动继续... ***')
        # Wait until redirected away from login page
        page.wait_for_function(
            "() => !window.location.href.includes('/login')",
            timeout=300000
        )
        print(f'Login successful! URL: {page.url}')

    cookies = context.cookies(['https://www.yuque.com'])
    print(f'Cookies: {[c["name"] for c in cookies]}')

    # Now test API
    api_responses = []
    def handle_response(response):
        if '/api/docs/' in response.url:
            print(f'API: {response.url} -> {response.status}')
            try:
                api_responses.append({'url': response.url, 'body': response.text()})
            except:
                pass
    page.on('response', handle_response)

    page.goto(f'https://www.yuque.com/hollis666/fsn3og/{DOC_ID}', wait_until='networkidle', timeout=30000)

    print('\nCaptured API calls:')
    for r in api_responses:
        print(f"URL: {r['url']}")
        data = json.loads(r['body'])
        content = data.get('data', {}).get('content', '')
        print(f"Status in body: {data.get('status')}")
        print(f"Content length: {len(content)}")
        print(f"Content preview: {content[:200]}")
        print()

    context.close()
