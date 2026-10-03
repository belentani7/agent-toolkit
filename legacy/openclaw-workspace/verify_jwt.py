import json, urllib.request, base64, re, subprocess

token = subprocess.check_output(["gh", "auth", "token"], text=True).strip()

def get_file(repo, path):
    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/contents/{path}",
        headers={"Authorization": f"Bearer {token}",
                 "Accept": "application/vnd.github+json", "User-Agent": "x"})
    return json.load(urllib.request.urlopen(req))

for repo in ["belentani7/abrazo-tender-words", "belentani7/tender-words-connect"]:
    d = get_file(repo, ".env")
    txt = base64.b64decode(d["content"]).decode("utf-8", "ignore")
    print("=====", repo)
    for line in txt.splitlines():
        line = line.strip()
        if not line or "=" not in line:
            continue
        k, v = line.split("=", 1)
        v = v.strip().strip('"').strip("'")
        k = k.strip()
        if v.startswith("eyJ"):
            try:
                payload = v.split(".")[1]
                payload += "=" * (-len(payload) % 4)
                p = json.loads(base64.urlsafe_b64decode(payload))
                print(f"  {k}: JWT role={p.get('role')} iss={p.get('iss')}")
            except Exception as e:
                print(f"  {k}: jwt decode fail {e}")
        else:
            print(f"  {k} = {v[:50]}")
