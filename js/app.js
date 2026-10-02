(function () {
        "use strict";

        /* ================= storage (per-browser demo data) ================= */
        const KEY = "r3d.state.v1",
          SKEY = "r3d.session.v1",
          mem = {};
        const lget = (k) => {
          try {
            const v = localStorage.getItem(k);
            if (v) return JSON.parse(v);
          } catch (e) {}
          return mem[k] ? JSON.parse(mem[k]) : null;
        };
        const lset = (k, v) => {
          const s = JSON.stringify(v);
          mem[k] = s;
          try {
            localStorage.setItem(k, s);
          } catch (e) {}
        };
        const sget = (k) => {
          try {
            const v = sessionStorage.getItem(k);
            if (v) return JSON.parse(v);
          } catch (e) {}
          return mem["s" + k] ? JSON.parse(mem["s" + k]) : null;
        };
        const sset = (k, v) => {
          const s = JSON.stringify(v);
          mem["s" + k] = s;
          try {
            sessionStorage.setItem(k, s);
          } catch (e) {}
        };
        const sdel = (k) => {
          delete mem["s" + k];
          try {
            sessionStorage.removeItem(k);
          } catch (e) {}
        };

        /* ================= constants ================= */
        const PRI = ["Low", "Normal", "High", "Urgent"];
        const PRESETS = {
          Draft: { res: "1280×720", rate: 12 },
          Production: { res: "1920×1080", rate: 6 },
          Final: { res: "3840×2160", rate: 3 },
        };
        const TYPES = [
          "Character model",
          "Texture set",
          "Rig",
          "Animation",
          "Scene",
          "UI element",
          "Environment",
          "Prop",
        ];
        const FORMATS = {
          "Character model": ".fbx",
          "Texture set": ".png",
          Rig: ".blend",
          Animation: ".fbx",
          Scene: ".blend",
          "UI element": ".svg",
          Environment: ".usd",
          Prop: ".obj",
        };
        const A_STATUS = [
          "Draft",
          "In review",
          "Approved",
          "Changes requested",
        ];
        const A_CHIP = {
          Draft: "--st-queued",
          "In review": "--st-warn",
          Approved: "--st-done",
          "Changes requested": "--st-fail",
        };
        const J_CHIP = {
          queued: ["Queued", "--st-queued"],
          rendering: ["Rendering", "--st-render"],
          done: ["Done", "--st-done"],
          failed: ["Failed", "--st-fail"],
          cancelled: ["Cancelled", "--st-cancel"],
        };
        const NAV = {
          admin: [
            ["overview", "Overview", "grid"],
            ["assets", "Asset library", "cube"],
            ["queue", "Render queue", "queue"],
            ["outputs", "Outputs", "film"],
            ["users", "Users", "users"],
            ["activity", "Activity log", "pulse"],
          ],
          user: [
            ["overview", "My workspace", "grid"],
            ["assets", "Asset library", "cube"],
            ["queue", "My renders", "queue"],
            ["outputs", "My outputs", "film"],
          ],
        };
        const ICONS = {
          grid: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
          cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5M12 12L4 7.5M12 12v9"/>',
          queue:
            '<path d="M4 6h16M4 12h9M4 18h6"/><path d="M16 14.5l5 3.5-5 3.5z"/>',
          film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 15h18M8 4v16M16 4v16"/>',
          users:
            '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.2a3 3 0 010 5.6M18 14.4c1.9.8 3 2.7 3 5.6"/>',
          pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
          out: '<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
          plus: '<path d="M12 5v14M5 12h14"/>',
          x: '<path d="M6 6l12 12M18 6L6 18"/>',
          redo: '<path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7"/>',
          pause: '<path d="M8 5v14M16 5v14"/>',
          play: '<path d="M7 4l13 8-13 8z"/>',
          copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
          check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
          send: '<path d="M4 12l16-8-6 16-3-7z"/>',
          trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
        };

        /* ================= seed data ================= */
        function seed() {
          const t = Date.now(),
            M = 60000,
            H = 3600000,
            D = 86400000;
          const vers = (n, by, notes, ago) =>
            Array.from({ length: n }, (_, i) => ({
              v: i + 1,
              note: notes[i] || "Updated file",
              by,
              at: t - ago - (n - 1 - i) * 1.5 * D,
            }));
          const asset = (
            id,
            name,
            type,
            owner,
            status,
            fmt,
            size,
            n,
            notes,
            ago,
          ) => ({
            id,
            name,
            type,
            owner,
            status,
            fmt,
            size,
            updated: t - ago,
            versions: vers(n, owner, notes, ago),
          });
          const assets = [
            asset(
              "AST-0101",
              "Captain Marlo",
              "Character model",
              "artist",
              "Approved",
              ".fbx",
              84,
              4,
              [
                "Base mesh",
                "Retopology",
                "Face blendshapes",
                "Final sculpt pass",
              ],
              2 * D,
            ),
            asset(
              "AST-0102",
              "Captain Marlo skin and cloth",
              "Texture set",
              "artist",
              "Approved",
              ".png",
              312,
              2,
              ["4K UDIM set", "Wear and dirt pass"],
              2 * D + 3 * H,
            ),
            asset(
              "AST-0103",
              "Marlo biped rig",
              "Rig",
              "noel",
              "Approved",
              ".blend",
              41,
              5,
              [],
              3 * D,
            ),
            asset(
              "AST-0104",
              "Marlo walk cycle",
              "Animation",
              "noel",
              "In review",
              ".fbx",
              12,
              3,
              ["Blocking", "Splined", "Foot contact fixes"],
              5 * H,
            ),
            asset(
              "AST-0105",
              "Harbor Market",
              "Scene",
              "kai",
              "Approved",
              ".blend",
              220,
              8,
              [
                "Layout",
                "Stalls and props",
                "Lighting v1",
                "Crowd cards",
                "Signage",
                "Fog pass",
                "Camera fixes",
                "Final lighting",
              ],
              1 * D,
            ),
            asset(
              "AST-0106",
              "Lighthouse interior",
              "Scene",
              "artist",
              "Approved",
              ".blend",
              168,
              6,
              [
                "Blockout",
                "Set dressing",
                "Lamp room",
                "Volumetrics",
                "Material cleanup",
                "Lamp glow tweak",
              ],
              9 * H,
            ),
            asset(
              "AST-0107",
              "Storm sea environment",
              "Environment",
              "kai",
              "In review",
              ".usd",
              540,
              3,
              ["Wave simulation", "Foam and spray", "Cloud layer"],
              7 * H,
            ),
            asset(
              "AST-0108",
              "Gull flock",
              "Animation",
              "kai",
              "Approved",
              ".fbx",
              18,
              2,
              [],
              4 * D,
            ),
            asset(
              "AST-0109",
              "Compass HUD icons",
              "UI element",
              "artist",
              "In review",
              ".svg",
              3,
              2,
              ["First set", "Recolored for night mode"],
              3 * H,
            ),
            asset(
              "AST-0110",
              "Quest log panel",
              "UI element",
              "noel",
              "Approved",
              ".psd",
              26,
              3,
              [],
              6 * D,
            ),
            asset(
              "AST-0111",
              "Dock crates",
              "Prop",
              "artist",
              "Changes requested",
              ".obj",
              9,
              1,
              ["Initial upload"],
              1 * D + 2 * H,
            ),
            asset(
              "AST-0112",
              "Lantern rig",
              "Rig",
              "noel",
              "Draft",
              ".blend",
              15,
              1,
              ["Initial upload"],
              2 * H,
            ),
            asset(
              "AST-0113",
              "Boat cutaway",
              "Scene",
              "noel",
              "In review",
              ".blend",
              134,
              2,
              ["Layout", "Lighting pass"],
              2 * H + 20 * M,
            ),
            asset(
              "AST-0114",
              "Sea chest",
              "Prop",
              "artist",
              "Draft",
              ".obj",
              6,
              1,
              ["Initial upload"],
              50 * M,
            ),
          ];
          const nm = (id) => assets.find((a) => a.id === id).name;
          const job = (
            id,
            assetId,
            ver,
            s,
            e,
            preset,
            pri,
            status,
            owner,
            x,
          ) => {
            const j = Object.assign(
              {
                id,
                assetId,
                assetName: nm(assetId),
                version: ver,
                start: s,
                end: e,
                preset,
                priority: pri,
                status,
                owner,
                node: null,
                done: 0,
                created: t,
                started: null,
                finished: null,
                output: null,
                error: null,
              },
              x,
            );
            j.queuedAt = j.queuedAt || j.created;
            return j;
          };
          const jobs = [
            job(
              "RJ-2035",
              "AST-0106",
              4,
              1,
              240,
              "Production",
              1,
              "cancelled",
              "artist",
              {
                done: 12,
                created: t - 2 * D,
                started: t - 2 * D + M,
                finished: t - 2 * D + 3 * M,
              },
            ),
            job(
              "RJ-2036",
              "AST-0113",
              1,
              1,
              96,
              "Production",
              1,
              "failed",
              "noel",
              {
                done: 61,
                node: "RN-03",
                created: t - 1.1 * D,
                started: t - 1.1 * D + M,
                finished: t - 1.1 * D + 9 * M,
                error: "Out of GPU memory on RN-03 at frame 62.",
              },
            ),
            job(
              "RJ-2038",
              "AST-0106",
              5,
              1,
              240,
              "Production",
              1,
              "done",
              "artist",
              {
                done: 240,
                node: "RN-01",
                created: t - 4 * H,
                started: t - 4 * H + M,
                finished: t - 3 * H,
                output: "lighthouse-interior_v5/RJ-2038_####.exr",
              },
            ),
            job("RJ-2039", "AST-0105", 7, 1, 120, "Final", 2, "done", "kai", {
              done: 120,
              node: "RN-02",
              created: t - 6 * H,
              started: t - 6 * H + M,
              finished: t - 5 * H,
              output: "harbor-market_v7/RJ-2039_####.exr",
            }),
            job(
              "RJ-2041",
              "AST-0106",
              6,
              1,
              240,
              "Production",
              1,
              "rendering",
              "artist",
              {
                done: 118,
                node: "RN-01",
                created: t - 14 * M,
                started: t - 8 * M,
              },
            ),
            job(
              "RJ-2042",
              "AST-0105",
              8,
              1,
              120,
              "Final",
              2,
              "rendering",
              "kai",
              {
                done: 41,
                node: "RN-02",
                created: t - 20 * M,
                started: t - 6 * M,
              },
            ),
            job(
              "RJ-2043",
              "AST-0113",
              2,
              1,
              96,
              "Draft",
              1,
              "rendering",
              "noel",
              {
                done: 52,
                node: "RN-03",
                created: t - 12 * M,
                started: t - 3 * M,
              },
            ),
            job(
              "RJ-2044",
              "AST-0106",
              6,
              1,
              240,
              "Draft",
              0,
              "queued",
              "artist",
              { created: t - 9 * M },
            ),
            job(
              "RJ-2045",
              "AST-0105",
              8,
              121,
              240,
              "Final",
              1,
              "queued",
              "kai",
              { created: t - 7 * M },
            ),
            job(
              "RJ-2046",
              "AST-0113",
              2,
              97,
              192,
              "Production",
              2,
              "queued",
              "noel",
              { created: t - 3 * M },
            ),
          ];
          return {
            v: 1,
            paused: false,
            lastTick: 0,
            seq: { asset: 114, job: 2046 },
            users: [
              {
                id: "u1",
                username: "admin",
                password: "admin123",
                name: "Rico Alvarez",
                role: "admin",
                active: true,
                created: t - 90 * D,
              },
              {
                id: "u2",
                username: "artist",
                password: "artist123",
                name: "Bea Santos",
                role: "user",
                active: true,
                created: t - 60 * D,
              },
              {
                id: "u3",
                username: "noel",
                password: "noel123",
                name: "Noel Reyes",
                role: "user",
                active: true,
                created: t - 45 * D,
              },
              {
                id: "u4",
                username: "kai",
                password: "kai123",
                name: "Kai Lim",
                role: "user",
                active: true,
                created: t - 20 * D,
              },
            ],
            nodes: [
              { id: "RN-01", gpu: "RTX 4090", online: true },
              { id: "RN-02", gpu: "RTX 4090", online: true },
              { id: "RN-03", gpu: "RTX 3080", online: true },
              { id: "RN-04", gpu: "RTX 3080", online: false },
            ],
            assets,
            jobs,
            log: [
              {
                t: t - 3 * M,
                who: "noel",
                text: "Submitted RJ-2046: Boat cutaway v2, frames 97 to 192",
              },
              {
                t: t - 9 * M,
                who: "artist",
                text: "Submitted RJ-2044: Lighthouse interior v6, frames 1 to 240",
              },
              { t: t - 50 * M, who: "artist", text: "Created Sea chest" },
              {
                t: t - 3 * H,
                who: "artist",
                text: "Sent Compass HUD icons for review",
              },
              {
                t: t - 1 * D - 2 * H,
                who: "admin",
                text: "Requested changes on Dock crates",
              },
              {
                t: t - 1 * D - 1 * H,
                who: "system",
                text: "RJ-2036 failed on RN-03",
              },
            ],
          };
        }
        function load() {
          let s = lget(KEY);
          if (!s || !s.jobs) {
            s = seed();
            lset(KEY, s);
          }
          return s;
        }
        function save() {
          lset(KEY, state);
        }

        /* ================= state and helpers ================= */
        const app = document.getElementById("app"),
          dlg = document.getElementById("modal"),
          toasts = document.getElementById("toasts");
        let state = load(),
          view = "overview",
          pending = false,
          lastSig = "",
          seen = null,
          confirmFn = null,
          shellUser = null;
        const ui = {
          assetQ: "",
          assetType: "all",
          assetStatus: "all",
          jobFilter: "active",
          logQ: "",
        };

        const $ = (s, r = document) => r.querySelector(s);
        const esc = (s) =>
          String(s == null ? "" : s).replace(
            /[&<>"']/g,
            (c) =>
              ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
              })[c],
          );
        const slug = (s) =>
          String(s)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        const first = (n) => String(n).split(" ")[0];
        const initials = (n) =>
          String(n)
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
        const total = (j) => j.end - j.start + 1;
        const userBy = (un) => state.users.find((u) => u.username === un);
        const nameOf = (un) => {
          const u = userBy(un);
          return u ? u.name : un;
        };
        const whoName = (w) => (w === "system" ? "System" : nameOf(w));
        const asset = (id) => state.assets.find((a) => a.id === id);
        const jobBy = (id) => state.jobs.find((j) => j.id === id);
        const me = () => {
          const s = sget(SKEY);
          if (!s) return null;
          const u = userBy(s.username);
          return u && u.active ? u : null;
        };
        const canSee = (u, a) =>
          u.role === "admin" ||
          a.owner === u.username ||
          a.status === "Approved";
        const canEdit = (u, a) => u.role === "admin" || a.owner === u.username;
        const allowed = (u, v) => NAV[u.role].some((n) => n[0] === v);
        const queued = () =>
          state.jobs
            .filter((j) => j.status === "queued")
            .sort((a, b) => b.priority - a.priority || a.queuedAt - b.queuedAt);
        const position = (j) => queued().findIndex((x) => x.id === j.id) + 1;
        const fmtSize = (mb) =>
          mb == null
            ? "–"
            : mb >= 1024
              ? (mb / 1024).toFixed(1) + " GB"
              : Math.round(mb) + " MB";
        const I = (n) =>
          `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

        function ago(t) {
          const s = Math.max(0, (Date.now() - t) / 1000);
          if (s < 45) return "just now";
          const m = Math.round(s / 60);
          if (m < 60) return m + " min ago";
          const h = Math.round(m / 60);
          if (h < 24) return h + " h ago";
          const d = Math.round(h / 24);
          if (d < 8) return d + " d ago";
          return new Date(t).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
        }
        const fullDate = (t) =>
          new Date(t).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          });
        function eta(j) {
          if (j.status !== "rendering") return "";
          const s = Math.ceil(
            ((total(j) - j.done) / (PRESETS[j.preset].rate + 0.35)) * 1.2,
          );
          return s < 90
            ? `about ${s}s left`
            : `about ${Math.round(s / 60)} min left`;
        }
        function toast(msg, kind) {
          const el = document.createElement("div");
          el.className = "toast" + (kind ? " " + kind : "");
          el.textContent = msg;
          toasts.appendChild(el);
          while (toasts.children.length > 4) toasts.firstChild.remove();
          setTimeout(() => el.remove(), 4600);
        }
        function log(text, who) {
          const s = sget(SKEY);
          state.log.unshift({
            t: Date.now(),
            who: who || (s && s.username) || "system",
            text,
          });
          if (state.log.length > 200) state.log.length = 200;
        }
        function mutate(fn) {
          state = load();
          const r = fn();
          save();
          return r;
        }
        function showErr(f, msg) {
          const el = f.querySelector(".err");
          if (el) {
            el.textContent = msg;
            el.hidden = false;
          }
        }
        const opts = (list, sel) =>
          list
            .map(
              (x) =>
                `<option${x === sel ? " selected" : ""}>${esc(x)}</option>`,
            )
            .join("");

        /* ================= render queue simulation ================= */
        function advance(now) {
          for (const j of state.jobs) {
            if (j.status !== "rendering") continue;
            const n = state.nodes.find((x) => x.id === j.node);
            if (!n || !n.online) {
              j.status = "queued";
              j.node = null;
              continue;
            }
            j.done = Math.min(
              total(j),
              j.done + PRESETS[j.preset].rate + (Math.random() < 0.35 ? 1 : 0),
            );
            if (j.done < total(j) && Math.random() < 0.0015) {
              j.status = "failed";
              j.finished = now;
              j.error = `Lost connection to ${j.node} at frame ${j.start + j.done}.`;
              log(`${j.id} failed on ${j.node}`, "system");
              continue;
            }
            if (j.done >= total(j)) {
              j.status = "done";
              j.finished = now;
              j.output = `${slug(j.assetName)}_v${j.version}/${j.id}_####.exr`;
              log(`${j.id} finished on ${j.node}`, "system");
            }
          }
          if (state.paused) return;
          for (const n of state.nodes) {
            if (
              !n.online ||
              state.jobs.some(
                (j) => j.status === "rendering" && j.node === n.id,
              )
            )
              continue;
            const nx = queued()[0];
            if (!nx) break;
            nx.status = "rendering";
            nx.node = n.id;
            nx.started = nx.started || now;
            log(`${nx.id} started on ${n.id}`, "system");
          }
        }
        function notify(u) {
          const cur = {};
          state.jobs.forEach((j) => (cur[j.id] = j.status));
          if (seen) {
            state.jobs.forEach((j) => {
              const p = seen[j.id];
              if (
                p === "rendering" &&
                j.status === "done" &&
                j.owner === u.username
              )
                toast(`${j.id} finished. Output is ready in My outputs.`);
              if (
                p &&
                p !== "failed" &&
                j.status === "failed" &&
                (j.owner === u.username || u.role === "admin")
              )
                toast(`${j.id} failed. ${j.error}`, "bad");
            });
          }
          seen = cur;
        }
        function patchProgress() {
          for (const j of state.jobs) {
            if (j.status !== "rendering") continue;
            const pct = Math.round((j.done / total(j)) * 100);
            document.querySelectorAll(`[data-prog="${j.id}"]`).forEach((el) => {
              el.setAttribute("aria-valuenow", pct);
              const b = el.firstElementChild;
              if (b) b.style.width = pct + "%";
            });
            document
              .querySelectorAll(`[data-prog-text="${j.id}"]`)
              .forEach((el) => (el.textContent = `${j.done} / ${total(j)}`));
            document
              .querySelectorAll(`[data-eta="${j.id}"]`)
              .forEach((el) => (el.textContent = eta(j)));
          }
        }
        const sig = () =>
          [
            state.paused,
            state.jobs.map((j) => j.id + j.status + j.node + j.priority).join(),
            state.nodes.map((n) => n.online).join(),
            state.assets.map((a) => a.id + a.status + a.versions.length).join(),
            state.users.map((u) => u.username + u.role + u.active).join(),
          ].join("|");
        function tick() {
          state = load();
          const now = Date.now();
          if (now - (state.lastTick || 0) >= 1000) {
            state.lastTick = now;
            advance(now);
            save();
          }
          const u = me();
          if (!u) return;
          notify(u);
          patchProgress();
          if (sig() !== lastSig) refresh();
        }

        /* ================= shared building blocks ================= */
        const chip = (label, v) =>
          `<span class="chip" style="--c:var(${v})">${esc(label)}</span>`;
        const jobChip = (j) => chip(J_CHIP[j.status][0], J_CHIP[j.status][1]);
        const assetChip = (a) => chip(a.status, A_CHIP[a.status]);
        function strip(j) {
          const pct = Math.round((j.done / total(j)) * 100);
          return `<div class="strip" style="--c:var(${J_CHIP[j.status][1]})" data-prog="${j.id}" role="progressbar" aria-label="${j.id} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>`;
        }
        const stripRow = (j) =>
          `<div class="strip-row">${strip(j)}<span class="frames" data-prog-text="${j.id}">${j.done} / ${total(j)}</span></div>`;
        const modalHTML = (title, body) =>
          `<div class="mhead"><h2 id="mtitle">${esc(title)}</h2><button class="btn sm ghost" data-act="closeModal" aria-label="Close">${I("x")}</button></div><div class="mbody">${body}</div>`;
        function openModal(html) {
          dlg.innerHTML = html;
          if (!dlg.open) dlg.showModal();
        }
        function closeModal() {
          if (dlg.open) dlg.close();
        }
        function confirmDlg(title, text, label, fn) {
          confirmFn = fn;
          openModal(
            modalHTML(
              title,
              `<p>${esc(text)}</p><div class="mfoot"><button class="btn" data-act="closeModal">Cancel</button><button class="btn danger" data-act="confirmYes">${esc(label)}</button></div>`,
            ),
          );
        }

        function jobRow(j, u) {
          const adm = u.role === "admin",
            mine = j.owner === u.username,
            can = adm || mine;
          const meta = [
            `<span>Frames ${j.start}–${j.end}</span>`,
            `<span>${j.preset}, ${PRESETS[j.preset].res}</span>`,
            `<span>${PRI[j.priority]} priority</span>`,
          ];
          if (adm) meta.push(`<span>${esc(nameOf(j.owner))}</span>`);
          if (j.status === "queued")
            meta.push(
              `<span>${state.paused ? "Held while the queue is paused, " : ""}position ${position(j)} in the queue</span>`,
            );
          if (j.status === "rendering")
            meta.push(
              `<span>On ${j.node}</span>`,
              `<span data-eta="${j.id}">${eta(j)}</span>`,
            );
          if (j.status === "done")
            meta.push(`<span>Rendered on ${j.node}, ${ago(j.finished)}</span>`);
          if (j.status === "cancelled")
            meta.push(`<span>Cancelled ${ago(j.finished)}</span>`);
          const acts = [];
          if (adm && j.status === "queued")
            acts.push(
              `<label class="sel-inline"><span class="sr">Priority for ${j.id}</span><select data-change="pri" data-id="${j.id}">${PRI.map((p, i) => `<option value="${i}"${i === j.priority ? " selected" : ""}>${p}</option>`).join("")}</select></label>`,
            );
          if (can && (j.status === "queued" || j.status === "rendering"))
            acts.push(
              `<button class="btn sm" data-act="cancelJob" data-id="${j.id}">${I("x")}Cancel</button>`,
            );
          if (can && (j.status === "failed" || j.status === "cancelled"))
            acts.push(
              `<button class="btn sm" data-act="requeueJob" data-id="${j.id}">${I("redo")}Requeue</button>`,
            );
          if (j.status === "done")
            acts.push(
              `<button class="btn sm" data-act="copyPath" data-path="${esc(j.output)}">${I("copy")}Copy path</button>`,
            );
          if (adm && ["done", "failed", "cancelled"].includes(j.status))
            acts.push(
              `<button class="btn sm ghost" data-act="removeJob" data-id="${j.id}" aria-label="Remove ${j.id}">${I("trash")}</button>`,
            );
          return `<article class="job" data-status="${j.status}">
    <div>
      <div class="job-top"><b class="mono">${j.id}</b><span class="job-name">${esc(j.assetName)} <span class="muted">v${j.version}</span></span>${jobChip(j)}</div>
      ${stripRow(j)}
      <div class="job-meta">${meta.join("")}</div>
      ${j.error ? `<p class="job-err">${esc(j.error)}</p>` : ""}
      ${j.output ? `<p class="out">${esc(j.output)}</p>` : ""}
    </div>
    <div class="job-actions">${acts.join("")}</div>
  </article>`;
        }
        function nodeRow(n, adm) {
          const j = state.jobs.find(
            (x) => x.status === "rendering" && x.node === n.id,
          );
          let mid;
          if (!n.online)
            mid =
              '<span class="muted">Offline. Jobs will not start here.</span>';
          else if (j)
            mid = `<div class="node-job"><b class="mono">${j.id}</b><span>${esc(j.assetName)} <span class="muted">v${j.version}, ${esc(nameOf(j.owner))}</span></span></div>${stripRow(j)}`;
          else mid = '<span class="muted">Idle. Ready for the next job.</span>';
          const sw = adm
            ? `<button class="switch" role="switch" aria-checked="${n.online}" aria-label="${n.id} online" data-act="toggleNode" data-id="${n.id}"></button>`
            : "";
          return `<div class="node"><div class="node-name"><b>${n.id}</b><span class="muted small">${esc(n.gpu)}</span></div><div class="node-mid">${mid}</div><div class="node-sw"><span class="muted small">${n.online ? "Online" : "Offline"}</span>${sw}</div></div>`;
        }

        /* ================= login ================= */
        function loginHTML() {
          const li = (a) => a.map((x) => `<li>${I("check")}<span>${x}</span></li>`).join("");
          return `<div class="login"><div class="login-in">
    <div>
      <svg class="mark" width="40" height="40" viewBox="0 0 32 32" fill="none" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M10 22h18" stroke="#ef5b52"/><path d="M10 22l12-11" stroke="#7bc95a"/><path d="M10 22V4" stroke="#4a97f5"/><circle cx="10" cy="22" r="2.4" fill="currentColor" stroke="none"/></svg>
      <h1>3D Asset Library and Render Queue Management System</h1>
      <p class="lede">Choose how you want to access the system. Admins manage the overall workspace, while artists create and manage their own 3D assets and render jobs.</p>
      <div class="roles">
        <article class="panel role-card"><h2>Sign in as Admin</h2><p class="muted">For administrators who manage the complete render pipeline.</p><ul class="checks">${li(["View and manage all assets and render jobs","Approve assets or request changes","Prioritise, pause, cancel, and manage render jobs","Switch render nodes on or off","Add and manage user accounts"])}</ul><button class="btn primary" data-act="openLogin" data-role="admin">Sign in as admin</button></article>
        <article class="panel role-card"><h2>Sign in as Artist</h2><p class="muted">For artists who create assets and submit their work for rendering.</p><ul class="checks">${li(["Add assets and save new versions","Browse approved library assets","Submit render jobs for scenes","Track and cancel your own renders","Access your completed render outputs"])}</ul><button class="btn primary" data-act="openLogin" data-role="user">Sign in as artist</button></article>
      </div>
      <div class="signup-panel"><p class="muted">Don’t have an account yet?</p><button class="btn" data-act="openSignup">Sign up</button></div>
    </div>
  </div></div>`;
        }

        function loginModalHTML(role) {
          const label = role === "admin" ? "Admin" : "Artist";
          return modalHTML(`Sign in as ${label}`, `<form data-form="login" data-login-role="${role}" novalidate><p class="muted">Sign in using your existing ${label.toLowerCase()} account.</p><div class="field"><label>Username</label><input name="username" autocomplete="username" required autofocus></div><div class="field"><label>Password</label><input name="password" type="password" autocomplete="current-password" required></div><p class="err" role="alert" hidden></p><div class="mfoot"><button class="btn" type="button" data-act="closeModal">Cancel</button><button class="btn primary" type="submit">Sign in</button></div></form>`);
        }

        function signupModalHTML() {
          return modalHTML("Create an account", `<form data-form="signup" novalidate><p class="muted">Create a new account as an Admin or Artist.</p><div class="field"><label>Full name</label><input name="name" maxlength="50" required autofocus></div><div class="row2"><div class="field"><label>Username</label><input name="username" maxlength="24" required></div><div class="field"><label>Password</label><input name="password" type="password" autocomplete="new-password" required></div></div><div class="field"><label>Account type</label><select name="role"><option value="user">Artist</option><option value="admin">Admin</option></select></div><p class="err" role="alert" hidden></p><div class="mfoot"><button class="btn" type="button" data-act="closeModal">Cancel</button><button class="btn primary" type="submit">Create account</button></div></form>`);
        }

        function doLogin(un, pw) {
          state = load();
          const u = userBy(String(un).trim().toLowerCase());
          if (!u || u.password !== pw)
            return "That username and password do not match. Check both and try again.";
          if (!u.active)
            return "This account is disabled. Ask an admin to turn it back on.";
          sset(SKEY, { username: u.username });
          view = "overview";
          seen = null;
          Object.assign(ui, {
            assetQ: "",
            assetType: "all",
            assetStatus: "all",
            jobFilter: "active",
            logQ: "",
          });
          mutate(() => log("Signed in", u.username));
          refresh(true);
          return "";
        }

        /* ================= shell ================= */
        function shellHTML(u) {
          return `<div class="app">
    <aside class="side">
      <div class="brand"><svg class="mark" viewBox="0 0 32 32" fill="none" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M10 22h18" stroke="#ef5b52"/><path d="M10 22l12-11" stroke="#7bc95a"/><path d="M10 22V4" stroke="#4a97f5"/><circle cx="10" cy="22" r="2.4" fill="currentColor" stroke="none"/></svg><div><strong>3D Asset Library</strong><small>and Render Queue</small></div></div>
      <nav class="nav" id="nav" aria-label="Main"></nav>
      <div class="who"><div class="avatar" aria-hidden="true">${esc(initials(u.name))}</div><div class="meta"><b>${esc(u.name)}</b><span class="role-tag">${u.role === "admin" ? "Admin" : "Artist"}</span></div><button class="btn sm ghost" data-act="signOut" aria-label="Sign out">${I("out")}<span>Sign out</span></button></div>
    </aside>
    <main class="main" id="view"></main>
  </div>`;
        }
        function navHTML(u) {
          return NAV[u.role]
            .map(([k, label, ic]) => {
              let b = "";
              if (k === "assets") {
                const n =
                  u.role === "admin"
                    ? state.assets.filter((a) => a.status === "In review")
                        .length
                    : state.assets.filter(
                        (a) =>
                          a.owner === u.username &&
                          a.status === "Changes requested",
                      ).length;
                if (n)
                  b = `<span class="badge">${n}<span class="sr"> ${u.role === "admin" ? "awaiting approval" : "need changes"}</span></span>`;
              }
              return `<button data-act="go" data-view="${k}"${view === k ? ' aria-current="page"' : ""}>${I(ic)}<span>${label}</span>${b}</button>`;
            })
            .join("");
        }
        function renderAll() {
          const u = me();
          if (!u) {
            shellUser = null;
            document.body.dataset.role = "guest";
            app.innerHTML = loginHTML();
            return;
          }
          document.body.dataset.role = u.role;
          if (!allowed(u, view)) view = "overview";
          if (shellUser !== u.username || !$("#view")) {
            shellUser = u.username;
            app.innerHTML = shellHTML(u);
          }
          $("#nav").innerHTML = navHTML(u);
          $("#view").innerHTML = viewHTML(u);
        }
        function isEditing() {
          if (dlg.open) return true;
          const a = document.activeElement;
          return !!(
            a &&
            /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName) &&
            app.contains(a)
          );
        }
        function refresh(force) {
          if (!force && isEditing()) {
            pending = true;
            return;
          }
          pending = false;
          lastSig = sig();
          renderAll();
        }
        function viewHTML(u) {
          switch (view) {
            case "assets":
              return viewAssets(u);
            case "queue":
              return viewQueue(u);
            case "outputs":
              return viewOutputs(u);
            case "users":
              return viewUsers(u);
            case "activity":
              return viewActivity(u);
            default:
              return u.role === "admin" ? viewAdminHome(u) : viewUserHome(u);
          }
        }

        /* ================= admin overview ================= */
        function viewAdminHome(u) {
          const c = (s) => state.jobs.filter((j) => j.status === s).length;
          const pend = state.assets.filter((a) => a.status === "In review");
          const on = state.nodes.filter((n) => n.online).length;
          const pulse = (n, label, attrs, v) =>
            `<li><button class="pulse-i" style="--c:var(${v})" data-act="go" ${attrs}><b>${n}</b><span>${label}</span></button></li>`;
          const users = state.users.filter(
            (x) => x.role === "user" && x.active,
          );
          const left = (x) =>
            state.jobs
              .filter(
                (j) =>
                  j.owner === x.username &&
                  (j.status === "queued" || j.status === "rendering"),
              )
              .reduce((s, j) => s + total(j) - j.done, 0);
          const cnt = (x) =>
            state.jobs.filter(
              (j) =>
                j.owner === x.username &&
                (j.status === "queued" || j.status === "rendering"),
            ).length;
          const max = Math.max(1, ...users.map(left));
          const appr = pend.length
            ? pend
                .sort((a, b) => b.updated - a.updated)
                .map(
                  (a) => `<div class="appr">
      <div><button class="link" data-act="openAsset" data-id="${a.id}">${esc(a.name)}</button><div class="muted small">${esc(a.type)}, v${a.versions.length}, from ${esc(nameOf(a.owner))}, ${ago(a.updated)}</div></div>
      <div class="acts"><button class="btn sm primary" data-act="approve" data-id="${a.id}">${I("check")}Approve</button><button class="btn sm" data-act="requestChanges" data-id="${a.id}">Request changes</button></div>
    </div>`,
                )
                .join("")
            : '<div class="empty">Nothing is waiting for approval.</div>';
          return `<header class="page-head">
      <div><h1>Studio overview</h1><p class="sub">The render farm, the queue, and the assets waiting on you, all in one view.</p></div>
      <div class="head-actions"><button class="btn" data-act="togglePause">${I(state.paused ? "play" : "pause")}${state.paused ? "Resume queue" : "Pause queue"}</button><button class="btn primary" data-act="newJob">${I("plus")}Submit render</button></div>
    </header>
    ${state.paused ? '<div class="banner">The queue is paused. Running jobs finish, but no new jobs start until you resume it.</div>' : ""}
    <ul class="pulse">
      ${pulse(c("rendering"), "rendering", 'data-view="queue" data-jf="rendering"', "--st-render")}
      ${pulse(c("queued"), "queued", 'data-view="queue" data-jf="queued"', "--st-queued")}
      ${pulse(pend.length, "awaiting approval", 'data-view="assets" data-as="In review"', "--st-warn")}
      ${pulse(c("failed"), "failed", 'data-view="queue" data-jf="failed"', "--st-fail")}
    </ul>
    <section class="panel" aria-labelledby="farmT">
      <div class="panel-h"><div><h2 id="farmT">Render farm</h2><p class="muted small">${on} of ${state.nodes.length} nodes online</p></div></div>
      <div class="nodes">${state.nodes.map((n) => nodeRow(n, true)).join("")}</div>
    </section>
    <div class="cols">
      <section class="panel" aria-labelledby="apT">
        <div class="panel-h"><div><h2 id="apT">Approval inbox</h2><p class="muted small">Artists cannot publish to the library until you approve their work.</p></div></div>
        <div class="list">${appr}</div>
      </section>
      <div class="stack">
        <section class="panel" aria-labelledby="wlT">
          <div class="panel-h"><h2 id="wlT">Workload by artist</h2><span class="muted small">Frames still to render</span></div>
          <div class="panel-b">${users.map((x) => `<div class="wl"><div>${esc(first(x.name))}<div class="muted small">${cnt(x)} ${cnt(x) === 1 ? "job" : "jobs"}</div></div><div class="bar"><i style="width:${Math.round((left(x) / max) * 100)}%"></i></div><span class="mono">${left(x)}</span></div>`).join("") || '<p class="muted">No active artists.</p>'}</div>
        </section>
        <section class="panel" aria-labelledby="raT">
          <div class="panel-h"><h2 id="raT">Recent activity</h2><button class="btn sm ghost" data-act="go" data-view="activity">View all</button></div>
          <ul class="log compact">${state.log
            .slice(0, 6)
            .map(
              (l) =>
                `<li><span class="muted small" title="${fullDate(l.t)}">${ago(l.t)}</span><span><b>${esc(whoName(l.who))}</b> ${esc(l.text)}</span></li>`,
            )
            .join("")}</ul>
        </section>
      </div>
    </div>`;
        }

        /* ================= artist workspace ================= */
        function viewUserHome(u) {
          const mine = state.jobs.filter((j) => j.owner === u.username);
          const active = mine
            .filter((j) => j.status === "rendering" || j.status === "queued")
            .sort(
              (a, b) =>
                (a.status === "rendering" ? 0 : 1) -
                  (b.status === "rendering" ? 0 : 1) ||
                position(a) - position(b),
            );
          const done = mine
            .filter((j) => j.status === "done")
            .sort((a, b) => b.finished - a.finished)
            .slice(0, 4);
          const order = {
            "Changes requested": 0,
            Draft: 1,
            "In review": 2,
            Approved: 3,
          };
          const own = state.assets
            .filter((a) => a.owner === u.username)
            .sort(
              (a, b) =>
                order[a.status] - order[b.status] || b.updated - a.updated,
            )
            .slice(0, 6);
          const on = state.nodes.filter((n) => n.online).length;
          const needs = own.filter(
            (a) => a.status === "Changes requested",
          ).length;
          return `<header class="page-head">
      <div><h1>Hi, ${esc(first(u.name))}</h1><p class="sub">${needs ? `${needs === 1 ? "One of your assets needs" : "Some of your assets need"} changes before an admin can approve ${needs === 1 ? "it" : "them"}.` : "Your renders and assets, and what to do next."}</p></div>
      <div class="head-actions"><button class="btn" data-act="newAsset">${I("plus")}New asset</button><button class="btn primary" data-act="newJob">${I("plus")}Submit render</button></div>
    </header>
    ${state.paused ? '<div class="banner">The queue is paused by an admin. Your jobs will start again once it resumes.</div>' : ""}
    <section class="panel" aria-labelledby="myrT">
      <div class="panel-h"><div><h2 id="myrT">Your renders in progress</h2><p class="muted small">The farm has ${on} of ${state.nodes.length} nodes online and ${queued().length} ${queued().length === 1 ? "job" : "jobs"} waiting.</p></div><button class="btn sm ghost" data-act="go" data-view="queue" data-jf="all">All my renders</button></div>
      <div class="list">${active.length ? active.map((j) => jobRow(j, u)).join("") : `<div class="empty"><p>Nothing is rendering right now.</p><button class="btn primary" data-act="newJob">${I("plus")}Submit a scene</button></div>`}</div>
    </section>
    <div class="cols even">
      <section class="panel" aria-labelledby="myaT">
        <div class="panel-h"><h2 id="myaT">Your assets</h2><button class="btn sm ghost" data-act="go" data-view="assets">Open library</button></div>
        <div class="list">${own.length ? own.map((a) => `<div class="asset-mini"><div><button class="link" data-act="openAsset" data-id="${a.id}">${esc(a.name)}</button><div class="muted small">${esc(a.type)}, v${a.versions.length}</div></div><div class="acts">${assetChip(a)}${a.status === "Draft" || a.status === "Changes requested" ? `<button class="btn sm primary" data-act="submitReview" data-id="${a.id}">${I("send")}Send for review</button>` : ""}</div></div>`).join("") : '<div class="empty">You have not added any assets yet.</div>'}</div>
      </section>
      <section class="panel" aria-labelledby="rdT">
        <div class="panel-h"><h2 id="rdT">Ready to collect</h2><button class="btn sm ghost" data-act="go" data-view="outputs">All outputs</button></div>
        <div class="list">${done.length ? done.map((j) => `<div class="out-item"><div><b>${esc(j.assetName)}</b> <span class="muted">v${j.version}</span><div class="out">${esc(j.output)}</div><div class="muted small">Finished ${ago(j.finished)}</div></div><button class="btn sm" data-act="copyPath" data-path="${esc(j.output)}">${I("copy")}Copy path</button></div>`).join("") : '<div class="empty">Finished renders will show up here.</div>'}</div>
      </section>
    </div>`;
        }

        /* ================= assets ================= */
        function assetTable(u) {
          const adm = u.role === "admin",
            q = ui.assetQ.trim().toLowerCase();
          const list = state.assets
            .filter(
              (a) =>
                canSee(u, a) &&
                (ui.assetType === "all" || a.type === ui.assetType) &&
                (ui.assetStatus === "all" || a.status === ui.assetStatus) &&
                (!q ||
                  [a.name, a.id, a.type, nameOf(a.owner)]
                    .join(" ")
                    .toLowerCase()
                    .includes(q)),
            )
            .sort((a, b) => b.updated - a.updated);
          if (!list.length)
            return '<div class="empty">No assets match. Clear the filters or add a new asset.</div>';
          return `<table class="tbl"><thead><tr><th>Asset</th><th>Type</th><th>Version</th><th>Owner</th><th>Status</th><th>Updated</th><th><span class="sr">Actions</span></th></tr></thead><tbody>${list
            .map((a) => {
              const acts = [
                `<button class="btn sm" data-act="openAsset" data-id="${a.id}">Open</button>`,
              ];
              if (a.type === "Scene")
                acts.push(
                  `<button class="btn sm" data-act="newJob" data-id="${a.id}">Render</button>`,
                );
              if (adm && a.status === "In review")
                acts.push(
                  `<button class="btn sm primary" data-act="approve" data-id="${a.id}">Approve</button>`,
                );
              if (
                !adm &&
                a.owner === u.username &&
                (a.status === "Draft" || a.status === "Changes requested")
              )
                acts.push(
                  `<button class="btn sm primary" data-act="submitReview" data-id="${a.id}">Send for review</button>`,
                );
              return `<tr><td><button class="link" data-act="openAsset" data-id="${a.id}">${esc(a.name)}</button><div class="muted small mono">${a.id}</div></td><td>${esc(a.type)}</td><td class="mono">v${a.versions.length}</td><td>${a.owner === u.username ? "You" : esc(nameOf(a.owner))}</td><td>${assetChip(a)}</td><td class="muted" title="${fullDate(a.updated)}">${ago(a.updated)}</td><td><div class="acts">${acts.join("")}</div></td></tr>`;
            })
            .join("")}</tbody></table>`;
        }
        function viewAssets(u) {
          const adm = u.role === "admin";
          return `<header class="page-head">
      <div><h1>Asset library</h1><p class="sub">${adm ? "Every asset in the studio. Approve work, request changes, or remove what is no longer needed." : "Your own assets, plus everything the studio has approved."}</p></div>
      <div class="head-actions"><button class="btn primary" data-act="newAsset">${I("plus")}New asset</button></div>
    </header>
    <section class="panel">
      <div class="tools">
        <input id="assetQ" type="search" placeholder="Search by name, ID, type, or owner" aria-label="Search assets" value="${esc(ui.assetQ)}">
        <select data-change="assetFilter" data-key="assetType" aria-label="Filter by type"><option value="all">All types</option>${TYPES.map((t) => `<option${ui.assetType === t ? " selected" : ""}>${t}</option>`).join("")}</select>
        <select data-change="assetFilter" data-key="assetStatus" aria-label="Filter by status"><option value="all">All statuses</option>${A_STATUS.map((t) => `<option${ui.assetStatus === t ? " selected" : ""}>${t}</option>`).join("")}</select>
      </div>
      <div class="tbl-wrap" id="assetRows">${assetTable(u)}</div>
    </section>`;
        }
        function assetModalHTML(u, a) {
          const adm = u.role === "admin",
            edit = canEdit(u, a);
          const foot = [];
          if (a.type === "Scene")
            foot.push(
              `<button class="btn" data-act="newJob" data-id="${a.id}">${I("play")}Render this scene</button>`,
            );
          if (
            edit &&
            (a.status === "Draft" || a.status === "Changes requested") &&
            !adm
          )
            foot.push(
              `<button class="btn primary" data-act="submitReview" data-id="${a.id}">${I("send")}Send for review</button>`,
            );
          if (adm && a.status === "In review")
            foot.push(
              `<button class="btn" data-act="requestChanges" data-id="${a.id}">Request changes</button><button class="btn primary" data-act="approve" data-id="${a.id}">${I("check")}Approve</button>`,
            );
          if (adm || (edit && a.status !== "Approved"))
            foot.unshift(
              `<button class="btn danger" data-act="askDeleteAsset" data-id="${a.id}">${I("trash")}Delete</button>`,
            );
          return modalHTML(
            a.name,
            `
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="mono muted">${a.id}</span><span>${esc(a.type)}</span>${assetChip(a)}</div>
    <dl class="kv"><dt>Owner</dt><dd>${esc(nameOf(a.owner))}</dd><dt>Format</dt><dd class="mono">${esc(a.fmt)}</dd><dt>Size</dt><dd>${fmtSize(a.size)}</dd><dt>Updated</dt><dd>${fullDate(a.updated)}</dd></dl>
    <h3 style="font-size:14px;margin-top:14px">Version history</h3>
    <ul class="vers">${a.versions
      .slice()
      .reverse()
      .map(
        (v) =>
          `<li><b class="mono">v${v.v}</b><span>${esc(v.note)} <span class="muted small">by ${esc(nameOf(v.by))}</span></span><span class="muted small">${ago(v.at)}</span></li>`,
      )
      .join("")}</ul>
    ${edit ? `<form data-form="version" data-id="${a.id}" novalidate><div class="field"><label for="vn">Save a new version</label><input id="vn" name="note" maxlength="80" placeholder="What changed?"><span class="hint">${adm ? "The status stays as it is." : "Approved assets go back to review after a new version."}</span></div><button class="btn" type="submit">Save version</button></form>` : ""}
    ${foot.length ? `<div class="mfoot">${foot.join("")}</div>` : ""}`,
          );
        }
        function assetFormHTML() {
          return modalHTML(
            "New asset",
            `<form data-form="newAsset" novalidate>
    <div class="field"><label for="an">Name</label><input id="an" name="name" maxlength="60" autofocus></div>
    <div class="row2">
      <div class="field"><label for="at">Type</label><select id="at" name="type">${opts(TYPES, "Character model")}</select></div>
      <div class="field"><label for="af">File (optional)</label><input id="af" name="file" type="file"></div>
    </div>
    <p class="hint" style="margin:-6px 0 14px">Only the file name and size are recorded. Nothing is uploaded anywhere.</p>
    <div class="field"><label for="ano">Version note</label><input id="ano" name="note" maxlength="80" placeholder="Initial upload"></div>
    <p class="err" role="alert" hidden></p>
    <div class="mfoot"><button class="btn" type="button" data-act="closeModal">Cancel</button><button class="btn primary" type="submit">Add asset</button></div>
  </form>`,
          );
        }

        /* ================= render queue ================= */
        function jobsFor(u) {
          let list = state.jobs.filter(
            (j) => u.role === "admin" || j.owner === u.username,
          );
          const f = ui.jobFilter;
          if (f === "active")
            list = list.filter(
              (j) => j.status === "rendering" || j.status === "queued",
            );
          else if (f !== "all") list = list.filter((j) => j.status === f);
          const order = {
            rendering: 0,
            queued: 1,
            failed: 2,
            done: 3,
            cancelled: 4,
          };
          const qp = new Map(queued().map((j, i) => [j.id, i]));
          return list.sort(
            (a, b) =>
              order[a.status] - order[b.status] ||
              (a.status === "queued"
                ? qp.get(a.id) - qp.get(b.id)
                : (b.finished || b.created) - (a.finished || a.created)),
          );
        }
        function jobListHTML(u) {
          const list = jobsFor(u);
          if (!list.length)
            return `<div class="empty"><p>${ui.jobFilter === "active" ? "Nothing is queued or rendering." : "No jobs match this filter."}</p><button class="btn primary" data-act="newJob">${I("plus")}Submit render</button></div>`;
          return list.map((j) => jobRow(j, u)).join("");
        }
        function viewQueue(u) {
          const adm = u.role === "admin";
          const f = [
            ["active", "Active"],
            ["all", "All"],
            ["rendering", "Rendering"],
            ["queued", "Queued"],
            ["done", "Done"],
            ["failed", "Failed"],
            ["cancelled", "Cancelled"],
          ];
          return `<header class="page-head">
      <div><h1>${adm ? "Render queue" : "My renders"}</h1><p class="sub">${adm ? "Every job on the farm. Change priority, cancel, or requeue jobs, and pause the queue when needed." : "Jobs you have submitted. You can cancel or requeue your own jobs."}</p></div>
      <div class="head-actions">${adm ? `<button class="btn" data-act="togglePause">${I(state.paused ? "play" : "pause")}${state.paused ? "Resume queue" : "Pause queue"}</button>` : ""}<button class="btn primary" data-act="newJob">${I("plus")}Submit render</button></div>
    </header>
    ${state.paused ? `<div class="banner">${adm ? "The queue is paused. Running jobs finish, but no new jobs start until you resume it." : "The queue is paused by an admin. Your jobs will start again once it resumes."}</div>` : ""}
    <section class="panel">
      <div class="tools"><select data-change="jobFilter" aria-label="Filter jobs">${f.map(([v, l]) => `<option value="${v}"${ui.jobFilter === v ? " selected" : ""}>${l}</option>`).join("")}</select></div>
      <div class="list" id="jobList">${jobListHTML(u)}</div>
    </section>`;
        }
        function jobFormHTML(u, assetId) {
          const scenes = state.assets
            .filter((a) => a.type === "Scene" && canSee(u, a))
            .sort((a, b) => a.name.localeCompare(b.name));
          const pri = u.role === "admin" ? PRI : PRI.slice(0, 3);
          return modalHTML(
            "Submit render",
            `<form data-form="job" novalidate>
    <div class="field"><label for="js">Scene</label><select id="js" name="asset" autofocus>${scenes.map((a) => `<option value="${a.id}"${a.id === assetId ? " selected" : ""}>${esc(a.name)} (v${a.versions.length})</option>`).join("")}</select></div>
    <div class="row2">
      <div class="field"><label for="js1">Start frame</label><input id="js1" name="start" type="number" min="1" value="1" inputmode="numeric"></div>
      <div class="field"><label for="js2">End frame</label><input id="js2" name="end" type="number" min="1" value="120" inputmode="numeric"></div>
    </div>
    <div class="row2">
      <div class="field"><label for="jp">Quality</label><select id="jp" name="preset">${Object.keys(
        PRESETS,
      )
        .map(
          (k) =>
            `<option value="${k}"${k === "Production" ? " selected" : ""}>${k}, ${PRESETS[k].res}</option>`,
        )
        .join("")}</select></div>
      <div class="field"><label for="jr">Priority</label><select id="jr" name="priority">${pri.map((p, i) => `<option value="${i}"${i === 1 ? " selected" : ""}>${p}</option>`).join("")}</select></div>
    </div>
    <p class="hint" id="jobSummary">120 frames at 1920×1080.</p>
    <p class="err" role="alert" hidden></p>
    <div class="mfoot"><button class="btn" type="button" data-act="closeModal">Cancel</button><button class="btn primary" type="submit">Add to queue</button></div>
  </form>`,
          );
        }
        function openJobModal(assetId) {
          const u = me();
          if (!u) return;
          if (!state.assets.some((a) => a.type === "Scene" && canSee(u, a))) {
            toast(
              "There are no scenes to render yet. Add a Scene asset first.",
              "bad",
            );
            return;
          }
          openModal(jobFormHTML(u, assetId));
        }
        function updateJobSummary(f) {
          const d = Object.fromEntries(new FormData(f)),
            s = parseInt(d.start, 10),
            e = parseInt(d.end, 10),
            el = $("#jobSummary");
          if (!el) return;
          el.textContent =
            s >= 1 && e >= s
              ? `${(e - s + 1).toLocaleString()} frames at ${PRESETS[d.preset].res}.`
              : "Enter a start frame of 1 or more and an end frame that is not before it.";
        }

        /* ================= outputs ================= */
        function viewOutputs(u) {
          const adm = u.role === "admin";
          const list = state.jobs
            .filter(
              (j) => j.status === "done" && (adm || j.owner === u.username),
            )
            .sort((a, b) => b.finished - a.finished);
          return `<header class="page-head"><div><h1>${adm ? "Outputs" : "My outputs"}</h1><p class="sub">${adm ? "Final renders from every artist." : "Final renders from your jobs."}</p></div></header>
    <section class="panel"><div class="tbl-wrap">${list.length ? `<table class="tbl"><thead><tr><th>Job</th><th>Scene</th>${adm ? "<th>Artist</th>" : ""}<th>Frames</th><th>Resolution</th><th>Finished</th><th>Output</th></tr></thead><tbody>${list.map((j) => `<tr><td class="mono">${j.id}</td><td>${esc(j.assetName)} <span class="muted">v${j.version}</span></td>${adm ? `<td>${esc(nameOf(j.owner))}</td>` : ""}<td class="mono">${j.start}–${j.end}</td><td>${PRESETS[j.preset].res}</td><td class="muted" title="${fullDate(j.finished)}">${ago(j.finished)}</td><td><div class="acts" style="justify-content:flex-start"><span class="out" style="margin:0">${esc(j.output)}</span><button class="btn sm" data-act="copyPath" data-path="${esc(j.output)}" aria-label="Copy path for ${j.id}">${I("copy")}Copy</button></div></td></tr>`).join("")}</tbody></table>` : '<div class="empty">No finished renders yet.</div>'}</div></section>`;
        }

        /* ================= users and activity (admin) ================= */
        function viewUsers(u) {
          return `<header class="page-head"><div><h1>Users</h1><p class="sub">Control who can sign in and what they can do. Admins see everything; artists see their own work and the approved library.</p></div><div class="head-actions"><button class="btn primary" data-act="newUser">${I("plus")}Add user</button></div></header>
    <section class="panel"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Assets</th><th>Jobs</th><th>Added</th><th><span class="sr">Actions</span></th></tr></thead><tbody>${state.users
      .map((x) => {
        const self = x.username === u.username;
        return `<tr><td><b>${esc(x.name)}</b>${self ? ' <span class="muted">(you)</span>' : ""}<div class="muted small mono">${esc(x.username)}</div></td>
      <td><label class="sel-inline"><span class="sr">Role for ${esc(x.name)}</span><select data-change="setRole" data-user="${esc(x.username)}"${self ? " disabled" : ""}><option value="admin"${x.role === "admin" ? " selected" : ""}>Admin</option><option value="user"${x.role === "user" ? " selected" : ""}>Artist</option></select></label></td>
      <td>${x.active ? chip("Active", "--st-done") : chip("Disabled", "--st-cancel")}</td>
      <td>${state.assets.filter((a) => a.owner === x.username).length}</td><td>${state.jobs.filter((j) => j.owner === x.username).length}</td><td class="muted">${ago(x.created)}</td>
      <td><div class="acts">${self ? "" : `<button class="btn sm" data-act="toggleUser" data-user="${esc(x.username)}">${x.active ? "Disable" : "Enable"}</button>`}</div></td></tr>`;
      })
      .join("")}</tbody></table></div></section>
    <p class="hint" style="margin-top:14px;max-width:70ch">Demo only. Accounts live in this browser and passwords are not hashed. Use a server with hashed passwords before real use.</p>`;
        }
        function logListHTML() {
          const q = ui.logQ.trim().toLowerCase();
          const list = state.log
            .filter(
              (l) =>
                !q || (whoName(l.who) + " " + l.text).toLowerCase().includes(q),
            )
            .slice(0, 100);
          return list.length
            ? `<ul class="log">${list.map((l) => `<li><span class="muted small" title="${fullDate(l.t)}">${ago(l.t)}</span><b>${esc(whoName(l.who))}</b><span>${esc(l.text)}</span></li>`).join("")}</ul>`
            : '<div class="empty">No activity matches.</div>';
        }
        function viewActivity() {
          return `<header class="page-head"><div><h1>Activity log</h1><p class="sub">Who did what across assets, renders, nodes, and accounts.</p></div><div class="head-actions"><button class="btn danger" data-act="askReset">${I("redo")}Reset demo data</button></div></header>
    <section class="panel"><div class="tools"><input id="logQ" type="search" placeholder="Search activity" aria-label="Search activity" value="${esc(ui.logQ)}"></div><div id="logList">${logListHTML()}</div></section>`;
        }

        /* ================= actions ================= */
        const needAdmin = () => {
          const u = me();
          if (!u || u.role !== "admin") {
            toast("Only admins can do that.", "bad");
            return false;
          }
          return true;
        };
        function copyText(text) {
          const done = () => toast("Path copied.");
          const fallback = () => {
            try {
              const t = document.createElement("textarea");
              t.value = text;
              t.style.cssText = "position:fixed;opacity:0";
              document.body.appendChild(t);
              t.select();
              const ok = document.execCommand("copy");
              t.remove();
              ok ? done() : toast(text);
            } catch (e) {
              toast(text);
            }
          };
          try {
            navigator.clipboard.writeText(text).then(done, fallback);
          } catch (e) {
            fallback();
          }
        }
        const actions = {
          go(t) {
            view = t.dataset.view;
            ui.assetQ = "";
            ui.assetType = "all";
            ui.logQ = "";
            ui.assetStatus = t.dataset.as || "all";
            ui.jobFilter = t.dataset.jf || "active";
            refresh(true);
            window.scrollTo(0, 0);
          },
          quickLogin(t) {
            doLogin(t.dataset.u, t.dataset.p);
          },
          openLogin(t) { openModal(loginModalHTML(t.dataset.role)); },
          openSignup() { openModal(signupModalHTML()); },
          signOut() {
            mutate(() => log("Signed out"));
            sdel(SKEY);
            seen = null;
            refresh(true);
          },
          closeModal() {
            closeModal();
          },
          confirmYes() {
            const f = confirmFn;
            confirmFn = null;
            closeModal();
            if (f) f();
          },
          newAsset() {
            openModal(assetFormHTML());
          },
          newJob(t) {
            closeModal();
            openJobModal(t.dataset.id);
          },
          newUser() {
            openModal(
              modalHTML(
                "Add user",
                `<form data-form="newUser" novalidate>
      <div class="field"><label for="un">Full name</label><input id="un" name="name" maxlength="50" autofocus></div>
      <div class="row2"><div class="field"><label for="uu">Username</label><input id="uu" name="username" maxlength="24" autocapitalize="off" spellcheck="false"></div>
      <div class="field"><label for="up">Password</label><input id="up" name="password" type="text" autocomplete="off"></div></div>
      <div class="field"><label for="ur">Role</label><select id="ur" name="role"><option value="user">Artist</option><option value="admin">Admin</option></select></div>
      <p class="err" role="alert" hidden></p>
      <div class="mfoot"><button class="btn" type="button" data-act="closeModal">Cancel</button><button class="btn primary" type="submit">Add user</button></div></form>`,
              ),
            );
          },
          openAsset(t) {
            const a = asset(t.dataset.id),
              u = me();
            if (a && u) openModal(assetModalHTML(u, a));
          },
          approve(t) {
            if (!needAdmin()) return;
            let name = "";
            mutate(() => {
              const a = asset(t.dataset.id);
              if (!a) return;
              a.status = "Approved";
              a.updated = Date.now();
              name = a.name;
              log(`Approved ${a.name} v${a.versions.length}`);
            });
            closeModal();
            refresh(true);
            if (name) toast(`${name} approved.`);
          },
          requestChanges(t) {
            if (!needAdmin()) return;
            let name = "";
            mutate(() => {
              const a = asset(t.dataset.id);
              if (!a) return;
              a.status = "Changes requested";
              a.updated = Date.now();
              name = a.name;
              log(`Requested changes on ${a.name}`);
            });
            closeModal();
            refresh(true);
            if (name) toast(`Sent ${name} back to its owner.`);
          },
          submitReview(t) {
            const u = me();
            let name = "";
            mutate(() => {
              const a = asset(t.dataset.id);
              if (
                !a ||
                !canEdit(u, a) ||
                !["Draft", "Changes requested"].includes(a.status)
              )
                return;
              a.status = "In review";
              a.updated = Date.now();
              name = a.name;
              log(`Sent ${a.name} for review`);
            });
            closeModal();
            refresh(true);
            if (name) toast(`${name} is now waiting for admin review.`);
          },
          askDeleteAsset(t) {
            const a = asset(t.dataset.id),
              u = me();
            if (!a || !u) return;
            if (
              !(
                u.role === "admin" ||
                (canEdit(u, a) && a.status !== "Approved")
              )
            ) {
              toast("You cannot delete approved assets.", "bad");
              return;
            }
            confirmDlg(
              "Delete this asset?",
              `${a.name} and its version history will be removed. Past render jobs keep their history.`,
              "Delete asset",
              () => {
                let ok = false;
                mutate(() => {
                  const x = asset(a.id);
                  if (!x) return;
                  state.assets = state.assets.filter((y) => y.id !== x.id);
                  ok = true;
                  log(`Deleted ${x.name}`);
                });
                refresh(true);
                if (ok) toast(`${a.name} deleted.`);
              },
            );
          },
          cancelJob(t) {
            const u = me();
            let id = "";
            mutate(() => {
              const j = jobBy(t.dataset.id);
              if (
                !j ||
                !(u.role === "admin" || j.owner === u.username) ||
                !["queued", "rendering"].includes(j.status)
              )
                return;
              j.status = "cancelled";
              j.finished = Date.now();
              id = j.id;
              log(`Cancelled ${j.id}`);
            });
            refresh(true);
            if (id) toast(`${id} cancelled.`);
          },
          requeueJob(t) {
            const u = me();
            let id = "";
            mutate(() => {
              const j = jobBy(t.dataset.id);
              if (
                !j ||
                !(u.role === "admin" || j.owner === u.username) ||
                !["failed", "cancelled"].includes(j.status)
              )
                return;
              j.status = "queued";
              j.error = null;
              j.node = null;
              j.finished = null;
              j.queuedAt = Date.now();
              id = j.id;
              log(`Requeued ${j.id}`);
            });
            refresh(true);
            if (id) toast(`${id} is back in the queue.`);
          },
          removeJob(t) {
            if (!needAdmin()) return;
            confirmDlg(
              "Remove this job?",
              "It will be deleted from the queue history. Finished output files are not affected.",
              "Remove job",
              () => {
                mutate(() => {
                  const j = jobBy(t.dataset.id);
                  if (!j || ["queued", "rendering"].includes(j.status)) return;
                  state.jobs = state.jobs.filter((x) => x.id !== j.id);
                  log(`Removed ${j.id} from history`);
                });
                refresh(true);
              },
            );
          },
          togglePause() {
            if (!needAdmin()) return;
            mutate(() => {
              state.paused = !state.paused;
              log(state.paused ? "Paused the queue" : "Resumed the queue");
            });
            refresh(true);
            toast(state.paused ? "Queue paused." : "Queue resumed.");
          },
          toggleNode(t) {
            if (!needAdmin()) return;
            mutate(() => {
              const n = state.nodes.find((x) => x.id === t.dataset.id);
              if (!n) return;
              n.online = !n.online;
              log(`Set ${n.id} ${n.online ? "online" : "offline"}`);
              if (!n.online)
                state.jobs.forEach((j) => {
                  if (j.status === "rendering" && j.node === n.id) {
                    j.status = "queued";
                    j.node = null;
                    log(
                      `${j.id} returned to the queue because ${n.id} went offline`,
                    );
                  }
                });
            });
            refresh(true);
          },
          toggleUser(t) {
            if (!needAdmin()) return;
            const me_ = me();
            let msg = "";
            mutate(() => {
              const x = userBy(t.dataset.user);
              if (!x || x.username === me_.username) return;
              if (
                x.active &&
                x.role === "admin" &&
                state.users.filter((y) => y.role === "admin" && y.active)
                  .length < 2
              ) {
                msg = "Keep at least one active admin.";
                return;
              }
              x.active = !x.active;
              log(
                `${x.active ? "Enabled" : "Disabled"} the account for ${x.name}`,
              );
            });
            refresh(true);
            if (msg) toast(msg, "bad");
          },
          askReset() {
            if (!needAdmin()) return;
            confirmDlg(
              "Reset demo data?",
              "This restores the sample assets, jobs, users, and activity. Anything you added is removed.",
              "Reset data",
              () => {
                mutate(() => {
                  state = seed();
                  log("Reset the demo data");
                });
                seen = null;
                refresh(true);
                toast("Demo data restored.");
              },
            );
          },
          copyPath(t) {
            copyText(t.dataset.path);
          },
        };
        const changes = {
          assetFilter(t) {
            ui[t.dataset.key] = t.value;
            const u = me();
            $("#assetRows").innerHTML = assetTable(u);
          },
          jobFilter(t) {
            ui.jobFilter = t.value;
            const u = me();
            $("#jobList").innerHTML = jobListHTML(u);
          },
          pri(t) {
            if (!needAdmin()) return;
            const p = parseInt(t.value, 10);
            mutate(() => {
              const j = jobBy(t.dataset.id);
              if (!j || j.status !== "queued") return;
              j.priority = p;
              log(`Set ${j.id} to ${PRI[p]} priority`);
            });
            refresh(true);
            toast(`${t.dataset.id} set to ${PRI[p]} priority.`);
          },
          setRole(t) {
            if (!needAdmin()) return;
            const self = me();
            let msg = "";
            mutate(() => {
              const x = userBy(t.dataset.user);
              if (!x || x.username === self.username) return;
              if (
                x.role === "admin" &&
                t.value !== "admin" &&
                state.users.filter((y) => y.role === "admin" && y.active)
                  .length < 2
              ) {
                msg = "Keep at least one active admin.";
                return;
              }
              x.role = t.value;
              log(
                `Changed ${x.name} to ${t.value === "admin" ? "Admin" : "Artist"}`,
              );
            });
            refresh(true);
            if (msg) toast(msg, "bad");
          },
        };
        const forms = {
          login(f) {
            const d = Object.fromEntries(new FormData(f));
            const un = String(d.username || "").trim().toLowerCase();
            const pw = String(d.password || "");
            const role = f.dataset.loginRole;
            const u = userBy(un);
            if (!u || u.password !== pw) return showErr(f, "That username and password do not match. Check both and try again.");
            if (!u.active) return showErr(f, "This account is disabled. Ask an admin to turn it back on.");
            if (u.role !== role) return showErr(f, `This account is registered as ${u.role === "admin" ? "an admin" : "an artist"}. Use the correct sign-in option.`);
            closeModal(); doLogin(un, pw);
          },
          signup(f) {
            const d = Object.fromEntries(new FormData(f));
            const name = String(d.name || "").trim(), un = String(d.username || "").trim().toLowerCase(), pw = String(d.password || ""), role = d.role === "admin" ? "admin" : "user";
            if (!name) return showErr(f, "Enter your full name.");
            if (!/^[a-z0-9._-]{3,24}$/.test(un)) return showErr(f, "Username must be 3–24 characters using letters, numbers, dots, dashes, or underscores.");
            if (pw.length < 6) return showErr(f, "Password must be at least 6 characters.");
            state = load();
            if (userBy(un)) return showErr(f, "That username is already taken.");
            mutate(() => { state.users.push({id:"u"+Date.now(), username:un, password:pw, name, role, active:true, created:Date.now()}); log("Created account", un); });
            closeModal(); toast("Account created. You can now sign in.");
          },

          login(f) {
            const d = Object.fromEntries(new FormData(f));
            if (!String(d.username || "").trim() || !d.password)
              return showErr(f, "Enter both a username and a password.");
            const err = doLogin(d.username, d.password);
            if (err) showErr(f, err);
          },
          newAsset(f) {
            const u = me(),
              d = Object.fromEntries(new FormData(f));
            const file = d.file && d.file.name ? d.file : null;
            let name = String(d.name || "").trim();
            if (!name && file) name = file.name.replace(/\.[^.]+$/, "");
            if (!name) return showErr(f, "Give the asset a name.");
            if (!TYPES.includes(d.type))
              return showErr(f, "Pick an asset type.");
            const m = file && file.name.match(/\.[^.]+$/);
            const fmt = m ? m[0].toLowerCase() : FORMATS[d.type];
            const size = file ? Math.max(0.1, file.size / 1048576) : null;
            let id = "";
            mutate(() => {
              const now = Date.now();
              id = "AST-" + String(++state.seq.asset).padStart(4, "0");
              state.assets.push({
                id,
                name,
                type: d.type,
                owner: u.username,
                status: u.role === "admin" ? "Approved" : "Draft",
                fmt,
                size,
                updated: now,
                versions: [
                  {
                    v: 1,
                    note: String(d.note || "").trim() || "Initial upload",
                    by: u.username,
                    at: now,
                  },
                ],
              });
              log(`Created ${name}`);
            });
            closeModal();
            refresh(true);
            toast(
              `${name} added${u.role === "admin" ? "." : " as a draft. Send it for review when it is ready."}`,
            );
          },
          version(f) {
            const u = me(),
              note =
                String(new FormData(f).get("note") || "").trim() ||
                "Updated file";
            let name = "";
            mutate(() => {
              const a = asset(f.dataset.id);
              if (!a || !canEdit(u, a)) return;
              const now = Date.now();
              a.versions.push({
                v: a.versions.length + 1,
                note,
                by: u.username,
                at: now,
              });
              a.updated = now;
              if (
                u.role !== "admin" &&
                (a.status === "Approved" || a.status === "Changes requested")
              )
                a.status = "In review";
              name = a.name;
              log(`Saved ${a.name} v${a.versions.length}: ${note}`);
            });
            if (!name) return;
            closeModal();
            refresh(true);
            toast(`Saved a new version of ${name}.`);
          },
          job(f) {
            const u = me(),
              d = Object.fromEntries(new FormData(f));
            const s = parseInt(d.start, 10),
              e = parseInt(d.end, 10);
            if (!(s >= 1) || !(e >= s))
              return showErr(
                f,
                "Enter a start frame of 1 or more and an end frame that is not before it.",
              );
            if (e - s + 1 > 2000)
              return showErr(
                f,
                "A job can have at most 2,000 frames. Split it into smaller ranges.",
              );
            if (!PRESETS[d.preset]) return showErr(f, "Pick a quality preset.");
            let id = "";
            mutate(() => {
              const a = asset(d.asset);
              if (!a || a.type !== "Scene" || !canSee(u, a)) return;
              let p = parseInt(d.priority, 10);
              if (!(p >= 0 && p <= 3)) p = 1;
              if (p === 3 && u.role !== "admin") p = 2;
              const now = Date.now();
              id = "RJ-" + ++state.seq.job;
              state.jobs.push({
                id,
                assetId: a.id,
                assetName: a.name,
                version: a.versions.length,
                start: s,
                end: e,
                preset: d.preset,
                priority: p,
                status: "queued",
                owner: u.username,
                node: null,
                done: 0,
                created: now,
                queuedAt: now,
                started: null,
                finished: null,
                output: null,
                error: null,
              });
              log(
                `Submitted ${id}: ${a.name} v${a.versions.length}, frames ${s} to ${e}`,
              );
            });
            if (!id)
              return showErr(
                f,
                "That scene is not available. Pick another one.",
              );
            closeModal();
            refresh(true);
            const j = jobBy(id);
            toast(
              `${id} added to the queue${j && j.status === "queued" ? ` at position ${position(j)}` : ""}.`,
            );
          },
          newUser(f) {
            if (!needAdmin()) return;
            const d = Object.fromEntries(new FormData(f)),
              name = String(d.name || "").trim(),
              un = String(d.username || "")
                .trim()
                .toLowerCase(),
              pw = String(d.password || "");
            if (!name) return showErr(f, "Enter the person\u2019s full name.");
            if (!/^[a-z0-9._-]{3,24}$/.test(un))
              return showErr(
                f,
                "Usernames use 3 to 24 letters, numbers, dots, dashes, or underscores.",
              );
            if (pw.length < 6)
              return showErr(f, "Passwords need at least 6 characters.");
            state = load();
            if (userBy(un))
              return showErr(f, "That username is taken. Try another one.");
            mutate(() => {
              state.users.push({
                id: "u" + Date.now(),
                username: un,
                password: pw,
                name,
                role: d.role === "admin" ? "admin" : "user",
                active: true,
                created: Date.now(),
              });
              log(
                `Added ${name} as ${d.role === "admin" ? "an admin" : "an artist"}`,
              );
            });
            closeModal();
            refresh(true);
            toast(`${name} can now sign in as ${un}.`);
          },
        };

        /* ================= events ================= */
        document.addEventListener("click", (e) => {
          const t = e.target.closest("[data-act]");
          if (!t) return;
          const fn = actions[t.dataset.act];
          if (fn) fn(t, e);
        });
        document.addEventListener("change", (e) => {
          const t = e.target.closest("[data-change]");
          if (t && changes[t.dataset.change]) changes[t.dataset.change](t);
        });
        document.addEventListener("input", (e) => {
          const t = e.target;
          if (t.id === "assetQ") {
            ui.assetQ = t.value;
            $("#assetRows").innerHTML = assetTable(me());
          } else if (t.id === "logQ") {
            ui.logQ = t.value;
            $("#logList").innerHTML = logListHTML();
          } else {
            const f = t.closest && t.closest('[data-form="job"]');
            if (f) updateJobSummary(f);
          }
        });
        document.addEventListener("submit", (e) => {
          e.preventDefault();
          const f = e.target,
            h = forms[f.dataset.form];
          if (h) h(f);
        });
        document.addEventListener("focusout", () => {
          if (!pending) return;
          setTimeout(() => {
            if (pending && !isEditing()) refresh(true);
          }, 0);
        });
        dlg.addEventListener("click", (e) => {
          if (e.target === dlg) closeModal();
        });
        dlg.addEventListener("close", () => {
          dlg.innerHTML = "";
          confirmFn = null;
          if (pending) refresh(true);
        });

        /* ================= start ================= */
        renderAll();
        lastSig = sig();
        setInterval(tick, 1200);
      })();
