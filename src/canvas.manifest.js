export const manifest = {
  screens: {
    scr_29h464: { name: "Splash", route: "/", state: { "phase": "splash" }, position: { "x": 160, "y": 2200 } },
    scr_gvwxau: { name: "Connexion", route: "/", state: { "phase": "auth" }, position: { "x": 1560, "y": 2200 } },
    scr_9wtfjh: { name: "Tableau de bord", route: "/", state: { "phase": "app", "activeView": "dashboard" }, position: { "x": 160, "y": 220 } },
    scr_qrhrqc: { name: "Produits", route: "/", state: { "phase": "app", "activeView": "products" }, position: { "x": 1560, "y": 220 } },
    scr_6racr4: { name: "Fiche d'entrée", route: "/", state: { "phase": "app", "activeView": "stockEntry" }, position: { "x": 160, "y": 4180 } },
    scr_3xk8k3: { name: "Fiche de sortie", route: "/", state: { "phase": "app", "activeView": "stockExit" }, position: { "x": 1560, "y": 4180 } },
    scr_6v6z0s: { name: "Mouvements", route: "/", state: { "phase": "app", "activeView": "movements" }, position: { "x": 2960, "y": 220 } },
    scr_iidi6o: { name: "Fournisseurs", route: "/", state: { "phase": "app", "activeView": "suppliers" }, position: { "x": 4360, "y": 220 } },
    scr_o8ap74: { name: "Catégories", route: "/", state: { "phase": "app", "activeView": "categories" }, position: { "x": 5760, "y": 220 } }
  },
  sections: {
    sec_xo91i2: { name: "Main Navigation", x: 0, y: 0, width: 7120, height: 1180 },
    sec_4d36i2: { name: "Authentication & Onboarding", x: 0, y: 1980, width: 2920, height: 1180 },
    sec_c9kt9w: { name: "Transaction Entry", x: 0, y: 3960, width: 2920, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_xo91i2", children: [
    { kind: "screen", id: "scr_9wtfjh" },
    { kind: "screen", id: "scr_qrhrqc" },
    { kind: "screen", id: "scr_6v6z0s" },
    { kind: "screen", id: "scr_iidi6o" },
    { kind: "screen", id: "scr_o8ap74" }]
  },
  { kind: "section", id: "sec_4d36i2", children: [
    { kind: "screen", id: "scr_29h464" },
    { kind: "screen", id: "scr_gvwxau" }]
  },
  { kind: "section", id: "sec_c9kt9w", children: [
    { kind: "screen", id: "scr_6racr4" },
    { kind: "screen", id: "scr_3xk8k3" }]
  }]

};