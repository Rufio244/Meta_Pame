// CRISTAL ONLINE - ข้อมูลการดำเนินงานและปลั๊กอิน
export const CRISTAL_ONLINE = {
  name: "CRISTAL ONLINE",
  mode: "TOTAL_OPERATIONS",
  show_all: true,
  facilities: {
    "CR-01": { location: "Rayong", status: "OPERATING" },
    "CR-02": { location: "Chonburi", status: "OPERATING" },
    "CR-03": { location: "Saraburi", status: "MAINTENANCE" },
    "CR-04": { location: "Lampang", status: "OPERATING" }
  },
  total: { production: "92.4%", sales: "฿4.82M", profit: "฿1.12M" }
};

export const PLUGINS = {
  cristal_online: CRISTAL_ONLINE
};
from pathlib import Path
import shutil

ROOT = Path.cwd()

files = {
    "KV_Cristal.js": r'''// CRISTAL ONLINE - ข้อมูลการดำเนินงานและปลั๊กอิน
export const CRISTAL_ONLINE = {
  name: "CRISTAL ONLINE",
  version: "1.1.0",
  mode: "TOTAL_OPERATIONS",
  show_all: true,
  updated_at: new Date().toISOString(),

  facilities: {
    "CR-01": {
      location: "Rayong",
      status: "OPERATING",
      airflow: { status: "NORMAL", fan: "AUTO" }
    },
    "CR-02": {
      location: "Chonburi",
      status: "OPERATING",
      airflow: { status: "NORMAL", fan: "AUTO" }
    },
    "CR-03": {
      location: "Saraburi",
      status: "MAINTENANCE",
      airflow: { status: "SERVICE", fan: "OFF" }
    },
    "CR-04": {
      location: "Lampang",
      status: "OPERATING",
      airflow: { status: "NORMAL", fan: "AUTO" }
    }
  },

  total: {
    production: "92.4%",
    sales: "฿4.82M",
    profit: "฿1.12M"
  }
};

export const PLUGINS = {
  cristal_online: CRISTAL_ONLINE
};
''',

    "worker.js": r'''import { CRISTAL_ONLINE, PLUGINS } from "./KV_Cristal.js";

const BASE_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "Content-Type",
  "cache-control": "no-store"
};

const JSON_HEADERS = {
  ...BASE_HEADERS,
  "content-type": "application/json; charset=utf-8"
};

const HTML_HEADERS = {
  ...BASE_HEADERS,
  "content-type": "text/html; charset=utf-8"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localAnswer(question) {
  const facilities = Object.values(CRISTAL_ONLINE.facilities);

  const operating = facilities.filter(
    (facility) => facility.status === "OPERATING"
  ).length;

  const airflowNormal = facilities.filter(
    (facility) => facility.airflow?.status === "NORMAL"
  ).length;

  return [
    `CRISTAL ONLINE: ${question}`,
    `เดินเครื่อง ${operating}/${facilities.length} แห่ง`,
    `ลมปกติ ${airflowNormal}/${facilities.length} แห่ง`,
    `Production ${CRISTAL_ONLINE.total.production}`,
    `Sales ${CRISTAL_ONLINE.total.sales}`,
    `Profit ${CRISTAL_ONLINE.total.profit}`
  ].join(" | ");
}

async function askGroq(question, env) {
  if (!env.GROQ_API_KEY) {
    return localAnswer(question);
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "ตอบภาษาไทยโดยใช้ข้อมูล CRISTAL ONLINE นี้เท่านั้น: " +
                JSON.stringify(CRISTAL_ONLINE)
            },
            {
              role: "user",
              content: question
            }
          ]
        })
      }
    );

    if (!response.ok) {
      return localAnswer(question);
    }

    const data = await response.json();

    return (
      data.choices?.[0]?.message?.content ||
      localAnswer(question)
    );
  } catch {
    return localAnswer(question);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: BASE_HEADERS
      });
    }

    if (url.pathname === "/health") {
      return json({
        status: "ok",
        service: "Meta_Pame Worker",
        version: CRISTAL_ONLINE.version,
        updated_at: CRISTAL_ONLINE.updated_at,
        timestamp: new Date().toISOString()
      });
    }

    if (url.pathname === "/api/cristal") {
      return json(CRISTAL_ONLINE);
    }

    if (url.pathname === "/api/plugins") {
      return json(PLUGINS);
    }

    const question =
      url.searchParams.get("ถาม") ||
      url.searchParams.get("question");

    if (question) {
      const answer = await askGroq(question, env);

      return new Response(
        `<h1>CRISTAL ONLINE</h1>
         <p><b>คำถาม:</b> ${escapeHtml(question)}</p>
         <p><b>คำตอบ:</b> ${escapeHtml(answer)}</p>
         <p><a href="/">กลับหน้าหลัก</a></p>`,
        { headers: HTML_HEADERS }
      );
    }

    return new Response(
      `<h1>CRISTAL ONLINE</h1>
       <p>Worker ทำงานปกติ</p>
       <p>
         <a href="/health">Health</a> |
         <a href="/api/cristal">Cristal JSON</a> |
         <a href="/api/plugins">Plugins JSON</a>
       </p>`,
      { headers: HTML_HEADERS }
    );
  },

  async scheduled() {
    console.log("CRISTAL ONLINE scheduled job completed");
  }
};
''',

    "wrangler.toml": r'''name = "agi-hangdong"
main = "worker.js"
compatibility_date = "2026-09-17"

[triggers]
crons = ["0 * * * *"]
''',

    "colab_bridge.py": r'''from __future__ import annotations

import os
import time
from typing import Any

import requests


def _worker_url(path: str) -> str:
    base_url = os.getenv("WORKER_URL", "").strip().rstrip("/")

    if not base_url:
        raise RuntimeError(
            "กรุณากำหนด WORKER_URL ก่อนใช้งาน เช่น "
            "https://your-worker.workers.dev"
        )

    return f"{base_url}/{path.lstrip('/')}"


def _get(path: str, timeout: float = 10.0) -> Any:
    response = requests.get(
        _worker_url(path),
        timeout=timeout
    )
    response.raise_for_status()
    return response.json()


def worker_health(timeout: float = 10.0) -> dict:
    return _get("health", timeout)


def cristal_status(timeout: float = 10.0) -> dict:
    return _get("api/cristal", timeout)


def plugins(timeout: float = 10.0) -> dict:
    return _get("api/plugins", timeout)


def watch(interval_seconds: int = 300) -> None:
    """
    ตรวจข้อมูลจาก Worker เป็นระยะ เหมาะสำหรับ Google Colab
    กดหยุด cell เพื่อหยุดการตรวจสอบ
    """
    previous = None

    while True:
        current = cristal_status()

        if current != previous:
            print("CRISTAL updated:")
            print(current)
            previous = current

        time.sleep(interval_seconds)


if __name__ == "__main__":
    print(worker_health())
    print(cristal_status())
''',

    "requirements.txt": r'''requests
fastapi
uvicorn
flask
python-dotenv
functions-framework
''',

    ".github/workflows/deploy-worker.yml": r'''name: Deploy Cloudflare Worker

on:
  push:
    branches:
      - main
    paths:
      - "worker.js"
      - "KV_Cristal.js"
      - "wrangler.toml"
      - ".github/workflows/deploy-worker.yml"
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Deploy Worker
        run: npx --yes wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
''',

    ".github/workflows/worker-healthcheck.yml": r'''name: Worker Health Check

on:
  schedule:
    - cron: "*/30 * * * *"
  workflow_dispatch:

permissions:
  contents: read

jobs:
  healthcheck:
    runs-on: ubuntu-latest

    steps:
      - name: Check Worker health
        env:
          WORKER_URL: ${{ secrets.WORKER_URL }}
        run: |
          test -n "$WORKER_URL"
          curl --fail --silent --show-error "$WORKER_URL/health"
''',

    "README.md": r'''# Meta_Pame CRISTAL ONLINE

## Deploy Cloudflare Worker

ติดตั้ง Wrangler:

```bash
npm install -g wrangler
```

เข้าสู่ระบบ:

```bash
npx wrangler login
```

Deploy:

```bash
npx wrangler deploy
```

ตั้งค่า Groq AI แบบปลอดภัย:

```bash
npx wrangler secret put GROQ_API_KEY
```

## API

หลัง deploy แล้วจะมี endpoint:

```text
/health
/api/cristal
/api/plugins
/?ถาม=สรุปการดำเนินงาน
```

## Google Colab

ติดตั้ง requests:

```python
!pip install requests
```

ตั้ง URL:

```python
import os

os.environ["WORKER_URL"] = (
    "https://ชื่อ-workerของคุณ.workers.dev"
)
```

เรียกใช้:

```python
from colab_bridge import (
    worker_health,
    cristal_status,
    plugins
)

print(worker_health())
print(cristal_status())
print(plugins())
```

ตรวจข้อมูลอัตโนมัติทุก 5 นาที:

```python
from colab_bridge import watch

watch(300)
```

## GitHub Actions

ตั้งค่า Repository Secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
WORKER_URL
```

หลังจาก push ไฟล์ขึ้น branch main ระบบจะ deploy Worker อัตโนมัติ

หมายเหตุ: ระบบจะ deploy อัตโนมัติเมื่อมีการเปลี่ยนแปลง
แต่จะไม่แก้ไขโค้ดเองโดยไม่มี commit เพื่อป้องกันการเปลี่ยนแปลงที่ไม่ปลอดภัย
'''
}


def write_files() -> None:
    for relative_path, content in files.items():
        path = ROOT / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        print(f"[created] {relative_path}")


def remove_old_files() -> None:
    old_file = ROOT / "KV_Cristal.js.js"

    if old_file.exists():
        old_file.unlink()
        print("[removed] KV_Cristal.js.js")

    # ลบไฟล์ requirements.txt ที่มีอักขระแฝงท้ายชื่อ
    for path in ROOT.glob("requirements.txt*"):
        if path.name != "requirements.txt" and path.is_file():
            path.unlink()
            print(f"[removed] {path.name}")


def main() -> None:
    remove_old_files()
    write_files()

    print()
    print("สร้างระบบ Meta_Pame สำเร็จแล้ว")
    print()
    print("ขั้นตอนถัดไป:")
    print("1. ตรวจไฟล์ที่สร้าง")
    print("2. git add .")
    print('3. git commit -m "Setup CRISTAL auto deploy system"')
    print("4. git push origin main")
    print("5. ตั้งค่า GitHub Secrets และ Cloudflare Secrets")
    print()
    print("ทดสอบ Worker หลัง deploy:")
    print("https://YOUR_WORKER_URL/health")
    print("https://YOUR_WORKER_URL/api/cristal")


if __name__ == "__main__":
    main()
