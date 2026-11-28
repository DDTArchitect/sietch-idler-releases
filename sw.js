// Offline copy for the home-screen web app. scripts/web.js fills in VERSION and FILES when it publishes.
// Opening the game asks the network first for the page itself (so a new version shows straight away), falling back to
// this copy when there is no signal. Everything else (fonts, icons) comes from the copy. The page also checks for a new
// version whenever the home-screen app comes back to the front and offers a Restart (sietch-idler.html, updateReady).
const VERSION = "0.4.15-1795877610854";
const FILES = ["./","index.html","manifest.webmanifest","fonts/barlow-latin-400-normal.woff2","fonts/barlow-latin-500-normal.woff2","fonts/barlow-latin-600-normal.woff2","fonts/barlow-latin-ext-400-normal.woff2","fonts/barlow-latin-ext-500-normal.woff2","fonts/barlow-latin-ext-600-normal.woff2","fonts/chakra-petch-latin-500-normal.woff2","fonts/chakra-petch-latin-600-normal.woff2","fonts/chakra-petch-latin-700-normal.woff2","fonts/chakra-petch-latin-ext-500-normal.woff2","fonts/chakra-petch-latin-ext-600-normal.woff2","fonts/chakra-petch-latin-ext-700-normal.woff2","fonts/fonts.css","icons/adv_mach.png","icons/adv_servok.png","icons/aetherium_ingot.png","icons/aluminum_ingot.png","icons/apple-touch-icon.png","icons/armor_plating.png","icons/ballistic_weave.png","icons/bandage.png","icons/bauxite_ore.png","icons/bg_chassis.png","icons/bg_cutter.png","icons/bg_engine.png","icons/bg_hull.png","icons/bg_psu.png","icons/bg_rear.png","icons/bg_store.png","icons/bg_tread.png","icons/blade_parts.png","icons/blueprint.png","icons/bm.png","icons/br_combat.png","icons/br_craft.png","icons/br_gather.png","icons/br_trade.png","icons/br_veh.png","icons/buggy.png","icons/carbide.png","icons/carbon_grit.png","icons/carbon_ore.png","icons/cis_1.png","icons/cis_2.png","icons/cis_3.png","icons/cobalt_alloy_ingot.png","icons/cobalt_crystal.png","icons/cobalt_paste.png","icons/compactor.png","icons/complex_mach.png","icons/comp_blade.png","icons/comp_gun.png","icons/copper_ingot.png","icons/copper_ore.png","icons/cp_chassis.png","icons/cp_engine.png","icons/cp_gen.png","icons/cp_hull.png","icons/cp_side.png","icons/cp_tail.png","icons/cp_thruster.png","icons/cp_wing.png","icons/cp_wing_roc.png","icons/cutter.png","icons/darts.png","icons/dew.png","icons/dunehide.png","icons/dura_plate.png","icons/dura_plating.png","icons/dust.png","icons/en_deserter.png","icons/en_guard.png","icons/en_mercenary.png","icons/en_raider.png","icons/en_scavenger.png","icons/en_smuggler.png","icons/erythrite.png","icons/essence.png","icons/fe_pump.png","icons/fiber.png","icons/field_actuator.png","icons/fuel.png","icons/gear_blade.png","icons/gear_boots.png","icons/gear_chest.png","icons/gear_dart.png","icons/gear_dual.png","icons/gear_gloves.png","icons/gear_hood.png","icons/gear_pants.png","icons/gear_pistol.png","icons/gear_rifle.png","icons/gear_sniper.png","icons/gear_sword.png","icons/gun_parts.png","icons/hcomp.png","icons/hdarts.png","icons/hp_cabin.png","icons/hp_centrifuge.png","icons/hp_centrifuge_r.png","icons/hp_chassis.png","icons/hp_engine.png","icons/hp_psu.png","icons/hp_tread.png","icons/hp_vacuum.png","icons/icon-192.png","icons/icon-512.png","icons/ind_pump.png","icons/iron_ingot.png","icons/iron_ore.png","icons/lcomp.png","icons/makeshift_chest.png","icons/mech_parts.png","icons/medkit.png","icons/med_cloth.png","icons/med_supplies.png","icons/mil_regulator.png","icons/oc_regulator.png","icons/osmium_ore.png","icons/particle_cap.png","icons/piston.png","icons/prism_fiber.png","icons/ray_amp.png","icons/ray_amp_t.png","icons/sandsilk.png","icons/scrap.png","icons/scrap_knife.png","icons/scrap_pistol.png","icons/scrip.png","icons/silica_dust.png","icons/silicone_block.png","icons/spice.png","icons/steel_ingot.png","icons/store_2.png","icons/store_3.png","icons/store_4.png","icons/store_5.png","icons/store_6.png","icons/st_chem.png","icons/st_fab.png","icons/st_gfab.png","icons/st_recycler.png","icons/st_refiner.png","icons/st_repair.png","icons/st_sfab.png","icons/st_spice.png","icons/st_vfab.png","icons/st_wfab.png","icons/sunglass_shard.png","icons/te_cooler.png","icons/torch.png","icons/tri_piston.png","icons/vfuel_1.png","icons/vfuel_2.png","icons/vfuel_3.png","icons/water.png","icons/weld_wire.png","icons/windtrap_1.png","icons/windtrap_2.png","icons/wt_1.png","icons/wt_2.png","icons/wt_3.png","icons/wt_4.png","icons/wt_5.png","icons/wt_6.png"];
const CACHE = 'sietch-' + VERSION;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  if (e.request.mode === 'navigate') {
    /* network first for the page, with a short timeout so a weak signal still opens the game from the copy */
    e.respondWith(caches.open(CACHE).then((c) => {
      const net = fetch(e.request).then((res) => { if (res && res.ok) c.put('index.html', res.clone()); return res; });
      const slow = new Promise((ok) => setTimeout(ok, 3000)).then(() => c.match('index.html'));
      return Promise.race([net.catch(() => c.match('index.html')), slow.then((hit) => hit || net)]).then((r) => r || net);
    }));
    return;
  }
  e.respondWith(caches.open(CACHE).then((c) => c.match(e.request, { ignoreSearch: true }).then((hit) => {
    const net = fetch(e.request).then((res) => { if (res && res.ok) c.put(e.request, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
