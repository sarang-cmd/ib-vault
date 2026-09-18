#!/usr/bin/env python3
"""
IB Vault — Automated Link Checker
Checks HTTP status of all resources in src/data/resources.json.
Instead of deleting dead links, flags them with status: "broken"
and logs the failure reason for manual or automated verification.
"""

import json
import urllib.request
import urllib.error
import ssl
import sys
import time
from datetime import datetime

RESOURCES_FILE = "src/data/resources.json"
REPORT_FILE = "link_check_report.json"

# Bypass SSL verify for mirrors with community certs, set realistic timeout
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) IB-Vault-LinkChecker/1.0"
}

def check_url(url, retries=2):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS, method="HEAD")
            with urllib.request.urlopen(req, timeout=8, context=ssl_context) as resp:
                if resp.status < 400:
                    return True, resp.status
        except urllib.error.HTTPError as e:
            # Some servers block HEAD requests; try GET
            try:
                get_req = urllib.request.Request(url, headers=HEADERS, method="GET")
                with urllib.request.urlopen(get_req, timeout=8, context=ssl_context) as resp2:
                    if resp2.status < 400:
                        return True, resp2.status
            except Exception as e2:
                if attempt == retries - 1:
                    return False, str(e.code)
            if attempt == retries - 1:
                return False, str(e.code)
        except Exception as e:
            if attempt == retries - 1:
                return False, str(e)
        time.sleep(0.5)
    return False, "Failed"

def run_checker():
    print(f"[{datetime.now().isoformat()}] Starting IB Vault Link Health Check...")
    
    try:
        with open(RESOURCES_FILE, "r", encoding="utf-8") as f:
            resources = json.load(f)
    except Exception as e:
        print(f"Error loading {RESOURCES_FILE}: {e}")
        sys.exit(1)

    total = len(resources)
    broken_count = 0
    passed_count = 0
    report = []

    print(f"Checking {total} resources...")

    for i, item in enumerate(resources):
        url = item.get("url")
        name = item.get("name")
        print(f"[{i+1}/{total}] Checking {name} ({url})...", end=" ", flush=True)

        # Skip anchor links or relative URLs
        if not url.startswith("http"):
            print("Skipped (non-HTTP)")
            continue

        ok, detail = check_url(url)
        if ok:
            print(f"OK ({detail})")
            passed_count += 1
            if item.get("status") == "broken":
                item["status"] = "approved" # Recovered!
        else:
            print(f"FAILED ({detail})")
            broken_count += 1
            item["status"] = "broken"
            report.append({
                "id": item.get("id"),
                "name": name,
                "url": url,
                "error": detail,
                "checked_at": datetime.now().isoformat()
            })

    # Save updated dataset
    with open(RESOURCES_FILE, "w", encoding="utf-8") as f:
        json.dump(resources, f, indent=2, ensure_ascii=False)

    # Save report
    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total_checked": total,
            "passed": passed_count,
            "broken": broken_count,
            "broken_items": report
        }, f, indent=2)

    print("\n--- Summary ---")
    print(f"Total: {total}")
    print(f"Passed: {passed_count}")
    print(f"Broken: {broken_count}")
    print(f"Report saved to {REPORT_FILE}")

if __name__ == "__main__":
    run_checker()
