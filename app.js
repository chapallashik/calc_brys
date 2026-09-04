// Unified Custom Constructor & Standard Sheets Calculator

(function () {
    // 0. Внешние данные (материалы), редактируемые через админ-панель и публикуемые в materials.json
    let MATERIALS = { interior: [], floor: [], exterior: null, additions: [] };

    // Резервные данные на случай, если materials.json не загрузился (например, открыли файл локально без сервера)
    const MATERIALS_FALLBACK = {
        interior: [
            { id: "int_hh_vagonka", name: "Вагонка 'ВС' (базовая, включена)", categories: ["house_high"], price: 0 },
            { id: "int_hh_imitatsia", name: "Имитация бруса", categories: ["house_high"], price: 500 },
            { id: "int_hl_osb", name: "ОСБ 9 мм (базовая, включена)", categories: ["house_low"], price: 0 },
            { id: "int_hl_vagonka", name: "Вагонка 'ВС' (базовая, включена)", categories: ["house_low"], price: 0 },
            { id: "int_hl_imitatsia", name: "Имитация бруса 'В'", categories: ["house_low"], price: 500 },
            { id: "int_cabin_osb", name: "ОСБ 9 мм (базовая, включена)", categories: ["cabin"], price: 0 },
            { id: "int_cabin_vagonka", name: "Вагонка 'ВС'", categories: ["cabin"], price: 500 },
            { id: "int_cabin_imitatsia", name: "Имитация бруса 'В'", categories: ["cabin"], price: 500 },
            { id: "int_hz_none", name: "Без отделки (базовая, включена)", categories: ["hozblok"], price: 0 },
            { id: "int_hz_osb", name: "ОСБ 9 мм", categories: ["hozblok"], price: 300 },
            { id: "int_hz_vagonka", name: "Вагонка класса В", categories: ["hozblok"], price: 400 },
            { id: "int_hz_mdf", name: "МДФ панели", categories: ["hozblok"], price: 500 },
            { id: "int_hz_pvc", name: "ПВХ панели", categories: ["hozblok"], price: 500 },
            { id: "int_chalet_vagonka", name: "Вагонка 'ВС' (базовая, включена)", categories: ["chalet"], price: 0 }
        ],
        floor: [
            { id: "floor_house_base", name: "Обрезная доска 25мм 1 сорт (базовая)", categories: ["house_high", "house_low", "chalet"], price: 0 },
            { id: "floor_cabin_base", name: "Обрезная доска 25мм (базовая)", categories: ["cabin", "hozblok"], price: 0 },
            { id: "floor_cabin_osb12", name: "ОСБ 12мм", categories: ["cabin", "hozblok"], price: 500 },
            { id: "floor_cabin_tongue28", name: "Шпунтованная доска 28мм", categories: ["cabin", "hozblok"], price: 1000 }
        ],
        exterior: {
            houseHigh: [
                { id: "ext_hh_vagonka", name: "Вагонка ВС", priceNoIns: 9500, priceWithIns: 12500 },
                { id: "ext_hh_imitatsia", name: "Имитация бруса 'В'", priceNoIns: 10000, priceWithIns: 13000 }
            ],
            houseLow: {
                noInsRate: 8000,
                cheapBaseRate: 9500,
                materials: [
                    { id: "ext_hl_vagonka", name: "Вагонка ВС", mode: "base", price: 10000 },
                    { id: "ext_hl_imitatsia", name: "Имитация бруса", mode: "base", price: 10000, addonOnTop: 500 },
                    { id: "ext_hl_blockhouse", name: "Блок-хаус", mode: "addon", price: 1000 },
                    { id: "ext_hl_proflist", name: "Профлист цветной", mode: "addon", price: 400 },
                    { id: "ext_hl_osb", name: "ОСБ 12мм", mode: "addon", price: 300 }
                ]
            },
            simple: [
                { id: "ext_simple_vagonka", name: "Вагонка класса В", categories: ["cabin", "hozblok"], price: 0 },
                { id: "ext_simple_imitatsia_cabin", name: "Имитация бруса", categories: ["cabin"], price: 500 },
                { id: "ext_simple_imitatsia_hozblok", name: "Имитация бруса", categories: ["hozblok"], price: 250 },
                { id: "ext_simple_blockhouse", name: "Блок-хаус", categories: ["cabin", "hozblok"], price: 1000 },
                { id: "ext_simple_proflist", name: "Профлист цветной", categories: ["cabin", "hozblok"], price: 400 },
                { id: "ext_simple_osb", name: "ОСБ 12мм", categories: ["cabin", "hozblok"], price: 300 },
                { id: "ext_chalet_vagonka", name: "Вагонка ВС", categories: ["chalet"], price: 14500 },
                { id: "ext_chalet_imitatsia", name: "Имитация бруса В", categories: ["chalet"], price: 15000 }
            ]
        },
        additions: [
            { id: "win_lux_50_50_p", name: "Окно ПВХ 1-камерный 50х50 поворотное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 5500, hint: "none" },
            { id: "win_lux_50_50_po2", name: "Окно ПВХ 50х50 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 9000, hint: "none" },
            { id: "win_lux_60_90_po", name: "Окно ПВХ 1-камерный 60х90 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 7500, hint: "none" },
            { id: "win_lux_60_120_po", name: "Окно ПВХ 1-камерный 60х120 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 10000, hint: "none" },
            { id: "win_lux_60_180_po", name: "Окно ПВХ 1-камерный 60х180 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 12000, hint: "none" },
            { id: "win_lux_100_100_po", name: "Окно ПВХ 1-камерный 100х100 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 9000, hint: "none" },
            { id: "win_lux_100_120_po1", name: "Окно ПВХ 1-камерный 100х120 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 11000, hint: "none" },
            { id: "win_lux_100_120_po2", name: "Окно ПВХ 100х120 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 14000, hint: "none" },
            { id: "win_lux_120_120_po", name: "Окно ПВХ 1-камерный 120х120 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 13000, hint: "none" },
            { id: "win_lux_100_140_po", name: "Окно ПВХ 1-камерный 100х140 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 14000, hint: "none" },
            { id: "win_lux_100_150_po", name: "Окно ПВХ 1-камерный 100х150 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 15000, hint: "none" },
            { id: "win_lux_120_150_po", name: "Окно ПВХ 1-камерный 120х150 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 16500, hint: "none" },
            { id: "win_lux_140_150_po", name: "Окно ПВХ 1-камерный 140х150 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 17000, hint: "none" },
            { id: "win_lux_150_150_po", name: "Окно ПВХ 1-камерный 150х150 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 17500, hint: "none" },
            { id: "win_lux_150_100_po", name: "Окно ПВХ 1-камерный 150х100 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 18000, hint: "none" },
            { id: "win_lux_150_190_po", name: "Окно ПВХ 1-камерный 150х190 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 25000, hint: "none" },
            { id: "win_lux_180_190_po", name: "Окно ПВХ 1-камерный 180х190 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 26000, hint: "none" },
            { id: "win_lux_180_200_po", name: "Окно ПВХ 1-камерный 180х200 поворотно-откидное", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "windows", unit: "quantity", price: 30000, hint: "none" },
            { id: "win_lux_60_90_po2", name: "Окно ПВХ 60х90 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 10500, hint: "none" },
            { id: "win_lux_60_120_po2", name: "Окно ПВХ 60х120 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 13000, hint: "none" },
            { id: "win_lux_60_180_po2", name: "Окно ПВХ 60х180 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 15000, hint: "none" },
            { id: "win_lux_100_100_po2", name: "Окно ПВХ 100х100 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 12000, hint: "none" },
            { id: "win_lux_120_120_po2", name: "Окно ПВХ 120х120 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 16000, hint: "none" },
            { id: "win_lux_100_140_po2", name: "Окно ПВХ 100х140 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 17000, hint: "none" },
            { id: "win_lux_100_150_po2", name: "Окно ПВХ 100х150 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 18000, hint: "none" },
            { id: "win_lux_120_150_po2", name: "Окно ПВХ 120х150 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 19500, hint: "none" },
            { id: "win_lux_140_150_po2", name: "Окно ПВХ 140х150 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 20000, hint: "none" },
            { id: "win_lux_150_150_po2", name: "Окно ПВХ 150х150 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 20500, hint: "none" },
            { id: "win_lux_150_100_po2", name: "Окно ПВХ 150х100 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 21000, hint: "none" },
            { id: "win_lux_150_190_po2", name: "Окно ПВХ 150х190 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 28000, hint: "none" },
            { id: "win_lux_180_190_po2", name: "Окно ПВХ 180х190 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 29000, hint: "none" },
            { id: "win_lux_180_200_po2", name: "Окно ПВХ 180х200 (2 камеры) поворотно-откидное", categories: ["house_high", "house_low"], group: "windows", unit: "quantity", price: 33000, hint: "none" },
            { id: "pile_76_1500", name: "Свая винтовая 76/1500", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "piles", unit: "quantity", price: 3550, hint: "none" },
            { id: "pile_76_2000", name: "Свая винтовая 76/2000", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "piles", unit: "quantity", price: 3700, hint: "none" },
            { id: "pile_76_2500", name: "Свая винтовая 76/2500", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "piles", unit: "quantity", price: 4000, hint: "none" },
            { id: "pile_76_3000", name: "Свая винтовая 76/3000", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "piles", unit: "quantity", price: 4300, hint: "none" },
            { id: "pile_89_2000", name: "Свая винтовая 89/2000", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "piles", unit: "quantity", price: 3900, hint: "none" },
            { id: "pile_89_2500", name: "Свая винтовая 89/2500", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "piles", unit: "quantity", price: 4200, hint: "none" },
            { id: "pile_89_3000", name: "Свая винтовая 89/3000", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "piles", unit: "quantity", price: 4600, hint: "none" },
            { id: "pile_108_2000", name: "Свая винтовая 108/2000", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "piles", unit: "quantity", price: 4700, hint: "none" },
            { id: "pile_108_2500", name: "Свая винтовая 108/2500", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "piles", unit: "quantity", price: 5100, hint: "none" },
            { id: "pile_108_3000", name: "Свая винтовая 108/3000", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "piles", unit: "quantity", price: 5600, hint: "none" },
            { id: "freestanding_porch", name: "Отдельностоящее крыльцо (за м²)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "other", unit: "quantity", price: 7500, hint: "none" },
            { id: "partition_imitation_b", name: "Перегородка Имитация бруса \"В\" (за м.п.)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "other", unit: "quantity", price: 4000, hint: "none" },
            { id: "partition_lining_bc_ins", name: "Перегородка Вагонка \"ВС\" с утеплителем (за м.п.)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "area", unit: "quantity", price: 4000, hint: "none" },
            { id: "partition_lining_bc", name: "Перегородка Вагонка \"ВС\" (за м.п.)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "area", unit: "quantity", price: 3500, hint: "none" },
            { id: "block_pads", name: "Подушки под блоки (за шт)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "other", unit: "quantity", price: 1200, hint: "none" },
            { id: "veranda_ceiling_board", name: "Зашить потолок веранды (за м²)", categories: ["cabin", "hozblok"], group: "other", unit: "quantity", price: 1000, hint: "none" },
            { id: "door_metal_12", name: "Дверь металлическая (Россия)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "doors", unit: "quantity", price: 12000, hint: "none" },
            { id: "door_metal_7cm", name: "Дверь металлическая 7 см", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "doors", unit: "quantity", price: 20000, hint: "none" },
            { id: "door_panel_6", name: "Дверь филенчатая деревянная", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "doors", unit: "quantity", price: 6000, hint: "none" },
            { id: "door_pvc_35", name: "Дверь входная ПВХ", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "doors", unit: "quantity", price: 35000, hint: "none" },
            { id: "door_wood_double", name: "Дверь деревянная распашная 1.4х1.9 м", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "doors", unit: "quantity", price: 3000, hint: "none" },
            { id: "floor_hatch", name: "Люк в полу", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "doors", unit: "quantity", price: 10000, hint: "none" },
            { id: "antiseptic_bottom", name: "Антисептик дна", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "area", unit: "area", price: 500, hint: "houseAndVeranda" },
            { id: "rodent_mesh", name: "Сетка от грызунов", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "area", unit: "area", price: 600, hint: "houseAndVeranda" },
            { id: "block_20_20_40", name: "Блок 20х20х40", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "other", unit: "quantity", price: 500, hint: "none" },
            { id: "ramp_2m", name: "Пандус (до 2 м)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "other", unit: "quantity", price: 5000, hint: "none" },
            { id: "floor_tongue_28_add", name: "Пол: Шпунтованная доска 28 мм (за м²)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "area", unit: "area", price: 1000, hint: "houseAndVeranda" },
            { id: "floor_osb_12_add", name: "Пол: ОСБ 12 мм (за м²)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "area", unit: "area", price: 500, hint: "houseArea" },
            { id: "floor_osb_15_add", name: "Пол: ОСБ 15 мм (за м²)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "area", unit: "area", price: 700, hint: "houseArea" },
            { id: "floor_osb_18_add", name: "Пол: ОСБ 18 мм (за м²)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "area", unit: "area", price: 800, hint: "houseArea" },
            { id: "floor_tongue_35_add", name: "Пол: Шпунтованная доска 35 мм (за м²)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "area", unit: "area", price: 1300, hint: "houseAndVeranda" },
            { id: "floor_board_35_150_add", name: "Пол: Доска обрезная 35х150 мм (за м²)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "area", unit: "area", price: 500, hint: "houseAndVeranda" },
            { id: "ins_basalt_ceiling_200", name: "Утепление: 200 мм базальтовая плита потолка (за м²)", categories: ["house_high", "house_low", "cabin"], group: "area", unit: "area", price: 1000, hint: "houseAndVeranda" },
            { id: "ins_basalt_floor_200", name: "Утепление: 200 мм базальтовая плита пола (за м²)", categories: ["house_high", "house_low", "cabin"], group: "area", unit: "area", price: 1000, hint: "houseAndVeranda" },
            { id: "roof_double_pitch_1800", name: "Крыша двухскатная с коньком 40-70 см", categories: ["cabin", "hozblok"], group: "area", unit: "area", price: 1800, hint: "houseArea" },
            { id: "roof_double_pitch_flat", name: "Двухскатная крыша (увеличение стоимости)", categories: ["cabin"], group: "other", unit: "quantity", price: 10000, hint: "none" },
            { id: "ceiling_osb_12_lath", name: "Настил на потолок ОСБ 12 мм с обрешеткой", categories: ["house_high"], group: "area", unit: "area", price: 1800, hint: "houseAndVeranda" },
            { id: "vent_gap", name: "Вентзазор", categories: ["house_high", "house_low"], group: "area", unit: "area", price: 2000, hint: "perimeter" },
            { id: "ridge_raise", name: "Поднятие конька (за каждые +10 см, максимум +150 см)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "other", unit: "quantity", price: 3750, hint: "none" },
            { id: "veranda_lined_rafters", name: "Потолок веранды подшитый по стропилам", categories: ["house_high"], group: "area", unit: "area", price: 2000, hint: "verandaOnly" },
            { id: "generator_daily", name: "Генератор (сутки)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "other", unit: "quantity", price: 2500, hint: "none" },
            { id: "material_carry", name: "Пронос материала свыше 20 м (за каждые 10 м)", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "other", unit: "quantity", price: 10000, hint: "none" },
            { id: "long_ladder", name: "Лестница на всю длину дома", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "other", unit: "quantity", price: 20000, hint: "none" },
            { id: "step_with_railing", name: "Ступень с перилами", categories: ["house_high", "house_low", "cabin", "hozblok"], group: "other", unit: "quantity", price: 20000, hint: "none" },
            { id: "extension_room", name: "Пристройка", categories: ["house_high", "house_low"], group: "other", unit: "quantity", price: 20000, hint: "none" }
        ]
    };

    async function loadMaterials() {
        try {
            const res = await fetch('./materials.json', { cache: 'no-store' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            if (!data || !Array.isArray(data.interior) || !Array.isArray(data.floor) || !data.exterior || !Array.isArray(data.additions)) throw new Error('bad shape');
            MATERIALS = data;
        } catch (e) {
            console.warn('materials.json не загрузился, использую встроенные данные по умолчанию:', e);
            MATERIALS = JSON.parse(JSON.stringify(MATERIALS_FALLBACK));
        }
        // Черновик из админки (если есть) имеет приоритет — чтобы правки не терялись между визитами админа,
        // пока их не скачали и не залили на GitHub.
        try {
            const draft = localStorage.getItem('mobistroy_materials_draft');
            if (draft) {
                const parsed = JSON.parse(draft);
                if (parsed && Array.isArray(parsed.interior) && Array.isArray(parsed.floor) && parsed.exterior && Array.isArray(parsed.additions)) {
                    MATERIALS = parsed;
                }
            }
        } catch (e) { /* ignore corrupt draft */ }
    }

    function saveMaterialsDraft() {
        localStorage.setItem('mobistroy_materials_draft', JSON.stringify(MATERIALS));
    }

    function getInteriorOptions(category) {
        return MATERIALS.interior.filter(r => r.categories.includes(category));
    }

    function getInteriorRecord(id) {
        return MATERIALS.interior.find(r => r.id === id);
    }

    function getFloorOptions(category) {
        return MATERIALS.floor.filter(r => r.categories.includes(category));
    }

    function getFloorRecord(id) {
        return MATERIALS.floor.find(r => r.id === id);
    }

    function getExteriorHouseHighRecord(id) {
        return MATERIALS.exterior.houseHigh.find(r => r.id === id);
    }

    function getExteriorHouseLowRecord(id) {
        return MATERIALS.exterior.houseLow.materials.find(r => r.id === id);
    }

    function getExteriorSimpleOptions(category) {
        return MATERIALS.exterior.simple.filter(r => r.categories.includes(category));
    }

    function getExteriorSimpleRecord(id) {
        return MATERIALS.exterior.simple.find(r => r.id === id);
    }

    // Превращаем JSON-запись доп.опции в формат, который понимает остальной код (как SHARED_ADDITIONS)
    function materialsAdditionToAddition(r) {
        const hasPerCategoryPrice = r.pricesByCategory && Object.keys(r.pricesByCategory).length > 0;
        const label = (!hasPerCategoryPrice && r.price > 0)
            ? `${r.name} (${r.unit === 'area' ? '+' : ''}${r.price.toLocaleString('ru-RU')} р${r.unit === 'area' ? '/м²' : ''})`
            : r.name; // при разной цене по категориям число показываем прямо в строке допов, не в названии
        return {
            id: r.id, name: label, price: r.price, type: r.unit, quantity: 0,
            categories: r.categories, group: r.group, hint: r.hint, fromMaterials: true,
            pricesByCategory: r.pricesByCategory || null
        };
    }

    // Если у записи задана разная цена по категориям — берём цену под текущий выбор,
    // иначе — обычную единую цену записи.
    function getMaterialsAdditionPrice(add) {
        if (add.pricesByCategory && state.calculatorMode === 'custom' &&
            add.pricesByCategory[state.customType] != null) {
            return add.pricesByCategory[state.customType];
        }
        return add.price || 0;
    }

    // Добавляет/обновляет доп.опции из MATERIALS.additions во все модели активного конфига
    function applyAdditionsMaterials() {
        activeConfig.forEach(model => {
            model.additions = model.additions.filter(a => !a.fromMaterials);
            model.additions.push(...MATERIALS.additions.map(materialsAdditionToAddition));
        });
    }

    // 1. Data & State Initialization
    const SHARED_ADDITIONS = [
        { id: "frame_upgrade", name: "Замена каркаса 50/100 на 50/150", price: 2000, type: "area", quantity: 0 },
        { id: "wall_height_raise_20", name: "Поднятие высоты стен на 20 см", price: 700, type: "area", quantity: 0 },
        { id: "veranda_high", name: "Веранда (высокая крыша, 9 500 р/м²)", price: 9500, type: "area", quantity: 0 },
        { id: "veranda_chalet", name: "Веранда (Шале, 12 500 р/м²)", price: 12500, type: "area", quantity: 0 },
        { id: "veranda_low", name: "Веранда (низкая крыша, 8 000 р/м²)", price: 8000, type: "area", quantity: 0 },
        { id: "veranda_cabin", name: "Веранда (7 500 р/м²)", price: 7500, type: "area", quantity: 0 },
        { id: "pile_delivery", name: "Доставка свай (70 р/км)", price: 70, type: "quantity", quantity: 0 },
        { id: "profile_harness", name: "Обвязка свай профилем 20х40 одной линией (периметр * 450 р)", price: 450, type: "area", quantity: 0 },
        { id: "roof_proflist_low", name: "Кровля: Профлист С8 цветной низкая крыша (+500 р/м²)", price: 500, type: "area", quantity: 0 },
        { id: "roof_proflist_high", name: "Кровля: Профлист С8 цветной (выбор) или ондулин высокая крыша (+750 р/м²)", price: 750, type: "area", quantity: 0 },
        { id: "roof_metal", name: "Кровля: Металлочерепица (+1500 р/м²)", price: 1500, type: "area", quantity: 0 },
        { id: "roof_end_door", name: "Дверца в торце крыши", price: 5000, type: "quantity", quantity: 0 },
        { id: "roof_overhangs", name: "Свесы на кровле (15 см включены, база; далее — за каждые +10 см)", price: 1000, type: "quantity", quantity: 0 },
    ];

    let activeConfig = [];
    let customRates = {
        rate_house_high: 12500,
        rate_house_low_osb: 9500,
        rate_house_low_lining: 10000,
        rate_cabin: 9000,
        rate_cabin_no_ins: 7500,
        rate_int_cabin_lining: 120,
        rate_int_cabin_imitation: 370,
        rate_ins_100_min_wool: 0,
        rate_hozblok: 7500,
        rate_veranda: 9000,
        rate_ext_imitation: 250,
        rate_ext_blockhouse: 1000,
        rate_ext_proflist: 400,
        rate_ext_osb: 300,
        rate_int_osb: 300,
        rate_int_lining: 400,
        rate_int_mdf: 500,
        rate_int_pvc: 500,
        rate_ins_100: 450,
        rate_ins_150: 3700,
        rate_ins_200: 5600,
        rate_ins_mix: 450,
        premium_frame_150_hk: 2500,
        premium_frame_200_hk: 4000,
        premium_frame_100_kd: 2000,
        premium_frame_150_kd: 4500,
        premium_frame_200_kd: 6000,
        rate_kd_150_real: 5700,
        rate_kd_200_real: 7600,
        price_frame_upgrade_normal: 2000,
        price_frame_upgrade_no_ins: 2500,
        price_wall_raise_100: 700,
        price_wall_raise_150: 1000,
        price_wall_raise_200: 1400,
        rate_svesy: 1000,
        rate_ins_200_ceiling: 1000,
        rate_ins_200_floor: 1000,
        rate_floor_osb12: 500,
        rate_floor_osb15: 700,
        rate_floor_osb18: 800,
        rate_floor_tongue28: 1000,
        rate_floor_tongue35: 1300,
        rate_floor_tongue36: 1250,
        rate_assembly: 1000,
        delivery_base_dist: 0,
        delivery_base_price: 7000,
        delivery_price_km: 200
    };
    
    function loadConfig() {
        const localData = localStorage.getItem('mobistroy_config');
        if (localData) {
            try {
                activeConfig = JSON.parse(localData);
            } catch (e) {
                activeConfig = JSON.parse(JSON.stringify(window.DEFAULT_CONFIG));
            }
        } else {
            activeConfig = JSON.parse(JSON.stringify(window.DEFAULT_CONFIG));
        }

        const localRates = localStorage.getItem('mobistroy_custom_rates');
        if (localRates) {
            try {
                customRates = { ...customRates, ...JSON.parse(localRates) };
            } catch (e) {}
        }

        // Apply block-container filtering and additions merging dynamically
        activeConfig = activeConfig.filter(model => !model.name.toLowerCase().includes("блок-контейнер"));
        
        activeConfig.forEach(model => {
            // Remove old additions that we are replacing/standardizing
            let cleanedAdditions = model.additions.filter(add => {
                const nameLower = add.name.toLowerCase();
                if (nameLower.includes('окно') || nameLower.includes('пвх')) return false;
                if (nameLower.includes('сва') || nameLower.includes('сваи')) return false;
                if (nameLower.includes('металлочерепица')) return false;
                if (nameLower.includes('профлист')) return false;
                if (nameLower.includes('вентзазор')) return false;
                if (nameLower.includes('свесы')) return false;
                if (nameLower.includes('генератор')) return false;
                if (nameLower.includes('перенос материала') || nameLower.includes('пронос материала')) return false;
                if (nameLower.includes('лестница')) return false;
                if (nameLower.includes('имитация бс') && nameLower.includes('+400')) return false;
                if (nameLower.includes('имитация аб') && nameLower.includes('+650')) return false;
                if (nameLower.includes('перегород') && (nameLower.includes('р/мп') || nameLower.includes('р/мп.') || nameLower.includes('р/м.п.'))) return false;
                
                // Deduplicate by shared additions ID
                if (SHARED_ADDITIONS.some(shared => shared.id === add.id)) return false;
                
                return true;
            });
            // Prepend new shared additions
            model.additions = [...SHARED_ADDITIONS, ...cleanedAdditions];
            
            // Update PVC doors price
            model.additions.forEach(add => {
                const nameLower = add.name.toLowerCase();
                if (nameLower.includes('дверь') && nameLower.includes('пвх')) {
                    add.price = 35000;
                    add.name = "Дверь входная ПВХ (35 000 р)";
                }
            });

            // Update delivery rate dynamically
            if (model.delivery) {
                model.delivery.baseDistance = 0;
                if (model.name.toLowerCase().includes('хозблок')) {
                    model.delivery.basePrice = 5000;
                    model.delivery.minPrice = 5000;
                    model.delivery.notes = `Доставка: до 6х3 по 100 р/км, свыше по 200 р/км, мин. 5000 р.`;
                } else {
                    model.delivery.basePrice = 7000;
                    model.delivery.minPrice = 7000;
                    model.delivery.notes = `Доставка: до 6х3 по 100 р/км, свыше по 200 р/км, мин. 7000 р.`;
                }
                model.delivery.pricePerKm = 200;
            }
        });
    }
    
    loadConfig();

    // Global Calculator State
    const state = {
        calculatorMode: 'custom', // 'custom' or 'standard'
        
        // Custom Mode params
        customType: 'house_high',
        customLength: 6,
        customWidth: 3,
        customHeight: 2.4,
        selCustomExterior: 'none',
        selCustomInterior: 'none',
        selCustomFloor: 'none',
        selCustomInsulation: '100_base_min',
        chkCustomAssembly: false,
        
        // Standard Mode params
        activeModelIdx: 0,
        selectedSizeId: '',
        selectedFinishIdx: 0,
        isAssemblyChecked: false,
        selectedFloorOptionIds: [],
        selectedInsulationIds: [],
        houseTypeRate: 12500,
        houseTypeHeight: 3.5,
        
        // Shared params
        additionQuantities: {}, // id -> quantity
        deliveryDistance: 0,
        isVatChecked: false,
        isDiscountChecked: false
    };

    // DOM Elements References
    const btnModeCustom = document.getElementById('btnModeCustom');
    const btnModeStandard = document.getElementById('btnModeStandard');
    const productTabs = document.getElementById('productTabs');
    const customConstructorArea = document.getElementById('customConstructorArea');
    const standardProjectsArea = document.getElementById('standardProjectsArea');
    
    // Custom Constructor DOM
    const customTypeSelector = document.getElementById('customTypeSelector');
    const customLengthSlider = document.getElementById('customLengthSlider');
    const lblCustomLength = document.getElementById('lblCustomLength');
    const customWidthSlider = document.getElementById('customWidthSlider');
    const lblCustomWidth = document.getElementById('lblCustomWidth');
    const customHeightSlider = document.getElementById('customHeightSlider');
    const lblCustomHeight = document.getElementById('lblCustomHeight');

    // --- Веранда (отдельный раздел) ---
    const chkVerandaEnabled = document.getElementById('chkVerandaEnabled');
    const verandaParamsWrap = document.getElementById('verandaParamsWrap');
    const verandaLengthSlider = document.getElementById('verandaLengthSlider');
    const lblVerandaLength = document.getElementById('lblVerandaLength');
    const verandaWidthSlider = document.getElementById('verandaWidthSlider');
    const lblVerandaWidth = document.getElementById('lblVerandaWidth');
    const verandaHeightSlider = document.getElementById('verandaHeightSlider');
    const lblVerandaHeight = document.getElementById('lblVerandaHeight');
    const verandaAttachSelector = document.getElementById('verandaAttachSelector');
    const lblVerandaSummary = document.getElementById('lblVerandaSummary');
    const verandaSection = document.getElementById('verandaSection');

    state.verandaEnabled = false;
    state.verandaLength = 6;
    state.verandaWidth = 2;
    state.verandaHeight = 2.4;
    state.verandaAttachSide = 'length'; // 'length' | 'width' — какой своей стороной веранда примыкает к дому

    // Прокидываем площадь веранды в уже существующий механизм ценообразования
    // (veranda_high/veranda_low в доп.опциях), чтобы вся логика расчёта (утепление,
    // каркасы, подсказки площади и т.д.) продолжала работать без переделки.
    function syncVerandaToAdditions() {
        const isHouse = (state.customType === 'house_high' || state.customType === 'house_low' || state.customType === 'chalet');
        const area = (isHouse && state.verandaEnabled) ? (state.verandaLength * state.verandaWidth) : 0;
        state.additionQuantities['veranda_high'] = (state.customType === 'house_high') ? area : 0;
        state.additionQuantities['veranda_low'] = (state.customType === 'house_low') ? area : 0;
        state.additionQuantities['veranda_chalet'] = (state.customType === 'chalet') ? area : 0;
    }

    function updateVerandaSummary() {
        const area = state.verandaLength * state.verandaWidth;
        const housePerimeter = 2 * (state.customLength + state.customWidth);
        const verandaPerimeter = 2 * (state.verandaLength + state.verandaWidth);
        const adjacentSide = (state.verandaAttachSide === 'length') ? state.verandaLength : state.verandaWidth;
        const combinedPerimeter = housePerimeter + verandaPerimeter - adjacentSide;
        state.verandaCombinedPerimeter = combinedPerimeter; // на будущее — для других расчётов (свесы, вентзазор и т.п.)
        if (lblVerandaSummary) {
            lblVerandaSummary.textContent = `Площадь веранды: ${area.toFixed(1)} м² · Общий периметр (дом+веранда): ${combinedPerimeter.toFixed(1)} м`;
        }
    }

    function updateVerandaSectionVisibility() {
        if (!verandaSection) return;
        const isHouse = (state.customType === 'house_high' || state.customType === 'house_low' || state.customType === 'chalet');
        verandaSection.style.display = isHouse ? '' : 'none';
    }
    const selCustomExterior = document.getElementById('selCustomExterior');
    const selCustomInterior = document.getElementById('selCustomInterior');
    const selCustomFloor = document.getElementById('selCustomFloor');
    const selCustomInsulation = document.getElementById('selCustomInsulation');
    const chkCustomAssembly = document.getElementById('chkCustomAssembly');
    const lblCustomAssemblyPrice = document.getElementById('lblCustomAssemblyPrice');
    
    // Standard Mode DOM
    const sizesList = document.getElementById('sizesList');
    const finishesList = document.getElementById('finishesList');
    const houseTypeCard = document.getElementById('houseTypeCard');
    const assemblyRow = document.getElementById('assemblyRow');
    const optAssembly = document.getElementById('optAssembly');
    const assemblyPriceText = document.getElementById('assemblyPriceText');
    const floorOptionsContainer = document.getElementById('floorOptionsContainer');
    const insulationContainer = document.getElementById('insulationContainer');
    
    // Shared DOM
    const additionsList = document.getElementById('additionsList');
    const additionFilters = document.getElementById('additionFilters');
    const deliverySlider = document.getElementById('deliverySlider');
    const deliveryInput = document.getElementById('deliveryInput');
    const deliveryTerms = document.getElementById('deliveryTerms');
    const totalPriceText = document.getElementById('totalPriceText');
    const invoiceSummary = document.getElementById('invoiceSummary');
    const btnCopyClipboard = document.getElementById('btnCopyClipboard');
    
    // Admin Modal DOM
    const adminModal = document.getElementById('adminModal');
    const adminToggleBtn = document.getElementById('adminToggleBtn');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const adminBadge = document.getElementById('adminBadge');
    const adminFormFields = document.getElementById('adminFormFields');
    const btnSaveConfig = document.getElementById('btnSaveConfig');
    const btnResetConfig = document.getElementById('btnResetConfig');
    const btnResetCache = document.getElementById('btnResetCache');
    const btnExportConfig = document.getElementById('btnExportConfig');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    let activeAdditionFilter = 'all';

    // 3. UI View Swapping Logic
    
    btnModeCustom.addEventListener('click', () => {
        state.calculatorMode = 'custom';
        btnModeCustom.classList.add('active');
        btnModeStandard.classList.remove('active');
        productTabs.style.display = 'none';
        customConstructorArea.style.display = 'block';
        standardProjectsArea.style.display = 'none';
        
        state.additionQuantities = {};
        state.deliveryDistance = 0;
        state.isVatChecked = false;
        state.isDiscountChecked = false;
        
        renderModelUI();
    });

    btnModeStandard.addEventListener('click', () => {
        state.calculatorMode = 'standard';
        btnModeStandard.classList.add('active');
        btnModeCustom.classList.remove('active');
        productTabs.style.display = 'grid';
        customConstructorArea.style.display = 'none';
        standardProjectsArea.style.display = 'block';
        
        state.additionQuantities = {};
        state.deliveryDistance = 0;
        state.isVatChecked = false;
        state.isDiscountChecked = false;
        
        // Reset sizes and selections to defaults of active tab
        const model = activeConfig[state.activeModelIdx];
        if (model) {
            const firstSize = model.sizes[0];
            state.selectedSizeId = firstSize ? firstSize.id : '';
            state.selectedFinishIdx = 0;
            state.isAssemblyChecked = false;
            state.selectedFloorOptionIds = [];
            state.selectedInsulationIds = [];
        }
        
        renderTabs();
        renderModelUI();
    });

    function renderTabs() {
        productTabs.innerHTML = '';
        activeConfig.forEach((model, idx) => {
            const btn = document.createElement('button');
            btn.className = `tab-btn ${idx === state.activeModelIdx ? 'active' : ''}`;
            btn.textContent = model.name;
            btn.addEventListener('click', () => {
                state.activeModelIdx = idx;
                const firstSize = model.sizes[0];
                state.selectedSizeId = firstSize ? firstSize.id : '';
                state.selectedFinishIdx = 0;
                state.isAssemblyChecked = false;
                state.selectedFloorOptionIds = [];
                state.selectedInsulationIds = [];
                state.additionQuantities = {};
                state.deliveryDistance = 0;
                state.isVatChecked = false;
                state.isDiscountChecked = false;
                
                renderTabs();
                renderModelUI();
            });
            productTabs.appendChild(btn);
        });
    }

    function getActiveModel() {
        if (state.calculatorMode === 'custom') {
            if (state.customType === 'house_high' || state.customType === 'house_low') {
                return activeConfig.find(m => m.name.includes("Дачный дом \"Каркасный\"")) || activeConfig[1];
            } else {
                return activeConfig.find(m => m.name.includes("Бытовка А. Корнилова")) || activeConfig.find(m => m.name.includes("Бытовка")) || activeConfig[0];
            }
        }
        return activeConfig[state.activeModelIdx] || activeConfig[0];
    }

    function updateCustomDropdowns() {
        const type = state.customType;
        
        // 1. Exterior Dropdown (данные из materials.json / MATERIALS.exterior — редактируется в админке)
        let extHTML = '';
        if (type === 'house_high') {
            extHTML = MATERIALS.exterior.houseHigh.map(r =>
                `<option value="${r.id}">${r.name} (${r.priceNoIns.toLocaleString('ru-RU')}/${r.priceWithIns.toLocaleString('ru-RU')} р/м²)</option>`
            ).join('\n');
        } else if (type === 'house_low') {
            extHTML = MATERIALS.exterior.houseLow.materials.map(r => {
                const label = r.mode === 'base' ? `${r.name} (${r.price.toLocaleString('ru-RU')} р/м²)` : `${r.name} (+${r.price.toLocaleString('ru-RU')} р/м²)`;
                return `<option value="${r.id}">${label}</option>`;
            }).join('\n');
        } else { // cabin, hozblok
            extHTML = getExteriorSimpleOptions(type).map(r => {
                const label = r.price > 0 ? `${r.name} (+${r.price.toLocaleString('ru-RU')} р/м²)` : `${r.name} (базовая, включена)`;
                return `<option value="${r.id}">${label}</option>`;
            }).join('\n');
        }
        
        const prevExt = selCustomExterior.value;
        selCustomExterior.innerHTML = extHTML;
        if (selCustomExterior.querySelector(`option[value="${prevExt}"]`)) {
            selCustomExterior.value = prevExt;
        } else {
            selCustomExterior.value = selCustomExterior.options.length ? selCustomExterior.options[0].value : '';
        }
        state.selCustomExterior = selCustomExterior.value;

        // 2. Interior Dropdown (данные из materials.json / MATERIALS.interior — редактируется в админке)
        const intOptions = getInteriorOptions(type);
        let intHTML = intOptions.map(r => {
            const label = r.price > 0 ? `${r.name} (+${r.price.toLocaleString('ru-RU')} р/м²)` : r.name;
            return `<option value="${r.id}">${label}</option>`;
        }).join('\n');
        
        const prevInt = selCustomInterior.value;
        selCustomInterior.innerHTML = intHTML;
        if (selCustomInterior.querySelector(`option[value="${prevInt}"]`)) {
            selCustomInterior.value = prevInt;
        } else {
            selCustomInterior.value = intOptions.length ? intOptions[0].id : '';
        }
        state.selCustomInterior = selCustomInterior.value;

        // 3. Insulation Dropdown (цены в подписях считаются динамически из "Цены", а не зашиты текстом)
        const p150 = customRates.rate_ins_150 || 3700;
        const p200 = customRates.rate_ins_200 || 5600;
        const pr150hk = customRates.premium_frame_150_hk || 2500;
        const pr200hk = customRates.premium_frame_200_hk || 4000;
        const pr100kd = customRates.premium_frame_100_kd || 2000;
        const pr150kd = customRates.premium_frame_150_kd || 4500;
        const pr200kd = customRates.premium_frame_200_kd || 6000;
        const pKd150Real = customRates.rate_kd_150_real || 5700;
        const pKd200Real = customRates.rate_kd_200_real || 7600;
        const fmt = n => n.toLocaleString('ru-RU');

        let insHTML = '';
        if (type === 'house_high') {
            const hhVagonka = MATERIALS.exterior.houseHigh.find(r => r.id === 'ext_hh_vagonka') || MATERIALS.exterior.houseHigh[0];
            const hhImitatsia = MATERIALS.exterior.houseHigh.find(r => r.id === 'ext_hh_imitatsia') || MATERIALS.exterior.houseHigh[1] || hhVagonka;
            insHTML = `
                <option value="100_base_min">100 мм мин. вата (базовая, включена)</option>
                <option value="100">100 мм базальтовая плита (по формуле)</option>
                <option value="150">150 мм базальтовая плита (+${fmt(p150)} р/м²)</option>
                <option value="200">200 мм базальтовая плита (+${fmt(p200)} р/м²)</option>
                <option value="mix_100">Утепление MIX: каркас 50/100 (баз. плита стены + мин. вата пол/потолок)</option>
                <option value="cold">Каркас 50/100 ХК, без утепления (${fmt(hhVagonka.priceNoIns)} р/м² Вагонка ВС / ${fmt(hhImitatsia.priceNoIns)} р/м² Имитация В)</option>
                <option value="frame_150_hk">Каркас 50/150 ХК, без утепления (+${fmt(pr150hk)} р/м² к цене без утепления, с верандой)</option>
                <option value="frame_200_hk">Каркас 50/200 ХК, без утепления (+${fmt(pr200hk)} р/м² к цене без утепления, с верандой)</option>
                <option value="frame_100_kd">Каркас 50/100 "камерная сушка" ХК, без утепления (+${fmt(pr100kd)} р/м² к цене без утепления)</option>
                <option value="frame_150_kd">Каркас 50/150 "камерная сушка" ХК, без утепления (+${fmt(pr150kd)} р/м² к цене без утепления, с верандой)</option>
                <option value="frame_200_kd">Каркас 50/200 "камерная сушка" ХК, без утепления (+${fmt(pr200kd)} р/м² к цене без утепления, с верандой)</option>
                <option value="kd_100_real">Каркас 50/100 "камерная сушка" + утепление 100мм баз. плита (по формуле + ${fmt(pr100kd)} р/м² каркас, с верандой)</option>
                <option value="kd_150_real">Каркас 50/150 "камерная сушка" + утепление 150мм баз. плита (+${fmt(pKd150Real)} р/м², с верандой)</option>
                <option value="kd_200_real">Каркас 50/200 "камерная сушка" + утепление 200мм баз. плита (+${fmt(pKd200Real)} р/м², с верандой)</option>
            `;
        } else if (type === 'cabin') {
            insHTML = `
                <option value="50_min_wool">50 мм мин. вата (базовая, включена)</option>
                <option value="100_min_wool">100 мм мин. вата (${customRates.rate_ins_100_min_wool > 0 ? '+' + fmt(customRates.rate_ins_100_min_wool) + ' р/м²' : 'базовая, включена'})</option>
                <option value="100">100 мм базальтовая плита (по формуле)</option>
                <option value="mix_100">Утепление MIX: каркас 50/100 (баз. плита стены + мин. вата пол/потолок)</option>
                <option value="150">150 мм базальтовая плита (+${fmt(p150)} р/м²)</option>
                <option value="0">Без утепления</option>
            `;
        } else if (type === 'hozblok') {
            insHTML = `
                <option value="0">Без утепления (включено)</option>
            `;
        } else if (type === 'chalet') {
            insHTML = `
                <option value="100_base_min">100 мм мин. вата (базовая, включена)</option>
                <option value="100">100 мм базальтовая плита (по формуле)</option>
                <option value="150">150 мм базальтовая плита (+${fmt(p150)} р/м², с верандой)</option>
                <option value="200">200 мм базальтовая плита (+${fmt(p200)} р/м², с верандой)</option>
                <option value="mix_100">Утепление MIX: каркас 50/100 (баз. плита стены + мин. вата пол/потолок)</option>
                <option value="kd_100_real">Каркас 50/100 "камерная сушка" + утепление 100мм баз. плита (по формуле + ${fmt(pr100kd)} р/м² каркас, с верандой)</option>
                <option value="kd_150_real">Каркас 50/150 "камерная сушка" + утепление 150мм баз. плита (+${fmt(pKd150Real)} р/м², с верандой)</option>
                <option value="kd_200_real">Каркас 50/200 "камерная сушка" + утепление 200мм баз. плита (+${fmt(pKd200Real)} р/м², с верандой)</option>
            `;
        } else {
            const hlNoIns = MATERIALS.exterior.houseLow.noInsRate;
            insHTML = `
                <option value="100_base_min">100 мм мин. вата (в базовой)</option>
                <option value="100">100 мм базальтовая плита (по формуле)</option>
                <option value="150">150 мм базальтовая плита (+${fmt(p150)} р/м²)</option>
                <option value="200">200 мм базальтовая плита (+${fmt(p200)} р/м²)</option>
                <option value="mix_100">Утепление MIX: каркас 50/100 (баз. плита стены + мин. вата пол/потолок)</option>
                <option value="0">Каркас 50/100 ХК, без утепления (${fmt(hlNoIns)} р/м²)</option>
                <option value="frame_150_hk">Каркас 50/150 ХК, без утепления (${fmt(hlNoIns + pr150hk)} р/м², с верандой)</option>
                <option value="frame_200_hk">Каркас 50/200 ХК, без утепления (${fmt(hlNoIns + pr200hk)} р/м², с верандой)</option>
                <option value="frame_100_kd">Каркас 50/100 "камерная сушка" ХК, без утепления (${fmt(hlNoIns + pr100kd)} р/м², веранда ${fmt(8000 + pr100kd)} р/м²)</option>
                <option value="frame_150_kd">Каркас 50/150 "камерная сушка" ХК, без утепления (${fmt(hlNoIns + pr150kd)} р/м², с верандой)</option>
                <option value="frame_200_kd">Каркас 50/200 "камерная сушка" ХК, без утепления (${fmt(hlNoIns + pr200kd)} р/м², с верандой)</option>
                <option value="kd_100_real">Каркас 50/100 "камерная сушка" + утепление 100мм баз. плита (по формуле + ${fmt(pr100kd)} р/м² каркас, с верандой)</option>
                <option value="kd_150_real">Каркас 50/150 "камерная сушка" + утепление 150мм баз. плита (+${fmt(pKd150Real)} р/м², с верандой)</option>
                <option value="kd_200_real">Каркас 50/200 "камерная сушка" + утепление 200мм баз. плита (+${fmt(pKd200Real)} р/м², с верандой)</option>
            `;
        }
        
        const prevIns = selCustomInsulation.value;
        selCustomInsulation.innerHTML = insHTML;
        if (selCustomInsulation.querySelector(`option[value="${prevIns}"]`)) {
            selCustomInsulation.value = prevIns;
        } else {
            if (type === 'house_high') {
                selCustomInsulation.value = '100_base_min';
            } else if (type === 'cabin') {
                selCustomInsulation.value = '50_min_wool';
            } else if (type === 'hozblok') {
                selCustomInsulation.value = '0';
            } else {
                selCustomInsulation.value = '100_base_min';
            }
        }
        state.selCustomInsulation = selCustomInsulation.value;

        // 4. Floor Dropdown (данные из materials.json / MATERIALS.floor — редактируется в админке)
        const floorOptions = getFloorOptions(type);
        let floorHTML = floorOptions.map(r => {
            const label = r.price > 0 ? `${r.name} (+${r.price.toLocaleString('ru-RU')} р/м²)` : r.name;
            return `<option value="${r.id}">${label}</option>`;
        }).join('\n');
        
        const prevFloor = selCustomFloor.value;
        selCustomFloor.innerHTML = floorHTML;
        if (selCustomFloor.querySelector(`option[value="${prevFloor}"]`)) {
            selCustomFloor.value = prevFloor;
        } else {
            selCustomFloor.value = floorOptions.length ? floorOptions[0].id : '';
        }
        state.selCustomFloor = selCustomFloor.value;
    }

    // 4. Model UI Rendering Engine
    function renderModelUI() {
        if (state.calculatorMode === 'custom') {
            updateVerandaSectionVisibility();
            syncVerandaToAdditions();
            updateVerandaSummary();
            if (state.customType === 'house_high') {
                customHeightSlider.disabled = true;
                state.customHeight = 2.4;
                customHeightSlider.value = 2.4;
            } else if (state.customType === 'house_low') {
                customHeightSlider.disabled = true;
                state.customHeight = 2.2;
                customHeightSlider.value = 2.2;
            } else if (state.customType === 'cabin' || state.customType === 'hozblok') {
                customHeightSlider.disabled = true;
                state.customHeight = 2.0;
                customHeightSlider.value = 2.0;
            } else if (state.customType === 'chalet') {
                // Высота у Шале не влияет на цену (нет данных на этот счёт), но диапазон — как просил заказчик (2.2–3.0 м)
                customHeightSlider.disabled = false;
                customHeightSlider.min = '2.2';
                customHeightSlider.max = '3.0';
                if (state.customHeight < 2.2 || state.customHeight > 3.0) {
                    state.customHeight = 2.4;
                    customHeightSlider.value = 2.4;
                }
            } else {
                customHeightSlider.disabled = false;
                customHeightSlider.min = '2';
                customHeightSlider.max = '4';
            }
            // Render Custom Constructor sliders labels
            lblCustomLength.textContent = `${Math.round(state.customLength)} м`;
            lblCustomWidth.textContent = `${Math.round(state.customWidth)} м`;
            lblCustomHeight.textContent = `${state.customHeight.toFixed(1)} м`;

            // Dynamically update exterior, interior, insulation, and floor dropdown options
            updateCustomDropdowns();

            // Assembly price update in UI
            const area = state.customLength * state.customWidth;
            let assemblyPrice = 0;
            if (state.customType !== 'house_high' && state.customType !== 'house_low' && state.customType !== 'hozblok') {
                assemblyPrice = Math.round(area * customRates.rate_assembly);
            }
            lblCustomAssemblyPrice.textContent = `+${assemblyPrice.toLocaleString('ru-RU')} руб.`;

            const assemblyRow = chkCustomAssembly.closest('.option-row');
            if (state.customType === 'hozblok') {
                assemblyRow.style.display = 'none';
                state.chkCustomAssembly = false;
                chkCustomAssembly.checked = false;
            } else {
                assemblyRow.style.display = 'flex';
            }
            
            // Render Additions and Delivery notes
            renderAdditions();
            deliveryTerms.textContent = `Доставка (${customRates.delivery_price_km} руб/км, мин. ${customRates.delivery_base_price} руб):`;
            
        } else {
            // Render Standard Excel sheet Mode
            const model = getActiveModel();
            if (!model) return;

            // Render houseType Selector for "Дачный дом \"Каркасный\""
            if (model.name.includes("Дачный дом \"Каркасный\"")) {
                houseTypeCard.style.display = 'block';
            } else {
                houseTypeCard.style.display = 'none';
            }

            // Render Sizes standard cards
            sizesList.innerHTML = '';
            model.sizes.forEach(size => {
                const area = size.length * size.width;
                const sizeCard = document.createElement('div');
                sizeCard.className = `selector-card ${size.id === state.selectedSizeId ? 'active' : ''}`;
                sizeCard.innerHTML = `
                    <div class="title">${size.name}</div>
                    <div class="sub">${area} кв.м</div>
                    <div class="sub">${size.length}м х ${size.width}м</div>
                `;
                sizeCard.addEventListener('click', () => {
                    state.selectedSizeId = size.id;
                    renderModelUI();
                });
                sizesList.appendChild(sizeCard);
            });

            // Render Finishes rows
            finishesList.innerHTML = '';
            model.finishes.forEach((fin, idx) => {
                const size = model.sizes.find(s => s.id === state.selectedSizeId);
                let price = 0;
                
                if (model.name.includes("Дачный дом \"Каркасный\"") && size) {
                    const area = size.length * size.width;
                    const perimeter = 2 * (size.length + size.width);
                    if (fin.name.includes("Вагонка 'ВС'")) {
                        price = area * state.houseTypeRate;
                    } else if (fin.name.includes("Имитация бруса")) {
                        const vagankaBase = area * state.houseTypeRate;
                        const wallArea = perimeter * state.houseTypeHeight;
                        price = vagankaBase + wallArea * 250;
                    } else {
                        price = fin.prices[state.selectedSizeId] || 0;
                    }
                } else if (model.name.includes("Бытовка базовая") && size) {
                    const isCombined = size.cabinWidth !== undefined;
                    let calcArea = size.length * size.width;
                    let calcPerimeter = 2 * (size.length + size.width);
                    if (isCombined) {
                        calcArea = size.length * size.cabinWidth;
                        calcPerimeter = 2 * (size.length + size.cabinWidth);
                    }
                    
                    let basePriceVagankaOsb = 0;
                    if (isCombined) {
                        const cabinModel = activeConfig.find(m => m.name.includes("Бытовка"));
                        const hozblokModel = activeConfig.find(m => m.name.includes("Хозблок"));
                        if (cabinModel && hozblokModel) {
                            const cabinSizeId = `${size.length}x${size.cabinWidth}`;
                            const hozWidth = size.verandaWidth === 1 ? 2 : size.verandaWidth;
                            const hozSizeId = `${size.length}x${hozWidth}`;
                            
                            const cabPrice = cabinModel.finishes[0].prices[cabinSizeId] || 0;
                            let hozPrice = hozblokModel.finishes[0].prices[hozSizeId] || 0;
                            if (size.verandaWidth === 1) hozPrice -= 20000;
                            
                            basePriceVagankaOsb = cabPrice + hozPrice + 10000;
                        }
                    } else {
                        basePriceVagankaOsb = model.finishes[0].prices[size.id] || 0;
                    }
                    
                    let extCost = 0;
                    let intCost = 0;
                    
                    if (fin.name.includes("Имитация бруса 'В'")) {
                        extCost = calcPerimeter * 2.5 * 250;
                    } else if (fin.name.includes("Профлист С8 цветной")) {
                        extCost = calcPerimeter * 2.5 * 400;
                    }
                    
                    if (fin.name.includes("Вагонка 'ВС' / Вагонка 'ВС'") || fin.name.includes("/ Вагонка 'ВС'")) {
                        intCost = (calcPerimeter * 2.5 + calcArea) * 120;
                    }
                    
                    price = basePriceVagankaOsb + extCost + intCost;
                } else if (model.name.includes("Хозблоки базовая") && size) {
                    const perimeter = 2 * (size.length + size.width);
                    const basePriceVagankaNone = model.finishes[0].prices[size.id] || 0;
                    let extCost = 0;
                    
                    if (fin.name.includes("Имитация бруса 'В'")) {
                        extCost = perimeter * 2.5 * 250;
                    } else if (fin.name.includes("Профлист С8 цветной")) {
                        extCost = perimeter * 2.5 * 400;
                    }
                    
                    price = basePriceVagankaNone + extCost;
                } else {
                    price = fin.prices[state.selectedSizeId] || 0;
                }

                const activeClass = idx === state.selectedFinishIdx ? 'active' : '';
                const row = document.createElement('div');
                row.className = `option-row selector-card ${activeClass}`;
                row.style.flexDirection = 'row';
                row.style.justifyContent = 'space-between';
                row.style.textAlign = 'left';
                row.style.width = '100%';
                row.innerHTML = `
                    <div class="option-info">
                        <span class="option-label" style="font-weight:700;">${fin.name}</span>
                    </div>
                    <div class="option-price">${price.toLocaleString('ru-RU')} руб.</div>
                `;
                row.addEventListener('click', () => {
                    state.selectedFinishIdx = idx;
                    renderModelUI();
                });
                finishesList.appendChild(row);
            });

            // Standard Assembly
            const size = model.sizes.find(s => s.id === state.selectedSizeId);
            const finish = model.finishes[state.selectedFinishIdx];
            let assemblyPrice = 0;
            if (finish && size) {
                const isCabin = model.name.includes("Бытовка базовая");
                const isCombined = isCabin && size.cabinWidth !== undefined;
                if (isCombined) {
                    const cabinModel = activeConfig.find(m => m.name.includes("Бытовка"));
                    const hozblokModel = activeConfig.find(m => m.name.includes("Хозблок"));
                    if (cabinModel && hozblokModel) {
                        const cabinSizeId = `${size.length}x${size.cabinWidth}`;
                        const hozWidth = size.verandaWidth === 1 ? 2 : size.verandaWidth;
                        const hozSizeId = `${size.length}x${hozWidth}`;
                        
                        const cabAsm = cabinModel.finishes[0].assembly[cabinSizeId] || 0;
                        const hozAsm = hozblokModel.finishes[0].assembly[hozSizeId] || 0;
                        
                        assemblyPrice = cabAsm + hozAsm;
                    }
                } else {
                    assemblyPrice = finish.assembly[size.id] || model.assembly?.[size.id] || 0;
                }
            }
            
            if (assemblyPrice > 0) {
                assemblyRow.style.display = 'flex';
                assemblyPriceText.textContent = `${assemblyPrice.toLocaleString('ru-RU')} руб.`;
                optAssembly.checked = state.isAssemblyChecked;
            } else {
                assemblyRow.style.display = 'none';
                state.isAssemblyChecked = false;
            }

            // Floor Options
            floorOptionsContainer.innerHTML = '';
            if (model.floorOptions && model.floorOptions.length > 0) {
                const title = document.createElement('h3');
                title.textContent = 'Опции пола';
                title.style.fontSize = '14px';
                title.style.margin = '15px 0 5px';
                floorOptionsContainer.appendChild(title);
                
                model.floorOptions.forEach(opt => {
                    const price = opt.prices[state.selectedSizeId] || 0;
                    if (price > 0) {
                        const isChecked = state.selectedFloorOptionIds.includes(opt.id);
                        const row = document.createElement('div');
                        row.className = 'option-row';
                        row.innerHTML = `
                            <div class="option-info">
                                <input type="checkbox" id="fl_${opt.id}" ${isChecked ? 'checked' : ''}>
                                <label for="fl_${opt.id}" class="option-label" style="cursor:pointer;">${opt.name}</label>
                            </div>
                            <div class="option-price">${price.toLocaleString('ru-RU')} руб.</div>
                        `;
                        row.querySelector('input').addEventListener('change', (e) => {
                            if (e.target.checked) {
                                state.selectedFloorOptionIds.push(opt.id);
                            } else {
                                state.selectedFloorOptionIds = state.selectedFloorOptionIds.filter(id => id !== opt.id);
                            }
                            calculateBill();
                        });
                        floorOptionsContainer.appendChild(row);
                    }
                });
            }

            // Insulation Options
            insulationContainer.innerHTML = '';
            if (model.insulation && model.insulation.length > 0) {
                const title = document.createElement('h3');
                title.textContent = 'Опции утепления';
                title.style.fontSize = '14px';
                title.style.margin = '15px 0 5px';
                insulationContainer.appendChild(title);

                model.insulation.forEach(opt => {
                    const price = opt.prices[state.selectedSizeId] || 0;
                    const isChecked = state.selectedInsulationIds.includes(opt.id);
                    const row = document.createElement('div');
                    row.className = 'option-row';
                    row.innerHTML = `
                        <div class="option-info">
                            <input type="checkbox" id="ins_${opt.id}" ${isChecked ? 'checked' : ''}>
                            <label for="ins_${opt.id}" class="option-label" style="cursor:pointer;">${opt.name}</label>
                        </div>
                        <div class="option-price">${price > 0 ? price.toLocaleString('ru-RU') + ' руб.' : 'Включено'}</div>
                    `;
                    row.querySelector('input').addEventListener('change', (e) => {
                        if (e.target.checked) {
                            state.selectedInsulationIds.push(opt.id);
                        } else {
                            state.selectedInsulationIds = state.selectedInsulationIds.filter(id => id !== opt.id);
                        }
                        calculateBill();
                    });
                    insulationContainer.appendChild(row);
                });
            }

            renderAdditions();
            deliveryTerms.textContent = `${model.delivery.notes} (Введите расстояние):`;
        }

        deliverySlider.value = state.deliveryDistance;
        deliveryInput.value = state.deliveryDistance;
        calculateBill();
    }

    function isHighRoof() {
        if (state.calculatorMode === 'custom') {
            return state.customType === 'house_high';
        } else {
            const model = getActiveModel();
            return model && model.name.includes("Дачный дом") && state.houseTypeHeight === 3.5;
        }
    }

    function renderAdditions() {
        const model = getActiveModel();
        if (!model) return;
        
        additionsList.innerHTML = '';

        let area = 0;
        let perimeter = 0;
        let calcPerimeter = 0;
        
        if (state.calculatorMode === 'custom') {
            area = state.customLength * state.customWidth;
            perimeter = 2 * (state.customLength + state.customWidth);
            calcPerimeter = perimeter;
        } else {
            const size = model.sizes.find(s => s.id === state.selectedSizeId);
            area = size ? size.length * size.width : 0;
            perimeter = size ? 2 * (size.length + size.width) : 0;
            calcPerimeter = (size && size.cabinWidth !== undefined) ? 2 * (size.length + size.cabinWidth) : perimeter;
        }

        model.additions.forEach(add => {
            // Веранда для домов теперь редактируется в отдельном разделе "2. Веранда" —
            // строку в доп.опциях больше не показываем, но количество (и цена) продолжают
            // считаться через тот же механизм (см. syncVerandaToAdditions).
            if (add.id === 'veranda_high' || add.id === 'veranda_low' || add.id === 'veranda_chalet') return;

            // Единая проверка: если позиция не применима для текущего выбора — обнуляем
            // сохранённое количество (чтобы оно не "всплыло" в итоге при переключении) и скрываем строку.
            if (!isAdditionApplicable(add, model)) {
                if (state.additionQuantities[add.id]) {
                    state.additionQuantities[add.id] = 0;
                }
                return;
            }

            // Apply filtering logic
            if (activeAdditionFilter !== 'all') {
                if (add.fromMaterials) {
                    // JSON-позиции (доп.опции из админки) — фильтруем строго по полю group, без угадывания по названию
                    if (add.group !== activeAdditionFilter) return;
                } else {
                const nameLower = add.name.toLowerCase();
                if (activeAdditionFilter === 'windows') {
                    if (!nameLower.includes('окн')) return;
                } else if (activeAdditionFilter === 'doors') {
                    if (add.id !== 'floor_hatch' && !nameLower.includes('двер')) return;
                } else if (activeAdditionFilter === 'area') {
                    if (add.id === 'profile_harness' || add.id === 'veranda_cabin' || add.id === 'floor_hatch') return;
                    if (add.type !== 'area' && !nameLower.includes('пол') && !nameLower.includes('ваг') && !nameLower.includes('осб') && !nameLower.includes('стена') && !nameLower.includes('покраск')) return;
                } else if (activeAdditionFilter === 'piles') {
                    if (!nameLower.includes('сва') && !nameLower.includes('обвязк')) return;
                } else if (activeAdditionFilter === 'other') {
                    if (add.id !== 'veranda_cabin' && (nameLower.includes('окн') || nameLower.includes('двер') || add.type === 'area' || nameLower.includes('пол') || nameLower.includes('ваг') || nameLower.includes('осб') || nameLower.includes('стена') || nameLower.includes('покраск') || nameLower.includes('сва') || nameLower.includes('обвязк'))) return;
                }
                }
            }

            // Text search filter (by name)
            if (additionSearchQuery) {
                const nameLowerForSearch = add.name.toLowerCase();
                const searchWords = additionSearchQuery.split(/\s+/).filter(Boolean);
                const matchesAll = searchWords.every(w => nameLowerForSearch.includes(w));
                if (!matchesAll) return;
            }

            const qty = state.additionQuantities[add.id] || 0;
            const price = (add.id === 'frame_upgrade') ? getFrameUpgradePrice()
                : (add.id === 'wall_height_raise_20') ? getWallHeightRaisePrice()
                : (add.id === 'roof_overhangs') ? getSvesyPrice()
                : add.fromMaterials ? getMaterialsAdditionPrice(add)
                : (add.price || 0);
            
            let recQty = 0;
            let recText = '';

            // Special veranda handling: user inputs depth (м)
            // For cabin/hozblok (veranda_cabin), veranda is along the length.
            // (For houses, the veranda is calculated directly in square meters without multipliers).
            const isVeranda = (add.id === 'veranda_cabin');
            if (isVeranda) {
                const isHouseVeranda = (add.id === 'veranda_high' || add.id === 'veranda_low');
                let dimensionVal = 0;
                let dimensionLabel = '';
                if (state.calculatorMode === 'custom') {
                    dimensionVal = isHouseVeranda ? Math.round(state.customWidth) : Math.round(state.customLength);
                    dimensionLabel = isHouseVeranda ? 'ширины' : 'длины';
                } else {
                    const sz = model.sizes ? model.sizes.find(s => s.id === state.selectedSizeId) : null;
                    if (sz) {
                        dimensionVal = isHouseVeranda ? sz.width : sz.length;
                    }
                    dimensionLabel = isHouseVeranda ? 'ширины' : 'длины';
                }
                const depth = qty || 0;
                const verandaArea = depth * dimensionVal;
                recText = `2 м`;
                recQty = 2;
                const applyLink2 = ` <a href="#" class="apply-rec-btn" data-val="2" style="font-size:11px; color:var(--primary); text-decoration:underline; margin-left:4px; cursor:pointer;">2м</a>`;
                const applyLink3 = ` <a href="#" class="apply-rec-btn" data-val="3" style="font-size:11px; color:var(--primary); text-decoration:underline; margin-left:4px; cursor:pointer;">3м</a>`;
                const areaHint = depth > 0 ? `<span style="font-size:11px;color:var(--text-muted);margin-left:8px;">${depth}м × ${dimensionVal}м = ${verandaArea} м²</span>` : `<span style="font-size:11px;color:var(--text-muted);margin-left:8px;">глубина × ${dimensionVal}м ${dimensionLabel}</span>`;

                const row = document.createElement('div');
                row.className = 'option-row';
                row.innerHTML = `
                    <div class="option-info" style="max-width: 65%;">
                        <span class="option-label">${add.name} ${applyLink2}${applyLink3}${areaHint}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap: 15px;">
                        <div class="option-price">${(add.price).toLocaleString('ru-RU')} р/м²</div>
                        <div class="quantity-control">
                            <button class="qty-btn dec-btn">-</button>
                            <input type="number" class="qty-input" value="${qty}" min="0" style="width:45px;" placeholder="м">
                            <button class="qty-btn inc-btn">+</button>
                        </div>
                    </div>
                `;

                const input = row.querySelector('.qty-input');
                const decBtn = row.querySelector('.dec-btn');
                const incBtn = row.querySelector('.inc-btn');

                const updateQty = (newVal) => {
                    newVal = Math.max(0, newVal);
                    state.additionQuantities[add.id] = newVal;
                    input.value = newVal;
                    renderAdditions(); // re-render to update area hint
                    calculateBill();
                };

                input.addEventListener('change', (e) => { updateQty(parseInt(e.target.value) || 0); });
                decBtn.addEventListener('click', () => { updateQty((state.additionQuantities[add.id] || 0) - 1); });
                incBtn.addEventListener('click', () => { updateQty((state.additionQuantities[add.id] || 0) + 1); });
                row.querySelectorAll('.apply-rec-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => { e.preventDefault(); updateQty(parseInt(btn.getAttribute('data-val'))); });
                });

                additionsList.appendChild(row);
                return; // skip normal rendering below
            }

            if (add.type === 'area') {
                const nameLower = add.name.toLowerCase();
                if (add.fromMaterials) {
                    // JSON-позиции — подсказка берётся из поля hint записи, без угадывания по названию
                    if (add.hint === 'houseAndVeranda') {
                        recQty = Math.ceil(area + getVerandaArea());
                        recText = `Площадь: ${recQty} м²`;
                    } else if (add.hint === 'perimeter') {
                        recQty = Math.ceil(calcPerimeter);
                        recText = `Периметр: ${recQty} м`;
                    } else if (add.hint === 'perimeterAndVeranda') {
                        // Точный периметр — берём из раздела "2. Веранда" (там заданы настоящие
                        // длина/ширина веранды и прилегающая сторона, а не только площадь).
                        recQty = Math.ceil(state.verandaEnabled ? state.verandaCombinedPerimeter : calcPerimeter);
                        recText = `Периметр: ${recQty} м`;
                    } else if (add.hint === 'houseArea') {
                        recQty = Math.ceil(area);
                        recText = `Площадь: ${recQty} м²`;
                    } else if (add.hint === 'verandaOnly') {
                        recQty = Math.ceil(getVerandaArea());
                        recText = `Площадь веранды: ${recQty} м²`;
                    }
                    // hint === 'none' — подсказку не показываем (recQty/recText остаются пустыми)
                } else if (add.id === 'wall_height_raise_20') {
                    // Явно проверяем ID раньше, чем общее совпадение по слову "стен" —
                    // иначе попадает в ветку "площадь стен" (периметр×высота) вместо площади дома.
                    recQty = Math.ceil(area + getVerandaArea());
                    recText = `Площадь: ${recQty} м²`;
                } else if (nameLower.includes('стена') || nameLower.includes('стен')) {
                    const height = (state.calculatorMode === 'custom') ? state.customHeight : ((model.name.includes("Дачный дом \"Каркасный\"")) ? state.houseTypeHeight : 2.2);
                    recQty = Math.ceil(calcPerimeter * height);
                    recText = `Стены: ${recQty} м²`;
                } else if (nameLower.includes('периметр') || nameLower.includes('вентзазор') || nameLower.includes('свес') || nameLower.includes('обвязк')) {
                    recQty = Math.ceil(calcPerimeter);
                    recText = `Периметр: ${recQty} м`;
                } else if (add.id === 'roof_metal' || add.id === 'roof_proflist_low' || add.id === 'roof_proflist_high') {
                    const porchArea = state.additionQuantities['freestanding_porch'] || 0;
                    recQty = Math.ceil(area + getVerandaArea() + porchArea);
                    recText = `Площадь: ${recQty} м²`;
                } else {
                    recQty = Math.ceil(area);
                    recText = `Площадь: ${recQty} м²`;
                }
            }

            const displayName = (add.id === 'frame_upgrade' || add.id === 'wall_height_raise_20')
                ? `${add.name} (+${price.toLocaleString('ru-RU')} р/м²)`
                : add.name;

            const applyLink = recText ? ` <a href="#" class="apply-rec-btn" data-val="${recQty}" style="font-size:11px; color:var(--primary); text-decoration:underline; margin-left:8px; cursor:pointer;" title="Подставить площадь/периметр в количество">${recText}</a>` : '';

            const row = document.createElement('div');
            row.className = 'option-row';
            row.innerHTML = `
                <div class="option-info" style="max-width: 65%;">
                    <span class="option-label">${displayName} ${applyLink}</span>
                </div>
                <div style="display:flex; align-items:center; gap: 15px;">
                    <div class="option-price">${price.toLocaleString('ru-RU')} р.</div>
                    <div class="quantity-control">
                        <button class="qty-btn dec-btn">-</button>
                        <input type="number" class="qty-input" value="${qty}" min="0">
                        <button class="qty-btn inc-btn">+</button>
                    </div>
                </div>
            `;

            const input = row.querySelector('.qty-input');
            const decBtn = row.querySelector('.dec-btn');
            const incBtn = row.querySelector('.inc-btn');
            const applyBtn = row.querySelector('.apply-rec-btn');

            const updateQty = (newVal) => {
                newVal = Math.max(0, newVal);
                state.additionQuantities[add.id] = newVal;
                input.value = newVal;
                renderAdditions();
                calculateBill();
            };

            input.addEventListener('change', (e) => {
                updateQty(parseInt(e.target.value) || 0);
            });

            decBtn.addEventListener('click', () => {
                updateQty((state.additionQuantities[add.id] || 0) - 1);
            });

            incBtn.addEventListener('click', () => {
                updateQty((state.additionQuantities[add.id] || 0) + 1);
            });

            if (applyBtn) {
                applyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    updateQty(recQty);
                });
            }

            additionsList.appendChild(row);
        });

        if (additionsList.children.length === 0) {
            additionsList.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding: 15px;">Нет подходящих опций в этой категории.</div>`;
        }
    }

    // Veranda area for houses is entered directly in m² via the addition input
    // (veranda_high / veranda_low), unlike cabins where it's depth * length.
    function getVerandaArea() {
        if (state.calculatorMode !== 'custom') return 0;
        if (state.customType === 'house_high') return state.additionQuantities['veranda_high'] || 0;
        if (state.customType === 'house_low') return state.additionQuantities['veranda_low'] || 0;
        if (state.customType === 'chalet') return state.additionQuantities['veranda_chalet'] || 0;
        return 0;
    }

    // Frame upgrade (50/100 -> 50/150) is 2500 р/м² for houses (high or low roof)
    // without any insulation selected, and 2000 р/м² otherwise.
    function getFrameUpgradePrice() {
        if (state.calculatorMode === 'custom') {
            const isHouseNoIns =
                (state.customType === 'house_high' && (state.selCustomInsulation === 'cold' || state.selCustomInsulation === 'frame_100_kd')) ||
                (state.customType === 'house_low' && (state.selCustomInsulation === '0' || state.selCustomInsulation === 'frame_100_kd'));
            if (isHouseNoIns) return customRates.price_frame_upgrade_no_ins || 2500;
        }
        return customRates.price_frame_upgrade_normal || 2000;
    }

    // Поднятие высоты стен на 20 см: цена зависит от толщины каркаса
    function getWallHeightRaisePrice() {
        if (state.calculatorMode === 'custom' && (state.customType === 'house_high' || state.customType === 'house_low')) {
            if (['cold', '0', 'frame_100_kd'].includes(state.selCustomInsulation)) return customRates.price_wall_raise_100 || 700;
            if (['frame_150_hk', 'frame_150_kd', 'kd_150_real'].includes(state.selCustomInsulation)) return customRates.price_wall_raise_150 || 1000;
            if (['frame_200_hk', 'frame_200_kd', 'kd_200_real'].includes(state.selCustomInsulation)) return customRates.price_wall_raise_200 || 1400;
        }
        // Каркас явно не указан (обычное утепление без ХК/КС) — базовая цена 700
        return customRates.price_wall_raise_100 || 700;
    }

    // Свесы на кровле: цена за каждые +10 см (сверх базовых бесплатных 15 см) = ставка × общий периметр
    // (периметр дома + периметр веранды, БЕЗ вычета смежной стороны — так посчитано в формуле заказчика).
    function getSvesyPrice() {
        const rate = customRates.rate_svesy || 1000;
        let combinedPerimeter = (state.calculatorMode === 'custom')
            ? 2 * (state.customLength + state.customWidth)
            : 0;
        if (state.calculatorMode === 'custom' && state.verandaEnabled &&
            (state.customType === 'house_high' || state.customType === 'house_low')) {
            combinedPerimeter += 2 * (state.verandaLength + state.verandaWidth);
        }
        return rate * combinedPerimeter;
    }

    // Единая проверка применимости доп.опции для текущего выбора (тип дома/бытовки, утепление, крыша и т.д.).
    // Используется и при отрисовке списка допов, и при расчёте суммы — чтобы скрытая позиция
    // никогда не попадала в итог, даже если у неё осталось сохранённое количество от другого выбора.
    function isAdditionApplicable(add, model) {
        const isHouseHigh = (state.calculatorMode === 'custom' && state.customType === 'house_high') ||
                             (state.calculatorMode === 'standard' && model.name.includes("Дачный дом") && isHighRoof());
        const isHouseLow = (state.calculatorMode === 'custom' && state.customType === 'house_low') ||
                            (state.calculatorMode === 'standard' && model.name.includes("Дачный дом") && !isHighRoof());
        const isHouse = isHouseHigh || isHouseLow;
        const isCabinOrHoz = (state.calculatorMode === 'custom' && (state.customType === 'cabin' || state.customType === 'hozblok')) ||
                              (state.calculatorMode === 'standard' && (model.name.includes("Бытовка") || model.name.includes("Хозблок")));

        if (add.id === 'veranda_high') return isHouseHigh;
        if (add.id === 'veranda_low') return isHouseLow;
        if (add.id === 'veranda_cabin') return isCabinOrHoz;
        if (add.id === 'veranda_chalet') return (state.calculatorMode === 'custom' && state.customType === 'chalet');

        // Позиции из materials.json (доп.опции, редактируемые через админку) — видимость по списку категорий записи
        if (add.fromMaterials && Array.isArray(add.categories)) {
            const isHozblokOnly = (state.calculatorMode === 'custom' && state.customType === 'hozblok') ||
                                   (state.calculatorMode === 'standard' && model.name.includes("Хозблок"));
            const isCabinOnly = (state.calculatorMode === 'custom' && state.customType === 'cabin') ||
                                 (state.calculatorMode === 'standard' && model.name.includes("Бытовка") && !model.name.includes("Хозблок"));
            const catMatch = {
                house_high: isHouseHigh,
                house_low: isHouseLow,
                cabin: isCabinOnly,
                hozblok: isHozblokOnly,
                chalet: (state.calculatorMode === 'custom' && state.customType === 'chalet')
            };
            return add.categories.some(c => catMatch[c]);
        }

        if (isHouse) {
            if (add.id === 'roof_double_pitch_1800' || add.id === 'roof_double_pitch_flat' || add.id === 'veranda_ceiling_board') {
                return false;
            }
            if (isHighRoof()) {
                if (add.id === 'roof_proflist_low') return false;
            } else {
                if (add.id === 'roof_proflist_high') return false;
            }
        }

        if (add.id === 'roof_double_pitch_flat') {
            if (state.customType === 'hozblok') return false;
            if (state.calculatorMode === 'standard' && model.name.includes("Хозблок")) return false;
        }

        if (add.id === 'ins_basalt_ceiling_200' || add.id === 'ins_basalt_floor_200') {
            if (state.customType === 'hozblok') return false;
            if (state.calculatorMode === 'standard' && (model.name.includes("Бытовка") || model.name.includes("Хозблок"))) return false;
        }

        if (add.id === 'veranda_ceiling_board') {
            if (state.calculatorMode === 'standard' && model.name.includes("Бытовка")) return false;
        }

        if (add.id === 'roof_end_door') {
            const isHighRoofHouse = (state.calculatorMode === 'custom' && state.customType === 'house_high') ||
                                    (state.calculatorMode === 'standard' && model.name.includes("Дачный дом") && state.houseTypeHeight === 3.5);
            if (!isHighRoofHouse) return false;
        }

        if (add.id === 'vent_gap' && !isHouse) return false;

        const NEW_2CHAMBER_WINDOW_IDS = [
            'win_lux_60_90_po2', 'win_lux_60_120_po2', 'win_lux_60_180_po2',
            'win_lux_100_100_po2', 'win_lux_120_120_po2', 'win_lux_100_140_po2',
            'win_lux_100_150_po2', 'win_lux_120_150_po2', 'win_lux_140_150_po2',
            'win_lux_150_150_po2', 'win_lux_150_100_po2', 'win_lux_150_190_po2',
            'win_lux_180_190_po2', 'win_lux_180_200_po2'
        ];
        if (NEW_2CHAMBER_WINDOW_IDS.includes(add.id) && !isHouse) return false;

        if (add.id === 'extension_room' && !isHouse) return false;
        if (add.id === 'ceiling_osb_12_lath' && !isHouseHigh) return false;
        if (add.id === 'wall_height_raise_20' && !isHouse) return false;
        if (add.id === 'veranda_lined_rafters' && !isHouseHigh) return false;

        if (add.id === 'frame_upgrade' && state.calculatorMode === 'custom') {
            const isFrame50_100 = state.selCustomInsulation === 'cold' || state.selCustomInsulation === '0' ||
                state.selCustomInsulation === 'frame_100_kd';
            const hasInsulation =
                (state.customType === 'house_high' && !isFrame50_100) ||
                (state.customType === 'house_low' && !isFrame50_100);
            if (isHouse && hasInsulation) return false;
        }

        return true;
    }

    // 5. Calculation Core Engine
    function calculateBill() {
        let basePrice = 0;
        let assemblyPrice = 0;
        let floorSum = 0;
        let insulationSum = 0;
        let selectedFinishName = '';
        let sizeName = '';
        let area = 0;
        let perimeter = 0;

        const model = getActiveModel();
        if (!model) return;

        if (state.calculatorMode === 'custom') {
            // 5.1 Custom Constructor Mode Calculations
            area = state.customLength * state.customWidth;
            perimeter = 2 * (state.customLength + state.customWidth);
            const wallArea = perimeter * state.customHeight;
            let extWallArea = wallArea;
            if (state.customType === 'house_high') {
                extWallArea = perimeter * 3.5;
            } else if (state.customType === 'house_low' || state.customType === 'cabin' || state.customType === 'hozblok') {
                extWallArea = perimeter * 2.5;
            }
            
            sizeName = `${Math.round(state.customLength)}х${Math.round(state.customWidth)}м`;

            // Base rate lookup based on category type selection
            let baseRate = 8000;
            let framePremiumRate = 0; // надбавка за ширину каркаса (50/150, 50/200) — считается от площади дом+веранда отдельно
            if (state.customType === 'house_low') {
                const hlExt = getExteriorHouseLowRecord(state.selCustomExterior);
                const hlNoInsRate = MATERIALS.exterior.houseLow.noInsRate;
                const hlBaseRate = (hlExt && hlExt.mode === 'base') ? hlExt.price : MATERIALS.exterior.houseLow.cheapBaseRate;
                if (state.selCustomInsulation === '0') {
                    baseRate = hlNoInsRate;
                } else if (state.selCustomInsulation === 'frame_100_kd') {
                    baseRate = hlNoInsRate;
                    framePremiumRate = customRates.premium_frame_100_kd || 2000;
                } else if (state.selCustomInsulation === 'frame_150_hk') {
                    baseRate = hlNoInsRate;
                    framePremiumRate = customRates.premium_frame_150_hk || 2500;
                } else if (state.selCustomInsulation === 'frame_200_hk') {
                    baseRate = hlNoInsRate;
                    framePremiumRate = customRates.premium_frame_200_hk || 4000;
                } else if (state.selCustomInsulation === 'frame_150_kd') {
                    baseRate = hlNoInsRate;
                    framePremiumRate = customRates.premium_frame_150_kd || 4500;
                } else if (state.selCustomInsulation === 'frame_200_kd') {
                    baseRate = hlNoInsRate;
                    framePremiumRate = customRates.premium_frame_200_kd || 6000;
                } else {
                    // Реальное утепление: "своя база" материала (Вагонка ВС/Имитация бруса), либо база для
                    // доплатных материалов (Блок-хаус/Профлист/ОСБ) — сама доплата считается отдельно в extCost.
                    baseRate = hlBaseRate;
                }
            } else if (state.customType === 'house_high') {
                const hhExt = getExteriorHouseHighRecord(state.selCustomExterior) || MATERIALS.exterior.houseHigh[0];
                const noInsBaseHigh = hhExt ? hhExt.priceNoIns : 9500;
                if (state.selCustomInsulation === 'cold') {
                    baseRate = noInsBaseHigh;
                } else if (state.selCustomInsulation === 'frame_100_kd') {
                    baseRate = noInsBaseHigh;
                    framePremiumRate = customRates.premium_frame_100_kd || 2000;
                } else if (state.selCustomInsulation === 'frame_150_hk') {
                    baseRate = noInsBaseHigh;
                    framePremiumRate = customRates.premium_frame_150_hk || 2500;
                } else if (state.selCustomInsulation === 'frame_200_hk') {
                    baseRate = noInsBaseHigh;
                    framePremiumRate = customRates.premium_frame_200_hk || 4000;
                } else if (state.selCustomInsulation === 'frame_150_kd') {
                    baseRate = noInsBaseHigh;
                    framePremiumRate = customRates.premium_frame_150_kd || 4500;
                } else if (state.selCustomInsulation === 'frame_200_kd') {
                    baseRate = noInsBaseHigh;
                    framePremiumRate = customRates.premium_frame_200_kd || 6000;
                } else {
                    // Реальное утепление: базовая ставка целиком берётся из выбранной наружной отделки
                    baseRate = hhExt ? hhExt.priceWithIns : 12500;
                }
            } else if (state.customType === 'chalet') {
                // Шале: как и у дома высокого — выбранная наружная отделка целиком задаёт базовую ставку,
                // но без деления на "с утеплением/без" (утепление у Шале одно, базовое, 100мм мин. вата).
                const chExt = getExteriorSimpleRecord(state.selCustomExterior);
                baseRate = chExt ? chExt.price : 14500;
            } else if (state.customType === 'cabin' && state.selCustomInsulation === '0') {
                // Бытовка без утепления — своя, пониженная ставка (не 9000, а отдельное число)
                baseRate = customRates.rate_cabin_no_ins || 7500;
            } else {
                baseRate = customRates[`rate_${state.customType}`] || 8000;
            }

            const baseArea = area;

            // Calculate base price: only high house scales if its height changes,
            // but for low house, cabin, and hozblok the rate is per m2 at their fixed height, so height scaling is 1.
            let heightFactor = 1;
            if (state.customType === 'house_high') {
                heightFactor = Math.round((state.customHeight / 2.4) * 100) / 100;
            }
            basePrice = Math.round(baseArea * baseRate * heightFactor);
            
            // Structure Label
            const structNames = {
                house_high: 'Дом высокий',
                house_low: 'Дом низкий',
                cabin: 'Бытовка',
                hozblok: 'Хозблок'
            };
            selectedFinishName = structNames[state.customType] || 'Бытовка';

            // Veranda is now handled as an addition (доп. опция), no separate verandaCost here

            // Exterior Finish Upgrade (доплата — только для дома низкого с материалом в режиме "Доплата",
            // и для бытовки/хозблока; у дома высокого и у "базовых" материалов дома низкого цена уже в базовой ставке)
            let extCost = 0;
            if (state.customType === 'house_low') {
                const hlExt = getExteriorHouseLowRecord(state.selCustomExterior);
                if (hlExt && hlExt.mode === 'addon') {
                    extCost = extWallArea * hlExt.price;
                } else if (hlExt && hlExt.addonOnTop) {
                    // Особый случай (например "Имитация бруса"): база остаётся как у "своей базы",
                    // но сверху всё равно накидывается доплата за площадь стен.
                    extCost = extWallArea * hlExt.addonOnTop;
                }
            } else if (state.customType === 'cabin' || state.customType === 'hozblok') {
                const simpleExt = getExteriorSimpleRecord(state.selCustomExterior);
                const rate = simpleExt ? (simpleExt.price || 0) : 0;
                extCost = extWallArea * rate;
            }

            // Interior Finish Upgrade (цена берётся из MATERIALS.interior — редактируется в админке)
            let intCost = 0;
            {
                const intRecord = getInteriorRecord(state.selCustomInterior);
                const rate = intRecord ? (intRecord.price || 0) : 0;
                if (rate > 0) {
                    // Дом низкий — по формуле заказчика с двойным членом площади; для остальных категорий — одинарным.
                    const areaTerm = (state.customType === 'house_low') ? (area * 2) : area;
                    const intArea = (state.customLength * 2 * 2.5) + (state.customWidth * 2 * 2.5) + areaTerm;
                    intCost = intArea * rate;
                }
            }
            floorSum += (extCost + intCost); // Group as finish upgrades

            // Floor material Upgrade (цена берётся из MATERIALS.floor — редактируется в админке)
            let floorMatCost = 0;
            {
                const floorRecord = getFloorRecord(state.selCustomFloor);
                const rate = floorRecord ? (floorRecord.price || 0) : 0;
                if (rate > 0) {
                    floorMatCost = (area + getVerandaArea()) * rate;
                    floorSum += floorMatCost;
                }
            }

            // Insulation Upgrade
            if (state.selCustomInsulation === '100') {
                // Уточнённая формула заказчика: стены + 2×площадь (пол+потолок), НЕ 2×периметр
                const insArea = (state.customWidth * 2 * 2.5) + (state.customLength * 2 * 2.5) + area + area;
                insulationSum = insArea * (customRates.rate_ins_100 || 450);
            } else if (state.selCustomInsulation === 'kd_100_real') {
                const insArea = (state.customWidth * 2 * 2.5) + (state.customLength * 2 * 2.5) + area + area;
                // Утепление по обычной формуле + надбавка за каркас "камерная сушка" (площадь дома+веранды)
                insulationSum = insArea * (customRates.rate_ins_100 || 450) + (customRates.premium_frame_100_kd || 2000) * (area + getVerandaArea());
            } else if (state.selCustomInsulation === '100_min_wool') {
                insulationSum = area * (customRates.rate_ins_100_min_wool != null ? customRates.rate_ins_100_min_wool : 550);
            } else if (state.selCustomInsulation === '150') {
                insulationSum = (area + getVerandaArea()) * (customRates.rate_ins_150 || 3700);
            } else if (state.selCustomInsulation === '200') {
                insulationSum = (area + getVerandaArea()) * (customRates.rate_ins_200 || 5600);
            } else if (state.selCustomInsulation === 'kd_150_real') {
                insulationSum = (area + getVerandaArea()) * (customRates.rate_kd_150_real || 5700);
            } else if (state.selCustomInsulation === 'kd_200_real') {
                insulationSum = (area + getVerandaArea()) * (customRates.rate_kd_200_real || 7600);
            } else if (state.selCustomInsulation === 'mix_100') {
                // Утепление MIX: каркас 50/100, баз. плита стены (450 р/м²) + мин. вата пол/потолок (не тарифицируется отдельно) — только площадь стен
                const wallAreaMix = (state.customWidth * 2 * 2.5) + (state.customLength * 2 * 2.5);
                insulationSum = wallAreaMix * (customRates.rate_ins_mix || 450);
            } else if (state.selCustomInsulation === '200_ceiling') {
                insulationSum = area * (customRates.rate_ins_200_ceiling || 1000);
            } else if (state.selCustomInsulation === '200_floor') {
                insulationSum = area * (customRates.rate_ins_200_floor || 1000);
            } else if (framePremiumRate > 0) {
                // Надбавка за ширину/тип каркаса (50/100 КС, 50/150, 50/200 — обычный и КС) без реального утепления:
                // считается от общей площади (дом + веранда) отдельным слагаемым.
                insulationSum = framePremiumRate * (area + getVerandaArea());
            } else {
                insulationSum = 0;
            }

            // Assembly Cost
            if (state.chkCustomAssembly) {
                if (state.customType !== 'house_high' && state.customType !== 'house_low' && state.customType !== 'hozblok') {
                    assemblyPrice = Math.round(area * customRates.rate_assembly);
                } else {
                    assemblyPrice = 0;
                }
            }

        } else {
            // 5.2 Predefined Excel Mode Calculations
            if (!model) return;
            const size = model.sizes.find(s => s.id === state.selectedSizeId);
            const finish = model.finishes[state.selectedFinishIdx];
            if (!size || !finish) return;

            const isCabin = model.name.includes("Бытовка базовая");
            const isCombined = isCabin && size && size.cabinWidth !== undefined;
            
            let calcArea = size.length * size.width;
            let calcPerimeter = 2 * (size.length + size.width);
            if (isCombined) {
                calcArea = size.length * size.cabinWidth;
                calcPerimeter = 2 * (size.length + size.cabinWidth);
            }

            area = size.length * size.width;
            perimeter = 2 * (size.length + size.width);
            sizeName = size.name;
            selectedFinishName = finish.name;

            // Base price lookup
            if (model.name.includes("Дачный дом \"Каркасный\"")) {
                if (finish.name.includes("Вагонка 'ВС'")) {
                    basePrice = area * state.houseTypeRate;
                } else if (finish.name.includes("Имитация бруса")) {
                    const vagankaBase = area * state.houseTypeRate;
                    const wallArea = perimeter * state.houseTypeHeight;
                    basePrice = vagankaBase + wallArea * 250;
                } else {
                    basePrice = finish.prices[size.id] || 0;
                }
            } else if (isCabin && size) {
                let basePriceVagankaOsb = 0;
                if (isCombined) {
                    const cabinModel = activeConfig.find(m => m.name.includes("Бытовка"));
                    const hozblokModel = activeConfig.find(m => m.name.includes("Хозблок"));
                    if (cabinModel && hozblokModel) {
                        const cabinSizeId = `${size.length}x${size.cabinWidth}`;
                        const hozWidth = size.verandaWidth === 1 ? 2 : size.verandaWidth;
                        const hozSizeId = `${size.length}x${hozWidth}`;
                        
                        const cabPrice = cabinModel.finishes[0].prices[cabinSizeId] || 0;
                        let hozPrice = hozblokModel.finishes[0].prices[hozSizeId] || 0;
                        if (size.verandaWidth === 1) hozPrice -= 20000;
                        
                        basePriceVagankaOsb = cabPrice + hozPrice + 10000;
                    }
                } else {
                    basePriceVagankaOsb = model.finishes[0].prices[size.id] || 0;
                }
                
                let extCost = 0;
                let intCost = 0;
                
                if (finish.name.includes("Имитация бруса 'В'")) {
                    extCost = calcPerimeter * 2.5 * 250;
                } else if (finish.name.includes("Профлист С8 цветной")) {
                    extCost = calcPerimeter * 2.5 * 400;
                }
                
                if (finish.name.includes("Вагонка 'ВС' / Вагонка 'ВС'") || finish.name.includes("/ Вагонка 'ВС'")) {
                    intCost = (calcPerimeter * 2.5 + calcArea) * 120;
                }
                
                basePrice = basePriceVagankaOsb + extCost + intCost;
            } else if (model.name.includes("Хозблоки базовая") && size) {
                const basePriceVagankaNone = model.finishes[0].prices[size.id] || 0;
                let extCost = 0;
                
                if (finish.name.includes("Имитация бруса 'В'")) {
                    extCost = perimeter * 2.5 * 250;
                } else if (finish.name.includes("Профлист С8 цветной")) {
                    extCost = perimeter * 2.5 * 400;
                }
                
                basePrice = basePriceVagankaNone + extCost;
            } else {
                basePrice = finish.prices[size.id] || 0;
            }

            // Assembly
            if (state.isAssemblyChecked) {
                if (isCombined) {
                    const cabinModel = activeConfig.find(m => m.name.includes("Бытовка"));
                    const hozblokModel = activeConfig.find(m => m.name.includes("Хозблок"));
                    if (cabinModel && hozblokModel) {
                        const cabinSizeId = `${size.length}x${size.cabinWidth}`;
                        const hozWidth = size.verandaWidth === 1 ? 2 : size.verandaWidth;
                        const hozSizeId = `${size.length}x${hozWidth}`;
                        
                        const cabAsm = cabinModel.finishes[0].assembly[cabinSizeId] || 0;
                        const hozAsm = hozblokModel.finishes[0].assembly[hozSizeId] || 0;
                        
                        assemblyPrice = cabAsm + hozAsm;
                    }
                } else {
                    assemblyPrice = finish.assembly[size.id] || model.assembly?.[size.id] || 0;
                }
            }

            // Floor Options sum
            state.selectedFloorOptionIds.forEach(id => {
                const opt = model.floorOptions.find(o => o.id === id);
                if (opt) floorSum += (opt.prices[size.id] || 0);
            });

            // Insulation sum
            state.selectedInsulationIds.forEach(id => {
                const opt = model.insulation.find(o => o.id === id);
                if (opt) {
                    if (isCombined) {
                        insulationSum += calcArea * 550;
                    } else {
                        insulationSum += (opt.prices[size.id] || 0);
                    }
                }
            });
        }

        // Subtotal (ИТОГО)
        const subtotal = basePrice + assemblyPrice + floorSum + insulationSum;

        // Additions sum
        // Сваи, обвязка, доставка свай, подушки/блоки — отдельная сумма по просьбе заказчика:
        // не входит в базу для скидки 3% / наценки "Сборка" 20%, добавляется к итогу напрямую.
        const SEPARATE_TOTAL_IDS = new Set([
            'pile_76_1500', 'pile_76_2000', 'pile_76_2500', 'pile_76_3000',
            'pile_89_2000', 'pile_89_2500', 'pile_89_3000',
            'pile_108_2000', 'pile_108_2500', 'pile_108_3000',
            'profile_harness', 'pile_delivery', 'block_pads', 'block_20_20_40'
        ]);

        let additionsSum = 0;
        let separateSum = 0;
        const selectedAdditionsText = [];
        const selectedSeparateText = [];
        model.additions.forEach(add => {
            // Скрытая для текущего выбора позиция никогда не должна попадать в сумму,
            // даже если у неё осталось сохранённое количество от другого выбора (например, другого типа дома).
            if (!isAdditionApplicable(add, model)) {
                if (state.additionQuantities[add.id]) {
                    state.additionQuantities[add.id] = 0;
                }
                return;
            }
            const qty = state.additionQuantities[add.id] || 0;
            if (qty > 0) {
                const effectivePrice = (add.id === 'frame_upgrade') ? getFrameUpgradePrice()
                    : (add.id === 'wall_height_raise_20') ? getWallHeightRaisePrice()
                    : (add.id === 'roof_overhangs') ? getSvesyPrice()
                    : add.fromMaterials ? getMaterialsAdditionPrice(add)
                    : add.price;
                let total = qty * effectivePrice;
                // Veranda: qty = depth (м)
                // For cabin/hozblok (veranda_cabin), veranda is along the length.
                // (For houses, the veranda is calculated directly in square meters without multipliers).
                const isVeranda = (add.id === 'veranda_cabin');
                if (isVeranda) {
                    let dimensionVal = 0;
                    const isHouseVeranda = (add.id === 'veranda_high' || add.id === 'veranda_low');
                    if (state.calculatorMode === 'custom') {
                        dimensionVal = isHouseVeranda ? state.customWidth : state.customLength;
                    } else {
                        const sz = model.sizes ? model.sizes.find(s => s.id === state.selectedSizeId) : null;
                        if (sz) {
                            dimensionVal = isHouseVeranda ? sz.width : sz.length;
                        }
                    }
                    total = qty * dimensionVal * effectivePrice;
                } else if (add.id === 'pile_delivery') {
                    total = Math.max(5000, qty * effectivePrice);
                }
                if (SEPARATE_TOTAL_IDS.has(add.id)) {
                    separateSum += total;
                    selectedSeparateText.push({
                        name: add.name,
                        qty: qty,
                        price: effectivePrice,
                        total: total
                    });
                } else {
                    additionsSum += total;
                    selectedAdditionsText.push({
                        name: add.name,
                        qty: qty,
                        price: effectivePrice,
                        total: total
                    });
                }
            }
        });

        const rawTotal = subtotal + additionsSum;

        // Taxes & discounts
        let discountVal = state.isDiscountChecked ? Math.round(rawTotal * 0.03) : 0;
        let vatVal = state.isVatChecked ? Math.round((rawTotal - discountVal) * 0.2) : 0;

        // Delivery
        let deliveryPrice = 0;
        if (state.deliveryDistance > 0) {
            let length = 6;
            let width = 3;
            let isHozblok = false;
            let hasVeranda = false;
            
            if (state.calculatorMode === 'custom') {
                length = state.customLength;
                width = state.customWidth;
                isHozblok = (state.customType === 'hozblok');

                if (state.customType === 'house_high' || state.customType === 'house_low') {
                    // Площадь веранды у домов хранится без точных размеров, поэтому просто
                    // считаем, что при наличии веранды габарит уже точно больше 6х3.
                    hasVeranda = getVerandaArea() > 0;
                } else if (state.customType === 'cabin' || state.customType === 'hozblok') {
                    // У бытовки/хозблока веранда пристраивается по длине на известную глубину —
                    // прибавляем её к длине для точного расчёта габарита.
                    const verandaDepth = state.additionQuantities['veranda_cabin'] || 0;
                    if (verandaDepth > 0) {
                        length = length + verandaDepth;
                    }
                }
            } else {
                const size = model.sizes.find(s => s.id === state.selectedSizeId);
                if (size) {
                    length = size.length;
                    width = size.width;
                }
                isHozblok = model.name.toLowerCase().includes('хозблок');
            }
            
            const minPrice = isHozblok ? 5000 : 7000;
            const kmRate = (length > 6 || width > 3 || hasVeranda) ? 200 : 100;
            
            deliveryPrice = Math.max(minPrice, state.deliveryDistance * kmRate);
        }

        const finalTotal = rawTotal - discountVal + vatVal + deliveryPrice + separateSum;

        // Save to state for buildReportText() to consume
        state.basePrice = basePrice;
        state.assemblyPrice = assemblyPrice;
        state.floorSum = floorSum;
        state.insulationSum = insulationSum;
        state.additionsSum = additionsSum;
        state.separateSum = separateSum;
        state.selectedSeparateText = selectedSeparateText;
        state.deliveryPrice = deliveryPrice;
        state.discountVal = discountVal;
        state.vatVal = vatVal;
        state.finalTotal = finalTotal;
        state.selectedAdditionsText = selectedAdditionsText;
        state.calculatedArea = area;
        state.calculatedPerimeter = perimeter;
        state.calculatedSizeName = sizeName;
        state.calculatedStructName = selectedFinishName;

        // Update UI
        totalPriceText.textContent = `${finalTotal.toLocaleString('ru-RU')} руб.`;

        // Render Summary Sidebar Invoice
        invoiceSummary.innerHTML = `
            <div class="summary-item">
                <div>Режим расчета:</div>
                <div style="font-weight:700; color:var(--primary);">
                    ${state.calculatorMode === 'custom' ? '📐 Индивидуальный' : '📋 Стандартный'}
                </div>
            </div>
            <div class="summary-item">
                <div>Конструкция:</div>
                <div style="font-weight:600;">${selectedFinishName}</div>
            </div>
            <div class="summary-item">
                <div>Размеры:</div>
                <div style="font-weight:600;">${sizeName} (${area.toFixed(1)} м²)</div>
            </div>
            <div class="summary-item">
                <div>Базовая стоимость:</div>
                <div>${basePrice.toLocaleString('ru-RU')} р.</div>
            </div>
            ${assemblyPrice > 0 ? `
            <div class="summary-item">
                <div>Сборка на участке:</div>
                <div>${assemblyPrice.toLocaleString('ru-RU')} р.</div>
            </div>` : ''}
            ${floorSum > 0 ? `
            <div class="summary-item">
                <div>Материалы и отделка:</div>
                <div>${floorSum.toLocaleString('ru-RU')} р.</div>
            </div>` : ''}
            ${insulationSum > 0 ? `
            <div class="summary-item">
                <div>Опции утепления:</div>
                <div>${insulationSum.toLocaleString('ru-RU')} р.</div>
            </div>` : ''}
            <div class="summary-item bold" style="margin-top: 5px; padding-top: 5px; border-top: 1px solid var(--border-color);">
                <div>Промежуточный итог:</div>
                <div>${subtotal.toLocaleString('ru-RU')} р.</div>
            </div>
            ${additionsSum > 0 ? `
            <div class="summary-item bold" style="color:var(--primary); margin-top:5px;">
                <div>Доп. опции (${selectedAdditionsText.length} шт):</div>
                <div>${additionsSum.toLocaleString('ru-RU')} р.</div>
            </div>
            <div style="font-size:11px; color:var(--text-muted); padding-left: 10px; max-height:100px; overflow-y:auto; margin-bottom:5px;">
                ${selectedAdditionsText.map(item => `• ${item.name} (${item.qty} шт) - ${item.total.toLocaleString('ru-RU')} р.<br>`).join('')}
            </div>` : ''}
            
            <div class="summary-item" style="margin-top: 5px; padding-top: 5px; border-top: 1px dashed var(--border-color);">
                <div style="display:flex; align-items:center; gap:5px;">
                    <input type="checkbox" id="chkDiscount" ${state.isDiscountChecked ? 'checked' : ''}>
                    <label for="chkDiscount" style="cursor:pointer;">Скидка 3%:</label>
                </div>
                <div class="discount" style="font-weight:600;">${state.isDiscountChecked ? '-' + discountVal.toLocaleString('ru-RU') + ' р.' : '0 р.'}</div>
            </div>

            <div class="summary-item">
                <div style="display:flex; align-items:center; gap:5px;">
                    <input type="checkbox" id="chkVat" ${state.isVatChecked ? 'checked' : ''}>
                    <label for="chkVat" style="cursor:pointer;">Сборка 20%:</label>
                </div>
                <div class="vat" style="font-weight:600;">${state.isVatChecked ? '+' + vatVal.toLocaleString('ru-RU') + ' р.' : '0 р.'}</div>
            </div>

            <div class="summary-item" style="margin-bottom: 5px;">
                <div>Доставка (${state.deliveryDistance} км):</div>
                <div style="font-weight:600;">${deliveryPrice > 0 ? deliveryPrice.toLocaleString('ru-RU') + ' р.' : 'Самовывоз / 0 р.'}</div>
            </div>
            ${separateSum > 0 ? `
            <div class="summary-item bold" style="margin-top: 5px; padding-top: 5px; border-top: 1px dashed var(--border-color); color:var(--primary);">
                <div>Сваи/блоки/доставка свай (${selectedSeparateText.length} шт):</div>
                <div>${separateSum.toLocaleString('ru-RU')} р.</div>
            </div>
            <div style="font-size:11px; color:var(--text-muted); padding-left: 10px; max-height:100px; overflow-y:auto; margin-bottom:5px;">
                ${selectedSeparateText.map(item => `• ${item.name} (${item.qty} шт) - ${item.total.toLocaleString('ru-RU')} р.<br>`).join('')}
                <i>Без скидки 3% и наценки "Сборка" — прибавляется к итогу напрямую</i>
            </div>` : ''}
        `;

        // Event hooks for sidepanel calculations toggles
        document.getElementById('chkDiscount').addEventListener('change', (e) => {
            state.isDiscountChecked = e.target.checked;
            calculateBill();
        });
        document.getElementById('chkVat').addEventListener('change', (e) => {
            state.isVatChecked = e.target.checked;
            calculateBill();
        });
    }

    // 6. Text-based formatted сметы generator
    // 6. Text-based formatted сметы generator
    function buildReportText() {
        const area = state.calculatedArea || 0;
        const sizeName = state.calculatedSizeName || '';
        const structName = state.calculatedStructName || '';
        
        let text = `📄 РАСЧЕТ СТОИМОСТИ СТРОИТЕЛЬСТВА\n`;
        text += `------------------------------------\n`;
        text += `🏠 Конструкция: ${structName}\n`;
        text += `📐 Размеры: ${sizeName} (${area.toFixed(1)} кв.м)\n`;
        
        if (state.calculatorMode === 'custom') {
            text += `🧱 Материалы отделки:\n`;
            
            const extNames = {
                none: state.customType === 'house_high' ? 'Вагонка класса ВС' : 'Вагонка класса ВС',
                osb: 'ОСБ 12 мм',
                lining_a: 'Вагонка класса А',
                imitation_a: state.customType === 'house_high' ? 'Имитация бруса класса В' : 'Имитация бруса класса А',
                blockhouse: 'Блок-хаус',
                proflist: 'Профлист цветной',
                imitation: 'Имитация бруса'
            };
            const intNames = {
                none: state.customType === 'hozblok' ? 'Без отделки' : (state.customType === 'house_high' ? 'Вагонка класса ВС' : 'ДВП'),
                osb: 'ОСБ 9 мм',
                lining: 'Вагонка "ВС"',
                mdf: 'МДФ панели',
                pvc: 'ПВХ панели',
                imitation: 'Имитация бруса "В"'
            };
            function getExteriorRecordForText() {
                if (state.customType === 'house_high') return getExteriorHouseHighRecord(state.selCustomExterior);
                if (state.customType === 'house_low') return getExteriorHouseLowRecord(state.selCustomExterior);
                if (state.customType === 'cabin' || state.customType === 'hozblok') return getExteriorSimpleRecord(state.selCustomExterior);
                return null;
            }
            const extRecForText = getExteriorRecordForText();
            text += `  - Снаружи: ${extRecForText ? extRecForText.name : 'Базовая'}\n`;
            const intRecForText = getInteriorRecord(state.selCustomInterior);
            text += `  - Внутри: ${intRecForText ? intRecForText.name : 'Базовая'}\n`;
            const floorRecForText = getFloorRecord(state.selCustomFloor);
            text += `  - Пол: ${floorRecForText ? floorRecForText.name : 'Базовая'}\n`;
            let insText = '';
            if (state.selCustomInsulation === 'cold') {
                insText = 'Холодный контур';
            } else if (state.selCustomInsulation === '0') {
                insText = 'Без утепления';
            } else if (state.selCustomInsulation === '100_base') {
                insText = '100 мм базальтовая плита (базовая)';
            } else if (state.selCustomInsulation === '50_min_wool') {
                insText = '50 мм мин. вата (базовая)';
            } else if (state.selCustomInsulation === '100_min_wool') {
                insText = '100 мм мин. вата';
            } else if (state.selCustomInsulation === '100_base_min') {
                insText = '100 мм мин. вата (в базовой)';
            } else {
                insText = state.selCustomInsulation + ' мм базальтовая плита';
            }
            text += `  - Утепление: ${insText}\n`;
            
            // Veranda is now in доп. опции — listed in selectedAdditionsText below
        }

        text += `------------------------------------\n`;

        const basePrice = state.basePrice || 0;
        const assemblyPrice = state.assemblyPrice || 0;
        const floorSum = state.floorSum || 0;
        const insulationSum = state.insulationSum || 0;
        const additionsSum = state.additionsSum || 0;
        const deliveryPrice = state.deliveryPrice || 0;
        const discountVal = state.discountVal || 0;
        const vatVal = state.vatVal || 0;
        const finalTotal = state.finalTotal || 0;

        text += `• База: ${basePrice.toLocaleString('ru-RU')} руб.\n`;
        if (assemblyPrice > 0) text += `• Сборка: ${assemblyPrice.toLocaleString('ru-RU')} руб.\n`;
        if (floorSum > 0) text += `• Отделка и полы: ${floorSum.toLocaleString('ru-RU')} руб.\n`;
        if (insulationSum > 0) text += `• Утепление: ${insulationSum.toLocaleString('ru-RU')} руб.\n`;

        // Additions loop
        if (state.selectedAdditionsText && state.selectedAdditionsText.length > 0) {
            text += `➕ Доп. опции:\n`;
            state.selectedAdditionsText.forEach(item => {
                text += `  - ${item.name}: ${item.qty} шт. (${item.total.toLocaleString('ru-RU')} руб.)\n`;
            });
        }

        // Delivery
        if (deliveryPrice > 0) {
            text += `🚚 Доставка (${state.deliveryDistance} км): ${deliveryPrice.toLocaleString('ru-RU')} руб.\n`;
        } else {
            text += `🚚 Доставка: Самовывоз (0 руб.)\n`;
        }

        if (state.isDiscountChecked) {
            text += `🏷️ Скидка 3%: -${discountVal.toLocaleString('ru-RU')} руб.\n`;
        }
        if (state.isVatChecked) {
            text += `🛠️ Сборка 20%: +${vatVal.toLocaleString('ru-RU')} руб.\n`;
        }

        // Separate group: сваи, обвязка, доставка свай, подушки/блоки — без скидки/наценки
        if (state.selectedSeparateText && state.selectedSeparateText.length > 0) {
            text += `🔩 Сваи/блоки/доставка свай (отдельно, без скидки и наценки):\n`;
            state.selectedSeparateText.forEach(item => {
                text += `  - ${item.name}: ${item.qty} шт. (${item.total.toLocaleString('ru-RU')} руб.)\n`;
            });
            text += `  Итого по этой группе: ${(state.separateSum || 0).toLocaleString('ru-RU')} руб.\n`;
        }

        text += `------------------------------------\n`;
        text += `💰 ИТОГО К ОПЛАТЕ: ${finalTotal.toLocaleString('ru-RU')} руб.\n`;
        text += `------------------------------------\n`;
        text += `Расчет выполнен в калькуляторе Моби Строй`;

        return text;
    }

    // 7. Admin Editor Form Renderer
    function renderAdminForm() {
        adminFormFields.innerHTML = '';
        
        if (state.calculatorMode === 'custom') {
            // Render rates editor for Custom Mode
            adminFormFields.innerHTML = `<h3>Редактирование тарифов конструктора (руб. за м²)</h3>`;
            
            const fields = [
                { label: 'Тариф за Бытовку (м² по полу)', key: 'rate_cabin', val: customRates.rate_cabin },
                { label: 'Тариф за Хозблок (м² по полу)', key: 'rate_hozblok', val: customRates.rate_hozblok },
                { label: 'Тариф за Блок-контейнер (м² по полу)', key: 'rate_container', val: customRates.rate_container },
                { label: 'Утепление 200 мм потолок (м²)', key: 'rate_ins_200_ceiling', val: customRates.rate_ins_200_ceiling || 1000 },
                { label: 'Утепление 200 мм пол (м²)', key: 'rate_ins_200_floor', val: customRates.rate_ins_200_floor || 1000 },
                { label: 'Стоимость сборки (м² пола)', key: 'rate_assembly', val: customRates.rate_assembly },
                { label: 'Доставка: Базовая дистанция (км)', key: 'delivery_base_dist', val: customRates.delivery_base_dist },
                { label: 'Доставка: Минимальная цена (руб)', key: 'delivery_base_price', val: customRates.delivery_base_price },
                { label: 'Доставка: Цена за 1 км (руб)', key: 'delivery_price_km', val: customRates.delivery_price_km }
            ];

            fields.forEach(field => {
                const row = document.createElement('div');
                row.className = 'edit-row';
                row.innerHTML = `
                    <label>${field.label}</label>
                    <input type="number" class="admin-input-rate" data-key="${field.key}" value="${field.val}">
                `;
                adminFormFields.appendChild(row);
            });

            // Edit additions prices in Custom Mode
            const model = getActiveModel();
            if (model && model.additions && model.additions.length > 0) {
                const titleAdds = document.createElement('h4');
                titleAdds.textContent = `Стоимость дополнительных опций (руб/ед.):`;
                titleAdds.style.margin = '15px 0 5px';
                adminFormFields.appendChild(titleAdds);

                model.additions.forEach(add => {
                    const row = document.createElement('div');
                    row.className = 'edit-row';
                    row.innerHTML = `
                        <label>${add.name}</label>
                        <input type="number" class="admin-input-add" data-add-id="${add.id}" value="${add.price}">
                    `;
                    adminFormFields.appendChild(row);
                });
            }
        } else {
            // Render rates editor for Standard Sheets Mode
            const model = getActiveModel();
            if (!model) return;

            adminFormFields.innerHTML = `<h3>Редактирование цен для листа: ${model.name}</h3>`;
            const size = model.sizes.find(s => s.id === state.selectedSizeId);
            
            if (size) {
                const title = document.createElement('h4');
                title.textContent = `Базовые цены для размера ${size.name}:`;
                title.style.margin = '10px 0';
                adminFormFields.appendChild(title);

                model.finishes.forEach((fin, idx) => {
                    const price = fin.prices[size.id] || 0;
                    const row = document.createElement('div');
                    row.className = 'edit-row';
                    row.innerHTML = `
                        <label>${fin.name}</label>
                        <input type="number" class="admin-input-fin" data-fin-idx="${idx}" value="${price}">
                    `;
                    adminFormFields.appendChild(row);
                });

                const titleAsm = document.createElement('h4');
                titleAsm.textContent = `Сборка для размера ${size.name}:`;
                titleAsm.style.margin = '15px 0 5px';
                adminFormFields.appendChild(titleAsm);

                model.finishes.forEach((fin, idx) => {
                    const price = fin.assembly[size.id] || 0;
                    const row = document.createElement('div');
                    row.className = 'edit-row';
                    row.innerHTML = `
                        <label>Сборка: ${fin.name}</label>
                        <input type="number" class="admin-input-asm" data-fin-idx="${idx}" value="${price}">
                    `;
                    adminFormFields.appendChild(row);
                });
            }

            // Edit additions prices in standard sheet mode
            if (model.additions && model.additions.length > 0) {
                const titleAdds = document.createElement('h4');
                titleAdds.textContent = `Стоимость дополнительных опций (руб/ед.):`;
                titleAdds.style.margin = '15px 0 5px';
                adminFormFields.appendChild(titleAdds);

                model.additions.forEach(add => {
                    const row = document.createElement('div');
                    row.className = 'edit-row';
                    row.innerHTML = `
                        <label>${add.name}</label>
                        <input type="number" class="admin-input-add" data-add-id="${add.id}" value="${add.price}">
                    `;
                    adminFormFields.appendChild(row);
                });
            }
        }
    }

    function saveAdminForm() {
        if (state.calculatorMode === 'custom') {
            const inputs = adminFormFields.querySelectorAll('.admin-input-rate');
            inputs.forEach(input => {
                const key = input.getAttribute('data-key');
                const val = parseInt(input.value) || 0;
                customRates[key] = val;
            });
            localStorage.setItem('mobistroy_custom_rates', JSON.stringify(customRates));

            // Save additions in Custom Mode as well
            const model = getActiveModel();
            if (model) {
                const addInputs = adminFormFields.querySelectorAll('.admin-input-add');
                addInputs.forEach(input => {
                    const id = input.getAttribute('data-add-id');
                    const val = parseInt(input.value) || 0;
                    const add = model.additions.find(a => a.id === id);
                    if (add) add.price = val;
                });
                localStorage.setItem('mobistroy_config', JSON.stringify(activeConfig));
            }
        } else {
            const model = getActiveModel();
            if (!model) return;
            const size = model.sizes.find(s => s.id === state.selectedSizeId);

            // Save finishes prices
            const finInputs = adminFormFields.querySelectorAll('.admin-input-fin');
            finInputs.forEach(input => {
                const idx = parseInt(input.getAttribute('data-fin-idx'));
                const val = parseInt(input.value) || 0;
                if (size && model.finishes[idx]) {
                    model.finishes[idx].prices[size.id] = val;
                }
            });

            // Save assembly prices
            const asmInputs = adminFormFields.querySelectorAll('.admin-input-asm');
            asmInputs.forEach(input => {
                const idx = parseInt(input.getAttribute('data-fin-idx'));
                const val = parseInt(input.value) || 0;
                if (size && model.finishes[idx]) {
                    model.finishes[idx].assembly[size.id] = val;
                }
            });

            // Save additions
            const addInputs = adminFormFields.querySelectorAll('.admin-input-add');
            addInputs.forEach(input => {
                const id = input.getAttribute('data-add-id');
                const val = parseInt(input.value) || 0;
                const add = model.additions.find(a => a.id === id);
                if (add) add.price = val;
            });

            localStorage.setItem('mobistroy_config', JSON.stringify(activeConfig));
        }

        alert("Цены успешно сохранены!");
        adminModal.style.display = 'none';
        renderModelUI();
    }

    // 8. Event Controllers Hooks
    
    // Sliders hooks in Custom Constructor Mode
    customLengthSlider.addEventListener('input', (e) => {
        state.customLength = parseInt(e.target.value, 10) || 2;
        renderModelUI();
    });

    customWidthSlider.addEventListener('input', (e) => {
        state.customWidth = parseInt(e.target.value, 10) || 2;
        renderModelUI();
    });

    customHeightSlider.addEventListener('input', (e) => {
        state.customHeight = parseFloat(e.target.value) || 2;
        renderModelUI();
    });

    // --- Веранда: обработчики ---
    chkVerandaEnabled.addEventListener('change', (e) => {
        state.verandaEnabled = e.target.checked;
        verandaParamsWrap.style.display = state.verandaEnabled ? 'flex' : 'none';
        if (state.verandaEnabled) {
            // Значения по умолчанию — как в разделе "Параметры строения"
            state.verandaLength = state.customLength;
            state.verandaWidth = state.customWidth;
            state.verandaHeight = state.customHeight;
            verandaLengthSlider.value = state.verandaLength;
            verandaWidthSlider.value = state.verandaWidth;
            verandaHeightSlider.value = state.verandaHeight;
            lblVerandaLength.textContent = `${state.verandaLength.toFixed(1)} м`;
            lblVerandaWidth.textContent = `${state.verandaWidth.toFixed(1)} м`;
            lblVerandaHeight.textContent = `${state.verandaHeight.toFixed(1)} м`;
        }
        syncVerandaToAdditions();
        updateVerandaSummary();
        renderModelUI();
    });

    verandaLengthSlider.addEventListener('input', (e) => {
        state.verandaLength = parseFloat(e.target.value) || 1;
        lblVerandaLength.textContent = `${state.verandaLength.toFixed(1)} м`;
        syncVerandaToAdditions();
        updateVerandaSummary();
        renderModelUI();
    });

    verandaWidthSlider.addEventListener('input', (e) => {
        state.verandaWidth = parseFloat(e.target.value) || 1;
        lblVerandaWidth.textContent = `${state.verandaWidth.toFixed(1)} м`;
        syncVerandaToAdditions();
        updateVerandaSummary();
        renderModelUI();
    });

    verandaHeightSlider.addEventListener('input', (e) => {
        state.verandaHeight = parseFloat(e.target.value) || 2;
        lblVerandaHeight.textContent = `${state.verandaHeight.toFixed(1)} м`;
        updateVerandaSummary();
        // Высота веранды пока не влияет на цену напрямую — сохраняется в state.verandaHeight про запас, для будущих формул.
    });

    verandaAttachSelector.querySelectorAll('.selector-card').forEach(card => {
        card.addEventListener('click', () => {
            verandaAttachSelector.querySelectorAll('.selector-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.verandaAttachSide = card.getAttribute('data-side');
            updateVerandaSummary();
        });
    });

    // Custom Selects updates
    [selCustomExterior, selCustomInterior, selCustomFloor, selCustomInsulation].forEach(el => {
        el.addEventListener('change', (e) => {
            state[el.id] = e.target.value;
            renderAdditions();
            calculateBill();
        });
    });

    chkCustomAssembly.addEventListener('change', (e) => {
        state.chkCustomAssembly = e.target.checked;
        calculateBill();
    });

    // Custom Mode structure selector cards
    document.querySelectorAll('#customTypeSelector .selector-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('#customTypeSelector .selector-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.customType = card.getAttribute('data-type');
            
            // Auto default height based on type
            if (state.customType === 'house_high') {
                state.customHeight = 2.4;
                customHeightSlider.value = 2.4;
            } else if (state.customType === 'house_low') {
                state.customHeight = 2.2;
                customHeightSlider.value = 2.2;
            } else if (state.customType === 'cabin' || state.customType === 'hozblok') {
                state.customHeight = 2.0;
                customHeightSlider.value = 2.0;
            } else if (state.customType === 'chalet') {
                state.customHeight = 2.4;
                customHeightSlider.value = 2.4;
            } else {
                state.customHeight = 2.1;
                customHeightSlider.value = 2.1;
            }

            renderModelUI();
        });
    });

    // Theme Switcher Toggle
    themeToggleBtn.addEventListener('click', () => {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', nextTheme);
    });

    // Admin Toggle Dialog
    adminToggleBtn.addEventListener('click', () => {
        renderAdminForm();
        adminModal.style.display = 'flex';
    });

    closeAdminBtn.addEventListener('click', () => {
        adminModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
        }
    });

    btnSaveConfig.addEventListener('click', saveAdminForm);

    btnResetConfig.addEventListener('click', () => {
        if (confirm("Вы хотите сбросить ВСЕ цены к заводским?")) {
            if (state.calculatorMode === 'custom') {
                localStorage.removeItem('mobistroy_custom_rates');
                customRates = {
                    rate_house_high: 12500,
                    rate_house_low_osb: 9500,
                    rate_house_low_lining: 10000,
                    rate_cabin: 9000,
                    rate_cabin_no_ins: 7500,
                    rate_int_cabin_lining: 120,
                    rate_int_cabin_imitation: 370,
                    rate_hozblok: 7500,
                    rate_container: 9000,
                    rate_veranda: 9000,
                    rate_ext_imitation: 250,
                    rate_ext_blockhouse: 1000,
                    rate_ext_proflist: 400,
                    rate_ext_osb: 300,
                    rate_int_osb: 300,
                    rate_int_lining: 400,
                    rate_int_mdf: 500,
                    rate_int_pvc: 500,
                    rate_ins_100: 450,
                    rate_ins_100_min_wool: 0,
                    rate_ins_150: 3700,
                    rate_ins_200: 5600,
                    rate_ins_mix: 450,
                    premium_frame_150_hk: 2500,
                    premium_frame_200_hk: 4000,
                    premium_frame_100_kd: 2000,
                    premium_frame_150_kd: 4500,
                    premium_frame_200_kd: 6000,
                    rate_kd_150_real: 5700,
                    rate_kd_200_real: 7600,
                    price_frame_upgrade_normal: 2000,
                    price_frame_upgrade_no_ins: 2500,
                    price_wall_raise_100: 700,
                    price_wall_raise_150: 1000,
                    price_wall_raise_200: 1400,
                    rate_svesy: 1000,
                    rate_ins_200_ceiling: 1000,
                    rate_ins_200_floor: 1000,
                    rate_floor_osb12: 500,
                    rate_floor_osb15: 700,
                    rate_floor_osb18: 800,
                    rate_floor_tongue28: 1000,
                    rate_floor_tongue35: 1300,
                    rate_floor_tongue36: 1250,
                    rate_assembly: 1000,
                    delivery_base_dist: 0,
                    delivery_base_price: 7000,
                    delivery_price_km: 200
                };
            } else {
                localStorage.removeItem('mobistroy_config');
            }
            loadConfig();
            applyAdditionsMaterials();
            adminModal.style.display = 'none';
            alert("Цены успешно сброшены.");
            renderTabs();
            renderModelUI();
        }
    });

    btnResetCache.addEventListener('click', () => {
        if (confirm("Вы хотите сбросить локальный кэш калькулятора и перезагрузить страницу? Это загрузит новые цены с сервера.")) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        }
    });

    // Export config files (Admin download config.js)
    btnExportConfig.addEventListener('click', () => {
        let jsContent = '';
        if (state.calculatorMode === 'custom') {
            jsContent = `// Скопируйте и вставьте в config.js на замену:\n// window.CUSTOM_RATES = ${JSON.stringify(customRates, null, 2)};`;
        } else {
            jsContent = `window.DEFAULT_CONFIG = ${JSON.stringify(activeConfig, null, 2)};`;
        }
        const blob = new Blob([jsContent], { type: 'text/javascript;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.js';
        a.click();
        URL.revokeObjectURL(url);
    });

    // ==================== Панель "Материалы" (внутренняя отделка + доп.опции) ====================
    const materialsToggleBtn = document.getElementById('materialsToggleBtn');
    const materialsModal = document.getElementById('materialsModal');
    const materialsModalTitle = document.getElementById('materialsModalTitle');
    const closeMaterialsBtn = document.getElementById('closeMaterialsBtn');
    const matCategoryFilter = document.getElementById('matCategoryFilter');
    const matGroupFilter = document.getElementById('matGroupFilter');
    const matList = document.getElementById('matList');
    const matAddForm = document.getElementById('matAddForm');
    const btnMatAddNew = document.getElementById('btnMatAddNew');
    const btnMatDownload = document.getElementById('btnMatDownload');
    const btnMatResetDrafts = document.getElementById('btnMatResetDrafts');

    let matActiveTab = 'interior'; // 'interior' | 'additions'
    let matEditingId = null; // null = добавление новой записи, иначе — id редактируемой

    const ALL_CATEGORIES = [
        { id: 'house_high', label: 'Дом высокий' },
        { id: 'house_low', label: 'Дом низкий' },
        { id: 'cabin', label: 'Бытовка' },
        { id: 'hozblok', label: 'Хозблок' },
        { id: 'chalet', label: 'Шале' }
    ];
    const ALL_GROUPS = [
        { id: 'windows', label: 'Окна' },
        { id: 'doors', label: 'Двери' },
        { id: 'area', label: 'Отделка и полы' },
        { id: 'piles', label: 'Сваи' },
        { id: 'other', label: 'Прочее' }
    ];
    const ALL_HINTS = [
        { id: 'none', label: 'Без подсказки' },
        { id: 'houseArea', label: 'Площадь дома' },
        { id: 'houseAndVeranda', label: 'Площадь дома + веранда' },
        { id: 'verandaOnly', label: 'Только площадь веранды' },
        { id: 'perimeter', label: 'Периметр дома' },
        { id: 'perimeterAndVeranda', label: 'Периметр дома + веранда' }
    ];

    function getMatArray() {
        if (matActiveTab === 'interior') return MATERIALS.interior;
        if (matActiveTab === 'floor') return MATERIALS.floor;
        if (matActiveTab === 'exterior') return MATERIALS.exterior.simple; // используется только для Бытовки/Хозблока
        return MATERIALS.additions;
    }

    function priceLabel(r) {
        if (matActiveTab === 'interior' || matActiveTab === 'floor') {
            return r.price > 0 ? r.price.toLocaleString('ru-RU') + ' р/м²' : 'без доплаты (базовая)';
        }
        const unitLabel = r.unit === 'area' ? 'р/м²' : 'р/шт';
        if (r.pricesByCategory && Object.keys(r.pricesByCategory).length > 0) {
            const parts = ALL_CATEGORIES
                .filter(c => r.pricesByCategory[c.id] != null)
                .map(c => `${c.label}: ${r.pricesByCategory[c.id].toLocaleString('ru-RU')} ${unitLabel}`);
            return parts.join(' · ');
        }
        return r.price.toLocaleString('ru-RU') + ' ' + unitLabel;
    }

    function renderMatList() {
        if (matActiveTab === 'exterior') { renderExteriorPanel(); return; }
        if (matActiveTab === 'insulation') { renderInsulationPanel(); return; }
        const cat = matCategoryFilter.value;
        let items = getMatArray().filter(r => r.categories.includes(cat));
        if (matActiveTab === 'additions') {
            items = items.filter(r => r.group === matGroupFilter.value);
        }
        if (items.length === 0) {
            matList.innerHTML = `<p style="color:var(--text-muted); font-size:13px;">Пока нет позиций для этого фильтра.</p>`;
            return;
        }
        matList.innerHTML = items.map(r => `
            <div class="option-row" style="justify-content: space-between;" data-mat-id="${r.id}">
                <div>
                    <div style="font-weight:600;">${r.name}</div>
                    <div style="font-size:12px; color:var(--text-muted);">${priceLabel(r)}</div>
                </div>
                <div style="display:flex; gap:6px;">
                    <button class="btn btn-secondary mat-edit-btn" style="padding:4px 10px; font-size:12px;">Изменить</button>
                    <button class="btn btn-secondary mat-del-btn" style="padding:4px 10px; font-size:12px; border-color:#e74c3c; color:#e74c3c;">Удалить</button>
                </div>
            </div>
        `).join('');

        matList.querySelectorAll('.mat-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('[data-mat-id]').getAttribute('data-mat-id');
                openMatForm(id);
            });
        });
        matList.querySelectorAll('.mat-del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('[data-mat-id]').getAttribute('data-mat-id');
                const rec = getMatArray().find(r => r.id === id);
                if (rec && confirm(`Удалить позицию "${rec.name}"?`)) {
                    if (matActiveTab === 'interior') {
                        MATERIALS.interior = MATERIALS.interior.filter(r => r.id !== id);
                    } else if (matActiveTab === 'floor') {
                        MATERIALS.floor = MATERIALS.floor.filter(r => r.id !== id);
                    } else {
                        MATERIALS.additions = MATERIALS.additions.filter(r => r.id !== id);
                    }
                    saveMaterialsDraft();
                    if (matActiveTab === 'additions') applyAdditionsMaterials();
                    renderMatList();
                    renderModelUI();
                }
            });
        });
    }

    function renderExteriorPanel() {
        const cat = matCategoryFilter.value;
        btnMatAddNew.style.display = (cat === 'house_high' || cat === 'house_low') ? 'none' : 'inline-flex';

        if (cat === 'house_high') {
            matList.innerHTML = `
                <div style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">
                    Каждая строка — своя базовая ставка (полностью заменяет цену дома). Два числа: без утепления и с утеплением.
                </div>
                <div style="display:flex; align-items:center; gap:8px; padding:0 15px; margin-bottom:4px;">
                    <div style="flex:1; font-size:11px; color:var(--text-muted);">Отделка</div>
                    <div style="width:90px; font-size:11px; color:var(--text-muted); text-align:center;">Без утепления</div>
                    <div style="width:90px; font-size:11px; color:var(--text-muted); text-align:center;">С утеплением</div>
                    <div style="width:34px;"></div>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    ${MATERIALS.exterior.houseHigh.map((r, i) => `
                        <div class="option-row" style="flex-wrap:nowrap; gap:8px;" data-hh-idx="${i}">
                            <input type="text" class="hh-name" value="${r.name.replace(/"/g, '&quot;')}"
                                style="flex:1; min-width:0; padding:8px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card); font-weight:500;">
                            <input type="number" class="hh-no-ins" value="${r.priceNoIns}" style="width:90px; flex-shrink:0; padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card); text-align:center;">
                            <input type="number" class="hh-with-ins" value="${r.priceWithIns}" style="width:90px; flex-shrink:0; padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card); text-align:center;">
                            <button class="btn btn-secondary hh-del" style="flex-shrink:0; width:34px; padding:6px 0; font-size:12px; border-color:#e74c3c; color:#e74c3c; justify-content:center;">✕</button>
                        </div>
                    `).join('')}
                </div>
                <div style="display:flex; gap:8px; margin-top:14px;">
                    <button class="btn btn-secondary" id="btnHhAddRow" style="font-size:12px;">+ Добавить строку</button>
                    <button class="btn btn-primary" id="btnHhSave" style="font-size:12px;">Сохранить</button>
                </div>
            `;
            document.getElementById('btnHhAddRow').addEventListener('click', () => {
                MATERIALS.exterior.houseHigh.push({ id: 'ext_hh_custom_' + Date.now(), name: 'Новая отделка', priceNoIns: 0, priceWithIns: 0 });
                renderExteriorPanel();
            });
            matList.querySelectorAll('.hh-del').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.closest('[data-hh-idx]').getAttribute('data-hh-idx'));
                    if (MATERIALS.exterior.houseHigh.length <= 1) { alert('Должна остаться хотя бы одна позиция.'); return; }
                    if (confirm('Удалить эту отделку?')) { MATERIALS.exterior.houseHigh.splice(idx, 1); renderExteriorPanel(); }
                });
            });
            document.getElementById('btnHhSave').addEventListener('click', () => {
                matList.querySelectorAll('[data-hh-idx]').forEach(row => {
                    const idx = parseInt(row.getAttribute('data-hh-idx'));
                    MATERIALS.exterior.houseHigh[idx].name = row.querySelector('.hh-name').value.trim() || 'Отделка';
                    MATERIALS.exterior.houseHigh[idx].priceNoIns = parseFloat(row.querySelector('.hh-no-ins').value) || 0;
                    MATERIALS.exterior.houseHigh[idx].priceWithIns = parseFloat(row.querySelector('.hh-with-ins').value) || 0;
                });
                saveMaterialsDraft();
                renderModelUI();
                alert('Сохранено.');
            });

        } else if (cat === 'house_low') {
            const hl = MATERIALS.exterior.houseLow;
            matList.innerHTML = `
                <div class="option-row" style="flex-wrap:wrap; gap:14px; margin-bottom:12px;">
                    <div style="display:flex; flex-direction:column; gap:2px; flex:1 1 160px;">
                        <label style="font-size:11px; color:var(--text-muted);">Ставка без утепления (не зависит от отделки)</label>
                        <input type="number" id="hlNoInsRate" value="${hl.noInsRate}" style="padding:8px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card);">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:2px; flex:1 1 160px;">
                        <label style="font-size:11px; color:var(--text-muted);">База для доплатных материалов</label>
                        <input type="number" id="hlCheapBaseRate" value="${hl.cheapBaseRate}" style="padding:8px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card);">
                    </div>
                </div>
                <div style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">
                    «Своя база» — заменяет всю ставку дома. «Доплата» — добавляется к базе для доплатных материалов сверху, за площадь стен.
                </div>
                <div style="display:flex; align-items:center; gap:8px; padding:0 15px; margin-bottom:4px;">
                    <div style="flex:1; font-size:11px; color:var(--text-muted);">Материал</div>
                    <div style="width:110px; font-size:11px; color:var(--text-muted); text-align:center;">Режим</div>
                    <div style="width:90px; font-size:11px; color:var(--text-muted); text-align:center;">Цена</div>
                    <div style="width:34px;"></div>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    ${hl.materials.map((r, i) => `
                        <div class="option-row" style="flex-wrap:nowrap; gap:8px;" data-hl-idx="${i}">
                            <input type="text" class="hl-name" value="${r.name.replace(/"/g, '&quot;')}"
                                style="flex:1; min-width:0; padding:8px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card); font-weight:500;">
                            <select class="hl-mode" style="width:110px; flex-shrink:0; padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card);">
                                <option value="base" ${r.mode === 'base' ? 'selected' : ''}>Своя база</option>
                                <option value="addon" ${r.mode === 'addon' ? 'selected' : ''}>Доплата</option>
                            </select>
                            <input type="number" class="hl-price" value="${r.price}" style="width:90px; flex-shrink:0; padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card); text-align:center;">
                            <button class="btn btn-secondary hl-del" style="flex-shrink:0; width:34px; padding:6px 0; font-size:12px; border-color:#e74c3c; color:#e74c3c; justify-content:center;">✕</button>
                        </div>
                    `).join('')}
                </div>
                <div style="display:flex; gap:8px; margin-top:14px;">
                    <button class="btn btn-secondary" id="btnHlAddRow" style="font-size:12px;">+ Добавить материал</button>
                    <button class="btn btn-primary" id="btnHlSave" style="font-size:12px;">Сохранить</button>
                </div>
            `;
            document.getElementById('btnHlAddRow').addEventListener('click', () => {
                hl.materials.push({ id: 'ext_hl_custom_' + Date.now(), name: 'Новый материал', mode: 'addon', price: 0 });
                renderExteriorPanel();
            });
            matList.querySelectorAll('.hl-del').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.closest('[data-hl-idx]').getAttribute('data-hl-idx'));
                    if (hl.materials.length <= 1) { alert('Должен остаться хотя бы один материал.'); return; }
                    if (confirm('Удалить этот материал?')) { hl.materials.splice(idx, 1); renderExteriorPanel(); }
                });
            });
            document.getElementById('btnHlSave').addEventListener('click', () => {
                hl.noInsRate = parseFloat(document.getElementById('hlNoInsRate').value) || 0;
                hl.cheapBaseRate = parseFloat(document.getElementById('hlCheapBaseRate').value) || 0;
                matList.querySelectorAll('[data-hl-idx]').forEach(row => {
                    const idx = parseInt(row.getAttribute('data-hl-idx'));
                    hl.materials[idx].name = row.querySelector('.hl-name').value.trim() || 'Материал';
                    hl.materials[idx].mode = row.querySelector('.hl-mode').value;
                    hl.materials[idx].price = parseFloat(row.querySelector('.hl-price').value) || 0;
                });
                saveMaterialsDraft();
                renderModelUI();
                alert('Сохранено.');
            });

        } else {
            // Бытовка / Хозблок — простой список, как внутренняя отделка
            const items = getExteriorSimpleOptions(cat);
            if (items.length === 0) {
                matList.innerHTML = `<p style="color:var(--text-muted); font-size:13px;">Пока нет позиций для этой категории.</p>`;
                return;
            }
            matList.innerHTML = items.map(r => `
                <div class="option-row" style="justify-content: space-between;" data-mat-id="${r.id}">
                    <div>
                        <div style="font-weight:600;">${r.name}</div>
                        <div style="font-size:12px; color:var(--text-muted);">${r.price > 0 ? r.price.toLocaleString('ru-RU') + ' р/м²' : 'без доплаты (базовая)'}</div>
                    </div>
                    <div style="display:flex; gap:6px;">
                        <button class="btn btn-secondary mat-edit-btn" style="padding:4px 10px; font-size:12px;">Изменить</button>
                        <button class="btn btn-secondary mat-del-btn" style="padding:4px 10px; font-size:12px; border-color:#e74c3c; color:#e74c3c;">Удалить</button>
                    </div>
                </div>
            `).join('');
            matList.querySelectorAll('.mat-edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('[data-mat-id]').getAttribute('data-mat-id');
                    openMatForm(id);
                });
            });
            matList.querySelectorAll('.mat-del-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('[data-mat-id]').getAttribute('data-mat-id');
                    const rec = getExteriorSimpleRecord(id);
                    if (rec && confirm(`Удалить позицию "${rec.name}"?`)) {
                        MATERIALS.exterior.simple = MATERIALS.exterior.simple.filter(r => r.id !== id);
                        saveMaterialsDraft();
                        renderExteriorPanel();
                        renderModelUI();
                    }
                });
            });
        }
    }

    const INSULATION_FIELDS = [
        { key: 'rate_ins_100', label: 'Утепление 100 мм баз. плита (по формуле)', def: 450 },
        { key: 'rate_ins_100_min_wool', label: 'Утепление 100 мм мин. вата (бытовка)', def: 0 },
        { key: 'rate_cabin_no_ins', label: 'Бытовка без утепления, база р/м²', def: 7500 },
        { key: 'rate_ins_150', label: 'Утепление 150 мм баз. плита', def: 3700 },
        { key: 'rate_ins_200', label: 'Утепление 200 мм баз. плита', def: 5600 },
        { key: 'rate_ins_mix', label: 'Утепление MIX (каркас 50/100)', def: 450 },
        { key: 'premium_frame_150_hk', label: 'Надбавка каркас 50/150 ХК', def: 2500 },
        { key: 'premium_frame_200_hk', label: 'Надбавка каркас 50/200 ХК', def: 4000 },
        { key: 'premium_frame_100_kd', label: 'Надбавка каркас 50/100 «камерная сушка»', def: 2000 },
        { key: 'premium_frame_150_kd', label: 'Надбавка каркас 50/150 «камерная сушка»', def: 4500 },
        { key: 'premium_frame_200_kd', label: 'Надбавка каркас 50/200 «камерная сушка»', def: 6000 },
        { key: 'rate_kd_150_real', label: 'Каркас 50/150 КС + утепление 150мм', def: 5700 },
        { key: 'rate_kd_200_real', label: 'Каркас 50/200 КС + утепление 200мм', def: 7600 },
        { key: 'price_frame_upgrade_normal', label: 'Замена каркаса 50/100→50/150 (с утеплением)', def: 2000 },
        { key: 'price_frame_upgrade_no_ins', label: 'Замена каркаса 50/100→50/150 (без утепления)', def: 2500 },
        { key: 'price_wall_raise_100', label: 'Поднятие стен +20см, каркас 50/100', def: 700 },
        { key: 'price_wall_raise_150', label: 'Поднятие стен +20см, каркас 50/150', def: 1000 },
        { key: 'price_wall_raise_200', label: 'Поднятие стен +20см, каркас 50/200', def: 1400 },
        { key: 'rate_svesy', label: 'Свесы на кровле, за каждые +10 см (× периметр дома+веранды)', def: 1000 }
    ];

    function renderInsulationPanel() {
        matList.innerHTML = `
            <div style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">
                Ставки и надбавки для утепления и связанных доп.опций — общие на дом высокий и дом низкий.
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                ${INSULATION_FIELDS.map(f => `
                    <div class="option-row" style="flex-wrap:nowrap; gap:8px;" data-ins-key="${f.key}">
                        <div style="flex:1; font-weight:500; font-size:13.5px;">${f.label}</div>
                        <input type="number" class="ins-field" data-key="${f.key}" value="${customRates[f.key] != null ? customRates[f.key] : f.def}"
                            style="width:100px; flex-shrink:0; padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-card); text-align:center;">
                        <span style="width:44px; flex-shrink:0; font-size:12px; color:var(--text-muted);">р/м²</span>
                    </div>
                `).join('')}
            </div>
            <div style="display:flex; gap:8px; margin-top:14px;">
                <button class="btn btn-primary" id="btnInsSave" style="font-size:12px;">Сохранить</button>
            </div>
        `;
        document.getElementById('btnInsSave').addEventListener('click', () => {
            matList.querySelectorAll('.ins-field').forEach(input => {
                const key = input.getAttribute('data-key');
                customRates[key] = parseFloat(input.value) || 0;
            });
            localStorage.setItem('mobistroy_custom_rates', JSON.stringify(customRates));
            renderModelUI();
            alert('Сохранено.');
        });
    }

    function openMatForm(editId) {
        matEditingId = editId || null;
        const rec = matEditingId ? getMatArray().find(r => r.id === matEditingId) : null;
        const preselectedCats = rec ? rec.categories : [matCategoryFilter.value];
        const isAdd = matActiveTab === 'additions';

        matAddForm.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:10px;">
                <div>
                    <label style="font-weight:600; font-size:13px;">Название</label>
                    <input type="text" id="matFieldName" value="${rec ? rec.name.replace(/"/g, '&quot;') : ''}"
                        style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border-color,#ccc); margin-top:4px;">
                </div>
                <div>
                    <label style="font-weight:600; font-size:13px;">Цена, р.${isAdd ? '' : '/м² (0 — без доплаты / базовая)'}</label>
                    <input type="number" id="matFieldPrice" value="${rec ? rec.price : 0}" min="0" step="10"
                        style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border-color,#ccc); margin-top:4px;">
                    ${isAdd ? `<div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Используется, если не задана разная цена по категориям ниже (или для категорий без своего значения).</div>` : ''}
                </div>
                ${isAdd ? `
                <div>
                    <label style="display:flex; align-items:center; gap:6px; font-size:13px; cursor:pointer;">
                        <input type="checkbox" id="matFieldPerCatToggle" ${rec && rec.pricesByCategory ? 'checked' : ''}>
                        Разная цена по категориям
                    </label>
                    <div id="matPerCatPriceWrap" style="display:${rec && rec.pricesByCategory ? 'flex' : 'none'}; flex-direction:column; gap:6px; margin-top:8px;">
                        ${ALL_CATEGORIES.map(c => `
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="width:110px; font-size:13px;">${c.label}:</span>
                                <input type="number" class="matFieldCatPrice" data-cat="${c.id}" min="0" step="10"
                                    value="${rec && rec.pricesByCategory && rec.pricesByCategory[c.id] != null ? rec.pricesByCategory[c.id] : ''}"
                                    placeholder="как в общей цене"
                                    style="flex:1; padding:6px 8px; border-radius:6px; border:1px solid var(--border-color,#ccc);">
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                ${isAdd ? `
                <div>
                    <label style="font-weight:600; font-size:13px;">Единица измерения</label>
                    <select id="matFieldUnit" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border-color,#ccc); margin-top:4px;">
                        <option value="quantity" ${rec && rec.unit === 'quantity' ? 'selected' : ''}>За штуку</option>
                        <option value="area" ${rec && rec.unit === 'area' ? 'selected' : ''}>За м²</option>
                    </select>
                </div>
                <div>
                    <label style="font-weight:600; font-size:13px;">Группа (вкладка в доп.опциях)</label>
                    <select id="matFieldGroup" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border-color,#ccc); margin-top:4px;">
                        ${ALL_GROUPS.map(g => `<option value="${g.id}" ${rec && rec.group === g.id ? 'selected' : (!rec && matGroupFilter.value === g.id ? 'selected' : '')}>${g.label}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label style="font-weight:600; font-size:13px;">Подсказка площади (кликабельная ссылка "Подставить")</label>
                    <select id="matFieldHint" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border-color,#ccc); margin-top:4px;">
                        ${ALL_HINTS.map(h => `<option value="${h.id}" ${rec && rec.hint === h.id ? 'selected' : (!rec && h.id === 'none' ? 'selected' : '')}>${h.label}</option>`).join('')}
                    </select>
                </div>
                ` : ''}
                <div>
                    <label style="font-weight:600; font-size:13px;">Показывать в категориях:</label>
                    <div style="display:flex; gap:14px; flex-wrap:wrap; margin-top:6px;">
                        ${(matActiveTab === 'exterior' ? ALL_CATEGORIES.filter(c => c.id === 'cabin' || c.id === 'hozblok') : ALL_CATEGORIES).map(c => `
                            <label style="display:flex; align-items:center; gap:5px; font-size:13px; cursor:pointer;">
                                <input type="checkbox" class="matFieldCat" value="${c.id}" ${preselectedCats.includes(c.id) ? 'checked' : ''}>
                                ${c.label}
                            </label>
                        `).join('')}
                    </div>
                </div>
                <div style="display:flex; gap:8px; justify-content:flex-end;">
                    <button class="btn btn-secondary" id="btnMatCancel" style="font-size:13px;">Отмена</button>
                    <button class="btn btn-primary" id="btnMatSave" style="font-size:13px;">${rec ? 'Сохранить' : 'Добавить'}</button>
                </div>
            </div>
        `;
        matAddForm.style.display = 'block';

        document.getElementById('btnMatCancel').addEventListener('click', closeMatForm);
        document.getElementById('btnMatSave').addEventListener('click', saveMatForm);
        const perCatToggle = document.getElementById('matFieldPerCatToggle');
        if (perCatToggle) {
            perCatToggle.addEventListener('change', () => {
                document.getElementById('matPerCatPriceWrap').style.display = perCatToggle.checked ? 'flex' : 'none';
            });
        }
    }

    function closeMatForm() {
        matAddForm.style.display = 'none';
        matAddForm.innerHTML = '';
        matEditingId = null;
    }

    function saveMatForm() {
        const name = document.getElementById('matFieldName').value.trim();
        const price = parseFloat(document.getElementById('matFieldPrice').value) || 0;
        const cats = Array.from(document.querySelectorAll('.matFieldCat:checked')).map(el => el.value);
        const isAdd = matActiveTab === 'additions';

        if (!name) { alert('Введите название позиции.'); return; }
        if (cats.length === 0) { alert('Выберите хотя бы одну категорию.'); return; }

        let pricesByCategory = null;
        if (isAdd) {
            const perCatToggle = document.getElementById('matFieldPerCatToggle');
            if (perCatToggle && perCatToggle.checked) {
                pricesByCategory = {};
                document.querySelectorAll('.matFieldCatPrice').forEach(el => {
                    const v = parseFloat(el.value);
                    if (!isNaN(v)) pricesByCategory[el.getAttribute('data-cat')] = v;
                });
                if (Object.keys(pricesByCategory).length === 0) pricesByCategory = null;
            }
        }

        if (matEditingId) {
            const rec = getMatArray().find(r => r.id === matEditingId);
            rec.name = name;
            rec.price = price;
            rec.categories = cats;
            if (isAdd) {
                rec.unit = document.getElementById('matFieldUnit').value;
                rec.group = document.getElementById('matFieldGroup').value;
                rec.hint = document.getElementById('matFieldHint').value;
                rec.pricesByCategory = pricesByCategory;
            }
        } else {
            if (isAdd) {
                const newId = 'add_custom_' + Date.now();
                MATERIALS.additions.push({
                    id: newId, name, price, categories: cats,
                    unit: document.getElementById('matFieldUnit').value,
                    group: document.getElementById('matFieldGroup').value,
                    hint: document.getElementById('matFieldHint').value,
                    pricesByCategory
                });
            } else {
                const prefix = matActiveTab === 'floor' ? 'floor_custom_' : matActiveTab === 'exterior' ? 'ext_simple_custom_' : 'int_custom_';
                const newId = prefix + Date.now();
                getMatArray().push({ id: newId, name, price, categories: cats });
            }
        }
        saveMaterialsDraft();
        if (isAdd) applyAdditionsMaterials();
        closeMatForm();
        renderMatList();
        renderModelUI();
    }

    const MAT_TAB_INFO = {
        interior: `
            <b>Внутренняя отделка</b>
            <ul>
                <li>Одна запись = один пункт в выпадающем списке (например «Вагонка ВС», «Имитация бруса»)</li>
                <li>Цена 0 = «базовая, включена» (без доплаты). Любое число больше 0 = доплата за м² к площади отделки</li>
                <li>Категории — где показывать эту позицию. Можно отметить несколько сразу (например Бытовка + Хозблок), не нужно дублировать запись</li>
                <li>Категория внизу списка выбирается автоматически как первая в списке — если хотите определённую «базовую» позицию, поставьте её первой</li>
                <li>Удаление — сразу пропадёт из выпадающего списка на сайте, у кого уже был выбран этот вариант — переключится на первый доступный</li>
            </ul>`,
        exterior: `
            <b>Наружная отделка</b>
            <ul>
                <li><b>Дом высокий</b> — каждая строка задаёт сразу ДВЕ ставки (без утепления / с утеплением). Эти числа полностью заменяют цену дома, отдельной доплаты сверху нет</li>
                <li><b>Дом низкий</b> — два поля сверху (без утепления, база для доплатных материалов) общие для всех материалов. В таблице: «Своя база» = заменяет всю цену дома, «Доплата» = добавляется сверху за площадь стен</li>
                <li><b>Бытовка / Хозблок</b> — обычный список, как у внутренней отделки: цена = доплата за м² стены</li>
                <li>Кнопка «Добавить» скрыта для Дома высокого/низкого — там строки добавляются прямо в таблице (кнопка «+ Добавить строку/материал» внизу таблицы)</li>
                <li>В доме высоком/низком должна остаться хотя бы одна строка — иначе список станет пустым</li>
            </ul>`,
        floor: `
            <b>Настил пола</b>
            <ul>
                <li>Та же логика, что у внутренней отделки: цена 0 = базовая (без доплаты), больше 0 = доплата за м²</li>
                <li>Площадь считается как дом + веранда (если веранда включена в разделе 2)</li>
                <li>Категории — можно отметить сразу несколько типов построек одной записью</li>
            </ul>`,
        insulation: `
            <b>Утепление</b>
            <ul>
                <li>Числа общие для дома высокого и дома низкого — отдельных категорий тут нет, менять и добавлять/удалять позиции нельзя, только сами ставки</li>
                <li>«Надбавка каркас» — прибавляется к базовой ставке дома (Вагонка ВС / Имитация В), которая настраивается во вкладке «Наружная отделка»</li>
                <li>«Каркас КС + утепление» — это уже готовая полная ставка за м² площади дома+веранды, а не надбавка</li>
                <li>«Замена каркаса» и «Поднятие стен» — цена доп.опций на сайте, которая сама переключается в зависимости от выбранного утепления</li>
                <li>Меняете число → «Сохранить» — подписи в выпадающем списке "Утепление" на сайте подтянут новое число автоматически</li>
            </ul>`,
        additions: `
            <b>Доп.опции</b>
            <ul>
                <li><b>Единица измерения</b> — «за штуку» (окна, двери, сваи) или «за м²» (материалы отделки)</li>
                <li><b>Группа</b> — определяет, на какой вкладке допов на сайте окажется позиция (Окна/Двери/Сваи/Отделка и полы/Прочее)</li>
                <li><b>Подсказка площади</b> — кликабельная ссылка «Подставить», которая появится у поля количества на сайте: считает площадь дома, площадь дома+веранда или периметр автоматически</li>
                <li><b>Разная цена по категориям</b> — включите, если одна и та же позиция должна стоить по-разному для дома высокого/низкого/бытовки/хозблока. Не заполненная категория берёт цену из общего поля «Цена» сверху</li>
                <li>Фильтр сверху (категория + группа) — только чтобы удобнее искать позицию, на расчёт не влияет</li>
            </ul>`
    };

    function switchMatTab(tab) {
        matActiveTab = tab;
        closeMatForm();
        document.querySelectorAll('.mat-tab-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-tab') === tab);
        });
        matGroupFilter.style.display = (tab === 'additions') ? 'inline-block' : 'none';
        matCategoryFilter.style.display = (tab === 'insulation') ? 'none' : 'inline-block';
        btnMatAddNew.style.display = (tab === 'insulation') ? 'none' : 'inline-flex';
        const titles = { interior: 'Редактирование сайта — Внутренняя отделка', exterior: 'Редактирование сайта — Наружная отделка', floor: 'Редактирование сайта — Настил пола', insulation: 'Редактирование сайта — Утепление', additions: 'Редактирование сайта — Доп.опции' };
        materialsModalTitle.textContent = titles[tab] || 'Материалы';
        const infoEl = document.getElementById('materialsInfoTooltip');
        if (infoEl) infoEl.innerHTML = MAT_TAB_INFO[tab] || '';
        renderMatList();
    }

    document.querySelectorAll('.mat-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchMatTab(btn.getAttribute('data-tab')));
    });

    if (materialsToggleBtn) {
        materialsToggleBtn.addEventListener('click', () => {
            matCategoryFilter.value = (state.calculatorMode === 'custom' && state.customType) ? state.customType : 'house_high';
            switchMatTab('interior');
            materialsModal.style.display = 'flex';
        });
    }
    if (closeMaterialsBtn) {
        closeMaterialsBtn.addEventListener('click', () => { materialsModal.style.display = 'none'; });
    }
    window.addEventListener('click', (e) => {
        if (e.target === materialsModal) materialsModal.style.display = 'none';
    });
    matCategoryFilter.addEventListener('change', () => { closeMatForm(); renderMatList(); });
    matGroupFilter.addEventListener('change', () => { closeMatForm(); renderMatList(); });
    btnMatAddNew.addEventListener('click', () => openMatForm(null));

    btnMatDownload.addEventListener('click', () => {
        const jsonContent = JSON.stringify(MATERIALS, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'materials.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    btnMatResetDrafts.addEventListener('click', async () => {
        if (confirm('Сбросить все несохранённые правки материалов и перезагрузить с сайта?')) {
            localStorage.removeItem('mobistroy_materials_draft');
            await loadMaterials();
            applyAdditionsMaterials();
            closeMatForm();
            renderMatList();
            renderModelUI();
        }
    });

    // ==================== Панель "Публикация" (сохранение materials.json на GitHub через API) ====================
    const syncToggleBtn = document.getElementById('syncToggleBtn');
    const syncModal = document.getElementById('syncModal');
    const closeSyncBtn = document.getElementById('closeSyncBtn');
    const syncOwner = document.getElementById('syncOwner');
    const syncRepo = document.getElementById('syncRepo');
    const syncBranch = document.getElementById('syncBranch');
    const syncToken = document.getElementById('syncToken');
    const syncRemember = document.getElementById('syncRemember');
    const syncStatus = document.getElementById('syncStatus');
    const btnSyncTest = document.getElementById('btnSyncTest');
    const btnSyncForget = document.getElementById('btnSyncForget');
    const btnSyncPublish = document.getElementById('btnSyncPublish');

    const SYNC_SETTINGS_KEY = 'mobistroy_sync_settings'; // owner/repo/branch — не секретные, можно хранить всегда
    const SYNC_TOKEN_KEY = 'mobistroy_sync_token';        // токен — только если явно попросили запомнить

    function loadSyncSettings() {
        try {
            const raw = localStorage.getItem(SYNC_SETTINGS_KEY);
            if (raw) {
                const s = JSON.parse(raw);
                syncOwner.value = s.owner || '';
                syncRepo.value = s.repo || '';
                syncBranch.value = s.branch || 'main';
            }
        } catch (e) { /* ignore */ }
        const savedToken = localStorage.getItem(SYNC_TOKEN_KEY);
        if (savedToken) {
            syncToken.value = savedToken;
            syncRemember.checked = true;
        }
    }

    function saveSyncSettings() {
        localStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify({
            owner: syncOwner.value.trim(),
            repo: syncRepo.value.trim(),
            branch: syncBranch.value.trim() || 'main'
        }));
        if (syncRemember.checked && syncToken.value.trim()) {
            localStorage.setItem(SYNC_TOKEN_KEY, syncToken.value.trim());
        } else if (!syncRemember.checked) {
            localStorage.removeItem(SYNC_TOKEN_KEY);
        }
    }

    function showSyncStatus(message, kind) {
        // kind: 'ok' | 'error' | 'info'
        syncStatus.style.display = 'block';
        syncStatus.textContent = message;
        const colors = {
            ok: { bg: '#d9f2e0', text: '#1e7d3c' },
            error: { bg: '#fadbd8', text: '#c0392b' },
            info: { bg: 'var(--bg-app)', text: 'var(--text-primary)' }
        };
        const c = colors[kind] || colors.info;
        syncStatus.style.background = c.bg;
        syncStatus.style.color = c.text;
    }

    function utf8ToBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    function getSyncConfig() {
        return {
            owner: syncOwner.value.trim(),
            repo: syncRepo.value.trim(),
            branch: syncBranch.value.trim() || 'main',
            token: syncToken.value.trim()
        };
    }

    async function githubApiRequest(path, options) {
        const res = await fetch(`https://api.github.com${path}`, {
            ...options,
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${getSyncConfig().token}`,
                ...(options && options.headers ? options.headers : {})
            }
        });
        return res;
    }

    if (syncToggleBtn) {
        syncToggleBtn.addEventListener('click', () => {
            loadSyncSettings();
            syncStatus.style.display = 'none';
            syncModal.style.display = 'flex';
        });
    }
    if (closeSyncBtn) {
        closeSyncBtn.addEventListener('click', () => { syncModal.style.display = 'none'; });
    }
    window.addEventListener('click', (e) => {
        if (e.target === syncModal) syncModal.style.display = 'none';
    });

    btnSyncForget.addEventListener('click', () => {
        localStorage.removeItem(SYNC_TOKEN_KEY);
        syncToken.value = '';
        syncRemember.checked = false;
        showSyncStatus('Токен забыт (удалён из этого браузера).', 'info');
    });

    btnSyncTest.addEventListener('click', async () => {
        const cfg = getSyncConfig();
        if (!cfg.owner || !cfg.repo || !cfg.token) {
            showSyncStatus('Заполните владельца, репозиторий и токен.', 'error');
            return;
        }
        showSyncStatus('Проверяю подключение...', 'info');
        try {
            const res = await githubApiRequest(`/repos/${cfg.owner}/${cfg.repo}`, { method: 'GET' });
            if (res.status === 401 || res.status === 403) {
                showSyncStatus('Токен неверный или не хватает прав (нужно право "repo").', 'error');
                return;
            }
            if (res.status === 404) {
                showSyncStatus('Репозиторий не найден — проверьте владельца и название.', 'error');
                return;
            }
            if (!res.ok) {
                showSyncStatus(`Ошибка GitHub: ${res.status}`, 'error');
                return;
            }
            const data = await res.json();
            showSyncStatus(`Подключение работает: репозиторий "${data.full_name}" найден.`, 'ok');
            saveSyncSettings();
        } catch (e) {
            showSyncStatus('Не удалось связаться с GitHub: ' + e.message, 'error');
        }
    });

    btnSyncPublish.addEventListener('click', async () => {
        const cfg = getSyncConfig();
        if (!cfg.owner || !cfg.repo || !cfg.token) {
            showSyncStatus('Заполните владельца, репозиторий и токен.', 'error');
            return;
        }
        if (!confirm('Опубликовать materials.json на GitHub? Изменения станут видны всем посетителям сайта.')) return;

        showSyncStatus('Публикую...', 'info');
        btnSyncPublish.disabled = true;
        try {
            const filePath = 'materials.json';
            const content = JSON.stringify(MATERIALS, null, 2);

            // 1. Узнаём текущий sha файла (обязательно для обновления существующего файла)
            let sha = null;
            const getRes = await githubApiRequest(
                `/repos/${cfg.owner}/${cfg.repo}/contents/${filePath}?ref=${encodeURIComponent(cfg.branch)}`,
                { method: 'GET' }
            );
            if (getRes.ok) {
                const getData = await getRes.json();
                sha = getData.sha;
            } else if (getRes.status !== 404) {
                const errData = await getRes.json().catch(() => ({}));
                throw new Error(errData.message || `Не удалось прочитать текущий файл (${getRes.status})`);
            }

            // 2. Публикуем (создаём или обновляем)
            const putRes = await githubApiRequest(`/repos/${cfg.owner}/${cfg.repo}/contents/${filePath}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Обновление materials.json из админ-панели (${new Date().toLocaleString('ru-RU')})`,
                    content: utf8ToBase64(content),
                    branch: cfg.branch,
                    ...(sha ? { sha } : {})
                })
            });

            if (!putRes.ok) {
                const errData = await putRes.json().catch(() => ({}));
                throw new Error(errData.message || `Ошибка публикации (${putRes.status})`);
            }

            saveSyncSettings();
            showSyncStatus('Готово! materials.json опубликован — изменения появятся на сайте у всех посетителей в течение пары минут.', 'ok');
        } catch (e) {
            showSyncStatus('Не удалось опубликовать: ' + e.message, 'error');
        } finally {
            btnSyncPublish.disabled = false;
        }
    });

    // Общая функция публикации произвольного JSON-файла на GitHub (переиспользуется и для materials.json, и для staff.json)
    async function publishJsonFileToGitHub(filePath, jsonObject, commitLabel) {
        const cfg = getSyncConfig();
        if (!cfg.owner || !cfg.repo || !cfg.token) {
            throw new Error('Заполните владельца, репозиторий и токен во вкладке "Публикация".');
        }
        const content = JSON.stringify(jsonObject, null, 2);

        let sha = null;
        const getRes = await githubApiRequest(
            `/repos/${cfg.owner}/${cfg.repo}/contents/${filePath}?ref=${encodeURIComponent(cfg.branch)}`,
            { method: 'GET' }
        );
        if (getRes.ok) {
            const getData = await getRes.json();
            sha = getData.sha;
        } else if (getRes.status !== 404) {
            const errData = await getRes.json().catch(() => ({}));
            throw new Error(errData.message || `Не удалось прочитать текущий файл (${getRes.status})`);
        }

        const putRes = await githubApiRequest(`/repos/${cfg.owner}/${cfg.repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `${commitLabel} (${new Date().toLocaleString('ru-RU')})`,
                content: utf8ToBase64(content),
                branch: cfg.branch,
                ...(sha ? { sha } : {})
            })
        });
        if (!putRes.ok) {
            const errData = await putRes.json().catch(() => ({}));
            throw new Error(errData.message || `Ошибка публикации (${putRes.status})`);
        }
        saveSyncSettings();
    }

    // ==================== Панель "Сотрудники" (доступ в гостевую часть по логину/паролю) ====================
    const staffToggleBtn = document.getElementById('staffToggleBtn');
    const staffModal = document.getElementById('staffModal');
    const closeStaffBtn = document.getElementById('closeStaffBtn');
    const staffList = document.getElementById('staffList');
    const staffAddForm = document.getElementById('staffAddForm');
    const btnStaffAddNew = document.getElementById('btnStaffAddNew');
    const btnStaffDownload = document.getElementById('btnStaffDownload');
    const btnStaffPublish = document.getElementById('btnStaffPublish');

    function renderStaffList() {
        const employees = window.STAFF_API.getList();
        if (employees.length === 0) {
            staffList.innerHTML = `<p style="color:var(--text-muted); font-size:13px;">Сотрудников пока нет.</p>`;
            return;
        }
        staffList.innerHTML = employees.map(s => `
            <div class="option-row" style="justify-content: space-between;" data-staff-id="${s.id}">
                <div style="font-weight:600;">${s.name}</div>
                <button class="btn btn-secondary staff-del-btn" style="padding:4px 10px; font-size:12px; border-color:#e74c3c; color:#e74c3c;">Удалить</button>
            </div>
        `).join('');
        staffList.querySelectorAll('.staff-del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('[data-staff-id]').getAttribute('data-staff-id');
                const rec = window.STAFF_API.getList().find(s => s.id === id);
                if (rec && confirm(`Удалить доступ у сотрудника "${rec.name}"? Он больше не сможет войти на сайт.`)) {
                    window.STAFF_API.setList(window.STAFF_API.getList().filter(s => s.id !== id));
                    window.STAFF_API.saveDraft();
                    renderStaffList();
                }
            });
        });
    }

    function openStaffForm() {
        staffAddForm.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:10px;">
                <div>
                    <label style="font-weight:600; font-size:13px;">Имя сотрудника</label>
                    <input type="text" id="staffFieldName" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border-color,#ccc); margin-top:4px;">
                </div>
                <div>
                    <label style="font-weight:600; font-size:13px;">Логин</label>
                    <input type="text" id="staffFieldLogin" autocomplete="off" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border-color,#ccc); margin-top:4px;">
                </div>
                <div>
                    <label style="font-weight:600; font-size:13px;">Пароль</label>
                    <input type="password" id="staffFieldPassword" autocomplete="new-password" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border-color,#ccc); margin-top:4px;">
                </div>
                <div style="font-size:12px; color:var(--text-muted);">Пароль сохранится только в виде хэша — потом посмотреть его будет нельзя, только задать новый (удалить сотрудника и добавить заново).</div>
                <div style="display:flex; gap:8px; justify-content:flex-end;">
                    <button class="btn btn-secondary" id="btnStaffCancel" style="font-size:13px;">Отмена</button>
                    <button class="btn btn-primary" id="btnStaffSave" style="font-size:13px;">Добавить</button>
                </div>
            </div>
        `;
        staffAddForm.style.display = 'block';
        document.getElementById('btnStaffCancel').addEventListener('click', closeStaffForm);
        document.getElementById('btnStaffSave').addEventListener('click', saveStaffForm);
    }

    function closeStaffForm() {
        staffAddForm.style.display = 'none';
        staffAddForm.innerHTML = '';
    }

    async function saveStaffForm() {
        const name = document.getElementById('staffFieldName').value.trim();
        const login = document.getElementById('staffFieldLogin').value.trim();
        const password = document.getElementById('staffFieldPassword').value;

        if (!name || !login || !password) {
            alert('Заполните имя, логин и пароль.');
            return;
        }
        if (window.STAFF_API.getList().some(s => s.loginLower === login.toLowerCase())) {
            alert('Такой логин уже используется другим сотрудником.');
            return;
        }

        const loginHash = await window.sha256ForAuth(login);
        const passHash = await window.sha256ForAuth(password);

        window.STAFF_API.setList([
            ...window.STAFF_API.getList(),
            { id: 'staff_' + Date.now(), name, loginLower: login.toLowerCase(), loginHash, passHash }
        ]);
        window.STAFF_API.saveDraft();
        closeStaffForm();
        renderStaffList();
    }

    if (staffToggleBtn) {
        staffToggleBtn.addEventListener('click', () => {
            closeStaffForm();
            renderStaffList();
            staffModal.style.display = 'flex';
        });
    }
    if (closeStaffBtn) {
        closeStaffBtn.addEventListener('click', () => { staffModal.style.display = 'none'; });
    }
    window.addEventListener('click', (e) => {
        if (e.target === staffModal) staffModal.style.display = 'none';
    });
    btnStaffAddNew.addEventListener('click', openStaffForm);

    btnStaffDownload.addEventListener('click', () => {
        const jsonContent = JSON.stringify({ employees: window.STAFF_API.getList() }, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'staff.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    btnStaffPublish.addEventListener('click', async () => {
        if (!confirm('Опубликовать список сотрудников на GitHub? Настройки подключения берутся из вкладки "Публикация" (владелец/репозиторий/токен).')) return;
        btnStaffPublish.disabled = true;
        const originalText = btnStaffPublish.textContent;
        btnStaffPublish.textContent = 'Публикую...';
        try {
            await publishJsonFileToGitHub(
                'staff.json',
                { employees: window.STAFF_API.getList() },
                'Обновление списка сотрудников из админ-панели'
            );
            alert('Готово! Список сотрудников опубликован.');
        } catch (e) {
            alert('Не удалось опубликовать: ' + e.message);
        } finally {
            btnStaffPublish.disabled = false;
            btnStaffPublish.textContent = originalText;
        }
    });

    // Delivery Slider hooks
    deliverySlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value) || 0;
        state.deliveryDistance = val;
        deliveryInput.value = val;
        calculateBill();
    });

    deliveryInput.addEventListener('change', (e) => {
        const val = Math.max(0, parseInt(e.target.value) || 0);
        state.deliveryDistance = val;
        deliverySlider.value = val;
        calculateBill();
    });

    // Predefined Mode Assembly hook
    optAssembly.addEventListener('change', (e) => {
        state.isAssemblyChecked = e.target.checked;
        calculateBill();
    });

    // Addition filter tab selections
    additionFilters.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            additionFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeAdditionFilter = btn.getAttribute('data-filter');
            renderAdditions();
        });
    });

    // Search box for additions (name filter), injected next to the filter tabs
    let additionSearchQuery = '';
    const searchWrap = document.createElement('div');
    searchWrap.style.cssText = 'position:relative; display:inline-flex; align-items:center; margin-left:auto;';
    searchWrap.innerHTML = `
        <input type="text" id="additionSearchInput" placeholder="Поиск по названию..."
            style="padding:6px 28px 6px 10px; border:1px solid var(--border-color, #ccc); border-radius:8px; font-size:13px; min-width:180px;">
        <span id="additionSearchClear" title="Очистить"
            style="position:absolute; right:8px; cursor:pointer; color:var(--text-muted, #888); font-size:14px; line-height:1; display:none;">✕</span>
    `;
    additionFilters.style.display = 'flex';
    additionFilters.style.flexWrap = 'wrap';
    additionFilters.style.alignItems = 'center';
    additionFilters.appendChild(searchWrap);

    const additionSearchInput = searchWrap.querySelector('#additionSearchInput');
    const additionSearchClear = searchWrap.querySelector('#additionSearchClear');

    additionSearchInput.addEventListener('input', (e) => {
        additionSearchQuery = e.target.value.trim().toLowerCase();
        additionSearchClear.style.display = additionSearchQuery ? 'inline' : 'none';
        renderAdditions();
    });

    additionSearchClear.addEventListener('click', () => {
        additionSearchQuery = '';
        additionSearchInput.value = '';
        additionSearchClear.style.display = 'none';
        renderAdditions();
    });

    // Sharing and Clipboard Copy actions
    btnCopyClipboard.addEventListener('click', () => {
        const report = buildReportText();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(report).then(() => {
                alert("Смета скопирована в буфер обмена!");
            }).catch(() => {
                alert("Ошибка копирования.");
            });
        }
    });


    // Standard projects rate hooks (for Kornilov House)
    document.querySelectorAll('#houseTypeList .selector-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('#houseTypeList .selector-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.houseTypeRate = parseInt(card.getAttribute('data-rate'));
            state.houseTypeHeight = parseFloat(card.getAttribute('data-height') || 2.2);
            renderModelUI();
        });
    });

    // Startup bootstrap rendering
    renderTabs();
    (async () => {
        await loadMaterials();
        applyAdditionsMaterials();
        if (activeConfig.length > 0) {
            state.selectedSizeId = activeConfig[0].sizes[0]?.id || '';
            renderModelUI();
        }
    })();
})();
