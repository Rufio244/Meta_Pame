# auto_save.py - รันก่อนปิด
import subprocess
subprocess.run(["git", "add", "Cristal_Core/", "Js/", "Rufio_bot/"])
subprocess.run(["git", "commit", "-m", "Cristal auto-save #AGI244"])
subprocess.run(["git", "push", "origin", "main"])
