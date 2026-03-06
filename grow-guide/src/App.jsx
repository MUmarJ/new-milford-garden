import { useState, useEffect } from "react";

const WIKI_ITEMS = {
  "Apples": "Apple", "Pears (European)": "Pear", "Pears (Asian)": "Asian_pear",
  "Peaches": "Peach", "Nectarines": "Nectarine", "Plums (European)": "Plum",
  "Cherries (Sour/Tart)": "Sour_cherry", "Cherries (Sweet)": "Cherry",
  "Quince": "Quince", "Mulberry": "Mulberry", "Pawpaw": "Asimina_triloba",
  "American Persimmon": "Persimmon", "Medlar": "Medlar", "Apricots": "Apricot",
  "Blueberries": "Blueberry", "Raspberries (Summer)": "Raspberry",
  "Raspberries (Fall-bearing)": "Raspberry", "Black Raspberries": "Black_raspberry",
  "Blackberries": "Blackberry", "Strawberries (June-bearing)": "Strawberry",
  "Strawberries (Day-neutral)": "Strawberry", "Grapes (Table)": "Grape",
  "Grapes (Wine)": "Grape", "Currants & Gooseberries": "Redcurrant",
  "Elderberry": "Sambucus_nigra", "Honeyberry / Haskap": "Lonicera_caerulea",
  "Hardy Kiwi": "Actinidia_arguta", "Serviceberry / Juneberry": "Amelanchier",
  "Figs (with protection)": "Common_fig", "Cornelian Cherry": "Cornus_mas",
  "Aronia / Chokeberry": "Aronia_melanocarpa", "Lingonberry": "Lingonberry",
  "Beach Plum": "Prunus_maritima", "Jostaberry": "Jostaberry",
  "Tomatoes": "Tomato", "Peppers (Sweet)": "Bell_pepper", "Peppers (Hot)": "Chili_pepper",
  "Zucchini / Summer Squash": "Zucchini", "Winter Squash": "Butternut_squash",
  "Pumpkins": "Pumpkin", "Cucumbers": "Cucumber", "Sweet Corn": "Sweet_corn",
  "Beans (Snap/Pole)": "Green_bean", "Beans (Lima/Edamame)": "Edamame",
  "Melons (Cantaloupe)": "Cantaloupe", "Watermelon": "Watermelon",
  "Eggplant": "Eggplant", "Sweet Potatoes": "Sweet_potato", "Potatoes": "Potato",
  "Okra": "Okra", "Ground Cherries": "Physalis_peruviana", "Tomatillos": "Tomatillo",
  "Lettuce": "Lettuce", "Spinach": "Spinach", "Kale": "Kale",
  "Swiss Chard": "Chard", "Broccoli": "Broccoli", "Cauliflower": "Cauliflower",
  "Cabbage": "Cabbage", "Brussels Sprouts": "Brussels_sprout", "Peas": "Pea",
  "Carrots": "Carrot", "Beets": "Beetroot", "Radishes": "Radish", "Turnips": "Turnip",
  "Parsnips": "Parsnip", "Onions": "Onion", "Garlic": "Garlic", "Leeks": "Leek",
  "Kohlrabi": "Kohlrabi", "Asian Greens": "Bok_choy",
  "Radicchio / Endive": "Radicchio", "Napa Cabbage": "Napa_cabbage",
  "Asparagus": "Asparagus", "Rhubarb": "Rhubarb", "Sunchokes": "Jerusalem_artichoke",
  "Horseradish": "Horseradish", "Fiddlehead Ferns": "Fiddlehead_fern",
  "Sorrel": "Sorrel", "Groundnuts": "Apios_americana",
  "Artichokes (annual)": "Globe_artichoke", "Celeriac": "Celeriac",
  "Florence Fennel": "Fennel", "Thyme": "Thyme", "Oregano": "Oregano",
  "Sage": "Salvia_officinalis", "Chives": "Chives", "Mint": "Mentha",
  "French Tarragon": "Tarragon", "Lovage": "Lovage", "Basil": "Basil",
  "Cilantro": "Coriander", "Dill": "Dill", "Parsley": "Parsley", "Rosemary": "Rosemary",
  "Jujube": "Jujube", "Che Fruit": "Maclura_tricuspidata",
  "Chestnuts": "Chestnut", "Hazelnuts": "Hazelnut", "Black Walnuts": "Juglans_nigra",
  "Butternuts": "Juglans_cinerea", "Hickory": "Carya_ovata", "Heartnuts": "Juglans_ailantifolia",
  "Goji Berry": "Goji_berry", "Goumi": "Elaeagnus_multiflora", "Wineberry": "Rubus_phoenicolasius",
  "Rutabaga": "Rutabaga", "Mache / Corn Salad": "Valerianella_locusta",
  "Claytonia": "Claytonia_perfoliata", "Hops": "Humulus_lupulus",
};

// Static fallback images for items where Wikipedia API fails or returns no/wrong thumbnail
// Also used to ensure duplicate wiki keys get unique images
const FALLBACK_IMAGES = {
  // Override botanical illustrations with real photos
  "Garlic": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/GarlicBasket.jpg/200px-GarlicBasket.jpg",
  "Peach": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Autumn_Red_peaches.jpg/200px-Autumn_Red_peaches.jpg",
  "Sour_cherry": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Sauerkirschen.jpg/200px-Sauerkirschen.jpg",
  // Wikipedia API returns no thumbnail for these
  "Black_raspberry": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Rubus_occidentalis_2008_07_06.JPG/200px-Rubus_occidentalis_2008_07_06.JPG",
  "Napa_cabbage": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Napa_cabbages.png/200px-Napa_cabbages.png",
  "Jostaberry": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Ribes_nidigrolaria.jpg/200px-Ribes_nidigrolaria.jpg",
  "Asparagus": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Asparagus.jpg/200px-Asparagus.jpg",
  // Unique images for items sharing the same wiki key
  "Nectarine": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Nectarine.jpg/200px-Nectarine.jpg",
  "Raspberry_fall": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Red_Raspberry_%28Rubus_idaeus%29_-_Thunder_Bay%2C_Ontario.jpg/200px-Red_Raspberry_%28Rubus_idaeus%29_-_Thunder_Bay%2C_Ontario.jpg",
  "Strawberry_dayneutral": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/PerfectStrawberry.jpg/200px-PerfectStrawberry.jpg",
  "Grape_wine": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kyoho-grape.jpg/200px-Kyoho-grape.jpg",
};

const DATA = [
  { category: "Tree Fruits", icon: "🍎", color: "#C0392B", bg: "#FDEDEC", items: [
    { name: "Apples", diff: 1, desc: "Best overall fruit tree for CT. Disease-resistant cultivars reduce spray needs dramatically. 280+ CT farms grow them commercially.", varieties: "Liberty, Enterprise, Freedom, GoldRush, Pristine, CrimsonCrisp, Honeycrisp, Macoun, McIntosh, Cortland, Empire, Northern Spy, Golden Russet", notes: "Need 2+ varieties for pollination. Semi-dwarf rootstock (M.26, G.935) recommended. Crabapples serve as universal pollinators." },
    { name: "Pears (European)", diff: 2, desc: "Reliable with fire blight–resistant selections. Ripen off the tree for best texture.", varieties: "Harrow Sweet, Harrow Delight, Moonglow, Blake's Pride, Potomac, Seckel", notes: "Need 2 varieties. Bartlett and Seckel won't cross-pollinate each other." },
    { name: "Pears (Asian)", diff: 2, desc: "Perform exceptionally well in CT. Crisp texture, eaten fresh. A Warren, CT grower maintains 11 trees successfully.", varieties: "Shinseiki, Hosui, Chojuro, 20th Century, Shinko, Shin Li", notes: "Need 2 varieties. More disease-resistant than European pears." },
    { name: "Peaches", diff: 3, desc: "Adapted to Zone 6 but late spring frost kills blossoms many years. Site selection critical.", varieties: "Reliance (hardiest, to -25°F), Contender (late-bloom), Red Haven, Madison, Harrow Beauty, Curlfree (leaf curl resistant)", notes: "Self-fertile. Plant on NORTH slope to delay bloom — UConn recommendation." },
    { name: "Nectarines", diff: 3, desc: "Same care as peaches. Fuzzless skin bruises easier but worth trying alongside peaches.", varieties: "Mericrest (bred at UNH for New England), Hardired", notes: "Self-fertile. Same frost-avoidance strategy as peaches." },
    { name: "Plums (European)", diff: 2, desc: "Far more reliable than Japanese types. Bloom later, many self-fertile, tolerate humidity.", varieties: "Stanley (classic prune plum), Italian/Fellenberg, Green Gage (superb flavor), Blue Damson, Mount Royal", notes: "Most are self-fertile. Watch for black knot disease. Japanese-American hybrids (Superior, Toka) offer a compromise." },
    { name: "Cherries (Sour/Tart)", diff: 2, desc: "Significantly more reliable than sweet cherries in CT humidity. Self-fertile, very hardy.", varieties: "Montmorency (classic pie cherry), North Star (dwarf 8–10 ft), Balaton (sweeter Hungarian type)", notes: "Self-fertile — one tree sufficient. Excellent for pies and preserves." },
    { name: "Cherries (Sweet)", diff: 3, desc: "Possible with self-fertile varieties. Brown rot is the main challenge in humid summers.", varieties: "BlackGold, WhiteGold (both Cornell releases for NE), Stella, Lapins (crack-resistant)", notes: "Choose self-fertile varieties. Good air circulation essential." },
    { name: "Quince", diff: 1, desc: "Low-maintenance, self-fertile, few pest problems. Fragrant fruit for preserves.", varieties: "Champion, Pineapple, Orange, Aromatnaya (Russian)", notes: "Self-fertile. Susceptible to fire blight and cedar-quince rust." },
    { name: "Mulberry", diff: 1, desc: "Essentially carefree. Long harvest June–Aug. Stains everything; attracts birds.", varieties: "Illinois Everbearing (standard), Gerardi Dwarf (6–8 ft for small spaces)", notes: "Self-fertile. Plant away from walkways (staining)." },
    { name: "Pawpaw", diff: 2, desc: "Native tree with tropical-flavored fruit (custard/mango/banana). Shade young trees first 2 summers.", varieties: "Shenandoah, Susquehanna, Potomac (all Peterson selections), Sunflower", notes: "Need 2 genetically different trees (self-incompatible). Pollinated by flies — hand pollination helps." },
    { name: "American Persimmon", diff: 1, desc: "Native, virtually zero maintenance, hardy to Zone 4. Do NOT plant Japanese types here.", varieties: "Prok, Meader (rare self-fertile variety), Yates, Early Golden", notes: "Most are dioecious — plant several, or choose Meader. Astringent until fully ripe." },
    { name: "Medlar", diff: 1, desc: "Hardy, self-fertile, pest-free. Available from Cricket Hill Garden (Thomaston, CT nursery).", varieties: "Nottingham (best flavor), Breda Giant, Royal", notes: "Fruit must 'blet' (soften after picking) before eating." },
    { name: "Apricots", diff: 4, desc: "THE gamble. Blooms 2–3 wks before peaches — frost kills crop most years. One western CT grower: 1 fruit in 20 years.", varieties: "Goldcot (bred at MSU, latest bloom), Harglow (Canadian, late bloom)", notes: "Plant on north slope. Expect crop failures most years." },
    { name: "Jujube", diff: 4, desc: "Marginal — trees survive Zone 6b but short, cool summers often prevent optimal fruit ripening.", varieties: "Li (largest fruit), Lang, Sugar Cane (sweetest)", notes: "Worth experimenting against south-facing wall with reflected heat. Self-fertile." },
    { name: "Che Fruit", diff: 3, desc: "Maclura tricuspidata. Trees cold-hardy to -20F but fruit ripening unreliable in Zone 6.", varieties: "Norris (available from Cricket Hill Garden, Thomaston CT)", notes: "Related to Osage orange. Sweet, mulberry-like fruit when fully ripe. Dioecious." },
  ]},
  { category: "Nut Trees", icon: "🌰", color: "#795548", bg: "#EFEBE9", items: [
    { name: "Chestnuts", diff: 2, desc: "Chinese and hybrid chestnuts are blight-resistant and thrive in NE acidic soils. Bear in 3-5 years from grafted stock.", varieties: "Colossal (large nut), Dunstan hybrids (blight-resistant), Qing (Chinese, sweet)", notes: "Need 2 varieties for cross-pollination. American chestnut restoration hybrids also available." },
    { name: "Hazelnuts", diff: 2, desc: "American-European hybrids combine native disease resistance with larger European nut size. Produce in 3-4 years.", varieties: "Yamhill, Jefferson, Theta (all OSU releases, Eastern Filbert Blight resistant)", notes: "Plant in groups for wind pollination. Arbor Day Foundation and Badgersett offer NE-adapted selections." },
    { name: "Black Walnuts", diff: 2, desc: "Native, extremely hardy (Zone 4). Richly flavored nuts prized for baking. Very long-lived trees.", varieties: "Thomas (thin-shelled), Sparrow (thin-shelled, easier cracking)", notes: "CAUTION: Roots produce juglone, toxic to tomatoes, peppers, blueberries. Keep 50-80 ft from veggie gardens." },
    { name: "Butternuts", diff: 3, desc: "Native white walnut, hardy to Zone 3. Milder flavor than black walnut. Endangered by butternut canker.", varieties: "Seek canker-resistant selections from specialty nurseries", notes: "Threatened species — growing them supports conservation. Less juglone than black walnut." },
    { name: "Hickory", diff: 3, desc: "Shagbark hickory is native, produces sweet nuts similar to pecans. Slow to bear (8-10 yrs) but extremely long-lived.", varieties: "Weschcke, Yoder #1, Grainger. Hicans (hickory-pecan hybrids): Burton", notes: "Hicans offer larger nuts with easier cracking. Northern pecans (Kanza, Pawnee) marginal in Zone 6b." },
    { name: "Heartnuts", diff: 2, desc: "Japanese walnut (Juglans ailantifolia var. cordiformis). Heart-shaped nuts crack out in whole halves. Hardy to Zone 5.", varieties: "Campbell CW3, Imshu", notes: "Less juglone concern than black walnut. Attractive ornamental tree. Self-fertile but better with cross-pollination." },
  ]},
  { category: "Berries & Small Fruits", icon: "🫐", color: "#6C3483", bg: "#F4ECF7", items: [
    { name: "Blueberries", diff: 1, desc: "CT's acidic soil (pH 4.8–5.5) is PERFECT — no amendment needed. Bird netting essential.", varieties: "Duke (early, late-blooming avoids frost), Patriot (heavy soil OK), Bluecrop (mid, industry standard), Blueray, Jersey (late, long-lived), Elliott (latest), Chandler (huge berries)", notes: "Plant 2–3 varieties for cross-pollination + extended harvest. Mulch 4\" woodchips." },
    { name: "Raspberries (Summer)", diff: 1, desc: "CT climate excels for raspberries. One large crop in July.", varieties: "Latham (extremely hardy), Killarney, Nova (thornless, disease-resistant), Canby (nearly thornless). Purple: Royalty (large, very sweet)", notes: "Prune out fruited canes after harvest. Trellis recommended. Royalty purple raspberry is exceptionally productive." },
    { name: "Raspberries (Fall-bearing)", diff: 1, desc: "Fruit on new wood Aug–frost. Simpler pruning (mow all canes in spring). May dodge SWD pressure.", varieties: "Heritage (most planted, reliable), Caroline (larger berries, excellent flavor), Joan J (thornless)", notes: "Can mow entire patch to ground each spring. Very easy management." },
    { name: "Black Raspberries", diff: 2, desc: "Unique rich flavor. More disease-prone than red types but worth growing.", varieties: "Jewel (most widely planted, disease-tolerant), Bristol", notes: "Tip-layer to propagate. Keep away from wild brambles (disease vector)." },
    { name: "Blackberries", diff: 2, desc: "Modern thornless varieties transformed northern blackberry growing.", varieties: "Triple Crown (thornless, excellent), Chester (very hardy, late), Ouachita (erect, disease-resistant), Illini Hardy (thorned, most cold-tolerant), Prime-Ark Freedom (primocane, thornless)", notes: "Prime-Ark Freedom fruits on new wood — confirmed successful Zone 6b." },
    { name: "Strawberries (June-bearing)", diff: 1, desc: "One large crop in June. Renovate beds after harvest for multi-year production.", varieties: "Earliglow (#1 NE pick, exceptional flavor), Honeoye (early, very productive), Jewel, Allstar (disease-resistant, beginner-friendly), Cabot (very large), Malwina (latest, highest sugar)", notes: "Remove first-year flowers for stronger plants. Mulch with straw." },
    { name: "Strawberries (Day-neutral)", diff: 1, desc: "Continuous production June through frost. Hedges against late frost destroying crop.", varieties: "Seascape (heavy producer), Albion (firm, sweet), Tristar", notes: "Treat as annuals or short-lived perennials. Remove runners for best yields." },
    { name: "Grapes (Table)", diff: 2, desc: "CT has 40+ wineries — this climate works. Table grapes for fresh eating and juice.", varieties: "Concord (bulletproof, the classic), Niagara (white/green), Reliance (red seedless, very hardy), Canadice (red seedless), Mars, Jupiter (blue seedless)", notes: "Need sturdy trellis. Prune hard late winter. Spotted lanternfly threat now in Litchfield County." },
    { name: "Grapes (Wine)", diff: 3, desc: "Cold-hardy hybrids from U of MN revolutionized northern winemaking.", varieties: "Marquette (to -30°F, premier cold-climate red), Frontenac, Frontenac Gris, La Crescent (aromatic white), Cayuga White, Seyval Blanc, Chambourcin", notes: "Disease management program essential in CT humidity." },
    { name: "Currants & Gooseberries", diff: 1, desc: "Thrive in CT's cool, humid climate. Partial shade OK. Few pest problems.", varieties: "Red Lake, Rovada (excellent fresh), Jonkheer Van Tets, Titania (black, rust-resistant), Pink Champagne, White Imperial, Invicta (gooseberry, mildew-resistant), Hinnomaki Red, Pixwell, Jostaberry (currant×gooseberry cross)", notes: "Shade tolerant. Excellent for jams, jellies, syrups." },
    { name: "Elderberry", diff: 1, desc: "Native shrub. MUST cook berries before eating (raw berries toxic). Immune-boosting syrups.", varieties: "Adams, York, Nova, Bob Gordon (3× yields of others)", notes: "Plant 2 for cross-pollination. Prune out 3+ year old canes." },
    { name: "Honeyberry / Haskap", diff: 1, desc: "Earliest fruit of the season — ripens 2–3 weeks before strawberries. Extremely cold-hardy (Zones 2–7).", varieties: "Borealis (best flavor), Tundra, Aurora, Boreal series (newer, larger fruit)", notes: "Need 2 compatible cultivars from different pollination groups." },
    { name: "Hardy Kiwi", diff: 2, desc: "Confirmed fruiting in CT, producing fruit 3 years after planting. Grape-sized, smooth-skinned, sweet. Vines grow 30 ft/yr.", varieties: "Ananasnaya/Anna (pineapple flavor), Issai (only self-fertile cultivar), Geneva", notes: "Need strong trellis (like grapes). Need male + female plants unless using Issai." },
    { name: "Serviceberry / Juneberry", diff: 1, desc: "Native ornamental with blueberry-like fruit. Beautiful spring flowers, fall color.", varieties: "Regent (compact Saskatoon type), Thiessen, native Amelanchier species", notes: "Low maintenance. Birds compete for fruit — netting helps." },
    { name: "Figs (with protection)", diff: 3, desc: "CT growers harvest 1,300+ figs/yr with winter wrapping. One family: in-ground fig trees for 90+ years.", varieties: "Chicago Hardy (stems hardy to 10°F, roots to -20°F, fruits on new wood), Brown Turkey, Celeste, Violette de Bordeaux", notes: "Wrap in burlap/insulation or bury under dry leaves with weighted tarp. Container growing also works." },
    { name: "Cornelian Cherry", diff: 1, desc: "Cornus mas — earliest spring bloom, virtually pest-free. Tart fruit for syrups/preserves.", varieties: "Elegant, Jolico, Pioneer (all selected for fruit quality)", notes: "Hardy Zone 4. Self-fertile but better yields with 2 plants." },
    { name: "Aronia / Chokeberry", diff: 1, desc: "Native, bulletproof. Grows in ANY soil — wet, dry, clay, poor. CT farms grow commercially.", varieties: "Viking, Nero, Autumn Magic", notes: "Astringent raw but excellent processed (juice, jam, wine). Highest antioxidants of any temperate berry." },
    { name: "Lingonberry", diff: 2, desc: "Evergreen groundcover producing tart red berries. Needs acidic soil like blueberries.", varieties: "Koralle, Red Pearl, Splendor", notes: "Low-growing (12–18 in). Slow to establish but long-lived." },
    { name: "Beach Plum", diff: 2, desc: "Native coastal species that grows inland with well-drained soil. Exceptional jam.", varieties: "Seedling selections (few named cultivars available)", notes: "Zones 3–7. Very ornamental. Plant several for cross-pollination." },
    { name: "Goji Berry", diff: 2, desc: "Lycium barbarum. Hardy to Zone 5, self-fertile, drought-tolerant once established.", varieties: "Crimson Star, Phoenix Tears, Sweet Lifeberry", notes: "Grows readily in Zone 6. Can be invasive via suckers — contain or manage. Berries ripen mid-summer." },
    { name: "Goumi", diff: 2, desc: "Elaeagnus multiflora. Nitrogen-fixing shrub with sweet-tart berries. Hardy to Zone 4.", varieties: "Sweet Scarlet (largest fruit), Red Gem", notes: "Self-fertile but better yields with 2. Fixes nitrogen — improves surrounding soil. Few pest issues." },
    { name: "Wineberry", diff: 1, desc: "Rubus phoenicolasius. Beautiful red-stemmed raspberry relative. Produces sweet, jewel-like berries.", varieties: "Wild type (no named cultivars — all are excellent)", notes: "Considered invasive in some states — check local regulations. Self-fertile, spreads readily." },
  ]},
  { category: "Warm-Season Vegetables", icon: "🍅", color: "#D35400", bg: "#FDF2E9", items: [
    { name: "Tomatoes", diff: 1, desc: "CT's most popular garden crop. Start indoors 6–8 weeks before transplant (late March).", varieties: "Early Girl, Sungold (must-grow cherry), Celebrity (VFN resistant), Big Beef (VFFNTA), Mountain Merit (late blight resistant), Cherokee Purple, Brandywine, Black Krim, San Marzano, Juliet (crack-resistant grape), Amish Paste", notes: "Sungold universally called 'must-grow' by CT gardeners. Mountain Merit essential for humid summers." },
    { name: "Peppers (Sweet)", diff: 2, desc: "More challenging than tomatoes — cool nights slow them. Black plastic mulch helps significantly.", varieties: "King of the North (#1 for NE, bred for short seasons/cool weather), Ace (fastest bell, 50–60d), Carmen (AAS winner Italian frying), Jimmy Nardello (prolific heirloom), California Wonder", notes: "Start indoors 8–10 weeks before transplant. Row covers extend season." },
    { name: "Peppers (Hot)", diff: 2, desc: "Short-season varieties essential. Habanero (90–100d) is a stretch — start very early.", varieties: "Early Jalapeño (65d), Hungarian Hot Wax (58–65d, excellent short-season), Cayenne, Serrano, Habanero (challenge crop)", notes: "Containers work well for hot peppers. Start indoors 8–10 weeks early." },
    { name: "Zucchini / Summer Squash", diff: 1, desc: "Prolific. Succession-plant June + early July to dodge squash vine borers.", varieties: "Dunja (powdery mildew resistant, CT pick), Costata Romanesco (superior flavor), Yellow Crookneck, Sunburst pattypan", notes: "Vine borer defense: row covers until flowering, or late July planting dodges borer moths." },
    { name: "Winter Squash", diff: 2, desc: "Butternut types have dense stems that naturally resist vine borers — major advantage.", varieties: "Waltham Butternut (standard), Honeynut (intense sweetness, mini), Delicata (edible skin), Table Queen acorn (80–85d), Red Kuri/Kabocha, Tromboncino (borer-immune Italian)", notes: "Butternut/Tromboncino = best vine borer defense. Blue Hubbard tight at 100–120d." },
    { name: "Pumpkins", diff: 1, desc: "Heritage Connecticut crop. Direct sow late May to early June.", varieties: "Connecticut Field (the classic), Howden (bred in CT, standard jack-o'-lantern), Sugar Pie, New England Pie", notes: "Need space (vines spread 15–20 ft). Semi-bush varieties for small gardens." },
    { name: "Cucumbers", diff: 1, desc: "Direct sow after frost or start indoors 3–4 weeks early.", varieties: "Marketmore 76 (disease-resistant slicer), Northern Pickling (very short season, CT recommended), Diva (seedless, parthenocarpic)", notes: "Cucumber beetles transmit bacterial wilt — row covers until flowering = primary defense." },
    { name: "Sweet Corn", diff: 2, desc: "Plant in blocks (not rows) for pollination. Raccoon fencing often needed in CT.", varieties: "Temptation (69d bicolor), Peaches & Cream, Butter & Sugar, Incredible, Silver Queen (92d — tight, needs early planting)", notes: "Direct sow after soil reaches 60°F. Needs space — not ideal for small gardens." },
    { name: "Beans (Snap/Pole)", diff: 1, desc: "Direct sow after last frost. One of the easiest warm-season crops.", varieties: "Provider (cold-soil tolerant, earliest), Blue Lake 274 (classic flavor), Contender, Kentucky Wonder (pole), Fortex (pole, long French filet)", notes: "Provider and Contender germinate in cooler soil than other beans." },
    { name: "Beans (Lima/Edamame)", diff: 2, desc: "Need warmer soil than snap beans. Bush limas more reliable for CT than pole types.", varieties: "Fordhook 242 (bush lima, more reliable for CT), Midori Giant edamame (75–90d)", notes: "Wait until soil is 65°F+. Edamame surprisingly productive in Zone 6b." },
    { name: "Melons (Cantaloupe)", diff: 3, desc: "Possible but demanding. Black plastic + transplants + row covers are mandatory, not optional.", varieties: "Minnesota Midget (68d), Halona (bred at UNH for NE, disease-resistant), Sugar Cube", notes: "Choose varieties under 80 days. IRT mulch film helps. Start indoors 3–4 weeks early." },
    { name: "Watermelon", diff: 3, desc: "Icebox types (small) most reliable. Same season-extension treatment as cantaloupe.", varieties: "Blacktail Mountain (70d, developed for 75-day seasons), Sugar Baby, New Hampshire Midget", notes: "Blacktail Mountain developed for short-season areas — best bet for CT." },
    { name: "Eggplant", diff: 2, desc: "Loves heat. Black plastic mulch essential. Asian/mini types mature faster.", varieties: "Orient Express (58–65d, best short-season), Fairy Tale (50–65d, mini, heavy yields), Nadia (67d), Black Beauty", notes: "Start indoors 8–10 weeks. Flea beetles are main pest — row covers help." },
    { name: "Sweet Potatoes", diff: 3, desc: "Yes, they work in CT! Black plastic mulch essential for soil warming.", varieties: "Beauregard (best yields in MOFGA NE trials), Georgia Jet (80–90d, earliest), Covington", notes: "Plant slips after soil is thoroughly warm (late May/June). Cure at 80–85°F after harvest." },
    { name: "Potatoes", diff: 1, desc: "Love CT's naturally acidic soil. Plant mid-April, 2–3 weeks before last frost.", varieties: "Yukon Gold, Kennebec (late blight resistant NE classic), Red Norland (early), Katahdin (excellent storage), Adirondack Blue", notes: "Hill soil around stems as they grow. Kennebec has good late blight resistance." },
    { name: "Okra", diff: 3, desc: "Marginal for CT but doable with earliest varieties and full sun. Heat lover.", varieties: "Cajun Delight (50–55d), Annie Oakley II (50–55d)", notes: "Start indoors. Black plastic mulch. Choose ONLY 50–55 day varieties." },
    { name: "Ground Cherries", diff: 1, desc: "Sweet tropical-flavored fruit in paper husks. Self-sowing annual. Kids love them.", varieties: "Aunt Molly's (standard, excellent flavor)", notes: "Prolific. Fruit drops when ripe — harvest from ground. Will self-sow." },
    { name: "Tomatillos", diff: 1, desc: "Prolific salsa verde staple. Need 2+ plants for pollination.", varieties: "Toma Verde (standard green), Purple tomatillo", notes: "Cross-pollinate: plant at least 2. Very vigorous — give space." },
  ]},
  { category: "Cool-Season Vegetables", icon: "🥬", color: "#1E8449", bg: "#EAFAF1", items: [
    { name: "Lettuce", diff: 1, desc: "Two windows: spring (April–May) and fall (Aug–Sept sow). Shade cloth in summer prevents bolting.", varieties: "Jericho (heat-tolerant romaine), Winter Density (cold-hardy), Buttercrunch (heat-tolerant butterhead), Red Sails, Black Seeded Simpson", notes: "Succession-sow every 2 weeks. Row cover extends fall harvest into December." },
    { name: "Spinach", diff: 1, desc: "Best spring and fall — bolts above 75°F. Direct sow as soon as soil is workable.", varieties: "Bloomsdale Long Standing, Space (CT recommended), Tyee (excellent bolt resistance)", notes: "Fall spinach (sow late Aug) is often better quality than spring." },
    { name: "Kale", diff: 1, desc: "Sweetens dramatically after frost. Harvest through December with row cover.", varieties: "Winterbor (extremely cold-hardy, CT recommended), Lacinato/Dinosaur (sweetest after frost), Red Russian", notes: "Start June for fall/winter harvest. Can overwinter under snow for early spring harvest." },
    { name: "Swiss Chard", diff: 1, desc: "Both heat and cold tolerant — one of the longest-producing greens (spring through fall).", varieties: "Bright Lights (ornamental multicolor), Fordhook Giant", notes: "Cut-and-come-again harvest. Ornamental enough for flower borders." },
    { name: "Broccoli", diff: 2, desc: "Better as fall crop in CT (spring plantings bolt). Choose side-shoot types for extended harvest.", varieties: "DeCicco (many side shoots), Green Magic (early), Waltham 29 (bred for NE fall production)", notes: "Row cover deters cabbage worms. Start indoors March (spring) or June (fall)." },
    { name: "Cauliflower", diff: 3, desc: "Fussiest brassica. Needs consistent moisture and moderate temps. Fall crop more reliable.", varieties: "Snow Crown (reliable NE hybrid), Amazing (self-blanching)", notes: "Self-blanching varieties save work. Heads must be shielded from sun to stay white." },
    { name: "Cabbage", diff: 1, desc: "Reliable spring and fall. Storage varieties keep months in cold storage.", varieties: "Stonehead (compact, split-resistant, CT pick), Early Jersey Wakefield, Danish Ballhead (stores 4–6 months), Savoy Ace", notes: "Danish Ballhead stores 4–6 months in root cellar." },
    { name: "Brussels Sprouts", diff: 2, desc: "Frost dramatically sweetens them. Start May–June for Oct–Nov harvest.", varieties: "Jade Cross, Diablo, Long Island Improved", notes: "Remove lower leaves as sprouts develop. Top the plant in Sept to size up sprouts." },
    { name: "Peas", diff: 1, desc: "Among the earliest crops — direct seed late March when soil is workable.", varieties: "Sugar Snap (original, tall), Super Sugar Snap (disease-resistant), Oregon Sugar Pod (dwarf snow), Lincoln (shelling)", notes: "Inoculate with rhizobium. Provide trellis. Stop producing in summer heat." },
    { name: "Carrots", diff: 2, desc: "For CT's rocky soil, choose short/blunt types. Raised beds solve rock problems.", varieties: "Danvers Half Long (bred for hard NE soils!), Chantenay (short, 4–5 in), Bolero (storage), Napoli, Yaya, Thumbelina (round, stony ground OK)", notes: "Danvers was literally bred for New England's stony soils. Thin seedlings to 2 in." },
    { name: "Beets", diff: 1, desc: "Easy dual-purpose — eat both roots and greens.", varieties: "Detroit Dark Red, Chioggia (candy-striped), Touchstone Gold, Cylindra (uniform slices)", notes: "Soak seeds overnight. Each 'seed' is a cluster — thin early." },
    { name: "Radishes", diff: 1, desc: "Fastest crop in the garden — spring types ready in 22–30 days.", varieties: "Cherry Belle (22d), French Breakfast, Daikon (fall/winter), Watermelon radish (fall)", notes: "Winter types sow late July–Aug. Spring types bolt in heat." },
    { name: "Turnips", diff: 1, desc: "Japanese salad turnips are a revelation — sweet, crisp, eat raw.", varieties: "Hakurei (incredibly sweet, 35d — highly recommended), Purple Top White Globe (storage)", notes: "Succession sow spring and fall. Hakurei turnips are transformative." },
    { name: "Rutabaga", diff: 1, desc: "Hardier and larger than turnips. Frost converts starch to sugar. Excellent winter storage crop.", varieties: "American Purple Top (classic, 90d), Laurentian", notes: "Can overwinter in ground with mulch. Stores months in root cellar. Sow mid-summer for fall harvest." },
    { name: "Parsnips", diff: 2, desc: "Slow (120d) but frost converts starch to sugar. Can overwinter in ground under mulch.", varieties: "Hollow Crown (standard), All American", notes: "Sow early spring for fall harvest. Leave in ground through frost for sweetest flavor." },
    { name: "Onions", diff: 2, desc: "Must use LONG-DAY varieties in the Northeast. Start seeds indoors January–February.", varieties: "Copra (8–10 month storage!), Patterson (excellent storage), Walla Walla (sweet, short storage), Ailsa Craig (exhibition size). Shallots: French Grey (fall-planted sets), Zebrune (from seed)", notes: "Storage onions are the real payoff — Copra/Patterson keep nearly a year. Shallots: plant sets in fall or start Zebrune from seed." },
    { name: "Garlic", diff: 1, desc: "HARDNECK types excel because CT winters provide essential cold vernalization. Plant mid-October.", varieties: "Music (porcelain, #1 Zone 6 pick), German Extra Hardy, Georgian Crystal, Chesnok Red (superb roasted), Spanish Roja", notes: "Fall-planted. Remove scapes in June for larger bulbs. Harvest when lower leaves brown." },
    { name: "Leeks", diff: 2, desc: "Slow but rewarding. Cold-hardy varieties stand through early winter.", varieties: "King Richard (summer), Bandit (very cold-hardy for fall/winter harvest)", notes: "Start indoors Feb. Hill soil around stems for longer white shanks." },
    { name: "Kohlrabi", diff: 1, desc: "Quick, cold-tolerant, underrated. Mild, crunchy, apple-like texture.", varieties: "Early White Vienna (55d), Kolibri (purple)", notes: "Harvest tennis-ball sized. Larger ones get woody. Very fast crop." },
    { name: "Asian Greens", diff: 1, desc: "Superb fall crops. Some of the most cold-tolerant greens available.", varieties: "Mei Qing baby bok choy (40–50d), Mizuna (mild, 35d), Tatsoi (survives 10–20°F), Napa cabbage (fall-sow ONLY — spring bolts)", notes: "Sow late July–Aug for fall. Tatsoi is remarkably cold-hardy." },
    { name: "Radicchio / Endive", diff: 2, desc: "Excellent fall crops that sweeten with frost.", varieties: "Radicchio di Chioggia, Sugarloaf endive, Batavian escarole", notes: "Sow July for fall harvest. Frost improves flavor significantly." },
    { name: "Mache / Corn Salad", diff: 1, desc: "One of the most cold-hardy salad greens. Survives well below freezing under row cover.", varieties: "Vit (standard), Large Seeded", notes: "Sow late Aug-Sept for fall/winter harvest. Excellent in cold frames. Nutty, mild flavor." },
    { name: "Claytonia", diff: 1, desc: "Miner's Lettuce. Exceptionally cold-hardy, tolerating frost into the low teens. Self-sows freely.", varieties: "Claytonia perfoliata (wild type)", notes: "Perfect for winter cold frames and unheated tunnels. Succulent, mild flavor. Thrives in cool weather." },
  ]},
  { category: "Perennial & Uncommon", icon: "🌿", color: "#2C3E50", bg: "#EBF5FB", items: [
    { name: "Asparagus", diff: 2, desc: "Plant once, harvest 15–20+ years. Full production from year 3. Worth the investment.", varieties: "Jersey Knight (disease-resistant, all-male, CT recommended), Millennium (emerges later, avoids frost), Purple Passion", notes: "All-male varieties (Jersey series) more productive — no energy spent on seeds." },
    { name: "Rhubarb", diff: 1, desc: "Extremely low maintenance perennial. Harvest stalks spring–early summer. Do NOT eat leaves (oxalic acid).", varieties: "Canada Red/Macdonald's (most common NE), Valentine, Victoria", notes: "Divide every 5–7 years. Remove flower stalks. Very cold-hardy." },
    { name: "Sunchokes", diff: 1, desc: "Native, extremely productive tuber. Grows 6–10 ft with sunflower-like blooms.", varieties: "Stampede (early, 100d), Clearwater", notes: "WARNING: Extremely invasive — use barriers or dedicated area. Cannot be eradicated once established." },
    { name: "Horseradish", diff: 1, desc: "Plant root cuttings spring, harvest after frost. Extremely vigorous.", varieties: "Maliner Kren (standard), Big Top Western", notes: "WARNING: Invasive. Use barriers or dedicated bed. One planting lasts forever." },
    { name: "Fiddlehead Ferns", diff: 1, desc: "Ostrich fern ONLY — edible coiled fronds April–May. Native. Plant in shade + moist soil.", varieties: "Matteuccia struthiopteris (Ostrich Fern — the only safe edible fiddlehead)", notes: "Harvest only 2–3 fronds per crown. Cook thoroughly before eating." },
    { name: "Sorrel", diff: 1, desc: "Carefree perennial with lemony flavor. Among the first greens in spring.", varieties: "French Sorrel (milder), Common/Garden Sorrel (more tangy)", notes: "Cut-and-come-again. Remove flower stalks to keep producing leaves." },
    { name: "Groundnuts", diff: 3, desc: "Native nitrogen-fixing vine producing protein-rich tubers. Historically important in CT.", varieties: "Apios americana (wild type and selected cultivars from specialty nurseries)", notes: "Takes 2–3 years for good tuber production. Edible flowers. Beautiful vine." },
    { name: "Artichokes (annual)", diff: 3, desc: "Grown as annual with cold vernalization trick. Impressive when it works.", varieties: "Imperial Star (bred for first-year production, 85–100d)", notes: "Vernalize seedlings at 45–50°F for 10+ days to trigger bud production." },
    { name: "Celeriac", diff: 2, desc: "Easier than celery with same flavor. Good storage root for winter soups and mash.", varieties: "Brilliant, Giant Prague", notes: "Start indoors very early (Feb). Long season but low maintenance once established." },
    { name: "Florence Fennel", diff: 2, desc: "Anise-flavored bulb. Fall crop ONLY — bolts in heat.", varieties: "Orion (bolt-resistant), Finale", notes: "Sow July for fall harvest. Direct sow (doesn't transplant well)." },
    { name: "Hops", diff: 2, desc: "Hardy perennial vine (Zones 3-8). Bines grow 15-25 ft/season. Full production from year 2-3.", varieties: "Cascade (most popular, citrusy), Chinook (piney, bittering), Centennial (floral, dual-purpose)", notes: "Need sturdy trellis. Cut bines to ground after harvest. Useful for homebrewing, teas, ornamental screen." },
  ]},
  { category: "Herbs", icon: "🌱", color: "#117A65", bg: "#E8F8F5", items: [
    { name: "Thyme", diff: 1, desc: "Hardy perennial returning yearly (Zones 5–9).", varieties: "English Thyme, Lemon Thyme, Creeping Thyme (ground cover)", notes: "Excellent drainage essential. Divide every 3–4 years." },
    { name: "Oregano", diff: 1, desc: "Extremely hardy perennial. Flavor intensifies when dried.", varieties: "Greek Oregano (best culinary flavor), Italian Oregano", notes: "Spreads readily. Greek type preferred for cooking vs. ornamental types." },
    { name: "Sage", diff: 1, desc: "Beautiful ornamental and culinary perennial (Zones 5–10). Semi-evergreen.", varieties: "Common/Garden Sage, Purple Sage, Tricolor Sage", notes: "Prune woody growth spring. Replace every 4–5 years as plants get leggy." },
    { name: "Chives", diff: 1, desc: "Among the very first to emerge spring (Zones 3–9). Edible purple flowers.", varieties: "Common Chives, Garlic Chives (flat leaves, garlic flavor)", notes: "Self-sows readily — deadhead to prevent spreading. Divide every 3 years." },
    { name: "Mint", diff: 1, desc: "Aggressively spreading perennial. ALWAYS grow in containers or isolated beds.", varieties: "Spearmint, Peppermint, Chocolate Mint, Mojito Mint", notes: "Will take over entire garden. Containers on patio safest approach." },
    { name: "French Tarragon", diff: 2, desc: "True French tarragon doesn't set seed — must be grown from divisions or cuttings.", varieties: "French Tarragon (NOT Russian — Russian has inferior flavor)", notes: "Zones 4–8. Verify 'French' by tasting — should tingle/numb tongue slightly." },
    { name: "Lovage", diff: 1, desc: "Towering celery-flavored perennial. One plant is enough — grows 6 ft tall.", varieties: "Common Lovage (Levisticum officinale)", notes: "Zones 4–8. Use leaves, stems, and seeds. Excellent celery substitute." },
    { name: "Basil", diff: 1, desc: "Annual. Killed instantly by frost. Start indoors or direct sow after May 15.", varieties: "Genovese (pesto standard), Thai Basil, Lemon Basil, Purple Basil", notes: "Pinch flowers to keep producing leaves. Downy mildew increasing concern in NE." },
    { name: "Cilantro", diff: 1, desc: "Bolts rapidly in heat. Best spring and fall. Let some go to seed for coriander.", varieties: "Calypso (slow-bolt, best for leaf production), Santo", notes: "Succession sow every 3 weeks spring and fall. Summer production is futile." },
    { name: "Dill", diff: 1, desc: "Essential for pickles. Self-sows freely. Attracts beneficial insects.", varieties: "Fernleaf (compact, slow bolt), Bouquet (tall, for seed heads/pickles)", notes: "Self-sows reliably. Fernleaf better for leaf harvest, Bouquet for seed heads." },
    { name: "Parsley", diff: 1, desc: "Biennial — overwinters with mulch, bolts year 2. Slow to germinate (2–3 weeks).", varieties: "Italian Flat-Leaf (best flavor), Curly Parsley (garnish)", notes: "Soak seeds overnight. Can overwinter under mulch for very early spring harvest." },
    { name: "Rosemary", diff: 4, desc: "NOT reliably hardy in Zone 6b. CT growers report it dying every single year outdoors.", varieties: "Arp (hardiest, rated Zone 6 with protection), Madeline Hill", notes: "Grow in containers brought indoors for winter. Or treat as annual. Arp in sheltered south-facing spot = possible." },
  ]},
];

const DIFF = { 1: { label: "Easy", color: "#27AE60", dots: "●○○○" }, 2: { label: "Moderate", color: "#F39C12", dots: "●●○○" }, 3: { label: "Challenging", color: "#E67E22", dots: "●●●○" }, 4: { label: "Gamble", color: "#C0392B", dots: "●●●●" } };

// Map items that share a wiki key to their unique fallback key
const UNIQUE_IMAGE_KEY = {
  "Nectarines": "Nectarine",
  "Raspberries (Fall-bearing)": "Raspberry_fall",
  "Strawberries (Day-neutral)": "Strawberry_dayneutral",
  "Grapes (Wine)": "Grape_wine",
};

function ItemCard({ item, images }) {
  const d = DIFF[item.diff];
  const wikiKey = WIKI_ITEMS[item.name];
  const uniqueKey = UNIQUE_IMAGE_KEY[item.name];
  const imgUrl = uniqueKey ? (FALLBACK_IMAGES[uniqueKey] || images[uniqueKey]) : (wikiKey ? images[wikiKey] : null);
  return (
    <div className="item-card" style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 10, padding: "10px 8px", borderBottom: "1px solid #e8e8e3", pageBreakInside: "avoid", breakInside: "avoid" }}>
      <div style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", background: "#f0ede8", flexShrink: 0, alignSelf: "start" }}>
        {imgUrl ? <img src={imgUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <div style={{ width: "100%", height: "100%", background: "#e8e4de", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#aaa", fontFamily: "'DM Sans', sans-serif", textAlign: "center", padding: 4, lineHeight: 1.2 }}>{item.name.split(/[\s/]/)[0]}</div>}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
          <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: 15, fontWeight: 700, color: "#2C3E2D", lineHeight: 1.2 }}>{item.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: d.color, whiteSpace: "nowrap" }}>{d.dots} {d.label}</span>
            <span style={{ fontSize: 14, color: "#ccc", letterSpacing: 2 }}>☐☐☐☐</span>
          </div>
        </div>
        <div style={{ fontSize: 10, color: "#666", lineHeight: 1.4, marginBottom: 3 }}>{item.desc}</div>
        <div style={{ fontSize: 10, lineHeight: 1.4, marginBottom: 2 }}>
          <span style={{ color: "#1E6B3A", fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.3 }}>Varieties: </span>{item.varieties}
        </div>
        <div style={{ fontSize: 9, color: "#999", fontStyle: "italic", lineHeight: 1.35 }}>{item.notes}</div>
      </div>
    </div>
  );
}

function RefSection({ title, children }) {
  return (
    <div className="ref-section" style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: 14, fontWeight: 700, color: "#2C3E2D", borderBottom: "2px solid #e8e8e3", paddingBottom: 4, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function RefItem({ text }) {
  return <div style={{ fontSize: 10, color: "#444", lineHeight: 1.5, paddingLeft: 14, position: "relative", marginBottom: 3 }}><span style={{ position: "absolute", left: 0, color: "#1E6B3A", fontWeight: 700 }}>•</span><span dangerouslySetInnerHTML={{ __html: text }} /></div>;
}

export default function GrowGuide() {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(0);
  const allWikiKeys = [...new Set(Object.values(WIKI_ITEMS))];
  const total = allWikiKeys.length;

  useEffect(() => {
    let m = true;
    (async () => {
      const r = {};
      for (let i = 0; i < allWikiKeys.length; i += 10) {
        const batch = allWikiKeys.slice(i, i + 10);
        await Promise.all(batch.map(async (k) => { try { const d = await (await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(k)}`)).json(); if (d.thumbnail?.source) r[k] = d.thumbnail.source.replace(/\/\d+px-/, "/200px-"); } catch {} }));
        if (m) setLoaded(Math.min(i + 10, allWikiKeys.length));
      }
      // Apply fallback images for missing/broken thumbnails
      for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
        if (!r[key]) r[key] = url;
      }
      if (m) { setImages(r); setLoading(false); }
    })();
    return () => { m = false; };
  }, []);

  const totalItems = DATA.reduce((s, c) => s + c.items.length, 0);
  const tbl = { fontSize: 10, borderCollapse: "collapse", width: "100%" };
  const th = { background: "#e8e8e3", textAlign: "left", padding: "5px 10px", fontWeight: 600, fontSize: 10 };
  const td = { padding: "4px 10px", borderBottom: "1px solid #eee", fontSize: 10 };

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: "#fafaf8", color: "#333", maxWidth: 850, margin: "0 auto", padding: "12px 16px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @media print {
          body { background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 0.4in 0.5in; size: letter; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; break-before: page; }
          .category-section { break-inside: avoid-page; }
          .category-header { break-after: avoid; }
          .item-card { break-inside: avoid; page-break-inside: avoid; }
          .ref-section { break-inside: avoid; page-break-inside: avoid; }
          table { break-inside: avoid; page-break-inside: avoid; }
          tr { break-inside: avoid; page-break-inside: avoid; }
          img { break-inside: avoid; }
          h1, h2, h3, h4 { break-after: avoid; page-break-after: avoid; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2C3E2D, #4A6741)", color: "#fff", padding: "18px 22px", borderRadius: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7, marginBottom: 4 }}>New Milford, CT · USDA Zone 6b</div>
        <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: 32, fontWeight: 700, fontStyle: "italic", lineHeight: 1.1 }}>What You Can Grow</div>
        <div style={{ fontSize: 10, opacity: 0.75, marginTop: 6 }}>
          {totalItems} varieties across {DATA.length} categories · ~150-day growing season · Last frost ≈ Apr 26 · First frost ≈ Oct 24
          {loading && <span className="no-print" style={{ marginLeft: 12, opacity: 0.6 }}>📷 Loading images ({loaded}/{total})...</span>}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", fontSize: 9, color: "#666", padding: "8px 12px", border: "1px solid #e8e8e3", borderRadius: 6, marginBottom: 12, background: "#fefefe" }}>
        <span><b>Difficulty:</b></span>
        {Object.entries(DIFF).map(([k, v]) => <span key={k} style={{ color: v.color }}>{v.dots} {v.label}</span>)}
        <span style={{ marginLeft: "auto" }}><b>Checkboxes:</b> ☐ Researched · ☐ Acquired · ☐ Planted · ☐ Harvested</span>
      </div>

      {/* Categories */}
      {DATA.map((cat) => (
        <div key={cat.category} className="category-section" style={{ marginBottom: 16 }}>
          <div className="category-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "6px 6px 0 0", background: cat.bg, color: cat.color, borderBottom: `3px solid ${cat.color}` }}>
            <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: 18, fontWeight: 700 }}>{cat.icon} {cat.category}</div>
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.8 }}>{cat.items.length} varieties</div>
          </div>
          {cat.items.map((item) => <ItemCard key={item.name} item={item} images={images} />)}
        </div>
      ))}

      {/* ═══════ QUICK REFERENCE ═══════ */}
      <div className="page-break" style={{ marginTop: 32 }}>
        <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: 24, fontWeight: 700, color: "#2C3E2D", marginBottom: 16 }}>Quick Reference</div>

        <RefSection title="Key Dates for New Milford, CT">
          <table style={tbl}>
            <thead><tr><th style={th}>Event</th><th style={th}>Date</th></tr></thead>
            <tbody>
              {[
                ["Last spring frost (average)", "April 26"],
                ["Safe transplant date (tender crops)", "May 10–15"],
                ["Latest recorded spring frost", "May 18 (2023)"],
                ["Start warm crops indoors", "Late March – Early April"],
                ["Direct sow cool crops outdoors", "Mid-April (when soil workable)"],
                ["Transplant tender crops outdoors", "After May 15"],
                ["Sow fall crops", "Late July – August"],
                ["First fall frost (average)", "October 24"],
                ["Conservative first frost (plan for)", "October 10–15"],
                ["Plant garlic", "Mid-October"],
                ["Frost-free growing season", "~150–160 days"],
                ["AHS Heat Zone", "4–5 (15–30 days above 86°F)"],
              ].map(([a, b], i) => <tr key={i} style={{ background: i % 2 ? "#fafaf8" : "#fff" }}><td style={td}>{a}</td><td style={td}>{b}</td></tr>)}
            </tbody>
          </table>
        </RefSection>

        <RefSection title="Soil & Site — New Milford Specifics">
          <RefItem text="CT soils typically <b>pH 4.8–5.5</b>. Most vegetables need pH 6.0–6.8 — liming required." />
          <RefItem text="<b>Exception:</b> blueberries, potatoes, rhododendrons PREFER CT's natural acidity — no amendment needed." />
          <RefItem text="New Milford's <b>marble/limestone bedrock</b> may naturally buffer soil toward neutral in some locations — a significant advantage worth confirming with a soil test." />
          <RefItem text="<b>UConn Soil Lab:</b> $12 test at soiltesting.cahnr.uconn.edu. Test every 3–5 years." />
          <RefItem text="<b>Raised beds</b> with quality topsoil-compost mix bypass rocky glacial till entirely — strongly recommended by UConn Extension." />
          <RefItem text="Apply <b>dolomitic limestone</b> in fall (5–7 lbs per 100 sq ft max). Supplies calcium and magnesium." />
          <RefItem text="<b>Housatonic River valley</b> provides fertile alluvial soils and slight thermal moderation. Valley bottoms can be frost pockets where cold air pools; south-facing slopes a few feet above are warmer." />
          <RefItem text="Annual precipitation ~<b>49 inches</b>, well-distributed — ample for most crops but humid enough to fuel fungal diseases." />
        </RefSection>

        <RefSection title="Top Challenges & Solutions">
          <RefItem text="<b>Deer (#1 threat):</b> 8-ft fence is the only reliable solution. Repellents require constant rotation and reapplication. Solid 6-ft stockade fences work because deer won't jump what they can't see through." />
          <RefItem text="<b>Japanese beetles (peak Jun–Aug):</b> Hand-pick into soapy water ~7 PM (most effective). Use beneficial nematodes, NOT milky spore (doesn't work in NE cool soils). Avoid pheromone traps near garden — they attract more beetles." />
          <RefItem text="<b>Spotted lanternfly:</b> Now established in Litchfield County with CAES quarantine orders. Kill on sight. Scrape egg masses (Sept–May). Remove tree-of-heaven (preferred host). Feeds on grapes, hops, fruit trees." />
          <RefItem text="<b>Squash vine borers:</b> Row covers from planting until flowering. Late planting (July) dodges June egg-laying. <b>Butternut squash</b> (C. moschata) and <b>Tromboncino</b> are naturally resistant/immune." />
          <RefItem text="<b>Late blight (tomatoes/potatoes):</b> Can destroy plants within a week. Choose resistant varieties (Mountain Merit, Kennebec). Monitor USAblight.org for regional outbreaks." />
          <RefItem text="<b>Apple scab:</b> Controlled most effectively by planting resistant varieties (Liberty, Enterprise, GoldRush). CT's humidity makes it nearly inevitable on susceptible varieties." />
          <RefItem text="<b>Late spring frosts (as late as May 18):</b> Keep row covers and old blankets ready. Choose late-blooming fruit cultivars (Contender peach, Duke blueberry, Goldcot apricot). Plant stone fruit on north-facing slopes." />
          <RefItem text="<b>Cucumber beetles:</b> Transmit bacterial wilt, devastating to cucumbers and muskmelons. Row covers until flowering are the primary defense." />
        </RefSection>

        <RefSection title="Season Extension">
          <RefItem text="<b>Floating row covers</b> add 2–5°F protection. Essential for early transplants and late fall harvests." />
          <RefItem text="<b>Low tunnels/cold frames</b> enable harvest of hardy greens (kale, spinach, tatsoi) into December or even through winter." />
          <RefItem text="<b>High tunnels</b> can create a 200+ day effective season. USDA NRCS EQIP program provides financial assistance." />
          <RefItem text="<b>Black plastic mulch</b> warms soil 5–10°F earlier — mandatory for melons, sweet potatoes, eggplant, peppers in CT." />
          <RefItem text="<b>Water-filled cloches</b> (Wall O' Water) protect individual transplants from frosts 2–3 weeks before safe date." />
        </RefSection>

        <RefSection title="Essential CT Resources">
          <RefItem text="<b>UConn Home & Garden Education Center:</b> homegarden.cahnr.uconn.edu — staffed horticulturists, diagnostic services, fact sheets. Phone: 877-486-6271" />
          <RefItem text="<b>UConn Soil Nutrient Analysis Lab:</b> soiltesting.cahnr.uconn.edu — standard test $12" />
          <RefItem text="<b>CT Agricultural Experiment Station:</b> portal.ct.gov/caes — disease diagnostics, spray guides, pest fact sheets" />
          <RefItem text="<b>New England Vegetable Management Guide:</b> nevegetable.org — premier crop-by-crop reference for the region" />
          <RefItem text="<b>Seed companies (NE-focused):</b> Fedco Seeds (fedcoseeds.com), Johnny's Selected Seeds (johnnyseeds.com) — specialize in short-season, cold-hardy varieties" />
          <RefItem text="<b>Berry plants:</b> Nourse Farms — first choice for strawberries, raspberries, blackberries, currants" />
          <RefItem text="<b>CT nurseries:</b> Cricket Hill Garden (Thomaston, CT) — unusual plants including medlar, che fruit, tree peonies" />
        </RefSection>

        <RefSection title="CT Grower Tips (from Reddit, Permies, OurFigs forums)">
          <RefItem text="A Litchfield County orchardist with 41 fruit trees: <b>Asian pears performed spectacularly</b> while European pears refused to produce and sweet cherries failed due to humidity." />
          <RefItem text="<b>Apricots were a near-total loss</b> — multiple growers confirm this across western CT. Don't plant unless you enjoy the gamble." />
          <RefItem text="One CT family has grown <b>in-ground fig trees for 90+ years</b> using winter wrapping — another harvests ~1,300 figs/year from 3 trees." />
          <RefItem text="Universally cited: <b>'Between the deer and the Japanese beetles, I don't know who's worse.'</b> Invest in fencing BEFORE planting." />
          <RefItem text="A Thomaston food forest grower reports success with apples, Illinois Everbearing mulberry, medlar, cornelian cherry, garlic, and Asian pears on sandy-loam soil." />
          <RefItem text="<b>Sungold cherry tomato</b> is the single most recommended variety across all CT gardening forums." />
        </RefSection>
      </div>

      {/* ═══════ NOTES PAGE ═══════ */}
      <div className="page-break" style={{ marginTop: 32 }}>
        <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: 24, fontWeight: 700, color: "#2C3E2D", marginBottom: 6 }}>Notes & Planning</div>
        <div style={{ fontSize: 10, color: "#666", marginBottom: 16 }}>Use this page for planting dates, soil test results, seed orders, layout sketches, and observations.</div>
        {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ borderBottom: "1px solid #e8e8e3", height: 26 }} />)}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: 8, color: "#bbb", padding: "12px 0", borderTop: "1px solid #e8e8e3", marginTop: 16 }}>
        New Milford, CT Grow Guide · Zone 6b · Sources: UConn Extension, CT Agricultural Experiment Station, NE Vegetable Management Guide, Reddit/Permies/OurFigs community reports
      </div>
    </div>
  );
}